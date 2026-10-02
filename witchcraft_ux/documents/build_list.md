# Build list: from the bench to Unreal

What it would take to build this UI in *A Little Witchcraft*, as a checklist: the **reusable widgets**
(few), the **screens** made from them (many, but mostly composition), what **CommonUI** gives for free,
a **build order** that follows what the game can already drive, and the **exact values** (colours,
type, shapes) of the chosen look.

Status of the look: **Hedgewitch** is the working style set. Values marked approved were signed off by
the user (`direction.md`); the rest are the current starting point.

> This is a planning document, not a handoff spec. When a screen is agreed, it gets its own
> `documents/handoff/<feature>.md` (widget tree, states, data, motion, assets: see `../UI_BENCH.md`).

## 1. The reusable widgets

Build these once; every screen is an arrangement of them. Names are what the bench calls them
(`data-widget`, shown by the harness **Outline**, Shift+O).

| # | Widget | What it is | Used by | UMG / CommonUI |
|---|---|---|---|---|
| W1 | **Input glyph** | A key or pad button, switching with the last device (Input variant) | Prompt, HUD corner, book tabs + rail, Close, fishing, dialogue, photo bar, settings | **`CommonActionWidget`**: free, driven by CommonUI input data (keyboard + gamepad icon tables) |
| W2 | **Button** (normal / primary / big) | Rounded, text left; primary = gold fill | Menus, pause, settings, Claim, confirm dialog | `CommonButtonBase` + one **button style asset** per kind |
| W3 | **Card** (selectable) | A button with content; focus + selected (`aria-selected`) states | Book pages, rail items, settings rows, spell list, recipes | `CommonButtonBase` with a "Card" style; content is a child WBP |
| W4 | **Tab row** | Text tabs with the prev/next glyphs at either end | Book (4 tabs), settings | **`CommonTabListWidgetBase`** + `CommonAnimatedSwitcher`: free |
| W5 | **Category rail** | Vertical list of icon + label cards, prev/next glyphs top/bottom | Book: Recipes, Almanac, Keepsakes | A second (vertical) CommonTabList, bound to LT/RT |
| W6 | **Slot** | Icon tile: count badge (>1), affinity dot, selected/empty states | Satchel grid, quick selectors | **`WBP_InventorySlot` already exists**: add the dot + states |
| W7 | **Chip** | A pill: icon + text; states solid / faint / dashed | Recipe & charm ingredients, ready-spell strip, HUD corner | One WBP with a state enum |
| W8 | **Collection entry** | Icon + name + rarity + where + count; an "Unknown fish" state | Fish, Flowers, Creatures, Camera kit | One WBP; the unknown state swaps text + dims |
| W9 | **Panel / page** | Rounded box, 1.5 px outline, optional blur behind | Book pages, tip, toasts, dialogue, selectors | `SBorder` + a rounded-box brush (§4) |
| W10 | **Toasts** | Stack (routine), banner (must-know), alert | Everywhere | Not in CommonUI: a small notification subsystem with a queue + one WBP per presentation |
| W11 | **Tooltip** | Title / meta / body / stats | Main menu Continue, anywhere | UMG tooltip widget binding |
| W12 | **World text** | Text straight on the 3D view with a shadow | Prompt, zone banner, change hint, day card | A **text style asset** with shadow (0,1); the soft glow is optional (material) |
| W13 | **Progress bar** | Thin, rounded | Small tasks | `SProgressBar` style |
| W14 | **Stamp** | Milestone tier: ring → dashed gold → filled | Milestones | 3 images (or 1 tinted) |
| W15 | **Photo** | Image + filter + frame + handwritten caption | Photo mode, album, camera kit previews | Render target + 9-slice frame brush + text; filter = post-process |

## 2. The screens (compositions)

