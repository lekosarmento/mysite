# Deck Imersivo Vertical — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestruturar o site `leko.ai` num *deck* vertical onde cada seção é uma cena full-screen que empilha com profundidade (sticky stack + recuo escala/dim), com contraste forte e composição editorial, mantendo conteúdo, identidade e todo o motion já existente.

**Architecture:** Um `Deck` (container) renderiza, na ordem de uma constante única `SCENES`, cada seção dentro de um `Scene` (wrapper sticky `100dvh` com tema de cor, topo arredondado/sombra, `.scene-inner` que recua e `.scene-dim` que escurece). O recuo é dirigido por **uma** assinatura de scroll que escreve a variável CSS `--cov` (0→1) por cena; o CSS faz o transform (GPU). Reveals e capítulo ativo vêm de **um** `IntersectionObserver`. Tudo dentro do `PageShell` já existente (push-aside do menu), preservando Preloader, Lenis, cursor, grain, i18n.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · framer-motion · Lenis · i18n (pt-BR/en/es).

**Spec:** `docs/superpowers/specs/2026-06-16-deck-imersivo-design.md`
**Referência visual (fonte da verdade de layout/CSS por cena):** `.superpowers/brainstorm/34138-1781577830/proto-vertical-v3.html`

**⚠️ Regras do projeto:**
- **Nunca `git add -A`** — `test-key.js` na raiz tem chave OpenRouter vazada. Sempre `git add <arquivos específicos>`.
- **Sem GSAP** (usar framer-motion / CSS).
- Conteúdo vem **sempre** dos dicionários (`src/lib/dictionaries/*.json`). Não inventar copy.
- Shell: PowerShell. Dev server provavelmente já roda em `:3000` (checar antes de subir outro).

**Verificação (todo o plano):** não há test runner. Cada tarefa verifica via **navegador**: `npm run dev` + Playwright (navegar, screenshot, `browser_console_messages` com 0 erros) e checagem nos 3 breakpoints (mobile ~390px, tablet ~820px, desktop ~1440px). `npm run build` deve passar ao final de cada chunk.

---

## File Structure

**Novos:**
- `src/components/deck/scenes.ts` — constante `SCENES` (metadata: `id`, `labelKey`, `theme`). **Sem** imports de componentes (importável leve pelo `ScrambleMenu`).
- `src/components/deck/Scene.tsx` — wrapper de uma cena (sticky, tema, `.scene-inner`, `.scene-dim`).
- `src/components/deck/Deck.tsx` — itera `SCENES`, mapeia `id`→componente de seção, monta os `Scene`, e roda o controlador de scroll (`--cov`) + observer (reveal/ativo) via hook.
- `src/components/deck/useDeck.ts` — hook: controlador de profundidade (`--cov`) + `IntersectionObserver` (reveal + cena ativa); retorna `activeId`.
- `src/components/deck/ChapterSpine.tsx` — trilho de capítulos à direita (desktop).

**Modificados:**
- `src/app/globals.css` — tokens `.t-*`, chrome de cena (`.scene`, `.scene-stacked`, `.scene-inner`, `.scene-dim`), classes de reveal (`.rv`/`.in`), `prefers-reduced-motion`.
- `src/app/page.tsx` — montar `<Deck/>` (+ `<ChapterSpine/>`) dentro do `PageShell`, no lugar de `<Hero/> + <div>…seções…</div>`.
- `src/components/sections/*` — cada seção do §4 da spec: remover seu wrapper `<section>`/altura/fundo próprios (o `Scene` provê) e recompor em layout editorial (portar do protótipo).
- `src/components/ui/ScrambleMenu.tsx` — consumir `SCENES` (12 itens) no lugar dos 7 fixos.
- `src/lib/dictionaries/{pt-BR,en,es}.json` — novas chaves `menu.*` (tese, pontuais, processo, formacao, stack).

---

## Chunk 1: Fundação do deck (scenes, Scene, Deck, CSS, mount)

Objetivo: o empilhamento sticky + recuo funcionando com placeholders, validando cedo o risco nº1 da spec (sticky + Lenis). Sem recompor seções ainda.

### Task 1.1: Constante `SCENES` (fonte única)

**Files:**
- Create: `src/components/deck/scenes.ts`

