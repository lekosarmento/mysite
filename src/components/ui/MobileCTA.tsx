"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export function MobileCTA() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const { t } = useLanguage();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show after scrolling past ~80vh
    setVisible(latest > (typeof window !== "undefined" ? window.innerHeight * 0.8 : 600));
  });

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 pb-[max(16px,env(safe-area-inset-bottom))]"
    >
      <a
        href="https://wa.me/5583981741213?text=Oi%20Leko%2C%20vim%20pelo%20site"
        target="_blank"
        rel="noopener noreferrer"
        // o ciano #00D4FF vinha da identidade azul que foi descartada: sobrou
        // aqui e era, no celular, o elemento mais visível do site inteiro fora
        // da paleta. Agora é o terracota do acento.
        className="flex items-center justify-center w-full py-3.5 rounded-full bg-[var(--terra)] text-[var(--cream)] font-mono text-[12px] uppercase tracking-[1.5px] shadow-[0_-4px_30px_rgba(181,103,63,0.32)]"
      >
        {t("mobileCta.label")}
      </a>
    </motion.div>
  );
}
