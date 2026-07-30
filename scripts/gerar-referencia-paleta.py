"""Monta a imagem de referencia de paleta pra subir no Higgsfield.

Modelo de video generico puxa pra azul-teal cinematografico sozinho. Subir uma
referencia visual junto do prompt e o que mais segura a cor perto da identidade
do site. A imagem traz as tres cores chapadas, um degrade entre elas, a
granulacao que o site usa e os hex escritos, pra servir tambem de cola.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

OUT = Path(r"C:\Users\werkl\Downloads\videos-site\referencia-paleta.png")

W, H = 1920, 1080
PAPER = (0xF2, 0xEF, 0xE7)  # --paper
INK = (0x13, 0x10, 0x0C)    # --ink
TERRA = (0xB5, 0x67, 0x3F)  # --terra
SAND = (0xE2, 0xD9, 0xC8)   # areia intermediaria da cena `sand`


def fonte(tamanho):
    for nome in ("consola.ttf", "cour.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(nome, tamanho)
        except OSError:
            continue
    return ImageFont.load_default()


img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)

# faixa de degrade ink -> terra -> paper: e a transicao de luz que o video deve ter
for x in range(W):
    t = x / W
    if t < 0.5:
        k = t / 0.5
        cor = tuple(round(INK[i] + (TERRA[i] - INK[i]) * k) for i in range(3))
    else:
        k = (t - 0.5) / 0.5
        cor = tuple(round(TERRA[i] + (PAPER[i] - TERRA[i]) * k) for i in range(3))
    d.line([(x, 0), (x, 420)], fill=cor)

# chapados com o hex escrito
blocos = [("#13100C  ink", INK, PAPER), ("#B5673F  terracota", TERRA, PAPER),
          ("#E2D9C8  areia", SAND, INK), ("#F2EFE7  paper", PAPER, INK)]
larg = W // len(blocos)
for i, (rotulo, cor, texto) in enumerate(blocos):
    d.rectangle([i * larg, 420, (i + 1) * larg, 820], fill=cor)
    d.text((i * larg + 30, 760), rotulo, fill=texto, font=fonte(26))

d.text((30, 860), "PALETA DO SITE leko.ia.br  ·  SEM AZUL, CIANO OU ROXO", fill=INK, font=fonte(34))
d.text((30, 915), "luz lateral suave  ·  movimento muito lento  ·  granulado fino de filme",
       fill=INK, font=fonte(26))
d.text((30, 960), "sem texto na peca  ·  sem pessoas  ·  comeco e fim parecidos, pra emendar o loop",
       fill=INK, font=fonte(26))

# granulacao: e o acabamento que o site tem, entao a referencia tem que ter
rng = np.random.default_rng(7)
arr = np.array(img).astype(np.int16)
arr += rng.normal(0, 4.5, arr.shape).astype(np.int16)
img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT)
print(f"{OUT}  {img.size[0]}x{img.size[1]}  {OUT.stat().st_size // 1024}kb")
