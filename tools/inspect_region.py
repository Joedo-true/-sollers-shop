#!/usr/bin/env python3
"""Render a region of a reference image, zoomed, with a labelled grid.

Used to read off polygon coordinates for hand-authored object masks:

    python3 tools/inspect_region.py shop 0.0 0.62 1.0 1.0 counter

Coordinates are fractions of the full image, so the numbers stay valid if a
higher-resolution source is dropped in later. The overlay labels are in the
same fractional units.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "assets" / "reference"
OUT = ROOT / "src" / "assets" / "scene"


def main() -> None:
    name = sys.argv[1]
    x0, y0, x1, y1 = (float(v) for v in sys.argv[2:6])
    label = sys.argv[6] if len(sys.argv) > 6 else "region"

    img = Image.open(REF / f"{name}.jpg").convert("RGB")
    W, H = img.size
    box = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
    piece = img.crop(box)

    # Zoom so small details are readable, capped so the file stays manageable.
    scale = min(3.0, 1500 / max(piece.size))
    piece = piece.resize(
        (int(piece.width * scale), int(piece.height * scale)), Image.LANCZOS
    )
    d = ImageDraw.Draw(piece, "RGBA")

    steps = 10
    for i in range(steps + 1):
        gx = piece.width * i / steps
        gy = piece.height * i / steps
        d.line([(gx, 0), (gx, piece.height)], fill=(0, 255, 255, 110), width=1)
        d.line([(0, gy), (piece.width, gy)], fill=(0, 255, 255, 110), width=1)
        # Label in whole-image fractional coordinates.
        fx = x0 + (x1 - x0) * i / steps
        fy = y0 + (y1 - y0) * i / steps
        d.text((gx + 3, 3), f"{fx:.3f}", fill=(255, 255, 0))
        d.text((3, gy + 3), f"{fy:.3f}", fill=(255, 128, 0))

    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"_grid_{label}.png"
    piece.save(dest)
    print(f"{dest}  {piece.size[0]}x{piece.size[1]}  (source box {box})")


if __name__ == "__main__":
    main()
