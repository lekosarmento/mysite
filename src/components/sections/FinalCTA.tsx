"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export function FinalCTA() {
  const { t } = useLanguage();

  const links = [
    {
      label: t("finalCta.cta_whatsapp"),
      href: "https://wa.me/5583981741213?text=Oi%20Leko%2C%20vim%20pelo%20site",
      primary: true,
    },
    {
      label: t("finalCta.cta_email"),
      href: "mailto:werkley.jose@gmail.com?subject=Contato%20pelo%20site%20leko.ai",
      primary: false,
    },
    {
      label: t("finalCta.cta_linkedin"),
      href: "https://linkedin.com/in/lekosarmento",
      primary: false,
    },
    {
      label: t("finalCta.cta_github"),
      href: "https://github.com/lekosarmento",
      primary: false,
    },
    {
      label: t("finalCta.cta_instagram"),
      href: "https://instagram.com/leko_werkley",
      primary: false,
    },
  ];

  return (
    <section id="contato" className="w-full px-6 md:px-10 py-[120px] md:py-[160px] bg-bg-secondary">
      <div className="mx-auto max-w-[800px] text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <h2 className="text-h2 md:text-h1 text-text-primary mb-6 leading-[1.15]">
            {t("finalCta.heading")}
          </h2>
          <p className="text-body text-text-secondary mb-12">
            {t("finalCta.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={`font-mono text-[12px] uppercase tracking-[1.5px] px-6 py-3 rounded-full transition-all duration-[400ms] ${
                link.primary
                  ? "border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary"
                  : "border border-border-subtle text-text-secondary hover:border-text-primary hover:text-text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
