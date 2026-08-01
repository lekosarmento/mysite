"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { sceneNumber } from "@/components/deck/scenes";

/**
 * Cena Formação (tema terra). Dois blocos: diploma e certificação.
 *
 * Antes era uma lista só, e os cursos complementares estavam espremidos dentro
 * do campo de instituição de um item chamado "Estudos Complementares". Diploma
 * e certificado são lidos de formas diferentes: o primeiro é credencial longa,
 * o segundo é sinal de atualização recente. Misturar os dois enfraquece os dois.
 */
export function Education() {
  const { t } = useLanguage();
  const items = t("education.items") as { title: string; institution: string; status: string }[];
  const certs = (t("education.certs") ?? []) as { name: string; issuer?: string }[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--cream)" }} aria-hidden>
        {sceneNumber("formacao")}
      </span>
      <div className="idxbig rv">{sceneNumber("formacao")} · {t("education.label")}</div>
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

      {certs.length > 0 && (
        <div className="certs rv">
          <span className="certs-label">{t("education.certsLabel")}</span>
          <ul className="certs-list">
            {certs.map((c, i) => (
              <li key={i}>
                <span className="certs-name">{c.name}</span>
                {c.issuer && <span className="certs-issuer">{c.issuer}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
