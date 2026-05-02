import React from "react";
import { Facebook, Linkedin, Twitter, Palette, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";

export default function Footer({ site }) {
  return (
    <footer className="relative bg-navy_deep text-cream overflow-hidden" data-testid="site-footer">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-24 pb-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-12">
            <div className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold mb-6">
              Currently in Toronto · Open to Canadian + remote opportunities
            </div>
            <a
              href={`mailto:${site?.email}`}
              className="block font-display font-black tracking-tightest text-cream hover:text-cyan_brand transition-colors leading-[0.85]"
              style={{ fontSize: "clamp(60px, 14vw, 240px)" }}
              data-testid="footer-cta-link"
            >
              {site?.footer_cta || "Let's make something good."}
            </a>
            <div className="mt-6 flex items-center gap-3 text-cream/70">
              <ArrowUpRight className="w-5 h-5 text-cyan_brand" />
              <a href={`mailto:${site?.email}`} className="kinetic-link text-base font-mono">{site?.email}</a>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-12 gap-8 border-t border-cream/15 pt-10">
          <div className="col-span-12 md:col-span-5 flex items-center gap-3">
            <Logo size={42} light />
            <div>
              <div className="font-display font-bold tracking-tight">Clifford Santos</div>
              <div className="text-xs text-cream/55 uppercase tracking-[0.18em]">Designer · Front-End · Toronto</div>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.22em] text-cream/50 font-bold mb-3">Sitemap</div>
            <ul className="space-y-1.5 text-sm">
              <li><a href="#about" className="kinetic-link hover:text-cyan_brand">About</a></li>
              <li><a href="#experience" className="kinetic-link hover:text-cyan_brand">Experience</a></li>
              <li><a href="#work" className="kinetic-link hover:text-cyan_brand">Work</a></li>
              <li><a href="#contact" className="kinetic-link hover:text-cyan_brand">Contact</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-cream/50 font-bold mb-3">Elsewhere</div>
            <div className="flex items-center gap-3">
              {site?.socials?.linkedin && (
                <a href={site.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-cream/25 flex items-center justify-center hover:bg-cyan_brand hover:border-cyan_brand transition-colors" data-testid="social-linkedin">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {site?.socials?.facebook && (
                <a href={site.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-cream/25 flex items-center justify-center hover:bg-cyan_brand hover:border-cyan_brand transition-colors" data-testid="social-facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {site?.socials?.twitter && (
                <a href={site.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="w-10 h-10 rounded-full border border-cream/25 flex items-center justify-center hover:bg-cyan_brand hover:border-cyan_brand transition-colors" data-testid="social-twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {site?.socials?.deviantart && (
                <a href={site.socials.deviantart} target="_blank" rel="noreferrer" aria-label="DeviantArt" className="w-10 h-10 rounded-full border border-cream/25 flex items-center justify-center hover:bg-cyan_brand hover:border-cyan_brand transition-colors" data-testid="social-deviantart">
                  <Palette className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <div>© {new Date().getFullYear()} Clifford Santos. All marks property of respective owners.</div>
          <div className="flex items-center gap-2 font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan_brand animate-pulse" />
            Designed & built with care.
          </div>
        </div>
      </div>
    </footer>
  );
}
