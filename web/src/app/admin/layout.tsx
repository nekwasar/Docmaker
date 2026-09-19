import { redirect } from "next/navigation";
import { requireAdminPage, roleLabel } from "@/lib/admin";
import { getSession } from "@/lib/session";
import { adminBody, adminHead } from "./fonts";
import AdminNav from "./Nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  if (!admin) {
    // Anonymous (should already be caught by middleware) → signup.
    const sess = await getSession().catch(() => null);
    if (!sess) redirect("/signup?next=/admin");
    // Logged-in non-admin → 403 forbidden UI (a redirect("/") from a
    // layout does not reliably produce a 307, so render instead).
    return (
      <div className={`min-h-screen bg-white flex items-center justify-center px-4 ${adminBody.className}`}>
        <div className="w-full max-w-sm rounded-[10px] border border-[#E2E8F0] bg-white p-6 text-center">
          <p className={`text-[15px] font-semibold text-[#3D4D4E] ${adminHead.className}`}>Admin access required</p>
          <p className="mt-1 text-[12px] text-[#64748B]">
            Signed in as {sess.email} — this account is not an admin.
          </p>
          <a
            href="/"
            className="mt-4 flex w-full items-center justify-center rounded-[6px] bg-[#3D4D4E] py-2.5 text-[13px] font-semibold text-white hover:bg-[#2E3B3C]"
          >
            Back to site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${adminBody.className}`}>
      <header className="sticky top-0 z-10 bg-[#3D4D4E]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 sm:py-0 sm:h-14 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2 py-1 sm:py-0">
            <span className={`text-[15px] font-bold tracking-tight text-white ${adminHead.className}`}>Docmaker Admin</span>
            <span
              title={admin.email}
              className="rounded-[6px] border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#B2A295]"
            >
              {roleLabel(admin.role)}
            </span>
          </div>
          <div className="pb-1 sm:pb-0 sm:min-w-0 sm:flex-1 sm:flex sm:justify-end">
            <AdminNav />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
