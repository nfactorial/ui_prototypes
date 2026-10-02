# The witch's book (grey-box)

**Serves:** `flow.md` B1, D7 (user, 2026-09-29): one in-game menu for her things, **two levels, never
more**: tabs across (Q/E, LB/RB) and a category rail down the left (W/S, LT/RT). **I** opens the Satchel,
**K** opens Recipes › Spells, Esc (B) closes.

```
 Satchel      Recipes      Almanac
              Cooking      Fish
              Potions      Flowers
              Spells       Creatures
              Charms
```

| Tab | Source | Status |
|---|---|---|
| **Satchel** | `inventory_ui_prd` v0.1 (built in the game, read-only): portrait beside the bag, icon grid, count badge above 1, name + description on focus. Stardew / Animal Crossing reference: "calm, legible, no fiddling" | Follows the PRD; clicking a tool puts it in her hands (new) |
| **Recipes › Cooking, Potions** | Ideas only (campfire as a station, the cauldron). **Icon on the left** (D16): a placeholder slot until icons exist; a recipe's `icon` field takes one. Ingredient chips: solid = in the satchel, faint = known but not carried, dashed = not yet found. "Can make now" when all are carried | 🟡 Speculative |
| **Recipes › Charms** | Study → familiar: the reagents that charm each studied creature, revealed as study progresses | 🟡 Speculative |
| **Recipes › Spells** | Simplified (user, 2026-09-29): one list. **Click a spell → "Assign … to…" → press a spell button (1–5)**: it goes in that slot, replacing what was there (already on another button: the two swap, confirmed by the user). Esc cancels; while asking, slots can also be clicked (confirmed). Otherwise the bottom strip is **read-only**, showing each button and its spell. Source: `spell-grammar-and-loadout.md`: a loadout of ~4–6, "frictionless and available anywhere"; cost classes free / reagent / ritual | 🟡 Speculative (only the wisp exists) |
| **Almanac › Fish, Flowers** | Her knowledge (user, 2026-09-29, D5). Each: *name · RARITY · where*, where = the proposed location range ("Various" / a region / a specific place). Unfound: "Unknown fish". A caught/picked count, kept for now | Intended, not yet in the game design |
| **Keepsakes › Milestones layout** | D18: square cards, next tier only (variant `milestones`: cards / rows). Variant `msgoal`: the next goal as a count ("6 / 10", **decided**, D19) or a sentence ("Catch 10 fish", bar only). **Localisation:** count is simplest (fixed label + numbers); a sentence must be one `FText::Format` string per goal with a plural modifier, never assembled in code; allow ~30% longer text (wrap, don't clip) | Proposed |
| **Keepsakes › Small tasks, Milestones** | D9–D11: optional; small tasks never expire and are replaced when claimed; milestones are lifetime and tiered, fed by counts she already has. Rewards wait until she claims them (a toast confirms) | Proposed |
| **Keepsakes › Photos** | The album: photos from photo mode, tilted polaroids with handwritten captions | Proposed |
| **Keepsakes › Camera kit** | D13 (user's idea): the filters and frames she owns; missing ones say where they come from (a reward, a brew, found in the world). Claiming a camera-piece reward adds it | Proposed |
| **Almanac › Creatures** | The Study → familiar idea (user, 2026-09-29): each studied animal's rarity, where it lives, how well she knows it. Its charm is under Recipes › Charms | 🟡 Speculative |

- **The world carries on** while the book is open (`flow.md` D3): time turns, weather changes.
- **Variant `book`**: `panel` (a window over the softened world) or `spread` (a full-screen open book, two
  facing pages).
- **Variant `affinity`**: show colour affinity (a dot on each slot, tinted icons, a label) or hide it.
  Whether affinity is ever visible is open: the wand's is deliberately *never* disclosed.

## Open
- Where do future things go? Wands (crafted) → a Recipes category? Photos (album), a map → new tabs?
- Should the satchel carry a hotbar? (PRD v0.1 says out of scope.)
- Location enum naming: "Common" (as discussed) vs **Widespread** (here), to avoid clashing with rarity.
- Demo: **F** in the world catches a Mackerel first, new to her. It becomes known in Fish, and the hare's
  "Unknown fish" becomes "Mackerel" under Recipes › Charms.

## Port notes
- Portrait: `GetCharacterPortrait()` render target in the game; a screenshot crop here.
- The panel backing uses `backdrop-filter` → `SBackgroundBlur` (has a cost). Spread's paper/spine are
  textures.
- "· ready" is `::after` text → a separate text block.
