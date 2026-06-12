"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { HeroScene } from "../3d/HeroScene";
import { useLanguage } from "@/lib/LanguageContext";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Hero() {
  const { scrollY } = useScroll();
  const y3D = useTransform(scrollY, [0, 800], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden px-6 md:px-10">
      {/* 3D Hologram Background */}
      <motion.div style={{ y: y3D, opacity: opacityHero }} className="absolute inset-0 pointer-events-none z-0">
        <HeroScene />
      </motion.div>

      {/* Text Backdrop Gradient — dynamically themed using custom class for robustness */}
      <div className="absolute inset-0 w-full md:w-[65vw] hero-backdrop-gradient pointer-events-none z-[3]" />

      <motion.div style={{ opacity: opacityHero }} className="relative z-10 flex w-full max-w-[1400px] flex-col gap-0 mx-auto pointer-events-none mt-16 md:pl-8">
        {/* Headline — "José Werkley" */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(44px,6.5vw,88px)] font-[200] leading-[1.0] tracking-[-3px] text-text-primary"
        >
          {t("hero.headline")}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-[15px] md:text-[16px] font-[400] leading-[1.85] text-text-secondary mt-7 max-w-[520px] pointer-events-auto"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Three Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 pointer-events-auto w-full sm:w-auto"
        >
          <button
            onClick={() => scrollToSection("produtos")}
            className="font-mono text-[11px] uppercase tracking-[1.5px] px-6 py-3 rounded-full border border-accent-cyan/25 text-accent-cyan hover:bg-accent-cyan/10 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
          >
            {t("hero.pill_empresa")}
          </button>
          <button
            onClick={() => scrollToSection("recrutadores")}
            className="font-mono text-[11px] uppercase tracking-[1.5px] px-6 py-3 rounded-full border border-border-subtle text-text-secondary hover:border-border-hover hover:text-text-primary transition-all duration-[400ms] cursor-pointer"
          >
            {t("hero.pill_recrutador")}
          </button>
          <button
            onClick={() => scrollToSection("contato")}
            className="font-mono text-[11px] uppercase tracking-[1.5px] px-6 py-3 rounded-full border border-border-subtle text-text-secondary hover:border-border-hover hover:text-text-primary transition-all duration-[400ms] cursor-pointer"
          >
            {t("hero.pill_contato")}
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2 }}
        className="absolute bottom-10 left-6 md:left-10 font-mono text-[10px] uppercase tracking-[3px] text-text-muted animate-pulse"
      >
        {t("hero.scroll")} ↓
      </motion.div>
    </section>
  );
}
