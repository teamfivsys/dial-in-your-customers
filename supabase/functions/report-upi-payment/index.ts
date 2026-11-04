import { createClient } from "npm:@supabase/supabase-js@2.110.0";
// Public payment reports are never payment confirmation. CAPTCHA and the allowlisted origin
// are checked before the service-only RPC records a report; only finance can reconcile credit.
Deno.serve(async (request: Request) => {
  const allowedOrigins = (Deno.env.get("KDial_ALLOWED_ORIGINS") ?? "").split(",").map(x => x.trim()).filter(Boolean);
  const origin = request.headers.get("Origin") ?? "";
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "null", "Vary": "Origin", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
  const reply = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers });
  if (!allowedOrigins.includes(origin)) return reply(403, { error: "Origin not allowed." });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return reply(405, { error: "POST required." });
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 6000) return reply(413, { error: "Report is too large." });
    let body: Record<string, unknown>;
    try { body = JSON.parse(text); } catch { return reply(400, { error: "Invalid JSON." }); }
    const offerToken = typeof body.offer_token === "string" ? body.offer_token : "";
    const reference = typeof body.evidence_reference === "string" ? body.evidence_reference.trim() : "";
    const captchaToken = typeof body.captcha_token === "string" ? body.captcha_token : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(offerToken)) return reply(400, { error: "Invalid payment offer." });
    if (reference.length < 3 || reference.length > 120 || !/^[A-Za-z0-9._/-]+$/.test(reference)) return reply(400, { error: "Enter a valid UPI transaction reference." });
    const captchaSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!captchaSecret || !serviceKey || !supabaseUrl) return reply(503, { error: "Payment reporting is not configured." });
    if (!captchaToken || captchaToken.length > 2048) return reply(400, { error: "Complete the security check." });
    const challenge = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret: captchaSecret, response: captchaToken, remoteip: request.headers.get("cf-connecting-ip") ?? "" }) });
    if (!challenge.ok) return reply(503, { error: "Security verification is temporarily unavailable." });
    const result = await challenge.json();
    if (result.success !== true || result.hostname !== new URL(origin).hostname || result.action !== "report_upi_payment") return reply(403, { error: "Security verification failed. Please try again." });
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${offerToken.toLowerCase()}\n${reference}`));
    const eventKey = Array.from(new Uint8Array(digest), n => n.toString(16).padStart(2, "0")).join("");
    const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data, error } = await client.rpc("kdial_service_report_public_payment", { offer_token: offerToken, event_key: eventKey, evidence_reference: reference });
    if (error || data?.status !== "reported") return reply(400, { error: "The offer is no longer available or the report could not be saved." });
    return reply(200, { status: "reported", message: "Reference received for manual review. This is not payment confirmation." });
  } catch {
    return reply(500, { error: "The payment report could not be saved." });
  }
});
