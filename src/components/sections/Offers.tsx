"use client";

import { useLanguage } from "@/lib/LanguageContext";

/** Cena 05 do deck (tema ink). Serviços em linhas editoriais. */
export function Offers() {
  const { t } = useLanguage();
  const items = t("offers.items") as { title: string; body: string }[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--cream)" }} aria-hidden>
        05
      </span>
      <div className="idxbig rv">05 — {t("offers.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(32px,5vw,68px)", marginTop: 12 }}>
        {t("offers.heading")}
      </h2>

      <div className="rows rv">
        {items.map((it, i) => (
          <div className="row" key={i}>
            <span className="rn">S0{i + 1}</span>
            <div>
              <div className="rt">{it.title}</div>
              <div className="rd">{it.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
