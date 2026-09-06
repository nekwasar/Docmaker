// Client-side encryption using Web Crypto API (browser)

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

/**
 * Import a hex-encoded key as CryptoKey
 */
async function importKey(hexKey: string): Promise<CryptoKey> {
  const keyBytes = new Uint8Array(
    hexKey.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a chunk with AES-256-GCM
 */
export async function encryptChunk(
  data: ArrayBuffer,
  hexKey: string
): Promise<ArrayBuffer> {
  const key = await importKey(hexKey);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  // Prepend IV to encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);

  return result.buffer;
}

/**
 * Decrypt a chunk with AES-256-GCM
 */
export async function decryptChunk(
  encryptedData: ArrayBuffer,
  hexKey: string
): Promise<ArrayBuffer> {
  const key = await importKey(hexKey);
  const data = new Uint8Array(encryptedData);

  const iv = data.slice(0, IV_LENGTH);
  const encrypted = data.slice(IV_LENGTH);

  return crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  );
}

/**
 * Encrypt a full file in chunks
 */
export async function encryptFile(
  file: File,
  hexKey: string,
  onProgress?: (percent: number) => void
): Promise<{ chunks: ArrayBuffer[]; totalChunks: number }> {
  const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const chunks: ArrayBuffer[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = await file.slice(start, end).arrayBuffer();

    const encrypted = await encryptChunk(chunk, hexKey);
    chunks.push(encrypted);

    onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
  }

  return { chunks, totalChunks };
}

/**
 * Hash a file with SHA-256
 */
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
