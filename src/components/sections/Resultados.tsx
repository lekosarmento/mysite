"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { sceneNumber } from "@/components/deck/scenes";

interface Resultado {
  /** o número, grande. É o que segura o olho de quem varre */
  value: string;
  /** o que o número mede */
  label: string;
  /** onde e em quanto tempo. Número sem contexto não vale nada */
  context: string;
}

/**
 * Cena de resultados de marketing.
 *
 * Existe por um motivo específico: o site provava engenharia (produtos rodando,
 * código, arquitetura) e não provava marketing. Quem chega procurando alguém
 * pra liderar marketing precisa de número com contexto, não de "15 anos de
 * experiência". Aqui os números vêm dos cargos que estão na linha do tempo.
 */
export function Resultados() {
  const { t } = useLanguage();
  const itens = t("resultados.items") as Resultado[];
  const areas = t("resultados.areas") as string[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--cream)" }} aria-hidden>
        {sceneNumber("resultados")}
      </span>

      <div className="idxbig rv">{sceneNumber("resultados")} · {t("resultados.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(32px,5vw,68px)", marginTop: 12 }}>
        {t("resultados.heading")}
      </h2>
      <p className="ed-lead rv">{t("resultados.lead")}</p>

      <div className="res rv">
        {itens.map((r, i) => (
          <div className="res-item" key={i}>
            <div className="res-value">{r.value}</div>
            <div className="res-label">{r.label}</div>
            <div className="res-context">{r.context}</div>
          </div>
        ))}
      </div>

      <div className="res-areas rv">
        <span className="res-areas-label">{t("resultados.areasLabel")}</span>
        <div className="res-areas-list">
          {areas.map((a) => (
            <span className="tag" key={a}>
              {a}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