- [ ] **Step 1: Criar a constante**

```ts
export type SceneTheme = "paper" | "paper2" | "sand" | "ink" | "terra";

export interface SceneMeta {
  id: string;        // vira o anchor (#id) e a key do registry
  labelKey: string;  // chave i18n para spine/menu
  theme: SceneTheme;
}

// ORDEM AUTORITATIVA (spec §4). Reordena de propósito vs. DOM atual.
export const SCENES: SceneMeta[] = [
  { id: "inicio",      labelKey: "menu.inicio",      theme: "paper"  },
  { id: "sobre",       labelKey: "menu.sobre",       theme: "ink"    },
  { id: "tese",        labelKey: "menu.tese",        theme: "terra"  },
  { id: "produtos",    labelKey: "menu.produtos",    theme: "paper2" },
  { id: "servicos",    labelKey: "menu.servicos",    theme: "ink"    },
  { id: "pontuais",    labelKey: "menu.pontuais",    theme: "sand"   },
  { id: "processo",    labelKey: "menu.processo",    theme: "paper"  },
  { id: "projetos",    labelKey: "menu.projetos",    theme: "ink"    },
  { id: "experiencia", labelKey: "menu.experiencia", theme: "sand"   },
  { id: "formacao",    labelKey: "menu.formacao",    theme: "terra"  },
  { id: "stack",       labelKey: "menu.stack",       theme: "ink"    },
  { id: "contato",     labelKey: "menu.contato",     theme: "ink"    },
];
```

- [ ] **Step 2: Commit**

```
git add src/components/deck/scenes.ts
git commit -m "feat(deck): constante SCENES (fonte unica das cenas)"
```

### Task 1.2: Tokens e chrome de cena no `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Adicionar tokens + classes** (no fim do arquivo, ou junto aos tokens existentes). Valores aliando os existentes (`--bg-primary`/`--accent-warm`):

```css
/* ===== DECK: temas de cena ===== */
:root{
  --paper:#F2EFE7; --paper2:#FBF9F3; --sand:#E6DECF;
  --ink:#13100C; --terra:#B5673F; --cream:#F4EEE3;
}
.t-paper{background:var(--paper);color:var(--ink)}
.t-paper2{background:var(--paper2);color:var(--ink)}
.t-sand{background:var(--sand);color:var(--ink)}
.t-ink{background:var(--ink);color:var(--cream)}
.t-terra{background:var(--terra);color:var(--cream)}

/* empilhamento */
.deck{position:relative}
.scene{position:sticky;top:0;height:100dvh;overflow:hidden;--cov:0}
.scene.stacked{border-radius:30px 30px 0 0;box-shadow:0 -30px 70px rgba(0,0,0,.28)}
.scene-inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;
  padding:clamp(30px,6vw,100px);transform-origin:50% 30%;
  transform:scale(calc(1 - var(--cov)*0.08)) translateY(calc(var(--cov)*-26px));will-change:transform}
.scene-dim{position:absolute;inset:0;background:#0a0805;opacity:calc(var(--cov)*0.55);
  pointer-events:none;border-radius:inherit}

/* reveal */
.rv{opacity:0;transform:translateY(26px);transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}
.scene.in .rv{opacity:1;transform:none}
.scene.in .rv:nth-child(2){transition-delay:.08s}
.scene.in .rv:nth-child(3){transition-delay:.16s}
.scene.in .rv:nth-child(4){transition-delay:.24s}

@media (prefers-reduced-motion: reduce){
  .scene-inner{transform:none}
  .scene-dim{display:none}
  .rv{opacity:1;transform:none;transition:none}
}
```

> Nota: `.scene` define seu próprio `background` via `.t-*`, então o **modo escuro existente fica inerte** no deck (spec §5).

- [ ] **Step 2: Commit**

```
git add src/app/globals.css
git commit -m "feat(deck): tokens .t-* e chrome de cena no globals.css"
```

### Task 1.3: Componente `Scene`

**Files:**
- Create: `src/components/deck/Scene.tsx`

- [ ] **Step 1: Criar**

