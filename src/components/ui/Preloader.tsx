"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLoading } from "@/lib/LoadingContext";
import { useLanguage } from "@/lib/LanguageContext";

const EASE = [0.76, 0, 0.24, 1] as const;
const LAYER_DURATION = 1.0; // s

// Cortinas em camadas, da FRENTE (com o contador) para o fundo. Ao abrir,
// sobem em sequência (stagger) como cortinas de palco, revelando o hero.
// Conceito: "do palco ao deploy" (ink → terra → paper → site).
const LAYERS = [
  { bg: "#13100C", delay: 0 },     // ink (frente, segura o contador)
  { bg: "#B5673F", delay: 0.16 },  // terra
  { bg: "#F2EFE7", delay: 0.32 },  // paper (funde no hero, que também é paper)
];

export function Preloader() {
  const { loading, setLoaded } = useLoading();
  const { t } = useLanguage();
  const reduceRaw = useReducedMotion();

  // Só aplica reduced-motion após o mount (servidor/1ª pintura iguais → sem
  // hydration mismatch para quem tem a preferência).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && reduceRaw;

  const [count, setCount] = useState(0);
  const [opening, setOpening] = useState(false); // cortinas abrindo
  const [gone, setGone] = useState(false); // desmontado

  // Contador 0 → 100 (incremento desacelerando)
  useEffect(() => {
    if (reduce) {
      setCount(100);
      return;
    }
    let p = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      p += Math.max(1, Math.round((100 - p) * 0.08));
      if (p > 100) p = 100;
      setCount(p);
      if (p < 100) timer = setTimeout(tick, 55);
    };
    timer = setTimeout(tick, 55);
    return () => clearTimeout(timer);
  }, [reduce]);

  // Ao chegar em 100: abre as cortinas e libera o resto do site
  useEffect(() => {
    if (count < 100) return;
    const timer = setTimeout(() => {
      setOpening(true);
      setLoaded();
    }, reduce ? 0 : 380);
    return () => clearTimeout(timer);
  }, [count, reduce, setLoaded]);

  // Desmonta depois que a última cortina terminou de subir
  useEffect(() => {
    if (!opening) return;
    const lastDelay = LAYERS[LAYERS.length - 1].delay;
    const total = reduce ? 0 : (lastDelay + LAYER_DURATION) * 1000 + 80;
    const timer = setTimeout(() => setGone(true), total);
    return () => clearTimeout(timer);
  }, [opening, reduce]);

  // Trava o scroll nativo enquanto o preloader está visível
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  if (gone) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden" aria-hidden>
      {LAYERS.map((l, i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={opening ? { y: "-101%" } : { y: 0 }}
          transition={{
            duration: reduce ? 0 : LAYER_DURATION,
            ease: EASE,
            delay: opening && !reduce ? l.delay : 0,
          }}
          className="absolute inset-0"
          style={{ background: l.bg, zIndex: LAYERS.length - i }}
        >
          {/* Contador só na camada da frente (ink) — sobe junto com ela */}
          {i === 0 && (
            <div className="absolute inset-0 flex flex-col justify-end px-8 pb-10 md:px-11">
              <div
                className="font-[700] leading-[0.85] tracking-[-4px] tabular-nums"
                style={{ fontSize: "clamp(60px,13vw,170px)", color: "#F2EFE7" }}
              >
                {count}
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[2px]" style={{ color: "#B5673F" }}>
                <span>{t("preloader.init")}</span>
                <span>{t("preloader.tagline")}</span>
              </div>

              <div className="mt-4 h-px w-full" style={{ background: "rgba(181,103,63,0.22)" }}>
                <div
                  className="h-full"
                  style={{ width: `${count}%`, background: "#B5673F", transition: reduce ? "none" : "width 120ms linear" }}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
