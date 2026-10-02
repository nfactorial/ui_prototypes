# Handoff: the style set (Director)

**Tag:** `ui-handoff-core` · **Decided:** 2026-10-02 (user: *"Director is the look"*)
**Source:** `styles/themes/director.css` (values), `styles/greybox.css` (where they're used),
`styles/themes/README.md` (the contract). Units and colour rules: see `README.md`.

**The look in one line:** airy and grand (reference: Destiny). White text on deep-blue glass, thin and
widely spaced display type, almost no borders, 8 px corners, selection shown by a bright white outline.
The direction behind it is `../direction.md`: *welcoming and grand, not dry and technical*.

This becomes the game's **Slate style set**: one place every screen takes its colours, fonts, text styles
and brushes from. Screens never hard-code a colour.

## Colours

| Name | Value | Used for |
|---|---|---|
| `Panel` | `#121c2a` @ 0.55 | Translucent panels: toasts, alerts |
| `PanelSolid` | `#0f1724` | Opaque panels: tooltips, dialogs |
| `Raise` | `#ffffff` @ 0.06 | Button / card fill |
| `RaiseHi` | `#ffffff` @ 0.16 | Button / card fill when focused |
| `Line` | `#ffffff` @ 0.12 | Borders, rules |
| `LineHi` | `#ffffff` @ 0.70 | Strong borders (tooltip outline) |
| `Scrim` | `#040a14` @ 0.55 | Behind the pause menu and dialogs |
| `Text` | `#ffffff` | Primary text |
| `Dim` | `#dee8f5` @ 0.66 | Secondary text |
| `Faint` | `#dee8f5` @ 0.30 | Disabled text |
| `Accent` | `#ffffff` | Selection, focus |
| `Label` | `#8fd3ff` | Small uppercase labels (a light sky blue: Director's one colour note) |
| `Glow` | `#8fd3ff` @ 0.25 | Focus glow (see *Port costs*) |
| `PrimaryBg` / `PrimaryText` | `#ffffff` / `#0c1522` | The primary button |
| `Good` | `#86d39c` | Completed, acquired |
| `Warn` | `#f0b94a` | Warnings, "unavailable" |
| `Bad` | `#e5605a` | Danger |
| `Power` | `#ffcf5a` | Power-up banner |

## Fonts

**Inter** (OFL, `assets/fonts/Inter-Variable.ttf`, licence beside it). One family for everything.

| Weight | Used for |
|---|---|
| 250 | The display title |
| 400 | Body, small |
| 500 | Headings, titles, buttons |
| 600 | Labels, banner label |

🔧 **The prototype uses Inter's variable font.** Unverified whether Unreal's font import handles variable
weights; the safe route is Inter's **static** TTFs (same family, same licence) as typefaces in one
composite Font asset: Light 300 (closest to 250; or ExtraLight 200, judge in-engine), Regular, Medium,
SemiBold.

## Text styles

Slate sizes (CSS px × 0.75, see `README.md`). Line height is a multiple of the font size.

| Style | Weight | Size | Spacing | Line h. | Colour | Notes |
|---|---|---|---|---|---|---|
| `Display` | 250 | 54 | 278 | 1.0 | Text | The game title |
| `Title` | 500 | 30 | 0 | 1.1 | Text | Screen titles ("Paused") |
| `H2` | 500 | 21 | 0 | 1.15 | Text | Dialog titles |
| `H3` | 500 | 15 | 0 | 1.2 | Text | Toast / tooltip titles |
| `Body` | 400 | 13.5 | 0 | 1.45 | Text | |
| `Small` | 400 | 11.25 | 0 | 1.4 | Dim | Secondary lines |
| `Label` | 600 | 9 | 250 | 1.0 | Label | **Uppercase** |
| `Button` | 500 | 13.5 | 0 | 1.0 | Text | |
| `ButtonBig` | 500 | 18 | 0 | 1.0 | Text | Main and pause menu buttons |
| `BannerLabel` | 600 | 13.5 | 444 | 1.0 | per kind | **Uppercase** (`toasts.md`) |
| `BannerTitle` | 500 | 39 | 0 | 1.1 | Text | |

## Brushes

| Brush | Spec | Slate |
|---|---|---|
| `Panel` | fill `Panel`, 1 px outline `Line`, radius 8 | Rounded box |
| `PanelSolid` | fill `PanelSolid`, 1 px `Line`, radius 8 | Rounded box |
| `Scrim` | fill `Scrim` | Solid colour |
| `Rule` | 1 px tall, `Line` | SBox + colour, or an image |

## Buttons

One `FButtonStyle`, plus a primary variant. **Labels are centred.** Padding 14 × 24 (normal) or
18 × 28 (big, `min width 340`).

| State | Normal button | Primary button |
|---|---|---|
| Normal | fill `Raise`, 1 px `Line`, radius 8 | fill `PrimaryBg`, text `PrimaryText`, 1 px `PrimaryBg` |
| Hovered / focused | fill `RaiseHi`, 1 px **`Accent`**, plus a 1 px outer `Accent` ring and a 24 px soft `Glow` | same fill, plus the ring and glow |
| Pressed | fill `Line` | unchanged |
| Disabled | text `Faint`; border dashed in the prototype | not used |

- 🔴 **Hovered and focused are the same state.** Mouse hover moves focus (`README.md`).
- The **ring + glow** is what makes Director's selection read. Without it, focus is a 1 px border change,
  which is too weak on the dark glass.
- Disabled buttons can still show a tooltip saying *why* (`tooltips.md`).

## Icons

`assets/icons/*.svg`: white shapes, tinted at runtime (a Slate tint multiplies RGB, so white + alpha is the
convention). Used by toasts: `crate`, `log`, `info`, `check`, `diamond`, `bolt`, `warning`. Import as
textures (or rasterise at 2× the largest use, 48 px → 96 px).

## Port costs

| What | Why it costs | Suggestion |
|---|---|---|
| Focus ring + glow | A blurred outer glow isn't a stock brush | A 9-slice glow texture behind the button, or a UI material. 🔴 Keep it: it's the selection |
| Background blur (pause scrim 6 px, toasts 8 px) | `SBackgroundBlur` has a real cost | Pause: keep. Toasts: optional, drop first if perf demands |
| Dashed disabled border | No dashed brush in Slate | A dashed 9-slice texture, or a plain `Faint` border |
| Text shadow on banners (blurred) | Slate text shadows don't blur | An unblurred offset shadow, or a soft dark texture behind the banner |
| Drop shadow under tooltips | Not a stock brush | A 9-slice shadow texture, or drop it |
