# Style sets

Selectable looks for the menu screens: an exploration tool for colour, type and shape. None is decided
(`documents/direction.md`). Pick one from the harness **Style** dropdown, or cycle with **Shift+S**. The
choice is in the URL (`style=…`), so a look can be shared as a link.

## How it works

The grey-box screens (`gb-*` classes, `styles/greybox.css`) take every visual value from a `--th-*`
variable, with the grey look as the fallback. A style set is one CSS file that sets those variables on
`#ui-root[data-style="<id>"]`, and may add **decoration** rules for anything variables can't express
(stripes, glows, grime, per-element tweaks).

**Adding one:** copy a theme file, rename the id in its selectors, and add a row to `src/styles.js`. Keep
experiments; a rejected style is a useful record of what didn't work. Note why in its header comment.

## The contract (`--th-*`)

| Variable | What it drives | Grey-box default |
|---|---|---|
| `--th-panel` / `--th-panel-solid` | Panel fill (translucent / opaque) | dark grey |
| `--th-raise` / `--th-raise-hi` | Buttons and cards / when focused | mid greys |
| `--th-line` / `--th-line-hi` | Borders / strong borders, placeholders | greys |
| `--th-backing` / `--th-backing-solid` | Computer backing: overlay / full screen | dark |
| `--th-scrim` | Behind pause and modals | dark translucent |
| `--th-blur` | Overlay blur radius | 14px |
| `--th-text` / `--th-dim` / `--th-faint` | Text levels | light → dark grey |
| `--th-accent` | Selection, focus, active tab | white |
| `--th-primary-bg` / `--th-primary-text` | Primary button | light / dark |
| `--th-font` / `--th-font-display` | Body / display typeface | system-ui |
| `--th-display-weight` / `--th-display-spacing` | Big title treatment | 700 / 6px |
| `--th-heading-weight` | Titles, headings, buttons, tabs | 600 |
| `--th-label-size` / `--th-label-spacing` | Small caps labels | 13px / 1.5px |
| `--th-radius` / `--th-border-w` | Corner radius / border width | 0 / 1px |
| `--th-note` | Design-note colour (not part of the look) | yellow |
| `--th-good` / `--th-warn` / `--th-bad` | Status: completed, warning, danger (toasts, readings, danger mode) | green / amber / red |
| `--th-power` | Milestone banner | gold |
| `--th-speech` / `--th-speech-hi` | Dialogue box / a hovered reply | the solid panel / raise-hi |

Game data colours (colour affinity, fish rarity) live in `styles/tokens.css` and are **not** themed:
they mean the same thing in every look.

## Fonts

Only OFL fonts we could ship (`assets/fonts/`, licences alongside), declared in `themes/fonts.css`:
Nunito (rounded body), Fraunces (soft serif display), Cormorant Garamond (elegant serif), IM Fell English
(old-book), Caveat (handwriting, for notes in the witch's hand), Inter. To add one, vendor the `.ttf` +
licence and declare it in `fonts.css`.

## Port notes

A chosen style becomes the Slate style set (colours, fonts, brushes). Decorations marked
`/* SLATE: … */` need a texture, material or extra widget.

## The sets

| Id | Reference | Idea |
|---|---|---|
| `greybox` | — | Neutral, for judging flow and layout |
| `hedgewitch` | wand.md, "made by hand" | **Default for now (not a decision).** Warm walnut panels, parchment text, Fraunces display, hat-brim gold, 12px corners |
| `parchment` | Animal Crossing, Stardew | Light paper panels, ink-brown text, leaf-green accent, very round. Tests light panels over bright daylight |
| `moonlit` | Spiritfarer, the night shot | Indigo glass, heavy blur, cream text, starlight gold, italic Cormorant |
