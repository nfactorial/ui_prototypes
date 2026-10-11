# Tessera documents: UI textures

Source for the bench's baked textures, made with tessera (`E:\dev\terrain\tessera`, run as
`python -m tessera`). The `.toml` is the source; `assets/tessera/*.png` is the bake the browser loads.
The conventions are Null Point's (`../nullpoint_ux/tessera/README.md`): tintable textures are white RGB
with coverage in alpha; colour textures are plain RGBA; bakes are kept, so the bench runs without Python;
when a texture is adopted, its `.toml` moves to the game's `documents/tessera/` and that copy counts.

```sh
node tools/bake.mjs                  # bake everything
node tools/bake.mjs pentacle         # one document
node tools/bake.mjs pentacle --samples 1   # fast preview
```

Two things about tessera that weren't obvious:
- A transform's `offset` moves the **coordinates**, so the shape moves the opposite way: `[0, 0.3]` puts
  it 0.3 *above* the centre.
- A radial `repeat` hands its input the wedge centred on **twelve o'clock**.

## Textures

### `pentacle`, `pentacle_glow`: the tool wheel's pentacle
- **Use:** the tool wheel's `pentacle` variant (`src/screens/quick_select`). `pentacle` is a colour
  texture, drawn over the wheel's whole 620 px box. `pentacle_glow` is the same grooves as a tintable mask,
  tinted the accent gold, blended `screen`, its opacity breathing 0.35 → 0.75 → 0.35 over 4 s
  (`PentacleGlow`). In Slate: two `SImage`s and a looping widget animation; the screen blend is a UI
  material, or a plain alpha blend made a little stronger.
- **Graph:** the pentagram's lines are a five-point star's outline (`polygon`, inner ratio 0.381966: a true
  pentagram) plus the inner pentagon turned 36°. With a circle through the points (R = 0.37097: the
  wheel's 230 px), a border ring, a small ring round Hands free, and a dot · diamond · dot mark midway
  between each pair of points. Every line is a rounded V groove (`contour` stroke, softness half its
  width, `round`), cut into a disc with a rounded rim (`bevel`). `slope` facing 225° lights it from the top
  left. Dark wood grain is stretched, warped noise through a `gradient_map`, multiplied darker in the
  grooves and overlaid with the light. A soft shadow (`outer` contour) lies under the disc.
- 📊 1024², 2×2 samples. `pentacle`: RGB 0–103, alpha 0–229 (the disc is 0.9 opaque, the shadow ≤ 0.5),
  73% of pixels non-empty. `pentacle_glow`: RGB all 255, alpha 0–255, 33% non-empty. Bake ~23 s
  (~6 s at `--samples 1`).
- First pass (2026-10-11). The user: "looks great".
- **For a lit UI material in Unreal** (considered, see `src/screens/quick_select/README.md`, Port notes):
  the colour output would lose its baked light, and the graph would gain a `normal` output from `height`
  and a packed masks output (grooves, disc).
