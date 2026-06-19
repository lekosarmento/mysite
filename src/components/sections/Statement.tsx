"use client";

import { useLanguage } from "@/lib/LanguageContext";

/**
 * Cena 03 do deck (tema terra). Posicionamento: frase gigante (statement.line1
 * / line2) + legenda, sobre terracota. Wrapper/centragem vêm do Scene; reveal
 * pelas classes .rv.
 */
export function Statement() {
  const { t } = useLanguage();

  return (
    <>
      <span className="ghost" style={{ color: "var(--cream)" }} aria-hidden>
        —
      </span>

      <div className="idxbig rv">03 — {t("menu.tese")}</div>
      <h2 className="tese-h rv" style={{ marginTop: 18 }}>
        {t("statement.line1")}
        <br />
        {t("statement.line2")}
      </h2>
      <p className="sub rv" style={{ marginTop: 26, maxWidth: "50ch" }}>
        {t("statement.caption")}
      </p>
    </>
  );
}
