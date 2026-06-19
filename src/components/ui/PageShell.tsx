"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useMenu, MENU_WIDTH } from "@/lib/MenuContext";

/**
 * Empurra todo o conteúdo (Hero + seções) para a esquerda quando o menu abre,
 * revelando o painel do menu na faixa que surge à direita. Sem escurecer nada.
 *
 * Usa transform via CSS transition (não framer) de propósito: em repouso o
 * transform fica "none", então nenhum descendente fixed/sticky é afetado.
 */
export function PageShell({ children }: { children: ReactNode }) {
  const { open } = useMenu();
  const reduceRaw = useReducedMotion();
  // Só aplica reduced-motion após o mount: servidor e 1ª pintura ficam iguais
  // (com transição), evitando hydration mismatch para quem tem a preferência.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && reduceRaw;

  return (
    <div
      className="w-full"
      style={{
        transform: open ? `translateX(calc(-1 * ${MENU_WIDTH}))` : undefined,
        transition: reduce ? undefined : "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: open ? "transform" : undefined,
      }}
    >
      {children}
    </div>
  );
}
