import { ChapterMarker } from "../chrome/ChapterMarker";

const youGet = [
  "GPU allocation across A100 / H100 / H200 nodes",
  "Petabyte-scale parallel storage (Lustre + NVMe)",
  "Dedicated UFRC research-computing consulting hours",
  "Cohort programming + UF founder network",
  "Demo Day in front of NVIDIA, UF Innovate, regional VCs",
  "Lab + desk space at the UF Innovate Hub",
];

const ufGets = [
  "4% common equity — fully diluted, vested over 36 months",
  "Pro-rata participation in next priced round (up to $250k)",
  "One non-voting board observer seat for 24 months",
  "IP licensing terms for any UF-discovered tech you use",
  "Quarterly progress reports + open books on cluster usage",
];

export function TheDeal() {
  return (
    <section id="deal" className="border-t border-line py-32 md:py-40 relative">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ChapterMarker label="The deal." />

        <div className="mt-20 grid md:grid-cols-2 gap-px bg-line relative">
          {/* YOU GET */}
          <div className="bg-ink p-10 md:p-16 relative">
            <div className="font-mono text-[10px] uppercase tracking-wide3 text-swamp-cyan">
              — What you get
            </div>
            <h3 className="mt-6 font-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
              GPUs.
              <br />
              <span className="italic">A lot of them.</span>
            </h3>
            <ul className="mt-12 space-y-5">
              {youGet.map((it, i) => (
                <li key={i} className="flex gap-5 items-start">
                  <span className="font-mono text-xs text-swamp-cyan/80 mt-1.5 tabular-nums">
                    _{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-bone leading-relaxed text-base md:text-lg">
                    {it}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* UF GETS */}
          <div className="bg-ink p-10 md:p-16 relative">
            <div className="font-mono text-[10px] uppercase tracking-wide3 text-swamp-orange">
              — What UF gets
            </div>
            <h3 className="mt-6 font-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
              A stake in
              <br />
              <span className="italic">what you build.</span>
            </h3>
            <ul className="mt-12 space-y-5">
              {ufGets.map((it, i) => (
                <li key={i} className="flex gap-5 items-start">
                  <span className="font-mono text-xs text-swamp-orange/80 mt-1.5 tabular-nums">
                    _{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-bone leading-relaxed text-base md:text-lg">
                    {it}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
