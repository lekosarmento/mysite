"use client";

import type { ReactNode } from "react";
import type { SceneTheme } from "./scenes";

/**
 * Uma cena do deck: wrapper sticky de 100dvh com tema de cor, que empilha
 * sobre a anterior (topo arredondado + sombra). O recuo (escala/translate) e o
 * escurecimento (.scene-dim) são dirigidos pela variável CSS `--cov`, escrita
 * pelo hook useDeck conforme a próxima cena cobre esta.
 */
export function Scene({
  id,
  theme,
  index,
  children,
}: {
  id: string;
  theme: SceneTheme;
  index: number;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-scene={index}
      className={`scene t-${theme}${index > 0 ? " stacked" : ""}`}
      style={{ zIndex: index + 1 }}
    >
      <div className="scene-inner">{children}</div>
      <div className="scene-dim" aria-hidden />
    </section>
  );
}
