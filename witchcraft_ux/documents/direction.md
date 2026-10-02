# UI direction

The settled and open decisions about what the UI should *be*. Living document. Record the user's
decisions here, dated, and keep open questions visible rather than resolving them silently.

## Why this bench exists

To try the UI of *A Little Witchcraft* cheaply, before any of it is built in UMG, following the method
that worked for Null Point (`../UI_BENCH.md`). Speculative screens (spellbook, catches) are fair game.
Label them, and feed anything settled back into the game's design docs.

## Decided

| # | Date | Decision (user) |
|---|---|---|
| D1 | 2026-09-29 | **As little UI as possible while actually playing, but that doesn't mean nothing.** "No HUD" is **not** a final decision; it's too early to make any of this final |
| D2 | 2026-09-29 | **Swapping tools, opening the inventory and choosing spells all need in-game UI** |
| D3 | 2026-09-29 | **The world does not pause for in-game UI.** Selectors, the book and the rest run with the world carrying on. Only the pause menu (exit etc.) pauses |
| D4 | 2026-09-29 | **Placeholder keys are fine.** The game is played with keyboard or joypad; the prototype needn't match 1:1 |
| D5 | 2026-09-29 | **Fish (and Flowers) collections are intended**, recording her knowledge. Entry shows *name · RARITY · where*, not where she caught it. A catch count stays in the prototype for now (maybe achievements) |
| D6 | 2026-09-29 | **Show gamepad controls as well as keyboard.** Shoulders replace Q/E for book pages. The full control scheme isn't thought through yet |
| D8 | 2026-09-29 | **Spells are assigned to buttons.** Click a spell, get asked "Assign to where", press the spell button, and it replaces whatever was in that slot. Confirmed: a spell already on another button **swaps** (no duplicate, no hole), and while asking the slots **can be clicked** with the mouse |
| D9 | 2026-09-29 | **Rewards: reward tasks are optional.** Daily rewards are fine, but missing one never costs something exclusive ("oh you missed the daily task, now you don't have this cool item" is what to avoid). More Animal Crossing than Stardew. (Refines the game doc's "Rewards must not matter", `recurring_events.md`) |
| D10 | 2026-09-29 | **Rewards get their own book tab.** 🔴 **Five tabs maximum**; four makes the book Satchel · Recipes · Almanac · (rewards). The fifth is kept for something significant |
| D11 | 2026-09-29 | **The fourth tab is Keepsakes** (small tasks, milestones, photos, camera kit). Photo mode's album belongs there |
| D12 | 2026-09-29 | **Photo mode has two views**: *viewfinder* (she lifts the camera; world photos from her viewpoint) and *selfie* (camera ahead of her, looking back). Otherwise open to design ideas. **Filters and frames: liked** |
| D13 | 2026-09-29 | **A camera kit gathered over play** (user's idea): filters and frames are found, brewed or rewarded, and a full kit builds up over the game. A side-addition |
| D14 | 2026-09-29 | **Selfie poses: wanted, but for the future.** They depend on pose animations (a library, if one exists, or an animator) |
| D11 | 2026-09-29 | **The fourth tab is Keepsakes** (small tasks, milestones, photos, camera kit). Photo mode's album belongs there |
| D12 | 2026-09-29 | **Photo mode has two views**: *viewfinder* (she lifts the camera; world photos from her viewpoint) and *selfie* (camera ahead of her, looking back). Otherwise open to design ideas. **Filters and frames: liked** |
| D13 | 2026-09-29 | **A camera kit gathered over play** (user's idea): filters and frames are found, brewed or rewarded, and a full kit builds up over the game. A side-addition |
| D14 | 2026-09-29 | **Selfie poses: wanted, but for the future.** They depend on pose animations (a library, if one exists, or an animator) |
| D15 | 2026-09-29 | **Talking to characters leans Animal Crossing**, with **animalese** audio planned. Panel vs speech bubble is open (both built: variant `speech`) |
| D16 | 2026-09-29 | **Interaction prompt: low centre, verb + name** ("G  Pick  Birch sticks"). Built first in the game (`documents/prd/ui/ui_foundation_prd.md` there) |
| D16 | 2026-09-29 | **Recipe entries have an icon on the left** (typical of the genre). Placeholders until icons are bought |
| D17 | 2026-09-29 | **Study progress gets its own moment**, like the fish catch ("Aha! You learned something new"): the creature, its meter filling, the reagent learned |
| D18 | 2026-09-29 | **Milestones as square cards** (AC-style): earned stamps + one outline for the next, progress to the next tier only; later tiers aren't shown. The all-tiers rows stay as a variant for comparison |
| D19 | 2026-09-29 | **Milestone goals as a count** ("Fish caught · 6 / 10"), not a sentence: preferred in general, and simpler to localise (fixed label + numbers, no plurals). The sentence option stays in the bench only for comparison |
| D20 | 2026-10-01 | **One study pip per charm ingredient.** Each study step reveals one ingredient, so a creature whose charm takes one ingredient has one pip, five takes five. The Charms page shows a "?" for each ingredient still to learn |
| D7 | 2026-09-29 | **The book is two levels: tabs across, categories down a rail.** Tabs: **Satchel · Recipes · Almanac**. Recipes = Cooking, Potions, Spells, Charms. Almanac = Fish, Flowers, Creatures ("Almanac": user's pick). A studied creature's charm is a recipe (Recipes › Charms); what she knows of the animal is in Almanac › Creatures |

## Reading the game (a working interpretation, to check with the user)

- **Quiet in play, generous in menus.** The world is the show, as in Null Point's "minimal on a derelict".
  In-play UI should appear when it's used and leave when it isn't. Menus (the book) can be warm and full.
- **The game's own diegetic ideas stay** where it has decided them: the growing glyph *is* the casting UI,
  posture *is* the magnitude readout, breath *is* the warmth readout. The bench doesn't add bars for them.
- **Hand-made, not arcane.** Folk-craft materials: paper, ink, wood, cord, pressed flowers. Not glowing
  runes and gold filigree (the wizarding-school register the game avoids).
- **It must read in every light.** The screenshots run from blazing midday to a moonlit night, so
  in-world text carries its own shadow and gets tested on `rocky-hill`/`meadow-sea` and `night-moon`.
- **Careful with numbers.** "Different, not better": no stat blocks, tiers or completion percentages
  unless the user wants them.

### Reference points to ask about

Animal Crossing (tool wheel, hold-up catch, satchel grid), Stardew Valley (inventory), Spiritfarer (calm,
hand-drawn menus), Eastshade (painterly, quiet HUD), Tchia (diegetic map, minimal HUD), Zelda: Breath of
the Wild (quick-select wheel, minimal HUD options), Kiki's Delivery Service (the tone the story nods to).

## Style exploration

Looks are selectable **style sets** (`styles/themes/`), applied live to every screen. None is decided.
**Hedgewitch** is the default only so the first look isn't grey.

| Set | Idea |
|---|---|
| Hedgewitch | Warm walnut panels, parchment text, Fraunces serif, hat-brim gold |
| Parchment | Light paper panels, ink-brown text, leaf green, very round (Animal Crossing / Stardew) |
| Moonlit | Indigo glass, heavy blur, cream text, italic Cormorant, starlight gold (Spiritfarer) |

| Date | Reaction (user) |
|---|---|
| 2026-09-29 | **Selector motion is right as built.** The quick pop in reads as a "tada"; the fade out reads as the player dismissing it (`quick_select`: `QuickIn` 0.2 s fade + 92%→100% scale, `QuickOut` 0.12 s fade) |
| 2026-09-29 | Dialogue colour: a cream mix was *"a little bright and desaturated"*; the original tone was right, just too dark. Now the original lifted and more golden (`--th-speech: #3b2a1c`, Hedgewitch). **Approved** |
| 2026-09-29 | Dialogue: the panel was **too dark** (lightened), replies **too far right** (now aligned with the panel's edge), replies went **transparent on hover** (fixed: solid fill) |
| 2026-09-29 | **Spells page was too complicated**: dropped the separate "Ready to cast" column. Click a spell to ready it; the ready ones are a read-only strip at the bottom |
| 2026-09-29 | Inventory (satchel) look: *"way better"* than the in-engine v0.1. Toasts sat too high: moved down (fixed) |

## Open

- **How much in-play UI?** The world HUD's `hud` variant: quiet / contextual / always-on corner (D1).
- **Selector shape**: radial wheel vs bar, one wheel or two (tools, spells). (The world carries on: D3.)
- **Is colour affinity ever shown?** The `affinity` variant. The game never discloses a wand's affinity.
- **One book or separate screens** for satchel, spells and catches?
- **Study → familiars** (user's idea, being considered; now Almanac › Creatures + Recipes › Charms): study an animal until she knows the reagents that
  charm it; reagents she hasn't found read "Unknown fish" / "Unknown flower", giving fishing and picking a
  purpose. Sketched as the book's Creatures page.
- **Location range** for fish/flowers (a game-data addition the user might make): *widespread* → "Various",
  *region* → the region, *specific* → one place. ⚠️ Called "Common / Region / Specific" in conversation;
  "Common" would clash with the rarity, so the bench calls it **Widespread**.
- **Slot five of the book** (D10): held for something significant. Candidates: a Map (or a diegetic in-world
  map instead), or Home/decorating if it becomes a pillar.
- **Slot five of the book** (D10): held for something significant. Candidates: a Map (or a diegetic in-world
  map instead), or Home/decorating if it becomes a pillar.
- **The control scheme** (`src/input.js`, all proposed): which gamepad buttons open the wheels, the book,
  the spell tab.
- **Cameras and lenses** (user's idea, 2026-10-01; the game's `take_photo_mode.md`): collectibles for the
  camera kit, "different, not better", each unlocked by a photo that plays on its maker (Blassi: the moon;
  Icale: street photography). Built speculatively in photo mode (B / L) and Keepsakes › Camera kit. Open:
  how many of each; whether a lens fits any camera (bench: yes); whether Blassi's photos are square (variant
  `blassi`); whether Blassi's mirrored finder is charming or just confusing in motion; whether the
  readouts (1/60, f/5.6, ISO) feel like numbers the game shouldn't show. **Names** (variant `names`):
  the anagrams, birds (Sparrow, Dipper, Kestrel, Nightjar, Magpie, Heron) or invented makers (Fathom & Co.,
  Swiftwell, Glimmer, Hollis, Lunetta). The user: the brands are in fun, never in marketing, no reference
  to the real makers in the game (2026-10-01). Konni is now **Onnik** in the bench (user, 2026-10-01: Konni sat close to Konica). Nothing here is final: the whole idea is still a notebook entry in the game.
- ~~**Interaction prompt**: low centre or beside the thing; verb only, or verb + name?~~ **Resolved** by D16.
