"use client";

import { useLanguage } from "@/lib/LanguageContext";

// Logomarcas em /public/images/brands/<file>.svg (preferir SVG; PNG com fundo
// transparente também serve). Renderizadas em branco (brightness(0) invert(1)).
const brands = [
  { name: "Jack Daniel's", file: "jack-daniels" },
  { name: "Ambev", file: "ambev" },
  { name: "Kwai", file: "kwai" },
  { name: "Pringles", file: "pringles" },
  { name: "Red Bull", file: "red-bull" },
  { name: "Café de La Musique", file: "cafe-de-la-musique" },
  { name: "Jeep", file: "jeep" },
  { name: "Corona", file: "corona" },
  { name: "Chivas", file: "chivas" },
  { name: "Absolut", file: "absolut" },
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

          <div className="brandwall rv">
            <span className="brandwall-label">{t("credentials.label")}</span>
            <div className="brandwall-logos">
              {brands.map((b) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={b.file}
                  src={`/images/brands/${b.file}.svg`}
                  alt={b.name}
                  title={b.name}
                  onError={(e) => {
                    // Enquanto o arquivo da logo não existir, esconde (sem ícone quebrado).
                    e.currentTarget.style.display = "none";
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
