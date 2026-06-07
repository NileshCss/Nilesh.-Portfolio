"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Users } from "lucide-react";
import { ConnectModal } from "@/components/ui/ConnectModal";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-60px 0px -55% 0px" }
    );
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Expose modal opener globally so HeroSection can call it */
  useEffect(() => {
    (window as Window & { openConnectModal?: () => void }).openConnectModal = () => setModalOpen(true);
    return () => {
      delete (window as Window & { openConnectModal?: () => void }).openConnectModal;
    };
  }, []);

  return (
    <>
      <ConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
          "bg-white/92 backdrop-blur-[20px] border-b border-slate-200",
          scrolled && "shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
        )}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-[1.3rem] font-black text-slate-900 tracking-tight hover:opacity-80 transition-opacity"
          >
            Nilesh<span className="text-blue-600">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[0.875rem] font-medium transition-all duration-200",
                  activeSection === item.href
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <button
              id="nav-connect-btn"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-[18px] py-2 rounded-lg bg-blue-600 text-white text-[0.875rem] font-semibold hover:bg-blue-500 hover:-translate-y-px hover:shadow-md transition-all duration-200"
            >
              <Users size={14} />
              Connect With Me
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200">
            <ul className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-[0.875rem] font-medium transition-colors",
                      activeSection === item.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-100 mt-1">
                <button
                  onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-[0.875rem] font-semibold text-blue-600"
                >
                  <Users size={14} />
                  Connect With Me
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
