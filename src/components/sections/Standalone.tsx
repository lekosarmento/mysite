"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

export function Standalone() {
  const { t } = useLanguage();
  const items = t("standalone.items") as string[];

  return (
    <section id="servicos-pontuais" className="w-full px-6 md:px-10 py-[120px]">
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
          <SectionLabel>{t("standalone.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl mb-4">{t("standalone.heading")}</h2>
          <p className="text-body text-text-secondary max-w-xl">{t("standalone.subtitle")}</p>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-3xl mb-12">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              className="p-6 rounded-[12px] bg-[var(--color-bg-card)] border border-border-subtle"
            >
              <p className="text-[15px] text-text-secondary leading-[1.75]">{item}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="https://wa.me/5583981741213?text=Oi%20Leko%2C%20quero%20falar%20sobre%20um%20projeto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[1.5px] px-8 py-3.5 rounded-full border border-border-subtle text-text-primary hover:bg-text-primary hover:text-bg-primary transition-all duration-[400ms]"
          >
            {t("standalone.cta")} →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
