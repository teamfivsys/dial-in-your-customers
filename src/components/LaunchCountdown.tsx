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

function FlapDigit({ d, accent }: { d: string; accent?: boolean }) {
  return (
    <span className={`kd-flap${accent ? " kd-flap--accent" : ""}`} aria-hidden="true">
      <span className="kd-flap-half kd-flap-top">{d}</span>
      <span className="kd-flap-half kd-flap-bottom">{d}</span>
      <span className="kd-flap-hinge" />
    </span>
  );
}

function FlapUnit({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="kd-flap-unit" aria-label={`${value} ${label}`}>
      <div className="kd-flap-digits">
        {value.split("").map((d, i) => (
          <FlapDigit key={i} d={d} accent={accent} />
        ))}
      </div>
      <span className="kd-flap-label">{label}</span>
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
  const progress = Math.min(100, Math.max(0, (1 - remaining / DURATION_MS) * 100));
  const filledSegments = Math.round((progress / 100) * 24);

  return (
    <section className="kd-launch-wrap kd-launch-wrap--hero kd-ed" id="launch-countdown" aria-label="KDial launch countdown">
      <div className="kd-ed-card">
        <div className="kd-ed-top">
          <p className="kd-ed-brand">KDial Kerala</p>
          <p className="kd-ed-tag">The wait is almost over</p>
        </div>

        <h2 className="kd-ed-title">
          Coming online
          <span> after the wait.</span>
        </h2>

        <div className="kd-ed-rule" aria-hidden="true"><span /></div>

        <p className="kd-ed-sub">Kerala&apos;s businesses. A little closer. We open KDial&apos;s doors in</p>

        <div className="kd-ed-timer" role="timer" aria-live="off" aria-label={`${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}>
          <FlapUnit value={pad(hours)} label="Hours" />
          <span className="kd-ed-colon" aria-hidden="true">:</span>
          <FlapUnit value={pad(minutes)} label="Minutes" />
          <span className="kd-ed-colon" aria-hidden="true">:</span>
          <FlapUnit value={pad(seconds)} label="Seconds" accent />
        </div>

        <div className="kd-ed-segments" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} className={i < filledSegments ? "is-on" : ""} />
          ))}
        </div>

        <div className="kd-ed-action">
          <a className="kd-ed-cta" href="#founders">Claim your Founder Package · ₹501 <ArrowRight size={17} /></a>
          <p className="kd-ed-place"><MapPin size={13} /> Kochi first · Kerala next</p>
        </div>

        <p className="kd-ed-note">Real 24-hour timer · Staging preview only — production untouched, no listings published.</p>
      </div>
    </section>
  );
}
