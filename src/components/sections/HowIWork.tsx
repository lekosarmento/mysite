"use client";

import { useLanguage } from "@/lib/LanguageContext";

/** Cena 07 do deck (tema paper). Processo: 4 passos em cards. */
export function HowIWork() {
  const { t } = useLanguage();
  const steps = t("howIWork.steps") as { num: string; title: string; desc: string }[];

  return (
    <>
      <div className="idxbig rv">05 — {t("howIWork.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(34px,5.4vw,76px)", marginTop: 12 }}>
        {t("howIWork.heading")}
      </h2>
      <p className="ed-lead rv">{t("howIWork.subtitle")}</p>

      <div className="cards c4 rv">
        {steps.map((s, i) => (
          <div className="card" key={i}>
            <div className="cn">{s.num}</div>
            <div className="ch">{s.title}</div>
            <div className="cd">{s.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
