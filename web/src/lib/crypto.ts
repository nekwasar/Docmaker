import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";
import { promisify } from "util";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const AUTH_TAG_LENGTH = 16;

/**
 * Generate a random AES-256 key
 */
export function generateKey(): string {
  return randomBytes(KEY_LENGTH).toString("hex");
}

/**
 * Generate a random 6-char transfer code
 */
export function generateTransferCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

/**
 * Encrypt data with AES-256-GCM
 */
export function encrypt(data: Buffer, keyHex: string): Buffer {
  const key = Buffer.from(keyHex, "hex");
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Format: IV (12) + AuthTag (16) + Encrypted Data
  return Buffer.concat([iv, authTag, encrypted]);
}

/**
 * Decrypt data with AES-256-GCM
 */
export function decrypt(encryptedData: Buffer, keyHex: string): Buffer {
  const key = Buffer.from(keyHex, "hex");
  const iv = encryptedData.subarray(0, IV_LENGTH);
  const authTag = encryptedData.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const data = encryptedData.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

/**
 * Hash a string with SHA-256
 */
export function hash(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

/**
 * Generate a random UUID
 */
export function generateId(): string {
  return randomBytes(16).toString("hex");
}
