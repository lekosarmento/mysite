"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

interface OfferItem {
  title: string;
  body: string;
  delivery: string;
}

export function Offers() {
  const { t } = useLanguage();
  const items = t("offers.items") as OfferItem[];

  return (
    <section id="servicos" className="w-full px-6 md:px-10 py-[120px]">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="mb-[80px]"
        >
          <SectionLabel>{t("offers.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl">{t("offers.heading")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 } }
              }}
              className="group relative p-8 md:p-10 rounded-[12px] bg-[var(--color-bg-card)] border border-border-subtle transition-all duration-500 hover:border-border-hover flex flex-col"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-[12px] bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.04),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 flex flex-col flex-1">
                <h3 className="text-h3 text-text-primary mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[15px] text-text-secondary leading-[1.75] flex-1">
                  {item.body}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[1px] text-text-muted mt-8 pt-6 border-t border-border-subtle">
                  {item.delivery}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
