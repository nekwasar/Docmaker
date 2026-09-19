import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

function roleRank(role: string): number {
  return ["free", "pro", "mod", "admin", "super-admin"].indexOf(role);
}

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@docmaker.io";
  const password = process.env.ADMIN_PASSWORD || "change-me-on-first-login";

  let admin = await prisma.user.findUnique({ where: { email } });
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await prisma.user.create({
      data: { email, name: "Admin", passwordHash, role: "super-admin" },
    });
    console.log(`Seeded super-admin user ${email}`);
  } else {
    const updates: Record<string, string> = {};
    if (roleRank(admin.role) < roleRank("super-admin")) {
      updates.role = "super-admin";
      console.log(`Promoted ${email} to super-admin`);
    }
    if (!admin.passwordHash) {
      updates.passwordHash = await bcrypt.hash(password, 10);
      console.log(`Backfilled missing password for ${email}`);
    }
    if (Object.keys(updates).length > 0) {
      admin = await prisma.user.update({ where: { email }, data: updates });
      console.log(`Updated ${email}: ${Object.keys(updates).join(", ")}`);
    } else {
      console.log(`Admin ${email} already exists`);
    }
  }

  const defaults: Array<[string, string]> = [
    ["GATE_THRESHOLD", "2"],
    ["GATE_ENABLED", "true"],
  ];
  for (const [key, value] of defaults) {
    const existing = await prisma.adminSetting.findUnique({ where: { key } });
    if (!existing) {
      // Store gate defaults plain (not secrets) — settings.ts decrypt falls back to plain.
      await prisma.adminSetting.create({
        data: { key, encryptedValue: value, updatedBy: admin.id },
      });
      console.log(`Seeded setting ${key}=${value}`);
    }
  }

  await prisma.adminAuditLog.create({
    data: { adminUserId: admin.id, action: "admin.seed", details: { email } },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
