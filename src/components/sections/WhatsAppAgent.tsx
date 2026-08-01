"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { sceneNumber } from "@/components/deck/scenes";
import { TechDetail } from "@/components/ui/TechDetail";

interface ProductItem {
  title: string;
  /** parágrafo antigo. Ainda é o que `en`/`es` têm, e o fallback do fluxo */
  desc: string;
  /** entra isto, acontece aquilo, sai aquilo. Três passos, sem parágrafo */
  flow?: [string, string, string] | string[];
  /** termos técnicos do lastro (sempre visíveis). Ausente em `en`/`es` */
  tech?: string[];
  /** detalhe de engenharia, sob demanda. Ausente em `en`/`es` */
  detail?: string;
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
        {sceneNumber("construo")}
      </span>

      <div className="prodhead rv">
        <div className="idxbig">{sceneNumber("construo")} · {t("products.label")}</div>
        <h2 className="title" style={{ fontSize: "clamp(34px,5.4vw,76px)", marginTop: 12 }}>
          {t("products.heading")}
        </h2>
      </div>

      <div className="plist rv">
        {items.map((item, i) => (
          <div className="prow" key={i}>
            <span className="pn">P0{i + 1}</span>
            <span className="pt">{item.title}</span>
            {/* três passos em vez de parágrafo: o visitante entende o que a
                solução faz sem ler prosa. `en`/`es` ainda não têm `flow` e
                caem no parágrafo antigo. */}
            {item.flow?.length ? (
              <span className="pflow">
                {item.flow.map((passo, n) => (
                  <span className="pstep" key={n}>
                    {passo}
                  </span>
                ))}
              </span>
            ) : (
              <span className="pd">{item.desc}</span>
            )}
            <TechDetail
              tech={item.tech}
              detail={item.detail}
              labelMore={t("products.moreDetails") as string}
              labelLess={t("products.lessDetails") as string}
            />
          </div>
        ))}
      </div>
    </>
  );
}
