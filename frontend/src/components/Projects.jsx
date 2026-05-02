import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";

// Bento layout pattern: indices arranged for visual rhythm
const sizeMap = [
  "lg:col-span-8 lg:row-span-2",      // 0 — large hero
  "lg:col-span-4 lg:row-span-1",      // 1
  "lg:col-span-4 lg:row-span-1",      // 2
  "lg:col-span-5 lg:row-span-2",      // 3 — tall left
  "lg:col-span-4 lg:row-span-1",      // 4
  "lg:col-span-3 lg:row-span-1",      // 5
  "lg:col-span-3 lg:row-span-1",      // 6
  "lg:col-span-4 lg:row-span-1",      // 7
  "lg:col-span-7 lg:row-span-2",      // 8 — wide
  "lg:col-span-5 lg:row-span-1",      // 9
  "lg:col-span-6 lg:row-span-1",      // 10
  "lg:col-span-6 lg:row-span-1",      // 11
];

const invertedIdx = new Set([1, 5, 9]);

function ProjectCard({ project: p, idx, onOpen }) {
  const span = sizeMap[idx % sizeMap.length];
  const inverted = invertedIdx.has(idx % sizeMap.length);
  const overlayBg = inverted
    ? "bg-gradient-to-t from-navy via-navy/60 to-transparent"
    : "bg-gradient-to-t from-bone via-bone/40 to-transparent";
  const labelBg = inverted
    ? "bg-gradient-to-t from-navy via-navy/85 to-transparent"
    : "bg-gradient-to-t from-bone via-bone/85 to-transparent";
  const titleColor = inverted ? "text-cream" : "text-navy";

  return (
    <motion.button
      onClick={() => onOpen(p)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: (idx % 6) * 0.05 }}
      className={`group relative rounded-3xl overflow-hidden text-left border ${
        inverted ? "bg-navy text-cream border-navy" : "bg-bone border-navy/10"
      } ${span}`}
      data-testid={`project-card-${idx}`}
    >
      <div className="absolute inset-0">
        <img
          src={p.image_url}
          alt={p.title}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          className="absolute inset-x-6 top-6 bottom-24 lg:inset-x-8 lg:top-8 lg:bottom-28 w-auto h-auto max-w-[calc(100%-3rem)] max-h-[calc(100%-7rem)] m-auto object-contain transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className={`absolute inset-0 flex flex-col justify-between p-6 lg:p-8 transition-opacity duration-500 ${overlayBg} opacity-0 group-hover:opacity-100`}>
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-cyan_brand">
            {p.category}
          </span>
          <ArrowUpRight className={`w-5 h-5 ${titleColor}`} />
        </div>
        <div>
          <h3 className={`font-display font-bold tracking-tight text-2xl lg:text-3xl ${titleColor}`}>
            {p.title}
          </h3>
          <p className={`mt-1 text-sm ${inverted ? "text-cream/70" : "text-ink/60"}`}>
            {p.year} · {p.role}
          </p>
        </div>
      </div>

      <div className={`absolute inset-x-0 bottom-0 px-5 pt-12 pb-5 lg:px-6 lg:pb-6 group-hover:opacity-0 transition-opacity ${labelBg}`}>
        <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-cyan_brand">
          {p.category}
        </div>
        <div className={`font-display font-bold tracking-tight text-xl lg:text-2xl ${titleColor}`}>
          {p.title}
        </div>
      </div>
    </motion.button>
  );
}

export default function Projects({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <section id="work" className="relative py-24 lg:py-36" data-testid="projects-section">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold">[ 03 — Selected Work ]</span>
          <div className="h-px flex-1 bg-navy/15" />
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-display font-bold text-navy tracking-tightest text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Twelve marks. <span className="italic font-light">Two websites.</span> One designer.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-lg text-ink/75 leading-relaxed">
              Logo systems, identity work, and full-stack web builds — for in-house brands and outside clients across roofing, auto, lifestyle, and personal brands.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[200px] gap-5">
          {items?.map((p, idx) => (
            <ProjectCard
              key={p.id || `proj-${idx}`}
              project={p}
              idx={idx}
              onOpen={setOpen}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8"
            onClick={() => setOpen(null)}
            data-testid="project-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-cream rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-navy text-cream flex items-center justify-center hover:bg-cyan_brand"
                data-testid="project-modal-close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-[16/10] bg-bone overflow-hidden flex items-center justify-center p-12 rounded-t-3xl">
                <img src={open.image_url} alt={open.title} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="p-8 lg:p-12">
                <div className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold mb-3">{open.category}</div>
                <h3 className="font-display font-bold text-navy text-3xl lg:text-5xl tracking-tightest leading-none">{open.title}</h3>
                <p className="mt-6 text-lg text-ink/80 leading-relaxed">{open.description}</p>
                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-navy/15 pt-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-ink/50 font-bold mb-1">Year</div>
                    <div className="font-display text-xl text-navy">{open.year || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-ink/50 font-bold mb-1">Role</div>
                    <div className="font-display text-xl text-navy">{open.role || "—"}</div>
                  </div>
                  {open.tools?.length > 0 && (
                    <div className="col-span-2">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-ink/50 font-bold mb-2">Tools</div>
                      <div className="flex flex-wrap gap-2">
                        {open.tools.map((t) => (
                          <span key={t} className="px-3 py-1 rounded-full border border-navy/30 text-sm text-navy">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
