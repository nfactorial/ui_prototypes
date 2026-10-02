# Boarding HUD

**Serves:** the FPS demonstration (`pillars.md` §3, §5). Density: **minimal** (`direction.md`, *Density by
context*). Driven in the harness by the **combat lab** panel.

## Shield and health (user, 2026-09-28)

The main information for the player. Rules in `src/mock/vitals_model.js` (pure logic, ports directly):
- Damage hits the **shield** first; overflow comes off **health**.
- The shield **recharges** after a few seconds without damage (delay tunable in the lab: 1.5 / 3 / 5 s).
- Health doesn't regenerate (med kits heal).
- Health at or below a threshold (15 / 25 / 35%) → **danger mode**: the health bar flashes red, the screen
  edge pulses red, and an optional warning beep plays. Health 0 → death ("Suit failure").

Feedback: a hit flashes the bar it struck; the **lost chunk lingers** (a light trail) for a moment before
draining, so the size of the hit reads. Health damage also flashes the screen edge and nudges the widget.
States are labelled only when they matter: SHIELD RECHARGING, SHIELD DOWN, HEALTH CRITICAL.

## Variants (harness toolbar)
- **Vitals:** corner bars · top centre · bottom centre (centred bars drain from both ends, Halo-style) ·
  arcs round the crosshair.
- **Show vitals:** always, or *only when relevant*: they fade out when the shield is full, health is fine
  and nothing has hit you for 3 s, and snap back on the next hit.

## Open
- Which layout; whether contextual hiding suits the horror register (it hides the most).
- Diegetic alternatives (suit readout on a wrist, visor edge).
- Does health show a number?

## Port notes
- Bars: `SProgressBar` or two `SBox`es; the trail is a second bar lerping behind in Tick (or a UMG anim).
- Segment ticks, the recharge sheen and screen-edge vignettes are textures / UI materials.
- Arcs: a radial-progress UI material per arc (or custom `OnPaint`).
- The danger beep is a placeholder for a real audio cue.
