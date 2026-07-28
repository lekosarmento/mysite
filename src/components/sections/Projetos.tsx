"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { TechDetail } from "@/components/ui/TechDetail";

interface Project {
  /** o que o produto resolve, em linguagem de negócio */
  title: string;
  /** nome comercial (Donna, Konklave). Vira o kicker do card */
  product?: string;
  desc: string;
  tags: string[];
  /** ausentes em `en`/`es`, que ainda estão com a copy antiga */
  tech?: string[];
  detail?: string;
  /** preview real da tela. Sem ele o card cai no placeholder */
  image?: string;
  link: string;
}

/**
 * Cena 06 do deck (tema sand). Portfólio de produtos IA em cards.
 *
 * O card NÃO é mais um <Link> envolvendo tudo: ele passou a conter um botão (o
 * disclosure do TechDetail), e botão dentro de link é HTML inválido e quebra o
 * clique. Em vez disso o card é um <div> e o "Ver projeto" é uma âncora com
 * link esticado (`::after` cobrindo o card), o que mantém o card inteiro
 * clicável sem aninhar elementos interativos.
 */
export function Projetos() {
  const { t } = useLanguage();
  const items = t("projects.items") as Project[];

  return (
    <>
      <span className="ghost" style={{ color: "var(--terra)" }} aria-hidden>
        06
      </span>
      <div className="idxbig rv">06 · {t("projects.label")}</div>
      <h2 className="title rv" style={{ fontSize: "clamp(30px,4.4vw,58px)", marginTop: 10 }}>
        {t("projects.heading")}
      </h2>

      <div className="cards c3 rv">
        {items.map((p, i) => (
          <div className="projcard" key={i}>
            {/* prova visual antes do texto. Produto sem tela pública (Donna é
                repositório, o Radar ainda não subiu) fica no placeholder, pra
                grade não desalinhar */}
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="projshot"
                src={p.image}
                alt={p.product ?? p.title}
                width={1200}
                height={750}
                loading="lazy"
              />
            ) : (
              <div className="projshot projshot--soon" aria-hidden>
                {t("projects.imageSoon")}
              </div>
            )}

            {!p.link && <div className="soon">{t("projects.inProduction")}</div>}
            <div className="pname">{p.product}</div>
            <div className="ch">{p.title}</div>
            <div className="cd">{p.desc}</div>
            <div className="tags">
              {p.tags.map((tg) => (
                <span className="tag" key={tg}>
                  {tg}
                </span>
              ))}
            </div>

            <TechDetail
              tech={p.tech}
              detail={p.detail}
              labelMore={t("products.moreDetails") as string}
              labelLess={t("products.lessDetails") as string}
            />

            {p.link && (
              <Link
                className="rtag projlink"
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("projects.viewProject")} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
