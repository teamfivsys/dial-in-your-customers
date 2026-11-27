import { useEffect, useState } from "react";
import { Sparkles, PartyPopper, MapPin } from "lucide-react";

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
    <section className="kd-launch-wrap" id="launch-countdown" aria-label="KDial launch countdown">
      <div className="kd-wrap">
        <div className="kd-launch-card">
          <div className="kd-launch-confetti" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>
          <p className="kd-launch-pill"><Sparkles size={14} /> The wait is almost over</p>
          <h2 className="kd-launch-title">
            Coming online
            <span> after the wait.</span>
          </h2>
          <p className="kd-launch-sub">
            Kerala&apos;s businesses. A little closer. We open KDial&apos;s doors in
          </p>

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

          <div className="kd-launch-foot">
            <span className="kd-launch-live"><PartyPopper size={15} /> Staging preview — nothing live yet</span>
            <span className="kd-launch-place"><MapPin size={14} /> Kochi first · Kerala next</span>
          </div>

          <a className="kd-launch-cta" href="#founders">Founder Package ₹501 — still open</a>
          <small className="kd-launch-note">Real 24-hour timer. Staging only for review — production untouched, no listings published.</small>
        </div>
      </div>
    </section>
  );
}
