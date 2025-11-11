import React, { useState } from "react";
import { Download } from "lucide-react";
import logoUrl from "../../assets/logo-brain.jpg";

/* Navigation links */
const LINKS = [
  { label: "About",         href: "/#about",        emoji: "✨" },
  { label: "Projects",      href: "/#projects",     emoji: "🧰" },
  { label: "Live Demos",    href: "/live",          emoji: "🧪" },
  { label: "Testimonials",  href: "/#testimonials", emoji: "💬" },
  { label: "Contact",       href: "/#contact",      emoji: "✉️" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleAnchor = (e, href) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      window.location.href = href;
      setOpen(false);
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-40 backdrop-blur-md bg-[#0a0815]/70 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">

        {/* ✅ CLEAN ORIGINAL LOGO (no neon ring) */}
        <a href="/" className="flex items-center gap-2">
          <img
            src={logoUrl}
            alt="KK logo"
            className="h-8 w-8 object-contain"
            loading="eager"
            decoding="async"
          />
          <span className="font-extrabold tracking-wide text-white">KK</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleAnchor(e, l.href)}
                className="nav-fun-link"
              >
                <span className="mr-1">{l.emoji}</span>
                {l.label}
                <span className="ml-2 inline-block text-xs opacity-70">✧</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Resume button */}
        <a
          href="/resume.pdf"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-white text-black
                     px-4 py-2 font-medium hover:shadow-lg transition"
        >
          <Download size={16} /> Download Resume
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/90 px-3 py-2 rounded-lg border border-white/10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0815]/90">
          <ul className="max-w-6xl mx-auto px-4 py-3 space-y-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleAnchor(e, l.href)}
                  className="block px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90"
                >
                  <span className="mr-1">{l.emoji}</span> {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/resume.pdf"
                className="block text-center px-3 py-2 rounded-lg bg-white text-black font-medium"
              >
                <Download size={16} className="inline -mt-1 mr-1" />
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
