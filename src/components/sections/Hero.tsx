"use client";

import { motion, MotionConfig } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useLoading } from "@/lib/LoadingContext";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cena 01 do deck (tema paper). O wrapper sticky/altura/centragem vêm do
 * componente Scene; aqui renderizamos só o conteúdo da cena: foto sangrando à
 * direita (duotone quente), copy e HUD. A entrada (kicker/headline/subtitle)
 * só dispara quando a cortina do preloader sobe (useLoading). O recuo no scroll
 * agora é responsabilidade do Scene (--cov), então não há mais parallax próprio.
 */
export function Hero() {
  const { t } = useLanguage();
  const { loading } = useLoading();
  const ready = !loading;

  const headlineWords = t("hero.headline").split(" ");

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const lineV = {
    hidden: { y: "110%" },
    visible: { y: 0, transition: { duration: 1, ease: EASE } },
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* FOTO — sangra à direita da cena */}
      <div className="hero-photo" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/leko-7.png" alt="José Werkley" />
        <div className="duo" />
        <div className="fade" />
      </div>

      {/* COPY */}
      <div className="hero-copy">
        <motion.div
          className="kick"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {t("hero.kicker")}
        </motion.div>

        <motion.h1
          className="big"
          style={{ marginTop: 22 }}
          variants={container}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
        >
          {headlineWords.map((w: string, i: number) => (
            <span key={i} className="block overflow-hidden pb-[0.05em]">
              <motion.span variants={lineV} className="block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="sub"
          style={{ marginTop: 24 }}
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: EASE, delay: 0.55 }}
        >
          {t("hero.subtitle")}
        </motion.p>
      </div>

      {/* HUD */}
      <div className="hud">
        <span>LAT -7.115° · LON -34.861°</span>
        <span>{t("hero.scroll")} ↓</span>
      </div>
    </MotionConfig>
  );
}
