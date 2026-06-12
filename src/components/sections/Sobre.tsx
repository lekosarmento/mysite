"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

// STANDBY CONFIG: Set to true to instantly revert to the old fully-visible layout.
const FORCE_FULLY_OPEN = false;

const brands = [
  "Jack Daniel's",
  "Ambev",
  "Kwai",
  "Pringles",
  "Red Bull",
  "Café de La Musique",
  "Jeep",
  "Corona",
  "Chivas",
  "Absolut",
];

export function Sobre() {
  const { t } = useLanguage();
  const stats = t("about.stats") as { value: string; label: string }[];
  const [showMore, setShowMore] = useState(false);
  const isExpanded = FORCE_FULLY_OPEN || showMore;

  return (
    <section id="sobre" className="w-full px-6 md:px-10 py-[120px]">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <SectionLabel>{t("about.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl mb-[80px]">
            {t("about.heading")}
          </h2>
        </motion.div>

        {/* Text columns with progressive disclosure (Hybrid Premium) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] md:gap-[80px] border-t border-border-subtle pt-[48px]">
          {/* Left column — Paragraph 1 (always visible) + Paragraphs 2 & 3 (collapsible) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
            }}
          >
            <p className="text-body text-text-secondary mb-6">
              {t("about.paragraph1")}
            </p>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="sobre-expanded-left"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-body text-text-secondary mb-6 text-accent-cyan/80 italic">
                    {t("about.paragraph2")}
                  </p>
                  <p className="text-body text-text-secondary">
                    {t("about.paragraph3")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!FORCE_FULLY_OPEN && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-6 font-mono text-[11px] uppercase tracking-[2px] text-accent-cyan hover:text-text-primary transition-colors duration-300 flex items-center gap-2 group"
              >
                <span>{isExpanded ? t("about.showLess") : t("about.showMore")}</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                  {isExpanded ? "↑" : "→"}
                </span>
              </button>
            )}
          </motion.div>
          
          {/* Right column — Paragraph 4 (collapsible) + stats (always visible) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
            }}
            className="flex flex-col gap-[48px] justify-between"
          >
            <div>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="sobre-expanded-right"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-body text-text-secondary mb-6">
                      {t("about.paragraph4")}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="flex flex-wrap gap-12 mt-4"
            >
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="flex flex-col"
                >
                  <span className="font-mono text-h2 text-text-primary mb-1">{stat.value}</span>
                  <span className="font-mono text-[11px] text-text-muted">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* 
          =========================================
          ORIGINAL FULLY-VISIBLE LAYOUT STANDBY:
          =========================================
          To fully revert here, just set FORCE_FULLY_OPEN = true at the top.
          Or swap the Text columns div with this block:

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] md:gap-[80px] border-t border-border-subtle pt-[48px]">
            <motion.div ...>
              <p className="text-body text-text-secondary mb-6">{t("about.paragraph1")}</p>
              <p className="text-body text-text-secondary mb-6 text-accent-cyan/80 italic">{t("about.paragraph2")}</p>
              <p className="text-body text-text-secondary">{t("about.paragraph3")}</p>
            </motion.div>
            <motion.div ... className="flex flex-col gap-[48px]">
              <p className="text-body text-text-secondary">{t("about.paragraph4")}</p>
              <motion.div ...>...stats...</motion.div>
            </motion.div>
          </div>
          =========================================
        */}

        {/* Full-width row: Portrait (left) + Brands (right) */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] gap-6 md:gap-8 mt-16">
          {/* Portrait — B&W, brighten slightly on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative aspect-[3/4] rounded-[16px] overflow-hidden group bg-[var(--color-bg-secondary)] border border-border-subtle"
          >
            <div 
              className="absolute inset-0 bg-cover grayscale brightness-[0.7] md:group-hover:brightness-[0.85] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-md:brightness-[0.75]"
              style={{ backgroundImage: "url('/leko-sobre.jpg')", backgroundPosition: "center 15%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/90 via-transparent to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]" />
          </motion.div>

          {/* Brands — wider area, filling available space */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="relative rounded-[16px] bg-[var(--color-bg-secondary)] border border-border-subtle p-8 md:p-10 flex flex-col justify-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-[3px] text-text-muted mb-8">
              {t("credentials.label")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="font-mono text-[12px] md:text-[13px] uppercase tracking-[1.5px] text-text-muted/60 select-none whitespace-nowrap"
                >
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
