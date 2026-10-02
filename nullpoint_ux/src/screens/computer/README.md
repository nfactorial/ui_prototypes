# The computer (grey-box)

**Serves:** `flow.md` F3 (ship-only), F5 (loadout locked off-ship), F6 (ship page), F7 (mid-flight), F8
(world pauses). Scanning results: `scanning.md`.

- Opens with **C** anywhere aboard, closes with **C** or **Esc**. **Q / E** cycle sections (shoulder buttons).
- Sections: **Missions** (optional offers, F4), **Loadout** (personal kit), **Ship** (hull + hardpoint
  modules, including scanners), **Records** (scanned ships: three numbers, readings, schematic). **Map** is
  a disabled tab: an open question.
- Lists preview on focus (Destiny-style), and confirm on click / Enter.
- **Variant `computer`:** overlay (blurred world behind) vs full screen (its own display). Different intro
  motion for each: content rises vs the display powers on.

## Open
- Overlay vs full screen (the point of the variant).
- Map, Crew: whether they're sections at all.
- What a mission is (leads, not markers).

## Port notes
- Overlay blur is `SBackgroundBlur`: a real cost (`ui/05` §6).
- Tabs + switcher → CommonUI tab list + `SWidgetSwitcher`; Q/E → CommonUI tab navigation actions.
- Explicit focus rules (`data-nav-*`) → Slate navigation rules (`EUINavigationRule::Explicit`).
