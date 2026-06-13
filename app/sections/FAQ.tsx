"use client";

import { useState } from "react";
import { ChapterMarker } from "../chrome/ChapterMarker";

const faqs = [
  {
    q: "Who counts as 'UF-founded'?",
    a: "At least one founder must have been UF-affiliated — student, faculty, postdoc, staff, or alum within five years of their last enrollment — at company formation. Verified at admissions via GatorLink.",
  },
  {
    q: "What if my company already has outside investors?",
    a: "You can still apply if your cap table has room for the standard UF allocation. Existing pro-rata rights of prior investors are respected; the program does not preempt them. We do require a clean Delaware C-corp before compute access provisions.",
  },
  {
    q: "How is compute actually allocated?",
    a: "Each admitted team receives a per-cohort GPU-hour budget on HiPerGator, scaled by stated need. Allocations refill quarterly. Burst capacity beyond budget is auctioned within-cohort on a daily standup call. UFRC sets the priority queue.",
  },
  {
    q: "What's the Cohort 01 timeline?",
    a: "Applications close 2026-08-15. Admissions decisions sent 2026-09-30. Onboarding + compute provisioning 2026-10-15. Mid-cohort review 2027-01-15. Demo Day 2027-02-12 — public, on UF's main campus.",
  },
  {
    q: "Can I apply pre-incorporation?",
    a: "Yes. If admitted, you incorporate (or convert your current entity) before compute access lights up. Program counsel works with you to file a Delaware C-corp pre-wired for the standard cap-table terms — no surprises, no separate legal bills.",
  },
  {
    q: "What's the equity rationale?",
    a: "Cycles cost real money — HiPerGator's full operating budget runs in the tens of millions a year. The university's stake gives UF an aligned upside that funds keeping the cluster online and growing for the next cohort. It's not a grant. It's a deal.",
  },
  {
    q: "What if my project doesn't pan out?",
    a: "No clawback. The vested portion of UF's equity is what it is; the company can wind down without owing anything further. Unused GPU-hours don't roll over. We'd rather you fail fast and come back next year than sit on cycles you can't use.",
  },
  {
    q: "Is this only for ML training?",
    a: "No. Inference at scale, robotics simulation, scientific ML, computational biology, climate models — anything that genuinely needs HPC qualifies. We're not interested in projects that fit on a 4090.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line py-32 md:py-40 grid-bg">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <ChapterMarker num="V" label="The fine print." tagline="Real questions" />

        <div className="mt-20 border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="border-b border-line transition-colors hover:bg-ink-100/50"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full py-7 md:py-9 px-2 md:px-0 flex items-baseline justify-between gap-8 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-5 md:gap-7">
                    <span className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute tabular-nums shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl md:text-3xl tracking-tightish leading-tight text-bone group-hover:text-bone transition-colors">
                      {f.q}
                    </span>
                  </span>
                  <span
                    className={`font-mono text-2xl text-bone-mute transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-45 text-swamp-orange" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                  <div>
                    <div className="pb-9 pl-10 md:pl-16 pr-4 md:pr-12 text-bone-dim leading-relaxed text-base md:text-lg max-w-3xl">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 font-mono text-[11px] uppercase tracking-wide3 text-bone-mute">
          Something not covered? <span className="text-bone">ventures@hipergator.com</span>
        </div>
      </div>
    </section>
  );
}
