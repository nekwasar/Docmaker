"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const HEARTBEAT_MS = 30 * 1000;

function uuid(): string {
  try {
    if ((crypto as any)?.randomUUID) return (crypto as any).randomUUID();
  } catch {}
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function getVisitorId(): string {
  try {
    const m = document.cookie.match(/(?:^|;\s*)dm_vid=([^;]+)/);
    if (m?.[1]) {
      try { localStorage.setItem("dm_vid", m[1]); } catch {}
      return m[1];
    }
    try {
      const ls = localStorage.getItem("dm_vid");
      if (ls) {
        document.cookie = `dm_vid=${ls}; path=/; max-age=${365 * 24 * 3600}; samesite=lax`;
        return ls;
      }
    } catch {}
    const id = uuid();
    try { localStorage.setItem("dm_vid", id); } catch {}
    document.cookie = `dm_vid=${id}; path=/; max-age=${365 * 24 * 3600}; samesite=lax`;
    return id;
  } catch {
    return "";
  }
}

// Analytics session: rotates after 30 min of inactivity (GA-style visit).
function getAnalyticsSessionId(): string {
  try {
    const now = Date.now();
    const last = parseInt(localStorage.getItem("dm_alast") || "0", 10);
    let sid = localStorage.getItem("dm_asid");
    if (!sid || !last || now - last > SESSION_TIMEOUT_MS) {
      sid = uuid();
      try { localStorage.setItem("dm_asid", sid); } catch {}
    }
    try { localStorage.setItem("dm_alast", String(now)); } catch {}
    return sid || "";
  } catch {
    return "";
  }
}

function collect() {
  const params = new URLSearchParams(window.location.search);
  return {
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || null,
    timezone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return null; } })(),
    title: document.title.slice(0, 200),
    referrer: document.referrer || null,
    utm: {
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: params.get("utm_campaign"),
    },
  };
}

// Sitewide analytics beacon: page views on every route change + engagement
// heartbeats while the tab is visible. Spend/identity logic lives server-side.
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    let beat: ReturnType<typeof setInterval> | null = null;
    try {
      const visitorId = getVisitorId();
      const sessionId = getAnalyticsSessionId();
      const base = { path: pathname || "/", sessionId, visitorId, ...collect() };
      fetch("/api/track/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(base),
      }).catch(() => {});

      const sendBeat = () => {
        if (document.visibilityState !== "visible") return;
        try { localStorage.setItem("dm_alast", String(Date.now())); } catch {}
        fetch("/api/track/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "heartbeat", path: pathname || "/", sessionId }),
        }).catch(() => {});
      };
      beat = setInterval(sendBeat, HEARTBEAT_MS);
    } catch {}
    return () => {
      if (beat) clearInterval(beat);
    };
  }, [pathname]);

  return null;
}
