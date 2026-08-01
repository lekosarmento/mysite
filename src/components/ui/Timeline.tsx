"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useLanguage } from "@/lib/LanguageContext";

export interface TimelineEntry {
  /** período como se lê em voz alta: "2020–2025", "2026–hoje" */
  period: string;
  company: string;
  /** o cargo. É o que um recrutador varre primeiro */
  role: string;
  /** o resultado, não a atribuição. Número quando existe número */
  note: string;
  /** disciplina, vira a etiqueta e a cor do ponto */
  kind: "marketing" | "ia" | "producao";
}

/**
 * Linha do tempo horizontal da carreira.
 *
 * Rola no eixo X e **não sequestra a roda do mouse**: o deck inteiro é dirigido
 * por scroll vertical, então converter wheel em scroll horizontal prenderia o
 * visitante nesta cena. Quem usa mouse anda pelas setas ou arrastando; quem usa
 * toque arrasta; quem usa teclado dá Tab e usa as setas, que é o comportamento
 * nativo de um container rolável com foco.
 */
interface Rotulos {
  anterior: string;
  proximo: string;
  dica: string;
  regiao: string;
}

export function Timeline({ entries, rotulos }: { entries: TimelineEntry[]; rotulos: Rotulos }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [pode, setPode] = useState({ antes: false, depois: false });

  const medir = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const folga = 4; // arredondamento de subpixel faria a seta piscar no fim
    setPode({
      antes: el.scrollLeft > folga,
      depois: el.scrollLeft < el.scrollWidth - el.clientWidth - folga,
    });
  }, []);

  useEffect(() => {
    medir();
    const el = scroller.current;
    if (!el) return;
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [medir, entries.length]);

  const andar = (direcao: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(".tl-item");
    const passo = item ? item.offsetWidth : el.clientWidth * 0.8;
    el.scrollBy({ left: passo * direcao, behavior: "smooth" });
  };

  return (
    <div className="tl rv">
      <div
        className="tl-scroller"
        ref={scroller}
        onScroll={medir}
        tabIndex={0}
        role="region"
        aria-label={rotulos.regiao}
      >
        <ol className="tl-track">
          {entries.map((e, i) => (
            <li className="tl-item" key={i} data-kind={e.kind}>
              <div className="tl-period">{e.period}</div>
              <div className="tl-dot" aria-hidden />
              <div className="tl-role">{e.role}</div>
              <div className="tl-company">{e.company}</div>
              <div className="tl-note">{e.note}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="tl-nav">
        <button type="button" onClick={() => andar(-1)} disabled={!pode.antes} aria-label={rotulos.anterior}>
          ←
        </button>
        <button type="button" onClick={() => andar(1)} disabled={!pode.depois} aria-label={rotulos.proximo}>
          →
        </button>
        <span className="tl-hint">{rotulos.dica}</span>
      </div>
    </div>
  );
}

/** Lê a linha do tempo do dicionário e monta. Fica aqui pra Experience não saber de i18n. */
export function TimelineFromDict() {
  const { t } = useLanguage();
  const entries = t("experience.timeline") as TimelineEntry[] | undefined;
  if (!entries?.length) return null;
  return (
    <Timeline
      entries={entries}
      rotulos={{
        anterior: t("experience.prev") as string,
        proximo: t("experience.next") as string,
        dica: t("experience.hint") as string,
        regiao: t("experience.regionLabel") as string,
      }}
    />
  );
}
