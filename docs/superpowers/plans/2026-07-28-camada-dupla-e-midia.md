# Camada dupla de linguagem + mídia real — Implementation Plan

> **Para quem executa:** passos usam checkbox (`- [x]`) para acompanhamento. Este projeto **não tem runner de teste** (sem jest, vitest, playwright em `devDependencies`; `package.json` só expõe `dev`, `build`, `start`, `lint`). Portanto **não há passo de teste unitário** neste plano: seria ficção. O laço de verificação real deste repositório é typecheck + lint + build + conferência no browser, e está definido na Task 0.

**Goal:** dar ao site uma camada de linguagem de negócio por cima da técnica, sem apagar a técnica, e trocar o portfólio de texto por prova visual.

**Architecture:** um componente novo (`TechDetail`) rende a linha de lastro em mono e um disclosure "+ como funciona". Dicionários ganham `tech[]` e `detail` por item. Cenas `construo` e `portfolio` passam a consumir isso. Portfólio ganha imagem real dentro do card que já existe.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, framer-motion, i18n por JSON em `src/lib/dictionaries/`.

**Spec:** `docs/superpowers/specs/2026-07-28-camada-dupla-e-midia-design.md`

---

## Mapa de arquivos

| Arquivo | Responsabilidade | Ação |
|---|---|---|
| `src/components/ui/TechDetail.tsx` | lastro em mono + disclosure. Recebe texto por prop, não conhece i18n | criar |
| `src/app/globals.css` | estilo de `.techline`, `.techtoggle`, `.techbody`, imagem no `.projcard`, segunda linha do `.prow` | modificar |
| `src/lib/dictionaries/pt-BR.json` | copy nova + `tech[]`/`detail`; remoção de chaves órfãs | modificar |
| `src/components/sections/WhatsAppAgent.tsx` | cena `construo` (exporta `Products`). Passa a montar `TechDetail` | modificar |
| `src/components/sections/Projetos.tsx` | cena `portfolio`. `TechDetail` + imagem no card | modificar |
| `src/components/sections/HowIWork.tsx` | cena `diferenciais`. Só consome dicionário, não muda | não mexer |
| `scripts/grade-previews.py` | tratamento das capturas na paleta | criar |
| `public/images/previews/*.jpg` | previews tratados | criar |

Nota: o nome `WhatsAppAgent.tsx` é herança e está errado (o arquivo exporta `Products` e renderiza a cena "O que eu construo"). **Não renomear neste plano.** Renomear arquivo mexe no registry do deck e no tour, e é ruído dentro de uma mudança de conteúdo. Fica anotado como dívida.

---

## Chunk 1 — Fase 1: camada de linguagem

### Task 0: Laço de verificação (usado em todas as tasks)

- [x] **Passo único: memorizar os quatro comandos**

```bash
npx tsc --noEmit          # tipos
npm run lint              # eslint
npm run build             # build de produção
npm run dev               # sobe em localhost:3000 pra conferência visual
```

No browser, a conferência mínima de qualquer cena alterada:
1. zero erro de console percorrendo o deck inteiro;
2. cena alterada medida em **1440×900** e **390×844**, com a última linha de conteúdo dentro do viewport antes da cena seguinte cobrir;
3. tour do Anfitrião completo, 10 cenas, sem quebra.

Se uma mudança visual "não aparecer": parar o servidor, apagar `.next`, subir de novo. O Turbopack já serviu CSS e imagem velhos duas vezes neste projeto.

---

### Task 1: Componente `TechDetail`

**Files:**
- Create: `src/components/ui/TechDetail.tsx`
- Modify: `src/app/globals.css` (bloco novo no fim, junto dos estilos editoriais)

- [x] **Passo 1: criar o componente**