```tsx
"use client";
import type { ReactNode } from "react";
import type { SceneTheme } from "./scenes";

export function Scene({
  id, theme, index, children,
}: { id: string; theme: SceneTheme; index: number; children: ReactNode }) {
  return (
    <section id={id} data-scene={index} className={`scene t-${theme}${index > 0 ? " stacked" : ""}`}>
      <div className="scene-inner">{children}</div>
      <div className="scene-dim" aria-hidden />
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```
git add src/components/deck/Scene.tsx
git commit -m "feat(deck): componente Scene (sticky + tema + dim)"
```

### Task 1.4: Hook `useDeck` (profundidade `--cov` + reveal/ativo)

**Files:**
- Create: `src/components/deck/useDeck.ts`

- [ ] **Step 1: Criar**

```tsx
"use client";
import { useEffect, useState } from "react";

/**
 * Controla a profundidade do empilhamento (var CSS --cov por cena) com UMA
 * assinatura de scroll, e deriva a cena ativa + reveals com UM IntersectionObserver.
 * Retorna o id da cena ativa (para o ChapterSpine).
 */
export function useDeck(deckRef: React.RefObject<HTMLElement | null>, count: number) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const scenes = Array.from(el.querySelectorAll<HTMLElement>(".scene"));
    if (!scenes.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- profundidade (--cov): quanto a PRÓXIMA cena já cobriu esta ---
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      for (let i = 0; i < scenes.length - 1; i++) {
        const next = scenes[i + 1].getBoundingClientRect();
        let cov = 1 - next.top / vh;
        cov = Math.max(0, Math.min(1, cov));
        scenes[i].style.setProperty("--cov", String(cov));
      }
      scenes[scenes.length - 1].style.setProperty("--cov", "0");
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    if (!reduce) {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    // --- reveal + cena ativa (um observer) ---
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            setActiveId((e.target as HTMLElement).id);
          }
        });
      },
      { threshold: 0.5 }
    );
    scenes.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [deckRef, count]);

  return activeId;
}
```

> **Risco nº1 da spec (sticky + Lenis):** o Lenis padrão usa scroll nativo, então `window.scroll` dispara. Se na verificação o `--cov` não atualizar, expor a instância do Lenis (em `SmoothScrollProvider`) e assinar `lenis.on("scroll", onScroll)` como fallback. Validar nesta tarefa.
>
> **Cenas mais altas que o viewport (mobile):** `threshold: 0.5` nunca dispara para uma cena maior que a tela — então ela não ganharia `.in` (reveal) nem viraria `activeId`. Usar uma condição robusta: `threshold: [0, 0.25, 0.5]` **com** lógica "a cena cujo topo passou de ~40% da viewport" (ou `rootMargin` negativo), garantindo que cenas altas (Sobre/Stack/Contato) revelem e fiquem ativas. Revalidar na Task 5.1.
>
> **`prefers-reduced-motion`:** quando ativo, o JS não escreve `--cov` (sem recuo) e o reveal fica por conta do **fallback CSS** (`.rv{opacity:1}` na media query da Task 1.2) — não "consertar" um lado sem o outro.

- [ ] **Step 2: Commit**

```
git add src/components/deck/useDeck.ts
git commit -m "feat(deck): hook useDeck (profundidade --cov + observer reveal/ativo)"
```

### Task 1.5: `Deck` com placeholders + montar no `page.tsx`

**Files:**
- Create: `src/components/deck/Deck.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Deck temporário com placeholders** (registry real entra no Chunk 2/3). Para validar empilhamento já:

