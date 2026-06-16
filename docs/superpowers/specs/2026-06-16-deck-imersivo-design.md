# Spec de design — Deck imersivo vertical (leko.ai)

> **Data:** 2026-06-16 · **Branch:** `redesign/fase-1` · **Status:** aprovado para implementação
> **Origem:** brainstorming com protótipo validado (`/.superpowers/brainstorm/34138-1781577830/proto-vertical-v3.html`).

## 1. Objetivo

Transformar o portfólio `leko.ai` de um scroll vertical de seções empilhadas (com "cara de landing page") em uma **apresentação imersiva**: um *deck* vertical onde cada seção é uma **cena full-screen que empilha com profundidade**. Mesma identidade visual aprovada (creme quente `#F2EFE7` + acento terracota `#B5673F`, grotesco bold + IBM Plex Mono) e **mesmo conteúdo/imagens** atuais — muda a forma de apresentar e navegar, não o conteúdo.

Critério de sucesso: ao percorrer, a experiência lê como uma apresentação guiada (não uma página de marketing), funciona impecável e responsiva em **celular, tablet e desktop**, e preserva todo o motion já construído (preloader, menu scramble *push-aside*, cursor, grain, i18n).

## 2. Conceito aprovado (a "linguagem")

- Cada seção = **cena de `100dvh`** que "gruda" no topo (`position: sticky`) e empilha.
- Ao rolar, a cena atual **recua**: `scale` 1 → ~0.92, leve `translateY` negativo, e um **overlay de escurecimento** (dim) sobe até ~0.55 de opacidade.
- A próxima cena **sobe por cima** com **canto superior arredondado** (`border-radius: 30px 30px 0 0`) e **sombra superior**, lendo como cartas/painéis empilhando.
- **Contraste forte** alternando os temas de cor entre cenas (creme ↔ quase-preto ↔ terracota cheio).
- **Composição editorial** por cena: tipografia gigante, assimetria, número-fantasma de fundo, índices em mono. Nada de "label + heading + grid de 3 colunas".

## 3. Arquitetura

### 3.1 Componentes novos

- **`Deck`** (`src/components/deck/Deck.tsx`): container do empilhamento. Renderiza os `Scene` em sequência dentro de um wrapper de fluxo normal. Não controla scroll (o Lenis cuida); só estabelece o contexto de empilhamento e fornece a lista ordenada de cenas (id + label) para a navegação.
- **`Scene`** (`src/components/deck/Scene.tsx`): unidade reutilizável de cena.
  - Props: `id: string`, `label: string` (nome do capítulo p/ spine e menu), `theme: 'paper' | 'paper2' | 'sand' | 'ink' | 'terra'`, `index: number`, `last?: boolean`, `children`.
  - Estrutura: wrapper `sticky top-0 h-[100dvh]` com a cor do tema, topo arredondado + sombra (exceto a 1ª cena), um `.inner` centralizado para o conteúdo, e um `.dim` overlay.
  - **Recuo (profundidade):** via **framer-motion `useScroll`** atrelado ao elemento da cena, derivando um progresso de "quanto a próxima cena já cobriu esta" e mapeando (`useTransform`) para `scale`/`y` do `.inner` e `opacity` do `.dim`. **Sem GSAP** (regra do projeto). Em `prefers-reduced-motion`, o recuo é desativado (cena estática).
  - **Reveal de entrada:** elementos `.rv` revelam (fade + translateY) quando a cena entra, via `whileInView`/IntersectionObserver, com stagger.
- **`ChapterSpine`** (`src/components/deck/ChapterSpine.tsx`): trilho fixo à direita (desktop) com um item por cena; mostra o capítulo ativo (derivado da posição de scroll) e permite pular (`scrollIntoView`). Esconde no mobile (`< 820px`), onde a navegação fica por menu + barra de progresso.
- **`useSceneStack`** (hook, opcional): centraliza o registro/ordem das cenas e o cálculo do capítulo ativo, consumido por `Deck`/`ChapterSpine`. Pode ser dispensado se a lista de cenas for estática.

### 3.2 Integração com o que já existe (reaproveitado, sem reescrever)

