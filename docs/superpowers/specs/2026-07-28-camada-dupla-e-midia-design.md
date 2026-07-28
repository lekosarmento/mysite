# Spec de design — Camada dupla de linguagem + mídia real (leko.ia.br)

> **Data:** 2026-07-28 · **Branch:** `redesign/fase-1` · **Status:** aprovado para implementação
> **Origem:** brainstorming com o Leko. Queixa dele: "o site tá muito técnico, quero que ele abrace o leigo e o técnico, e falta imagem e vídeo".

## 1. Objetivo

O deck de 10 cenas hoje fala numa altura só, a de engenheiro. Quem não é da área bate em "RAG & base de conhecimento", "Automações n8n" e "SaaS jurídico com 7 motores, ~10k linhas, multi-tenant" e não descobre o que aquilo resolve. Quem é da área é bem servido, mas é a minoria de quem contrata.

Este spec faz duas coisas:

1. **Instala uma camada de linguagem de negócio por cima da técnica**, sem apagar a técnica.
2. **Enche o site de prova visual**, começando pelo buraco que a própria copy já denunciava.

Critério de sucesso: um dono de clínica entende, sem clicar em nada, o que cada item resolve pra ele; um head de engenharia continua achando lastro suficiente pra levar a sério; e o portfólio deixa de ser uma lista de texto.

### 1.1 Descoberta que motivou o formato

O site **já teve** essa camada e ela se perdeu na reescrita para o deck. Sobraram chaves órfãs no dicionário, que nenhum componente consome:

- `products.moreDetails` (`"+ especificações"`) e `products.lessDetails`
- `about.showMore` (`"✨ Saber mais sobre minha trajetória"`) e `about.showLess`
- `projects.imageSoon` (`"imagem real em breve"`)
- as seções inteiras `offers` e `standalone`, cujos componentes (`Offers.tsx`, `Standalone.tsx`) foram removidos

Destino de cada uma:

| Chave órfã | Destino |
|---|---|
| `products.moreDetails` / `lessDetails` | **revive**, com valor novo: `"+ como funciona"` / `"− recolher"` (§5.1) |
| `projects.imageSoon` | **revive** como legenda do card do Donna, único sem preview (§6.1) |
| `about.showMore` / `showLess` | **deleta**. A trajetória tem cena própria (`experiencia`); duplicar dentro do Sobre era o desenho antigo |
| `offers`, `standalone` | **deleta**, componentes já não existem |

`projects.inProduction` e `projects.viewProject` **não** são órfãs: `Projetos.tsx` consome as duas. Ficam como estão.

## 2. Conceito aprovado: duas alturas + expandir

Todo bloco de conteúdo passa a ter quatro camadas fixas, nesta ordem visual:

| Camada | Papel | Regra |
|---|---|---|
| **Título** | benefício em português comum | nome de tecnologia é **proibido** aqui |
| **Corpo** | 1 a 2 frases sobre o que muda na vida de quem contrata | sem jargão |
| **Lastro** | selo em mono, curto: `RAG · pgvector · busca semântica` | é onde o jargão vive |
| **"+ como funciona"** | detalhe de engenharia, colapsado | reaproveita a copy técnica de hoje |

O leigo entende sem clicar. O técnico vê que tem lastro sem clicar. A profundidade fica a um clique de quem quiser.

**Alternativas descartadas.** Toggle global "simples/técnico" na navbar: dobraria a copy para 6 variantes por bloco (2 registros × 3 idiomas) e o histórico do projeto mostra que manter en/es em sincronia com 1 registro já é custoso. Só o expandir por card, sem reescrever títulos: não resolve, porque a primeira coisa que o leigo lê continua sendo "RAG & base de conhecimento".

## 3. Escopo por cena

| Cena | Tema | O que acontece |
|---|---|---|
| `inicio` | paper | intocada. O kicker e o subtítulo já estão em linguagem de negócio |
| `sobre` | ink | copy intocada (é narrativa, funciona). Ganha faixa de fotos de operação (Onda B) |
| `tese` | terra | intocada. "Estratégia que roda" é slogan, não precisa de tradução |
| `construo` | paper2 | **reescrita completa** dos 6 itens no formato de 4 camadas |
| `diferenciais` | ink | reescrita leve: tirar "deploy", "arquitetura", "codar" dos textos visíveis |
| `portfolio` | sand | **reescrita completa** dos 6 itens + **mudança de layout** para acomodar preview real |
| `experiencia` | paper | copy intocada. Ganha as fotos de evento (Onda B) |
| `formacao` | terra | intocada |
| `stack` | paper2 | **intocada de propósito** |
| `contato` | ink | intocada |