```tsx
"use client";
import { useRef } from "react";
import { SCENES } from "./scenes";
import { Scene } from "./Scene";
import { useDeck } from "./useDeck";
import { useLanguage } from "@/lib/LanguageContext";

export function Deck() {
  const ref = useRef<HTMLDivElement>(null);
  useDeck(ref, SCENES.length);
  const { t } = useLanguage();
  return (
    <div className="deck" ref={ref}>
      {SCENES.map((s, i) => (
        <Scene key={s.id} id={s.id} theme={s.theme} index={i}>
          <h2 className="rv" style={{ fontWeight: 800, fontSize: "clamp(40px,8vw,120px)", letterSpacing: "-.03em" }}>
            {t(s.labelKey)}
          </h2>
        </Scene>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Montar no `page.tsx`** dentro do `PageShell`, substituindo Hero + a div de seções:

```tsx
import { Navbar } from "@/components/ui/Navbar";
import { MobileCTA } from "@/components/ui/MobileCTA";
import { PageShell } from "@/components/ui/PageShell";
import { Deck } from "@/components/deck/Deck";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <Navbar />
      <PageShell>
        <Deck />
      </PageShell>
      <MobileCTA />
    </main>
  );
}
```

> Os imports das seções antigas saem do `page.tsx` (serão usados pelo `Deck` a partir do Chunk 2).
> **⚠️ Conteúdo do Footer:** o `page.tsx` atual renderiza `<Footer/>`, que **não** entra como cena própria. Os **dados de contato do `footer.*`** vão para a cena **Contato (12)** na Task 3.8 — não remover o `Footer` sem antes garantir essa migração, senão o conteúdo de rodapé (identidade, local, WhatsApp, e-mail) some.

- [ ] **Step 3: Verificar no navegador**

```
# checar se :3000 já roda; se não: npm run dev
```
Playwright: navegar `http://localhost:3000`, rolar, screenshot. Conferir:
- as 12 cenas empilham (a anterior recua/escurece, a próxima sobe arredondada);
- preloader/menu/cursor ainda funcionam;
- `browser_console_messages` → 0 erros.

- [ ] **Step 4: Commit**

```
git add src/components/deck/Deck.tsx src/app/page.tsx
git commit -m "feat(deck): Deck com placeholders montado no PageShell"
```

---

## Chunk 2: Cenas 01–04 (Hero, Sobre, Tese, Produtos)

Recompor as 4 primeiras seções em layout editorial (portar do protótipo `proto-vertical-v3.html`) e plugar no `Deck` via registry. Conteúdo dos dicionários. Imagens reais (`/images/leko-7.png`, `/leko-sobre.jpg`).

### Task 2.1: Registry de componentes no `Deck`

**Files:**
- Modify: `src/components/deck/Deck.tsx`

- [ ] **Step 1:** Trocar o placeholder por um registry `id → componente`. Cenas ainda não recompostas podem renderizar o componente atual temporariamente (ou um placeholder) — mas a partir daqui cada task substitui o conteúdo de uma cena.

```tsx
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Statement } from "@/components/sections/Statement";
import { Products } from "@/components/sections/WhatsAppAgent";
import { Offers } from "@/components/sections/Offers";
import { Standalone } from "@/components/sections/Standalone";
import { HowIWork } from "@/components/sections/HowIWork";
import { Projetos } from "@/components/sections/Projetos";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Recruiters } from "@/components/sections/Recruiters";
import { FinalCTA } from "@/components/sections/FinalCTA";

const REGISTRY: Record<string, React.ComponentType> = {
  inicio: Hero, sobre: Sobre, tese: Statement, produtos: Products,
  servicos: Offers, pontuais: Standalone, processo: HowIWork, projetos: Projetos,
  experiencia: Experience, formacao: Education, stack: Recruiters, contato: FinalCTA,
};
```
E no map: `const C = REGISTRY[s.id]; return <Scene …><C/></Scene>;`

- [ ] **Step 2:** Verificar build (`npm run build`) e navegador (cenas renderizam os componentes; alguns vão "estourar" o layout até serem recompostos — esperado).
- [ ] **Step 3: Commit** `git add src/components/deck/Deck.tsx` · `feat(deck): registry de secoes`

### Task 2.2: Recompor `Hero` (cena 01, paper)

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1:** Remover do `Hero` o `<section>` próprio, a altura `100dvh`, o fundo, e o parallax de scroll do hero antigo (o recuo agora é do `Scene`). Manter: kicker/headline/subtitle dos dicionários, foto `/images/leko-7.png` com tratamento duotone, HUD. Layout editorial **portado de `proto-vertical-v3.html`** (`.hero-photo` sangrando à direita, `.hero-copy`, `.hud`). Marcar elementos de entrada com `className="rv"`. Manter `useLoading()` para condicionar a entrada ao fim do preloader (pode coexistir com `.rv`/`.in`).
- [ ] **Step 2:** Verificar navegador (Hero como cena 01, foto real, tipografia gigante; reveal ao carregar; 0 erros).
- [ ] **Step 3: Commit** `git add src/components/sections/Hero.tsx` · `feat(deck): cena Hero editorial`

