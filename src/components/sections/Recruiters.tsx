"use client";

import { useLanguage } from "@/lib/LanguageContext";

/** Cena 11 do deck (tema ink). Stack: body + grupos de stack + o que busco. */
export function Recruiters() {
  const { t } = useLanguage();
  const groups = t("recruiters.stackGroups") as { group: string; items: string[] }[];

  return (
    <>
      <div className="idxbig rv">09 · {t("menu.stack")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(30px,4.4vw,58px)", marginTop: 10 }}>
        {t("recruiters.heading")}
      </h2>
      <p className="ed-lead rv" style={{ marginTop: 12 }}>
        {t("recruiters.body")}
      </p>

      <div className="stack-grid rv">
        {groups.map((g, i) => (
          <div key={i}>
            <div className="sg-h">{g.group}</div>
            {g.items.map((it) => (
              <div className="sg-i" key={it}>
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="ed-lead rv" style={{ marginTop: 18, maxWidth: "72ch" }}>
        <strong style={{ fontWeight: 600 }}>{t("recruiters.lookingLabel")}:</strong>{" "}
        {t("recruiters.lookingBody")}
      </p>
    </>
  );
}
