"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { TimelineFromDict } from "@/components/ui/Timeline";

/**
 * Cena 07 do deck. Experiência como linha do tempo horizontal.
 *
 * Antes eram quatro cards com nome de empresa e uma frase de atribuição, sem
 * data e sem cargo. Quem procura um head de marketing varre cargo e resultado,
 * e nenhum dos dois aparecia: o site dizia "15 anos de marketing" no abstrato e
 * nunca mostrava "Diretor de marketing" nem "0 a 50 mil no orgânico".
 */
export function Experience() {
  const { t } = useLanguage();

  return (
    <>
      <div className="idxbig rv">07 · {t("experience.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(32px,5vw,68px)", marginTop: 12 }}>
        {t("experience.heading")}
      </h2>
      <p className="ed-lead rv">
        {t("experience.body1")}
      </p>

      <TimelineFromDict />
    </>
  );
}
