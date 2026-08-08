#!/usr/bin/env python3
"""Light the merchant to sit inside the shop instead of on top of it.

    python3 tools/relight.py

A cut-out keeps the lighting of the picture it came from. Dropped into another
room it reads as a sticker: wrong colour temperature, wrong contrast, no light
coming from where the room's lights are. This grades the sprite to the target
room, driven by the room's own measured statistics rather than taste:

1. Match colour temperature and contrast to the room (per-channel mean and
   spread, applied gently so he doesn't dissolve into the background).
2. Damp saturation toward the room's, since the painting is muted.
3. Relight directionally — the lanterns and windows in shop2 sit high and to
   the left, so add a warm gradient falling that way and let the opposite side
   drop into shadow.
4. Add a soft warm rim on the lit edge, which is what actually sells a figure
   as standing in a room.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / "assets" / "reference"
OUT = ROOT / "src" / "assets" / "scene"

# How far to move the sprite toward the room's statistics. Full correction
# looks flat — the figure must still read as the subject, not the wallpaper.
TEMP_STRENGTH = 0.55
CONTRAST_STRENGTH = 0.45
SAT_STRENGTH = 0.5

# Where the room's light comes from, in sprite-relative coordinates.
LIGHT = (0.30, 0.12)
WARM = np.array([1.10, 1.015, 0.86], dtype=np.float32)   # lantern light
COOL = np.array([0.88, 0.90, 0.97], dtype=np.float32)    # shadow side


def room_stats(img: Image.Image) -> tuple[np.ndarray, np.ndarray, float]:
    a = np.asarray(img.convert("RGB"), dtype=np.float32)
    mean = a.reshape(-1, 3).mean(axis=0)
    std = a.reshape(-1, 3).std(axis=0)
    mx, mn = a.max(axis=2), a.min(axis=2)
    sat = float(np.mean((mx - mn) / np.maximum(mx, 1e-5)))
    return mean, std, sat


def main() -> None:
    room = Image.open(REF / "shop2.jpg")
    r_mean, r_std, r_sat = room_stats(room)

    sprite = Image.open(OUT / "merchant.webp").convert("RGBA")
    arr = np.asarray(sprite, dtype=np.float32)
    rgb, alpha = arr[..., :3], arr[..., 3:4]

    solid = alpha[..., 0] > 24
    if not solid.any():
        raise SystemExit("merchant sprite has no opaque pixels")

    s_mean = rgb[solid].mean(axis=0)
    s_std = rgb[solid].std(axis=0)
    s_mx, s_mn = rgb.max(axis=2), rgb.min(axis=2)
    s_sat = float(np.mean(((s_mx - s_mn) / np.maximum(s_mx, 1e-5))[solid]))

    # 1-2. Colour temperature and contrast, partially applied.
    scale = np.clip(r_std / np.maximum(s_std, 1e-5), 0.75, 1.3)
    scale = 1.0 + (scale - 1.0) * CONTRAST_STRENGTH
    target_mean = s_mean + (r_mean - s_mean) * TEMP_STRENGTH
    out = (rgb - s_mean) * scale + target_mean

    # 3. Saturation toward the room's.
    lum = out @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    sat_factor = 1.0 + ((r_sat / max(s_sat, 1e-5)) - 1.0) * SAT_STRENGTH
    sat_factor = float(np.clip(sat_factor, 0.6, 1.15))
    out = lum[..., None] + (out - lum[..., None]) * sat_factor

    # 4. Directional relight: warm toward the lamps, cool and darker away.
    h, w = out.shape[:2]
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.hypot(xs / w - LIGHT[0], (ys / h - LIGHT[1]) * 0.75)
    fall = np.clip(1.0 - d / 1.15, 0.0, 1.0)[..., None]
    tint = COOL + (WARM - COOL) * fall
    out = out * tint * (0.82 + 0.30 * fall)

    # 5. Warm rim on the lit edge: the sprite's own alpha, blurred and pushed
    #    outward, minus itself, leaves a band that hugs the silhouette.
    a_img = Image.fromarray(alpha[..., 0].astype(np.uint8), "L")
    spread = np.asarray(a_img.filter(ImageFilter.MaxFilter(5))
                        .filter(ImageFilter.GaussianBlur(3.5)), dtype=np.float32)
    rim = np.clip(spread - alpha[..., 0], 0, 255) / 255.0
    rim *= fall[..., 0] ** 1.5
    out += rim[..., None] * np.array([120.0, 96.0, 52.0], dtype=np.float32)

    out = np.clip(out, 0, 255).astype(np.uint8)
    lit = Image.fromarray(np.dstack([out, alpha[..., 0].astype(np.uint8)]), "RGBA")
    dest = OUT / "merchant_lit.webp"
    lit.save(dest, "WEBP", quality=90, method=6)

    print(f"room  mean={r_mean.round(1)} sat={r_sat:.3f}")
    print(f"before mean={s_mean.round(1)} sat={s_sat:.3f}")
    after = np.asarray(lit, dtype=np.float32)[..., :3][solid]
    print(f"after  mean={after.mean(axis=0).round(1)}")
    print(f"{dest.name}  {lit.size[0]}x{lit.size[1]}  {dest.stat().st_size // 1024} KB")

    # Side-by-side against the room for eyeballing.
    room_small = room.copy()
    room_small.thumbnail((900, 900))
    check = room_small.convert("RGB")
    for img, x in ((sprite, 0.06), (lit, 0.55)):
        f = img.copy()
        f.thumbnail((int(check.width * 0.34), int(check.height * 0.92)))
        check.paste(f, (int(check.width * x), check.height - f.height), f)
    check.save(OUT / "_check_relight.png")


if __name__ == "__main__":
    main()
