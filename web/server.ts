import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "./src/lib/crypto";

const prisma = new PrismaClient();
const PORT = parseInt(process.env.WS_PORT || "4001");
const UPLOAD_DIR = join(process.env.TRANSFER_DIR || "/tmp/docmaker-transfers", "chunks");

interface TransferSession {
  ws: WebSocket;
  transferId: string;
  role: "sender" | "receiver";
  userId?: string;
}

const sessions = new Map<string, TransferSession>();
const transferConnections = new Map<string, Set<string>>();

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  const sessionId = generateSessionId();
  console.log(`[WS] Client connected: ${sessionId}`);

  ws.on("message", async (data: Buffer) => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case "join": {
          // Join a transfer session
          const { transferId, role, code } = msg;

          if (role === "receiver" && code) {
            // Verify code
            const transfer = await prisma.transfer.findUnique({
              where: { code: code.toUpperCase() },
            });

            if (!transfer || transfer.status !== "active") {
              ws.send(JSON.stringify({ type: "error", message: "Invalid or expired code" }));
              return;
            }

            if (transfer.downloadCount >= transfer.maxDownloads) {
              ws.send(JSON.stringify({ type: "error", message: "Transfer has reached maximum downloads" }));
              return;
            }

            if (transfer.expiresAt < new Date()) {
              ws.send(JSON.stringify({ type: "error", message: "Transfer has expired" }));
              return;
            }

            // Send transfer info to receiver
            ws.send(JSON.stringify({
              type: "ready",
              transferId: transfer.id,
              fileName: transfer.fileName,
              fileSize: transfer.fileSize,
              fileMimeType: transfer.fileMimeType,
              encryptedKey: transfer.encryptedKey,
            }));

            // Store session
            sessions.set(sessionId, { ws, transferId: transfer.id, role: "receiver" });

            // Add to transfer connections
            if (!transferConnections.has(transfer.id)) {
              transferConnections.set(transfer.id, new Set());
            }
            transferConnections.get(transfer.id)!.add(sessionId);

            // Notify sender that receiver is connected
            const senderSessions = transferConnections.get(transfer.id);
            if (senderSessions) {
              for (const sid of senderSessions) {
                const s = sessions.get(sid);
                if (s && s.role === "sender") {
                  s.ws.send(JSON.stringify({ type: "receiver_connected" }));
                }
              }
            }

            console.log(`[WS] Receiver joined transfer ${transfer.id}`);
            break;
          }

          // Sender joining
          sessions.set(sessionId, { ws, transferId, role: "sender" });

          if (!transferConnections.has(transferId)) {
            transferConnections.set(transferId, new Set());
          }
          transferConnections.get(transferId)!.add(sessionId);

          ws.send(JSON.stringify({ type: "joined", sessionId }));
          console.log(`[WS] Sender joined transfer ${transferId}`);
          break;
        }

        case "chunk": {
          const session = sessions.get(sessionId);
          if (!session) {
            ws.send(JSON.stringify({ type: "error", message: "Not in a session" }));
            return;
          }

          const { index, data: chunkData } = msg;

          // Store chunk to filesystem
          const transferDir = join(UPLOAD_DIR, session.transferId);
          await mkdir(transferDir, { recursive: true });
          const chunkPath = join(transferDir, `chunk_${index}`);
          await writeFile(chunkPath, Buffer.from(chunkData, "base64"));

          // Record in DB
          await prisma.transferChunk.create({
            data: {
              transferId: session.transferId,
              chunkIndex: index,
              filePath: chunkPath,
            },
          });

          // Notify receiver of progress
          const totalChunks = parseInt(msg.totalChunks || "1");
          const percent = Math.round(((index + 1) / totalChunks) * 100);

          const receiverSessions = transferConnections.get(session.transferId);
          if (receiverSessions) {
            for (const sid of receiverSessions) {
              const s = sessions.get(sid);
              if (s && s.role === "receiver") {
                s.ws.send(JSON.stringify({ type: "progress", percent, chunk: index }));
              }
            }
          }

          // If last chunk, notify complete
          if (index === totalChunks - 1) {
            const receiverSessions2 = transferConnections.get(session.transferId);
            if (receiverSessions2) {
              for (const sid of receiverSessions2) {
                const s = sessions.get(sid);
                if (s && s.role === "receiver") {
                  s.ws.send(JSON.stringify({ type: "upload_complete", totalChunks }));
                }
              }
            }
          }

          break;
        }

        case "request_chunks": {
          const session = sessions.get(sessionId);
          if (!session || session.role !== "receiver") {
            ws.send(JSON.stringify({ type: "error", message: "Only receivers can request chunks" }));
            return;
          }

          // Get transfer info
          const transfer = await prisma.transfer.findUnique({
            where: { id: session.transferId },
            include: { chunks: { orderBy: { chunkIndex: "asc" } } },
          });

          if (!transfer) {
            ws.send(JSON.stringify({ type: "error", message: "Transfer not found" }));
            return;
          }

          // Send encrypted key
          ws.send(JSON.stringify({
            type: "encrypted_key",
            key: transfer.encryptedKey,
            totalChunks: transfer.chunks.length,
          }));

          // Send chunks one by one
          for (const chunk of transfer.chunks) {
            const chunkData = await readFile(chunk.filePath);
            ws.send(JSON.stringify({
              type: "chunk",
              index: chunk.chunkIndex,
              data: chunkData.toString("base64"),
            }));
          }

          ws.send(JSON.stringify({ type: "download_complete" }));

          // Increment download count
          await prisma.transfer.update({
            where: { id: session.transferId },
            data: { downloadCount: { increment: 1 } },
          });

          // If max downloads reached, mark as completed
          if (transfer.downloadCount + 1 >= transfer.maxDownloads) {
            await prisma.transfer.update({
              where: { id: session.transferId },
              data: { status: "completed" },
            });
          }

          break;
        }

        case "ping": {
          ws.send(JSON.stringify({ type: "pong" }));
          break;
        }
      }
    } catch (error) {
      console.error("[WS] Message error:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
    }
  });

  ws.on("close", () => {
    const session = sessions.get(sessionId);
    if (session) {
      // Remove from transfer connections
      const connections = transferConnections.get(session.transferId);
      if (connections) {
        connections.delete(sessionId);
        if (connections.size === 0) {
          transferConnections.delete(session.transferId);
        }
      }

      // Notify other party
      if (session.role === "sender") {
        const receiverSessions = transferConnections.get(session.transferId);
        if (receiverSessions) {
          for (const sid of receiverSessions) {
            const s = sessions.get(sid);
            if (s && s.role === "receiver") {
              s.ws.send(JSON.stringify({ type: "sender_disconnected" }));
            }
          }
        }
      } else {
        const senderSessions = transferConnections.get(session.transferId);
        if (senderSessions) {
          for (const sid of senderSessions) {
            const s = sessions.get(sid);
            if (s && s.role === "sender") {
              s.ws.send(JSON.stringify({ type: "receiver_disconnected" }));
            }
          }
        }
      }

      sessions.delete(sessionId);
    }

    console.log(`[WS] Client disconnected: ${sessionId}`);
  });

  ws.on("error", (error) => {
    console.error(`[WS] Error for ${sessionId}:`, error);
  });

  // Send ping every 30s to keep alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000);
});

server.listen(PORT, () => {
  console.log(`[WS] WebSocket server running on port ${PORT}`);
});

// Cleanup expired transfers every hour
setInterval(async () => {
  try {
    const expired = await prisma.transfer.findMany({
      where: {
        expiresAt: { lt: new Date() },
        status: { notIn: ["deleted"] },
      },
    });

    for (const transfer of expired) {
      const { deleteTransfer } = await import("./src/lib/transfer");
      await deleteTransfer(transfer.id);
    }

    if (expired.length > 0) {
      console.log(`[Cleanup] Deleted ${expired.length} expired transfers`);
    }
  } catch (error) {
    console.error("[Cleanup] Error:", error);
  }
}, 60 * 60 * 1000); // Every hour
