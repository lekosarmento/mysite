"use client";

import { useEffect, useState } from "react";

/**
 * Controlador do deck, com UMA assinatura de scroll:
 * - escreve a variável CSS `--cov` (0→1) por cena = quanto a próxima já a cobriu
 *   (o CSS faz o transform de recuo + o dim);
 * - adiciona `.in` à cena ao entrar (reveal);
 * - deriva a cena ativa (para o ChapterSpine).
 *
 * Usa limiares baseados na posição do topo (não em % de visibilidade), então
 * funciona mesmo para cenas mais altas que a viewport (mobile). Sob
 * prefers-reduced-motion, não escreve `--cov` (o reveal fica no fallback CSS),
 * mas ainda atualiza a cena ativa.
 */
export function useDeck(deckRef: React.RefObject<HTMLElement | null>, count: number) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const scenes = Array.from(el.querySelectorAll<HTMLElement>(".scene"));
    if (!scenes.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      const vh = window.innerHeight;
      let active = scenes[0];
      for (let i = 0; i < scenes.length; i++) {
        const r = scenes[i].getBoundingClientRect();
        if (!reduce && i < scenes.length - 1) {
          const next = scenes[i + 1].getBoundingClientRect();
          let cov = 1 - next.top / vh;
          cov = Math.max(0, Math.min(1, cov));
          scenes[i].style.setProperty("--cov", String(cov));
        }
        if (r.top <= vh * 0.85) scenes[i].classList.add("in"); // reveal ao entrar
        if (r.top <= vh * 0.45) active = scenes[i]; // ativo = topo cruzou ~45%
      }
      if (!reduce) scenes[scenes.length - 1].style.setProperty("--cov", "0");
      const id = active.id;
      setActiveId((prev) => (prev === id ? prev : id));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [deckRef, count]);

  return activeId;
}
