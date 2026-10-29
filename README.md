# leko.ia.br

Meu site pessoal e portfólio: quem eu sou, o que construo e um blog sobre IA aplicada.

🔗 **No ar:** [leko.ia.br](https://leko.ia.br)

<!-- TODO: adicionar um print do hero em docs/preview.png -->
<!-- ![Site](docs/preview.png) -->

---

## Destaques

- **Hero em 3D** com React Three Fiber e Drei, com uma cena de grafo animada.
- **Três idiomas** (português, inglês e espanhol) com dicionários JSON e troca de idioma sem recarregar a página.
- **Caminhos por perfil:** o visitante escolhe "sou empresa", "sou recrutador" ou "fale comigo" e vê o conteúdo mais relevante para ele.
- **Blog em Markdown** com front matter (`gray-matter`) e renderização via `react-markdown` + Tailwind Typography.
- **Rascunhos de post com IA:** um painel admin gera um rascunho via OpenRouter, eu reviso e edito, e só então publico.
- **Feed de notícias de IA** agregado do Hacker News e de feeds RSS.
- **Comentários e compartilhamento** nos posts.
- **Detalhes de interação:** scroll suave com Lenis, cursor customizado, botões magnéticos, textura de grão e animações com Framer Motion.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Three.js / React Three Fiber · Framer Motion · Lenis · OpenRouter · Vercel Analytics

## Rodando localmente

```bash
git clone https://github.com/lekosarmento/mysite.git
cd mysite
npm install
echo "OPENROUTER_API_KEY=sua-chave" > .env.local   # só é necessária para gerar rascunhos
npm run dev
```

## Estrutura

```
src/
  app/
    page.tsx            # home, montada a partir das seções
    blog/               # listagem e página de cada post
    admin/              # gerar, revisar e publicar posts
    api/                # generate, admin/draft, admin/publish, comments, visitors
  components/
    3d/                 # cena do hero
    sections/           # Hero, Sobre, Projetos, Stack, Experiência…
    ui/                 # Navbar, cursor, botões, scroll suave
  content/blog/         # posts em Markdown
  lib/
    dictionaries/       # pt-BR, en, es
    blog.ts             # leitura dos posts
    news.ts             # agregador de notícias
```
