# Handoff: interaction prompt

**What:** the on-screen prompt when the witch can interact with something: `[G]  Pick  Birch sticks`.
**Why first:** the smallest piece that exercises the whole translation (style values, a world-text
style, an input glyph, a fade, a data binding). It is the first test of bench → Unreal (user, 2026-09-29).
**Bench reference:** screen `world_hud` (the prompt part), scene *Flow — in the world*
(`http://localhost:5320/#scene=flow-world`). The mock cycles what she's near every ~3 s.
**Design source:** `direction.md` D1 (as little UI as possible while playing, but not nothing).

> Build this from this document, not from the bench's HTML/CSS. Values are in Slate units at a
> 1920×1080 reference (1 CSS px ≈ 1 Slate unit; font sizes are converted).

## 1. What the game already has

| | Where | Use |
|---|---|---|
| Prompt text | `ICozyInteractable::GetInteractionPrompt(Interactor)` → `FText` today | **To be changed** (user, 2026-09-29: it had no use-case yet, so it can be shaped for this). See §1a |
| Can interact | `ICozyInteractable::CanInteract(Interactor)` | False = no prompt |
| Focus | `UCozyInteractorComponent::OnFocusedInteractableChanged(OldFocus, NewFocus)`, and `GetFocusedInteractable()` | Fires when focus moves (refresh rate `FocusRefreshHz`, default 5). Either side may be null |
| Input | `IA_Interact` (keyboard G, gamepad X per `controls.md`: "final placement to be decided") | The glyph shows its key |
| Spec | `Plugins/CozyFramework/Documentation/interactable_prd.md` | Rendering the prompt was left out of scope there; this is that layer |

### 1a. The prompt, reshaped (proposal for the game's `interactable_prd.md`)

The UI shows two parts in two styles, so the interactable should return them separately rather than
one pre-joined string. Suggested: `GetInteractionPrompt` returns a small struct instead of an `FText`:

| Field | Type | Example | Notes |
|---|---|---|---|
| Verb | FText | "Pick", "Talk", "Pet", "Pick Up" | Required. Empty = no prompt |
| Target | FText | "Birch sticks", "Hazel", "A grey cat" | Optional. Empty = the verb alone |

- One call, one consistent snapshot; it can grow without another interface change. The PRD already
  imagines context-sensitive prompts ("Pick (need basket)"): that would be a third, optional field (a
  short reason, shown dimmed), not a change to the verb.
- Collectibles could default Target to their item's `DisplayName` (`UItemDefinition`), so most things
  get a name for free.
- This is a change of *approach* for the interactable contract: it belongs in the game repo's PRD
  (version bump), not here. This section is the UI's request.

## 2. Behaviour

- **Show** when there is a focused interactable, `CanInteract` is true, and its prompt text is not
  empty. Otherwise hidden.
- **Focus changes to another interactable while showing:** replace the text and play the fade-in again
  (stop any fade-out first).
- **Focus lost:** play the fade-out; when it ends the widget is Collapsed.
- **Text re-read** on each focus change (not per frame). If prompts ever become context-sensitive
  while focused ("Pick" → "Pick (need basket)"), re-read on the same timer as focus.
- **Hidden while a menu is up** (book, quick selectors, pause, photo mode, dialogue): the world carries
  on (D3), but the prompt steps aside. Simplest: the HUD layer hides it while any game-menu widget is
  active.
- **The world never pauses for it.**
- **Glyph follows the last input device** (keyboard key vs gamepad button).

## 3. Layout

```
 WBP_InteractPrompt  (HitTestInvisible)
 └─ SOverlay / CanvasPanel slot: anchor bottom-centre, alignment (0.5, 1.0), offset (0, -198)
    └─ SHorizontalBox  (children Auto, vertically centred, 12 between)
       ├─ Input glyph  34 × 34  (§5)
       ├─ STextBlock   Verb    (§4, "Verb")
       └─ STextBlock   Target  (§4, "Target"; Collapsed when empty)
```

