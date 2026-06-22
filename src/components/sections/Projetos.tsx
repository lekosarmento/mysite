"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface Project {
  title: string;
  desc: string;
  tags: string[];
  link: string;
}

/**
 * Cena 06 do deck (tema sand). Portfólio de produtos IA em cards com inicial
 * gigante; tags + link (ou "em produção" quando não há link público).
 */
export function Projetos() {
  const { t } = useLanguage();
  const items = t("projects.items") as Project[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--terra)" }} aria-hidden>
        06
      </span>
      <div className="idxbig rv">06 · {t("projects.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(30px,4.4vw,58px)", marginTop: 10 }}>
        {t("projects.heading")}
      </h2>

      <div className="cards c3 rv">
        {items.map((p, i) => {
          const inner = (
            <>
              <div className="init">{p.title.charAt(0)}</div>
              {!p.link && <div className="soon">{t("projects.inProduction")}</div>}
              <div className="ch" style={{ marginTop: 14 }}>{p.title}</div>
              <div className="cd">{p.desc}</div>
              <div className="tags">
                {p.tags.map((tg) => (
                  <span className="tag" key={tg}>
                    {tg}
                  </span>
                ))}
              </div>
              {p.link && (
                <span className="rtag" style={{ marginTop: 14, color: "var(--terra)" }}>
                  {t("projects.viewProject")} →
                </span>
              )}
            </>
          );
          return p.link ? (
            <Link
              className="projcard"
              key={i}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {inner}
            </Link>
          ) : (
            <div className="projcard" key={i}>
              {inner}
            </div>
          );
        })}
      </div>
    </>
  );
}
