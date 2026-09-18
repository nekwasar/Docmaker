"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  try {
    const m = document.cookie.match(/(?:^|;\s*)dm_sid=([^;]+)/);
    if (m?.[1]) return m[1];
    try {
      const ls = localStorage.getItem("dm_sid");
      if (ls) {
        document.cookie = `dm_sid=${ls}; path=/; max-age=${365 * 24 * 3600}; samesite=lax`;
        return ls;
      }
    } catch {}
    const id = (crypto as any)?.randomUUID
      ? (crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try { localStorage.setItem("dm_sid", id); } catch {}
    document.cookie = `dm_sid=${id}; path=/; max-age=${365 * 24 * 3600}; samesite=lax`;
    return id;
  } catch {
    return "";
  }
}

// Sitewide page-view beacon (detailed analytics live in /admin/visitors).
// Fires on mount + every route change; server throttles duplicates.
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const sid = getSessionId();
      fetch("/api/track/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname || "/", sessionId: sid, referrer: document.referrer || null }),
      }).catch(() => {});
    } catch {}
  }, [pathname]);

  return null;
}
