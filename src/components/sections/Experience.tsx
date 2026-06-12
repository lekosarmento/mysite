"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

interface ExperienceCard {
  company: string;
  desc: string;
}

export function Experience() {
  const { t } = useLanguage();
  const cards = t("experience.cards") as ExperienceCard[];

  return (
    <section id="experiencia" className="w-full px-6 md:px-10 py-[120px] bg-bg-secondary">
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
          <SectionLabel>{t("experience.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl mb-6">{t("experience.heading")}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="max-w-3xl mb-16 border-l-2 border-accent-cyan/20 pl-8"
        >
          <p className="text-body text-text-secondary mb-6 leading-[1.85]">
            {t("experience.body1")}
          </p>
          <p className="text-body text-text-secondary leading-[1.85]">
            {t("experience.body2")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.company}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 } }
              }}
              className="p-8 rounded-[12px] bg-[var(--color-bg-primary)] border border-border-subtle"
            >
              <h3 className="font-mono text-[13px] text-accent-cyan tracking-[2px] uppercase mb-3">
                {card.company}
              </h3>
              <p className="text-[15px] text-text-secondary leading-[1.75]">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
