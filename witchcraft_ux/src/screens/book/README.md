# The witch's book (grey-box)

**Serves:** `flow.md` B1, D7 (user, 2026-09-29): one in-game menu for her things, **two levels, never
more**: tabs across (Q/E, LB/RB) and a category rail down the left (W/S, LT/RT). **I** opens the Satchel,
**K** opens Recipes › Spells, Esc (B) closes.

```
 Satchel      Recipes      Almanac      Keepsakes      Tools
              Cooking      Fish         Small tasks    Broom      (only the kinds she has)
              Potions      Flowers      Milestones     Fishing
              Bait         Creatures    Photos         Camera
              Spells
              Charms
```

| Tab | Source | Status |
|---|---|---|
| **Satchel** | `inventory_ui_prd` v0.1 (built in the game, read-only): portrait beside the bag, icon grid, count badge above 1, name + description on focus. Stardew / Animal Crossing reference: "calm, legible, no fiddling". **No tools** (D25): they live in Tools. Bait she has made is here | Follows the PRD |
| **Tools › Broom, Fishing, Camera, Cauldron** | D25, D30 (user, 2026-10-09); Cauldron D34 (2026-10-11). **One page design for every kind** (`WBP_ToolPage`): a line saying what's in use, then a section per part from the kind's data (`TOOL_KINDS`): Broom = brooms · trinkets; Fishing = rods · lines · bait; Camera = cameras · lenses · filters · frames; Cauldron = cauldrons · spoons (spoons proposed). **Only what she owns** (a kind she hasn't got has no page). Choosing a card puts it on, one per part; the main piece's card says **On the wheel**. **Camera filters and frames are *enabled*, several at once**, and switched in the viewfinder (D26). **Bait** comes from the satchel: the kinds she knows (Recipes › Bait) with how many she has; one she has none of jumps to its recipe. No stats anywhere: a rod is known by its name (D29). Art is the tool's icon for now | Decided (D25, D30); the page design proposed |
| **Recipes › Bait** | D31: bait recipes like the others (the cauldron); what she makes goes in her satchel. A recipe shows how many she has | Decided (D31); content speculative |
| **Recipes › Cooking, Potions** | Ideas only (campfire as a station, the cauldron). **Icon on the left** (D16): a placeholder slot until icons exist; a recipe's `icon` field takes one. Ingredient chips: solid = in the satchel, faint = known but not carried, dashed = not yet found. "Can make now" when all are carried | 🟡 Speculative |
| **Recipes › Charms** | Study → familiar: the reagents that charm each studied creature, revealed as study progresses | 🟡 Speculative |
| **Recipes › Spells** | Simplified (user, 2026-09-29): one list. **Click a spell → "Assign … to…" → press a spell button (1–5)**: it goes in that slot, replacing what was there (already on another button: the two swap, confirmed by the user). Esc cancels; while asking, slots can also be clicked (confirmed). Otherwise the bottom strip is **read-only**, showing each button and its spell. Source: `spell-grammar-and-loadout.md`: a loadout of ~4–6, "frictionless and available anywhere"; cost classes free / reagent / ritual | 🟡 Speculative (only the wisp exists) |
| **Almanac › Fish, Flowers** | Her knowledge (user, 2026-09-29, D5). Each: *name · RARITY · where*, where = the proposed location range ("Various" / a region / a specific place). Unfound: "Unknown fish". A caught/picked count, kept for now | Intended, not yet in the game design |
| **Keepsakes › Milestones layout** | D18: square cards, next tier only (variant `milestones`: cards / rows). Variant `msgoal`: the next goal as a count ("6 / 10", **decided**, D19) or a sentence ("Catch 10 fish", bar only). **Localisation:** count is simplest (fixed label + numbers); a sentence must be one `FText::Format` string per goal with a plural modifier, never assembled in code; allow ~30% longer text (wrap, don't clip) | Proposed |
| **Keepsakes › Small tasks, Milestones** | D9–D11: optional; small tasks never expire and are replaced when claimed; milestones are lifetime and tiered, fed by counts she already has. Rewards wait until she claims them (a toast confirms) | Proposed |
| **Keepsakes › Photos** | The album: photos from photo mode, tilted polaroids with handwritten captions | Proposed |
| ~~**Keepsakes › Camera kit**~~ | Moved to **Tools › Camera** (D30). D13 still holds: missing pieces say where they come from (a reward, a brew, a photo), or are hidden (variant `unowned`: does "only what she owns" reach the camera? open). Claiming a camera-piece reward adds it. In photo mode the book opens there (D27) | Moved 2026-10-09 |
| **Almanac › Creatures** | The Study → familiar idea (user, 2026-09-29): each studied animal's rarity, where it lives, how well she knows it. Its charm is under Recipes › Charms | 🟡 Speculative |

- **The world carries on** while the book is open (`flow.md` D3): time turns, weather changes.
- **Variant `book`**: `panel` (a window over the softened world) or `spread` (a full-screen open book, two
  facing pages).
- **Variant `affinity`**: show colour affinity (a dot on each slot, tinted icons, a label) or hide it.
  Whether affinity is ever visible is open: the wand's is deliberately *never* disclosed.

## Open
- Where do future things go? Wands (crafted) → a Recipes category, or a Tools kind? A map would be a
  sixth tab (D30: the only one that could be added).
- Tools: show the camera's missing pieces (with how to get them) or hide them, as for the other kinds?
  (variant `unowned`)
- Should the satchel carry a hotbar? (PRD v0.1 says out of scope.)
- Location enum naming: "Common" (as discussed) vs **Widespread** (here), to avoid clashing with rarity.
- Demo: **F** in the world catches a Mackerel first, new to her. It becomes known in Fish, and the hare's
  "Unknown fish" becomes "Mackerel" under Recipes › Charms.

## Port notes
- Portrait: `GetCharacterPortrait()` render target in the game; a screenshot crop here.
- The panel backing uses `backdrop-filter` → `SBackgroundBlur` (has a cost). Spread's paper/spine are
  textures.
- "· ready" is `::after` text → a separate text block.
- **Tools pages:** one `WBP_ToolPage` fed by a data table of kinds (a kind = its parts: main piece +
  the rest, each `one` / `many` / `optional` / from the satchel). Sections and cards are generated; nothing
  per kind but the data. The collection is a new component on the witch: the pieces she owns, the active
  one per part, and the camera's enabled filters/frames. Tools stay `UItemDefinition`s; picking one up
  routes it there instead of the inventory. The Tools rail is built from the kinds she has when the book
  opens (`book_prd` decision 5 already hides pages with nothing on them).
