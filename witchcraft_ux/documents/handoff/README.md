# Handoffs: inputs to the game's planning

A handoff describes a **decided** piece of UI, at a fixed commit (a git tag), in Slate terms. The game's
plan phase works from these, never from the raw HTML/CSS: the bench can't tell harness from design, and it
keeps moving. The game's PRDs describe the implementation in their own terms and record the tag they were
planned from (`../../../UI_BENCH.md`, *The path to Unreal*).

| Handoff | What | Tag |
|---|---|---|
| [`interaction_prompt.md`](interaction_prompt.md) | The interaction prompt: `[G]  Pick  Birch sticks` | None: the file names `ui-handoff-interaction-prompt`, which was never made in this repo |
| [`tool_wheel.md`](tool_wheel.md) | The tool wheel as a pentacle: places, Hands free in the centre, the carved disc and its glow. Changes to the wheel already built (`tool_wheel_prd.md` 0.2.5) | `ui-handoff-tool-wheel` |

Everything else in the bench is still being designed: see `../direction.md` (decided and open) and each
screen's `README.md`.