| Screen | Made of | Game side today | Notes |
|---|---|---|---|
| **Interaction prompt** | W1 + W12 | `ICozyInteractable::GetInteractionPrompt` exists; **nothing draws it** | Smallest, most-used piece. Build first |
| **Toast stack** | W10 | Collect / catch events exist | "Collected", "Caught", "Hands full" |
| **Zone banner** | W12 + rule | **Built** (`WBP_ZoneBanner`) | Restyle only: rules stay |
| **Satchel** | W9 + W6 grid + detail + portrait | **Built v0.1** (read-only) | Add the detail panel and the in-hand state |
| **Tool selector** | W6 ring or bar + W12 | Equipped-tool slot exists | Radial vs bar still open |
| **Spell change hint + spell selector** | W7 strip / W6 ring | `USpellbookComponent` exists (Next/Prev) | Loadout assignment (D8) when loadout lands |
| **Fishing feedback** | W12 / W9 card, letterbox | Replaces the debug message | Hold-up is a cinematic |
| **Pause + Settings** | W2, W3, W4 | Camera settings needed (todo 8) | Camera tab has real rows |
| **Book shell** | W9 + W4 + W5 | — | One frame, tabs, rail; pages are data |
| Book › Recipes › Spells | W3 list + W7 strip | With the loadout | Click → "Assign to…" → press a spell button |
| Book › Almanac › Fish, Flowers | W8 grid | Fish data exists (`FFishCatchEntry`) | Needs the location-range field (proposed) |
| **Dialogue** | W9 box + name tag + W3 replies + W1 | Villagers not built | Typed text fires the babble event per letter |
| Book › Keepsakes | W3, W13, W14, W15, W8 | — | After the systems that feed it |
| **Photo mode** | W15, W1 bar | Not designed in the game | Two cameras + post-process presets |
| Book › Recipes › Cooking, Potions, Charms; Almanac › Creatures | W3 + W7 + a 72×72 icon | Ideas only | Same widgets as above; recipe icons from the asset store |
| Study progress ("Aha!") | W9 + W14 pips + W7 + W2 | Study not built | Like the catch reveal |
| Main menu | W2 + a 3D scene | — | Mostly a level, not UI |

## 3. What CommonUI gives you

The project has no CommonUI yet; adopting it is a technical-design decision for the game repo, but the
bench is built in its shape, so most of this is free if it does:

