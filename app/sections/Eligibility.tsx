import { ChapterMarker } from "../chrome/ChapterMarker";

const items = [
  {
    n: "01",
    t: "UF Affiliation",
    d: "Active student, postdoc, faculty, staff, or alum within the last year of enrollment. Verified at admission via GatorLink.",
  },
  {
    n: "02",
    t: "AI-Native Product",
    d: "You're training or serving models at a scale where consumer hardware doesn't cut it. Inference workloads count. So do robotics, simulation, scientific ML.",
  },
  {
    n: "03",
    t: "Willing to Convert",
    d: "You agree to incorporate (or convert) as a UF-founded entity under the program's standing term sheet. Same terms for every team.",
  },
];

export function Eligibility() {
  return (
    <section id="eligibility" className="border-t border-line py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ChapterMarker label="Are you eligible?" />

        <div className="mt-20 grid md:grid-cols-3 gap-px bg-line">
          {items.map((item) => (
            <div
              key={item.n}
              className="bg-ink p-10 md:p-12 hover:bg-ink-100 transition-colors duration-300 group relative overflow-hidden"
            >
              <div className="font-display italic text-[5.5rem] md:text-[7rem] leading-none text-swamp-orange/85 group-hover:text-swamp-orange transition-colors">
                {item.n}
              </div>
              <div className="mt-8 font-mono text-[10px] uppercase tracking-wide3 text-bone-dim">
                — {item.t}
              </div>
              <p className="mt-4 text-bone leading-relaxed text-lg">{item.d}</p>

              {/* subtle decorative corner */}
              <div className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-wide3 text-bone-mute/60">
                §
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 font-mono text-[11px] uppercase tracking-wide3 text-bone-mute max-w-2xl">
          Three out of three? You're in scope. Read the deal below.
        </p>
      </div>
    </section>
  );
}
