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
| D21 | 2026-10-05 | **The camera is set up in the book, not in the viewfinder.** While the camera is up the player can open the book; it opens on Keepsakes › Camera kit ("perhaps", user: the default while in camera mode), and camera, filter, frame (and lens) are chosen there. The viewfinder has no option controls. Its first overlay is **plain**, as the game's stage 3 |
| D22 | 2026-10-05 | **A seventh camera, the Expanse** (a nod to the Hasselblad XPan: said aloud, "ex-PAN-se"). Not "Blassi Expanse": one maker shouldn't get two. **It takes a true panorama**: wider in the world, not a crop, then saved at the normal output size (so not a "bigger" image) |
| D23 | 2026-10-05 | **Cameras: varied, but a fun sub-system, not a camera simulator.** Don't go too far, but once the base works most variety is *configuration* of the one system (a camera, a lens, a filter, a frame are data), so make what you can do fairly varied: an interested player gets an intricate kit for little work from us. **Out:** real-camera controls (ISO, white balance, autofocus and the like) |
| D24 | 2026-10-05 | **Viewfinder readouts stay, as flavour.** They're dressing: they may change with the light and the lens, but the player never adjusts them; that's where it would go too far. (Adjustable settings only if photography ever became hugely popular, which isn't expected) |
| D25 | 2026-10-09 | **Her tools live in a collection, not the satchel** (user's idea, 2026-10-08). **Things she keeps** (brooms, rods, lines, cameras and their kit) go into her collection, one page per kind (Broom, Fishing, Camera…); **everything else goes in the satchel**. On a kind's page she makes one **active**, and the active one is what the tool wheel shows. A new rod or broom never fills her bag. ⚠️ Reverses the game's `tools.md` (2026-09-30: a tool takes a satchel slot and is marked for the wheel there) |
| D26 | 2026-10-08 | **Filters and frames switch in the viewfinder**, among the ones she has enabled on the camera's page; the camera and lens are chosen on the page. Refines D21 (which had no option controls in the viewfinder) |
| D27 | 2026-10-09 | **The book opens on the Satchel**, the page used most, not on the page of the tool in her hands. **Except in photo mode (the camera raised, looking through it): then it opens on Tools › Camera** (she most likely wants the kit then, not the satchel). The camera merely in her hands doesn't count (user, 2026-10-09). Replaces D21's Keepsakes › Camera kit. (A way from the tool wheel to the aimed tool's page is open, below) |
| D28 | 2026-10-09 | **The first of each kind is made active for her, and announced**: "You received a new tool! **BROOM**". Picking one up still puts it in her hands. Replaces `tools.md`'s "nothing is marked for her, not even the first" |
| D29 | 2026-10-09 | **Rods differ in look and in what they can land** ("you can't catch a shark with a flimsy wooden rod"): more than aesthetic. **Strength is internal**: it drives what she can catch and is never shown as a value, nor spelled out in a description. The name carries it ("Waverly's Ocean Fishing Rod"). **A tool's flavour line describes it**, what it looks like ("Ornately decorated with iridescent abalone shell"), never what it can do. The rod specification isn't settled |
| D30 | 2026-10-09 | **A Tools tab holds the tool pages**: Broom · Fishing · Camera (and kinds to come). **Camera kit moves here from Keepsakes, retitled "Camera"**; Keepsakes keeps Small tasks · Milestones · Photos. The book is Satchel · Recipes · Almanac · Keepsakes · Tools. **A Map is the only other tab that could be added**; nothing else gets a tab (⚠️ that would be a sixth, past D10's five: open, below) |
| D31 | 2026-10-09 | **Bait recipes are Recipes › Bait**, a category beside Cooking, Potions, Spells and Charms. Bait she makes goes in her satchel |
| D32 | 2026-10-09 | **Every detail string is flavour, never technical**: what a thing looks like, its character ("Ornately decorated with iridescent abalone shell"). Not what it does, how well, or a number: no "SLR, quick to focus", no "50 mm", no "Only bites after dark". The name says what it is. **For everything**: tools, camera pieces, satchel items, recipes, spells. (What a camera piece does shows in its sample photo on the card.) The factual lines are kept as possible **learnings** (Open, below) |
| D33 | 2026-10-11 | **Six places on the tool wheel, at most: five tools and Hands free** (empty hands). The kinds so far: Broom, Fishing, Camera, **Cauldron** (for now: it may leave the wheel, below); the fifth is undecided (the game's `tools.md` intends a net). Matches the game's ring of six (`tool_wheel_prd`), now as a ceiling rather than room to grow. ⚠️ Updates `tools.md` ("about five tools, eventually"; the cauldron "undecided") |
| D34 | 2026-10-11 | **The cauldron has a page of its own, Tools › Cauldron**, so it sits with the broom and the rod. Its pieces are a collection of **cauldrons**, plus whatever else she can choose for it (open, below; the bench proposes **spoons**). **Every piece is visual configuration only**: how it looks, never how well she brews. How she reaches the cauldron in play is open (below) |
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
| 2026-10-11 | **No held-tool dot on the tool wheel** (a minor note). Removed; the spell wheel keeps its dot |
| 2026-10-11 | **The pentacle should look engraved, or at least more mystical**, perhaps a real image from tessera. Now carved into a dark wooden disc, its grooves glowing gold and breathing (`tessera/pentacle.toml`). The user: **"looks great"**, and it gives the wheel "much more of a witchy vibe". For the game, the user is considering a bump map lit by a 2D light that follows the cursor or the aimed tool, with the glow colour a parameter to tune there (port notes, `quick_select`) |
| 2026-09-29 | **Selector motion is right as built.** The quick pop in reads as a "tada"; the fade out reads as the player dismissing it (`quick_select`: `QuickIn` 0.2 s fade + 92%→100% scale, `QuickOut` 0.12 s fade) |
| 2026-09-29 | Dialogue colour: a cream mix was *"a little bright and desaturated"*; the original tone was right, just too dark. Now the original lifted and more golden (`--th-speech: #3b2a1c`, Hedgewitch). **Approved** |
| 2026-09-29 | Dialogue: the panel was **too dark** (lightened), replies **too far right** (now aligned with the panel's edge), replies went **transparent on hover** (fixed: solid fill) |
| 2026-09-29 | **Spells page was too complicated**: dropped the separate "Ready to cast" column. Click a spell to ready it; the ready ones are a read-only strip at the bottom |
| 2026-09-29 | Inventory (satchel) look: *"way better"* than the in-engine v0.1. Toasts sat too high: moved down (fixed) |

## Open

- **The tool wheel: a ring of six, or a pentacle?** (user's idea, 2026-10-11) The pentacle has a tool at
  each of its five points and **Hands free in the centre** (user, 2026-10-11: "makes sense"). Variant
  **Tool wheel: Pentacle**, beside the **Ring of six**. With the pentacle:
  - On a pad, the centre is where the stick rests. Today releasing with nothing aimed does nothing (a
    cancel, `tool_wheel_prd` decision 4); with Hands free in the centre, letting go with the stick at rest
    would put the tool away. Either the centre takes a deliberate press, or cancelling moves to B / Esc only.
  - The figure always shows five points, so with a missing tool hidden (`wheelempty`) a bare point still
    says "something goes here", unnamed. A feature or a giveaway?
  - The name and flavour line sit below the figure, not in the centre.
  - Point up (the upright pentacle), broom at the top. It echoes the game's casting figures (`casting.md`:
    five runes make a pentagram).
- **What else is chosen for a cauldron?** (D34) Proposed in the bench: **spoons** (hazel spoon, bone
  ladle). Other candidates: what hangs it over the fire (a tripod, a chain, three stones), a lid, a charm
  tied to the handle (as the broom's trinket).
- **How does she reach her cauldron?** (user, 2026-10-11: not mapped out yet) She already carries more
  than a real person could (broom, rod, camera), so carrying a cauldron isn't ruled out on that ground.
  Possibly out of reach when she's away from home, or she can set it down only at certain places; it may
  leave the wheel altogether, freeing a place. (The game's `structure.md` has a home's cauldron as its
  crafting anchor.)
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
- ~~**Slot five of the book** (D10): held for something significant. Candidates: a Map (or a diegetic in-world
  map instead), or Home/decorating if it becomes a pillar.~~ **Resolved** by D30: Tools.
- **A Map tab would be a sixth** (D30). The user keeps one tab possible for a Map, but Tools fills D10's
  five. Raise the cap to six (Map only), or does a map go elsewhere (in the world, or a page)?
- **The control scheme** (`src/input.js`, all proposed): which gamepad buttons open the wheels, the book,
  the spell tab.
- **Cameras and lenses** (user's idea, 2026-10-01; the game's `take_photo_mode.md`): collectibles for the
  camera kit, "different, not better", each unlocked by a photo that plays on its maker (Blassi: the moon;
  Icale: street photography). Built speculatively in photo mode (B / L) and Keepsakes › Camera kit. Open:
  how many of each; whether a lens fits any camera (bench: yes); whether Blassi's photos are square (variant
  `blassi`); whether Blassi's mirrored finder is charming or just confusing in motion; ~~whether the
  readouts (1/60, f/5.6, ISO) feel like numbers the game shouldn't show~~ (resolved: D24, flavour only). **Names** (variant `names`):
  the anagrams, birds (Sparrow, Dipper, Kestrel, Nightjar, Magpie, Heron) or invented makers (Fathom & Co.,
  Swiftwell, Glimmer, Hollis, Lunetta). The user: the brands are in fun, never in marketing, no reference
  to the real makers in the game (2026-10-01). Konni is now **Onnik** in the bench (user, 2026-10-01: Konni sat close to Konica). Nothing here is final: the whole idea is still a notebook entry in the game.
- ~~**Interaction prompt**: low centre or beside the thing; verb only, or verb + name?~~ **Resolved** by D16.
- **Tools she doesn't have aren't shown** (user, 2026-10-09: "wondering", a leaning). The pages list only
  what she owns, so she never feels she's missing something; the possible tools stay unknown until she
  gets one, and the "new tool" prompt is the reward. Tools come easily, as part of early play, so there's
  no hunting for them. Open: does it reach the camera kit, whose missing pieces now say how to get them
  ("Photograph the moon")? **The wheel no longer names a kind she hasn't got** (user, 2026-10-09: "A place
  for a fishing rod" would give it away): either the place is hidden, or it's an empty slot reading
  "Something goes here" (the game's PRD fallback). Both in the bench: variant `wheelempty`.
- **Learnings** (user's term, 2026-10-09). 🟡 **A hazy concept, deliberately not designed yet**: information
  she learns about things over time ("Your wisp burns green for a while", "Roach and perch can't leave it
  alone", "Only bites after dark"). It may need defining later. Until then, such lines are **kept with the
  thing they're about** (a `learnings` field in `src/mock/witch.js` and `src/photo.js`, never shown) rather
  than thrown away, so they're there when the idea firms up.
- **From the tool wheel to a tool's page** (user's idea, 2026-10-09): a second button on the wheel opens
  the page of the aimed tool. Proposed: the book key itself, pressed while aiming (today it closes the
  wheel and opens the book), so no new button; nothing aimed opens the Satchel. Built in the bench to try.
