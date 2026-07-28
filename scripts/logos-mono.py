"""Converte logomarcas de clientes em PNG monocromatico branco com fundo vazado.

Gera os arquivos de `public/images/brands/` usados na parede de marcas da cena
Sobre. Cada logo original chega com um problema diferente (xadrez PINTADO nos
pixels, fundo branco solido, arte branca sobre fundo colorido, alfa real mas
colorida), entao o alfa e derivado por modo. No fim tudo vira RGB branco + alfa,
aparado no bbox e normalizado na mesma altura.

Uso: jogue os originais numa pasta, ajuste SRC e JOBS e rode
    python scripts/logos-mono.py

Depois adicione a marca em `src/components/sections/Sobre.tsx` com o `scale`
optico (a proporcao sai no log deste script: logo larga pede scale menor).

Requer: pillow, numpy.
"""

from PIL import Image
import numpy as np
import os

SRC = r"C:\Users\werkl\Downloads\Logos_Site"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "images", "brands")
TARGET_H = 200  # ~8x a altura de exibicao (23px), com folga pra retina

# (arquivo de origem, nome de saida, modo, recorte)
# modo: dark_on_light | light_on_dark | keep_alpha | dark_on_light_drop_yellow
# recorte: (esq, topo, dir, base) aplicado ANTES do processamento, ou None
JOBS = [
    ("jack.png", "jack-daniels", "keep_alpha", None),
    # o Red Bull vem no lockup "Racing Team", com o texto e os vaos das letras
    # em BRANCO OPACO (invisiveis sobre fundo branco). dark_on_light derruba o
    # branco junto com o disco amarelo e sobra o logo classico.
    ("redbull.png", "red-bull", "dark_on_light_drop_yellow", None),
    ("heineken.png", "heineken", "dark_on_light", None),
    ("brahma.jpg", "brahma", "light_on_dark", None),
    ("corona.png", "corona", "dark_on_light", None),
    ("jeep.jpg", "jeep", "dark_on_light", None),
    ("kwai.png", "kwai", "dark_on_light", None),
    ("boticario.png", "boticario", "dark_on_light", None),
    # so o wordmark: o logo completo e vertical (proporcao 0.67) e sumiria numa
    # fileira de logos deitadas
    ("cafe.webp", "cafe-de-la-musique", "keep_alpha", (0, 2427, 2481, 3508)),
    ("moises.jpeg", "moises", "dark_on_light", None),
]


def knee(a, lo, hi):
    """Rampa linear: <=lo vira 0, >=hi vira 255. Mata residuo de fundo."""
    return np.clip((a.astype(np.float32) - lo) / (hi - lo), 0, 1) * 255


def alpha_for(arr, mode):
    rgb = arr[..., :3].astype(np.int16)
    src_a = arr[..., 3].astype(np.float32)
    mn = rgb.min(axis=-1)

    if mode == "dark_on_light":
        # distancia do branco: qualquer cor (amarelo, ciano, navy) fica opaca,
        # branco e cinza-claro do xadrez pintado somem
        return knee(255 - mn, 22, 120) * (src_a / 255.0)

    if mode == "light_on_dark":
        # arte branca sobre fundo colorido: quanto mais alto o canal minimo,
        # mais opaco
        return knee(mn, 40, 210) * (src_a / 255.0)

    if mode == "keep_alpha":
        return src_a

    if mode == "dark_on_light_drop_yellow":
        # o disco amarelo viraria um borrao branco colado nos touros
        r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
        yellow = (r > 180) & (g > 140) & (b < 120)
        return np.where(yellow, 0, knee(255 - mn, 22, 120) * (src_a / 255.0))

    raise ValueError(mode)


def process(src_name, out_name, mode, crop):
    im = Image.open(os.path.join(SRC, src_name)).convert("RGBA")
    if crop:
        im = im.crop(crop)
    arr = np.array(im)

    a = np.clip(alpha_for(arr, mode), 0, 255).astype(np.uint8)

    out = np.zeros_like(arr)
    out[..., :3] = 255  # monocromatico branco
    out[..., 3] = a
    img = Image.fromarray(out, "RGBA")

    # apara o vazio em volta pra todas as logos comecarem do mesmo jeito
    bbox = Image.fromarray((a > 8).astype(np.uint8) * 255).getbbox()
    if bbox:
        img = img.crop(bbox)

    w, h = img.size
    new_w = max(1, round(w * TARGET_H / h))
    img = img.resize((new_w, TARGET_H), Image.LANCZOS)

    path = os.path.join(OUT, f"{out_name}.png")
    img.save(path, optimize=True)
    print(f"{out_name:22s} {new_w:4d}x{TARGET_H}  proporcao {new_w / TARGET_H:5.2f}  {os.path.getsize(path) // 1024}kb")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for job in JOBS:
        process(*job)