### Task 2.3: Recompor `Sobre` (cena 02, ink)

**Files:**
- Modify: `src/components/sections/Sobre.tsx`

- [ ] **Step 1:** Remover wrapper/fundo próprios. Layout 2 colunas (foto `/leko-sobre.jpg` + texto), número-fantasma "02", stats (15+ / MBA), conteúdo de `about.*`. Tema escuro → texto creme (vem do `.t-ink`). Marcar `.rv`. Portar de `proto-vertical-v3.html` (`.about`, `.ghost`, `.stats`).
- [ ] **Step 2:** Verificar navegador. **Atenção:** se o conteúdo exceder `100dvh` no mobile, aplicar a regra de cena alta (ver Chunk 5 / spec §12) — por ora garantir que não corta no desktop.
- [ ] **Step 3: Commit** `git add src/components/sections/Sobre.tsx` · `feat(deck): cena Sobre editorial`

### Task 2.4: Recompor `Statement` → Tese (cena 03, terra)

**Files:**
- Modify: `src/components/sections/Statement.tsx`

- [ ] **Step 1:** Remover wrapper/fundo. Frase gigante full-bleed (`statement.line1`/`line2`) + caption, sobre terracota (texto creme). Portar `.tese-h` do protótipo. `.rv`.
- [ ] **Step 2:** Verificar navegador.
- [ ] **Step 3: Commit** `git add src/components/sections/Statement.tsx` · `feat(deck): cena Tese`

### Task 2.5: Recompor `Products` → índice editorial (cena 04, paper2)

**Files:**
- Modify: `src/components/sections/WhatsAppAgent.tsx`

- [ ] **Step 1:** Remover wrapper/fundo e o grid de cards antigo. Recompor como **índice editorial**: lista P01–P06 (`products.items`) com títulos grandes e desc à direita (`.prow` do protótipo), hover desloca. `.rv`.
- [ ] **Step 2:** Verificar navegador (índice grande, não grid).
- [ ] **Step 3: Commit** `git add src/components/sections/WhatsAppAgent.tsx` · `feat(deck): cena Produtos (indice editorial)`

### Task 2.6: Revisão visual do Chunk 2

- [ ] Playwright: percorrer cenas 01–04, screenshots desktop; checar contraste (paper→ink→terra→paper2), empilhamento, reveals, 0 erros. `npm run build` passa.
- [ ] Commit de ajustes, se houver.

---

## Chunk 3: Cenas 05–12 (restante)

Mesmo padrão: remover wrapper/fundo próprios, recompor editorial (portar do protótipo onde houver equivalente; manter conteúdo do dicionário), `.rv`, plugado pelo registry.

### Task 3.1: `Offers` → Serviços (05, ink)
- [ ] Remover wrapper; 3 ofertas (`offers.items`) em linhas/cards grandes + `delivery`. `.rv`. Verificar. Commit `git add src/components/sections/Offers.tsx`.

### Task 3.2: `Standalone` → Demandas pontuais (06, sand)
- [ ] Remover wrapper; lista de 3 (`standalone.items`) + CTA. `.rv`. Verificar. Commit `git add src/components/sections/Standalone.tsx`.

### Task 3.3: `HowIWork` → Processo (07, paper)
- [ ] Remover wrapper; passos 01–04 (`howIWork.steps`) + subtitle. `.rv`. Verificar. Commit `git add src/components/sections/HowIWork.tsx`.

### Task 3.4: `Projetos` (08, ink)
- [ ] **Step 1:** Adicionar chave i18n `projects.imageSoon` nos 3 dicionários (pt: "imagem real em breve" · en: "real image coming soon" · es: "imagen real en breve") — não hardcodar copy (regra "conteúdo sempre dos dicionários"). Commit dos dicionários.
- [ ] **Step 2:** Remover wrapper; cards grandes (`projects.items`) com **placeholder tipográfico** (inicial gigante + `t("projects.imageSoon")`) já que não há foto real; tags + link. Portar `.proj` do protótipo. `.rv`. Verificar (navegador). Commit `git add src/components/sections/Projetos.tsx`.

