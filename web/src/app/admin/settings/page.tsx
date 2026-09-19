"use client";

import { adminHead } from "../fonts";
import { useEffect, useMemo, useState } from "react";
import { AI_PROVIDERS, MODEL_GROUPS, baseUrlForProvider, type AIProvider } from "@/lib/ai/catalog";
import { getModelPrice } from "@/lib/pricing";

const PROVIDER_IDS = AI_PROVIDERS.map((p) => p.id);

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-[#94A3B8]">{hint}</span>}
    </label>
  );
}

const selectCls =
  "w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#3D4D4E] focus:outline-none focus:border-[#3D4D4E]";
const inputCls =
  "w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#3D4D4E] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3D4D4E]";

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [keyTouched, setKeyTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMs, setTestMs] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [modelSpend, setModelSpend] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then(async (r) => {
        if (!r.ok) throw new Error("Not authorized");
        return r.json();
      }),
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ])
      .then(([s, stats]) => {
        const v: Record<string, string> = {};
        for (const k of ["AI_PROVIDER", "AI_API_KEY", "AI_MODEL", "AI_BASE_URL", "GATE_THRESHOLD", "GATE_ENABLED"]) {
          v[k] = s.settings?.[k]?.value ?? "";
        }
        setValues(v);
        (window as any).__statsByModel = stats?.byModel || [];
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, val: string) => setValues((v) => ({ ...v, [k]: val }));

  const onProviderChange = (id: string) => {
    set("AI_PROVIDER", id);
    // Auto-fill the known base URL; custom/ollama stay editable.
    if (id !== "custom") set("AI_BASE_URL", baseUrlForProvider(id as AIProvider));
  };

  const price = useMemo(() => {
    if (!values.AI_MODEL) return null;
    return getModelPrice(values.AI_MODEL);
  }, [values.AI_MODEL]);

  useEffect(() => {
    const rows: Array<{ model: string; costUsd: number; count: number }> = (window as any).__statsByModel || [];
    const hit = values.AI_MODEL ? rows.find((r) => r.model === values.AI_MODEL) : null;
    setModelSpend(hit ? `$${hit.costUsd.toFixed(4)} across ${hit.count} generations (30d stats)` : null);
  }, [values.AI_MODEL]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const body: Record<string, string | null> = {
        AI_PROVIDER: values.AI_PROVIDER || "openrouter",
        AI_MODEL: values.AI_MODEL || "",
        AI_BASE_URL: values.AI_BASE_URL ?? "",
        GATE_THRESHOLD: values.GATE_THRESHOLD ?? "2",
        GATE_ENABLED: values.GATE_ENABLED ?? "true",
      };
      if (keyTouched) body.AI_API_KEY = values.AI_API_KEY === "" ? null : values.AI_API_KEY;
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
    setTestMs(null);
    setMsg(null);
    setErr(null);
    try {
      const t0 = performance.now();
      const res = await fetch("/api/admin/settings/test", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Test failed");
      setTestMs(Math.round(performance.now() - t0));
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
        <h1 className={`text-[22px] font-bold tracking-tight text-[#3D4D4E] ${adminHead.className}`}>AI Settings</h1>
        <p className="mt-1 text-[13px] text-[#64748B]">DB values override env. Keys are encrypted at rest, masked on read.</p>
      </div>
      {err && <p className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{err}</p>}
      {msg && <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">{msg}</p>}

      {/* Connection */}
      <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4 space-y-4">
        <p className={`text-[14px] font-semibold text-[#3D4D4E] ${adminHead.className}`}>Connection</p>
        <Field label="AI Provider">
          <select value={values.AI_PROVIDER || "openrouter"} onChange={(e) => onProviderChange(e.target.value)} className={selectCls}>
            <optgroup label="Recommended">
              {AI_PROVIDERS.filter((p) => p.id === "openrouter").map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
            <optgroup label="US">
              {AI_PROVIDERS.filter((p) => p.region === "US").map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
            <optgroup label="China">
              {AI_PROVIDERS.filter((p) => p.region === "China").map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
            <optgroup label="Other">
              {AI_PROVIDERS.filter((p) => p.region === "Global" && p.id !== "openrouter").map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
          </select>
        </Field>
        <Field label="AI API Key" hint="Stored encrypted. Masked on read — edit to replace, clear to remove.">
          <input
            type="password"
            value={keyTouched ? (values.AI_API_KEY ?? "") : ""}
            autoComplete="off"
            onChange={(e) => {
              setValues((v) => ({ ...v, AI_API_KEY: e.target.value }));
              setKeyTouched(true);
            }}
            placeholder="•••••••• (unchanged)"
            className={inputCls}
          />
          {keyTouched && (
            <span className="block text-[11px] text-amber-600">Key edited — will be replaced on save. Clear the field to remove it entirely.</span>
          )}
        </Field>
        <Field label="Base URL" hint="Auto-filled per provider. Required for custom/local endpoints.">
          <input
            value={values.AI_BASE_URL ?? ""}
            onChange={(e) => set("AI_BASE_URL", e.target.value)}
            placeholder={baseUrlForProvider((values.AI_PROVIDER as AIProvider) || "openrouter")}
            className={inputCls}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={test}
            disabled={testing}
            className="rounded-[6px] border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-medium text-[#3D4D4E] hover:bg-[#F8FAFC] disabled:opacity-50"
          >
            {testing ? "Testing…" : "Test provider"}
          </button>
          {testMs !== null && <span className="text-[11px] text-[#64748B]">responded in {testMs}ms</span>}
        </div>
      </div>

      {/* Model */}
      <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4 space-y-4">
        <p className={`text-[14px] font-semibold text-[#3D4D4E] ${adminHead.className}`}>Model</p>
        <Field label="AI Model">
          <select value={values.AI_MODEL ?? ""} onChange={(e) => set("AI_MODEL", e.target.value)} className={selectCls}>
            <option value="" disabled>Select a model…</option>
            {MODEL_GROUPS.map((g) => (
              <optgroup key={g.region} label={g.region}>
                {g.models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {m.provider}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Custom model ID" hint="Optional — overrides the dropdown with any valid model ID (e.g. a brand-new release).">
          <input
            value={MODEL_GROUPS.some((g) => g.models.some((m) => m.id === values.AI_MODEL)) ? "" : (values.AI_MODEL ?? "")}
            onChange={(e) => set("AI_MODEL", e.target.value)}
            placeholder="vendor/model-name"
            className={inputCls}
          />
        </Field>
        {price && values.AI_MODEL && (
          <p className="text-[11px] text-[#64748B]">
            Rate: ${(price.inputPer1k * 1000).toFixed(2)} / ${(price.outputPer1k * 1000).toFixed(2)} per 1M tokens (in/out)
            {modelSpend ? ` • ${modelSpend}` : ""}
          </p>
        )}
      </div>

      {/* Newsletter gate */}
      <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4 space-y-4">
        <p className={`text-[14px] font-semibold text-[#3D4D4E] ${adminHead.className}`}>Newsletter gate</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Free generations">
            <input
              type="number"
              min={0}
              max={100}
              value={values.GATE_THRESHOLD ?? "2"}
              onChange={(e) => set("GATE_THRESHOLD", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Gate enabled">
            <select value={values.GATE_ENABLED ?? "true"} onChange={(e) => set("GATE_ENABLED", e.target.value)} className={selectCls}>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </Field>
        </div>
        <div className="pt-1">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-[6px] bg-[#3D4D4E] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#2E3B3C] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save all settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
