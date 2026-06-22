"use client";

import { useLanguage } from "@/lib/LanguageContext";

interface ProductItem {
  title: string;
  desc: string;
  bullets: string[];
}

/**
 * Cena 04 do deck (tema paper2). Produtos como índice editorial (P01–P06):
 * lista grande com título + descrição à direita, hover desloca. Wrapper/
 * centragem vêm do Scene; reveal pelas classes .rv.
 */
export function Products() {
  const { t } = useLanguage();
  const items = t("products.items") as ProductItem[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--terra)" }} aria-hidden>
        04
      </span>

      <div className="prodhead rv">
        <div className="idxbig">04 · {t("products.label")}</div>
        <h2 className="title" style={{ fontSize: "clamp(34px,5.4vw,76px)", marginTop: 12 }}>
          {t("products.heading")}
        </h2>
      </div>

      <div className="plist rv">
        {items.map((item, i) => (
          <div className="prow" key={i}>
            <span className="pn">P0{i + 1}</span>
            <span className="pt">{item.title}</span>
            <span className="pd">{item.desc}</span>
          </div>
        ))}
      </div>
    </>
  );
}
