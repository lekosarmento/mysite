"""Traz as capturas de tela dos produtos pra paleta do site.

Cada produto do portfolio tem identidade propria: Saude Inteligente e verde,
Konklave e azul-noite com dourado, ANENO e creme com vermelho. Coladas cruas
dentro da cena `sand`, as seis miniaturas gritam mais que a cena em volta e o
portfolio vira colcha de retalhos.

O tratamento e o mesmo de scripts/grade-sobre.py, so que generico: recorte
16/10 (a proporcao do box do card), saturacao contida, curva S suave e ponto de
preto puxado pro --ink, que e o que faz a imagem sentar no fundo em vez de
flutuar sobre ele.

    python scripts/grade-previews.py

Le as capturas cruas de RAW (PNG, 1 por slug) e grava
public/images/previews/<slug>.jpg. Requer: pillow, numpy.
"""

import os
from pathlib import Path

import numpy as np
from PIL import Image

RAW = Path(r"C:\Users\werkl\.claude\jobs\c3073911\tmp\raw")
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "previews"

INK = np.array([0x13, 0x10, 0x0C], dtype=np.float32)  # --ink #13100C

ASPECT = 16 / 10  # mesma proporcao do box .projcard img
OUT_W = 1200
QUALITY = 88

SAT = 0.58  # quanto da saturacao original sobrevive
EXPOSURE = 0.95
S_CURVE = 0.16


def crop_aspect(img):
    """Recorta no centro pra ASPECT, tirando o excedente do lado que sobra."""
    w, h = img.size
    if w / h > ASPECT:  # largo demais: corta nas laterais
        new_w = round(h * ASPECT)
        x = (w - new_w) // 2
        return img.crop((x, 0, x + new_w, h))
    new_h = round(w / ASPECT)  # alto demais: corta embaixo, o topo e o que importa
    return img.crop((0, 0, w, new_h))


def grade(img):
    hsv = np.array(img.convert("HSV")).astype(np.float32)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]

    # saturacao contida: a cor da marca do produto continua legivel, mas para
    # de competir com o terracota que e o unico acento do site
    s = s * SAT

    hsv = np.stack([h, np.clip(s, 0, 255), v], axis=-1)
    rgb = np.array(Image.fromarray(hsv.astype(np.uint8), "HSV").convert("RGB")).astype(np.float32)

    n = rgb / 255.0 * EXPOSURE
    n = n + S_CURVE * n * (1 - n) * (2 * n - 1)

    # ponto de preto = fundo da cena: nenhum pixel fica mais escuro que o --ink
    return Image.fromarray(np.clip(INK + n * (255.0 - INK), 0, 255).astype(np.uint8), "RGB")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    fontes = sorted(RAW.glob("*.png"))
    if not fontes:
        raise SystemExit(f"nenhuma captura crua em {RAW}")

    for src in fontes:
        out = crop_aspect(grade(Image.open(src).convert("RGB")))
        out = out.resize((OUT_W, round(OUT_W / ASPECT)), Image.LANCZOS)
        destino = OUT / f"{src.stem}.jpg"
        out.save(destino, quality=QUALITY, optimize=True)
        print(f"{destino.name}  {out.size[0]}x{out.size[1]}  {os.path.getsize(destino) // 1024}kb")
