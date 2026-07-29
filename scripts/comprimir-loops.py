"""Recorta, trata e comprime os loops dos produtos pra virarem mídia de card.

Entra o webm cru do Playwright (viewport 1440x900, ~17 a 23s), sai um par
mp4 + webm de ~8s, 720x450, sem áudio, leve o bastante pra rodar quatro ao
mesmo tempo numa cena só.

O tratamento de cor é o mesmo dos previews estáticos (scripts/grade-previews.py):
saturação contida e ponto de preto puxado pro --ink, senão o loop colorido
brigaria com a cena `sand` em volta e com o print parado que serve de poster.

    python scripts/comprimir-loops.py

Requer ffmpeg no PATH.
"""

import json
import subprocess
import sys
from pathlib import Path

CRU = Path(r"C:\Users\werkl\.claude\jobs\c3073911\tmp\video")
OUT = Path(__file__).resolve().parent.parent / "public" / "videos" / "produtos"

LARGURA, ALTURA = 720, 450  # 16/10, 2x o tamanho de exibição do card
FPS = 24
SEGUNDOS = 8.0

# de onde tirar os 8 segundos: cada produto tem um trecho em que a coisa
# acontece, e o começo costuma ser carregamento
INICIO = {
    "saude-inteligente": 5.5,   # depois do primeiro caso montar
    "konklave": 3.0,
    "aneno": 3.5,
    "este-site": 3.0,
}

# recorte no frame de 1440x900. Só o Saúde precisa enquadrar: o resto é a
# página inteira, que já é 16/10.
RECORTE = {
    "saude-inteligente": (200, 170, 1040, 650),
}

# saturação a 58% e preto no --ink #13100C, espelhando grade-previews.py
FILTRO_COR = (
    "eq=saturation=0.58,"
    "colorlevels=rimin=-0.075:gimin=-0.063:bimin=-0.047,"
    "eq=gamma=1.02"
)


def ffmpeg(args):
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"ffmpeg falhou: {r.stderr[:600]}")


def cadeia(slug):
    partes = []
    if slug in RECORTE:
        x, y, w, h = RECORTE[slug]
        partes.append(f"crop={w}:{h}:{x}:{y}")
    partes += [f"scale={LARGURA}:{ALTURA}:flags=lanczos", f"fps={FPS}", FILTRO_COR]
    return ",".join(partes)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    if not CRU.exists():
        sys.exit(f"gravações cruas não encontradas em {CRU}")

    resumo = {}
    for pasta in sorted(p for p in CRU.iterdir() if p.is_dir()):
        slug = pasta.name
        fontes = list(pasta.glob("*.webm"))
        if not fontes:
            print(f"{slug}: sem gravação, pulando")
            continue
        fonte = fontes[0]
        vf = cadeia(slug)
        ss = str(INICIO.get(slug, 3.0))

        mp4 = OUT / f"{slug}.mp4"
        ffmpeg(["-ss", ss, "-t", str(SEGUNDOS), "-i", str(fonte), "-vf", vf,
                "-an", "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p",
                "-crf", "30", "-preset", "slow", "-movflags", "+faststart", str(mp4)])

        webm = OUT / f"{slug}.webm"
        ffmpeg(["-ss", ss, "-t", str(SEGUNDOS), "-i", str(fonte), "-vf", vf,
                "-an", "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0",
                "-row-mt", "1", "-deadline", "good", str(webm)])

        resumo[slug] = {"mp4_kb": mp4.stat().st_size // 1024, "webm_kb": webm.stat().st_size // 1024}
        print(f"{slug}: mp4 {resumo[slug]['mp4_kb']}kb · webm {resumo[slug]['webm_kb']}kb")

    total = sum(v["mp4_kb"] for v in resumo.values())
    print(f"\ntotal mp4: {total}kb em {len(resumo)} loops")
    print(json.dumps(resumo, indent=2))
