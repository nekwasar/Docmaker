import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getKey(): Buffer {
  const secret = process.env.NEXTAUTH_SECRET || "docmaker-secret-key-change-in-production";
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(plain: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

export function decryptSecret(payload: string): string {
  const [v, ivB64, tagB64, dataB64] = payload.split(":");
  if (v !== "v1") throw new Error("Unknown encryption version");
  const key = getKey();
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return decipher.update(Buffer.from(dataB64, "base64"), undefined, "utf8") + decipher.final("utf8");
}

export function maskSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 8) return "••••••••";
  return `••••••••${value.slice(-4)}`;
}

const ENV_FALLBACK: Record<string, string | undefined> = {};

function envFallback(key: string): string | null {
  if (key === "AI_PROVIDER") return process.env.AI_PROVIDER || null;
  if (key === "AI_API_KEY") return process.env.AI_API_KEY || null;
  if (key === "AI_MODEL") return process.env.AI_MODEL || null;
  if (key === "AI_BASE_URL") return process.env.AI_BASE_URL || null;
  if (key === "GATE_THRESHOLD") return "2";
  if (key === "GATE_ENABLED") return "true";
  return ENV_FALLBACK[key] ?? null;
}

/** DB-first, env fallback. Decrypts transparently. Returns null if unset. */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await prisma.adminSetting.findUnique({ where: { key } });
    if (row) {
      // Empty string means explicitly cleared in admin (shadows env).
      if (!row.encryptedValue) return "";
      try {
        return decryptSecret(row.encryptedValue);
      } catch {
        // If stored plain (legacy seed defaults), return as-is
        return row.encryptedValue;
      }
    }
  } catch {}
  return envFallback(key);
}

export async function setSetting(key: string, plainValue: string, updatedBy?: string) {
  const encryptedValue = plainValue ? encryptSecret(plainValue) : "";
  await prisma.adminSetting.upsert({
    where: { key },
    create: { key, encryptedValue, updatedBy },
    update: { encryptedValue, updatedBy },
  });
}
