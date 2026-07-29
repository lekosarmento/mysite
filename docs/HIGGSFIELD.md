# Briefing pro Higgsfield

Você gera lá, joga os arquivos em `C:\Users\werkl\Downloads\videos-site` e me
avisa. Eu trato, comprimo e integro. Não existe API nem MCP do Higgsfield, então
esse é o único caminho: eu não consigo disparar a geração sozinho.

## Onde cabe vídeo gerado no site (e onde não cabe)

Os cards do portfólio **já estão resolvidos** com gravação real dos produtos
rodando (`public/videos/produtos/`). Ali vídeo sintético seria pior: o argumento
da cena é "produtos rodando, não slides", e uma peça gerada enfraquece isso.

Sobra o que é atmosfera, onde não há o que filmar:

| Onde | Cena | O que pedir | Duração |
|---|---|---|---|
| Fundo da cena Tese | `tese` (03) | A frase "Estratégia que roda." vive sozinha num fundo chapado hoje. Cabe uma textura em movimento muito lenta atrás do texto. | 6 a 10s, loop |
| Abertura | `inicio` (01) | Alternativa ao retrato parado do hero. Só vale se ficar sutil: o hero já tem parallax e o texto precisa continuar legível. | 8s, loop |
| Cena Formação | `formacao` (08) | A mais visualmente vazia do deck hoje. | 6 a 8s, loop |

## Especificação técnica

Gere no maior tamanho que der; eu comprimo. O que importa é respeitar isto:

- **Proporção 16:10** se for pra card, **16:9 ou 21:9** se for fundo de cena.
- **Sem áudio.** Todo vídeo do site roda mudo, então trilha é peso jogado fora.
- **Sem texto embutido** na peça. O site é trilíngue (pt/en/es): texto queimado
  no vídeo ficaria em português pro visitante espanhol.
- **Começo e fim parecidos**, pra emendar no loop sem corte visível.
- **Movimento lento.** É fundo, não é o assunto. Movimento rápido atrás de texto
  atrapalha a leitura e o site inteiro é editorial e contido.

## Paleta (importante)

O site é quente: off-white `#F2EFE7`, tinta `#13100C`, acento terracota
`#B5673F`. **Nada de azul, ciano ou roxo**, que é justamente a identidade que
você descartou. Se a peça vier colorida demais eu trato ela na paleta com o
mesmo script dos previews (`scripts/grade-previews.py`), mas quanto mais perto
já vier, melhor.

Descritores que costumam funcionar pro seu caso: terracota, areia, off-white
quente, luz lateral suave, granulado fino de filme, concreto claro, sombra longa.

## Quando os arquivos estiverem lá

Me chama e eu faço, na ordem:

1. Confiro cada peça a olho e descarto o que tiver artefato ou texto.
2. Recorto e comprimo pra mp4 + webm com `scripts/comprimir-loops.py`
   (hoje ele lê as gravações de produto; adapto a fonte pras suas peças).
3. Trato na paleta se estiver puxando pra fora dela.
4. Monto na cena usando o `ProductLoop`, que já cuida do que importa: só toca o
   que está na tela, não baixa nada antes da hora e não dá play pra quem pediu
   `prefers-reduced-motion`.
5. Build, deploy e verificação ao vivo nos três idiomas.

## Orçamento de peso

O deck inteiro hoje tem 264kb de vídeo somando os quatro loops de produto. Cada
peça nova de fundo deve caber em **150kb no mp4**. Acima disso o site começa a
pesar no 4G, que é onde boa parte dos seus visitantes vai abrir.
