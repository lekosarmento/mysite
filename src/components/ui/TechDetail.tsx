"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface TechDetailProps {
  /** termos técnicos do lastro, exibidos sempre. Ausente = nada renderiza */
  tech?: string[];
  /** detalhe de engenharia, colapsado. Ausente = só a linha de lastro */
  detail?: string;
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

  // Os dicionários `en` e `es` ainda estão com a copy antiga, sem `tech`/`detail`
  // (sincronia é a fase 5 do plano, presa na aprovação do PT). Sem esta guarda,
  // trocar de idioma derrubava as cenas Soluções e Portfólio inteiras num
  // TypeError de `undefined.join`. Faltando o conteúdo, a camada some em vez de
  // quebrar a página.
  if (!tech?.length && !detail) return null;

  return (
    <div className="techdetail">
      {/* aria-hidden de propósito: pra leitor de tela isso é uma fileira de
          siglas soltas, e o mesmo conteúdo aparece em prosa dentro de `detail` */}
      {tech?.length ? (
        <div className="techline" aria-hidden>
          {tech.join(" · ")}
        </div>
      ) : null}

      {detail ? (
        <button
          type="button"
          className="techtoggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? labelLess : labelMore}
        </button>
      ) : null}

      <AnimatePresence initial={false}>
        {open && detail && (
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
