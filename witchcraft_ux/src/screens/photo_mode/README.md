# Viewfinder (photo mode; grey-box)

**Serves:** the game's `documents/design/characters/witch/take_photo_mode.md` and its PRD (2026-10-05:
viewfinder built to stage 2, stage 3 = shutter + plain overlay next), plus D12/D13/D21 here.

| | |
|---|---|
| **Raising** | The camera is a **wheel tool**, as in the game. T puts it in her hands; **F** (*use tool*, pad X) raises it. **P** is a bench shortcut that does both |
| **Shutter** | **F** again (each press is a photo; Space is a bench alias). Flash, then the photo drops in bottom-right ("Saved to Keepsakes"); in the game saving is a stub for now |
| **Put away** | Esc / B |
| **The overlay** | Variant `photoui`: **plain** (default, the game's stage 3: nothing over the view), **clean** (corner brackets + vignette), **body** (the viewfinder of the camera she has on, table below) |
| **Hints** | A row on raising (Take photo · Filter · Frame · Camera · Put away), faded after 4 s. Filter / Frame only show with two or more enabled. Buttons, so the mouse works |
| **Choosing** 🔴 | **The camera and lens are chosen in the book (D21, D27).** I opens the book over the viewfinder on **Tools › Camera** (moved from Keepsakes › Camera kit, D30); picking there sets `witch.camera`, and the view follows (a blink for a new camera or lens). Esc closes the book first, then the camera |
| **Switching** | **Filters and frames switch in the viewfinder** (user, 2026-10-08: D26), among the ones **enabled** on Tools › Camera: **Q** the next filter, **E** the next frame (pad LB / RB, placeholders). The name shows low centre for a moment. In selfie (unadvertised), Q/E are still the poses |
| **Frame** | The chosen frame is previewed round the whole screen (AC:NH) |
| **Selfie** | V and Q/E (poses) still work but aren't shown: selfie is deferred in the game |

- **Variant `kit`:** `all` (the photo scene's default) hands her the whole kit to try; `earned` is only what
  she owns. **`blassi`:** square photos, or the look only. **`names`:** anagrams, birds or makers.
- World HUD and zone banner step aside while the camera is up (in the game: the overlay tops the Game stack).

### The viewfinders (nods to the real makers, no trade dress)

| Camera | Real nod | Viewfinder | Grade | Unlocks from a photo of… |
|---|---|---|---|---|
| Box camera | — | Round peephole, a focus ring | none | (starts with it) |
| Onnik | Nikon | Dark surround, split-image circle in a microprism ring, green readout beneath | neutral | Under water (the Nikonos) |
| Aconn | Canon | Dark surround, a scatter of AF points (the found one red), readout | warm | A bird in flight, a creature mid-leap |
| Nyso | Sony | Electronic finder: readouts across the top, level line, focus box, histogram | cool, clean | Under the stars, or in a storm |
| Icale | Leica | Rangefinder: the view **doesn't zoom**; bright frame lines shrink with a longer lens; centre patch, red LED meter | rich, contrasty | Folk in town (street photography) |
| Blassi | Hasselblad | Waist-level: a square of ground glass in a dark hood, grid, centre circle, **mirrored left-right** | soft | The moon |
| Expanse | Hasselblad XPan (pun: "ex-PAN-se") | A **true panorama** (user, 2026-10-05): the strip is the whole screen width, letterbox bars above and below, bright corner lines, red LED meter. Photos are 65 : 24 | neutral | A whole horizon: the sea at sunset |

**The Expanse is wider, not cropped** (user, 2026-10-05). Its frame is wider, so the same lens takes in more
of the world sideways, as the real XPan did; the photo is then saved at the same output width as any other,
just shorter. ⚠️ The bench can't show the extra width: its viewfinder shot is 16:9, so the strip is the
middle of it. An in-engine shot at about 76° horizontal, 65 : 24 (e.g. `HighResShot 3840x1418` from the
viewfinder spot), would show it properly. Named by the user; not "Blassi Expanse", so one maker doesn't get two.

The readouts follow the light (shutter slows at evening/night) and the lens (its f-number). They are dressing. 🔴 **Flavour only (D24):** they may change with the light and lens, but the player never adjusts them (D23: no ISO, white balance, autofocus).
- World HUD and zone banner step aside while the camera is up.
- The views are **in-engine screenshots** from each camera (`assets/backdrops/viewfinder.jpg`, `selfie.jpg`).

## Open
- **The book hides the view.** Its backing blurs the viewfinder, so a change can't be judged until the book
  closes. Try: in camera mode, a narrower kit page to one side with the view clear beside it?
- Should the hints come back (when nothing's pressed for a while, or every raise)? Or never show at all?
- Does the world pause? `todo_prd.md` mentions pausing, with optional time-of-day scrubbing. D3 says in-game
  UI doesn't pause, but photo mode might earn an exception ("hold the moment").
- Tilt, stickers, a "look at camera" toggle for the selfie? (Zoom waits for lenses, as in the game.)
- A photo taken with no frame is saved as a polaroid here, so the album has captions. Keep that?
- Cameras and lenses: how many of each? Does a lens belong to a camera (a mount) or fit any? Square Blassi
  photos? Is the mirrored Blassi finder fun or just confusing when she turns? (Readouts: kept as flavour, D24.)
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
- **Expanse:** a body is a frame *format* as well as an overlay. Keep the normal view's vertical coverage
  and widen it: horizontal FOV = 2·atan(tan(V/2) · 65/24) (≈ 76° at 35 mm, against 54.4°), or literally
  `FCozyLens::HorizontalFieldOfView(35, 65)` ≈ 86° on a 65 mm frame. On screen, `UCameraComponent`
  `bConstrainAspectRatio` with `AspectRatio` 65/24 draws the bars (engine letterbox, not UMG). The photo:
  a `SceneCaptureComponent2D` into a 65 : 24 render target with the same FOV (Unreal's FOV is horizontal, so
  it carries over), at the same long edge as other photos (e.g. 1920 × 709). `FScreenshotRequest` would
  include the bars.
- `box-shadow` surrounds, `filter: drop-shadow` on Icale's lines, gradients for Blassi's grid: textures in UMG.
