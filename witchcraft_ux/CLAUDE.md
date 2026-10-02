# Witchcraft UX: browser prototype of A Little Witchcraft's UI

A **UI bench** for *A Little Witchcraft*. The method, the framework and the port rules are shared with the
other benches and live in **`../UI_BENCH.md`**, imported here:

@../UI_BENCH.md

Everything below is only what is true of this game.

| | |
|---|---|
| **The game** | `E:\dev\unreal\alittlewitchcraft`. Read its `CLAUDE.md` (genre and tone) before designing a screen. UE 5.8, C++, GAS; UMG only, no CommonUI yet |
| **Screenshots** | `E:\dev\Unreal\screenshots\alittlewitchcraft\`, copied into `assets/backdrops/` (see `assets/CREDITS.md`) |
| **Port** | `node tools/serve.mjs` → http://localhost:5320 |

🔴 **`documents/direction.md` holds the UI direction; read it first.** In short (user, 2026-09-29): **as
little UI as possible while actually playing, but not nothing, and nothing is final yet.** Swapping tools,
opening the satchel and choosing spells all need in-game UI. The game's own docs lean hard on diegetic
feedback ("the glyph is the UI", posture is the magnitude readout). Respect that where the game has
decided it, but don't treat "no HUD" as a rule. `documents/flow.md` holds the screen flow and inventory.

## What the game is, for UI purposes

- **Sandbox adventure, cozy *tone*.** No fail states, no time pressure. The player is safe and unhurried
  while the world can be cold, wet, dark and wild. **Cozy is not cute-saturated.** The world is "realistic
  but stylized" (Eastshade / Tchia / Spiritfarer).
- **Folk-craft, not wizarding school.** Hedge-witch craft, "made by hand, and it looks it" (`wand.md`).
  Avoid the Harry Potter register and franchise names.
- **"Different, not better."** No vertical progression ladders (spells, brooms, familiars, villagers).
  Be careful with anything that reads as a stat, a tier or a checklist. "A broom is known by its name and
  by how it feels to fly, never by a stat block."
- **The game must not over-remind.** E.g. no birthday alerts; affinities are never disclosed for wands.
- 🔴 **The world never pauses for in-game UI** (user, 2026-09-29). Book, selectors, prompts: the world
  carries on. Only the pause menu (Esc) pauses.
- **Keyboard or joypad.** The game's keyboard layout is ESDF; the prototype's keys are placeholders and
  don't need to match the game 1:1 (user, 2026-09-29).

## Game data the screens mirror (names from the C++)

| System | Where | UI-relevant fields |
|---|---|---|
| Items / satchel | CozyFramework `UItemDefinition`, `FInventoryContainer` | `DisplayName`, `Description`, `Icon`, `bStackable`; containers W×H of `{Item, Count}` |
| Inventory UI v0.1 | `Plugins/CozyFramework/Documentation/inventory_ui_prd.md` | Built, read-only: portrait + grid, count badge > 1, name/desc on hover |
| Interaction | `ICozyInteractable::GetInteractionPrompt` | A verb ("Pick", "Talk", "Pet", "Pick Up"). Nothing draws it yet |
| Tools | `equipped_tool_prd.md` | One equipped slot |
| Spells | `USpellbookComponent`, `USpellDefinition` | `EquippedSpells`, active index, Next/Previous. Only the wisp exists |
| Fishing | `FFishCatchEntry`, `EFishRarity` | Name, rarity, time window; result is a debug message today |
| Zones | `UZoneBannerComponent`, `WBP_ZoneBanner` | Name only; silent on spawn; unnamed = none; restart on re-entry |
| Time / weather | ClimateFramework | `TimeOfDay` [0,1), `EDayPhase`, `EWeatherMood`, temperature |
| Colour affinity | `documents/design/color_affinity.md` | Green, Yellow, Blue, Red, Black, White, Void (colours in `styles/tokens.css`) |

Mock data is in `src/mock/`: `world.js` (time, zone, prompt, tool, active spell) and `witch.js` (items,
satchel, spells, fish). Fields the game lacks are marked PROPOSED.

## Screens and scenes

Flow scenes (`src/flows/game_flow.js`) are the main way in: main menu → world, with I (satchel), K
(spells), T (tools), Tab (spell wheel), 1–5 (spell buttons), Q/E (cycle spell), G (interact), F (fish), Z (next zone), 6–0
(toasts), Esc (pause/back). There are also variants of the flow scene: at night (dark test) and on a
bright hill (light test). Each screen folder's `README.md` says what's decided, what's open and the
port notes.

**`documents/build_list.md`** is the path to Unreal: the reusable widgets, the screens made from them, what
CommonUI gives, a build order, and the exact colour/type/shape values. Regenerate its colour tables with
`python tools/colours.py` whenever a theme value changes.

**Input glyphs** come from `src/input.js` (`glyph('interact')`): never hard-code a key in markup. The
harness **Input** variant switches keyboard/gamepad live. The bindings there are all proposals.

**Toast kinds** (`core/notify.js`) are this game's events: `collected`, `caught`, `info` (stack),
`learned`, `milestone` (banner: must-know only), `notice` (alert, gentle).
