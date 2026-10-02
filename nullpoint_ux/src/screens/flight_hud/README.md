# Flight HUD

**Serves:** the flight demonstration (`pillars.md` §1, §5); the HUD burden in `space/18`.

⚠️ **Skeleton example, not a design.** The layout, the fields and the look are all placeholders to show
the framework working. Expect to throw most of it away.

## What's on it

| Region | Widget | Notes |
|---|---|---|
| Whole screen | `SNpContactLayer` | World markers + off-screen pips. Same glyph and colour on both sides of the edge; shape encodes faction (diamond derelict · triangle hostile · square neutral · circle body) |
| Top-left | `SNpRatingReadout` | The **reference rating** (`nullpoint.md` A1.0) with the 10→0 ladder, and the policy floor (A1.0e). Flags **"below policy · cover void"** when the rating drops under the floor |
| Bottom-left | `SNpShipStatus` | Hull / power / heat bars |
| Bottom-right | `SNpNavReadout` | Target, range, closing speed, own speed |
| Centre | reticle | |

## Open questions

- Does the rating belong on the HUD at all, or on a diegetic cockpit instrument? (`space/18` §8)
- 🔴 A1.0d: the rating **must not** predict what's aboard a wreck. Keep it presented as a navigation/insurance
  instrument, never as a danger meter.
- Off-screen pips can land on the instrument panels. Inset them per edge, or let panels push them?
- No orientation reference yet (`space/18` §5), and no velocity vector (§6).

## Port notes

- **Contact layer:** an `SConstraintCanvas` works but costs a layer per child (`ui/04` §2). With many
  contacts, a single custom widget with `OnPaint` (`ui/19` §5) is probably the right answer. The positioning
  maths is `src/core/hud_math.js` → `placeContact`, already DOM-free.
- **Ladder:** 11 `SBox`es with a colour brush; or one custom-painted widget.
- **"Cover void" blink:** a looping UMG animation on RenderOpacity.
- **Panel brush** `brush-chamfer` is a 9-slice (`FSlateBoxBrush`, margin 0.25) from
  `assets/brushes/panel_chamfer.svg` → export to PNG.
