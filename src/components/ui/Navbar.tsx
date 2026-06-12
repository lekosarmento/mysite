"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/lib/LanguageContext";
import { Sun, Moon } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const locales = [
  { code: "pt-BR" as const, label: "PT" },
  { code: "en" as const, label: "EN" },
  { code: "es" as const, label: "ES" },
];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const { locale, setLocale, t } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("leko-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("leko-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { name: t("nav.sobre"), href: "/#sobre" },
    { name: t("nav.servicos"), href: "/#produtos" },
    { name: t("nav.projetos"), href: "/#projetos" },
    { name: t("nav.contato"), href: "/#contato" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (latest > previous && latest > 80) setHidden(true);
    if (latest < previous) setHidden(false);
    setScrolled(latest > 60);
    lastScrollY.current = latest;
  });

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden && !mobileOpen ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 md:px-10",
          scrolled
            ? "header-scrolled backdrop-blur-[20px]"
            : "bg-transparent border-transparent"
        )}
        style={{
          transition: "background-color 600ms cubic-bezier(0.16, 1, 0.3, 1), border-color 600ms",
        }}
      >
        <div className="w-1" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              data-hover="true"
              className="group relative text-[var(--text-small)] text-text-secondary transition-colors duration-[var(--duration-normal)] hover:text-text-primary"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-text-primary transition-all duration-[var(--duration-normal)] ease-[var(--ease-expo)] group-hover:w-full" />
            </Link>
          ))}

          {/* Language Selector */}
          <div className="flex items-center gap-1 ml-2 border-l border-border-subtle pl-6">
            {locales.map((loc, i) => (
              <span key={loc.code} className="flex items-center">
                <button
                  onClick={() => setLocale(loc.code)}
                  data-hover="true"
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[1px] px-2 py-1 rounded transition-all duration-300 cursor-pointer",
                    locale === loc.code
                      ? "text-accent-cyan bg-[rgba(0,212,255,0.1)] dark:bg-[rgba(0,212,255,0.1)]"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {loc.label}
                </button>
                {i < locales.length - 1 && (
                  <span className="text-text-muted text-[10px] mx-0.5">·</span>
                )}
              </span>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 text-text-secondary hover:text-text-primary transition-all duration-300 cursor-pointer rounded-full hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] ml-4"
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary cursor-pointer z-50 relative"
          data-hover="true"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="6" x2="18" y1="6" y2="18" />
                <line x1="6" x2="18" y1="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </>
            )}
          </svg>
        </button>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)] dark:bg-[rgba(0,0,0,0.6)]" onClick={() => setMobileOpen(false)} />

            {/* Drawer */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 h-full w-[280px] bg-[var(--color-bg-primary)] border-l border-border-subtle flex flex-col pt-24 px-8 gap-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-[18px] text-text-secondary py-3 border-b border-border-subtle hover:text-text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {/* Language selector in drawer */}
              <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border-subtle">
                {locales.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => { setLocale(loc.code); setMobileOpen(false); }}
                    className={cn(
                      "font-mono text-[12px] uppercase tracking-[1px] px-3 py-2 rounded cursor-pointer transition-all",
                      locale === loc.code
                        ? "text-accent-cyan bg-[rgba(0,212,255,0.1)] dark:bg-[rgba(0,212,255,0.1)]"
                        : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>

              {/* Theme toggle in drawer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
                <span className="font-mono text-[11px] uppercase tracking-[1px] text-text-muted">Tema</span>
                <button
                  onClick={() => { toggleTheme(); setMobileOpen(false); }}
                  className="flex items-center justify-center p-2.5 rounded-full border border-border-subtle text-text-secondary hover:text-text-primary cursor-pointer"
                  aria-label="Alternar tema"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
