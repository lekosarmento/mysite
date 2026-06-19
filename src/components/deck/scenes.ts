export type SceneTheme = "paper" | "paper2" | "sand" | "ink" | "terra";

export interface SceneMeta {
  /** vira o anchor (#id) e a key do registry de componentes */
  id: string;
  /** chave i18n para o spine e o menu */
  labelKey: string;
  theme: SceneTheme;
}

// ORDEM AUTORITATIVA (spec §4). Reordena de propósito vs. DOM atual.
export const SCENES: SceneMeta[] = [
  { id: "inicio", labelKey: "menu.inicio", theme: "paper" },
  { id: "sobre", labelKey: "menu.sobre", theme: "ink" },
  { id: "tese", labelKey: "menu.tese", theme: "terra" },
  { id: "produtos", labelKey: "menu.produtos", theme: "paper2" },
  { id: "servicos", labelKey: "menu.servicos", theme: "ink" },
  { id: "pontuais", labelKey: "menu.pontuais", theme: "sand" },
  { id: "processo", labelKey: "menu.processo", theme: "paper" },
  { id: "projetos", labelKey: "menu.projetos", theme: "ink" },
  { id: "experiencia", labelKey: "menu.experiencia", theme: "sand" },
  { id: "formacao", labelKey: "menu.formacao", theme: "terra" },
  { id: "stack", labelKey: "menu.stack", theme: "ink" },
  { id: "contato", labelKey: "menu.contato", theme: "ink" },
];
