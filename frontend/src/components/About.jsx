import React from "react";
import { motion } from "framer-motion";

export default function About({ site }) {
  return (
    <section id="about" className="relative py-24 lg:py-36 overflow-hidden" data-testid="about-section">
      <div className="absolute inset-0 grain opacity-100 pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold">[ 01 — About ]</span>
          <div className="h-px flex-1 bg-navy/15" />
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-7"
          >
            <h2 className="font-display font-bold text-navy tracking-tightest text-4xl sm:text-5xl lg:text-6xl leading-[0.95]" data-testid="about-heading">
              {site?.about_heading?.split(".").map((s, i, arr) =>
                s.trim() ? (
                  <span key={i} className={i === arr.length - 2 ? "text-cyan_brand" : ""}>
                    {s.trim()}.{" "}
                  </span>
                ) : null
              )}
            </h2>

            <div className="mt-10 space-y-6 max-w-2xl text-lg leading-relaxed text-ink/85" data-testid="about-paragraphs">
              {site?.about_paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
              <Stat n="10+" l="Years" />
              <Stat n="50+" l="Brands shipped" />
              <Stat n="100%" l="Pixel attention" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan_brand/15 rounded-[28px] -rotate-2" />
              <img
                src={site?.headshot_url}
                alt="Clifford Santos"
                className="relative w-full aspect-[4/5] object-cover rounded-[24px] shadow-2xl"
                data-testid="about-headshot"
              />
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="font-mono text-ink/60">{site?.email}</span>
              <span className="font-mono text-ink/60">{site?.phone}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <div className="font-display font-black text-3xl lg:text-4xl text-navy tracking-tightest">{n}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-ink/60 mt-1 font-bold">{l}</div>
    </div>
  );
}
