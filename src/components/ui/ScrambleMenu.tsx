"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useMenu, MENU_WIDTH } from "@/lib/MenuContext";
import { SCENES } from "@/components/deck/scenes";
import { sceneScrollTop } from "@/components/deck/useDeck";

// Alfabeto de embaralhamento (igual ao protótipo v3)
const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>_[]áéí";
const PANEL_EASE = [0.76, 0, 0.24, 1] as const;

type Item = { idx: string; key: string; href: string; index: number };

// As 12 cenas, na ordem de SCENES (fonte única). A cena início tem id="inicio"
// (é a primeira/topo do deck), então #inicio já leva ao topo — sem #top órfão.
const ITEMS: Item[] = SCENES.map((s, i) => ({
  idx: String(i + 1).padStart(2, "0"),
  key: s.labelKey,
  href: `#${s.id}`,
  index: i,
}));

type ScrambleLinkProps = {
  item: Item;
  index: number;
  open: boolean;
  seq: number;
  reduce: boolean;
  label: string;
  onNavigate: (item: Item, e: React.MouseEvent) => void;
};

function ScrambleLink({ item, index, open, seq, reduce, label, onNavigate }: ScrambleLinkProps) {
  const [out, setOut] = useState(label);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mantém o texto certo ao trocar de idioma
  useEffect(() => {
    setOut(label);
  }, [label]);

  const run = useCallback(() => {
    if (reduce) {
      setOut(label);
      return;
    }
    const q = label.split("").map((c) => ({
      c,
      s: Math.floor(Math.random() * 16),
      e: 16 + Math.floor(Math.random() * 26),
    }));
    const maxF = Math.max(...q.map((o) => o.e));
    let f = 0;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      let s = "";
      q.forEach((x) => {
        s += f >= x.e ? x.c : f >= x.s ? CH[Math.floor(Math.random() * CH.length)] : " ";
      });
      setOut(s);
      f++;
      if (f > maxF) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setOut(label);
      }
    }, 32);
  }, [label, reduce]);

  // Dispara a cada abertura (seq muda), com stagger por índice
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(run, reduce ? 0 : 120 + index * 80);
    return () => clearTimeout(t);
  }, [seq, open, index, reduce, run]);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  return (
    <a
      href={item.href}
      data-hover="true"
      onClick={(e) => onNavigate(item, e)}
      onMouseEnter={run}
      className="group flex items-baseline gap-3.5 py-1.5"
    >
      <span className="font-mono text-[11px] font-normal text-accent-cyan">{item.idx}</span>
      <span
        className="font-[700] tracking-[-1.5px] text-text-primary transition-colors duration-300 group-hover:text-accent-cyan"
        style={{ fontSize: "clamp(22px,3vw,38px)", lineHeight: 1.3, whiteSpace: "pre" }}
      >
        {out}
      </span>
    </a>
  );
}

export function ScrambleMenu() {
  const { open, seq, closeMenu } = useMenu();
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  // ESC fecha
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  // Trava o scroll nativo enquanto o menu está aberto (o conteúdo está deslocado)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavigate = useCallback(
    (item: Item, e: React.MouseEvent) => {
      e.preventDefault();
      closeMenu();
      // Fecha primeiro (libera o scroll travado + reseta o push-aside); rola no próximo
      // frame. Cenas são sticky, então scrollIntoView não serve — sceneScrollTop dá a
      // posição de layout real (vale para desktop empilhado e mobile em fluxo normal).
      requestAnimationFrame(() => {
        const behavior = reduce ? "auto" : "smooth";
        window.scrollTo({ top: sceneScrollTop(item.index), behavior });
      });
    },
    [closeMenu, reduce]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Capturador de clique TRANSPARENTE — fecha ao clicar fora, sem escurecer o site */}
          <motion.div
            key="catch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMenu}
            className="fixed inset-0 z-[92]"
          />
          <motion.nav
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: reduce ? 0 : 0.8, ease: PANEL_EASE }}
            className="fixed bottom-0 right-0 top-0 z-[95] flex flex-col justify-center gap-1 border-l border-border-subtle px-[54px] py-20"
            style={{ width: MENU_WIDTH, backgroundColor: "var(--bg-tertiary)" }}
          >
            <button
              onClick={closeMenu}
              data-hover="true"
              className="absolute right-11 top-[30px] cursor-pointer font-mono text-[11px] uppercase tracking-[1px] text-accent-cyan"
            >
              ✕ {t("menu.close")}
            </button>

            {ITEMS.map((item, i) => (
              <ScrambleLink
                key={item.idx}
                item={item}
                index={i}
                open={open}
                seq={seq}
                reduce={!!reduce}
                label={t(item.key) as string}
                onNavigate={handleNavigate}
              />
            ))}

            <span className="absolute bottom-9 left-[54px] font-mono text-[10px] uppercase tracking-[1px] text-text-muted">
              {t("menu.foot")}
            </span>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