**A cena de Stack/Recrutadores fica densa e técnica de propósito.** É ela que sustenta a metade técnica da promessa. Se todo o site virar linguagem simples, o site perde a prova justamente para quem contrata engenharia. Isto não é um esquecimento do spec: é a decisão.

## 4. Copy nova (pt-BR)

Fonte da verdade para a implementação. `en`/`es` saem depois da aprovação do PT (§8).

### 4.1 Cena `construo` — "O que eu construo"

| Hoje (título) | Título novo | Corpo novo | Lastro |
|---|---|---|---|
| Agentes de IA no WhatsApp | Um atendente que não dorme | Responde, faz triagem e agenda no WhatsApp do seu cliente a qualquer hora. Quando o caso pede gente, ele passa pra você. | `WhatsApp API · LLM · handoff humano` |
| SaaS sob medida com IA | O sistema que sua empresa não acha pronto | Quando nenhuma ferramenta de prateleira serve, eu construo a sua, do primeiro protótipo até o sistema rodando com seus clientes dentro. | `Next.js · Supabase · multi-tenant` |
| RAG & base de conhecimento | Respostas tiradas dos seus documentos | A IA para de inventar e passa a responder com base nos seus contratos, manuais e planilhas. | `RAG · pgvector · busca semântica` |
| Automações n8n | O trabalho repetitivo sai da sua mão | Aquela tarefa de levar dado de um sistema pro outro passa a acontecer sozinha, ligando as ferramentas que você já usa. | `n8n · APIs REST · webhooks` |
| Produção criativa com IA | Imagem e vídeo no ritmo da campanha | Peças de marketing e ativação produzidas com IA, em escala, sem travar o cronograma esperando janela de produção. | `Veo · Runway · Midjourney · ComfyUI` |
| UX/UI & sites com IA | Site e interface que convertem | Landing pages e produtos digitais desenhados pra ficar claros pra quem usa e vender pra quem paga. | `Next.js · Tailwind · design system` |

O `detail` (expandido) de cada item recebe a descrição técnica de hoje, ampliada. Exemplo para RAG: *"Indexo seus documentos em embeddings e sirvo o trecho certo pro modelo na hora da pergunta. pgvector no Supabase, chunking por seção, citação da fonte na resposta."*

### 4.2 Cena `portfolio`

| Produto | Título novo | Corpo novo | Lastro |
|---|---|---|---|
| Donna | Advogado que não perde mais prazo | Vigia os processos no PJe e no DJe, calcula os prazos sozinho e ainda mostra como cada juiz costuma decidir. | `SaaS multi-tenant · 7 motores · LGPD` |
| Saúde Inteligente | A recepção do consultório, 24 horas | Faz triagem, marca consulta e tira dúvida no WhatsApp do paciente. O médico recebe o resumo do dia pronto. | `6 agentes · WhatsApp API · Supabase` |
| Konklave | 29 especialistas de IA discutindo o seu problema | Cada um defende um ponto de vista, eles debatem entre si e a decisão sai por voto com peso. | `multi-agente · orquestração · votação ponderada` |
| AI Content Radar | Conteúdo que se abastece sozinho | Vasculha 33 fontes o dia inteiro, escolhe o que interessa e entrega o texto pronto pra revisão. | `pipeline autônomo · RSS · LLM` |
| ANENO | Quem faz o quê, numa tela só | Site institucional e organograma vivo pra enxergar equipes e projetos da agência sem planilha. | `Next.js · produto interno` |
| Este site | Este site | Desenhado, escrito e codado por mim, incluindo o agente que te recebeu na porta. | `Next.js · R3F · framer-motion` |

### 4.3 Cena `diferenciais`

Trocas pontuais, mantendo os 4 cards e a estrutura:

- card 02: "Do briefing ao **deploy** em produção, a **arquitetura** e o código são meus" → "Do primeiro desenho até o sistema no ar, quem faz é a mesma pessoa. Não passo pra terceiro."
- card 01: "Entendo o negócio antes de **codar**" → "Entendo o negócio antes de escrever a primeira linha."
- card 03 e 04: já legíveis, só ajuste fino.

## 5. Arquitetura

### 5.1 Componente novo: `TechDetail`

`src/components/ui/TechDetail.tsx`. Único componente novo deste spec.

```tsx
<TechDetail tech={["RAG", "pgvector", "busca semântica"]} detail="Indexo seus documentos…" />
```

