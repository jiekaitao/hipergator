"use client";

import { useEffect, useRef, useState } from "react";
import { ChapterMarker } from "../chrome/ChapterMarker";

function useCountUp(target: number, duration: number, start: boolean, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(target * ease);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return Number(val.toFixed(decimals));
}

export function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [start, setStart] = useState(false);
  const [jobs, setJobs] = useState(16234);

  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStart(true);
      },
      { threshold: 0.25 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setJobs((j) => Math.max(15000, j + Math.floor(Math.random() * 9 - 4)));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const gpus = useCountUp(30728, 2000, start);
  const flops = useCountUp(11.4, 2000, start, 1);
  const storage = useCountUp(14, 2000, start);

  return (
    <section
      ref={sectionRef}
      id="cluster"
      className="border-t border-line py-32 md:py-40 relative scanlines"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ChapterMarker num="III" label="What you'd be running on." tagline="Live" />

        <div className="mt-20 grid md:grid-cols-4 gap-px bg-line">
          <StatCell
            label="GPU cores"
            value={gpus.toLocaleString()}
            unit="active"
            tone="cyan"
          />
          <StatCell
            label="Peak FP64"
            value={flops.toFixed(1)}
            unit="PFLOPS"
            tone="cyan"
          />
          <StatCell
            label="Parallel storage"
            value={String(storage)}
            unit="PB · Lustre"
            tone="cyan"
          />
          <StatCell
            label="Jobs running"
            value={jobs.toLocaleString()}
            unit="↺ live"
            tone="orange"
            live
          />
        </div>

        {/* Descriptive copy + cohort sizing block hidden — re-enable when content is finalized.
        <div className="mt-16 grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-7">
            <p className="text-bone-dim leading-relaxed text-xl md:text-2xl font-display tracking-tightish">
              HiPerGator is the largest university supercomputer in the U.S.
              South.{" "}
              <span className="text-bone">
                A100s. H100s. H200s. NVMe parallel file systems. UFRC engineers
                who know the difference between a stuck DataLoader and a Slurm
                priority issue.
              </span>
            </p>
          </div>
        </div>
        */}
      </div>
    </section>
  );
}

function StatCell({
  label,
  value,
  unit,
  tone,
  live,
}: {
  label: string;
  value: string;
  unit: string;
  tone: "cyan" | "orange";
  live?: boolean;
}) {
  const color = tone === "cyan" ? "text-swamp-cyan" : "text-swamp-orange";
  return (
    <div className="bg-ink p-8 md:p-10 relative group">
      <div className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute flex items-center gap-2">
        — {label}
        {live && (
          <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-swamp-orange" />
        )}
      </div>
      <div
        className={`mt-6 font-mono text-5xl md:text-6xl tabular-nums ${color} tracking-tight`}
      >
        {value}
      </div>
      <div className="mt-3 font-mono text-[11px] uppercase tracking-wide2 text-bone-dim">
        {unit}
      </div>
    </div>
  );
}
