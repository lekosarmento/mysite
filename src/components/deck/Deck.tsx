"use client";

import { useRef } from "react";
import { SCENES } from "./scenes";
import { Scene } from "./Scene";
import { useDeck } from "./useDeck";
import { ChapterSpine } from "./ChapterSpine";
import { useLanguage } from "@/lib/LanguageContext";

import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Statement } from "@/components/sections/Statement";
import { Products } from "@/components/sections/WhatsAppAgent";
import { HowIWork } from "@/components/sections/HowIWork";
import { Projetos } from "@/components/sections/Projetos";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Recruiters } from "@/components/sections/Recruiters";
import { FinalCTA } from "@/components/sections/FinalCTA";

// As 10 cenas do deck, na ordem de SCENES.
// (Products = "O que eu construo"; HowIWork = "Diferenciais"; Projetos = "Portfólio".)
const REGISTRY: Record<string, React.ComponentType> = {
  inicio: Hero,
  sobre: Sobre,
  tese: Statement,
  construo: Products,
  diferenciais: HowIWork,
  portfolio: Projetos,
  experiencia: Experience,
  formacao: Education,
  stack: Recruiters,
  contato: FinalCTA,
};

export function Deck() {
  const ref = useRef<HTMLDivElement>(null);
  const activeId = useDeck(ref, SCENES.length);
  const { t } = useLanguage();

  return (
    <div className="deck" ref={ref}>
      <ChapterSpine activeId={activeId} />
      {SCENES.map((s, i) => {
        const C = REGISTRY[s.id];
        return (
          <Scene key={s.id} id={s.id} theme={s.theme} index={i}>
            {C ? (
              <C />
            ) : (
              <h2
                className="rv"
                style={{ fontWeight: 800, fontSize: "clamp(40px,8vw,120px)", letterSpacing: "-.03em" }}
              >
                {t(s.labelKey)}
              </h2>
            )}
          </Scene>
        );
      })}
    </div>
  );
}
