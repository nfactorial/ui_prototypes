# UI direction

The settled and open decisions about what the UI should *be*. Living document. Record the user's
decisions here as they're made, with the date, and keep open questions visible rather than resolving
them silently.

## Why this prototype exists

A place to **try things without committing to the Unreal implementation**: discover what works and
what doesn't, cheaply, before anything is built in Slate (user, 2026-09-28). Speculative screens
(missions, loadout, crew) are fair game here even though the game's own docs keep economy and
progression cut. Exploring them is part of the point. Label them speculative, and feed anything settled
back into the game's design docs.

## Decided

| Date | Decision |
|---|---|
| 2026-09-28 | **Start with menus and the flow**, not HUDs: main menu, then the screens the player works through (missions, loadout, …). None of these screens or the flow are decided yet |
| 2026-09-28 | **The in-game menus are the player's computer.** The player accesses their computer, and that *is* the UI menus |
| 2026-09-28 | 🔴 **Not "dry, technical".** Welcoming and *grand*, not EVE Online. Reference points: **Halo, Destiny, Starfield** |

The flow decisions (computer ship-only, loadout locked off-ship, free exploration + optional missions,
launch straight into the world) live in **`flow.md`**.

## Reading the references

What Halo / Destiny / Starfield share, as a working interpretation (to check with the user, not gospel):

- Big, confident type; few things on screen at once; generous space.
- Imagery carries the screen (planets, ships, characters large and central); UI frames it.
- Cards and tiles you *choose between*, rather than tables you *read*.
- Depth: the world blurred or parallaxed behind the menu, layered panels, confident motion.
- Starfield's "NASA-punk" (clean stripes, friendly rounded forms, used hardware) is the likeliest bridge
  between welcoming and the game's grubby Firefly frontier.
- Destiny's Director (**the map is the menu**) is a candidate shape for a game whose activity is the hunt.

⚠️ The current placeholder look (amber terminal, small caps labels, dense monospace readouts) is the
**opposite** of this direction. It was a stand-in to prove the framework. Don't iterate on it; replace it.

## Density by context (user, 2026-09-28)

🔴 **Minimal on a derelict, denser aboard your own ship.** The FPS (boarding) HUD stays sparse: the horror
register wants the player to see little. On your ship, where the computer is available, the UI can carry
more information. The main boarding information is **shield + health** (rules in `src/mock/vitals_model.js`).

## Style exploration

Colour and visual identity are **undecided** (user, 2026-09-28: the grey-box looks dry, as expected, until
a scheme is chosen). They're explored as selectable **style sets** (`styles/themes/`), applied live to the
real grey-box screens: NASA-punk (Starfield), Director (Destiny), Frontier (Firefly). More are welcome.
Record reactions to each here as they come.

| Date | Reaction (user) |
|---|---|
| 2026-09-28 | **Director (Destiny-ish) is the favourite** of the first three |
| 2026-09-28 | **Hard edges look too technical.** Wants a slight border radius on boxes. Director's radius raised 2px → 8px: *"a big improvement"* |
| 2026-09-28 | **Director is now the default style.** Frontier deliberately stays hard-edged, as the gritty contrast |
| 2026-09-28 | **Shield/health logic is exactly right** (*"works exactly as hoped"*). The vitals visuals are *"a little plain"*: fine for now, refine later |
| 2026-09-28 | 🔴 **Banners are only for must-know progress**: *"extremely important progress information"*, never routine pickups (*"not for 'picked up weapon pack'"*). Those are stack toasts. "Super charged" power-up banner added |
| 2026-09-28 | **"Super charged" stays as a capability example**, not a planned feature: it shows a banner can carry its own colour, icon and glow. Other must-know events could use it the same way, e.g. *"Self destruct activated"* |
| 2026-09-28 | **Banner toasts are the way to report major progress** (Destiny-style): *New objective* is a keeper, and better than what was planned. A power-up banner ("Super charged", own icon/colour) is a candidate, undecided |

## Open

- **Overlay or "in the computer"?** The computer UI either overlays the 3D scene (world visible, blurred,
  behind) or is its own full-screen display. Undecided. Plan: build one screen both ways and compare.
- **The flow.** From pressing Start to the first boarding: which screens, in what order.
- **What a mission is.** Pillars §5: the hunt is the gameplay, not a waypoint, so a mission probably
  gives a *lead* rather than a marker. The world offers salvage contracts, insurance claims, loss
  adjusters and requests from planet-dwellers (brainstorm).
- **Loadout** is likely three things: the ship (hull + hardpoint modules, which exist as game data), the
  player (weapon, suit), and the boarding party (pillars §6: alone vs squad, chosen before you know
  the ship).
