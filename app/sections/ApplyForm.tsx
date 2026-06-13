"use client";

import { useState } from "react";
import { ChapterMarker } from "../chrome/ChapterMarker";

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (typeof window !== "undefined") {
      console.log("application:", Object.fromEntries(data.entries()));
    }
    setSubmitted(true);
  };

  return (
    <section id="apply" className="border-t border-line py-32 md:py-40">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <ChapterMarker num="IV" label="Apply." tagline="Rolling review" />

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-20 grid md:grid-cols-2 gap-x-12 gap-y-2"
          >
            <Field name="name" label="Your name" required />
            <Field
              name="email"
              label="UF email"
              type="email"
              required
              hint="ends in @ufl.edu"
            />
            <Field name="company" label="Company / project name" required />
            <Field
              name="url"
              label="GitHub / demo / website URL"
              type="url"
              hint="optional"
            />
            <div className="md:col-span-2 mt-2">
              <Field
                name="pitch"
                label="One-line pitch — what are you building?"
                required
                as="textarea"
              />
            </div>

            <div className="md:col-span-2 mt-8">
              <div className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute mb-4">
                — Compute need (best guess)
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line">
                {[
                  { v: "small", l: "Small", d: "≤ 1 GPU" },
                  { v: "medium", l: "Medium", d: "1 — 8 GPUs" },
                  { v: "large", l: "Large", d: "8 — 64 GPUs" },
                  { v: "scale", l: "Scale", d: "64+ GPUs" },
                ].map((opt) => (
                  <label
                    key={opt.v}
                    className="bg-ink p-5 cursor-pointer hover:bg-ink-100 transition-colors flex flex-col gap-1 has-[:checked]:bg-ink-100 has-[:checked]:ring-1 has-[:checked]:ring-swamp-orange"
                  >
                    <input
                      type="radio"
                      name="compute"
                      value={opt.v}
                      required
                      className="sr-only peer"
                    />
                    <span className="font-mono text-xs uppercase tracking-wide2 peer-checked:text-swamp-orange">
                      {opt.l}
                    </span>
                    <span className="font-mono text-[10px] text-bone-mute">
                      {opt.d}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute max-w-md leading-relaxed">
                Submitting creates a record reviewed by UFRC + UF Innovate.
                <br />
                Expect a reply within 5 business days.
              </p>
              <button
                type="submit"
                className="cta border border-bone/40 hover:border-transparent px-10 py-5 font-mono text-xs uppercase tracking-wide2 transition-colors"
              >
                Submit application →
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-20 relative border border-swamp-cyan/40 p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_75%_25%,rgba(105,224,255,0.10),transparent_55%)]" />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-wide3 text-swamp-cyan flex items-center gap-2">
                — Received
                <span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-swamp-cyan" />
              </div>
              <h3 className="mt-6 font-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
                See you <span className="italic">in the queue.</span>
              </h3>
              <p className="mt-8 max-w-xl text-bone-dim leading-relaxed text-lg">
                Your application is logged. A program associate will reach out
                within 5 business days. If urgent,{" "}
                <span className="text-bone">ventures@hipergator.com</span> goes
                straight to the desk.
              </p>
              <div className="mt-10 font-mono text-[10px] uppercase tracking-wide3 text-bone-mute">
                Application ID:{" "}
                <span className="text-bone">
                  HPG-26-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  hint,
  as,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  as?: "textarea";
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-wide3 text-bone-mute flex items-center gap-2">
        — {label}
        {hint && (
          <span className="text-bone-mute/70 normal-case tracking-normal">
            ({hint})
          </span>
        )}
      </label>
      {as === "textarea" ? (
        <textarea
          name={name}
          required={required}
          className="field resize-none mt-1"
          rows={2}
        />
      ) : (
        <input name={name} type={type} required={required} className="field mt-1" />
      )}
    </div>
  );
}
