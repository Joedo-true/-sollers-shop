#!/usr/bin/env python3
"""Cut sprites out of the reference art for the merchant-shop scene.

Run from the repo root:

    python3 tools/cutout.py merchant     # background-removed merchant
    python3 tools/cutout.py crops        # individual objects from the shop
    python3 tools/cutout.py all

Sources live in assets/reference/ (working files, not shipped).
Sprites are written to src/assets/scene/ and are bundled by Vite.

Why flood-fill instead of a colour threshold: the merchant wears a white
turban and light shirt. Keying on "close to background grey" would punch holes
straight through them. Filling inward from the border only removes background
that is actually connected to the edge, so enclosed light areas survive.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "assets" / "reference"
OUT = ROOT / "src" / "assets" / "scene"

SENTINEL = (255, 0, 255)


def _alpha_from_border_fill(rgb: Image.Image, thresh: int = 42) -> Image.Image:
    """Return an L-mode alpha mask: 0 where background, 255 where subject."""
    work = rgb.copy()
    w, h = work.size
    # Seed from many points along the border so a shadow touching one edge
    # doesn't leave a whole side unfilled.
    seeds: list[tuple[int, int]] = []
    for i in range(0, w, max(1, w // 24)):
        seeds += [(i, 0), (i, h - 1)]
    for j in range(0, h, max(1, h // 24)):
        seeds += [(0, j), (w - 1, j)]

    for seed in seeds:
        if work.getpixel(seed) == SENTINEL:
            continue
        ImageDraw.floodfill(work, seed, SENTINEL, thresh=thresh)

    arr = np.array(work)
    bg = np.all(arr == np.array(SENTINEL, dtype=arr.dtype), axis=-1)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    return Image.fromarray(alpha, mode="L")


def _despill(rgb: np.ndarray, alpha: np.ndarray, bg: np.ndarray) -> np.ndarray:
    """Pull background colour back out of soft edge pixels.

    Edge pixels are a blend of subject and background. Left alone they leave a
    pale halo once the sprite sits on a dark scene. Given the known background
    colour we can invert the blend: C = a*S + (1-a)*B  ->  S = (C - (1-a)*B)/a
    """
    a = (alpha.astype(np.float32) / 255.0)[..., None]
    safe = np.clip(a, 0.25, 1.0)  # don't amplify noise where nearly transparent
    src = (rgb.astype(np.float32) - (1.0 - a) * bg) / safe
    return np.clip(src, 0, 255).astype(np.uint8)


def cut_merchant() -> None:
    src = REF / "merchant.jpg"
    img = Image.open(src).convert("RGB")

    alpha = _alpha_from_border_fill(img, thresh=42)

    # Feather one pixel so the outline is anti-aliased rather than stair-stepped,
    # then pull the matte in slightly to bite off the JPEG fringe.
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.0))
    a = np.array(alpha).astype(np.float32)
    a = np.clip((a - 96) * (255.0 / (255 - 96)), 0, 255)  # erode ~ half a pixel

    rgb = np.array(img)
    corner = np.array(img.convert("RGB").getpixel((2, 2)), dtype=np.float32)
    rgb = _despill(rgb, a.astype(np.uint8), corner)

    out = np.dstack([rgb, a.astype(np.uint8)])
    sprite = Image.fromarray(out, mode="RGBA")

    bbox = sprite.getbbox()
    if bbox:
        sprite = sprite.crop(bbox)

    OUT.mkdir(parents=True, exist_ok=True)
    # WebP, not PNG: the single-file build base64-inlines every sprite, and PNG
    # made that document unusably large. WebP keeps the alpha and costs ~9%.
    dest = OUT / "merchant.webp"
    sprite.save(dest, "WEBP", quality=88, method=6)

    kept = float((np.array(sprite)[..., 3] > 8).mean())
    print(f"merchant.webp {sprite.size[0]}x{sprite.size[1]}  "
          f"{dest.stat().st_size // 1024} KB  opaque={kept:.1%}")

    # Contact sheet on a dark ground makes any leftover halo obvious.
    check = Image.new("RGB", sprite.size, (42, 33, 27))
    check.paste(sprite, (0, 0), sprite)
    check.save(OUT / "_check_merchant.png")  # inspection only, not shipped


# Regions of shop.jpg worth pulling out as their own animatable layers.
# Values are fractions of width/height so they survive a higher-res re-export.
SHOP_CROPS: dict[str, tuple[float, float, float, float]] = {
    "banner": (0.03, 0.01, 0.99, 0.16),      # calligraphy banner overhead
    "compass": (0.83, 0.51, 1.00, 0.68),     # compass on its stand, right
    "worldmap": (0.30, 0.19, 0.78, 0.35),    # hanging world map, centre
    "scroll_left": (0.05, 0.36, 0.30, 0.60),  # hanging map scroll, left
    "scroll_right": (0.68, 0.33, 0.92, 0.60), # hanging chart, right
    "counter": (0.02, 0.68, 0.98, 0.95),     # counter with the goods
    "shelf_left": (0.00, 0.18, 0.22, 0.62),  # shelved rolls, left wall
    "rabbit": (0.90, 0.73, 1.00, 0.84),      # the little figurine, bottom right
}


def cut_crops() -> None:
    src = REF / "shop.jpg"
    img = Image.open(src).convert("RGB")
    w, h = img.size
    OUT.mkdir(parents=True, exist_ok=True)

    for name, (x0, y0, x1, y1) in SHOP_CROPS.items():
        box = (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))
        piece = img.crop(box)
        dest = OUT / f"{name}.webp"
        piece.save(dest, "WEBP", quality=86, method=6)
        print(f"{name+'.webp':18} {piece.size[0]}x{piece.size[1]}  "
              f"{dest.stat().st_size // 1024} KB")


def main() -> None:
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("merchant", "all"):
        cut_merchant()
    if what in ("crops", "all"):
        cut_crops()
    if what in ("goods", "all"):
        cut_goods()



# ── Individual goods on the counter ──────────────────────────────────────────
# Each rolled scroll is a capsule: a cylinder seen at an angle. Describing it by
# its two end centres plus a radius (all as fractions of the image) is both
# far shorter than a hand-traced polygon and much easier to nudge — and it
# survives a higher-resolution re-export unchanged.
#   name: (end A, end B, radius)
GOODS: dict[str, tuple[tuple[float, float], tuple[float, float], float]] = {
    # Left tray, five rolls running parallel down-left.
    "good_pearl":   ((0.168, 0.731), (0.099, 0.819), 0.0158),
    "good_rose":    ((0.209, 0.729), (0.140, 0.817), 0.0158),
    "good_saffron": ((0.250, 0.729), (0.181, 0.817), 0.0158),
    "good_ember":   ((0.291, 0.733), (0.222, 0.821), 0.0158),
    "good_olive":   ((0.330, 0.745), (0.261, 0.833), 0.0152),
    # The big vermilion roll laid out on its own in the middle.
    "good_vermil":  ((0.420, 0.760), (0.404, 0.856), 0.0200),
    # Right tray, four rolls.
    "good_cream": ((0.697, 0.747), (0.640, 0.832), 0.0166),
    "good_amber": ((0.732, 0.741), (0.677, 0.826), 0.0166),
    "good_jade":  ((0.768, 0.734), (0.715, 0.821), 0.0166),
    "good_coral": ((0.815, 0.724), (0.758, 0.813), 0.0166),
    "good_rust":  ((0.858, 0.731), (0.805, 0.808), 0.0166),
}


def _capsule_alpha(size, p1, p2, r, feather=1.6):
    """Anti-aliased alpha for a capsule (stadium) between two points."""
    w, h = size
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    ax, ay = p1
    bx, by = p2
    dx, dy = bx - ax, by - ay
    L2 = max(dx * dx + dy * dy, 1e-6)
    t = np.clip(((xs - ax) * dx + (ys - ay) * dy) / L2, 0.0, 1.0)
    dist = np.hypot(xs - (ax + t * dx), ys - (ay + t * dy))
    return np.clip((r - dist) / feather + 0.5, 0.0, 1.0)


def cut_goods() -> None:
    img = Image.open(REF / "shop.jpg").convert("RGB")
    W, H = img.size
    rgb = np.array(img)
    OUT.mkdir(parents=True, exist_ok=True)

    for name, (a, b, rf) in GOODS.items():
        p1 = (a[0] * W, a[1] * H)
        p2 = (b[0] * W, b[1] * H)
        r = rf * ((W + H) / 2)
        alpha = _capsule_alpha((W, H), p1, p2, r)
        sprite = Image.fromarray(
            np.dstack([rgb, (alpha * 255).astype(np.uint8)]), mode="RGBA"
        )
        bbox = sprite.getbbox()
        if bbox:
            sprite = sprite.crop(bbox)
        dest = OUT / f"{name}.webp"
        sprite.save(dest, "WEBP", quality=88, method=6)
        print(f"{name+'.webp':18} {sprite.size[0]}x{sprite.size[1]}  "
              f"{dest.stat().st_size // 1024} KB")

if __name__ == "__main__":
    main()
