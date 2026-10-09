# A new tool (grey-box)

**Serves:** `direction.md` D28 (user, 2026-10-09): the first tool of each kind is made active for her and
announced, *"You received a new tool! **BROOM**"*. With D25 her tools live in a collection (the book's
Tools tab), and the kinds she hasn't met stay unknown (a leaning), so the moment is the reward.

**J** in the world gives her the next tool (a bench demo; `GIFTS` in `src/mock/witch.js`). The scene
*Flow — a new tool* starts her without a broom and gives it after a moment.

| | |
|---|---|
| **First of a kind** | "You received a new tool!" · the kind, big and upper case (BROOM) · the piece's name (Old Faithful) · "It's on your tool wheel, and in your hands". It's made active, goes to her hands and takes its place on the wheel |
| **A later piece** | A second broom, a new line: "A new broom!" · its name · "In your book: Tools › Broom". It isn't made active: she chooses it on the page. 🟡 Proposed: D28 only covers the first of a kind |
| **Shape** | The fish catch's hold-up (`fishing/`): letterbox, big name, a press to carry on. In the game she holds it up (a short cinematic) |
| **Dismiss** | Enter / A, or the button. Esc too |

- The world HUD steps aside while it's up. The world carries on (D3).

## Open
- What a later piece's moment says, and whether it gets the hold-up or something quieter (a toast).
- Picking up a later piece: into her hands (the old `tools.md` rule) or only to its page (here)?

## Port notes
- Letterbox bars: two `SBorder`s scaled in Y (a widget animation). The upper-case kind is
  `STextBlock` with `TextTransformPolicy::ToUpper`, so the source text stays "Broom" for localisation.
- Motion: `NewToolLetterbox`, `NewToolIn`, `NewToolOut` in `index.js` (`defineAnimation`), the catch's
  timings.
