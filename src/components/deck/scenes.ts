export type SceneTheme = "paper" | "paper2" | "sand" | "ink" | "terra";

export interface SceneMeta {
  /** vira o anchor (#id) e a key do registry de componentes */
  id: string;
  /** chave i18n para o spine e o menu */
  labelKey: string;
  theme: SceneTheme;
}

// ORDEM AUTORITATIVA (11 cenas). Convergência marketing + operação + IA.
export const SCENES: SceneMeta[] = [
  { id: "inicio", labelKey: "menu.inicio", theme: "paper" },
  { id: "sobre", labelKey: "menu.sobre", theme: "ink" },
  { id: "tese", labelKey: "menu.tese", theme: "terra" },
  { id: "construo", labelKey: "menu.construo", theme: "paper2" },
  { id: "diferenciais", labelKey: "menu.diferenciais", theme: "ink" },
  { id: "portfolio", labelKey: "menu.portfolio", theme: "sand" },
  { id: "resultados", labelKey: "menu.resultados", theme: "ink" },
  { id: "experiencia", labelKey: "menu.experiencia", theme: "paper" },
  { id: "formacao", labelKey: "menu.formacao", theme: "terra" },
  { id: "stack", labelKey: "menu.stack", theme: "paper2" },
  { id: "contato", labelKey: "menu.contato", theme: "ink" },
];
