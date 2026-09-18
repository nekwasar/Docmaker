import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

async function resolveUser(): Promise<AdminUser | null> {
  // 1. Try NextAuth session (credentials provider)
  try {
    const s: any = await (auth as any)();
    const id = s?.user?.id;
    if (id) {
      const u = await prisma.user.findUnique({ where: { id } });
      if (u) return { id: u.id, email: u.email, name: u.name, role: u.role };
    }
  } catch {}
  // 2. Fallback to custom jose session cookie (used by most app routes)
  try {
    const sess = await getSession();
    if (sess?.id) {
      const u = await prisma.user.findUnique({ where: { id: sess.id } });
      if (u) return { id: u.id, email: u.email, name: u.name, role: u.role };
    }
  } catch {}
  return null;
}

export async function audit(action: string, adminUserId: string | null, details?: any) {
  try {
    await prisma.adminAuditLog.create({
      data: { adminUserId: adminUserId ?? "anonymous", action, details: details ?? {} },
    });
  } catch {}
}

/** For API routes: returns admin user or Response(401/403). Logs denials. */
export async function requireAdmin(): Promise<{ user: AdminUser } | { response: Response }> {
  const user = await resolveUser();
  if (!user) {
    await audit("admin.denied.unauthenticated", null, {});
    return {
      response: Response.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  if (user.role !== "admin") {
    await audit("admin.denied.forbidden", user.id, { email: user.email });
    return {
      response: Response.json({ error: "Admin access required" }, { status: 403 }),
    };
  }
  return { user };
}

/** For server components/layouts: returns admin user or null (caller redirects). */
export async function requireAdminPage(): Promise<AdminUser | null> {
  const user = await resolveUser();
  if (!user || user.role !== "admin") {
    if (user) await audit("admin.denied.page", user.id, { email: user.email });
    return null;
  }
  return user;
}