- 198 = 150 from the HUD's content edge + 48 HUD padding. It sits low-centre, clear of the witch's feet
  in the third-person framing.
- No panel behind it: world text with a shadow (D1: as little as possible).
- Verb and target sit side by side, 12 apart, baselines aligned: "**Pick**  Birch sticks". No separator.

## 4. Style values

| Part | Value | Slate / UMG |
|---|---|---|
| **Verb** font | Nunito **Bold 700** | Font face: Nunito Bold (static `.ttf`) |
| Verb size | 26 px | **Size 19.5** (px × 0.75; check one in-engine) |
| **Target** font | Nunito **Regular 400** | |
| Target size | 22 px | **Size 16.5** |
| Colour (both) | `FFFAF0FF`; target at 85% (`FFFAF0D9`) | Hex sRGB; `FLinearColor(1.0000, 0.9560, 0.8714, 1.00 / 0.85)` |
| Shadow (both) | offset (0, 1), `000000BF` | Shadow offset (0,1), shadow colour `FLinearColor(0,0,0,0.75)` |
| Soft glow round the text | 14 px blur, black 35% | **Optional.** A material or drop it; the offset shadow carries it on bright sky (check on `rocky-hill` / `meadow-sea` shots) |

## 5. The input glyph

| | Keyboard | Gamepad |
|---|---|---|
| Shape | 34 × 34 min (grows with text), radius 9 | 34 × 34 circle |
| Fill | `FFFAF0EB` (0.92 alpha) | `28221CE6` (0.90), ring 1.5 `FFFAF080` |
| Text | "G", Nunito ExtraBold 800, 16 px → **12**, `2A1F18FF` | "X", same font, `6AB0F0FF` (the X button's blue) |
| Drop edge | 2 px below, black 35% | same |

- **With CommonUI:** a `CommonActionWidget` bound to `IA_Interact` does the device switching; give it
  these two looks via its icon/brush data.
- **Without CommonUI (quickest test):** an `SBorder` with a rounded-box brush + a text block, and a
  switch on the current input device. The 2 px drop edge is a second, darker border offset by 2 (or
  leave it out).

## 6. Motion (UMG widget animations)

| Animation | Track | Keys | Interp |
|---|---|---|---|
| **PromptIn** (0.3 s) | Render opacity | 0.00 → 0, 0.25 → 1 | Quad out |
| | Render translation Y | 0.00 → +8, 0.30 → 0 | Cubic out |
| **PromptOut** (0.4 s) | Render opacity | 0.00 → 1, 0.40 → 0 | Quad in |

Play PromptIn on show / on a new target; PromptOut on focus lost, then Collapse on finish.

## 7. Data (what the widget needs)

A tiny view model (or a few properties the HUD sets):

| Field | Type | From |
|---|---|---|
| `bHasPrompt` | bool | focused && CanInteract && !Verb.IsEmpty() |
| `Verb` | FText | the focused actor's prompt (§1a) |
| `Target` | FText | the same; empty → the target text is Collapsed |

Updated on `OnFocusedInteractableChanged`. The widget never polls the world itself.

## 8. Done when

- Walking up to a stick bundle shows `[G] Pick  Birch sticks`, fading up in ~¼ s; walking away fades it out.
- Something with no target shows the verb alone, with no gap left behind.
- Moving straight from one interactable to another swaps the text with a fresh fade-in.
- It reads on the brightest shot (sunlit sky / grass) and at night.
- Switching to a gamepad changes G to the blue X.
- Opening the satchel hides it; closing brings it back.

## Port costs

Only the optional soft glow (material). Everything else is a brush, a font and a colour.

## Reference

- Bench scene: *Flow — in the world* (and *at night*, *bright meadow* for contrast).
- Values: `documents/build_list.md` §4 (generated by `tools/colours.py`).
- Git tag: **`ui-handoff-interaction-prompt`** (https://github.com/nfactorial/witchcraft_ux). Build
  against that tag; the bench's `main` keeps moving.
