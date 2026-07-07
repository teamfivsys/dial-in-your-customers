import { Component, type ReactNode } from "react";

interface State {
  error: Error | null;
}

const whatsappMessage = encodeURIComponent(
  "Hi KDial Team! I want to lock my ₹501 Pre-Booking Offer."
);
const whatsappLink = `https://wa.me/917356137106?text=${whatsappMessage}`;

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
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
            KDial · Kerala's paid-only directory
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.1 }}>
            Lock your ₹501 founder slot
          </h1>
          <p style={{ maxWidth: 360, fontSize: 15, opacity: 0.8, margin: "0 0 24px" }}>
            The page is having trouble loading. You can still register directly on WhatsApp — we'll
            reserve your slot right away.
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
            Register on WhatsApp →
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