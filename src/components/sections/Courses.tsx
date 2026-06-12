"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";

export function Courses() {
  const { t } = useLanguage();
  const items = t("courses.items") as { title: string; provider: string; description: string; tags: string[]; url: string }[];

  return (
    <section id="cursos" className="w-full relative py-32 px-6 md:px-10 border-t border-[rgba(255,255,255,0.05)] bg-[#0F0F0F]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <SectionLabel>{t("courses.label")}</SectionLabel>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-light tracking-tight text-white mt-4"
            >
              {t("courses.heading_prefix")}<span className="italic text-[rgba(0,212,255,0.75)]">{t("courses.heading_accent")}</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-text-secondary max-w-sm"
          >
            {t("courses.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((course, i) => (
            <motion.a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              className="group flex flex-col justify-between p-8 rounded-2xl bg-[#151515] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.3)] transition-all duration-500 overflow-hidden relative"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,212,255,0.08),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  {course.tags.map(tag => (
                    <span key={tag} className="font-mono text-[9px] uppercase tracking-[1.5px] text-accent-cyan bg-[rgba(0,212,255,0.05)] px-2 py-1 rounded-sm border border-[rgba(0,212,255,0.1)]">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-light text-white mb-2 group-hover:text-accent-cyan transition-colors">{course.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-[1px] text-text-muted mb-6">{course.provider}</p>
                <p className="text-text-secondary leading-relaxed text-sm">{course.description}</p>
              </div>

              <div className="relative z-10 mt-10 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[2px] text-white">{t("courses.access")}</span>
                <span className="text-accent-cyan transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
