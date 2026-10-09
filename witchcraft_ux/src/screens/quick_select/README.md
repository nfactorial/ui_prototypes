# Quick selectors: tools and spells (grey-box)

**Serves:** user, 2026-09-29: *"swapping tools, opening inventory, choosing spells will all need UI in-game."*
The in-game way to change what's in her hands, without opening the book.

- **Tools (T):** one place per **kind** at a fixed angle, as the game's wheel (`tool_wheel_prd`): broom
  at the top, rod at 60°, camera at 120°, Hands free at the bottom. Each shows that kind's **active**
  piece from her collection (D25: tools no longer live in the satchel); which one is chosen on its page,
  Tools › Broom / Fishing / Camera. The game has one equipped-tool slot (`equipped_tool_prd`).
- **A kind she hasn't got** (2026-10-09: naming it would give it away). Variant `wheelempty`: `hidden`
  (default, no place at all) or `empty` (an empty place, "Something goes here", the game PRD's fallback).
  Try it in the scene *Flow — a new tool*: no broom until J.
- **The book key on the wheel** (proposed, from the user's idea of a second button): I while aiming at a
  tool closes the wheel and opens that tool's page; on Hands free, the Satchel. The centre shows the hint.
  No new button needed.
- **Spells (Tab):** the loadout slots (4–6, `spell-grammar-and-loadout.md`), empty ones shown dashed and
  pointing to the spellbook. Each shows its cost class: free, reagent (what it needs), or ritual.
- Focus shows the name and description in the middle (radial) or above (bar). The equipped/active one
  has a dot.
- **Variant `selector`:** `radial` (a wheel round the witch) or `bar` (a row, low centre).
- **Motion (user, 2026-09-29: keep it):** in is a quick pop, a 0.2 s fade + 92%→100% scale that reads as
  a "tada"; out is a 0.12 s fade that reads as the player dismissing it. Fast on purpose: it's used mid-play.
- **The world carries on** while a selector is open (user, 2026-09-29, `flow.md` D3).
- Q/E still cycle spells directly without opening anything (see the world HUD's change hint).

## Open
- Hold-to-open/release-to-pick (gamepad-natural) vs toggle (here). Possibly a setting.
- One wheel with tools and spells together, or two (here)?
- Does the tool selector also carry consumables (bait, a potion)? (Bait is chosen on Tools › Fishing for now.)
- Missing tool: hidden or "Something goes here" (variant `wheelempty`)?
- The book key as the wheel's "open its page" button: right, or a face button of its own?

## Port notes
- Radial: an `SConstraintCanvas` with slots placed by angle, or a custom panel that lays out on a circle.
  Focus navigation on a wheel wants stick-angle selection, not the spatial arrows used here.
- Ring and glow: textures. The equipped dot is `::after` here, a small `SImage` in Slate.
