# Design System & Brand Guidelines — Leko Sarmento

Este guia contém as especificações exatas construídas no seu site (versão V5). Use essas regras para criar posts no Instagram, LinkedIn ou banners, garantindo que toda a sua comunicação visual pareça uma extensão direta da sua plataforma web.

---

## 1. Tipografia (As Fontes)

A identidade visual do site usa um contraste drástico entre uma fonte "limpa e humana" (Inter) e uma fonte "técnica e de código" (IBM Plex Mono).

**A. Família Principal (Títulos e Textos Longos): `Inter`**
- **Uso:** Headlines, descrições, textos de leitura.
- **Peso (Weight):** 
  - **Extra Light (200):** Para títulos GIGANTES (ex: "Transformo ideias em..."). Use sempre acompanhado de uma palavra em Itálico para dar o tom editorial.
  - **Regular (400):** Para parágrafos e subtítulos.
- **Destaque de Itálico:** Onde houver destaque em itálico, a cor deve ser o **Cyan Muted** (`#00D4FF` com 75% de opacidade).

**B. Família Secundária (Tags, Botões e Metadados): `IBM Plex Mono`**
- **Uso:** Categorias, pequenas tags no topo, e CTAs (Botões).
- **Peso:** Regular (400).
- **Formatação:** SEMPRE em MAIÚSCULAS (`UPPERCASE`).
- **Espaçamento (Tracking/Letter-spacing):** Muito largo. Entre `1.5px` (botões) e `4px` (tags superiores).

---

## 2. Paleta de Cores (Dark Mode Premium)

O site não usa o preto absoluto (`#000000`) para não cansar a vista. Usamos escalas de cinza muito profundos com saltos de iluminação pontuais.

**Fundos (Backgrounds):**
- **Fundo Principal (Void):** `#0F0F0F` (O vazio onde a rede neural respira).
- **Fundo Secundário (Cards):** `#151515` (Usado dentro de caixas ou cartões para descolar do fundo).
- **Fundo Terciário (Bordas internas):** `#1C1C1C`.

**Textos (Tipografia):**
- **Texto Primário (Títulos):** `#FFFFFF` (Branco puro para impacto máximo).
- **Texto Secundário (Parágrafos):** `#A3A3A3` (Evita ofuscar a visão em grandes blocos textuais).
- **Texto Mudo (Tags):** `#666666`.

**Cores de Acento (A aura da IA):**
*Essas são as cores emissivas. Em posts, use elas como efeitos de "Glow", luzes de desfoque (blur), ou textos cirúrgicos em itálico.*
- **Cyan Principal (Holograma):** `#00D4FF` (Cor da energia central).
- **Purple (Sombras/Transições):** `#8B5CF6` (Suporte de profundidade para o Cyan).
- **Amber (Sinapses/Pulsos):** `#FF6B35` (Usado APENAS para os "lampejos" de energia e alertas).

---

## 3. Composição Visual e Elementos

Se for criar um post no Figma ou Canva, aplique estas regras de composição:

**A. Espaço em Branco (Respiração)**
- Deixe as margens sempre generosas. O conteúdo nunca deve encostar nos cantos. O vazio escuro é o que dá a sensação de luxo (chamamos de "autoridade silenciosa").

**B. Cards e Caixas**
- Nunca use fundos sólidos brilhantes.
- Se for fazer um "Card", use o fundo `#151515`.
- **Borda Estilo "Vidro/Interface":** Coloque uma linha (stroke) de 1px usando `rgba(255,255,255,0.05)`. E adicione um leve gradiente radial por trás para simular que a tela do card está emitindo luz.

**C. Efeito Holográfico (Glow & Overlay)**
- Para replicar os textos legíveis em cima do 3D: Crie um retângulo atrás do texto com um degradê linear.
- **Receita do Degradê:** Início `#0A0A0A` a `85%` de opacidade ➔ Final em `0%` (Transparente). Jogue o texto por cima. Isso garante que a arte do fundo não destrua a leitura.

**D. Botões (Ghost Buttons)**
- Botões não têm preenchimento sólido no estado normal.
- Eles são "Fantasmas": Apenas uma borda arredondada (linha 1px `rgba(255,255,255,0.2)`) e o texto no meio usando *IBM Plex Mono*.

---

## 4. Texturas

- **Ruído / Film Grain:** O site aplica um leve "chiado" analógico em cima de tudo (cerca de 3% de opacidade). Adicionar um efeito sutil de "Noise/Granulado" no seu Photoshop/Canva em cima da arte final vai amarrar perfeitamente a linguagem do seu Instagram com a do site.
