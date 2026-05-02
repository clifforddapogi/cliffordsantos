import React from "react";
import { motion } from "framer-motion";

export default function Experience({ items }) {
  return (
    <section id="experience" className="relative py-24 lg:py-36 bg-bone/60" data-testid="experience-section">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold">[ 02 — Experience ]</span>
          <div className="h-px flex-1 bg-navy/15" />
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display font-bold text-navy tracking-tightest text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              A decade inside one of <span className="italic font-light">North America's</span> busiest ad networks.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-lg text-ink/75 leading-relaxed">
              Hybrid roles — designer, front-end developer, customer experience, and tier-2 tech support. The kind of breadth that only comes from sticking with a fast-moving team.
            </p>
          </div>
        </div>

        <div className="border-t border-navy/20">
          {items?.map((exp, idx) => (
            <motion.article
              key={exp.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="group border-b border-navy/20 py-10 lg:py-12 grid grid-cols-12 gap-6 hover:bg-cream transition-colors"
              data-testid={`experience-item-${idx}`}
            >
              <div className="col-span-12 lg:col-span-2">
                <div className="text-xs uppercase tracking-[0.18em] text-ink/60 font-bold">
                  {exp.start_date} — {exp.end_date}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <h3 className="font-display font-bold text-navy text-2xl lg:text-3xl tracking-tight leading-tight">
                  {exp.company}
                </h3>
                <div className="mt-2 text-sm text-cyan_brand font-medium">{exp.title}</div>
                <div className="mt-1 text-sm text-ink/55">{exp.location}</div>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <ul className="space-y-2.5 text-[15px] text-ink/80">
                  {exp.bullets?.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-cyan_brand mt-2 w-1.5 h-1.5 rounded-full bg-cyan_brand inline-block flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
