"use client";

import { adminHead } from "./fonts";
import { useEffect, useState } from "react";

interface Stats {
  spend: { totalUsd: number; last30dUsd: number };
  generations: { total: number; last30d: number };
  visitors: { total: number; last7d: number };
  subscribers: number;
  byModel: Array<{ model: string; costUsd: number; count: number }>;
  dailySpend: Array<{ date: string; costUsd: number; count: number }>;
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[10px] border border-[#E2E8F0] border-t-2 border-t-[#B2A295] bg-white p-4">
      <p className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">{label}</p>
      <p className={`mt-1 text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-[#64748B]">{sub}</p>}
    </div>
  );
}

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4 });

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (r) => {
        if (!r.ok) throw new Error(r.status === 401 || r.status === 403 ? "Not authorized" : "Failed to load");
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="p-6 text-[13px] text-red-600">{error}</p>;
  if (!stats) return <p className="p-6 text-[13px] text-[#64748B]">Loading dashboard…</p>;

  const maxDaily = Math.max(0.000001, ...stats.dailySpend.map((d) => d.costUsd));

  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>Dashboard</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">AI spend, usage, visitors and newsletter at a glance.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card label="AI spend (total)" value={fmtUsd(stats.spend.totalUsd)} sub={`${fmtUsd(stats.spend.last30dUsd)} last 30d`} />
        <Card label="Generations" value={String(stats.generations.total)} sub={`${stats.generations.last30d} last 30d`} />
        <Card label="Visitors" value={String(stats.visitors.total)} sub={`${stats.visitors.last7d} last 7d`} />
        <Card label="Subscribers" value={String(stats.subscribers)} />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4">
          <p className="text-[13px] font-semibold text-[#3D4D4E]">Spend by model</p>
          {stats.byModel.length === 0 ? (
            <p className="mt-2 text-[12px] text-[#64748B]">No usage yet.</p>
          ) : (
            <div className="mt-2 divide-y divide-[#F1F5F9]">
              {stats.byModel.map((m) => (
                <div key={m.model} className="flex items-center justify-between py-2 text-[12px]">
                  <span className="truncate text-[#3D4D4E] font-medium">{m.model}</span>
                  <span className="ml-3 shrink-0 text-[#475569]">{m.count} gens • {fmtUsd(m.costUsd)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4">
          <p className="text-[13px] font-semibold text-[#3D4D4E]">Daily spend (14d)</p>
          {stats.dailySpend.length === 0 ? (
            <p className="mt-2 text-[12px] text-[#64748B]">No usage yet.</p>
          ) : (
            <div className="mt-3 flex h-28 items-end gap-1.5">
              {stats.dailySpend.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${fmtUsd(d.costUsd)} (${d.count})`}>
                  <div
                    className="w-full rounded-[4px] bg-[#3D4D4E]"
                    style={{ height: `${Math.max(4, (d.costUsd / maxDaily) * 100)}%` }}
                  />
                  <span className="text-[9px] text-[#94A3B8]">{d.date.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
