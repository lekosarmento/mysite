"use client";

import { useLanguage } from "@/lib/LanguageContext";

/** Cena 10 do deck (tema terra). Formação acadêmica em lista. */
export function Education() {
  const { t } = useLanguage();
  const items = t("education.items") as { title: string; institution: string; status: string }[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--cream)" }} aria-hidden>
        08
      </span>
      <div className="idxbig rv">08 · {t("education.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(34px,5.4vw,76px)", marginTop: 12 }}>
        {t("education.heading")}
      </h2>

      <div className="rows rv">
        {items.map((it, i) => (
          <div className="row" key={i}>
            <span className="rn">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="rt" style={{ fontSize: "clamp(18px,2.4vw,30px)" }}>{it.title}</div>
              {it.institution && <div className="rd">{it.institution}</div>}
            </div>
            {it.status && <span className="rtag">{it.status}</span>}
          </div>
        ))}
      </div>
    </>
  );
}
