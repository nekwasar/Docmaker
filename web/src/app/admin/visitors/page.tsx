"use client";

import { adminHead } from "../fonts";
import { useEffect, useState } from "react";

interface Overview {
  days: number;
  users: { total: number; new: number; returning: number };
  sessions: number;
  pageviews: number;
  pagesPerSession: number;
  avgSessionDurationSec: number;
  bounceRate: number;
  realtime: number;
  device: Array<{ name: string; count: number }>;
  os: Array<{ name: string; count: number }>;
  browser: Array<{ name: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  topReferrers: Array<{ referrer: string | null; count: number }>;
  topUtm: Array<{ source: string | null; count: number }>;
  daily: Array<{ date: string; sessions: number; views: number }>;
}

interface ViewRow {
  id: string;
  path: string;
  visitorId: string | null;
  isNewVisitor: boolean;
  isNewSession: boolean;
  device: string | null;
  os: string | null;
  browser: string | null;
  referrer: string | null;
  createdAt: string;
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[10px] border border-[#E2E8F0] border-t-2 border-t-[#B2A295] bg-white p-4">
      <p className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">{label}</p>
      <p className={`mt-1 text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-[#64748B]">{sub}</p>}
    </div>
  );
}

function Bars({ rows, fmt }: { rows: Array<{ name: string; count: number }>; fmt?: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) return <p className="text-[12px] text-[#64748B]">No data yet.</p>;
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.name} className="flex items-center gap-2 text-[12px]">
          <span className="w-24 shrink-0 truncate text-[#0F172A] font-medium">{r.name}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F1F5F9]">
            <div className="h-full rounded-full bg-[#3D4D4E]" style={{ width: `${Math.max(3, (r.count / max) * 100)}%` }} />
          </div>
          <span className="w-12 shrink-0 text-right text-[#475569]">{fmt ? fmt(r.count) : r.count}</span>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4">
      <p className={`text-[14px] font-semibold text-[#3D4D4E] ${adminHead.className}`}>{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

const fmtDur = (s: number) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);

export default function AdminVisitors() {
  const [days, setDays] = useState(30);
  const [ov, setOv] = useState<Overview | null>(null);
  const [views, setViews] = useState<ViewRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (d: number) => {
    setLoading(true);
    setErr(null);
    try {
      const [oRes, vRes] = await Promise.all([
        fetch(`/api/admin/analytics/overview?days=${d}`),
        fetch(`/api/admin/visitors?page=1&limit=15`),
      ]);
      if (!oRes.ok) throw new Error(oRes.status === 401 || oRes.status === 403 ? "Not authorized" : "Failed to load");
      const o = await oRes.json();
      setOv(o);
      setDays(o.days);
      if (vRes.ok) {
        const v = await vRes.json();
        setViews(v.items || []);
      }
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxDaily = Math.max(1, ...((ov?.daily || []).map((d) => Math.max(d.sessions, d.views))));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>Visitors</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Unique visitors (persistent ID), visits (30-min sessions), devices and more.
            {ov && ov.realtime > 0 && <span className="ml-2 inline-flex items-center gap-1 text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{ov.realtime} online now</span>}
          </p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-[8px] border border-[#E2E8F0] bg-white p-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => load(d)}
              className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium ${days === d ? "bg-[#3D4D4E] text-white" : "text-[#475569] hover:bg-[#F8FAFC]"}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {err && <p className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
      {loading && !ov && <p className="text-[13px] text-[#64748B]">Loading analytics…</p>}

      {ov && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="Unique visitors" value={String(ov.users.total)} sub={`${ov.users.new} new • ${ov.users.returning} returning`} />
            <Kpi label="Visits (sessions)" value={String(ov.sessions)} sub={`${ov.pageviews} pageviews • ${ov.pagesPerSession}/visit`} />
            <Kpi label="Bounce rate" value={`${ov.bounceRate}%`} sub={`Avg. visit ${fmtDur(ov.avgSessionDurationSec)}`} />
            <Kpi label="Online now" value={String(ov.realtime)} sub="active in last 5 min" />
          </div>

          <Panel title={`Daily activity (${ov.days}d)`}>
            {ov.daily.length === 0 ? (
              <p className="text-[12px] text-[#64748B]">No data yet.</p>
            ) : (
              <div className="flex h-28 items-end gap-1.5">
                {ov.daily.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.sessions} visits, ${d.views} views`}>
                    <div className="flex w-full flex-1 items-end justify-center gap-0.5">
                      <div className="w-1/2 rounded-[3px] bg-[#3D4D4E]" style={{ height: `${Math.max(3, (d.sessions / maxDaily) * 100)}%` }} />
                      <div className="w-1/2 rounded-[3px] bg-[#B2A295]" style={{ height: `${Math.max(3, (d.views / maxDaily) * 100)}%` }} />
                    </div>
                    <span className="text-[9px] text-[#94A3B8]">{d.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-[11px] text-[#64748B]"><span className="inline-block h-2 w-2 rounded-full bg-[#3D4D4E] mr-1" />visits <span className="inline-block h-2 w-2 rounded-full bg-[#B2A295] ml-2 mr-1" />views</p>
          </Panel>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Panel title="Devices"><Bars rows={ov.device} /></Panel>
            <Panel title="Operating systems"><Bars rows={ov.os} /></Panel>
            <Panel title="Browsers"><Bars rows={ov.browser} /></Panel>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <Panel title="Top pages">
              {ov.topPages.length === 0 ? <p className="text-[12px] text-[#64748B]">No data yet.</p> : (
                <div className="space-y-1.5">
                  {ov.topPages.map((p) => (
                    <div key={p.path} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="truncate font-mono text-[11px] text-[#0F172A]">{p.path}</span>
                      <span className="shrink-0 text-[#475569]">{p.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
            <Panel title="Top referrers">
              {ov.topReferrers.length === 0 ? <p className="text-[12px] text-[#64748B]">No referrers yet (direct traffic).</p> : (
                <div className="space-y-1.5">
                  {ov.topReferrers.map((r, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="truncate text-[#64748B]">{r.referrer}</span>
                      <span className="shrink-0 text-[#475569]">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
            <Panel title="Campaigns (UTM)">
              {ov.topUtm.length === 0 ? <p className="text-[12px] text-[#64748B]">No tagged campaigns yet.</p> : (
                <div className="space-y-1.5">
                  {ov.topUtm.map((u, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="truncate text-[#0F172A] font-medium">{u.source}</span>
                      <span className="shrink-0 text-[#475569]">{u.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </>
      )}

      <Panel title="Recent views">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase tracking-wide text-[#475569]">
                <th className="py-2 pr-3 font-medium">When</th>
                <th className="py-2 pr-3 font-medium">Path</th>
                <th className="py-2 pr-3 font-medium">Visitor</th>
                <th className="py-2 pr-3 font-medium">Device</th>
                <th className="py-2 pr-3 font-medium">OS • Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {views.map((r) => (
                <tr key={r.id} className="text-[#0F172A]">
                  <td className="py-2 pr-3 whitespace-nowrap text-[#475569]">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-3 font-mono text-[11px]">{r.path}</td>
                  <td className="py-2 pr-3">
                    <span className="font-mono text-[11px] text-[#475569]">{r.visitorId ? r.visitorId.slice(0, 8) + "…" : "—"}</span>
                    {r.isNewVisitor && <span className="ml-1 rounded-[4px] bg-emerald-50 px-1 py-0 text-[10px] font-medium text-emerald-700">new</span>}
                    {r.isNewSession && <span className="ml-1 rounded-[4px] bg-[#F5EFE6] px-1 py-0 text-[10px] font-medium text-[#6B5F4E]">new visit</span>}
                  </td>
                  <td className="py-2 pr-3 text-[#475569]">{r.device || "—"}</td>
                  <td className="py-2 pr-3 text-[#64748B]">{[r.os, r.browser].filter(Boolean).join(" • ") || "—"}</td>
                </tr>
              ))}
              {views.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-[#64748B]">No views yet — browse the site to generate some.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
