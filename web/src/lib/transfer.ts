import { PrismaClient } from "@prisma/client";
import { writeFile, readFile, unlink, mkdir, readdir, stat, rm } from "fs/promises";
import { join } from "path";
import { generateTransferCode, generateKey, encrypt, decrypt, hash } from "./crypto";

const prisma = new PrismaClient();
const UPLOAD_DIR = join(process.env.TRANSFER_DIR || "/tmp/docmaker-transfers", "chunks");
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks

export { MAX_FILE_SIZE, CHUNK_SIZE };

async function ensureDirs() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * Create a new transfer
 */
export async function createTransfer(params: {
  userId: string;
  fileName: string;
  fileSize: number;
  fileMimeType: string;
  fileBuffer: Buffer;
  retentionDays?: number;
  maxDownloads?: number;
}) {
  await ensureDirs();
  const { userId, fileName, fileSize, fileMimeType, fileBuffer, retentionDays = 1, maxDownloads = 1 } = params;

  if (fileSize > MAX_FILE_SIZE) {
    throw new Error("File exceeds 500MB limit");
  }

  // Generate encryption key and code
  const encryptionKey = generateKey();
  const code = generateTransferCode();
  const fileHash = hash(fileBuffer);

  // Create transfer record
  const transfer = await prisma.transfer.create({
    data: {
      senderId: userId,
      code,
      fileName,
      fileSize,
      fileMimeType,
      fileHash,
      encryptedKey: encryptionKey, // In production, encrypt this with user's key
      status: "pending",
      maxDownloads,
      downloadCount: 0,
      retentionDays,
      expiresAt: new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000),
    },
  });

  // Create transfer directory
  const transferDir = join(UPLOAD_DIR, transfer.id);
  await mkdir(transferDir, { recursive: true });

  // Encrypt file and split into chunks
  const encryptedBuffer = encrypt(fileBuffer, encryptionKey);
  const totalChunks = Math.ceil(encryptedBuffer.length / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, encryptedBuffer.length);
    const chunk = encryptedBuffer.subarray(start, end);

    const chunkPath = join(transferDir, `chunk_${i}`);
    await writeFile(chunkPath, chunk);

    // Record chunk in DB
    await prisma.transferChunk.create({
      data: {
        transferId: transfer.id,
        chunkIndex: i,
        filePath: chunkPath,
      },
    });
  }

  // Update status to active
  await prisma.transfer.update({
    where: { id: transfer.id },
    data: { status: "active" },
  });

  return {
    id: transfer.id,
    code,
    fileName,
    fileSize,
    totalChunks,
    expiresAt: transfer.expiresAt,
  };
}

/**
 * Verify a transfer code
 */
export async function verifyTransfer(code: string) {
  const transfer = await prisma.transfer.findUnique({
    where: { code },
    include: { chunks: { orderBy: { chunkIndex: "asc" } } },
  });

  if (!transfer) {
    throw new Error("Invalid transfer code");
  }

  if (transfer.status === "expired" || transfer.status === "deleted") {
    throw new Error("Transfer has expired or been deleted");
  }

  if (transfer.expiresAt < new Date()) {
    await prisma.transfer.update({
      where: { id: transfer.id },
      data: { status: "expired" },
    });
    throw new Error("Transfer has expired");
  }

  if (transfer.downloadCount >= transfer.maxDownloads) {
    throw new Error("Transfer has reached maximum downloads");
  }

  return {
    id: transfer.id,
    fileName: transfer.fileName,
    fileSize: transfer.fileSize,
    fileMimeType: transfer.fileMimeType,
    fileHash: transfer.fileHash,
    totalChunks: transfer.chunks.length,
    encryptedKey: transfer.encryptedKey,
    expiresAt: transfer.expiresAt,
    downloadCount: transfer.downloadCount,
    maxDownloads: transfer.maxDownloads,
  };
}

/**
 * Get a specific chunk (encrypted)
 */
export async function getChunk(transferId: string, chunkIndex: number): Promise<Buffer> {
  const chunk = await prisma.transferChunk.findFirst({
    where: { transferId, chunkIndex },
  });

  if (!chunk) {
    throw new Error(`Chunk ${chunkIndex} not found`);
  }

  return readFile(chunk.filePath);
}

/**
 * Complete a transfer download
 */
export async function completeTransfer(transferId: string) {
  const transfer = await prisma.transfer.findUnique({ where: { id: transferId } });
  if (!transfer) throw new Error("Transfer not found");

  const newCount = transfer.downloadCount + 1;
  const newStatus = newCount >= transfer.maxDownloads ? "completed" : "active";

  await prisma.transfer.update({
    where: { id: transferId },
    data: { downloadCount: newCount, status: newStatus },
  });

  // If completed, schedule cleanup
  if (newStatus === "completed") {
    // Cleanup will happen via cron or on next access
  }
}

/**
 * Delete a transfer and its files
 */
export async function deleteTransfer(transferId: string, userId?: string) {
  const transfer = await prisma.transfer.findUnique({ where: { id: transferId } });
  if (!transfer) throw new Error("Transfer not found");

  if (userId && transfer.senderId !== userId) {
    throw new Error("Not authorized to delete this transfer");
  }

  // Delete chunks from filesystem
  const transferDir = join(UPLOAD_DIR, transferId);
  await rm(transferDir, { recursive: true, force: true }).catch(() => {});

  // Delete from DB
  await prisma.transferChunk.deleteMany({ where: { transferId } });
  await prisma.transfer.update({
    where: { id: transferId },
    data: { status: "deleted" },
  });
}

/**
 * Cleanup expired transfers
 */
export async function cleanupExpiredTransfers() {
  const expired = await prisma.transfer.findMany({
    where: {
      expiresAt: { lt: new Date() },
      status: { notIn: ["deleted"] },
    },
  });

  for (const transfer of expired) {
    await deleteTransfer(transfer.id);
  }

  return expired.length;
}

/**
 * Get user's transfers
 */
export async function getUserTransfers(userId: string) {
  return prisma.transfer.findMany({
    where: { senderId: userId, status: { notIn: ["deleted"] } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
