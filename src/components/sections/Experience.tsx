"use client";

import { useLanguage } from "@/lib/LanguageContext";

/** Cena 09 do deck (tema sand). Experiência: lead + 4 cards de empresas. */
export function Experience() {
  const { t } = useLanguage();
  const cards = t("experience.cards") as { company: string; desc: string }[];

  return (
    <>
      <div className="idxbig rv">07 · {t("experience.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(32px,5vw,68px)", marginTop: 12 }}>
        {t("experience.heading")}
      </h2>
      <p className="ed-lead rv">
        {t("experience.body1")} {t("experience.body2")}
      </p>

      <div className="cards c4 rv">
        {cards.map((c, i) => (
          <div className="card" key={i}>
            <div className="ch">{c.company}</div>
            <div className="cd">{c.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
