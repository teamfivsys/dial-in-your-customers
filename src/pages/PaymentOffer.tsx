import { useEffect, useRef, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import SEO from "@/components/seo/SEO";
import Header from "@/components/landing/Header";
import { SiteFooter } from "./Index";
import { directoryBackend } from "@/lib/directoryClient";
import "@/styles/payment-offer.css";

type Offer = {
  business_name: string;
  amount_minor: number;
  currency: "INR";
  package_inclusions: string;
  cancellation_refund_terms: string;
  first_year_label: string;
  renewal_label: string;
  payee: string;
  upi_id: string;
  qr_base64: string;
  payment_status: "report_only";
};
type Turnstile = { render: (el: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
const money = (minor: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(minor / 100);

export default function PaymentOffer() {
  const { token: offerToken = "" } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [backend, setBackend] = useState<Awaited<ReturnType<typeof directoryBackend>>>(null);
  const [backendReady, setBackendReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [reference, setReference] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reported, setReported] = useState(false);
  const captcha = useRef<HTMLDivElement>(null);
  const widget = useRef<string>();
  const backendEnabled = import.meta.env.VITE_DIRECTORY_BACKEND_ENABLED === "true";
  const mysqlMode = import.meta.env.VITE_DIRECTORY_API_MODE === "hostinger-mysql";
  useEffect(() => {
    if (mysqlMode) { setBackendReady(true); return; }
    let active = true;
    void directoryBackend().then(client => { if (active) { setBackend(client); setBackendReady(true); } }).catch(() => { if (active) { setUnavailable(true); setBackendReady(true); } });
    return () => { active = false; };
  }, [mysqlMode]);
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const canReport = (mysqlMode || (!!backend && backendEnabled)) && !!sitekey && !!offer;

  useEffect(() => {
    let active = true;
    if (!backendReady) return;
    if ((!backend && !mysqlMode) || !/^[0-9a-f-]{36}$/i.test(offerToken)) { setUnavailable(true); setLoading(false); return; }
    void (async () => {
      try {
        let candidate: Offer;
        if (mysqlMode) { const response=await fetch(`/api/v1/payment-offers?token=${encodeURIComponent(offerToken)}`,{headers:{Accept:"application/json"},cache:"no-store"}); if(!response.ok) { setUnavailable(true); return; } candidate=await response.json(); }
        else { const { data, error } = await backend!.rpc("kdial_public_payment_offer", { offer_token: offerToken }); if(error||!data||typeof data!=="object"){setUnavailable(true);return;} candidate=data as Offer; }
        if (!active) return;
        if (candidate.currency !== "INR" || candidate.amount_minor !== 50100 || candidate.payment_status !== "report_only" || !candidate.qr_base64 || !candidate.package_inclusions || !candidate.cancellation_refund_terms) { setUnavailable(true); return; }
        setOffer(candidate);
      } catch { if (active) setUnavailable(true); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [backend, backendReady, mysqlMode, offerToken]);

  useEffect(() => {
    if (!canReport) return;
    let disposed = false;
    let script = document.querySelector<HTMLScriptElement>('script[data-kdial-turnstile]');
    const render = () => {
      if (disposed || !window.turnstile || !captcha.current || widget.current) return;
      widget.current = window.turnstile.render(captcha.current, { sitekey, action: "report_upi_payment", callback: (value: string) => setCaptchaToken(value), "expired-callback": () => setCaptchaToken(""), "error-callback": () => { setCaptchaToken(""); setError("Security verification could not load. Please try again."); } });
    };
    if (!script) { script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.dataset.kdialTurnstile = "true"; document.head.append(script); }
    script.addEventListener("load", render); render();
    return () => { disposed = true; script?.removeEventListener("load", render); if (widget.current) { window.turnstile?.remove(widget.current); widget.current = undefined; } };
  }, [canReport, sitekey]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if ((!backend && !mysqlMode) || !offer || !canReport) return;
    if (!acknowledged) { setError("Confirm the payee and amount shown in your UPI app."); return; }
    if (!captchaToken) { setError("Complete the security check before sending a payment report."); return; }
    setBusy(true); setError("");
    try {
      if(mysqlMode){const response=await fetch("/api/v1/payment-reports",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({offer_token:offerToken,evidence_reference:reference.trim(),captcha_token:captchaToken})});const data=await response.json().catch(()=>({}));if(!response.ok||data?.status!=="reported")throw new Error(data?.error||"The report could not be received. Try again later.");setReported(true);}else{const { data, error } = await backend!.functions.invoke("report-upi-payment", { body: { offer_token: offerToken, evidence_reference: reference.trim(), captcha_token: captchaToken } });if(error||data?.status!=="reported")throw new Error(data?.error||"The report could not be received. Try again later.");setReported(true);}
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The report could not be received."); }
    finally { setBusy(false); setCaptchaToken(""); if (widget.current) window.turnstile?.reset(widget.current); }
  }

  return <div className="kd-site payment-offer"><SEO title="KDial listing payment" description="Review the agreed KDial listing terms and report a manual UPI payment." canonicalUrl="https://kdial.in/pay" noIndex/><Header/><main className="kd-wrap payment-offer-main" id="main-content">
    {loading ? <p role="status">Loading payment terms…</p> : unavailable || !offer ? <section className="payment-state"><ShieldCheck size={32}/><h1>This payment offer isn’t available.</h1><p>Ask KDial for the current listing offer. No payment has been recorded.</p></section> : reported ? <section className="payment-state" role="status"><CheckCircle2 size={40}/><h1>Payment reference received.</h1><p>This is only a report. KDial must independently verify actual bank credit before marking the listing paid or publishing it.</p></section> : <section className="payment-offer-content"><p className="kd-eyebrow">KDial · LISTING OFFER</p><h1>{offer.business_name}</h1><div className="payment-price"><strong>{money(offer.amount_minor)}</strong><span>first year</span></div><div className="payment-terms"><p>{offer.first_year_label}</p><p>{offer.renewal_label}</p><h2>Included</h2><p className="payment-preserved-text">{offer.package_inclusions}</p><h2>Cancellation & refunds</h2><p className="payment-preserved-text">{offer.cancellation_refund_terms}</p></div><div className="payment-destination"><h2>Pay by UPI</h2><img className="payment-qr" src={`data:image/jpeg;base64,${offer.qr_base64}`} alt={`UPI payment QR code for ${offer.payee}`}/><p><strong>Payee: {offer.payee}</strong></p><p>UPI ID: <code>{offer.upi_id}</code></p><p>Enter exactly <strong>{money(offer.amount_minor)}</strong> in your UPI app. The QR has no amount or listing reference.</p><p className="payment-personal-note">This is a temporary personal UPI destination, not a KDial-verified merchant account. Check the payee name and amount in your UPI app before paying.</p></div><form className="payment-report-form" onSubmit={submit}><h2>Report a payment</h2><label>UPI transaction reference<input value={reference} onChange={e=>setReference(e.target.value)} required minLength={3} maxLength={120} pattern="[A-Za-z0-9._/-]+" autoComplete="off" placeholder="Enter the transaction reference"/></label><label className="payment-check"><input type="checkbox" checked={acknowledged} onChange={e=>setAcknowledged(e.target.checked)}/><span>I checked that my UPI app shows Felix Williams and the exact amount.</span></label><div ref={captcha} className="payment-captcha"/>{!sitekey&&<p className="payment-warning" role="status">Payment reports are disabled until the security check is configured.</p>}<button className="kd-button" disabled={!canReport||busy||!acknowledged||!captchaToken}>{busy?"Sending report…":"Send payment report"}</button>{error&&<p className="payment-error" role="alert">{error}</p>}<p className="payment-warning">A reference, screenshot or payment notification does not prove receipt. No payment is marked paid and no listing is published by this report.</p></form></section>}
  </main><SiteFooter/></div>;
}
