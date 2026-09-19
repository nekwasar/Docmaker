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

// Role hierarchy: free < pro < mod < admin < super-admin.
// Area access (view admin): mod and above.
// Mutations (settings, users, purge, subscriber changes): admin and above.
export const ROLES = ["free", "pro", "mod", "admin", "super-admin"] as const;

export function roleRank(role: string): number {
  const i = (ROLES as readonly string[]).indexOf(role);
  return i === -1 ? -1 : i;
}

export function roleLabel(role: string): string {
  return role === "super-admin" ? "SUPER ADMIN" : role.toUpperCase();
}

export function canAccessAdmin(role: string): boolean {
  return roleRank(role) >= roleRank("mod");
}

export function canMutateAdmin(role: string): boolean {
  return roleRank(role) >= roleRank("admin");
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

/** For API routes (reads): mod and above. Logs denials. */
export async function requireAdmin(): Promise<{ user: AdminUser } | { response: Response }> {
  const user = await resolveUser();
  if (!user) {
    await audit("admin.denied.unauthenticated", null, {});
    return {
      response: Response.json({ error: "Authentication required" }, { status: 401 }),
    };
  }
  if (!canAccessAdmin(user.role)) {
    await audit("admin.denied.forbidden", user.id, { email: user.email, role: user.role });
    return {
      response: Response.json({ error: "Admin access required" }, { status: 403 }),
    };
  }
  return { user };
}

/** For API routes (mutations): admin and above. Logs denials. */
export async function requireAdminWrite(): Promise<{ user: AdminUser } | { response: Response }> {
  const gate = await requireAdmin();
  if ("response" in gate) return gate;
  if (!canMutateAdmin(gate.user.role)) {
    await audit("admin.denied.write", gate.user.id, { email: gate.user.email, role: gate.user.role });
    return {
      response: Response.json({ error: "Admin role required for this action" }, { status: 403 }),
    };
  }
  return gate;
}

/** For server components/layouts: returns admin user or null (caller redirects). */
export async function requireAdminPage(): Promise<AdminUser | null> {
  const user = await resolveUser();
  if (!user || !canAccessAdmin(user.role)) {
    if (user) await audit("admin.denied.page", user.id, { email: user.email, role: user.role });
    return null;
  }
  return user;
}