### Task 3.5: `Experience` → Experiência (09, sand)
- [ ] Remover wrapper; lead + 4 cards (`experience.cards`). `.rv`. Verificar. Commit `git add src/components/sections/Experience.tsx`.

### Task 3.6: `Education` → Formação (10, terra)
- [ ] Remover wrapper; 3 itens (`education.items`) em lista acadêmica sobre terracota. `.rv`. Verificar. Commit `git add src/components/sections/Education.tsx`.

### Task 3.7: `Recruiters` → Stack (11, ink)
- [ ] Remover wrapper; grupos de stack (`recruiters.stackGroups`) + "o que busco". `.rv`. Verificar. Commit `git add src/components/sections/Recruiters.tsx`.

### Task 3.8: `FinalCTA` → Contato (12, ink) — inclui dados do Footer
> Esta cena **absorve o conteúdo do antigo `Footer`** (que saiu do `page.tsx`). Antes de começar, ler `src/components/sections/Footer.tsx` para ver exatamente o que ele renderiza dos `footer.*` (identity, location, whatsapp, email, year, visitor_label).
- [ ] **Step 1:** Remover wrapper próprio do `FinalCTA`. Montar a cena: heading + sub (`finalCta.*`) + pills (WhatsApp/E-mail/LinkedIn/GitHub/Instagram, com os links reais do `finalCta`).
- [ ] **Step 2:** Adicionar, no rodapé da cena, os **dados de contato do `footer.*`** (identity, location, whatsapp, email) — replicando o que o `Footer.tsx` exibia, para não perder conteúdo. `.rv`.
- [ ] **Step 3:** Verificar (navegador): heading, pills clicáveis e os dados de contato presentes. Commit `git add src/components/sections/FinalCTA.tsx`.
> A remoção do arquivo `Footer.tsx` (agora órfão) é feita na limpeza da Task 5.4.

### Task 3.9: Revisão visual do Chunk 3
- [ ] Playwright: percorrer todas as 12 cenas (desktop), screenshots; contraste/empilhamento/reveals; 0 erros; `npm run build` passa. Commit de ajustes.

---

## Chunk 4: Navegação (ChapterSpine + menu 12 cenas + i18n)

### Task 4.1: Novas chaves i18n `menu.*`

**Files:**
- Modify: `src/lib/dictionaries/pt-BR.json`, `en.json`, `es.json`

- [ ] **Step 1:** Adicionar ao objeto `menu` de cada dicionário (as 7 existentes já cobrem inicio/sobre/produtos/servicos/projetos/experiencia/contato; adicionar as 5 novas):

pt-BR: `"tese":"Tese","pontuais":"Demandas","processo":"Processo","formacao":"Formação","stack":"Stack"`
en: `"tese":"Thesis","pontuais":"On-demand","processo":"Process","formacao":"Education","stack":"Stack"`
es: `"tese":"Tesis","pontuais":"Puntuales","processo":"Proceso","formacao":"Formación","stack":"Stack"`

- [ ] **Step 2: Commit** `git add src/lib/dictionaries/pt-BR.json src/lib/dictionaries/en.json src/lib/dictionaries/es.json` · `feat(i18n): chaves menu das novas cenas`

### Task 4.2: `ScrambleMenu` consome `SCENES`

**Files:**
- Modify: `src/components/ui/ScrambleMenu.tsx`

- [ ] **Step 1:** Substituir o array fixo de 7 `ITEMS` por um derivado de `SCENES` (12), usando `idx` = `0${i+1}`, `key` = `labelKey`, `href` = `#${id}`. Manter scramble/stagger/seq, fechar ao navegar. **Reconciliar o anchor do início:** remover o mecanismo antigo `#top`/`top:true`; a cena início tem `id="inicio"` (é a primeira/topo do deck), então `href="#inicio"` já leva ao topo. Não deixar `#top` órfão.
- [ ] **Step 2:** Verificar: abrir menu → 12 itens embaralham; clicar pula pra cena certa (`scrollIntoView`/anchor) e fecha; push-aside funciona; 0 erros.
- [ ] **Step 3: Commit** `git add src/components/ui/ScrambleMenu.tsx` · `feat(menu): itens do menu vindos de SCENES (12 cenas)`

### Task 4.3: `ChapterSpine`

