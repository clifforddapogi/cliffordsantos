import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

const MARQUEE_ITEMS = [
  "Brand Identity",
  "Landing Pages",
  "Web Design",
  "WordPress",
  "UI Systems",
  "Front-End",
  "Email Campaigns",
];

function HeroEyebrow({ text }) {
  return (
    <div className="flex items-center gap-3 mb-8 text-[11px] uppercase tracking-[0.22em] text-ink/70 font-bold">
      <span className="inline-block w-2 h-2 rounded-full bg-cyan_brand animate-pulse" />
      {text || "Available for select work"}
    </div>
  );
}

function HeroHeadline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      className="font-display font-black text-navy leading-[0.86] tracking-tightest text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[11.5vw]"
      data-testid="hero-name"
    >
      Clifford
      <br />
      <span className="italic font-light">Santos</span>
      <span className="text-cyan_brand">.</span>
    </motion.h1>
  );
}

function HeroCTA({ tagline }) {
  return (
    <div className="col-span-12 lg:col-span-5">
      <p className="text-lg lg:text-xl leading-relaxed text-ink/80 max-w-xl" data-testid="hero-tagline">
        {tagline}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#work"
          className="group inline-flex items-center gap-3 bg-navy text-cream rounded-full px-6 py-3.5 text-sm font-medium hover:bg-cyan_brand transition-colors"
          data-testid="hero-work-btn"
        >
          See selected work
          <ArrowDownRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 border border-navy/30 text-navy rounded-full px-6 py-3.5 text-sm font-medium hover:border-navy hover:bg-navy hover:text-cream transition-colors"
          data-testid="hero-contact-btn"
        >
          Start a conversation
        </a>
      </div>
    </div>
  );
}

function HeroMeta({ title, location }) {
  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="border-l border-navy/15 pl-6 space-y-5">
        <MetaRow label="Currently" value={title} />
        <MetaRow label="Based in" value={location} />
        <MetaRow label="Years" value="10+ shipping" />
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-ink/50 font-bold mb-1">{label}</div>
      <div className="font-display text-2xl text-navy">{value}</div>
    </div>
  );
}

function HeroMarquee() {
  return (
    <div className="mt-16 lg:mt-24 border-y border-navy/15 py-5 overflow-hidden bg-bone/40" data-testid="hero-marquee">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {Array(2).fill(0).map((_, i) => (
          <div key={`marquee-track-${i}`} className="flex gap-12 items-center font-display text-3xl lg:text-4xl text-navy/85 tracking-tightest">
            {MARQUEE_ITEMS.map((item) => (
              <React.Fragment key={item}>
                <span>{item}</span>
                <span className="text-cyan_brand">✦</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ site }) {
  return (
    <section className="relative pt-36 lg:pt-44 pb-12 lg:pb-24 overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0 gridline opacity-40 pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 relative z-10">
        <HeroEyebrow text={site?.hero_eyebrow} />
        <HeroHeadline />

        <div className="mt-10 lg:mt-16 grid grid-cols-12 gap-6 lg:gap-10">
          <HeroCTA tagline={site?.hero_tagline} />
          <div className="hidden lg:block lg:col-span-3" />
          <HeroMeta title={site?.hero_title} location={site?.location} />
        </div>
      </div>

      <HeroMarquee />
    </section>
  );
}
