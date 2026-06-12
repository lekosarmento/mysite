"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

interface Project {
  title: string;
  desc: string;
  tags: string[];
  link: string;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const cardContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 } }
      }}
      className="group relative flex flex-col rounded-[12px] p-[36px] md:p-[36px] overflow-hidden transition-all duration-[var(--duration-slow)] ease-[var(--ease-expo)] h-full"
      style={{
        background: "var(--color-bg-card)",
        borderColor: isHovering 
          ? "var(--color-border-hover)" 
          : "var(--color-border-subtle)",
        borderWidth: "1px",
        borderStyle: "solid",
        transform: isHovering ? "translateY(-4px)" : "none",
        boxShadow: isHovering ? "0 16px 48px rgba(0,0,0,0.15)" : "none",
      }}
    >
      {/* Cursor-following glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 rounded-inherit z-0"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 212, 255, 0.06), transparent 60%)`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono text-[11px] tracking-[1px] uppercase border px-3 py-1 rounded-full text-text-secondary border-border-subtle bg-transparent">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-h3 text-text-primary mb-3 tracking-tight">{project.title}</h3>
        <p className="text-[15px] text-text-secondary leading-[1.75] flex-1">{project.desc}</p>

        {project.link && (
          <span
            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[1.5px] text-accent-cyan group-hover:text-text-primary transition-colors duration-300"
          >
            {t("projects.viewProject")} →
          </span>
        )}
      </div>
    </motion.div>
  );

  if (project.link) {
    return (
      <Link href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer">
        {cardContent}
      </Link>
    );
  }

  return <div className="block h-full">{cardContent}</div>;
}

export function Projetos() {
  const { t } = useLanguage();
  const items = t("projects.items") as Project[];

  return (
    <section id="projetos" className="w-full px-6 md:px-10 py-[var(--leko-space-3xl)]">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="mb-[var(--leko-space-2xl)]"
        >
          <SectionLabel>{t("projects.label")}</SectionLabel>
          <h2 className="text-h1 max-w-4xl">{t("projects.heading")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[var(--leko-space-xl)]">
          {items.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
