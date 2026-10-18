/** Intent signal only; this is not a sent message, booking or sale. */
export function trackFounderEnquiry(placement: string) {
  const target = window as Window & { dataLayer?: Record<string, unknown>[] };
  target.dataLayer = target.dataLayer || [];
  target.dataLayer.push({
    event: "founder_enquiry_click",
    placement,
    launch_stage: "prelaunch",
    package_price_inr: 501,
  });
}
