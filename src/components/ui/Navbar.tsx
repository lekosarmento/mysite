"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "@/lib/LanguageContext";
import { useMenu } from "@/lib/MenuContext";
import { Sun, Moon } from "lucide-react";
import { ScrambleMenu } from "@/components/ui/ScrambleMenu";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const locales = [
  { code: "pt-BR" as const, label: "PT" },
  { code: "en" as const, label: "EN" },
  { code: "es" as const, label: "ES" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openMenu } = useMenu();
  const { scrollY } = useScroll();
  const { locale, setLocale, t } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("leko-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("leko-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  // A navbar é FIXA do início ao fim (não some ao rolar) — o menu precisa
  // estar sempre acessível; só o fundo ganha blur depois de rolar.
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  return (
    <>
      <motion.header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between px-6 md:px-10",
          scrolled ? "header-scrolled backdrop-blur-[20px]" : "border-transparent bg-transparent"
        )}
        style={{
          transition: "background-color 600ms cubic-bezier(0.16, 1, 0.3, 1), border-color 600ms",
        }}
      >
        <div className="w-1" />

        {/* No topo (sem a faixa blur), os controles ficam sobre a foto escura do
            hero — a pílula translúcida garante contraste desde o primeiro paint. */}
        <div
          className={cn(
            "flex items-center gap-5 rounded-full px-4 py-1.5 transition-colors duration-500 md:gap-7",
            !scrolled &&
              "bg-[rgba(242,239,231,0.78)] backdrop-blur-md dark:bg-[rgba(18,16,12,0.65)]"
          )}
        >
          {/* Language Selector */}
          <div className="flex items-center gap-1">
            {locales.map((loc, i) => (
              <span key={loc.code} className="flex items-center">
                <button
                  onClick={() => setLocale(loc.code)}
                  data-hover="true"
                  className={cn(
                    "cursor-pointer rounded px-2 py-1 font-mono text-[11px] uppercase tracking-[1px] transition-all duration-300",
                    locale === loc.code
                      ? "bg-[rgba(181,103,63,0.1)] text-accent-cyan"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {loc.label}
                </button>
                {i < locales.length - 1 && (
                  <span className="mx-0.5 text-[10px] text-text-muted">·</span>
                )}
              </span>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            data-hover="true"
            className="flex cursor-pointer items-center justify-center rounded-full p-2 text-text-secondary transition-all duration-300 hover:bg-[rgba(0,0,0,0.05)] hover:text-text-primary dark:hover:bg-[rgba(255,255,255,0.05)]"
            aria-label="Alternar tema"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Menu trigger */}
          <button
            onClick={openMenu}
            data-hover="true"
            className="flex cursor-pointer items-center gap-2.5 text-text-primary"
            aria-label={t("menu.open")}
          >
            {/* Três barrinhas verticais */}
            <span className="relative block h-[16px] w-[16px]">
              <span className="absolute left-0 top-0 h-full w-px bg-current" />
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              <span className="absolute right-0 top-0 h-full w-px bg-current" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[1px]">{t("menu.open")}</span>
          </button>
        </div>
      </motion.header>

      <ScrambleMenu />
    </>
  );
}
