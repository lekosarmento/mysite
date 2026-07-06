## Resumo

Reestrutura o site `leko.ai` num **deck imersivo vertical**: 12 cenas full-screen que empilham com profundidade (sticky stack + recuo escala/dim via variável CSS `--cov`), composição editorial e contraste forte, sobre a identidade quente (terracota + off-white, grotesco + IBM Plex Mono). Mantém todo o conteúdo (textos dos dicionários pt-BR/en/es) e as imagens reais.

### O que tem
- **Engine do deck** (`src/components/deck/`): `SCENES` (fonte única), `Scene`, `useDeck` (profundidade `--cov` + reveal/cena ativa num único `IntersectionObserver`), `Deck`, `ChapterSpine`.
- **12 cenas editoriais** recompostas a partir do protótipo: Início (foto duotone), Sobre, Tese, Produtos (índice P01–P06), Serviços, Demandas, Processo, Projetos, Experiência, Formação, Stack, Contato (absorve os dados do antigo Footer).
- **Navegação**: menu lateral scramble (12 itens) + ChapterSpine à direita com cena ativa. Como as cenas são sticky em `top:0`, a navegação rola ao offset calculado (não `scrollIntoView`).
- **Base de motion** já existente integrada: preloader 0→100, smooth-scroll (Lenis), menu push-aside.
- **Responsivo**: no mobile (≤820px) o deck vira fluxo vertical normal (cenas crescem, sem corte). `prefers-reduced-motion` desliga recuo/dim/reveals (hydration mismatch corrigido).
- **Limpeza**: removidos componentes órfãos (HeroScene/SceneGraph R3F, Courses, CredentialsBar, Stack). Footer mantido (blog ainda usa).

## Test Plan
- [x] `npm run build` compila limpo (0 erros de tipo)
- [x] 0 erros de console em desktop, mobile (390px) e reduced-motion
- [x] Empilhamento + recuo (`--cov` 0→1 linear) com Lenis
- [x] Menu (12 cenas) e ChapterSpine navegam pra cena certa; cena ativa atualiza
- [x] Mobile sem corte de conteúdo (cenas pesadas: Sobre, Stack, Contato)
- [ ] Revisão visual final do Leko (ajustes finos de espaçamento/tamanho, se quiser)
- [ ] Pendente do autor: trilha sonora (toggle)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