- Renderiza **sempre** a linha de lastro: os termos em `var(--font-mono)`, separados por `·`, no mesmo peso visual do `.brandwall-label` (10 a 11px, letter-spacing 2px, opacidade ~0.5).
- Renderiza um `<button>` "+ como funciona" que expande `detail`.
- **Acessibilidade:** `aria-expanded` no botão, `aria-controls` apontando pro painel, painel com `id` estável derivado de uma prop `id`. Foco visível herdado do site.
- **Estado local** (`useState`) por instância. Sem contexto, sem estado global: cada card abre e fecha sozinho.
- **Motion:** altura animada via framer-motion, que já é dependência. Respeita `prefers-reduced-motion` (troca a animação por corte seco), seguindo o padrão do resto do deck.
- **Sem dependência de i18n interna.** Recebe texto pronto por prop. Quem chama busca no dicionário. Isso mantém o componente testável e reutilizável entre `construo` e `portfolio`.

Rótulos "+ como funciona" e "− recolher" reaproveitam `products.moreDetails` / `products.lessDetails`, com o valor trocado.

### 5.2 Mudança de formato no dicionário

`products.items[]` e `projects.items[]` ganham dois campos. Formato novo:

```json
{
  "title": "Respostas tiradas dos seus documentos",
  "desc": "A IA para de inventar e passa a responder com base nos seus contratos, manuais e planilhas.",
  "tech": ["RAG", "pgvector", "busca semântica"],
  "detail": "Indexo seus documentos em embeddings e sirvo o trecho certo pro modelo na hora da pergunta…"
}
```

`projects.items[]` mantém `tags` e `link` que já existem, e ganha `image` (§6.1). `tags` e `tech` são coisas diferentes e ambas ficam: `tags` alimenta o filtro visual editorial existente, `tech` alimenta a linha de lastro.

**Os três dicionários precisam ter as mesmas chaves.** O projeto já tem histórico de en/es dessincronizado; a etapa de sincronia (§8, fase 5) não é opcional.

### 5.3 Mudança de layout na cena `portfolio`

**Correção de premissa.** A cena `portfolio` (`Projetos.tsx`) **já é uma grade de 3 colunas** de cards (`.cards.c3` > `.projcard`), com inicial gigante, título, descrição, tags e link. A lista de linhas `.prow` é a cena `construo`, não esta. Isso simplifica a fase 2: não é preciso inventar mecanismo de hover nem resolver descoberta.

**Solução: a imagem entra no próprio card, no lugar da inicial gigante.**

- Cada `.projcard` ganha uma imagem no topo, `aspect-ratio 16/10`, `object-fit: cover`, cantos arredondados, `loading="lazy"` e `width`/`height` explícitos para não causar layout shift.
- A `.init` (inicial gigante) vira o **fallback**: card sem preview continua com a letra. É assim que o Donna fica apresentável sem captura, com a legenda `projects.imageSoon` abaixo.
- Sem hover, sem painel lateral, sem estado. A imagem está sempre visível, que é exatamente o que serve o público leigo.
- `projects.inProduction` e `projects.viewProject` continuam funcionando como hoje.

O custo disso é altura de card. A cena `portfolio` precisa ser medida no browser depois da mudança (§9); se estourar, o caminho é reduzir a descrição visível no card, não remover a imagem.

Isso preserva a identidade editorial da cena e a altura atual, que é a restrição real (a cena `sobre` já quase estourou com a parede de logos).

### 5.4 O que **não** muda

`Deck`, `Scene`, `useDeck`, `ChapterSpine`, `ScrambleMenu`, `Preloader`, `PageShell`, `AgentHost` e o tour do Anfitrião ficam intocados. Este spec mexe em conteúdo, num componente de UI novo e no layout de uma cena.

**Exceção a conferir:** o tour do Anfitrião narra cada cena (`agent.tour.steps.*`). A narração de `construo` cita "RAG, automações n8n". Com a cena reescrita em linguagem de negócio, a narração fica destoando. Ela entra na reescrita da fase 1.

## 6. Mídia

Três ondas, ordenadas por custo e por poder de prova.

### 6.1 Onda A — previews reais do portfólio (não depende do Leko)

Alvos com link público: Saúde Inteligente, Konklave, ANENO, este site. Donna é repositório privado e sem link público: fica com card tipográfico até o Leko mandar uma captura da interface.

Pipeline:

1. **Captura** pelo browser controlado por ferramenta (o projeto **não** tem Playwright como dependência, e não vale adicionar uma devDependency por uma captura ocasional): viewport 1440×900, escala de dispositivo 2×, espera de rede ociosa, screenshot do viewport e não da página inteira.
2. **Tratamento** com `scripts/grade-previews.py`, seguindo o mesmo método de `scripts/grade-sobre.py`: recorte para `16/10`, ponto de preto puxado pro `--ink`, saturação levemente contida pra sentar na paleta. As telas capturadas não podem gritar mais que a cena `sand` em volta.
3. **Saída** em `public/images/previews/<slug>.jpg`, largura 1200, qualidade 88.

O script é versionado, então recapturar depois de um redesign de qualquer produto é um comando.

### 6.2 Onda B — depende de material do Leko

**Fotos de operação e evento.** Ele entrega uma pasta. Tratamento igual ao do retrato da cena Sobre, para tudo ler como a mesma coleção. Destino: faixa horizontal na cena `experiencia`, que hoje é só texto e sustenta a narrativa dos 15 anos apenas por afirmação.

**Vídeo de produto em ação.** 20 a 30 segundos de tela do agente respondendo no WhatsApp. Entra na cena `construo` ou no card do Saúde Inteligente como `<video muted loop playsInline preload="none">` com `poster`, e só recebe `play()` quando a cena entra em viewport, reaproveitando o `IntersectionObserver` que o deck já tem. Sem áudio, sem controles, sem autoplay bloqueado por política de browser.

Bloqueio real: precisa de ambiente com dado de demonstração, ou autorização explícita para gravar conversa real. **Não pode ir ao ar conversa de paciente ou cliente**, nem borrada. Se não houver ambiente de demo, esta peça não é feita.

### 6.3 Onda C — peças geradas com IA (opcional)

Abstratos e motion para `tese` e `diferenciais`, cenas que não têm o que fotografar.

**Ressalva registrada:** as ondas A e B são prova, esta é decoração. Peça genérica de IA num site cujo argumento é "não é slide, é produto rodando" trabalha contra o próprio discurso. Só fazer se as ondas A e B estiverem no ar e o resultado pedir respiro visual.

## 7. Performance e riscos

- **Altura de cena** é a restrição recorrente do deck. Toda adição visual precisa ser medida com a cena aberta no browser, não estimada. O `TechDetail` expande empurrando conteúdo pra baixo: em cena cheia, expandir dois cards ao mesmo tempo pode passar do viewport. Mitigação: a cena cresce (o deck já suporta cena mais alta que a viewport, com `top` negativo via `useDeck`), então não corta, só exige rolagem.
- **Peso de imagem.** 5 previews + fotos de evento entram no mesmo documento. Todas com `loading="lazy"`, dimensões explícitas pra não causar layout shift.
- **Turbopack** já mordeu este projeto duas vezes servindo CSS e imagem velhos de cache. Ao validar mudança visual que "não aparece", apagar `.next` com o servidor parado antes de investigar qualquer outra coisa.
- **Regressão do tour.** Qualquer mudança de id de cena ou de estrutura de card pode quebrar o tour do Anfitrião. Rodar o tour completo (10 cenas) antes de considerar qualquer fase pronta.

## 8. Fases de entrega

| Fase | Conteúdo | Depende de |
|---|---|---|
| 1 | `TechDetail` + reescrita PT de `construo`, `portfolio` e `diferenciais` + narração do tour + limpeza das chaves órfãs | nada |
| 2 | Onda A: captura, tratamento e novo layout da cena `portfolio` | fase 1 |
| 3 | Fotos de evento na cena `experiencia` | **Leko entregar a pasta** |
| 4 | Vídeo de produto | **Leko liberar ambiente de demo** |
| 5 | Sincronia `en` e `es` de tudo que mudou | aprovação do PT pelo Leko |
| 6 | Onda C, opcional | tudo acima no ar |

Fases 3 e 4 estão bloqueadas por material de terceiro e não seguram as demais. Fase 5 só depois do PT aprovado, para não traduzir texto que ainda vai mudar.

## 9. Definição de pronto (por fase)

- `npm run build` limpo.
- Zero erro de console com o deck percorrido do início ao fim.
- Tour do Anfitrião completo, 10 cenas, sem quebra.
- Cena alterada verificada em 1440×900 e 390×844, com a última linha de conteúdo dentro do viewport antes da cena seguinte cobrir.
- Nas fases de copy: nenhum nome de tecnologia em título de card fora da cena `stack`.
