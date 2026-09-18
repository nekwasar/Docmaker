"use client";

import { adminHead } from "../fonts";
import { useEffect, useState } from "react";

interface Sub {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  createdAt: string;
}

export default function AdminNewsletter() {
  const [items, setItems] = useState<Sub[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const limit = 20;

  const load = async (p: number, query: string) => {
    setErr(null);
    try {
      const sp = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (query.trim()) sp.set("q", query.trim());
      const res = await fetch(`/api/admin/subscribers?${sp}`);
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

  const toggle = async (s: Sub) => {
    const next = s.status === "subscribed" ? "unsubscribed" : "subscribed";
    const res = await fetch(`/api/admin/subscribers/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Update failed");
      return;
    }
    setMsg(`${s.email} → ${next}`);
    load(page, q);
  };

  const remove = async (s: Sub) => {
    if (!window.confirm(`Delete ${s.email}?`)) return;
    const res = await fetch(`/api/admin/subscribers/${s.id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Delete failed");
      return;
    }
    setMsg(`Deleted ${s.email}`);
    load(page, q);
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>Newsletter</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">{total} subscribers. Own database, CSV export.</p>
        </div>
        <a
          href="/api/admin/subscribers/export"
          className="shrink-0 rounded-[8px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] font-medium text-[#3D4D4E] hover:bg-[#F8FAFC]"
        >
          Export CSV
        </a>
      </div>
      {msg && <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">{msg}</p>}
      {err && <p className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1, q)}
          placeholder="Search email…"
          className="flex-1 rounded-[8px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#3D4D4E] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3D4D4E]"
        />
        <button onClick={() => load(1, q)} className="rounded-[8px] bg-[#3D4D4E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#2E3B3C]">
          Search
        </button>
      </div>
      <div className="overflow-x-auto rounded-[10px] border border-[#E2E8F0] bg-white">
        <table className="w-full min-w-[640px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#FAFAFA] text-[11px] uppercase tracking-wide text-[#475569]">
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Joined</th>
              <th className="px-3 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {items.map((s) => (
              <tr key={s.id} className="text-[#3D4D4E]">
                <td className="px-3 py-2 font-medium">{s.email}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-[6px] px-1.5 py-0.5 text-[11px] font-medium ${s.status === "subscribed" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-[#475569]"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-[#64748B]">{s.source || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-[#475569]">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <button onClick={() => toggle(s)} className="mr-2 text-[12px] font-medium text-[#3D4D4E] underline hover:text-[#2563EB]">
                    {s.status === "subscribed" ? "Unsubscribe" : "Resubscribe"}
                  </button>
                  <button onClick={() => remove(s)} className="text-[12px] font-medium text-red-600 underline hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-[#64748B]">No subscribers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-[12px] text-[#475569]">
        <span>Page {page} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => load(page - 1, q)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Prev</button>
          <button disabled={page >= pages} onClick={() => load(page + 1, q)} className="rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
