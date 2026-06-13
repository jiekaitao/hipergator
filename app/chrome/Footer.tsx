export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-100 py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="font-display text-3xl tracking-tightest flex items-baseline gap-1 w-fit">
              <span>HiPerGator</span>
              <span className="font-mono text-[11px] uppercase tracking-wide3 text-bone-mute">
                .com
              </span>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-wide3 text-bone-mute">
              Gainesville, FL · 29.6516° N, 82.3248° W
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute mb-4">
              — Program
            </div>
            <ul className="space-y-2 text-bone-dim">
              <li>
                <a href="#eligibility" className="hover:text-bone transition-colors">
                  Eligibility
                </a>
              </li>
              <li>
                <a href="#deal" className="hover:text-bone transition-colors">
                  The Deal
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute mb-4">
              — Contact
            </div>
            <ul className="space-y-2 text-bone-dim">
              <li>ventures@hipergator.com</li>
              <li>UF Innovate Hub · Gainesville, FL</li>
              <li>UFRC operates the cluster</li>
            </ul>
          </div>
        </div>
        {/* Bottom legal row hidden for now — re-enable when copyright / tagline is finalized.
        <div className="mt-20 pt-8 border-t border-line flex flex-col md:flex-row justify-between gap-4 font-mono text-[10px] uppercase tracking-wide3 text-bone-mute">
          <div>© 2026 The University of Florida</div>
          <div className="flex items-center gap-2">
            <span>Powered by HiPerGator</span>
            <span className="text-bone-mute/60">·</span>
            <span>Made in the Swamp</span>
            <span className="text-swamp-orange ml-1">▮</span>
          </div>
        </div>
        */}
      </div>
    </footer>
  );
}
