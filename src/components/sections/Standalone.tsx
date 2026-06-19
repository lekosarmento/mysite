"use client";

import { useLanguage } from "@/lib/LanguageContext";

/** Cena 06 do deck (tema sand). Demandas pontuais em lista + CTA. */
export function Standalone() {
  const { t } = useLanguage();
  const items = t("standalone.items") as string[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--terra)" }} aria-hidden>
        06
      </span>
      <div className="idxbig rv">06 — {t("standalone.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(34px,5.4vw,76px)", marginTop: 12 }}>
        {t("standalone.heading")}
      </h2>
      <p className="ed-lead rv">{t("standalone.subtitle")}</p>

      <div className="rows rv">
        {items.map((it, i) => (
          <div className="row" key={i}>
            <span className="rn">{String(i + 1).padStart(2, "0")}</span>
            <div className="rt" style={{ fontSize: "clamp(16px,2vw,24px)", fontWeight: 400, lineHeight: 1.4 }}>
              {it}
            </div>
          </div>
        ))}
      </div>

      <div className="pills rv">
        <a
          className="pill primary"
          href="https://wa.me/5583981741213?text=Oi%20Leko%2C%20tenho%20uma%20demanda%20pontual"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("standalone.cta")}
        </a>
      </div>
    </>
  );
}
