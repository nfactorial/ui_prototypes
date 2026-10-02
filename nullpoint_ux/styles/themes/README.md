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
| `--th-power` | Power-up banner ("Super charged") | gold |
| `--th-shield` / `--th-health` | Boarding HUD vitals bars | light blue / near-white |

A theme may also override the HUD tokens from `styles/tokens.css` (`--col-primary`, `--col-text`,
`--col-ref`, `--col-panel`, `--col-line`) so the placeholder HUDs roughly follow along.

## Fonts

Only OFL fonts we could ship (`assets/fonts/`, licences alongside). Faces are declared in
`themes/fonts.css` (Barlow, Inter) and `styles/tokens.css` (Barlow Condensed, Share Tech Mono). To add a
font, vendor the `.ttf` + licence, then declare it in `fonts.css`.

## Port notes

A chosen style becomes the Slate style set (colours, fonts, brushes). Decorations marked
`/* SLATE: … */` need a texture, material or extra widget.

## The sets

| Id | Reference | Idea |
|---|---|---|
| `greybox` | — | Neutral, for judging flow and layout (`style=greybox` in the URL) |
| `nasapunk` | Starfield | Off-white on navy-black, warm orange accent, the four-colour stripe, rounded corners, Barlow |
| `director` | Destiny | **Default.** White on deep-blue glass, heavy blur, thin wide-spaced Inter display type, white-outline selection, 8px corners |
| `frontier` | Firefly | Warm browns, rust + teal, condensed caps, 2px borders, tessera grime in the panels |
