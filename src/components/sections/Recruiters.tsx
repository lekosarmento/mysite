"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

// STANDBY CONFIG: Set to true to instantly revert to the old fully-visible layout.
const FORCE_FULLY_OPEN = false;

interface StackGroup {
  group: string;
  items: string[];
}

export function Recruiters() {
  const { t } = useLanguage();
  const stackGroups = t("recruiters.stackGroups") as StackGroup[];
  const projectsList = t("recruiters.projectsList") as string[];
  const [showDetails, setShowDetails] = useState(false);
  const isExpanded = FORCE_FULLY_OPEN || showDetails;

  return (
    <section id="recrutadores" className="w-full px-6 md:px-10 py-[120px] bg-bg-secondary">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
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
          <SectionLabel>{t("recruiters.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl mb-2">{t("recruiters.heading")}</h2>
        </motion.div>

        {/* Stack — grouped (Always visible, highly scannable) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="font-mono text-[11px] uppercase tracking-[3px] text-accent-cyan mb-8">
            {t("recruiters.stackLabel")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stackGroups.map((group, i) => (
              <div key={group.group} className="p-5 rounded-[12px] bg-[var(--color-bg-primary)] border border-border-subtle">
                <h4 className="font-mono text-[10px] uppercase tracking-[2px] text-text-muted mb-4">{group.group}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-[12px] px-3.5 py-1.5 rounded-full border border-border-subtle text-text-secondary transition-all duration-300 hover:border-accent-cyan hover:text-accent-cyan cursor-default select-none"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Toggle Button for Details */}
        {!FORCE_FULLY_OPEN && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mb-12 font-mono text-[11px] uppercase tracking-[2px] text-accent-cyan hover:text-text-primary transition-colors duration-300 flex items-center gap-2 group select-none"
          >
            <span>{isExpanded ? t("recruiters.lessDetails") : t("recruiters.moreDetails")}</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
              {isExpanded ? "↑" : "→"}
            </span>
          </button>
        )}

        {/* Collapsible technical details */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="recruiter-details-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              {/* Detailed copy description paragraph */}
              <div className="mb-12 max-w-3xl">
                <p className="text-body text-text-secondary leading-[1.85]">
                  {t("recruiters.body")}
                </p>
              </div>

              {/* Demonstrable Projects */}
              <div className="mb-16">
                <h3 className="font-mono text-[11px] uppercase tracking-[3px] text-accent-cyan mb-6">
                  {t("recruiters.projectsLabel")}
                </h3>
                <ul className="flex flex-col gap-3 max-w-3xl">
                  {projectsList.map((proj, i) => (
                    <li key={i} className="text-[15px] text-text-secondary leading-[1.7]">
                      → {proj}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Looking For & CTAs — Always visible at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="pt-12 border-t border-border-subtle"
        >
          <h3 className="font-mono text-[11px] uppercase tracking-[3px] text-accent-cyan mb-4">
            {t("recruiters.lookingLabel")}
          </h3>
          <p className="text-body text-text-secondary mb-8">
            {t("recruiters.lookingBody")}
          </p>
          <p className="text-body text-text-secondary italic mb-8">
            {t("recruiters.closingLine")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/5583981741213?text=Oi%20Leko%2C%20sou%20recrutador%20e%20quero%20conversar%20sobre%20uma%20oportunidade"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] uppercase tracking-[1.5px] px-6 py-3 rounded-full border border-[rgba(0,212,255,0.3)] text-accent-cyan hover:bg-[#00D4FF] hover:text-black transition-all duration-[400ms]"
            >
              {t("recruiters.cta_whatsapp")}
            </a>
            <Link
              href="https://linkedin.com/in/lekosarmento"
              target="_blank"
              className="font-mono text-[12px] uppercase tracking-[1.5px] px-6 py-3 rounded-full border border-border-subtle text-text-secondary hover:border-white hover:text-white transition-all duration-[400ms]"
            >
              {t("recruiters.cta_linkedin")}
            </Link>
            <Link
              href="https://github.com/lekosarmento"
              target="_blank"
              className="font-mono text-[12px] uppercase tracking-[1.5px] px-6 py-3 rounded-full border border-border-subtle text-text-secondary hover:border-white hover:text-white transition-all duration-[400ms]"
            >
              {t("recruiters.cta_github")}
            </Link>
          </div>
        </motion.div>

        {/* 
          =========================================
          ORIGINAL FULLY-VISIBLE LAYOUT STANDBY:
          =========================================
          To fully revert here, just set FORCE_FULLY_OPEN = true at the top.
          Or swap the recruiters container details with this block:

          <div className="mx-auto max-w-[1400px]">
            <motion.div ...>
              <SectionLabel>{t("recruiters.label")}</SectionLabel>
              <h2 className="text-h1 max-w-4xl mb-6">{t("recruiters.heading")}</h2>
              <p className="text-body text-text-secondary max-w-3xl leading-[1.85]">{t("recruiters.body")}</p>
            </motion.div>
            
            ... stackGroups and projectsList in their original linear order ...
          </div>
          =========================================
        */}
      </div>
    </section>
  );
}
