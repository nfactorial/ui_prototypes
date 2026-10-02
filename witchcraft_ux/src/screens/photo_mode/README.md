# Photo mode (grey-box, speculative)

**Serves:** the user's two views (2026-09-29), and the captured ideas in the game's
`documents/design/characters/witch/take_photo_mode.md` and `todo_prd.md` (filters, borders, stickers à la
AC:NH, an album). Photo mode isn't designed in the game yet, so everything here is a proposal.

**P** in the world lifts the camera.

| | |
|---|---|
| **Viewfinder** | She lifts the camera; we see through it. World photos from her viewpoint |
| **Selfie** | The camera is out in front, looking back at her. **Poses** (Q/E): wanted but **for the future** (D14): they need pose animations, from a library if one exists, or an animator. A label here |
| **Filters** (F) | Old photo · Faded film · Dusk · Ink & wash · Storybook (post-process presets in the game). **Liked** (D12). Only the ones in her **camera kit** are offered (D13) |
| **Frames** (R, from her kit) | Polaroid · Postcard · Pressed flowers. Previewed round the whole screen, as AC:NH does. Polaroid and postcard carry a handwritten caption: place + time |
| **Camera** (B, from her kit) | Speculative (user's idea, 2026-10-01). Box camera (her first) · Icale · Blassi · Onnik · Aconn · Nyso. Each brings its **viewfinder** (drawn only in the viewfinder view) and a **colour grade**. Collectibles, never a stat |
| **Lens** (L, from her kit) | Everyday 50 · Wide 24 · Portrait 85 · Long 300 · Macro 100: how much fits (zoom) and what's out of focus (DoF). Any lens fits any camera (open) |
| **Hide UI** (H) | For a clean frame; the first Esc brings it back |
| **Take** (Space) | Shutter flash, then the framed photo drops in bottom-right: "Saved to Keepsakes". It appears in Keepsakes › Photos and counts toward the Photographer milestone |

- **Variant `photoui`:** `body` (each camera's own viewfinder) or `clean` (corner brackets for all).
- **Variant `kit`:** `all` hands her the whole kit to try (the photo and kit scenes' default); `earned` is
  only what she owns (box camera + everyday lens to start).
- **Variant `blassi`:** `square` photos, or the look only.

### The viewfinders (nods to the real makers, no trade dress)

| Camera | Real nod | Viewfinder | Grade | Unlocks from a photo of… |
|---|---|---|---|---|
| Box camera | — | Round peephole, a focus ring | none | (starts with it) |
| Onnik | Nikon | Dark surround, split-image circle in a microprism ring, green readout beneath | neutral | Under water (the Nikonos) |
| Aconn | Canon | Dark surround, a scatter of AF points (the found one red), readout | warm | A bird in flight, a creature mid-leap |
| Nyso | Sony | Electronic finder: readouts across the top, level line, focus box, histogram | cool, clean | Under the stars, or in a storm |
| Icale | Leica | Rangefinder: the view **doesn't zoom**; bright frame lines shrink with a longer lens; centre patch, red LED meter | rich, contrasty | Folk in town (street photography) |
| Blassi | Hasselblad | Waist-level: a square of ground glass in a dark hood, grid, centre circle, **mirrored left-right** | soft | The moon |

The readouts follow the light (shutter slows at evening/night) and the lens (its f-number). They are dressing.
- World HUD and zone banner step aside while the camera is up.
- The views are **in-engine screenshots** from each camera (`assets/backdrops/viewfinder.jpg`, `selfie.jpg`).

## Open
- Does the world pause? `todo_prd.md` mentions pausing, with optional time-of-day scrubbing. D3 says in-game
  UI doesn't pause, but photo mode might earn an exception ("hold the moment").
- Zoom, tilt, depth of field, stickers, a "look at camera" toggle for the selfie?
- A photo taken with no frame is saved as a polaroid here, so the album has captions. Keep that?
- Cameras and lenses: how many of each? Does a lens belong to a camera (a mount) or fit any? Square Blassi
  photos? Is the mirrored Blassi finder fun or just confusing when she turns? Do the readouts read as stats?
- Unlock photos ("the moon", "a bird in flight") need the game to know what's in frame: a tag on actors
  in view at the shutter? Not designed.
- Selfie: the camera's viewfinder isn't drawn (she isn't looking through it), but its grade and lens apply.

## Port notes
- The view is the game's photo camera (a second camera, or the player camera repositioned) + a
  post-process per filter. Frames are UMG borders (9-slice textures); the caption is a text block.
- Saving: a render target → texture, stored with the save (the album).
- A **lens** is camera data, not UMG: FOV (the bench's zoom ≈ 1 / FOV ratio, Wide 1.0 → Macro 3.2) and
  post-process depth of field (focal distance at the subject, aperture from `fstop`). The bench fakes DoF with a
  blurred, masked copy of the screenshot. Bokeh shape could be a DoF setting per lens later.
- A **camera's grade** is a post-process LUT (or colour-grading settings) blended with the filter's. Captured
  into the photo.
- A **viewfinder** is a UMG overlay: mask textures (the SLR surround, Blassi's hood), frame-line and AF-point
  images, text blocks for the readouts. Blassi's mirror: flip the view (a material or a SceneCapture flip),
  not the saved photo. Icale: keep the camera's FOV wide and size the frame lines by the lens; the photo is
  the crop inside the lines.
- `box-shadow` surrounds, `filter: drop-shadow` on Icale's lines, gradients for Blassi's grid: textures in UMG.
