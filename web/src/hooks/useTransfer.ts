"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { encryptFile, decryptChunk, hashFile } from "@/lib/client-crypto";

interface TransferProgress {
  phase: "idle" | "encrypting" | "uploading" | "waiting" | "downloading" | "decrypting" | "complete" | "error";
  percent: number;
  message?: string;
}

interface TransferInfo {
  id: string;
  code: string;
  fileName: string;
  fileSize: number;
  totalChunks: number;
  expiresAt: string;
}

/**
 * Hook for sending files
 */
export function useSendTransfer() {
  const [progress, setProgress] = useState<TransferProgress>({ phase: "idle", percent: 0 });
  const [transferInfo, setTransferInfo] = useState<TransferInfo | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const sendFile = useCallback(async (file: File, retentionDays: number, maxDownloads: number) => {
    try {
      setProgress({ phase: "encrypting", percent: 0, message: "Encrypting file..." });

      // Step 1: Create transfer on server
      const formData = new FormData();
      formData.append("file", file);
      formData.append("retentionDays", String(retentionDays));
      formData.append("maxDownloads", String(maxDownloads));

      const res = await fetch("/api/transfer/create", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create transfer");
      }

      const data: TransferInfo = await res.json();
      setTransferInfo(data);

      // Step 2: Connect to WebSocket
      const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.hostname}:4001`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "join", transferId: data.id, role: "sender" }));
          resolve();
        };
        ws.onerror = () => reject(new Error("WebSocket connection failed"));
      });

      setProgress({ phase: "uploading", percent: 0, message: "Uploading encrypted chunks..." });

      // Step 3: Encrypt file and upload chunks
      const encryptionKey = data.id.replace(/-/g, "").substring(0, 32); // Simple key derivation
      const { chunks, totalChunks } = await encryptFile(file, encryptionKey, (percent) => {
        setProgress((prev) => ({ ...prev, percent: Math.round(percent * 0.3) })); // 30% for encryption
      });

      for (let i = 0; i < chunks.length; i++) {
        const chunkBase64 = btoa(String.fromCharCode(...new Uint8Array(chunks[i])));

        ws.send(JSON.stringify({
          type: "chunk",
          index: i,
          data: chunkBase64,
          totalChunks: String(totalChunks),
        }));

        setProgress({
          phase: "uploading",
          percent: 30 + Math.round(((i + 1) / totalChunks) * 70),
          message: `Uploading chunk ${i + 1}/${totalChunks}...`,
        });
      }

      setProgress({ phase: "complete", percent: 100, message: "Transfer ready!" });
      ws.close();
    } catch (error: any) {
      setProgress({ phase: "error", percent: 0, message: error.message });
      throw error;
    }
  }, []);

  const cleanup = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  return { progress, transferInfo, sendFile, cleanup };
}

/**
 * Hook for receiving files
 */
export function useReceiveTransfer() {
  const [progress, setProgress] = useState<TransferProgress>({ phase: "idle", percent: 0 });
  const [fileInfo, setFileInfo] = useState<{ fileName: string; fileSize: number } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const receiveFile = useCallback(async (code: string) => {
    try {
      setProgress({ phase: "waiting", percent: 0, message: "Connecting to transfer..." });

      // Step 1: Verify code
      const verifyRes = await fetch("/api/transfer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error || "Invalid code");
      }

      const transferInfo = await verifyRes.json();
      setFileInfo({ fileName: transferInfo.fileName, fileSize: transferInfo.fileSize });

      // Step 2: Connect to WebSocket
      const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.hostname}:4001`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "join", role: "receiver", code }));
          resolve();
        };
        ws.onerror = () => reject(new Error("WebSocket connection failed"));
      });

      // Step 3: Wait for chunks
      return new Promise<void>((resolve, reject) => {
        const chunks: ArrayBuffer[] = [];
        let totalChunks = 0;
        let encryptionKey = "";

        ws.onmessage = async (event) => {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case "encrypted_key":
              encryptionKey = msg.key;
              totalChunks = msg.totalChunks;
              ws.send(JSON.stringify({ type: "request_chunks" }));
              break;

            case "chunk": {
              // Decode base64 chunk
              const binaryStr = atob(msg.data);
              const bytes = new Uint8Array(binaryStr.length);
              for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }

              // Decrypt chunk
              const decrypted = await decryptChunk(bytes.buffer, encryptionKey);
              chunks.push(decrypted);

              setProgress({
                phase: "downloading",
                percent: Math.round(((msg.index + 1) / totalChunks) * 100),
                message: `Downloading chunk ${msg.index + 1}/${totalChunks}...`,
              });
              break;
            }

            case "download_complete": {
              // Step 4: Assemble and download file
              setProgress({ phase: "decrypting", percent: 0, message: "Assembling file..." });

              const totalSize = chunks.reduce((acc, c) => acc + c.byteLength, 0);
              const assembled = new Uint8Array(totalSize);
              let offset = 0;
              for (const chunk of chunks) {
                assembled.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
              }

              // Create download
              const blob = new Blob([assembled]);
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = transferInfo.fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);

              // Step 5: Notify server download complete
              await fetch("/api/transfer/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transferId: transferInfo.id }),
              });

              setProgress({ phase: "complete", percent: 100, message: "Download complete!" });
              ws.close();
              resolve();
              break;
            }

            case "error":
              setProgress({ phase: "error", percent: 0, message: msg.message });
              reject(new Error(msg.message));
              break;
          }
        };

        ws.onerror = () => {
          setProgress({ phase: "error", percent: 0, message: "Connection lost" });
          reject(new Error("Connection lost"));
        };
      });
    } catch (error: any) {
      setProgress({ phase: "error", percent: 0, message: error.message });
      throw error;
    }
  }, []);

  const cleanup = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  return { progress, fileInfo, receiveFile, cleanup };
}
