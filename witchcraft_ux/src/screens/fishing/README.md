# Fishing: bite and catch (grey-box)

**Serves:** `fishing_prd` v0.9 (built): cast → wait → bite → timed reaction press → *"You caught X!"* or
*"It got away."* The game shows the result only as a debug message today. The design wants **minimal UI**
and **no "you can fish here" prompt**; a reel-tension bar was rejected.

In the flow, **F** plays a bite and a catch (every fourth one gets away). A caught fish also raises a
**Caught** stack toast.

- **Variant `bite`**: a "!" over the bobber, or nothing (the bobber and the sound carry it, as designed).
- **Variant `catch`**:
  - `holdup`: Animal Crossing's hold-up (`cinematic_sequences.md` §3.1): letterbox, "You caught a …",
    the name large, its rarity. Waits for a button. The 3D hold-up pose is the game's side.
  - `card`: a small card low-right that fades by itself; play carries on.
- "First catch!" appears on a fish's first catch.

## Open
- Does every catch get the hold-up, or only the first of each kind (then the card)?
- Rarity: shown as a word and colour here. Does naming rarity fit "different, not better"?
- Letterboxing is an open question in the game's `todo_prd.md` too.

## Port notes
- The hold-up is a cinematic (CinematicFramework) with a UMG overlay; letterbox bars are two scaled borders.
- Data comes from `FFishCatchEntry` (`DisplayName`, `EFishRarity`) via `Event.Fishing.FishCaught`.
