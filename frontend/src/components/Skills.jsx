import React from "react";
import { motion } from "framer-motion";

export default function Skills({ data, education }) {
  return (
    <section id="skills" className="relative py-24 lg:py-36 bg-cream" data-testid="skills-section">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold">[ 04 — Toolkit & Education ]</span>
          <div className="h-px flex-1 bg-navy/15" />
        </div>

        <div className="grid grid-cols-12 gap-12">
          {/* Skills column */}
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display font-bold text-navy tracking-tightest text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mb-10">
              Stack & <span className="italic font-light">specialties.</span>
            </h2>

            <div className="space-y-8">
              {data?.groups?.map((g, idx) => (
                <motion.div
                  key={g.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  data-testid={`skill-group-${g.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-ink/55 font-bold mb-3">{g.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s, i) => (
                      <span
                        key={s}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          i % 5 === 0
                            ? "bg-navy text-cream border-navy hover:bg-cyan_brand hover:border-cyan_brand"
                            : "border-navy/25 text-navy hover:bg-navy hover:text-cream hover:border-navy"
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education column */}
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-28 bg-navy text-cream rounded-3xl p-8 lg:p-10">
              <div className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold mb-3">Education</div>
              <h3 className="font-display font-bold text-3xl lg:text-4xl tracking-tightest leading-tight">
                Where I learned <span className="italic font-light text-cyan_brand">the craft.</span>
              </h3>

              <div className="mt-8 space-y-6">
                {education?.map((e, idx) => (
                  <div key={e.id || idx} className="border-t border-cream/20 pt-5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-cream/60 font-bold mb-1">{e.dates}</div>
                    <div className="font-display text-xl tracking-tight">{e.institution}</div>
                    <div className="text-sm text-cream/75 mt-1">{e.degree}</div>
                    <div className="text-xs text-cream/55 mt-0.5">{e.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
