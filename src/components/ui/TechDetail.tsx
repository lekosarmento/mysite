"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface TechDetailProps {
  /** termos técnicos do lastro, exibidos sempre */
  tech: string[];
  /** detalhe de engenharia, colapsado */
  detail: string;
  labelMore: string;
  labelLess: string;
}

/**
 * Camada técnica de um bloco de conteúdo (cenas Soluções e Portfólio).
 *
 * A linha de lastro em mono fica SEMPRE visível: é ela que mostra ao visitante
 * técnico que existe profundidade sem obrigar o leigo a ler jargão no título.
 * O detalhe de engenharia abre sob demanda.
 */
export function TechDetail({ tech, detail, labelMore, labelLess }: TechDetailProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();

  return (
    <div className="techdetail">
      {/* aria-hidden de propósito: pra leitor de tela isso é uma fileira de
          siglas soltas, e o mesmo conteúdo aparece em prosa dentro de `detail` */}
      <div className="techline" aria-hidden>
        {tech.join(" · ")}
      </div>

      <button
        type="button"
        className="techtoggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? labelLess : labelMore}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="techbody"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
