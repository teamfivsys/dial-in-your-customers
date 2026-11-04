import { Component, type ReactNode } from "react";

interface State {
  error: Error | null;
}

const whatsappMessage = encodeURIComponent(
  "Hi KDial team, I am enquiring about the Founder Package: ₹501 for the first year and ₹701 at renewal after the first year. The one-year term starts when the listing is published. Renewal is manual and requires a new affirmative payment; there is no automatic renewal or auto-charge. Please confirm inclusions and payment terms. I understand this is an enquiry only, not a booking or payment."
);
const whatsappLink = `https://wa.me/917356137106?text=${whatsappMessage}`;

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("[KDial] ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#F5F1E8",
            color: "#0A1730",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 12,
            }}
          >
            KDial · Kerala business directory · Pre-launch
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.1 }}>
            KDial is temporarily unavailable
          </h1>
          <p style={{ maxWidth: 360, fontSize: 15, opacity: 0.8, margin: "0 0 24px" }}>
            The page is having trouble loading. KDial is still pre-launch. The Founder Package is ₹501 for the first year and ₹701 at renewal after the first year; the one-year term starts when the listing is published. Ask us to confirm inclusions and payment terms. This enquiry does not reserve or activate a listing, or collect payment.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#0A1730",
              color: "#F5F1E8",
              padding: "14px 22px",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            Ask about the Founder Package →
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              background: "transparent",
              border: 0,
              color: "#0A1730",
              fontSize: 12,
              textDecoration: "underline",
              cursor: "pointer",
              opacity: 0.7,
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;