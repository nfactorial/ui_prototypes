# Screen flow

What screens exist and how the player moves between them. Living document: decisions are the user's
and dated; everything else is marked open. See `direction.md` for the look.

## The shape (2026-09-28)

```
 Launch
   │
   ▼
 MAIN MENU  (animated background)
   │ Continue / New game
   ▼
 ┌──────────────────────── ON YOUR SHIP ────────────────────────┐
 │  3D world, flight or on foot.   Prompt: "C  Computer"          │
 │  Flight: search → SCAN a derelict (flight HUD, real time)      │
 │        │  C (any time aboard, world pauses)  ▲                 │
 │        ▼                                     │ close           │
 │   THE COMPUTER ────────────────────────────────                │
 │     • Missions   (browse / accept, optional)                   │
 │     • Loadout    (personal: weapon, suit, …)                   │
 │     • Ship       (hull, hardpoint modules)                     │
 │     • … open: map? crew? records (scan results)?               │
 │                                                                │
 │   DRONE CONSOLE (walk to it; game design 2026-09-22)           │
 │     → optional drone survey of the docked derelict             │
 └──────────────────────────────┬─────────────────────────────────┘
                                │ dock, leave the ship (seamless, pillars §4)
                                ▼
 ┌──────────────────────── OFF YOUR SHIP ───────────────────────┐
 │  Boarding a derelict. Boarding HUD only.                      │
 │  🔴 No computer. Loadout is locked to what you brought.       │
 └──────────────────────────────┬─────────────────────────────────┘
                                │ return aboard
                                ▼
                         back ON YOUR SHIP
```

**Esc: pause / system menu** (settings, save, quit) works everywhere, on and off the ship (F9).

The game's loop (`E:\dev\unreal\nullpoint\documents\design\gameplay\the_player.md`): search → scan → dock →
optional drone survey → board. The drone is deployed from a **console aboard your ship**, a place you walk
to, not a menu (decided in the game docs, 2026-09-22). So the drone console is its own UI, separate from
the computer, and the drone's view gets its own HUD.

## Decided (user, 2026-09-28)

| # | Decision |
|---|---|
| F1 | **Main menu is basic** (Continue / New / Settings / Quit territory) over an **animated background** that sets the scene. The background is undecided (see open questions) |
| F2 | **The game launches straight into the 3D world.** No hub screen. Onboarding happens through **in-world prompts** ("Press C to bring up your computer"), which need their own design |
| F3 | **The computer is available any time aboard your own ship, and never off it.** On a derelict there's no computer |
| F4 | **Exploration is free; missions are optional.** The player can roam space and board what they find, and can *also* accept missions from the computer |
| F5 | **Loadout is set at the computer before leaving, and locked once you're off the ship.** You can board any ship, but only with what's configured |
| F6 | **The computer needs a ship loadout page** as well as the personal loadout |
| F7 | **The computer works mid-flight**, including from the pilot seat |
| F8 | **The game world pauses while the computer is open.** Single-player, and the friendlier choice. ⚠️ May be revisited |
| F9 | **A separate pause / system menu (Esc) works everywhere**, including on derelicts. The computer (C) is ship-only |
| F10 | **Main menu background: a derelict in space.** It sets the scene; the planet horizon felt too generic |
| F11 | **The player can scan derelicts.** How it works needs a plan: see `scanning.md` |

## Screen inventory

Grey-box built 2026-09-28: play it through the **Flow** scenes in the harness (`src/flows/game_flow.js`).

| Screen | Status | Notes |
|---|---|---|
| Main menu | Grey-box | Basic options; the background is the design problem |
| Settings | Stub | From the main menu, and from pause in-game |
| In-world prompts | Grey-box | Contextual input hints and onboarding tips. A *component family*, not a screen |
| Computer: shell | Grey-box | The frame: how it opens, section navigation, overlay vs full-screen |
| Computer: Missions | Grey-box | Browse, accept, track. Shape of a mission is open |
| Computer: Loadout | Grey-box | Personal kit for boarding |
| Computer: Ship | Grey-box | Hull + hardpoint modules (exists as game data: `UShipHullDefinition`, hardpoints) |
| Pause / system menu | Grey-box | Esc, everywhere (F9) |
| Scanning | Needed | Flight HUD interaction + result card; plan in `scanning.md` |
| Drone console | Needed | Aboard the ship; deploy / control the survey drone |
| Drone HUD | Needed | The drone's camera feed. Its look is a post-process per drone (game's `drone.md`) |
| Flight HUD | Exists (placeholder) | |
| Boarding HUD | Exists (placeholder) | |
| Computer: Map | Open | Free exploration makes a system map likely. Destiny-style map-as-hub is a candidate |
| Computer: Crew | Speculative | Pillars §6. Hired crew, alone vs squad per boarding |
| Computer: Records / logs | Grey-box (speculative) | Survey records (the three numbers), recovered nav logs |

## Open questions

- **The derelict background, in detail** (F10). Tumbling slowly in silhouette, catching light now and
  then? Drifting past a planet? Try variants here as layered 2D motion. In Unreal it would likely be a live
  3D menu scene.
- **Overlay or "in the computer"** (from `direction.md`). Try the computer shell both ways.
- **What a mission is** and how it starts (`direction.md`). Leads vs markers; where offers come from.
- **Boarding party** (pillars §6). If crew happen, choosing who comes is part of the pre-departure loadout.
- **Prompt styles.** Contextual ("E Open"), persistent hint ("C Computer"), one-time tips. How many kinds,
  and do they adapt to keyboard vs gamepad?
