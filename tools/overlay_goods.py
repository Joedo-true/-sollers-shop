#!/usr/bin/env python3
"""Draw the GOODS capsule outlines over the counter so misalignment is visible.

    python3 tools/overlay_goods.py

Far quicker than guessing coordinates blind: render, look, nudge, repeat.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cutout import GOODS, REF, OUT  # noqa: E402

REGION = (0.03, 0.66, 1.00, 0.90)  # counter area
COLORS = [
    (255, 0, 0), (0, 200, 255), (255, 255, 0), (0, 255, 0), (255, 0, 255),
    (255, 128, 0), (128, 255, 255), (255, 255, 255), (0, 0, 255),
]


def main() -> None:
    img = Image.open(REF / "shop.jpg").convert("RGB")
    W, H = img.size
    x0, y0, x1, y1 = REGION
    box = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
    piece = img.crop(box)
    scale = min(3.0, 1800 / max(piece.size))
    piece = piece.resize(
        (int(piece.width * scale), int(piece.height * scale)), Image.LANCZOS
    )
    d = ImageDraw.Draw(piece, "RGBA")

    def to_local(fx: float, fy: float) -> tuple[float, float]:
        return ((fx * W - box[0]) * scale, (fy * H - box[1]) * scale)

    for i, (name, (a, b, rf)) in enumerate(GOODS.items()):
        col = COLORS[i % len(COLORS)]
        ax, ay = to_local(*a)
        bx, by = to_local(*b)
        r = rf * ((W + H) / 2) * scale
        # capsule outline = two circles + the two parallel sides
        d.ellipse([ax - r, ay - r, ax + r, ay + r], outline=col, width=2)
        d.ellipse([bx - r, by - r, bx + r, by + r], outline=col, width=2)
        ang = math.atan2(by - ay, bx - ax)
        nx, ny = -math.sin(ang) * r, math.cos(ang) * r
        d.line([(ax + nx, ay + ny), (bx + nx, by + ny)], fill=col, width=2)
        d.line([(ax - nx, ay - ny), (bx - nx, by - ny)], fill=col, width=2)
        d.line([(ax, ay), (bx, by)], fill=col + (140,), width=1)
        d.text((ax + 4, ay - 14), name.replace("good_", ""), fill=col)

    dest = OUT / "_check_overlay.png"
    piece.save(dest)
    print(f"{dest}  {piece.size[0]}x{piece.size[1]}")


if __name__ == "__main__":
    main()
