# Quick selectors: tools and spells (grey-box)

**Serves:** user, 2026-09-29: *"swapping tools, opening inventory, choosing spells will all need UI in-game."*
The in-game way to change what's in her hands, without opening the book.

- **Tools (T):** one place per **kind** at a fixed angle, as the game's wheel (`tool_wheel_prd`): broom
  at the top, rod at 60°, camera at 120°, Hands free at the bottom, cauldron at 240°, and 300° for a fifth
  tool not yet chosen. **Six places at most** (D33). Each shows that kind's **active**
  piece from her collection (D25: tools no longer live in the satchel); which one is chosen on its page,
  Tools › Broom / Fishing / Camera. The game has one equipped-tool slot (`equipped_tool_prd`).
- **Variant `toolwheel`** (user's idea, 2026-10-11): `ring` (default) or `pentacle`: a tool at each of the
  five points (72° apart, broom at the top), **Hands free in the centre**, the name and flavour line below
  the figure. Radial only. The figure is **carved into a dark wooden disc** with grooves that glow gold
  and breathe slowly (user, 2026-10-11: "engraved, or at least more mystical"): a tessera bake,
  `tessera/pentacle.toml`.
- **No held-tool dot on the tool wheel** (user, 2026-10-11). The aim starts on what she holds. The spell
  wheel keeps its dot for the active spell.
- **A kind she hasn't got** (2026-10-09: naming it would give it away). Variant `wheelempty`: `hidden`
  (default, no place at all) or `empty` (an empty place, "Something goes here", the game PRD's fallback).
  Try it in the scene *Flow — a new tool*: no broom until J.
- **The book key on the wheel** (proposed, from the user's idea of a second button): I while aiming at a
  tool closes the wheel and opens that tool's page; on Hands free, the Satchel. The centre shows the hint.
  No new button needed.
- **Spells (Tab):** the loadout slots (4–6, `spell-grammar-and-loadout.md`), empty ones shown dashed and
  pointing to the spellbook. Each shows its cost class: free, reagent (what it needs), or ritual.
- Focus shows the name and description in the middle (radial), below the figure (pentacle) or above (bar).
- **Variant `selector`:** `radial` (a wheel round the witch) or `bar` (a row, low centre).
- **Motion (user, 2026-09-29: keep it):** in is a quick pop, a 0.2 s fade + 92%→100% scale that reads as
  a "tada"; out is a 0.12 s fade that reads as the player dismissing it. Fast on purpose: it's used mid-play.
- **The world carries on** while a selector is open (user, 2026-09-29, `flow.md` D3).
- Q/E still cycle spells directly without opening anything (see the world HUD's change hint).

## Open
- Ring of six or pentacle (variant `toolwheel`)? With Hands free in the centre, a stick at rest aims at it:
  see `direction.md`.
- Hold-to-open/release-to-pick (gamepad-natural) vs toggle (here). Possibly a setting.
- One wheel with tools and spells together, or two (here)?
- Does the tool selector also carry consumables (bait, a potion)? (Bait is chosen on Tools › Fishing for now.)
- Missing tool: hidden or "Something goes here" (variant `wheelempty`)?
- The book key as the wheel's "open its page" button: right, or a face button of its own?

## Port notes
- Radial: an `SConstraintCanvas` with slots placed by angle, or a custom panel that lays out on a circle.
  Focus navigation on a wheel wants stick-angle selection, not the spatial arrows used here.
- Pentacle: two textures (`assets/tessera/pentacle.png`, colour; `pentacle_glow.png`, tinted) as two
  `SImage`s, the glow's breathing a looping widget animation. Its `screen` blend is a UI material (or a
  plain alpha blend, a little stronger). The `.toml` moves to the game's `documents/tessera/` if adopted.
  The slots are placed on its points as on the ring. Hands free in the centre changes the stick's rest
  position from "nothing aimed" to Hands free.
- **Pentacle in Unreal, considered (user, 2026-10-11; not for the bench):** a UI material that lights the
  carving with a 2D light following the mouse cursor and/or the aimed tool, and a **`GlowColor`
  parameter** so the glow can be tuned in the game. Two things change in the bake:
  - The colour texture must be **unlit**: today it has the top-left light baked in (`slope` → `overlay`),
    which would double up with a live light. Bake it without, plus a **normal map** from the same height
    (tessera `normal`, `directx`), plus the groove and disc masks packed for the material.
  - The material does its own lighting (a UI material has no scene light): per pixel,
    `L = normalize(float3(LightUV - UV, LightHeight))`, then `N·L` plus some ambient. The glow can be lit
    too, brighter near the light. Check the normal's green direction against UV once, with the light at
    the top. Don't rotate the disc, or rotate the light with it.
  - Parameters on a dynamic material instance: `LightUV`, `LightHeight`, `GlowColor`, and the glow's
    intensity (the breathing, from a widget animation or the material's time). The cursor comes from the
    widget's geometry (absolute → local → UV). The aimed tool's slot centre gives a stick a target, eased
    so the light travels rather than jumps.
- Ring and glow: textures. The equipped dot is `::after` here, a small `SImage` in Slate.
