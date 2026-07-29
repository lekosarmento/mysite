"use client";

import type { CSSProperties } from "react";

import { useLanguage } from "@/lib/LanguageContext";

// Logomarcas em /public/images/brands/<file>.png — já monocromáticas (branco)
// com fundo vazado, geradas a partir dos arquivos originais das marcas.
// `scale` é o ajuste ÓPTICO: com altura fixa, wordmark larga (Heineken) pesa
// mais que logo empilhada (Jack Daniel's), então a larga encolhe e a alta cresce.
const brands = [
  { name: "Jack Daniel's", file: "jack-daniels", scale: 1.31 },
  { name: "Red Bull", file: "red-bull", scale: 1.25 },
  { name: "Heineken", file: "heineken", scale: 0.85 },
  { name: "Brahma", file: "brahma", scale: 0.89 },
  { name: "Corona", file: "corona", scale: 1.23 },
  { name: "Jeep", file: "jeep", scale: 1.05 },
  { name: "Kwai", file: "kwai", scale: 0.93 },
  { name: "O Boticário", file: "boticario", scale: 1.02 },
  { name: "Café de La Musique", file: "cafe-de-la-musique", scale: 1.15 },
  { name: "Moises", file: "moises", scale: 1.21 },
];

/**
 * Cena 02 do deck (tema ink). Layout editorial 2 colunas: foto à esquerda,
 * texto + stats + marcas à direita, com número-fantasma "02" ao fundo. O
 * wrapper sticky/centragem vem do Scene; o reveal usa as classes .rv.
 */
export function Sobre() {
  const { t } = useLanguage();
  const stats = t("about.stats") as { value: string; label: string }[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--cream)" }} aria-hidden>
        02
      </span>

      <div className="about">
        <div className="ph rv">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/leko-sobre.jpg" alt="José Werkley" />
        </div>

        <div>
          <div className="idxbig rv">02 · {t("about.label")}</div>
          <h2 className="title rv" style={{ fontSize: "clamp(34px,5.4vw,76px)", marginTop: 14 }}>
            {t("about.heading")}
          </h2>
          {/* dois parágrafos e ponto. Os números (15+, 1.000+, MBA) estão nos
              stats logo abaixo e as marcas estão no mural de logos: repetir
              isso em prosa era dizer três vezes a mesma coisa. */}
          <p className="rv">{t("about.paragraph1")}</p>
          <p className="rv">{t("about.paragraph2")}</p>

          <div className="stats rv">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="v">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="brandwall rv">
            <span className="brandwall-label">{t("credentials.label")}</span>
            <div className="brandwall-logos">
              {brands.map((b) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={b.file}
                  src={`/images/brands/${b.file}.png`}
                  alt={b.name}
                  title={b.name}
                  loading="lazy"
                  style={{ "--logo-scale": b.scale } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