- **`PageShell`** continua envolvendo o conteúdo e fazendo o *push-aside* lateral quando o menu abre. O `Deck` passa a ser o conteúdo dentro do `PageShell` (no lugar do `<Hero/> + <div>…seções…</div>` atuais em `src/app/page.tsx`).
- **`ScrambleMenu` + `MenuContext`**: menu scramble *push-aside* mantido; passa a listar as cenas do deck para pular. (Hoje a lista de itens do menu é fixa em `ScrambleMenu.tsx`; será alinhada à lista de cenas do deck.)
- **`Preloader` + `LoadingContext`**: mantidos. A entrada das cenas (e do Hero) continua condicionada ao fim do preloader.
- **`SmoothScrollProvider` (Lenis)**: mantido; o empilhamento sticky e o `useScroll` leem o scroll dirigido pelo Lenis. O travamento de scroll com menu aberto continua válido.
- **`CustomCursor`, `GrainOverlay`, `Navbar`, `MobileCTA`**: mantidos.
- **i18n (`LanguageContext` + dicionários pt-BR/en/es)**: fonte única do conteúdo das cenas — **sem alteração de texto**.

### 3.3 Seções → cenas

Cada componente de seção existente em `src/components/sections/*` é **recomposto** para o formato editorial de cena e passa a ser renderizado dentro de um `Scene` no `Deck`. O conteúdo (texto/imagem) permanece o mesmo, vindo dos dicionários. Componentes hoje fora do fluxo principal (ex.: `Stack.tsx`, `Courses.tsx`, `CredentialsBar.tsx`) seguem o mesmo critério de antes (não entram, salvo se já estavam no `page.tsx`).

## 4. Mapa de cenas (ordem · tema · tratamento)

Mesmo conteúdo do site atual. Sequência de cores com contraste forte (ajustável no fino durante a implementação):

| # | Cena (componente) | Tema | Tratamento editorial |
|---|---|---|---|
| 01 | Início (`Hero`) | paper | foto sangrando na borda + tipografia gigante sobreposta + HUD mono |
| 02 | Sobre (`Sobre`) | ink | foto + texto em 2 colunas + stats (15+ / MBA) + número-fantasma "02" |
| 03 | Tese (`Statement`) | **terra** | frase gigante full-bleed ("Sem palco. / Só operação.") |
| 04 | Produtos (`WhatsAppAgent`/Products) | paper2 | **índice editorial** (lista P01–P06, títulos grandes, desc à direita) |
| 05 | Serviços (`Offers`) | ink | 3 ofertas em linhas/cards grandes + prazo |
| 06 | Demandas pontuais (`Standalone`) | sand | lista de 3 |
| 07 | Como trabalho (`HowIWork`) | paper | passos 01–04 |
| 08 | Projetos (`Projetos`) | ink | cards grandes; placeholder tipográfico até a foto real chegar |
| 09 | Experiência (`Experience`) | sand | ANENO / Goa Shantti / Skybar / Helsinki |
| 10 | Formação (`Education`) | **terra** | lista acadêmica (MBA / Publicidade / Complementares) |
| 11 | Recrutadores/Stack (`Recruiters`) | ink | grupos de stack + "o que busco" |
| 12 | Contato (`FinalCTA` + dados do `Footer`) | ink | finale + pills (WhatsApp/E-mail/LinkedIn/GitHub/Instagram) + dados de contato |

Observações:
- A regra de contraste é alternar claro (paper/paper2/sand) e escuro (ink), com **terra** como acento periódico (cenas 03 e 10). A sequência final é validável visualmente.
- Cenas com escala de cor escura usam texto creme; o `Scene` aplica os tokens automaticamente conforme `theme`.

## 5. Tokens de cor de cena (`globals.css`)

Adicionar tokens/classes de tema de cena reaproveitando as variáveis existentes:
`--paper #F2EFE7 · --paper2 #FBF9F3 · --sand #E6DECF · --ink #13100C · --terra #B5673F · --cream #F4EEE3`.
Classes `.t-paper/.t-paper2/.t-sand/.t-ink/.t-terra` definem `background`/`color` e ajustam cores de `kick`/`sub`/bordas em fundo escuro. (No light/dark theme já existente, o deck usa a paleta clara como base; modo escuro é fora de escopo desta spec — ver §9.)

