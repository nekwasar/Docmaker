import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin";
import { getSession } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  if (!admin) {
    // Anonymous (should already be caught by middleware) → signup.
    const sess = await getSession().catch(() => null);
    if (!sess) redirect("/signup?next=/admin");
    // Logged-in non-admin → 403 forbidden UI (a redirect("/") from a
    // layout does not reliably produce a 307, so render instead).
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-[10px] border border-[#E2E8F0] bg-white p-6 text-center">
          <p className="text-[15px] font-semibold text-[#0F172A]">Admin access required</p>
          <p className="mt-1 text-[12px] text-[#64748B]">
            Signed in as {sess.email} — this account is not an admin.
          </p>
          <a
            href="/"
            className="mt-4 flex w-full items-center justify-center rounded-[6px] bg-[#0F172A] py-2.5 text-[13px] font-semibold text-white hover:bg-black"
          >
            Back to site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold tracking-tight text-[#0F172A]">Docmaker Admin</span>
            <span className="rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-medium text-[#475569]">
              {admin.email}
            </span>
          </div>
          <nav className="flex items-center gap-1 text-[12px] font-medium">
            <a href="/admin" className="rounded-[6px] px-2 py-1.5 text-[#0F172A] hover:bg-[#F8FAFC]">Dashboard</a>
            <a href="/" className="rounded-[6px] px-2 py-1.5 text-[#475569] hover:bg-[#F8FAFC]">← Site</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
