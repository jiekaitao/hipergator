"use client";

import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-md border-b border-line"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="/" className="flex items-baseline gap-1">
          <span className="font-display text-2xl tracking-tightish">HiPerGator</span>
          <span className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute">
            .com
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wide2">
          <a
            href="#eligibility"
            className="text-bone-dim hover:text-swamp-cyan transition-colors"
          >
            Eligibility
          </a>
          <a
            href="#deal"
            className="text-bone-dim hover:text-swamp-cyan transition-colors"
          >
            The Deal
          </a>
          <a
            href="mailto:ventures@hipergator.com"
            className="text-swamp-orange hover:text-swamp-cyan transition-colors"
          >
            Get in touch →
          </a>
        </div>
      </div>
    </nav>
  );
}
