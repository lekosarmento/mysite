"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const [visitorCount, setVisitorCount] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === "number") {
          // Format with leading zeros for a premium, high-tech terminal look
          setVisitorCount(String(data.count).padStart(6, "0"));
        }
      })
      .catch((err) => console.error("Error loading visitor count:", err));
  }, []);

  return (
    <footer className="w-full px-6 md:px-10 py-12 border-t border-border-subtle">
      <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Identity & Location */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[15px] text-text-primary font-medium">{t("footer.identity")}</span>
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-[1px]">{t("footer.location")}</span>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-1">
          <a href="https://wa.me/5583981741213" target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] text-text-secondary hover:text-white transition-colors">
            {t("footer.whatsapp")}
          </a>
          <a href="mailto:werkley.jose@gmail.com" className="font-mono text-[12px] text-text-secondary hover:text-white transition-colors">
            {t("footer.email")}
          </a>
        </div>
        
        {/* Social Links */}
        <div className="flex items-center gap-4">
          <Link href="https://instagram.com/leko_werkley" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-all duration-normal ease-expo hover:-translate-y-1 hover:border-white hover:text-white">
            <span className="font-mono text-[10px]">IG</span>
          </Link>
          <Link href="https://linkedin.com/in/lekosarmento" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-all duration-normal ease-expo hover:-translate-y-1 hover:border-white hover:text-white">
            <span className="font-mono text-[10px]">LI</span>
          </Link>
          <Link href="https://github.com/lekosarmento" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-all duration-normal ease-expo hover:-translate-y-1 hover:border-white hover:text-white">
            <span className="font-mono text-[10px]">GH</span>
          </Link>
          <Link href="https://wa.me/5583981741213" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-all duration-normal ease-expo hover:-translate-y-1 hover:border-white hover:text-white">
            <span className="font-mono text-[10px]">WA</span>
          </Link>
        </div>

        {/* Futuristic Visitor Counter */}
        {visitorCount && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted bg-[rgba(15,15,15,0.03)] dark:bg-[rgba(255,255,255,0.03)] border border-border-subtle px-3 py-1 rounded-full select-none transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
            <span className="uppercase tracking-[1px]">{t("footer.visitor_label")}</span>
            <span className="font-semibold text-text-primary tracking-[1px]">{visitorCount}</span>
          </div>
        )}

        <span className="font-mono text-[11px] text-text-muted">{t("footer.year")}</span>
      </div>
    </footer>
  );
}
