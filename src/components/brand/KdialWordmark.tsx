interface Props {
  className?: string;
  /** Font size in px for the wordmark. Height auto-follows. */
  size?: number;
}

/**
 * Inline SVG-styled wordmark. Uses Space Grotesk so it must render inside
 * a page that has the font loaded (main.tsx imports @fontsource/space-grotesk).
 * No background box — sits directly on any surface.
 */
export const KdialWordmark = ({ className, size = 22 }: Props) => (
  <span
    className={className}
    style={{
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: "-0.02em",
      display: "inline-flex",
      alignItems: "baseline",
    }}
    aria-label="KDial"
  >
    <span style={{ color: "#1E6FFF" }}>k</span>
    <span style={{ color: "#FF6B1A" }}>.</span>
    <span style={{ color: "#0A1730" }}>dial</span>
  </span>
);

export default KdialWordmark;