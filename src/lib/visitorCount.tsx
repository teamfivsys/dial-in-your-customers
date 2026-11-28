import { useEffect, useState } from "react";

// Lightweight first-party visitor counter, server-side via Supabase RPC.
// Counted once per visitor per day (localStorage day key); privacy-friendly:
// no cookies, no IP storage, no external service. Silent fail: hides if unavailable.

const DAY_KEY = "kdial-visitor-day";
const today = () => new Date().toISOString().slice(0, 10);

async function callVisitRpc(fn: "record_visit" | "get_visit_count"): Promise<number | null> {
  if (typeof window === "undefined") return null;
  if (import.meta.env.VITE_DIRECTORY_API_MODE === "hostinger-mysql") return null;
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    // Generated Database types do not list these RPCs, so the typed client
    // constrains rpc() to `never`; cast through to call them untyped.
    const { data, error } = await supabase.rpc(fn as never);
    if (error) return null;
    return typeof data === "number" ? data : null;
  } catch {
    return null;
  }
}

export function useVisitorCount(): number | null {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    const day = today();
    const countedToday = (() => {
      try { return localStorage.getItem(DAY_KEY) === day; } catch { return false; }
    })();
    if (countedToday) {
      void callVisitRpc("get_visit_count").then(n => { if (active && n !== null) setCount(n); });
    } else {
      void callVisitRpc("record_visit").then(n => {
        if (!active) return;
        try { localStorage.setItem(DAY_KEY, day); } catch { /* ignore */ }
        if (n !== null) setCount(n);
      });
    }
    return () => { active = false; };
  }, []);
  return count;
}

export function VisitorCount() {
  const count = useVisitorCount();
  if (count === null) return null;
  return <span>. {count.toLocaleString("en-IN")} visitors so far<small> · counted once a day, no tracking</small></span>;
}