```tsx
"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface TechDetailProps {
  /** termos técnicos do lastro, exibidos sempre */
  tech: string[];
  /** detalhe de engenharia, colapsado */
  detail: string;
  labelMore: string;
  labelLess: string;
}

/**
 * Camada técnica de um card de conteúdo. A linha de lastro (mono) fica SEMPRE
 * visível: é ela que mostra ao visitante técnico que há profundidade sem
 * obrigar o leigo a ler jargão. O detalhe de engenharia abre sob demanda.
 */
export function TechDetail({ tech, detail, labelMore, labelLess }: TechDetailProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();

  return (
    <div className="techdetail">
      <div className="techline" aria-hidden>
        {tech.join(" · ")}
      </div>

      <button
        type="button"
        className="techtoggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? labelLess : labelMore}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="techbody"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? { height: "auto", opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

`aria-hidden` na linha de lastro é proposital: para leitor de tela ela é ruído de siglas soltas, e o mesmo conteúdo aparece em prosa dentro de `detail`.

- [x] **Passo 2: estilo em `globals.css`**

Acrescentar no fim do bloco editorial, antes das media queries:

```css
/* camada técnica: lastro sempre visível + detalhe sob demanda */
.techdetail { margin-top: 10px; }
.techline {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 1.5px;
  text-transform: lowercase; opacity: 0.52;
}
.techtoggle {
  margin-top: 8px; padding: 0; border: 0; background: none; cursor: pointer;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 1px;
  color: var(--terra); opacity: 0.85; transition: opacity 0.25s;
}
.techtoggle:hover { opacity: 1; }
.techbody { overflow: hidden; }
.techbody p {
  margin-top: 10px; font-weight: 300; font-size: 13.5px; line-height: 1.65;
  max-width: 46ch; opacity: 0.78;
}
.scene.t-ink .techline, .scene.t-terra .techline { opacity: 0.6; }
.scene.t-terra .techtoggle { color: var(--cream); }
```

- [x] **Passo 3: verificar tipos e lint**

```bash
npx tsc --noEmit && npm run lint
```
Esperado: sem saída de erro.

- [x] **Passo 4: commit**

```bash
git add src/components/ui/TechDetail.tsx src/app/globals.css
git commit -m "feat(ui): TechDetail, lastro técnico visível + detalhe sob demanda"
```

---

### Task 2: Copy nova da cena `construo` no dicionário pt-BR

**Files:**
- Modify: `src/lib/dictionaries/pt-BR.json` (bloco `products`)

- [x] **Passo 1: trocar os rótulos do disclosure**

`products.moreDetails`: `"+ especificações"` → `"+ como funciona"`
`products.lessDetails`: `"- recolher"` → `"− recolher"`

- [x] **Passo 2: reescrever os 6 itens no formato de 4 camadas**

Cada item de `products.items` passa a ter `title`, `desc`, `tech[]`, `detail`. Fonte da verdade: §4.1 do spec. Os seis títulos novos, na ordem atual do array:

1. Um atendente que não dorme — `WhatsApp API · LLM · handoff humano`
2. O sistema que sua empresa não acha pronto — `Next.js · Supabase · multi-tenant`
3. Respostas tiradas dos seus documentos — `RAG · pgvector · busca semântica`
4. O trabalho repetitivo sai da sua mão — `n8n · APIs REST · webhooks`
5. Imagem e vídeo no ritmo da campanha — `Veo · Runway · Midjourney · ComfyUI`
6. Site e interface que convertem — `Next.js · Tailwind · design system`

O `detail` de cada um recebe a descrição técnica de hoje, ampliada em uma ou duas frases. **Nenhum texto técnico é jogado fora**, só desce de camada.

- [x] **Passo 3: validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/lib/dictionaries/pt-BR.json','utf8')); console.log('json ok')"
```
Esperado: `json ok`.

- [x] **Passo 4: commit**

```bash
git add src/lib/dictionaries/pt-BR.json
git commit -m "content(construo): 6 soluções reescritas em linguagem de negócio"
```

---

### Task 3: Montar `TechDetail` na cena `construo`

**Files:**
- Modify: `src/components/sections/WhatsAppAgent.tsx`
- Modify: `src/app/globals.css` (`.prow` ganha segunda linha)

- [x] **Passo 1: ampliar a interface e renderizar**

`ProductItem` passa a ser `{ title, desc, tech: string[], detail: string }`. O campo `bullets` da interface atual **não existe no dicionário** e é resquício: remover.

`.prow` hoje é `grid-template-columns: auto 1fr auto` numa linha só. Vira duas linhas: a primeira mantém `pn`/`pt`/`pd`, a segunda (span total) recebe o `TechDetail`.

- [x] **Passo 2: ajustar `.prow` no CSS**

```css
.prow {
  display: grid; grid-template-columns: auto 1fr auto; gap: 22px;
  align-items: baseline; /* … resto igual … */
}
.prow-main { display: contents; }
.prow .techdetail { grid-column: 1 / -1; margin-left: 34px; }
```

- [x] **Passo 3: atenção ao mobile**

`.prow .pd` está com `display: none` abaixo de 900px e só aparece em `@media (min-width: 900px)`. Ou seja, **no celular a cena hoje mostra só os títulos**. Com os títulos novos sendo benefício em vez de nome de tecnologia, o mobile melhora sozinho. Manter esse comportamento; não revelar `.pd` no mobile (a cena não tem altura pra isso).

- [x] **Passo 4: verificar**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Depois, no browser: cena `construo` em 1440×900 e 390×844, expandir dois itens ao mesmo tempo e confirmar que a cena cresce sem cortar (o deck suporta cena mais alta que a viewport).

