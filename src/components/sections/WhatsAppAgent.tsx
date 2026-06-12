"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

// STANDBY CONFIG: Set to true to instantly revert to the old fully-visible layout.
const FORCE_FULLY_OPEN = false;

interface ProductItem {
  title: string;
  desc: string;
  bullets: string[];
}

export function Products() {
  const { t } = useLanguage();
  const items = t("products.items") as ProductItem[];
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="produtos" className="w-full px-6 md:px-10 py-[120px] bg-bg-secondary">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="mb-[60px]"
        >
          <SectionLabel>{t("products.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl">{t("products.heading")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const isExpanded = FORCE_FULLY_OPEN || expandedCards[i];
            return (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 } }
                }}
                className="group relative p-7 rounded-[12px] bg-[var(--color-bg-primary)] border border-border-subtle transition-all duration-500 hover:border-border-hover flex flex-col"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-[12px] bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.04),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col flex-1">
                  <h3 className="text-[17px] text-text-primary font-medium mb-2.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-text-secondary leading-[1.7] mb-5">
                    {item.desc}
                  </p>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key={`bullets-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden mb-4"
                      >
                        <ul className="flex flex-col gap-1.5">
                          {item.bullets.map((bullet, j) => (
                            <li key={j} className="flex items-center gap-2 text-[12px] text-text-muted font-mono">
                              <span className="text-accent-cyan text-[8px]">●</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!FORCE_FULLY_OPEN && (
                    <button
                      onClick={() => toggleCard(i)}
                      className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[1.5px] text-accent-cyan hover:text-text-primary transition-colors duration-300 flex items-center gap-1.5 group select-none self-start"
                    >
                      <span>
                        {isExpanded ? t("products.lessDetails") : t("products.moreDetails")}
                      </span>
                      <span className="transform group-hover:translate-x-0.5 transition-transform duration-300">
                        {isExpanded ? "↑" : "→"}
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 
          =========================================
          ORIGINAL FULLY-VISIBLE LAYOUT STANDBY:
          =========================================
          To fully revert here, just set FORCE_FULLY_OPEN = true at the top.
          Or swap the card flex contents with this block:

          <div className="relative z-10 flex flex-col flex-1">
            <h3 className="text-[17px] text-text-primary font-medium mb-2.5 tracking-tight">
              {item.title}
            </h3>
            <p className="text-[14px] text-text-secondary leading-[1.7] mb-5">
              {item.desc}
            </p>
            <ul className="flex flex-col gap-1.5 mt-auto">
              {item.bullets.map((bullet, j) => (
                <li key={j} className="flex items-center gap-2 text-[12px] text-text-muted font-mono">
                  <span className="text-accent-cyan text-[8px]">●</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          =========================================
        */}
      </div>
    </section>
  );
}

