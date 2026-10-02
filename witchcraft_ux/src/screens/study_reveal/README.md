# Study: something learned (grey-box, speculative)

**Serves:** user, 2026-09-29: when she makes progress studying an animal, a moment like the fish catch
("Aha! You learned something new"). Part of the Study → familiar idea (Almanac › Creatures, Recipes ›
Charms).

In the world, **N** (demo) studies the next animal with something left to learn; the *studied an
animal* scene opens on it.

- **One pip per charm ingredient** (user, 2026-10-01): each study step reveals one ingredient, so a
  one-ingredient charm has one pip and a five-ingredient charm five. Mock: hedgehog 1, heron and hare 3, owl 5.
- **"Aha!"** in her handwriting (Caveat), the creature's name, and its **study meter**: the new pip
  fills with a small pop.
- **What she learned:** the charm reagent this step revealed, as the same chip as the book. If she
  hasn't found it yet it reads **"Unknown flower"** / **"Unknown fish"** with *"You haven't found this
  yet"*: the nudge to go looking.
- **On the last step:** *"You know how to charm the … now"* and where to find it (Recipes › Charms).
- **Variant `insight`:** `moment` (centred, waits for a press, like the catch hold-up) or `card`
  (smaller, top-right, fades by itself; play carries on).
- The world carries on (D3); the world HUD steps aside while it's up.

## Open
- Moment or card? Perhaps card for a step, moment for the completion?
- How does studying *feel* in play (watching from nearby for a while, a spell, sketching)? The reveal
  is the payoff; the act of study isn't designed.
- Does a completion also deserve a banner toast, or is this moment enough? (Banners are for must-know
  progress only.)

## Port notes
- One WBP: text, a pip meter with **one pip per charm ingredient** (W14-like; 1 to 5 or so), the ingredient chip (W7), a button (W2). The pip glow and the
  soft shade behind are optional textures.
- Driven by a study-progress event carrying the creature and the reagent revealed.
