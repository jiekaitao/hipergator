"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col">
      {/* BOTTOM — headline block */}
      <div className="mt-auto pb-[8vh] md:pb-[9vh]">
        <div className="mx-auto max-w-7xl w-full px-6 md:px-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease }}
            className="font-display tracking-tightest leading-[0.93] text-[clamp(2.6rem,7vw,7.4rem)]"
          >
            <span className="block">Get the compute</span>
            <span className="block">
              you need
              <span className="italic font-display text-swamp-orange"> from the Swamp.</span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5, ease }}
            className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pointer-events-auto"
          >
            <p className="max-w-xl text-bone-dim text-base md:text-lg leading-relaxed">
              Trade equity for cycles. Get the GPUs your AI startup actually
              needs — without the AWS bill.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#deal"
                className="cta inline-flex items-center gap-3 border border-bone/40 hover:border-transparent px-8 py-4 font-mono text-xs uppercase tracking-wide2 transition-colors"
              >
                <span>See the deal →</span>
              </a>
              <a
                href="mailto:ventures@hipergator.com"
                className="font-mono text-xs uppercase tracking-wide2 text-bone-dim hover:text-bone transition-colors"
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right rail with mock cluster numbers hidden — re-enable when real stats are wired.
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 4.4, duration: 0.9, ease }}
        className="absolute right-6 md:right-10 bottom-[35vh] hidden lg:flex flex-col gap-2 items-end font-mono text-[10px] uppercase tracking-wide3 text-bone-mute"
      >
        <div className="flex items-center gap-2">
          <span>Cluster Online</span>
          <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-swamp-cyan" />
        </div>
        <div>16,234 jobs queued</div>
        <div>11.4 PFLOPS FP64</div>
        <div>GNV · 29.6516°N</div>
      </motion.div>
      */}

    </div>
  );
}
