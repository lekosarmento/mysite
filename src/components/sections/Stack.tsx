"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

export function Stack() {
  const { t } = useLanguage();
  const categories = t("stack.categories") as { name: string; items: string[] }[];

  return (
    <section id="stack" className="w-full px-6 md:px-10 py-[120px] border-t border-border-subtle">
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
          <SectionLabel>{t("stack.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl mb-4">{t("stack.heading")}</h2>
          <p className="text-body text-text-secondary max-w-xl">{t("stack.subtitle")}</p>
        </motion.div>

        <div className="flex flex-col gap-16">
          {categories.map((category, catIdx) => (
            <motion.div
              key={category.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: catIdx * 0.08 } }
              }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[3px] text-accent-cyan mb-6 block">
                {category.name}
              </span>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="flex flex-wrap gap-3"
              >
                {category.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className="font-mono text-[13px] px-5 py-2.5 rounded-full border border-border-subtle text-text-secondary bg-[var(--color-bg-secondary)] transition-all duration-300 ease-[var(--ease-expo)] hover:border-accent-cyan hover:text-accent-cyan hover:bg-[rgba(0,212,255,0.05)] hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] cursor-default select-none"
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
