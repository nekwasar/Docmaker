import { requireAdminPage } from "@/lib/admin";

// Defense in depth: the admin layout blocks rendering for non-admins, but
// child segments still execute server-side — so every admin page must also
// enforce admin itself (otherwise spend/visitor data would leak into the
// flight payload even when hidden).
export default async function AdminDashboardStub() {
  const admin = await requireAdminPage();
  if (!admin) return null;
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-[#0F172A]">Dashboard</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Series 0 bootstrap — auth gate + seed verified. Full spend/visitors/newsletter cards land in Series 2–3.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {["AI Settings", "Usage & Spend", "Visitors", "Newsletter", "Users", "Audit"].map((item) => (
          <div key={item} className="rounded-[10px] border border-[#E2E8F0] bg-white p-4">
            <p className="text-[13px] font-semibold text-[#0F172A]">{item}</p>
            <p className="mt-1 text-[11px] text-[#64748B]">Coming in next series.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
