# Screen flow

What screens exist and how the player moves between them. Living document: decisions are the user's and
dated; everything else is **proposed** (a starting point built in the bench) or open. See `direction.md`.

## The shape (proposed, 2026-09-29)

```
 Launch
   │
   ▼
 MAIN MENU  (the living world behind it)        Settings · Quit
   │ Continue / New game
   ▼
 ┌──────────────────────────── THE WORLD ────────────────────────────┐
 │  World HUD: as little as possible (D1), how much is a variant      │
 │    interaction prompt ("G  Pick  Birch sticks")                    │
 │    spell / tool change hint (brief)                                │
 │    zone banner on entering a named zone (built in the game)        │
 │    toasts: collected, caught (stack) · learned, milestone (banner) │
 │                                                                    │
 │  In-game UI (D2):                                                  │
 │    T    tool selector ──── pick → in her hands                     │
 │    Tab  spell selector ─── pick → active spell                     │
 │    Q/E  cycle spell directly (hint only, nothing opens)            │
 │    I/K  THE WITCH'S BOOK: Satchel · Spells · Catches               │
 │    F    fishing: bite → catch reveal (hold-up or card)             │
 │    Esc  pause: Resume · Settings · Main menu · Quit                │
 └────────────────────────────────────────────────────────────────────┘
```

🔴 **Only the pause menu pauses the world** (D3). The book, selectors and fishing reveal all run with the
world carrying on. Keys are placeholders (D4).

## Decided (user)

| # | Date | Decision |
|---|---|---|
| — | 2026-09-29 | See `direction.md` D1, D2 (in-play UI minimal but present; tools, satchel, spells need in-game UI) |
| D3 | 2026-09-29 | **The world continues while the player uses in-game UI.** There is a pause menu (exit etc.), and it is the only thing that pauses |
| D4 | 2026-09-29 | **Keyboard or joypad; placeholder keys are fine.** No 1:1 correlation needed in the prototype |
| D5 | 2026-09-29 | **The book has Fish and Flowers collections** (her knowledge): name · rarity · where |
| D6 | 2026-09-29 | **Glyphs for keyboard and gamepad**; LB/RB turn the book's pages |
| D11 | 2026-09-29 | **Keepsakes is the fourth tab**; **five tabs maximum** (D10), the fifth held for something significant |
| D12 | 2026-09-29 | **Photo mode**: viewfinder and selfie views; photos go to Keepsakes › Photos |
| D8 | 2026-09-29 | **Spells: click → "Assign to where" → press the spell button**; replaces what was there. 1–5 are the spell buttons in the world too |
| D7 | 2026-09-29 | **Book = Satchel · Recipes · Almanac**, each with a category rail where needed. Two levels, never three |

## Proposed (built in the bench, not decided)

| # | Proposal |
|---|---|
| M1 | Main menu is basic (Continue / New / Settings / Quit) over the living world, like Null Point's F1 |
| W1 | The game launches straight into the world; onboarding is in-world tips ("I  Your satchel") |
| B1 | One in-game menu, **the witch's book** (D7). I opens the Satchel; K opens Recipes › Spells, so the loadout stays one press away. LB/RB (Q/E) change tab, LT/RT (W/S) change category |
| K1 | Keepsakes = Small tasks (a handful, never expire, replaced when claimed) · Milestones (lifetime, tiered, fed by existing counts) · Photos (the album) · Camera kit. Rewards wait until claimed |
| P2 | **P** lifts the camera. Filters, frames with a handwritten caption, hide UI; only kit pieces she owns are offered |
| I1 | Input glyphs come from one table (`src/input.js`); the prompt follows the last device used (CommonUI-style). The gamepad mapping there is a first guess |
| S1 | Tools and spells each get a **quick selector** (wheel or bar) that opens in play, picks, and closes |
| S2 | Q/E cycle spells without opening anything; the loadout shows as a strip for ~2 s |
| P1 | Esc opens the pause menu anywhere (Resume, Settings, Main menu, Quit); the one thing that pauses (D3) |

## Screen inventory

| Screen | Status | Notes |
|---|---|---|
| Main menu | Grey-box | Variant: which shot (golden cliff, night, golden path) |
| World HUD | Grey-box | Variant `hud`: quiet / contextual / always-on |
| Zone banner | Grey-box (rules are the game's) | Variant: with or without the map name |
| Tool selector | Grey-box | Variant `selector`: radial / bar |
| Spell selector | Grey-box, speculative content | Loadout from `spell-grammar-and-loadout.md` |
| Book: Satchel | Grey-box, follows `inventory_ui_prd` v0.1 | Portrait + grid + detail |
| Book: Recipes › Cooking | Grey-box, speculative | No cooking design yet; the campfire as a station is an idea |
| Book: Recipes › Potions | Grey-box, speculative | The cauldron; brewing is ideas only (todo 27: a failed brew) |
| Book: Recipes › Spells | Grey-box, speculative | Loadout slots + spellbook; cost classes |
| Book: Recipes › Charms | Grey-box, speculative | Study → familiar: the reagents that charm each studied creature |
| Book: Almanac › Fish | Grey-box, intended (D5) | *Perch · COMMON · Various*; unfound = "Unknown fish"; count kept for now |
| Book: Almanac › Flowers | Grey-box, intended (D5) | Same shape as Fish |
| Book: Almanac › Creatures | Grey-box, speculative | What she knows of each studied animal: rarity, where, how well studied |
| Fishing: bite + catch | Grey-box | Variants: bite mark / none; hold-up / card |
| Pause | Grey-box | |
| Settings | Grey-box; Camera tab real | Camera PRD stage G (todo 8); other tabs placeholder |
| Quit confirm | Grey-box | |
| Dialogue (villagers) | Grey-box (D15) | Panel (AC-style) or bubble; typed text with a babble stand-in; replies. G on a "Talk" prompt |
| Screen transitions | Needed | AC:NH-style shape wipe (broom silhouette, cauldron…), `todo_prd.md` |
| Photo mode | Grey-box, speculative (D12) | Viewfinder + selfie; filters, frames; poses for the future (D14) |
| Study progress ("Aha!") | Grey-box (D17) | Moment or card; reveals a charm reagent. N in the world |
| Book: Keepsakes | Grey-box (D11) | Small tasks · Milestones · Photos · Camera kit (D13) |
| Broom | Open | Mounting is item-driven from the inventory; no fuel, no stats. Race timer + ghost (design only) |
| Wand crafting | Open | Ideas only (`wand.md`); could be a Recipes category |
| Map | Open | No map is designed. "The limiter is the map, not a meter" (broom) |
| Familiar | Open | Binding, personality, "speaks to the player" → dialogue |
| Recurring events | Open | "Whether anything announces it, and how loudly" |

## Open questions

- Spell buttons on gamepad: hold LB + a face button (a guess in `src/input.js`)?

- Hold-to-open / release-to-pick for selectors (gamepad-natural) vs toggle?
- One book or separate screens? Which future tabs (wands, recipes, photos, map)?
- The interaction prompt's position and content.
- How loud are milestone banners in a game this quiet?