- [x] **Passo 5: commit**

```bash
git add src/components/sections/WhatsAppAgent.tsx src/app/globals.css
git commit -m "feat(construo): lastro técnico e detalhe sob demanda nas 6 soluções"
```

---

### Task 4: Copy nova + `TechDetail` na cena `portfolio`

**Files:**
- Modify: `src/lib/dictionaries/pt-BR.json` (bloco `projects`)
- Modify: `src/components/sections/Projetos.tsx`

- [x] **Passo 1: reescrever os 6 projetos**

Fonte: §4.2 do spec. `tags` e `link` continuam. Entram `tech[]` e `detail`. As descrições técnicas de hoje ("7 motores, ~10k linhas, multi-tenant") viram `detail`.

- [x] **Passo 2: renderizar `TechDetail` dentro do `.projcard`**

Cuidado: o card inteiro é um `<Link>` quando `p.link` existe. **Botão dentro de link é inválido e quebra o clique.** Solução: tirar o `TechDetail` de dentro do `<Link>`, deixando-o como irmão, dentro de um wrapper `.projcard-wrap`. O link cobre imagem, título, descrição e tags; o disclosure fica fora dele.

- [x] **Passo 3: verificar**

Mesmo laço da Task 3. No browser, confirmar especificamente: clicar no card ainda abre o projeto em nova aba, e clicar em "+ como funciona" **não** navega.

- [x] **Passo 4: commit**

```bash
git add src/lib/dictionaries/pt-BR.json src/components/sections/Projetos.tsx
git commit -m "content(portfolio): 6 produtos reescritos por resultado, técnico sob demanda"
```

---

### Task 5: Cena `diferenciais` e narração do tour

**Files:**
- Modify: `src/lib/dictionaries/pt-BR.json` (blocos `howIWork` e `agent.tour.steps`)

- [x] **Passo 1: trocar o jargão dos 4 cards**

Conforme §4.3 do spec: sai "deploy", "arquitetura", "codar" do texto visível.

- [x] **Passo 2: alinhar a narração do Anfitrião**

`agent.tour.steps.construo` hoje diz "agentes de WhatsApp, SaaS com IA, RAG, automações n8n". Com a cena reescrita, o agente ficaria falando uma língua e a tela outra. Reescrever para acompanhar os títulos novos.

Conferir também `steps.portfolio`, que cita "29 agentes debatendo entre si" e continua válido.

- [x] **Passo 3: verificar rodando o tour inteiro**

No browser: aceitar o convite do Anfitrião e percorrer as 10 cenas.

- [x] **Passo 4: commit**

```bash
git add src/lib/dictionaries/pt-BR.json
git commit -m "content: diferenciais sem jargão e narração do tour alinhada"
```

---

### Task 6: Limpeza das chaves órfãs

**Files:**
- Modify: `src/lib/dictionaries/pt-BR.json`, `en.json`, `es.json`

- [x] **Passo 1: confirmar que são órfãs de verdade**

```bash
for k in showMore showLess "offers\." "standalone\."; do echo "$k: $(grep -rl "$k" src --include=*.tsx | tr '\n' ' ')"; done
```
Esperado: nenhum arquivo para nenhuma delas. **Se algo aparecer, parar e reavaliar.**

`inProduction` e `viewProject` **não** entram nesta limpeza: `Projetos.tsx` usa as duas.

- [x] **Passo 2: remover `about.showMore`, `about.showLess`, e os blocos `offers` e `standalone` dos três dicionários**

- [x] **Passo 3: validar os três JSON e buildar**

```bash
node -e "['pt-BR','en','es'].forEach(l=>JSON.parse(require('fs').readFileSync('src/lib/dictionaries/'+l+'.json','utf8')));console.log('json ok')" && npm run build
```

- [x] **Passo 4: commit**

```bash
git add src/lib/dictionaries
git commit -m "chore(i18n): remove chaves órfãs de componentes já deletados"
```

---

## Chunk 2 — Fase 2: previews reais do portfólio

### Task 7: Capturar as telas

**Files:**
- Create: `public/images/previews/` (capturas cruas em pasta temporária primeiro)

- [x] **Passo 1: capturar quatro alvos**

| Slug | URL |
|---|---|
| `saude-inteligente` | https://saudeinteligente.vercel.app/ |
| `konklave` | https://konklave-iota.vercel.app |
| `aneno` | https://site-aneno.vercel.app/ |
| `este-site` | https://leko.ia.br |

Viewport 1440×900, escala 2×, esperar a rede ficar ociosa, screenshot **do viewport** e não da página inteira. Salvar cru no scratchpad.

