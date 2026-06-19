"use client";

import { useReducedMotion } from "framer-motion";
import { SCENES } from "./scenes";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Trilho de capítulos fixo à direita (desktop). Um item por cena; o item da
 * cena ativa (activeId, vindo do useDeck) fica em terracota. Usa mix-blend-mode
 * difference para se manter legível sobre cenas de qualquer cor. Oculto < 820px.
 */
export function ChapterSpine({ activeId }: { activeId: string | null }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  // Cada cena é sticky a top:0, então scrollIntoView não funciona (todas ficam
  // grudadas). A posição de scroll que torna a cena i a visível é index * altura.
  const go = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    window.scrollTo({ top: index * window.innerHeight, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav className="spine" aria-label="Capítulos">
      {SCENES.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={s.id === activeId ? "active" : ""}
          onClick={(e) => go(e, i)}
        >
          <span className="lbl">{t(s.labelKey)}</span>
          <span className="dot" aria-hidden />
        </a>
      ))}
    </nav>
  );
}
