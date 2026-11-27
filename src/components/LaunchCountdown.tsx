import { useEffect, useState } from "react";
import { Sparkles, PartyPopper, MapPin, ArrowRight, Crown } from "lucide-react";

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

  return (
    <section className="kd-launch-wrap kd-launch-wrap--hero" id="launch-countdown" aria-label="KDial launch countdown">
      <div className="kd-launch-card">
        <div className="kd-launch-sheen" aria-hidden="true" />
        <div className="kd-launch-confetti" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="kd-launch-top">
          <p className="kd-launch-pill kd-launch-pill--premium"><Sparkles size={14} /> The wait is almost over</p>
          <p className="kd-launch-kicker"><Crown size={13} /> KDial Kerala · Launching soon</p>
        </div>
        <h2 className="kd-launch-title">
          Coming online
          <span> after the wait.</span>
        </h2>
        <p className="kd-launch-sub">
          Kerala&apos;s businesses. A little closer. We open KDial&apos;s doors in
        </p>

        <p className="kd-launch-countlabel" aria-hidden="true">We go live in</p>
        <div className="kd-launch-timer" role="timer" aria-live="off" aria-label={`${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}>
          <div className="kd-launch-unit">
            <span className="kd-launch-num">{pad(hours)}</span>
            <span className="kd-launch-label">Hours</span>
          </div>
          <span className="kd-launch-colon">:</span>
          <div className="kd-launch-unit">
            <span className="kd-launch-num">{pad(minutes)}</span>
            <span className="kd-launch-label">Minutes</span>
          </div>
          <span className="kd-launch-colon">:</span>
          <div className="kd-launch-unit kd-launch-unit--accent">
            <span className="kd-launch-num">{pad(seconds)}</span>
            <span className="kd-launch-label">Seconds</span>
          </div>
        </div>

        <div className="kd-launch-progress" aria-hidden="true">
          <div className="kd-launch-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <a className="kd-launch-cta kd-launch-cta--premium" href="#founders">Claim your Founder Package · ₹501 <ArrowRight size={17} /></a>

        <div className="kd-launch-foot">
          <span className="kd-launch-live"><PartyPopper size={15} /> Celebration countdown — live in 24 hours</span>
          <span className="kd-launch-place"><MapPin size={14} /> Kochi first · Kerala next</span>
        </div>
        <small className="kd-launch-note">Real 24-hour timer · Staging preview only — production untouched, no listings published.</small>
      </div>
    </section>
  );
}
