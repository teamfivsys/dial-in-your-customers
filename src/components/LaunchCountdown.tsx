import { useEffect, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";

const STORAGE_KEY = "kdial-launch-at-v1";
const DURATION_MS = 24 * 60 * 60 * 1000;

function getLaunchTarget(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed) && parsed > Date.now()) return parsed;
    }
    const target = Date.now() + DURATION_MS;
    localStorage.setItem(STORAGE_KEY, String(target));
    return target;
  } catch {
    return Date.now() + DURATION_MS;
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Unit({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`kd-clean-unit${accent ? " kd-clean-unit--accent" : ""}`}>
      <span className="kd-clean-num">{value}</span>
      <span className="kd-clean-label">{label}</span>
    </div>
  );
}

export default function LaunchCountdown() {
  const [target] = useState(getLaunchTarget);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <section className="kd-launch-wrap kd-launch-wrap--hero kd-clean" id="launch-countdown" aria-label="KDial launch countdown">
      <div className="kd-clean-card">
        <p className="kd-clean-eyebrow">KDial Kerala · Coming online after the wait</p>
        <div className="kd-clean-timer" role="timer" aria-live="off" aria-label={`${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}>
          <Unit value={pad(hours)} label="Hours" />
          <span className="kd-clean-colon" aria-hidden="true">:</span>
          <Unit value={pad(minutes)} label="Minutes" />
          <span className="kd-clean-colon" aria-hidden="true">:</span>
          <Unit value={pad(seconds)} label="Seconds" accent />
        </div>
        <div className="kd-clean-action">
          <a className="kd-clean-cta" href="#founders">Claim your Founder Package · ₹501 <ArrowRight size={16} /></a>
          <p className="kd-clean-place"><MapPin size={13} /> Kochi first · Kerala next</p>
        </div>
      </div>
    </section>
  );
}
