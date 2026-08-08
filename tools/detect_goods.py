#!/usr/bin/env python3
"""Locate the rolled-scroll goods on the counter semi-automatically.

Eyeballing capsule coordinates for a dozen goods is slow and inaccurate. The
coloured wrappers are strongly saturated while the counter, trays and floor are
muted wood tones, so the wrappers separate cleanly on saturation. For each blob
we take its principal axis (PCA) as the roll's axis and its extent across that
axis as the radius, then stretch along the axis to take in the dark end cap and
the pale cut face, which are not saturated and so are missed by the mask.

    python3 tools/detect_goods.py          # print GOODS dict + overlay

Verify the overlay before pasting the numbers into tools/cutout.py.
"""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "assets" / "reference"
OUT = ROOT / "src" / "assets" / "scene"

# Counter area only — keeps the saturated shelf goods on the left wall out.
REGION = (0.03, 0.66, 1.00, 0.92)
MIN_AREA = 900          # px, drops ribbon scraps and specks
AXIS_STRETCH = 1.62     # wrapper -> full roll incl. cap and cut face


def main() -> None:
    img = Image.open(REF / "shop.jpg").convert("RGB")
    W, H = img.size
    x0, y0, x1, y1 = REGION
    bx0, by0 = int(x0 * W), int(y0 * H)
    crop = img.crop((bx0, by0, int(x1 * W), int(y1 * H)))

    hsv = np.array(crop.convert("HSV")).astype(np.float32)
    h_, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    sat = (s > 118) & (v > 95)

    # Neighbouring rolls touch, so one saturation mask fuses them into a single
    # blob. They are deliberately different colours though, so bucketing by hue
    # first and labelling within each bucket pulls them back apart.
    segments: list[np.ndarray] = []
    for lo in range(0, 256, 16):
        band = sat & (h_ >= lo) & (h_ < lo + 16)
        if band.sum() < MIN_AREA:
            continue
        band = ndimage.binary_closing(band, structure=np.ones((5, 5)))
        band = ndimage.binary_opening(band, structure=np.ones((3, 3)))
        lab_b, nb = ndimage.label(band)
        for j in range(1, nb + 1):
            segments.append(lab_b == j)

    found: list[tuple[float, tuple, tuple, float]] = []
    for comp in segments:
        ys, xs = np.where(comp)
        if xs.size < MIN_AREA:
            continue
        pts = np.stack([xs, ys]).astype(np.float32)
        c = pts.mean(axis=1, keepdims=True)
        u, sv, _ = np.linalg.svd(pts - c, full_matrices=False)
        axis = u[:, 0]
        proj = (pts - c).T @ axis
        perp = (pts - c).T @ u[:, 1]
        half = float(proj.max() - proj.min()) / 2 * AXIS_STRETCH
        rad = float(np.percentile(np.abs(perp), 88))
        cx, cy = float(c[0, 0]), float(c[1, 0])
        a = (cx - axis[0] * half, cy - axis[1] * half)
        b = (cx + axis[0] * half, cy + axis[1] * half)
        # order so A is the upper end
        if a[1] > b[1]:
            a, b = b, a
        found.append((cx, a, b, rad))

    found.sort(key=lambda t: t[0])  # left to right

    def frac(p):
        return ((p[0] + bx0) / W, (p[1] + by0) / H)

    print("GOODS = {")
    entries = []
    for idx, (_, a, b, rad) in enumerate(found, 1):
        fa, fb = frac(a), frac(b)
        fr = rad / ((W + H) / 2)
        entries.append((fa, fb, fr))
        print(f'    "good_{idx:02d}": (({fa[0]:.4f}, {fa[1]:.4f}), '
              f'({fb[0]:.4f}, {fb[1]:.4f}), {fr:.4f}),')
    print("}")
    print(f"\n{len(found)} goods detected")

    # Overlay for eyeballing
    scale = min(2.4, 1800 / max(crop.size))
    prev = crop.resize((int(crop.width * scale), int(crop.height * scale)),
                       Image.LANCZOS)
    d = ImageDraw.Draw(prev, "RGBA")
    for idx, (_, a, b, rad) in enumerate(found, 1):
        ax, ay = a[0] * scale, a[1] * scale
        bxp, byp = b[0] * scale, b[1] * scale
        r = rad * scale
        col = (0, 255, 0)
        d.ellipse([ax - r, ay - r, ax + r, ay + r], outline=col, width=2)
        d.ellipse([bxp - r, byp - r, bxp + r, byp + r], outline=col, width=2)
        ang = math.atan2(byp - ay, bxp - ax)
        nx, ny = -math.sin(ang) * r, math.cos(ang) * r
        d.line([(ax + nx, ay + ny), (bxp + nx, byp + ny)], fill=col, width=2)
        d.line([(ax - nx, ay - ny), (bxp - nx, byp - ny)], fill=col, width=2)
        d.text((ax - 6, ay - 18), str(idx), fill=(255, 255, 0))
    OUT.mkdir(parents=True, exist_ok=True)
    prev.save(OUT / "_check_detect.png")
    print(f"overlay -> {OUT / '_check_detect.png'}")


if __name__ == "__main__":
    main()
