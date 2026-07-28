"""Traz o retrato da cena Sobre pra paleta do site (ink + terracota + cream).

O retrato original tem uma parede de luz AZUL saturada de um lado e LARANJA do
outro. O azul briga de frente com o terracota que e o acento do site, entao ele
e dessaturado ate virar grafite (a tensao frio/quente da composicao sobrevive,
a cor que briga nao) e o laranja e puxado pro matiz exato do --terra.

O resultado ja sai gravado no arquivo, entao `.about .ph img` NAO leva filtro
CSS. Se trocar o retrato, rode isto de novo em vez de reintroduzir filtro:

    python scripts/grade-sobre.py

Requer: pillow, numpy.
"""

from PIL import Image
import numpy as np
import os

SRC = r"C:\Users\werkl\Downloads\ChatGPT Image 13 de jun. de 2026, 18_20_17.png"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "leko-sobre.jpg")

INK = np.array([0x13, 0x10, 0x0C], dtype=np.float32)  # --ink #13100C
TERRA_H = 14.4  # matiz do --terra #B5673F na escala 0-255 do HSV do PIL (~20 graus)
TERRA_S = 0.66

CROP_TOP = 0.0  # fracao da sobra vertical tirada de cima (0 = corta so embaixo)
OUT_W = 1000  # ~2x a largura de exibicao (o box e 3/4, ~480px no desktop)


def smoothstep(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def band(h, lo, hi, feather):
    """Peso 1 dentro de [lo,hi] com borda suave de `feather` dos dois lados."""
    return smoothstep((h - (lo - feather)) / feather) * smoothstep(((hi + feather) - h) / feather)


def grade(img):
    hsv = np.array(img.convert("HSV")).astype(np.float32)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]

    # ---- lado frio: azul/ciano vira grafite -------------------------------
    # dessaturar sozinho deixa o azul MAIS claro do que era; sem escurecer
    # junto, o lado frio vira um vazamento de luz prateado e rouba a cena
    cool = band(h, 120, 175, 22)  # ~170-247 graus
    s = s * (1 - cool * 0.90)
    v = v * (1 - cool * 0.30)

    # ---- lado quente: laranja vira terracota da paleta ---------------------
    warm = band(h, 0, 40, 14)
    h = h * (1 - warm * 0.7) + TERRA_H * (warm * 0.7)
    s = s * (1 - warm) + np.minimum(s, TERRA_S * 255) * warm
    # so as altas quentes descem: o terracota do site e fosco, nao neon
    v = v * (1 - warm * (v / 255.0) ** 2 * 0.18)

    hsv = np.stack([np.clip(h, 0, 255), np.clip(s, 0, 255), np.clip(v, 0, 255)], axis=-1)
    rgb = np.array(Image.fromarray(hsv.astype(np.uint8), "HSV").convert("RGB")).astype(np.float32)

    # ---- curva S suave + exposicao pra sentar no tom da cena ---------------
    n = rgb / 255.0 * 0.94
    n = n + 0.14 * n * (1 - n) * (2 * n - 1)

    # ---- ponto de preto = cor de fundo da cena, pra foto fundir no ink -----
    return Image.fromarray(np.clip(INK + n * (255.0 - INK), 0, 255).astype(np.uint8), "RGB")


def crop_34(img):
    """Recorta pra 3/4, que e a proporcao fixa do box `.about .ph`."""
    w, h = img.size
    new_h = round(w / 0.75)
    if new_h > h:  # imagem larga demais: corta na largura
        new_w = round(h * 0.75)
        x = (w - new_w) // 2
        return img.crop((x, 0, x + new_w, h))
    y = round((h - new_h) * CROP_TOP)
    return img.crop((0, y, w, y + new_h))


if __name__ == "__main__":
    out = crop_34(grade(Image.open(SRC).convert("RGB")))
    out = out.resize((OUT_W, round(OUT_W / 0.75)), Image.LANCZOS)
    out.save(OUT, quality=92, optimize=True)
    print(f"{OUT}  {out.size[0]}x{out.size[1]}  {os.path.getsize(OUT) // 1024}kb")
