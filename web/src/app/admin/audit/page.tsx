"use client";

import { useEffect, useState } from "react";

interface Row {
  id: string;
  adminUserId: string;
  action: string;
  details: any;
  createdAt: string;
}

export default function AdminAudit() {
  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const limit = 20;

  const load = async (p: number, a: string) => {
    setErr(null);
    try {
      const sp = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (a.trim()) sp.set("action", a.trim());
      const res = await fetch(`/api/admin/audit?${sp}`);
      if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? "Not authorized" : "Failed to load");
      const d = await res.json();
      setItems(d.items || []);
      setTotal(d.total || 0);
      setPage(d.page || p);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-[#0F172A]">Audit Log</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">{total} events. Denials, settings changes, user and subscriber actions.</p>
      </div>
      <div className="flex gap-2">
        <input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1, action)}
          placeholder="Filter by action…"
          className="flex-1 rounded-[8px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A]"
        />
        <button onClick={() => load(1, action)} className="rounded-[8px] bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white hover:bg-black">
          Filter
        </button>
      </div>
      {err && <p className="text-[13px] text-red-600">{err}</p>}
      <div className="overflow-x-auto rounded-[10px] border border-[#E2E8F0] bg-white">
        <table className="w-full min-w-[640px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-[11px] uppercase tracking-wide text-[#475569]">
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Action</th>
              <th className="px-3 py-2 font-medium">Admin</th>
              <th className="px-3 py-2 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {items.map((r) => (
              <tr key={r.id} className="text-[#0F172A]">
                <td className="px-3 py-2 whitespace-nowrap text-[#475569]">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 font-medium font-mono text-[11px]">{r.action}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-[#475569]">{r.adminUserId.slice(0, 8)}…</td>
                <td className="px-3 py-2 text-[#64748B] max-w-[320px] truncate font-mono text-[11px]" title={JSON.stringify(r.details)}>
                  {JSON.stringify(r.details)}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-[#64748B]">No events yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-[12px] text-[#475569]">
        <span>Page {page} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1, action)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Prev</button>
          <button disabled={page >= pages} onClick={() => load(page + 1, action)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
