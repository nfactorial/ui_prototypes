# Tessera documents — UI textures

Source for the prototype's baked textures, made with tessera (`E:\dev\terrain\tessera`, run as
`python -m tessera`). The `.toml` is the source; `assets/tessera/*.png` is the bake the browser loads.

```sh
node tools/bake.mjs                  # bake everything
node tools/bake.mjs panel_grime      # one document
node tools/bake.mjs panel_grime --samples 1   # fast preview
```

## Conventions

- ⭐ **Tintable textures are white RGB + coverage in alpha** (end the graph on
  `pack` with `rgb = [1,1,1]`, `a = <mask>`). A Slate brush tint *multiplies* RGB, so a greyscale texture
  tints to black, not to transparent. Coverage has to be in alpha. The same PNG then works in CSS as a
  `mask` (`s-image tint`) and in Unreal as a tinted brush, with no conversion.
- **Colour textures** (a finished panel with baked colour) are plain RGBA → `background` / `border-image` in
  CSS, and an ordinary brush in Slate.
- ⚠️ **Packed channels** (four masks in R/G/B/A, for a UI *material*) can't be read per-channel by CSS.
  Add an extra single-mask output per channel you need to preview (the tessera example
  `discover_ui_panel_v2.toml` shows the pattern with a second output), and note that in Unreal it's one
  packed texture sampled by a material.
- **Animation happens at runtime, not in the bake**: rotate, pan or fade the image with `motion.js`. That
  maps to a UMG animation on the widget (or a panner in a UI material). A flipbook bake (`time` node) is
  fine too: in CSS that's `steps()` on background-position; in Unreal, a flipbook material.
- **Bakes are kept** (unlike the game repo, where `baked/` is ignored because the imported `.uasset` is
  committed). Here the PNG *is* the runtime asset, and keeping it means the prototype runs without Python.
- **Moving to Unreal:** when a texture is adopted, copy its `.toml` into the game's `documents/tessera/`,
  following that folder's README, and bake from there. From then on the game copy is the one that counts.
  Mark the entry below as *adopted* so the two don't drift silently.

## Textures

### `panel_grime` — tiling wear for panel fills
- **Use:** `s-image tint tile` over a panel, at low opacity (style guide shows 12%, primary tint). In
  Slate it's an `SImage` with Tiling = Both over the panel's `SBorder`.
- **Graph:** fBm mottle (`noise`, period 8) levelled to 0–0.6, lightened with sparse `cells` specks
  (period 24) so the tile repeats seamlessly.
- 📊 256², RGB all 255, alpha 0–245.
- ⚠️ First pass. The specks read more "starfield" than "grime". Needs the user's eye.

### `scanner_sweep` — radar sweep
- **Use:** `s-image tint`, rotated by a looping `angle` track (style guide: 3 s per turn).
- **Graph:** angular `ramp` → `levels` (0.6–1, gamma 2.2) for a trailing wedge, multiplied by a disc
  (radius 0.48). Leading edge points along +x (3 o'clock) at angle 0.
- 📊 256², 2×2 samples, RGB all 255, alpha 0–254.