Donna não tem link público: **fica sem preview**, com a `.init` gigante e a legenda `projects.imageSoon`.

- [x] **Passo 2: conferir cada captura a olho**

Descartar captura com banner de cookie, modal, estado de carregamento ou área em branco. Recapturar se preciso.

---

### Task 8: Tratar as capturas na paleta

**Files:**
- Create: `scripts/grade-previews.py`

- [x] **Passo 1: escrever o script**

Mesmo método de `scripts/grade-sobre.py`, que já está no repositório: recorte para `16/10`, ponto de preto puxado pro `--ink` (`#13100C`), saturação levemente contida. Saída em `public/images/previews/<slug>.jpg`, largura 1200, qualidade 88.

Razão do tratamento: as telas capturadas são coloridas e cada produto tem paleta própria. Cruas, elas gritam mais que a cena `sand` em volta e o portfólio vira colcha de retalhos.

- [x] **Passo 2: rodar e conferir a folha de contato**

```bash
python scripts/grade-previews.py
```

- [x] **Passo 3: commit**

```bash
git add scripts/grade-previews.py public/images/previews
git commit -m "feat(portfolio): previews reais tratados na paleta do site"
```

---

### Task 9: Imagem dentro do card

**Files:**
- Modify: `src/components/sections/Projetos.tsx`
- Modify: `src/lib/dictionaries/pt-BR.json` (campo `image` por item)
- Modify: `src/app/globals.css` (`.projcard img`)

- [x] **Passo 1: adicionar `image` aos itens que têm preview**

`"image": "/images/previews/saude-inteligente.jpg"`. Donna fica sem o campo.

- [x] **Passo 2: renderizar com fallback**

Card com `image` mostra a imagem no topo (`aspect-ratio: 16/10`, `object-fit: cover`, cantos arredondados, `loading="lazy"`, `width` e `height` explícitos contra layout shift). Card sem `image` mantém a `.init` gigante que já existe, com a legenda `projects.imageSoon`.

- [x] **Passo 3: medir a altura da cena**

Esta é a verificação crítica da fase. A cena `portfolio` é grade de 3 colunas × 2 linhas; cada card ganhando imagem cresce. Medir em 1440×900 e 390×844.

Se estourar: encurtar a descrição visível no card. **Não remover a imagem** — ela é o objetivo da fase.

- [x] **Passo 4: verificar**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
No browser: zero erro de console, tour completo, e confirmar que os cards continuam clicáveis.

- [x] **Passo 5: commit**

```bash
git add src/components/sections/Projetos.tsx src/lib/dictionaries/pt-BR.json src/app/globals.css
git commit -m "feat(portfolio): cards com preview real, inicial como fallback"
```

---

## O que este plano não cobre

- **Fase 3** (fotos de evento) e **fase 4** (vídeo): bloqueadas por material do Leko.
- **Fase 5** (sincronia `en`/`es`): só depois de o Leko aprovar o PT, pra não traduzir texto que ainda vai mudar. Enquanto isso, `en` e `es` ficam com a copy antiga nos blocos `products` e `projects`. **Isso é uma inconsistência conhecida e temporária**, não um bug.
- **Fase 6** (peças geradas com IA): opcional, só se A e B estiverem no ar.
- Renomear `WhatsAppAgent.tsx` para `Products.tsx`: dívida anotada, fora de escopo.

---

## Estado da execução (2026-07-28)

Chunk 1 e Chunk 2 executados por inteiro. Fora do roteiro, dois defeitos
encontrados durante a verificação e corrigidos no caminho:

1. **`TechDetail` derrubava as cenas em `en`/`es`.** Os dois dicionários não têm
   `tech`/`detail` (fase 5), e o componente fazia `tech.join` direto: trocar de
   idioma estourava `TypeError` e matava as cenas Soluções e Portfólio. Agora a
   camada técnica some quando o conteúdo falta. Commit `cc1f801`.
2. **CTA fixo do mobile estava em `#00D4FF`**, ciano da identidade azul que foi
   descartada, no elemento mais visível do site no celular. Virou terracota.

Verificação feita em 1440×900 (pt, en, es) e 390×844: 0 erro de console, 6 cards
com 6 previews, nenhuma imagem quebrada, disclosure abre sem navegar, link do
card intacto (`target=_blank`), e o rodapé da cena chega ao viewport antes da
cena seguinte cobrir. A cena Portfólio ficou com 1468px de conteúdo contra 900
de viewport, dentro do que o deck suporta desde o ajuste de 06/07.

Continua fora de escopo: fases 3 a 6 e o rename de `WhatsAppAgent.tsx`.
