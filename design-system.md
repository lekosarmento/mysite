# Design System — Leko Sarmento

> Guia completo de identidade visual extraído diretamente do código do site [leko.ai](https://leko.ai).
> Use como referência absoluta para criar posts no Instagram, LinkedIn, carrosséis, stories, thumbnails e qualquer peça gráfica da marca.

---

## 1. Filosofia Visual

A identidade Leko é construída sobre **3 pilares**:

| Pilar | Significado | Efeito Visual |
|---|---|---|
| **Autoridade Silenciosa** | O vazio comunica poder. Menos é mais. | Margens generosas, fundos escuros, respiração entre elementos |
| **Precisão Técnica** | A estética de quem constrói, não de quem vende. | Tipografia monospace, tags de código, grids rígidos |
| **Energia Contida** | A tecnologia pulsa por trás da superfície. | Cyan como luz de holograma, glows sutis, grain analógico |

**Regra de ouro**: Nunca pareça "marqueteiro". Sempre pareça "engenheiro-designer".

---

## 2. Paleta de Cores

### 2.1 Fundos (Dark Mode Premium)

Nunca use preto absoluto (`#000000`). A escala de cinzas profundos cria profundidade sem cansar a vista.

| Token | Hex | RGB | Uso |
|---|---|---|---|
| `bg-primary` | `#0F0F0F` | `15, 15, 15` | Fundo principal de toda peça |
| `bg-secondary` | `#141414` | `20, 20, 20` | Áreas alternadas, seções de destaque |
| `bg-tertiary` | `#1C1C1C` | `28, 28, 28` | Fundo de inputs, áreas internas |
| `bg-card` | `#151515` | `21, 21, 21` | Cards, caixas, containers |

### 2.2 Textos

| Token | Hex | Opacidade | Uso |
|---|---|---|---|
| `text-primary` | `#FFFFFF` | 100% | Headlines, nomes, títulos. Impacto máximo |
| `text-secondary` | `#A3A3A3` | — | Parágrafos, descrições, corpo de texto |
| `text-muted` | `#666666` | — | Tags, metadados, labels. Texto de apoio |

### 2.3 Cores de Acento

São as **cores emissivas** — a "aura da IA". Use como luzes, glows, destaques pontuais ou texto em itálico. **Nunca como fundo sólido de grandes áreas.**

| Token | Hex | RGB | Personalidade | Uso |
|---|---|---|---|---|
| `accent-cyan` | `#00D4FF` | `0, 212, 255` | Energia, holograma, tecnologia | Cor PRINCIPAL de destaque. Links, ícones, textos itálico, bordas ativas, botões primários |
| `accent-purple` | `#8B5CF6` | `139, 92, 246` | Profundidade, sombra inteligente | Secundária. Gradientes, sombras, complemento do cyan |
| `accent-warm` | `#FF6B35` | `255, 107, 53` | Pulso, urgência, sinapse | Terciária. Uso PONTUAL — alertas, notificações, lampejos |

### 2.4 Bordas e Divisores

| Token | Valor | Uso |
|---|---|---|
| `border-subtle` | `rgba(255, 255, 255, 0.06)` | Borda padrão de cards e divisores |
| `border-hover` | `rgba(255, 255, 255, 0.12)` | Borda ao passar o mouse / estado ativo |
| Borda cyan ativa | `rgba(0, 212, 255, 0.25)` | Botões primários, elementos em destaque |
| Borda cyan forte | `rgba(0, 212, 255, 0.3)` | CTAs principais |

---

## 3. Tipografia

### 3.1 Famílias Tipográficas

| Família | Font Stack | Papel |
|---|---|---|
| **Inter** | `Inter, sans-serif` | Fonte principal. Headlines, textos, descrições. A voz humana. |
| **IBM Plex Mono** | `IBM Plex Mono, monospace` | Fonte técnica. Tags, botões, metadados, labels. A voz da máquina. |

### 3.2 Escala Tipográfica

| Token | Tamanho | Peso | Line Height | Família | Uso |
|---|---|---|---|---|---|
| `display` | `clamp(48px, 6vw, 96px)` | 300 (Light) | 1.05 | Inter | Nome no Hero. Uma vez por peça. |
| `h1` | `clamp(36px, 4vw, 64px)` | 300 (Light) | 1.10 | Inter | Títulos de seção |
| `h2` | `clamp(24px, 3vw, 40px)` | 400 (Regular) | 1.20 | Inter | Subtítulos, headlines secundárias |
| `h3` | `clamp(18px, 2vw, 24px)` | 500 (Medium) | 1.30 | Inter | Nomes de cards, itens |
| `body` | `16px` | 400 (Regular) | 1.70 | Inter | Texto corrido, parágrafos |
| `small` | `14px` | 400 (Regular) | 1.50 | Inter | Textos menores, nav links |
| `micro` | `11px` | 500 (Medium) | 1.40 | IBM Plex Mono | Tags, labels, botões, seção labels |

### 3.3 Regras de Formatação

| Elemento | Fonte | Tamanho | Peso | Casing | Tracking | Cor |
|---|---|---|---|---|---|---|
| **Headline principal** | Inter | display | 200–300 | Capitalização normal | `-3px` | `#FFFFFF` |
| **Título de seção** | Inter | h1 | 300 | Capitalização normal | tight | `#FFFFFF` |
| **Label de seção** ("Sobre", "Projetos") | IBM Plex Mono | 11px | 500 | `UPPERCASE` | `3px` | `#666666` |
| **Botão / CTA** | IBM Plex Mono | 11–12px | 400 | `UPPERCASE` | `1.5px` | Cyan ou branco |
| **Tag / Pill** | IBM Plex Mono | 11px | 400 | `UPPERCASE` | `1px` | `#A3A3A3` com borda sutil |
| **Corpo de texto** | Inter | 16px | 400 | Normal | Normal | `#A3A3A3` |
| **Texto em itálico de destaque** | Inter | body | 400 | Itálico | Normal | `#00D4FF` a 75–80% opacidade |

---

## 4. Espaçamento

### 4.1 Escala de Espaçamento

| Token | Valor | Uso |
|---|---|---|
| `space-xs` | `4px` | Micro gaps |
| `space-sm` | `8px` | Gaps entre inline elements |
| `space-md` | `16px` | Padding interno de componentes pequenos |
| `space-lg` | `24px` | Margem entre label e heading |
| `space-xl` | `48px` | Gap entre colunas de grid |
| `space-2xl` | `80px` | Margem entre blocos de conteúdo |
| `space-3xl` | `120px` | Padding vertical de seções |

### 4.2 Regras Práticas para Posts

- **Padding de seção**: Sempre `120px` vertical no site → nos posts, garanta pelo menos **15–20% de margem** em todas as bordas
- **Container máximo**: `1400px` de largura → em posts, limite a área útil de conteúdo a **80% da área total**
- **Gap entre cards**: `20–24px` → nos posts, mantenha espaço suficiente para "respirar"

---

## 5. Componentes Visuais

### 5.1 Cards

```
┌──────────────────────────────────┐
│  Fundo: #151515                  │
│  Borda: 1px rgba(255,255,255,0.06)│
│  Border-radius: 12px             │
│  Padding: 28–36px                │
│  Hover: borda → rgba(255,255,255,0.12)│
│  Hover glow: radial-gradient     │
│         rgba(0,212,255,0.04)     │
└──────────────────────────────────┘
```

**Receita do hover glow**: `radial-gradient(circle at top left, rgba(0,212,255,0.04), transparent 60%)`

### 5.2 Botões (Ghost Buttons)

Os botões são **fantasmas** — sem preenchimento no estado normal.

| Variante | Borda | Texto | Hover |
|---|---|---|---|
| **Primário (Cyan)** | `1px rgba(0,212,255,0.25)` | `#00D4FF` | Fundo `#00D4FF`, texto preto |
| **Secundário (Ghost)** | `1px rgba(255,255,255,0.12)` | `#A3A3A3` | Borda branca, texto branco |
| **Fill (Sólido)** | Nenhuma | Branco | Fundo branco, texto preto |

**Formato**: `border-radius: 9999px` (full rounded / pill shape)
**Fonte**: IBM Plex Mono, 12px, UPPERCASE, tracking 1.5px
**Padding**: `px-6 py-3` (~24px horizontal, 12px vertical)

### 5.3 Tags / Pills

```
┌──────────────────┐
│  ◉ ia            │
│  ◉ multi-agente  │
│  ◉ plataforma    │
└──────────────────┘
```

- Fundo: `#141414` (bg-secondary) ou transparente
- Borda: `1px rgba(255,255,255,0.06)`
- Border-radius: `9999px` (pill)
- Fonte: IBM Plex Mono, 11px, UPPERCASE, tracking 1px
- Cor: `#A3A3A3`
- Padding: `14px horizontal, 6px vertical`

### 5.4 Section Labels (Mini-títulos)

O identificador que aparece ACIMA de cada heading de seção.

```
SOBRE ←──── Section Label
Do operacional ao sistema. ←──── Heading h1
```

- Fonte: IBM Plex Mono
- Tamanho: 11px
- Peso: 500
- Casing: UPPERCASE
- Tracking: 3px
- Cor: `#666666`
- Margem inferior: 24px

### 5.5 Stats / Métricas

```
15+
Years of Experience
```

- Valor: IBM Plex Mono, tamanho h2 (~40px), cor branca
- Label: IBM Plex Mono, 11px, cor `#666666`

---

## 6. Efeitos e Texturas

### 6.1 Film Grain (Ruído Analógico)

Overlay global que cobre toda a interface com um ruído fractal sutil.

- **Tipo**: `fractalNoise` com `baseFrequency: 0.85`, 4 octaves
- **Opacidade**: `3%` (0.03)
- **Tamanho do tile**: `256×256px`, repeat
- **Como aplicar em posts**: No Photoshop/Figma, adicione uma camada de Noise sobre toda a arte com ~3–5% de opacidade em modo Normal ou Overlay

### 6.2 Glow Effects (Brilho Holográfico)

Usados em cards e elementos interativos para simular "emissão de luz da interface".

**Glow de card (hover)**:
```css
radial-gradient(circle at top left, rgba(0, 212, 255, 0.04), transparent 60%)
```

**Glow de botão CTA (sombra)**:
```css
box-shadow: 0 -4px 30px rgba(0, 212, 255, 0.3)
```

**Glow de texto (aura)**:
```css
text-shadow: 0 0 20px rgba(0, 212, 255, 0.1)
```

### 6.3 Gradientes para Legibilidade

Quando texto fica sobre imagem ou 3D, use este degradê por trás:

**Horizontal (desktop)**:
```css
linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.35) 50%, transparent 100%)
```

**Vertical (mobile)**:
```css
linear-gradient(0deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.5) 75%, transparent 100%)
```

### 6.4 Imagens e Retratos

- **Tratamento**: Sempre em `grayscale` (preto e branco)
- **Contraste**: Ligeiramente aumentado (`contrast: 1.1`)
- **Opacidade**: 16–21% (integração sutil)
- **Brightness**: 0.7 padrão, 0.85 no hover
- **Fading nas bordas**: `radial-gradient` para dissolver edges
- **Vinheta**: `inset box-shadow` de 60px com preto a 50% opacidade

---

## 7. Animações e Movimento

### 7.1 Curvas de Easing

| Token | Valor | Sensação | Uso |
|---|---|---|---|
| `ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Rápido no início, desacelera suave | Animação principal — TUDO usa essa |
| `ease-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Simétrica, equilibrada | Transições de cor |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bounce sutil | Micro-interações |

### 7.2 Durações

| Token | Valor | Uso |
|---|---|---|
| `fast` | `200ms` | Hover de cor, mudanças de opacidade |
| `normal` | `400ms` | Transições padrão de botões, bordas |
| `slow` | `800ms` | Entrada de elementos no scroll |
| `glacial` | `1500ms` | Animações de entrada do Hero |

### 7.3 Padrão de Entrada (Scroll Reveal)

Todos os elementos do site entram com:
```
initial: { opacity: 0, y: 40–50px }
animate: { opacity: 1, y: 0 }
duration: 0.8–1.0s
ease: expo (0.16, 1, 0.3, 1)
stagger: 0.06–0.1s entre items
```

---

## 8. Grid e Layout

### 8.1 Container

- **Largura máxima**: `1400px`
- **Padding lateral**: `24px` (mobile) → `40px` (desktop)
- **Centralização**: `margin: 0 auto`

### 8.2 Grids Comuns

| Layout | Colunas | Gap | Uso |
|---|---|---|---|
| Cards de produto | 1 → 2 → 3 | `20px` | Grid de 6 produtos |
| Cards de serviço | 1 → 3 | `24px` | Ofertas |
| Cards de experiência | 1 → 2 | `24px` | Empresas anteriores |
| Steps de processo | 1 → 2 → 4 | `24–32px` | Como eu trabalho |

---

## 9. Receitas Prontas para Posts

### 9.1 Post Carrossel Instagram (1080×1350)

```
┌─────────────────────────────────┐
│                                 │ ← Margem superior: ~150px
│   PRODUTOS  ←── IBM Plex Mono  │    11px, UPPERCASE, #666666
│                                 │
│   Meus principais              │ ← Inter, 36–40px, peso 300
│   produtos                     │    Cor: #FFFFFF
│                                 │
│  ┌────────────┐ ┌────────────┐ │
│  │ #151515    │ │ #151515    │ │ ← Cards com borda
│  │            │ │            │ │    rgba(255,255,255,0.06)
│  │ Título     │ │ Título     │ │    border-radius: 12px
│  │ #FFFFFF    │ │ #FFFFFF    │ │
│  │ Desc       │ │ Desc       │ │
│  │ #A3A3A3    │ │ #A3A3A3    │ │
│  │            │ │            │ │
│  │ ● bullet   │ │ ● bullet   │ │ ← Bullets em #00D4FF
│  │ ● bullet   │ │ ● bullet   │ │
│  └────────────┘ └────────────┘ │
│                                 │
│         LEKO · @leko_werkley    │ ← Rodapé: IBM Plex Mono
│                                 │    10px, #666666
└─────────────────────────────────┘
  Fundo: #0F0F0F + grain overlay 3%
```

### 9.2 Post Single Instagram (1080×1080)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│       Tem um processo confuso,  │ ← Inter, 28–32px, peso 300
│       uma ideia de produto      │    Cor: #FFFFFF
│       ou uma operação que       │    Centralizado
│       precisa ganhar            │
│       *inteligência*?           │ ← Itálico em #00D4FF
│                                 │
│      ┌─────────────────┐        │
│      │  FALAR COMIGO →  │        │ ← Ghost button
│      └─────────────────┘        │    IBM Plex Mono, 11px
│                                 │    Borda: rgba(0,212,255,0.25)
│                                 │
│         LEKO · leko.ai          │
└─────────────────────────────────┘
```

### 9.3 Story Instagram (1080×1920)

```
┌─────────────────────────────────┐
│                                 │
│  IA & RESEARCH ←── Label       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Claude  OpenAI  Gemini  │   │ ← Pills/tags com
│  │ Perplexity  Codex       │   │    borda sutil
│  └─────────────────────────┘   │
│                                 │
│  CONSTRUÇÃO & PRODUTO          │
│  ┌─────────────────────────┐   │
│  │ Next.js  React  Supabase│   │
│  │ TypeScript  Tailwind    │   │
│  └─────────────────────────┘   │
│                                 │
│              ···                │
│                                 │
│  Stack que uso diariamente     │ ← Inter, 16px, #A3A3A3
│                                 │
│         LEKO · leko.ai          │
└─────────────────────────────────┘
```

---

## 10. Checklist de Identidade Visual

Antes de publicar qualquer peça, verifique:

- [ ] Fundo é `#0F0F0F` (nunca `#000000`)
- [ ] Headlines em Inter, peso Light (300)
- [ ] Tags e botões em IBM Plex Mono, UPPERCASE
- [ ] Cor de destaque é `#00D4FF` (nunca azul genérico)
- [ ] Cards têm `border-radius: 12px` e borda `rgba(255,255,255,0.06)`
- [ ] Texto de itálico de destaque é `#00D4FF` com 75% opacidade
- [ ] Margens generosas — o vazio é intencional
- [ ] Grain/Noise overlay de ~3% aplicado
- [ ] Nenhum fundo sólido brilhante ou gradiente colorido gritante
- [ ] Imagens/retratos tratados em grayscale, opacidade baixa

---

## 11. Assets e Fontes

### Download das Fontes
- **Inter**: [fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter) — Pesos: 300, 400, 500
- **IBM Plex Mono**: [fonts.google.com/specimen/IBM+Plex+Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) — Pesos: 300, 400, 500, 600

### Pesos utilizados no site
| Fonte | Peso | Nome | Uso Principal |
|---|---|---|---|
| Inter | 300 | Light | Headlines, títulos grandes |
| Inter | 400 | Regular | Corpo de texto, subtítulos |
| Inter | 500 | Medium | h3, títulos de cards |
| IBM Plex Mono | 300 | Light | — |
| IBM Plex Mono | 400 | Regular | Tags, botões, labels |
| IBM Plex Mono | 500 | Medium | Section labels |
| IBM Plex Mono | 600 | SemiBold | Ênfase técnica (raro) |

---

## 12. Tons de Voz para Copy

A identidade visual se estende ao tom de escrita:

| ✅ Fazer | ❌ Evitar |
|---|---|
| Direto, sem floreio | Frases motivacionais genéricas |
| Técnico mas acessível | Jargão rebuscado para impressionar |
| Linguagem de quem constrói | Linguagem de vendedor |
| Primeira pessoa, informal profissional | Terceira pessoa corporativa |
| Dados concretos ("15+ anos", "29 agentes") | Promessas vagas ("resultados incríveis") |

**Exemplos de bom copy no tom Leko:**
- "Sem mistério, sem promessa vazia. Esse é o processo."
- "Meu diferencial não é saber usar IA. É entender o problema antes."
- "Experiência que não nasceu em laboratório."

---

*Última atualização: Maio 2026 · Extraído do código-fonte de [leko.ai](https://leko.ai)*
