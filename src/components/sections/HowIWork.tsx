"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

interface Step {
  num: string;
  title: string;
  desc: string;
}

export function HowIWork() {
  const { t } = useLanguage();
  const steps = t("howIWork.steps") as Step[];

  return (
    <section id="processo" className="w-full px-6 md:px-10 py-[120px] bg-bg-secondary">
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
          <SectionLabel>{t("howIWork.label")}</SectionLabel>
          <h2 className="text-h1 max-w-3xl mb-4">{t("howIWork.heading")}</h2>
          <p className="text-body text-text-secondary max-w-xl">{t("howIWork.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 } }
              }}
              className="relative p-8 rounded-[12px] bg-[var(--color-bg-primary)] border border-border-subtle"
            >
              <span className="font-mono text-[13px] text-accent-cyan tracking-[2px] mb-5 block">
                {step.num}.
              </span>
              <h3 className="text-h3 text-text-primary mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[15px] text-text-secondary leading-[1.75]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
