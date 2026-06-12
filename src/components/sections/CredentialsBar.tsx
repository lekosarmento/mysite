"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const brands = [
  "Jack Daniel's",
  "Ambev",
  "Kwai",
  "Pringles",
  "Red Bull",
  "Stone/TON",
  "Tauá Resorts",
];

export function CredentialsBar() {
  const { t } = useLanguage();

  return (
    <section className="w-full px-6 md:px-10 py-16 md:py-20 border-t border-border-subtle">
      <div className="mx-auto max-w-[1400px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] uppercase tracking-[3px] text-text-muted mb-10 text-center"
        >
          {t("credentials.label")}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14"
        >
          {brands.map((brand) => (
            <motion.span
              key={brand}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="font-mono text-[12px] md:text-[13px] uppercase tracking-[2px] text-text-muted/50 select-none whitespace-nowrap"
            >
              {brand}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
