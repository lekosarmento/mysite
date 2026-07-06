"use client";

import { useEffect, useState } from "react";

/**
 * Posição de scroll (document) que deixa a cena `index` visível/colada no topo.
 * As cenas são sticky, então getBoundingClientRect/offsetTop refletem a posição
 * JÁ grudada — por isso soma as alturas de layout das cenas anteriores (estável
 * independente do estado do sticky). Funciona também no mobile (fluxo normal).
 */
export function sceneScrollTop(index: number): number {
  const deck = document.querySelector<HTMLElement>(".deck");
  if (!deck) return index * window.innerHeight;
  // Soma as alturas de layout de tudo que está no fluxo antes da cena alvo
  // (cenas anteriores E pausas .scene-gap — no mobile os gaps têm display:none
  // e contam 0).
  const flow = Array.from(deck.querySelectorAll<HTMLElement>(".scene, .scene-gap"));
  let top = deck.getBoundingClientRect().top + window.scrollY;
  let seen = 0;
  for (const el of flow) {
    const isScene = el.classList.contains("scene");
    if (isScene && seen === index) return top;
    top += el.offsetHeight;
    if (isScene) seen++;
  }
  return top;
}

/**
 * Controlador do deck, com UMA assinatura de scroll:
 * - escreve a variável CSS `--cov` (0→1) por cena = quanto a próxima já a cobriu
 *   (o CSS faz o transform de recuo + o dim);
 * - adiciona `.in` à cena ao entrar (reveal);
 * - deriva a cena ativa (para o ChapterSpine);
 * - dá `top` sticky NEGATIVO a cenas mais altas que a viewport, para que rolem
 *   até o fim do próprio conteúdo antes de a próxima cobri-las (senão o final
 *   ficaria clipado para sempre).
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

    // Cena mais alta que a viewport gruda em top negativo (mostra o FINAL do
    // conteúdo antes de ser coberta). No mobile (≤820px) as cenas são
    // position:relative — top deslocaria o layout, então limpa.
    const measure = () => {
      const vh = window.innerHeight;
      const stacked = window.innerWidth > 820;
      for (const s of scenes) {
        if (!stacked) {
          s.style.removeProperty("top");
          continue;
        }
        const extra = Math.max(0, s.offsetHeight - vh);
        s.style.top = extra ? `-${extra}px` : "0px";
      }
    };

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
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    // Fontes/imagens mudam a altura das cenas depois do 1º paint — re-mede.
    document.fonts?.ready.then(() => {
      measure();
      update();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [deckRef, count]);

  return activeId;
}
