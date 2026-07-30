# Higgsfield: passo a passo pra gerar as peças

Você gera lá, salva em `C:\Users\werkl\Downloads\videos-site` e me avisa. Eu
trato, comprimo e integro. Não existe API nem MCP do Higgsfield, então esse é o
único caminho: eu não consigo disparar a geração sozinho.

Nessa pasta já tem **`referencia-paleta.png`**, que eu gerei pra você subir junto
do prompt. Ela é o que mais segura a cor perto do site, e o porquê está no
passo 2.

---

## O que gerar: 3 peças

Os cards do portfólio **já estão resolvidos** com gravação real dos produtos
rodando. Ali peça sintética seria pior, porque o argumento da cena é "produtos
rodando, não slides".

Sobra o que é atmosfera, onde não existe o que filmar:

| Arquivo pra salvar | Onde entra | Prioridade |
|---|---|---|
| `tese-fundo.mp4` | Atrás de "Estratégia que roda." | **Faça essa primeiro** |
| `formacao-fundo.mp4` | Cena Formação, a mais vazia do deck hoje | Segunda |
| `hero-fundo.mp4` | Abertura, atrás do seu retrato | Só se sobrar vontade |

Comece pela Tese. É a cena de texto isolado em fundo chapado, onde o ganho é
maior e o risco de atrapalhar a leitura é menor. Se essa ficar boa, a gente
sabe que o caminho tá certo antes de você gastar crédito nas outras.

---

## Passo 1: escolher o modo certo

No Higgsfield você vai encontrar dois caminhos. **Use image-to-video, não
text-to-video.**

Motivo: em text-to-video você descobre a cor só depois de gastar o crédito do
vídeo. Em image-to-video você gera uma imagem primeiro (barato e rápido),
confere se a paleta ficou certa, e só anima quando a imagem estiver boa. Se o
primeiro quadro está na paleta, o vídeo inteiro fica.

Então a ordem é:

1. Gerar a **imagem** (Higgsfield Soul, ou qualquer gerador de imagem do painel)
2. Conferir a cor a olho
3. Só então mandar **animar** essa imagem

---

## Passo 2: subir a referência de paleta

Onde tiver campo de imagem de referência, style reference, character reference
ou "upload image", suba o **`referencia-paleta.png`**.

Isso importa mais do que parece. Modelo de vídeo genérico puxa pra azul-teal
cinematográfico sozinho, é o visual padrão da indústria. E azul é justamente a
identidade que você descartou. A referência ancora a geração no terracota.

Se o campo tiver força ajustável (style strength, reference weight), use
**média**. No máximo ele copia o degradê da referência em vez de se inspirar
nele.

---

## Passo 3: os prompts, pra copiar e colar

Prompt em inglês de propósito: esses modelos foram treinados majoritariamente
em inglês e obedecem melhor.

### Peça 1 · `tese-fundo` (faça essa primeiro)

**Imagem:**

```
Extreme close-up of fine terracotta clay dust suspended in a shaft of soft side light, deep warm near-black background, burnt orange and sand tones, shallow depth of field, fine 35mm film grain, matte finish, minimal and editorial, no text, no people
```

**Animação (ao mandar animar a imagem):**

```
The dust drifts very slowly upward, almost imperceptible motion, static camera, no zoom, no pan
```

### Peça 2 · `formacao-fundo`

**Imagem:**

```
Macro shot of stacked layers of warm off-white paper and sand-toned card stock edges, soft raking light across the layers, a single thin terracotta edge, deep warm shadow, fine 35mm film grain, matte, editorial, no text, no people
```

**Animação:**

```
The light shifts very slowly across the paper layers, extremely subtle motion, static camera
```

### Peça 3 · `hero-fundo` (opcional)

**Imagem:**

```
Bare warm concrete wall in off-white and sand tones, long soft diagonal shadow, warm side light, deep warm black on one side, fine 35mm film grain, matte, architectural and minimal, no text, no people
```

**Animação:**

```
The shadow moves almost imperceptibly across the wall, static camera, no zoom
```

### Negative prompt (se o painel tiver esse campo)

Cole igual nas três:

```
text, letters, words, watermark, logo, people, faces, hands, blue, cyan, teal, purple, neon, high saturation, fast motion, camera shake, zoom
```

---

## Passo 4: os ajustes

| Ajuste | Valor | Por quê |
|---|---|---|
| Proporção | **16:9** | É fundo de cena, ocupa a largura toda |
| Duração | **5 a 8s** | Acima disso só engorda o arquivo; o loop repete |
| Movimento / motion strength | **o mais baixo que tiver** | É fundo atrás de texto. Movimento rápido atrapalha a leitura e briga com o site, que é contido |
| Câmera / camera preset | **static, ou nenhum** | Os presets de câmera do Higgsfield (dolly, crash zoom, orbit) são o oposto do que serve aqui |
| Áudio | **desligado** | Todo vídeo do site roda mudo, trilha é peso jogado fora |
| Resolução | **a maior disponível** | Eu comprimo depois. Quanto melhor entra, melhor sai |

---

## Passo 5: o que descartar antes de me mandar

Olhe cada peça antes de salvar e **descarte se tiver**:

- **Qualquer texto ou letra**, mesmo borrada. O site é trilíngue: texto queimado
  no vídeo ficaria em português pro visitante espanhol.
- **Pessoa, rosto ou mão.** Você já é o rosto do site, no hero. Mais gente
  aparecendo confunde.
- **Azul, ciano ou roxo** em qualquer canto.
- **Movimento rápido** ou tremida de câmera.
- **Corte visível** entre o fim e o começo, se você já conseguir notar.

Gerar de novo é mais barato que consertar depois.

---

## Passo 6: salvar e me chamar

Salve na pasta `C:\Users\werkl\Downloads\videos-site` com **exatamente** esses
nomes, que é como eu vou saber onde cada peça entra:

```
tese-fundo.mp4
formacao-fundo.mp4
hero-fundo.mp4
```

Se gerar mais de uma opção da mesma peça, numere: `tese-fundo-1.mp4`,
`tese-fundo-2.mp4`, e eu escolho a melhor com você.

Aí é só me chamar. Daí eu faço:

1. Confiro cada peça a olho e descarto o que tiver artefato ou texto
2. Trato na paleta se estiver puxando pra fora dela, com o mesmo script dos previews
3. Corto o loop no ponto que emenda, e comprimo pra mp4 + webm
4. Monto na cena usando o `ProductLoop`, que já cuida do que importa: só toca o
   que está na tela, não baixa nada antes da hora e não dá play pra quem pediu
   `prefers-reduced-motion`
5. Build, deploy e verificação ao vivo nos três idiomas

---

## Orçamento de peso

O deck inteiro hoje tem 264kb de vídeo, somando os quatro loops de produto. Cada
peça nova de fundo precisa caber em **150kb no mp4** depois da minha compressão.
Isso eu resolvo cortando duração e resolução, mas é bom você saber por que eu
posso encurtar sua peça de 8s pra 6s: é onde boa parte dos seus visitantes abre
o site, no 4G.

---

## Se você preferir não depender do Higgsfield

Você já tem **FAL_KEY** configurada no PRENSA Studio (`~/money-studio/.env.local`).
Com ela eu consigo gerar essas mesmas peças daqui, sem você precisar fazer nada,
usando os mesmos prompts deste documento. Consome crédito da sua conta fal.ai,
então eu te digo o custo estimado antes de disparar. É só falar.
