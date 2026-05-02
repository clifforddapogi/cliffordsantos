import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ resumeUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-cream/75 border-b border-black/5" : ""
      }`}
      data-testid="site-nav"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group" data-testid="nav-logo-link">
          <Logo size={40} />
          <div className="leading-none hidden sm:block">
            <div className="font-display font-bold text-navy tracking-tightest text-[15px]">Clifford Santos</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-ink/60">Designer · Front-End</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="kinetic-link text-sm font-medium text-ink/80 hover:text-navy"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-navy text-cream rounded-full px-5 py-2.5 text-sm font-medium hover:bg-cyan_brand transition-colors"
            data-testid="nav-resume-btn"
          >
            Resume
            <span aria-hidden>↓</span>
          </a>
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            data-testid="nav-mobile-toggle"
          >
            <div className="w-6 h-px bg-ink mb-1.5" />
            <div className="w-6 h-px bg-ink" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-black/10" data-testid="mobile-menu">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium py-2"
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
              >
                {l.label}
              </a>
            ))}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center bg-navy text-cream rounded-full px-5 py-3 text-sm font-medium"
              data-testid="mobile-resume-btn"
            >
              Download Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
