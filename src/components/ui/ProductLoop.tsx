"use client";

import { useEffect, useRef } from "react";

interface ProductLoopProps {
  /** caminho sem extensão: /videos/produtos/<slug>. Serve mp4 e webm */
  video?: string;
  /** print tratado, usado como poster e como fallback quando não há vídeo */
  image?: string;
  alt: string;
  /** legenda do placeholder quando o produto não tem tela pública */
  vazio: string;
}

/**
 * Mídia do card de portfólio: o produto RODANDO, não uma foto dele parado.
 *
 * Três cuidados que o `<video autoplay>` cru não tem:
 *
 * 1. **Só toca o que está na tela.** São quatro loops na mesma cena; deixar os
 *    quatro decodificando o tempo todo esquenta o aparelho à toa. Um
 *    IntersectionObserver dá play/pause conforme entra e sai do viewport.
 * 2. **Nada baixa antes da hora.** `preload="none"` + o poster já tratado que a
 *    cena usava antes: o card aparece completo mesmo com o vídeo não carregado.
 * 3. **Quem pediu menos movimento não recebe movimento.** Com
 *    `prefers-reduced-motion` o vídeo nunca dá play e o poster fica de pé.
 */
export function ProductLoop({ video, image, alt, vazio }: ProductLoopProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (quieto.matches) return;

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          // play() rejeita se o navegador bloquear autoplay; sem o catch isso
          // vira "unhandled rejection" no console do visitante
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (video) {
    return (
      <video
        ref={ref}
        className="projshot"
        poster={image}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
        width={720}
        height={450}
      >
        <source src={`${video}.webm`} type="video/webm" />
        <source src={`${video}.mp4`} type="video/mp4" />
      </video>
    );
  }

  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="projshot" src={image} alt={alt} width={1200} height={750} loading="lazy" />;
  }

  return (
    <div className="projshot projshot--soon" aria-hidden>
      {vazio}
    </div>
  );
}
