"use client";

import { useEffect, useState } from "react";

const FIELDS = [
  { key: "AI_PROVIDER", label: "AI Provider", type: "select", options: ["openrouter", "openai", "anthropic", "ollama", "custom"] },
  { key: "AI_API_KEY", label: "AI API Key", type: "password", hint: "Stored encrypted. Masked on read — leave as-is to keep, clear to remove." },
  { key: "AI_MODEL", label: "AI Model", type: "text" },
  { key: "AI_BASE_URL", label: "Base URL (optional)", type: "text" },
  { key: "GATE_THRESHOLD", label: "Free generations before newsletter gate", type: "number" },
  { key: "GATE_ENABLED", label: "Newsletter gate enabled", type: "select", options: ["true", "false"] },
] as const;

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [keyTouched, setKeyTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (r) => {
        if (!r.ok) throw new Error("Not authorized");
        return r.json();
      })
      .then((d) => {
        const v: Record<string, string> = {};
        for (const f of FIELDS) v[f.key] = d.settings?.[f.key]?.value ?? "";
        setValues(v);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const body: Record<string, string | null> = {};
      for (const f of FIELDS) {
        if (f.key === "AI_API_KEY") {
          if (!keyTouched) continue;
          body[f.key] = values[f.key] === "" ? null : values[f.key];
        } else {
          body[f.key] = values[f.key] ?? "";
        }
      }
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg(`Saved: ${(data.changed || []).join(", ") || "no changes"}`);
      setKeyTouched(false);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setTesting(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/admin/settings/test", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Test failed");
      setMsg(`Provider OK — ${data.provider} / ${data.model}`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <p className="p-6 text-[13px] text-[#64748B]">Loading settings…</p>;

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-[#0F172A]">AI Settings</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">DB values override env. Keys are encrypted at rest, masked on read.</p>
      </div>
      {err && <p className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
      {msg && <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">{msg}</p>}
      <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4 space-y-4">
        {FIELDS.map((f) => (
          <label key={f.key} className="block space-y-1">
            <span className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">{f.label}</span>
            {f.type === "select" ? (
              <select
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A]"
              >
                {(f as any).options.map((o: string) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type === "password" ? "password" : f.type === "number" ? "number" : "text"}
                value={values[f.key] ?? ""}
                autoComplete="off"
                onChange={(e) => {
                  setValues((v) => ({ ...v, [f.key]: e.target.value }));
                  if (f.key === "AI_API_KEY") setKeyTouched(true);
                }}
                placeholder={f.key === "AI_API_KEY" ? "•••••••• (unchanged)" : ""}
                className="w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A]"
              />
            )}
            {(f as any).hint && <span className="block text-[11px] text-[#94A3B8]">{(f as any).hint}</span>}
            {f.key === "AI_API_KEY" && keyTouched && (
              <span className="block text-[11px] text-amber-600">Key edited — will be replaced on save. Clear the field to remove it entirely.</span>
            )}
          </label>
        ))}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-[6px] bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          <button
            onClick={test}
            disabled={testing}
            className="rounded-[6px] border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-50"
          >
            {testing ? "Testing…" : "Test provider"}
          </button>
        </div>
      </div>
    </div>
  );
}
