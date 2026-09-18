"use client";

import { adminHead } from "../fonts";
import { useEffect, useState } from "react";

interface Row {
  id: string;
  path: string;
  sessionId: string | null;
  ip: string | null;
  userAgent: string | null;
  referrer: string | null;
  createdAt: string;
}

export default function AdminVisitors() {
  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [topPaths, setTopPaths] = useState<Array<{ path: string; count: number }>>([]);
  const [page, setPage] = useState(1);
  const [path, setPath] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const load = async (p: number, q: string) => {
    setLoading(true);
    setErr(null);
    try {
      const sp = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (q.trim()) sp.set("path", q.trim());
      const res = await fetch(`/api/admin/visitors?${sp}`);
      if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? "Not authorized" : "Failed to load");
      const d = await res.json();
      setItems(d.items || []);
      setTotal(d.total || 0);
      setTopPaths(d.topPaths || []);
      setPage(d.page || p);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
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
        <h1 className={`text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>Visitors</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">{total} page views. Raw IPs retained 90 days (see Privacy).</p>
      </div>
      {topPaths.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topPaths.map((t) => (
            <button
              key={t.path}
              onClick={() => { setPath(t.path); load(1, t.path); }}
              className="rounded-[6px] border border-[#E2E8F0] bg-white px-2.5 py-1 text-[12px] text-[#3D4D4E] hover:bg-[#F8FAFC]"
            >
              {t.path} <span className="text-[#64748B]">({t.count})</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1, path)}
          placeholder="Filter by path…"
          className="flex-1 rounded-[8px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#3D4D4E] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3D4D4E]"
        />
        <button onClick={() => load(1, path)} className="rounded-[8px] bg-[#3D4D4E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#2E3B3C]">
          Filter
        </button>
      </div>
      {err && <p className="text-[13px] text-red-600">{err}</p>}
      <div className="overflow-x-auto rounded-[10px] border border-[#E2E8F0] bg-white">
        <table className="w-full min-w-[720px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-[11px] uppercase tracking-wide text-[#475569]">
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Path</th>
              <th className="px-3 py-2 font-medium">IP</th>
              <th className="px-3 py-2 font-medium">Referrer</th>
              <th className="px-3 py-2 font-medium">Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {items.map((r) => (
              <tr key={r.id} className="text-[#3D4D4E]">
                <td className="px-3 py-2 whitespace-nowrap text-[#475569]">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 font-medium font-mono text-[11px]">{r.path}</td>
                <td className="px-3 py-2 font-mono text-[11px] text-[#475569]">{r.ip || "—"}</td>
                <td className="px-3 py-2 text-[#64748B] max-w-[220px] truncate">{r.referrer || "—"}</td>
                <td className="px-3 py-2 text-[#64748B] max-w-[260px] truncate" title={r.userAgent || ""}>{r.userAgent || "—"}</td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-[#64748B]">No views yet — browse the site to generate some.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-[12px] text-[#475569]">
        <span>Page {page} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1, path)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Prev</button>
          <button disabled={page >= pages} onClick={() => load(page + 1, path)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
