# Handoff: tooltips

**Tag:** `ui-handoff-core` · **Decided:** 2026-10-02 · **Look:** `style_set.md`
**Source:** `src/core/tooltip.js` (behaviour), `styles/feedback.css` (`tt-*`)
**Scene:** *Components — toasts & tooltips* · **Screenshots:** `img/tooltip_rich.png`, `img/tooltip_unavailable.png`

Hover (or keyboard-focus) a control for a moment and it explains itself. Any widget can carry one; it's
declared on the widget, with no per-screen code.

## Forms

| Form | Content | Used for |
|---|---|---|
| **Plain** | one text, wraps | short hints |
| **Rich** | meta label · title · body · stat table (each part optional except title) | items, modules, the save summary (`main_menu.md`) |
| **Unavailable** | rich, styled as a reason | 🔴 **why a control is disabled** ("Needs a tow line fitted (Ship → Utility)") |

## Layout

```
SNpTooltip                       brush PanelSolid with 1 px LineHi border, radius 8; padding T 12, R 16, B 14, L 16
                                 max width 380; never hit-testable; drop shadow (see Port costs)
└─ SVerticalBox                  6 between
   ├─ Meta (optional)            Label style @ 0.85 opacity        "PRIMARY WEAPON"
   ├─ Title                      H3                                 "Breaching rifle"
   ├─ Body (optional)            Small, Dim, wraps
   └─ Stats (optional)           SGridPanel, 2 columns; 6 between rows, 24 between columns
                                 padding T 10, margin T 6, a 1 px Line rule above
        ├─ key                   Label style                        "DAMAGE"
        └─ value                 Body at 12, right-aligned          "70"
```

- **Plain** is just a Body-style text at size 12, wrapping.
- **Unavailable:** the border is `Line` (quieter than `LineHi`), and the meta label is **Warn** coloured.

## Behaviour

| Rule | Value |
|---|---|
| Delay before showing | **0.38 s** of hovering / focus |
| Gap from the target | **12** |
| Margin from the screen edge | **16** |
| Default placement | **right** of the target, top edges aligned |
| Other placements | `left`, `below`, `above` (set per widget) |

- **Flip, then clamp:** try the preferred side; if it doesn't fit on screen, try the others in order
  (right → left → below → above; below → above → right → left; etc.). Then clamp inside the margin.
- **Keyboard focus shows tooltips only when the keyboard is in use.** A screen focusing its default button
  when it opens must *not* pop a tooltip.
- 🔴 **Disabled controls still show their tooltip.** That's the point of the Unavailable form.
- **Hides on:** the pointer leaving, any click, any key except the arrows (arrows move focus, and the
  newly focused widget's tooltip follows).

## Motion

| Animation | Tracks |
|---|---|
| `TooltipIn` | opacity `[0 → 0, quadOut] [0.12 → 1]` · translate `[0 → (0, 4), cubicOut] [0.16 → (0, 0)]` |

No outro: it disappears at once.

## Port notes

- Slate's tooltip system (a custom `SToolTip` widget, or UMG's tooltip widget binding) gives hover delay and
  following for free. 🔧 Unverified: whether its placement can be made to do this flip-and-clamp beside the
  target, whether it shows on **disabled** widgets, and whether it shows on **keyboard/gamepad focus**. If
  any of these fail, a small tooltip manager in the top layer that positions the card itself is the fallback
  (that's what the prototype does).
- Content is data on the widget: plain text, or meta / title / body / stats.

## Port costs

| What | Suggestion |
|---|---|
| Drop shadow `(0, 10)`, 30 blur, black @ 0.45 | A 9-slice shadow texture, or drop it. The `LineHi` border already separates it from the background |
