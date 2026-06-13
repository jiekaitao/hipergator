"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CobeGlobe } from "../hero/CobeGlobe";

const ease = [0.22, 1, 0.36, 1] as const;

export function GlobeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reach"
      className="relative border-t border-line py-32 md:py-40 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-12 items-center">
        {/* Left: copy */}
        <div className="md:col-span-5 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease }}
          >
            <div className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute flex items-center gap-3">
              <span className="h-px w-10 bg-swamp-orange/60" />
              <span>The reach</span>
            </div>
            <h2 className="mt-6 font-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
              Talent flows in.
              <br />
              <span className="italic text-swamp-orange">Cycles flow out.</span>
            </h2>
            <p className="mt-8 text-bone-dim text-base md:text-lg leading-relaxed max-w-md">
              UF-founded AI startups are being built by Gators across the country
              and across the world — converging here, in Gainesville, on the
              compute that gets them to the next milestone.
            </p>
            <div className="mt-10 font-mono text-[10px] uppercase tracking-wide3 text-bone-mute">
              Gainesville, FL · 29.6516°N, 82.3248°W
            </div>
          </motion.div>
        </div>

        {/* Right: globe canvas (triggered when scrolled into view) */}
        <div className="md:col-span-7 relative aspect-square w-full max-w-[640px] mx-auto">
          <CobeGlobe start={active} />
        </div>
      </div>
    </section>
  );
}
