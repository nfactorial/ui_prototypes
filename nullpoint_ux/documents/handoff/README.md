# Handoff specs: what the Unreal work builds from

A handoff describes a **decided** piece of UI, at a fixed commit, in Slate terms. The Unreal side builds from
these, never from the raw HTML/CSS (the prototype can't tell harness from design, and it keeps moving).
The game repo's technical design makes the engine decisions (UMG vs Slate, CommonUI, MVVM, input routing);
its PRDs reference these files rather than copying them.

## Handed off

Tag **`ui-handoff-core`** (2026-10-02). Decided by the user on 2026-10-02: *the menu system, the overall
look and the components.*

| Spec | What |
|---|---|
| [`style_set.md`](style_set.md) | 🔴 **Read first.** The Director look as a Slate style set: colours, fonts, text styles, brushes, button states |
| [`main_menu.md`](main_menu.md) | The main menu's layout, buttons, focus and intro. **Not its background** |
| [`pause_and_confirm.md`](pause_and_confirm.md) | The pause / system menu, and the reusable confirm dialog (quit) |
| [`toasts.md`](toasts.md) | Notifications: stack toasts, banners, alerts. Kinds, queueing, timing, motion |
| [`tooltips.md`](tooltips.md) | Plain, rich and "unavailable" tooltips: delay, placement, motion |

## Not handed off (still being designed)

- **Everything in the world**: flight HUD, boarding HUD, in-world prompts, scanning.
- **The computer** (missions, loadout, ship, map).
- **Settings**: a stub; its content isn't designed.
- **The main menu background**: a live 3D menu scene. Derelict vs flyby is open (`../flow.md`).
- **Where toasts sit in the world**: depends on the HUD layout. `toasts.md` marks it provisional.

## Conventions in every spec

- **Sizes are Slate units.** The prototype's reference resolution is 1080 tall, so 1 CSS px = 1 Slate
  unit at DPI scale 1.0.
- 🔧 **Font sizes are given as Slate sizes**, converted as *CSS px × 0.75* (Slate font size is points at
  96 DPI). Unverified: check one against an in-engine screenshot before trusting the rest.
- 🔧 **Letter spacing is given in Slate's units** (1/1000 em): CSS px ÷ font px × 1000.
- **Colours are sRGB** as written (`#rrggbb`, alpha 0–1). Convert with `FLinearColor::FromSRGBColor`, or
  enter them as `FColor`. Typing sRGB values straight into `FLinearColor` makes everything too bright.
- **Motion** is given as UMG animation tracks: keys at times in seconds, and the interpolation that
  *leaves* each key (`quadOut`, `cubicOut`, …; Slate's ease set).
- **`SLATE:`** marks anything that costs more than a stock brush: a material, texture or custom widget.
  Each spec lists them under *Port costs*.
- **Focus and hover are one highlight state** (console-style): mouse hover moves focus. Keyboard and
  gamepad polish isn't a priority yet.

## Reference

- Screenshots: `img/`.
- Live, at the tag: `node tools/serve.mjs`, then the scenes **Flow — from main menu**, **Flow — paused**
  and **Components — toasts & tooltips** (`http://localhost:5310/#scene=components`). Shift+O outlines the
  widget tree; the Motion dropdown slows animations down to judge timing.

## Writing the next one

Follow `../../CLAUDE.md` (*The path to Unreal*): build it from the screen's README, tag the commit
(`ui-handoff-<feature>`), add a row above. When a handed-off piece changes later, update its spec and
re-tag. Don't leave a spec describing something the prototype no longer does.
