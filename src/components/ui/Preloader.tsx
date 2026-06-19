"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLoading } from "@/lib/LoadingContext";
import { useLanguage } from "@/lib/LanguageContext";

// Mesma curva de cortina do protótipo v3 (.pre.done)
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const CURTAIN_DURATION = 1.1;

export function Preloader() {
  const { loading, setLoaded } = useLoading();
  const { t } = useLanguage();
  const reduceRaw = useReducedMotion();
  // Só aplica reduced-motion após o mount (servidor/1ª pintura iguais → sem
  // hydration mismatch na barra/cortina para quem tem a preferência).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && reduceRaw;

  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false); // cortina subindo
  const [gone, setGone] = useState(false); // desmontado

  // Contador 0 → 100 (incremento desacelerando, igual ao protótipo)
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

  // Ao chegar em 100: pausa curta, sobe a cortina e libera o resto do site
  useEffect(() => {
    if (count < 100) return;
    const timer = setTimeout(() => {
      setLifting(true);
      setLoaded();
    }, reduce ? 0 : 300);
    return () => clearTimeout(timer);
  }, [count, reduce, setLoaded]);

  // Desmonta depois que a cortina terminou de subir
  useEffect(() => {
    if (!lifting) return;
    const timer = setTimeout(() => setGone(true), reduce ? 0 : CURTAIN_DURATION * 1000 + 60);
    return () => clearTimeout(timer);
  }, [lifting, reduce]);

  // Trava o scroll nativo enquanto o preloader está visível
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  if (gone) return null;

  return (
    <motion.div
      aria-hidden
      initial={{ y: 0 }}
      animate={{ y: lifting ? "-101%" : 0 }}
      transition={{ duration: reduce ? 0 : CURTAIN_DURATION, ease: CURTAIN_EASE }}
      className="fixed inset-0 z-[120] flex flex-col justify-end px-8 pb-10 md:px-11"
      style={{ backgroundColor: "#0E0D0B" }}
    >
      <div
        className="font-[700] leading-[0.85] tracking-[-4px] tabular-nums"
        style={{ fontSize: "clamp(60px,13vw,170px)", color: "#F2EFE7" }}
      >
        {count}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[2px] text-accent-cyan">
        <span>{t("preloader.init")}</span>
        <span>{t("preloader.ready")}</span>
      </div>

      <div className="mt-4 h-px w-full bg-accent-cyan/20">
        <div
          className="h-full bg-accent-cyan"
          style={{ width: `${count}%`, transition: reduce ? "none" : "width 120ms linear" }}
        />
      </div>
    </motion.div>
  );
}
