# World HUD (grey-box)

**Serves:** `direction.md` D1 (user, 2026-09-29): *as little UI as possible while playing, but not
nothing, and nothing final.* How much is a **variant**, so it can be judged rather than argued:

| `hud` | Shows |
|---|---|
| `quiet` | Interaction prompt; a brief hint when the spell or tool changes |
| `contextual` | quiet + a time/weather card on arrival and when the day phase turns |
| `present` | A small always-on corner (tool + spell chips) and time/weather top-right |

Zone banners, toasts and the quick selectors are separate screens and appear in every mode.

- **Interaction prompt**: key + the game's verb (`GetInteractionPrompt`: Pick, Talk, Pet, Pick Up) + a
  target name. The mock cycles what she's near every ~3 s.
- **Spell change (Q/E)**: the loadout as a strip of pips, active one lit, gone after ~2 s, so the order
  is learned without opening anything.
- **Tool change**: the tool's name, briefly.
- **Onboarding tip**: "I  Your satchel" until the satchel has been opened once.

## Open
- Prompt position: low centre (here), or world-projected beside the thing (Animal Crossing)?
- ~~Target name in the prompt?~~ **Yes** (user, 2026-09-29): `GetInteractionPrompt` will be reshaped to
  return verb + target (`documents/handoff/interaction_prompt.md` §1a).
- Magnitude has no HUD in the game design (her posture is the readout). Not touched here.
- Keys are placeholders (keyboard or joypad in the game; no 1:1 needed, `flow.md` D4). On gamepad,
  cycling spells would likely be the shoulders.

## Port notes
- `ts-world` blurred text shadow: a material, or two offset shadows. Pip glow: texture.
- The strip is a horizontal box of the loadout; the active pip is a size + colour state.
