import { supabase } from "@/integrations/supabase/client";

export type Variant = "A" | "B";

const VARIANT_KEY = "kdial_ab_variant";
const SESSION_KEY = "kdial_ab_session";
const IMPRESSION_KEY = "kdial_ab_impression_logged";

export const HEADLINES: Record<Variant, { top: string; accent: string; tail: string }> = {
  A: { top: "Stop buying", accent: "your own", tail: "leads back." },
  B: { top: "Get real customer", accent: "calls.", tail: "Not resold leads." },
};

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* noop */
  }
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getVariant(): Variant {
  if (typeof window === "undefined") return "A";
  const existing = readStorage(VARIANT_KEY);
  if (existing === "A" || existing === "B") return existing;
  const assigned: Variant = Math.random() < 0.5 ? "A" : "B";
  writeStorage(VARIANT_KEY, assigned);
  return assigned;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  const existing = readStorage(SESSION_KEY);
  if (existing) return existing;
  const id = newId();
  writeStorage(SESSION_KEY, id);
  return id;
}

async function logEvent(variant: Variant, event: "impression" | "whatsapp_click") {
  try {
    await supabase.from("ab_events").insert({
      variant,
      event,
      session_id: getSessionId(),
      path: typeof window !== "undefined" ? window.location.pathname : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
    });
  } catch {
    /* silent — analytics must never block UX */
  }
}

export function logImpression(variant: Variant) {
  if (typeof window === "undefined") return;
  if (readStorage(IMPRESSION_KEY) === variant) return;
  writeStorage(IMPRESSION_KEY, variant);
  void logEvent(variant, "impression");
}

export function logConversion(variant: Variant) {
  void logEvent(variant, "whatsapp_click");
}