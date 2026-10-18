import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import "@/styles/kdial-refresh.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="kd-header">
    <a className="kd-skip" href="#main-content">Skip to content</a>
    <div className="kd-wrap kd-header-inner">
      <a href="/" aria-label="KDial home" className="kd-logo"><img src="/kdial-logo.png" width="140" height="47" alt="KDial" /></a>
      <button type="button" className="kd-menu" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="main-navigation" className={open ? "kd-nav is-open" : "kd-nav"} aria-label="Main navigation">
        <a href="/#about">About the launch</a><a href="/#faq">Questions</a><a className="kd-nav-cta" href="/#founders">For business owners <ArrowUpRight size={16}/></a>
      </nav>
    </div>
  </header>;
}