## 6. Navegação

- **Spine** (direita, desktop): um ponto por cena, rótulo no hover, ativo em terracota; clique faz `scrollIntoView` suave.
- **Menu scramble *push-aside*** (já implementado): aberto pelo botão "Menu" da Navbar; empurra o deck para a esquerda e lista as 12 cenas com efeito de embaralhar; clique pula para a cena e fecha. Fecha por clique fora (capturador transparente), ESC ou ✕.
- **Preloader** 0→100 na entrada; só então a 1ª cena revela.
- **Progresso (mobile):** barra fina de progresso no topo no lugar do spine.

## 7. Responsividade

- **Desktop/tablet (≥ 821px):** deck completo com profundidade; spine visível; layouts editoriais em 2 colunas onde fizer sentido.
- **Mobile (≤ 820px):** o empilhamento sticky continua (cada cena `100dvh`); conteúdo colapsa para 1 coluna; fotos reposicionam (Hero: foto ao fundo com fade; Sobre: foto acima do texto); tipografia escala via `clamp`; índices/listas adaptam; spine oculto (menu + barra de progresso). O recuo/escala pode ser atenuado no mobile por clareza/desempenho.
- Validar nos 3 tamanhos (mobile ~390px, tablet ~820px, desktop ~1440px).

## 8. Acessibilidade, performance e qualidade

- **`prefers-reduced-motion`:** desativa recuo/escala/dim e reveals; vira scroll limpo com âncoras funcionando.
- **Performance:** apenas `transform`/`opacity` (GPU); cálculo de progresso via `useScroll` (sem rAF manual concorrente desnecessário). A cena R3F neural antiga (`HeroScene`) sai do fluxo — o Hero já usa `<img>`.
- **Navegação por teclado/links:** âncoras de cena com `id`; `scrollIntoView` para os jumps; foco visível preservado.
- **SEO:** todo o conteúdo permanece no DOM (sem virtualização/lazy que esconda texto), headings semânticos por cena.

## 9. Fora de escopo / pendências

- **Imagens reais dos projetos** (placeholder tipográfico até o Leko enviar).
- **Trilha sonora** (item de motion bloqueado por falta do arquivo de áudio).
- **Modo escuro** do deck (a spec assume base clara; revisitar depois).
- **Conteúdo novo de portfólio** (Leko cogitou adicionar mais cases — fora desta entrega).

## 10. Inventário de mudanças

**Novos:** `Deck.tsx`, `Scene.tsx`, `ChapterSpine.tsx`, (opcional) `useSceneStack.ts`, tokens `.t-*` no `globals.css`.
**Modificados:** `src/app/page.tsx` (passa a montar o `Deck` dentro do `PageShell`); cada `src/components/sections/*` listada no §4 (recomposição editorial + uso dentro de `Scene`); `ScrambleMenu.tsx` (alinhar lista de itens às cenas do deck).
**Mantidos sem alteração funcional:** `Preloader`, `LoadingContext`, `MenuContext`, `PageShell`, `SmoothScrollProvider`, `CustomCursor`, `GrainOverlay`, `Navbar`, `MobileCTA`, dicionários i18n.

## 11. Validação

- Conferir cada cena nos 3 breakpoints (mobile/tablet/desktop) via navegador (Playwright + screenshots).
- Conferir: empilhamento/recuo, contraste por cena, reveals, spine ativo, menu push-aside pulando para cenas, preloader, `prefers-reduced-motion`, 0 erros de console.
- Conteúdo idêntico ao atual (texto dos dicionários, imagens reais existentes).

## 12. Riscos e mitigações

- **Sticky + Lenis:** garantir que o empilhamento e o `useScroll` leem o scroll do Lenis corretamente; testar cedo numa fatia (Hero→Sobre).
- **Cenas com muito conteúdo em `100dvh` no mobile** (ex.: Sobre, Stack): permitir que a cena cresça além de `100dvh` quando necessário (mantendo o snap/stick no início) para não cortar texto.
- **`100dvh` em mobile (barras do navegador):** usar `100dvh` e testar em iOS/Android.
- **⚠️ Segredo vazado:** `test-key.js` na raiz tem chave OpenRouter — **nunca** `git add -A`; commitar arquivos específicos.
