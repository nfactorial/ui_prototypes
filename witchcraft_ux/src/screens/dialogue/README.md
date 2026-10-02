# Dialogue (grey-box, speculative content)

**Serves:** user, 2026-09-29: talking to other characters, **leaning Animal Crossing**, with **animalese**
audio planned. The game's `documents/design/characters/villagers.md` already sets the audio rules: babble
per typed character, driven by the dialogue widget, rising/falling intonation, a hard cap on babble length.
The voice bank script is `documents/content-creation/villager_voice_bank.md`.

In the world, **G** on a "Talk" prompt starts a conversation (or use the *talking to Hazel* scene).

- **Variant `speech`:** `panel` (a wide panel low on screen, tilted name tag in the villager's colour) or
  `bubble` (a speech bubble above where the speaker stands).
- Text **types out** (~34 characters/second) with a **beat after punctuation**; *key words* are
  highlighted in the speaker's colour. Enter/Space/G (or a click) finishes the line, then moves on. A
  bouncing glyph means "more".
- **Replies** are buttons: stacked on the right (panel) or near the witch (bubble).
- **Variant `babble`:** a synthesised stand-in, one blip per typed letter at the speaker's own pitch,
  rising into a "?" and dipping into a "."; silent after 40 letters a line (`src/babble.js`). Judge the
  **rhythm**, not the sound.
- No friendship meter: friendliness "must never change what the player can do" (`villagers.md`).
- The world carries on (D3); the world HUD steps aside.

## Open
- Panel or bubble? (Or bubble for passing remarks, panel for real conversations?)
- Does the camera frame the conversation (AC:NH zooms in), or stay put?
- Does the witch speak (voiced replies), or only choose?
- The familiar "speaks to the player" (`familiars/overview.md`): the same widget, or something smaller?

## Port notes
- One widget: a box with a name tag, a rich text block revealed character by character, a "next" glyph
  (CommonUI action widget), and a reply list (CommonUI buttons). Typing is a ticked reveal count; each
  revealed letter fires the babble event (the game's audio side picks the syllable).
- Bubble: positioned each frame from the NPC's head socket (project to screen); the tail is part of a
  9-slice bubble texture.
