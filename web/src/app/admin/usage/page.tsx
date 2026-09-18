"use client";

import { adminHead } from "../fonts";
import { useEffect, useState } from "react";

interface Row {
  id: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  sessionId: string | null;
  userId: string | null;
  createdAt: string;
}

export default function AdminUsage() {
  const [items, setItems] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [model, setModel] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const load = async (p: number, m: string) => {
    setLoading(true);
    setErr(null);
    try {
      const sp = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (m.trim()) sp.set("model", m.trim());
      const res = await fetch(`/api/admin/usage?${sp}`);
      if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? "Not authorized" : "Failed to load");
      const d = await res.json();
      setItems(d.items || []);
      setTotal(d.total || 0);
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
        <h1 className={`text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>Usage & Spend</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">{total} generations logged. Costs are estimates, admin-only.</p>
      </div>
      <div className="flex gap-2">
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1, model)}
          placeholder="Filter by model…"
          className="flex-1 rounded-[8px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#3D4D4E] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3D4D4E]"
        />
        <button onClick={() => load(1, model)} className="rounded-[8px] bg-[#3D4D4E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#2E3B3C]">
          Filter
        </button>
      </div>
      {err && <p className="text-[13px] text-red-600">{err}</p>}
      <div className="overflow-x-auto rounded-[10px] border border-[#E2E8F0] bg-white">
        <table className="w-full min-w-[720px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-[11px] uppercase tracking-wide text-[#475569]">
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Model</th>
              <th className="px-3 py-2 font-medium text-right">Prompt</th>
              <th className="px-3 py-2 font-medium text-right">Completion</th>
              <th className="px-3 py-2 font-medium text-right">Cost</th>
              <th className="px-3 py-2 font-medium">Session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {items.map((r) => (
              <tr key={r.id} className="text-[#3D4D4E]">
                <td className="px-3 py-2 whitespace-nowrap text-[#475569]">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 font-medium">{r.model}</td>
                <td className="px-3 py-2 text-right">{r.promptTokens.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{r.completionTokens.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">${Number(r.estimatedCostUsd).toFixed(6)}</td>
                <td className="px-3 py-2 text-[#64748B] font-mono text-[11px]">{r.sessionId ? r.sessionId.slice(0, 8) + "…" : "—"}</td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-[#64748B]">No usage yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-[12px] text-[#475569]">
        <span>Page {page} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1, model)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Prev</button>
          <button disabled={page >= pages} onClick={() => load(page + 1, model)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
