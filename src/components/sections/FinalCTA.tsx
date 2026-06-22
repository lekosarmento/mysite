"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Cena 12 do deck (tema ink). Contato: heading + pills de contato + os dados
 * do antigo Footer (identidade, local, WhatsApp, e-mail), migrados para cá já
 * que o Footer não é mais uma seção própria.
 */
export function FinalCTA() {
  const { t } = useLanguage();

  const links = [
    {
      label: t("finalCta.cta_whatsapp"),
      href: "https://wa.me/5583981741213?text=Oi%20Leko%2C%20vim%20pelo%20site",
      primary: true,
    },
    {
      label: t("finalCta.cta_email"),
      href: "mailto:werkley.jose@gmail.com?subject=Contato%20pelo%20site%20leko.ai",
      primary: false,
    },
    { label: t("finalCta.cta_linkedin"), href: "https://linkedin.com/in/lekosarmento", primary: false },
    { label: t("finalCta.cta_github"), href: "https://github.com/lekosarmento", primary: false },
    { label: t("finalCta.cta_instagram"), href: "https://instagram.com/leko_werkley", primary: false },
  ];

  return (
    <>
      <div className="idxbig rv">10 · {t("menu.contato")}</div>
      <h2
        className="title rv"
        style={{ fontSize: "clamp(32px,5vw,80px)", marginTop: 12, maxWidth: "18ch" }}
      >
        {t("finalCta.heading")}
      </h2>
      <p className="ed-lead rv">{t("finalCta.subtitle")}</p>

      <div className="pills rv">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={`pill${l.primary ? " primary" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="contact-foot rv">
        <span>{t("footer.identity")}</span>
        <span>{t("footer.location")}</span>
        <span>{t("footer.whatsapp")}</span>
        <span>{t("footer.email")}</span>
      </div>
    </>
  );
}
