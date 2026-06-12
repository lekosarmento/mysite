"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

interface EducationItem {
  title: string;
  institution: string;
  status: string;
}

export function Education() {
  const { t } = useLanguage();
  const items = t("education.items") as EducationItem[];

  return (
    <section id="formacao" className="w-full px-6 md:px-10 py-[120px]">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="mb-12"
        >
          <SectionLabel>{t("education.label")}</SectionLabel>
          <h2 className="text-h1 max-w-3xl">{t("education.heading")}</h2>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-3xl">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 p-6 rounded-[12px] bg-[var(--color-bg-card)] border border-border-subtle"
            >
              <div className="flex-1">
                <h3 className="text-[16px] text-text-primary font-medium mb-1">{item.title}</h3>
                {item.institution && (
                  <p className="text-[14px] text-text-muted leading-[1.6]">{item.institution}</p>
                )}
              </div>
              {item.status && (
                <span className="font-mono text-[11px] uppercase tracking-[1px] text-accent-cyan shrink-0 mt-1 md:mt-0.5">
                  {item.status}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