**Files:**
- Create: `src/components/deck/ChapterSpine.tsx`
- Modify: `src/components/deck/Deck.tsx` (renderizar o spine com `activeId` do `useDeck`)

- [ ] **Step 1:** Criar o spine (trilho direito, desktop): um item por cena de `SCENES`, label no hover, ativo (`activeId`) em terracota, clique faz `scrollIntoView`. Esconder em `< 820px` (Tailwind `hidden md:flex` ou media query). `Deck` passa `activeId` (retorno de `useDeck`) ao spine.

```tsx
"use client";
import { SCENES } from "./scenes";
import { useLanguage } from "@/lib/LanguageContext";

export function ChapterSpine({ activeId }: { activeId: string | null }) {
  const { t } = useLanguage();
  return (
    <nav className="spine">
      {SCENES.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={s.id === activeId ? "active" : ""}>
          <span className="lbl">{t(s.labelKey)}</span><span className="dot" />
        </a>
      ))}
    </nav>
  );
}
```
(Estilos `.spine`/`.dot`/`.lbl`/`.active` portados do protótipo, no `globals.css`; esconder no mobile.)

> **Visibilidade do spine sobre qualquer cena:** o spine fica fixo por cima de cenas de cores diferentes (creme, preto e **terracota**). Portar o tratamento do protótipo (`mix-blend-mode: difference` + texto branco) e garantir que o **estado ativo** continue visível sobre fundo `terra` — não usar terracota puro no dot ativo sobre cena terra (ele sumiria). Testar a leitura do spine especificamente sobre as cenas 03 (Tese) e 10 (Formação).

- [ ] **Step 2:** Verificar: spine reflete a cena ativa ao rolar; clique pula; some no mobile; 0 erros.
- [ ] **Step 3: Commit** `git add src/components/deck/ChapterSpine.tsx src/components/deck/Deck.tsx src/app/globals.css` · `feat(deck): ChapterSpine com cena ativa`

---

## Chunk 5: Responsivo, acessibilidade e polish

### Task 5.1: Cenas altas no mobile (não cortar conteúdo)
- [ ] Para cenas que excedem `100dvh` no mobile (ex.: Sobre, Stack, Contato): ajustar para o wrapper crescer (`min-height:100dvh; height:auto`) mantendo o empilhamento aceitável, OU reduzir/empilhar o conteúdo no mobile. Garantir que **nada corta**. Ajustar `globals.css`/seções conforme necessário.
- [ ] Verificar Playwright em ~390px (mobile) percorrendo todas as cenas. Commit.

### Task 5.2: Breakpoints mobile/tablet
- [ ] Conferir e ajustar layouts em ~390px e ~820px (Hero foto ao fundo + fade; Sobre foto acima; grids → 1 coluna; spine oculto; barra de progresso no topo do mobile se desejado). Portar media queries do protótipo. Commit por ajuste relevante.

### Task 5.3: `prefers-reduced-motion`
- [ ] Validar (emular reduced-motion no Playwright): recuo/dim/reveals desligados, scroll limpo, âncoras funcionam, conteúdo visível. Ajustar se preciso. Commit.

### Task 5.4: Verificação final
- [ ] `npm run build` passa sem erros/type errors.
- [ ] Playwright nos 3 breakpoints: empilhamento+recuo, contraste por cena, reveals, spine ativo, menu push-aside (12 cenas) pulando certo, preloader, 0 erros de console.
- [ ] Conteúdo idêntico ao atual (texto dos dicionários; imagens reais existentes; projetos com placeholder).
- [ ] Limpeza: remover imports/arquivos órfãos não mais usados — confirmar especificamente **`Footer.tsx`** (conteúdo migrado p/ cena Contato na Task 3.8), e checar `HeroScene`/`SceneGraph` (R3F), `CredentialsBar`, `Stack`, `Courses`. **Conferir com `codegraph_impact`/grep antes de remover cada um.** Commit.

---

## Notas de execução
- Commits frequentes e específicos (nunca `git add -A`).
- A cada chunk, rodar o **plan/visual review** e ajustar antes de seguir.
- O protótipo `proto-vertical-v3.html` é a referência de layout/CSS — portar, não reinventar.
- Se `--cov` não animar com Lenis, usar o fallback `lenis.on("scroll", …)` (Task 1.4).