- **The layer stack** (game / game menu / menu / modal) and which one gets input: activatable widgets
  (Lyra's primary game layout is the reference setup).
- **Back / cancel** handling (Esc, B) routed to the top widget.
- **Input glyphs that follow the last device** (W1), from one keyboard table + one gamepad table.
- **Tab lists** (W4, W5) with bound prev/next actions.
- **Style assets** for buttons, text and borders: the values in §4 go into these once, and every
  widget picks them up.

## 4. The look: exact values

### How to use the colours

- **UMG colour picker**: paste into the **Hex sRGB** field (not *Hex Linear*). Eight digits are
  `RRGGBBAA`; the alpha is also listed on its own.
- **C++ style set** (`FSlateStyleSet`, `FLinearColor`): use the *Linear* column. Slate stores colours
  linear, so these are the converted values, not the hex divided by 255.
- ⚠️ **Translucent colours only match over the same thing.** Panels at 0.86 alpha over the world, or
  with a blur behind, will look a touch different in-engine because the world behind is different (and
  the bench's blur is CSS). Judge those in the engine, not against the browser.
- Regenerate these tables any time with `python tools/colours.py`; it reads the theme files directly.

#### Hedgewitch style set (`styles/themes/hedgewitch.css`)

| Name | Use | Hex sRGB (RRGGBBAA) | Alpha | Linear (C++) |
|---|---|---|---|---|
| `--th-panel` | Panels (over the world) | `261C16DB` | 0.86 | `FLinearColor(0.0194, 0.0116, 0.0080, 0.86)` |
| `--th-panel-solid` | Opaque panels, tooltips, book pages | `2A1F18FF` | 1.00 | `FLinearColor(0.0232, 0.0137, 0.0091, 1.00)` |
| `--th-raise` | Buttons, cards, slots | `FFF0D212` | 0.07 | `FLinearColor(1.0000, 0.8714, 0.6445, 0.07)` |
| `--th-raise-hi` | Focused / hovered button or card | `FFF0D229` | 0.16 | `FLinearColor(1.0000, 0.8714, 0.6445, 0.16)` |
| `--th-line` | Borders | `E8CD9638` | 0.22 | `FLinearColor(0.8070, 0.6105, 0.3050, 0.22)` |
| `--th-line-hi` | Strong borders, placeholders | `E8CD96BF` | 0.75 | `FLinearColor(0.8070, 0.6105, 0.3050, 0.75)` |
| `--th-backing` | Book backing (over the blurred world) | `1E140E73` | 0.45 | `FLinearColor(0.0130, 0.0070, 0.0044, 0.45)` |
| `--th-backing-solid` | Book backing, full-screen spread | `21180FFF` | 1.00 | `FLinearColor(0.0152, 0.0091, 0.0048, 1.00)` |
| `--th-scrim` | Behind pause and modals | `160E0899` | 0.60 | `FLinearColor(0.0080, 0.0044, 0.0024, 0.60)` |
| `--th-text` | Text | `F6ECD6FF` | 1.00 | `FLinearColor(0.9216, 0.8388, 0.6724, 1.00)` |
| `--th-dim` | Secondary text | `F0E2C4B2` | 0.70 | `FLinearColor(0.8714, 0.7605, 0.5520, 0.70)` |
| `--th-faint` | Disabled / placeholder text | `F0E2C459` | 0.35 | `FLinearColor(0.8714, 0.7605, 0.5520, 0.35)` |
| `--th-accent` | Selection, focus, active tab (hat-brim gold) | `E2BF6AFF` | 1.00 | `FLinearColor(0.7605, 0.5210, 0.1441, 1.00)` |
| `--th-primary-bg` | Primary button fill | `E2BF6AFF` | 1.00 | `FLinearColor(0.7605, 0.5210, 0.1441, 1.00)` |
| `--th-primary-text` | Primary button text | `2A1F18FF` | 1.00 | `FLinearColor(0.0232, 0.0137, 0.0091, 1.00)` |
| `--th-good` | Good / collected / caught (moss) | `A9CF7AFF` | 1.00 | `FLinearColor(0.3968, 0.6240, 0.1946, 1.00)` |
| `--th-warn` | Warnings, reagent costs | `E8B05CFF` | 1.00 | `FLinearColor(0.8070, 0.4342, 0.1070, 1.00)` |
| `--th-power` | Milestone banner | `F3D27AFF` | 1.00 | `FLinearColor(0.8963, 0.6445, 0.1946, 1.00)` |
| `--th-speech` | Dialogue box (approved 2026-09-29) | `3B2A1CFF` | 1.00 | `FLinearColor(0.0437, 0.0232, 0.0116, 1.00)` |
| `--th-speech-hi` | Hovered reply | `4C3623FF` | 1.00 | `FLinearColor(0.0723, 0.0369, 0.0168, 1.00)` |
| `label` | Small-caps labels (decoration rule) | `CDB47CFF` | 1.00 | `FLinearColor(0.6105, 0.4564, 0.2016, 1.00)` |

#### Game data colours (`styles/tokens.css`): the same in every look

| Name | Use | Hex sRGB (RRGGBBAA) | Alpha | Linear (C++) |
|---|---|---|---|---|
| `--aff-green` | Colour affinity | `7FBF5AFF` | 1.00 | `FLinearColor(0.2122, 0.5210, 0.1022, 1.00)` |
| `--aff-yellow` | Colour affinity | `E9C64AFF` | 1.00 | `FLinearColor(0.8148, 0.5647, 0.0685, 1.00)` |
| `--aff-blue` | Colour affinity | `5AA7E0FF` | 1.00 | `FLinearColor(0.1022, 0.3864, 0.7454, 1.00)` |
| `--aff-red` | Colour affinity | `E0685AFF` | 1.00 | `FLinearColor(0.7454, 0.1384, 0.1022, 1.00)` |
| `--aff-black` | black reads as dusk violet on a dark panel | `6A5A8AFF` | 1.00 | `FLinearColor(0.1441, 0.1022, 0.2542, 1.00)` |
| `--aff-white` | Colour affinity | `F2EFE6FF` | 1.00 | `FLinearColor(0.8879, 0.8632, 0.7913, 1.00)` |
| `--aff-void` | Colour affinity | `9A9A9AFF` | 1.00 | `FLinearColor(0.3231, 0.3231, 0.3231, 1.00)` |
| `--rar-common` | Fish rarity | `CFC8B8FF` | 1.00 | `FLinearColor(0.6240, 0.5776, 0.4793, 1.00)` |
| `--rar-uncommon` | Fish rarity | `8FCF7AFF` | 1.00 | `FLinearColor(0.2747, 0.6240, 0.1946, 1.00)` |
| `--rar-rare` | Fish rarity | `7AB8F0FF` | 1.00 | `FLinearColor(0.1946, 0.4793, 0.8714, 1.00)` |
| `--rar-legendary` | Fish rarity | `F0C85AFF` | 1.00 | `FLinearColor(0.8714, 0.5776, 0.1022, 1.00)` |

#### Fixed widget colours

| Name | Use | Hex sRGB (RRGGBBAA) | Alpha | Linear (C++) |
|---|---|---|---|---|
| `world-text` | Text on the 3D view (prompt, zone banner) | `FFFAF0FF` | 1.00 | `FLinearColor(1.0000, 0.9560, 0.8714, 1.00)` |
| `world-text-shadow` | Its shadow (offset 0,1; the soft glow is a material) | `000000BF` | 0.75 | `FLinearColor(0.0000, 0.0000, 0.0000, 0.75)` |
| `key-cap` | Keyboard glyph fill | `FFFAF0EB` | 0.92 | `FLinearColor(1.0000, 0.9560, 0.8714, 0.92)` |
| `key-cap-text` | Keyboard glyph text | `2A1F18FF` | 1.00 | `FLinearColor(0.0232, 0.0137, 0.0091, 1.00)` |
| `pad-cap` | Gamepad glyph fill | `28221CE6` | 0.90 | `FLinearColor(0.0212, 0.0160, 0.0116, 0.90)` |
| `pad-a` | Gamepad A | `7FD06AFF` | 1.00 | `FLinearColor(0.2122, 0.6308, 0.1441, 1.00)` |
| `pad-b` | Gamepad B | `F07060FF` | 1.00 | `FLinearColor(0.8714, 0.1620, 0.1170, 1.00)` |
| `pad-x` | Gamepad X | `6AB0F0FF` | 1.00 | `FLinearColor(0.1441, 0.4342, 0.8714, 1.00)` |
| `pad-y` | Gamepad Y | `F0C850FF` | 1.00 | `FLinearColor(0.8714, 0.5776, 0.0802, 1.00)` |
| `villager-hazel` | Hazel: name tag, highlighted words | `D98A4EFF` | 1.00 | `FLinearColor(0.6939, 0.2542, 0.0762, 1.00)` |
| `frame-polaroid` | Photo frame: polaroid | `F7F3EAFF` | 1.00 | `FLinearColor(0.9301, 0.8963, 0.8228, 1.00)` |
| `frame-postcard` | Photo frame: postcard | `EFE4C8FF` | 1.00 | `FLinearColor(0.8632, 0.7758, 0.5776, 1.00)` |
| `frame-pressed` | Photo frame: pressed flowers mount | `3B2C20FF` | 1.00 | `FLinearColor(0.0437, 0.0252, 0.0144, 1.00)` |
| `caption-ink` | Handwritten caption | `3A2C1EFF` | 1.00 | `FLinearColor(0.0423, 0.0252, 0.0130, 1.00)` |

### Type

Fonts are vendored OFL `.ttf` files in `assets/fonts/`; import the same files as Font Faces.

| Role | Font | Weight | CSS px | **Slate size** | Where |
|---|---|---|---|---|---|
| Title | Fraunces (SOFT 100, WONK 1) | SemiBold 600 | 116 | **87** | Main menu "Witchcraft" |
| Title, small line | Fraunces italic | Regular 400 | 34 | **25.5** | "A Little" |
| Tagline | Nunito italic | Regular | 16 | **12** | "Every witch needs a home" (approved) |
| Display | Fraunces | SemiBold 600 | 72 | **54** | Big titles |
| Zone name | Fraunces | SemiBold 600 | 64 | **48** | Zone banner |
| Heading 1 | Fraunces (SOFT 100) | SemiBold 600 | 40 | **30** | Screen titles |
| Heading 2 | Fraunces (SOFT 100) | SemiBold 600 | 28 | **21** | Item names in detail, fish name |
| Tabs | Fraunces italic | SemiBold 600 | 22 | **16.5** | Book tabs |
| Heading 3 | Nunito | SemiBold 600 | 20 | **15** | Card titles |
| Body | Nunito | Regular | 18 | **13.5** | Descriptions |
| Dialogue | Nunito | SemiBold 600 | 30 | **22.5** | Speech text (26 px / 19.5 in a bubble) |
| Name tag | Nunito | ExtraBold 800 | 24 | **18** | Dialogue name tag |
| Prompt verb / target | Nunito | Bold 700 / Regular | 26 / 22 | **19.5 / 16.5** | Interaction prompt |
| Small | Nunito | Regular | 15 | **11.25** | Secondary lines |
| Label | Nunito, uppercase, +2 px spacing | SemiBold 600 | 13 | **9.75** | Small caps labels |
| Caption | Caveat | SemiBold 600 | scales with photo | — | Handwritten photo captions |

- **Slate size = CSS px × 0.75** (Slate sizes are points at 96 DPI). ✅ **Verified in-engine
  2026-09-29** on the interaction prompt: text height ÷ glyph-cap height measured 0.545 against the bench's
  0.539. Details in the game's `documents/prd/ui/ui_foundation_prd.md`, stage C′.
- ⚠️ **Fraunces is a variable font** and the look uses its *SOFT* and *WONK* axes. Slate font import
  works from static font files, so export static instances with those axes set (e.g. with fonttools'
  `instancer`) rather than importing the variable file. Nunito can be exported at the weights above.

### Shapes

| Value | | Slate |
|---|---|---|
| Corner radius | 12 px | Rounded-box brush, corner radius 12 (all corners) |
| Outline | 1.5 px, `--th-line` | Rounded-box brush outline width 1.5 |
| Pills (chips, replies, name tag) | fully round | Rounded-box brush, "Round" / radius = half height |
| Dialogue panel | radius 48, 1180 × auto, 70 from bottom | Rounded-box brush |
| Book frame | 1360 × 800, pages 28/32 padding | SBox size overrides |
| Slots | 84 × 84, gap 10 | SUniformGridPanel slot padding 5 |
| Focus ring | 1 px accent + soft glow (0 0 18 px, accent 25%) | Outline is free; the **glow is a texture or material** |

## 5. Things with a real cost

Everything below was flagged in the bench as needing more than a brush and a colour. None is required:
each has a cheaper fallback in brackets.

| Where | Needs | Fallback |
|---|---|---|
| Book (panel look), pause, toasts | `SBackgroundBlur` behind panels (has a GPU cost) | a darker, more opaque panel |
| World text, pip glow, focus glow, milestone banner glow | glow = material or texture | no glow; the 0,1 shadow is free |
| Main menu, dialogue, selector scrims, photo vignette | gradients = material or texture | flat scrims |
| Book "spread" look | page textures + a spine image | the panel look |
| Speech bubble tail, photo frames, stamps, selector ring | small textures (9-slice where they stretch) | — |
| Photo filters | post-process presets per filter | — |
| "· ready" suffix on spells | a separate text block (it's `::after` in CSS) | — |

## 6. Suggested build order

1. **Foundations.** Enable CommonUI; set up the layer stack and back action; import fonts (static
   instances); create the style assets from §4 (text styles, button styles W2/W3, border brushes W9);
   keyboard + gamepad glyph tables (W1).
2. **What the game can already drive.** Interaction prompt → toast stack → zone banner restyle →
   satchel restyle (+ detail panel) → tool selector → spell hint + selector → fishing feedback → pause +
   settings (camera tab).
3. **The book shell** (W4 + W5) with Satchel in it, then pages as their systems arrive: Recipes › Spells
   with the loadout, Almanac › Fish with the fish log, dialogue with villagers.
4. **Later, with their systems:** Keepsakes (tasks, milestones, album, camera kit), photo mode, recipes,
   charms and creatures, the main-menu scene.

Each step reuses what the previous ones built; by step 3 a new book page is mostly a data table and a
WBP of W3/W7/W8.
