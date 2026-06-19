"use client";

import { useLanguage } from "@/lib/LanguageContext";

const brands = [
  "Jack Daniel's",
  "Ambev",
  "Kwai",
  "Pringles",
  "Red Bull",
  "Café de La Musique",
  "Jeep",
  "Corona",
  "Chivas",
  "Absolut",
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
          <div className="idxbig rv">02 — {t("about.label")}</div>
          <h2 className="title rv" style={{ fontSize: "clamp(34px,5.4vw,76px)", marginTop: 14 }}>
            {t("about.heading")}
          </h2>
          <p className="rv">{t("about.paragraph1")}</p>
          <p className="rv">
            {t("about.paragraph2")} {t("about.paragraph3")} {t("about.paragraph4")}
          </p>

          <div className="stats rv">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="v">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>

          <p className="brands rv">{brands.join(" · ")}</p>
        </div>
      </div>
    </>
  );
}
