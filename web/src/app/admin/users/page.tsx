"use client";

import { adminHead } from "../fonts";
import { useEffect, useState } from "react";

interface U {
  id: string;
  email: string;
  name: string | null;
  role: string;
  credits: number;
  usedCredits: number;
  createdAt: string;
}

export default function AdminUsers() {
  const [items, setItems] = useState<U[]>([]);
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
      const res = await fetch(`/api/admin/users?${sp}`);
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

  const setRole = async (u: U, role: string) => {
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(d.error || "Update failed");
      return;
    }
    setMsg(`${u.email} → ${role}`);
    load(page, q);
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>Users</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">{total} users. Roles: free, pro, admin. You cannot demote yourself.</p>
      </div>
      {msg && <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">{msg}</p>}
      {err && <p className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1, q)}
          placeholder="Search email or name…"
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
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium text-right">Credits</th>
              <th className="px-3 py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {items.map((u) => (
              <tr key={u.id} className="text-[#3D4D4E]">
                <td className="px-3 py-2">
                  <span className="block font-medium">{u.email}</span>
                  <span className="block text-[11px] text-[#64748B]">{u.name || "—"}</span>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={u.role}
                    onChange={(e) => setRole(u, e.target.value)}
                    className="rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-[12px] font-medium text-[#3D4D4E]"
                  >
                    <option value="free">free</option>
                    <option value="pro">pro</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-3 py-2 text-right">
                  <input
                    type="number"
                    min={0}
                    defaultValue={u.credits}
                    key={`${u.id}-${u.credits}`}
                    onBlur={(e) => {
                      const n = parseInt(e.target.value, 10);
                      if (!isNaN(n) && n !== u.credits) {
                        fetch(`/api/admin/users/${u.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ credits: n }),
                        })
                          .then(async (r) => {
                            const d = await r.json().catch(() => ({}));
                            if (!r.ok) throw new Error(d.error || "Update failed");
                            setMsg(`${u.email} credits → ${n}`);
                            load(page, q);
                          })
                          .catch((err: any) => setErr(err.message));
                      }
                    }}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    className="w-20 rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-right text-[12px] text-[#3D4D4E]"
                  />{" "}
                  <span className="text-[#94A3B8]">({u.usedCredits} used)</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-[#475569]">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-[#64748B]">No users found.</td></tr>
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
