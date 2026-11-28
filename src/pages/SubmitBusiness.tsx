import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, Store, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/landing/Header";
import SEO from "@/components/seo/SEO";
import { SiteFooter } from "./Index";

// Verified owner WhatsApp for KDial lead routing (matches the site's existing
// wa.me links and the owner's connected WhatsApp record). Never a listing phone.
const OWNER_WHATSAPP = "917356137106";

function field(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

export default function SubmitBusiness() {
  const [error, setError] = useState("");
  const [waUrl, setWaUrl] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const businessName = field(form, "business_name");
    const ownerName = field(form, "owner_name");
    const phone = field(form, "phone");
    const whatsapp = field(form, "whatsapp");
    const category = field(form, "category");
    const locality = field(form, "locality");
    const address = field(form, "address");
    const services = field(form, "services");
    const description = field(form, "description");

    const missing = [
      !businessName && "business name",
      !ownerName && "owner name",
      !phone && "phone",
      !whatsapp && "WhatsApp number",
      !category && "category",
      !locality && "locality / district",
      !address && "address",
      !description && "short description",
    ].filter(Boolean);
    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      return;
    }

    const message = [
      "New KDial listing request",
      `Business name: ${businessName}`,
      `Owner name: ${ownerName}`,
      `Phone: ${phone}`,
      `WhatsApp: ${whatsapp}`,
      `Category: ${category}`,
      `Locality / district: ${locality}`,
      `Address: ${address}`,
      `Services: ${services || "—"}`,
      `Description: ${description}`,
    ].join("\n");
    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
    setWaUrl(url);
    // Opening WhatsApp does NOT confirm delivery — the customer must tap Send
    // in WhatsApp for the message to be delivered.
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="kd-site">
      <SEO
        title="List your business on KDial | KDial"
        description="Share your business details for KDial and continue on WhatsApp to send your listing request."
        canonicalUrl="https://kdial.in/submit-business"
        noIndex
      />
      <Header />
      <main id="main-content" className="kd-wrap kd-submit">
        <Link className="kd-text-link" to="/directory">
          <ArrowLeft size={16} />Back to directory
        </Link>
        <div className="kd-submit-grid">
          <aside>
            <p className="kd-eyebrow">LIST YOUR BUSINESS</p>
            <h1>
              Tell Kochi
              <br />
              what you do.
            </h1>
            <p>
              Fill in your business details, then continue on WhatsApp to send your listing request.
              We review your details before anything goes public.
            </p>
            <div className="kd-submit-note">
              <ShieldCheck size={24} />
              <div>
                <h2>Send it yourself.</h2>
                <p>
                  WhatsApp opens with your details ready — tap Send there to finish your request.
                  Nothing is sent until you tap Send.
                </p>
              </div>
            </div>
            <div className="kd-submit-note">
              <Store size={24} />
              <div>
                <h2>Real businesses. Real details.</h2>
                <p>Only share information and channels you’re authorized to publish.</p>
              </div>
            </div>
          </aside>

          <section className="kd-submit-form">
            <h2>Your business details</h2>
            <p>All fields are required unless marked optional.</p>
            <form onSubmit={submit} noValidate={false}>
              <label>
                Business name
                <input
                  name="business_name"
                  required
                  minLength={2}
                  maxLength={140}
                  autoComplete="organization"
                  placeholder="Your registered or trading name"
                />
              </label>
              <label>
                Owner name
                <input
                  name="owner_name"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Name of the business owner"
                />
              </label>
              <div className="ka-form-grid">
                <label>
                  Phone
                  <input
                    name="phone"
                    type="tel"
                    required
                    pattern="\+91[6-9][0-9]{9}"
                    placeholder="+91 followed by 10 digits"
                    autoComplete="tel"
                  />
                </label>
                <label>
                  WhatsApp
                  <input
                    name="whatsapp"
                    type="tel"
                    required
                    pattern="\+91[6-9][0-9]{9}"
                    placeholder="+91 followed by 10 digits"
                    autoComplete="tel"
                  />
                </label>
              </div>
              <div className="ka-form-grid">
                <label>
                  Category
                  <input
                    name="category"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="e.g. Builders, Restaurant, Salon"
                  />
                </label>
                <label>
                  Locality / district
                  <input
                    name="locality"
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="e.g. Kakkanad, Ernakulam"
                  />
                </label>
              </div>
              <label>
                Address
                <textarea
                  name="address"
                  required
                  minLength={5}
                  maxLength={500}
                  autoComplete="street-address"
                  placeholder="Full business address"
                />
              </label>
              <label>
                Services (optional)
                <textarea
                  name="services"
                  maxLength={1000}
                  placeholder="One service per line (optional)"
                />
              </label>
              <label>
                Short description
                <textarea
                  name="description"
                  required
                  minLength={20}
                  maxLength={2000}
                  placeholder="Describe your business in 20–2,000 characters. No unverified claims."
                />
              </label>
              <button className="kd-button" type="submit">
                <MessageCircle size={17} />Send via WhatsApp <ArrowRight size={17} />
              </button>
              <small>Your request opens in WhatsApp — tap Send there to finish. No payment is taken here.</small>
            </form>
            {error && (
              <p className="kd-submit-error" role="alert">
                {error}
              </p>
            )}
            {waUrl && (
              <div className="kd-submit-success" role="status" style={{ marginTop: 24 }}>
                <p className="kd-eyebrow">ALMOST DONE</p>
                <h2 style={{ fontSize: 22, margin: "8px 0" }}>Please tap Send in WhatsApp.</h2>
                <p>
                  Almost done — please tap Send in WhatsApp to finish your request. Nothing is
                  sent until you send that message. If WhatsApp didn’t open, tap to retry.
                </p>
                <div className="kd-prelaunch-actions" style={{ marginTop: 16, flexWrap: "wrap" }}>
                  <a className="kd-button kd-button-orange" href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={17} />Open WhatsApp to send <ArrowRight size={17} />
                  </a>
                  <a className="kd-button kd-button-secondary" href={`tel:+${OWNER_WHATSAPP}`}>
                    <Phone size={17} />Call 917356137106
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
