# Handoff: pause menu and confirm dialog

**Tag:** `ui-handoff-core` · **Decided:** 2026-10-02 · **Look:** `style_set.md`
**Source:** `src/screens/pause_menu/`, `src/screens/quit_confirm/`, `src/flows/game_flow.js` · **Serves:** `../flow.md` F8, F9
**Scene:** *Flow — paused* · **Screenshots:** `img/pause_menu.jpg`, `img/quit_confirm.jpg`

## Pause / system menu

Esc opens it **anywhere in the game**, including on a derelict, where the computer isn't available (F9).
The world is paused while it's open (F8).

### Layout

```
WBP_PauseMenu                         layer: game menu, above the HUD
├─ Scrim                              fill, brush Scrim + background blur 6. SLATE: SBackgroundBlur
└─ Panel                              SVerticalBox, centred, width 420, 10 between children
   ├─ "Paused"                        Title, centred; padding B 20
   ├─ Resume                          ButtonBig, PRIMARY, default focus
   ├─ Settings                        ButtonBig
   ├─ Main menu                       ButtonBig
   └─ Quit to desktop                 ButtonBig
```

Buttons fill the 420 width (no min width here).

### Behaviour

| Input | Does |
|---|---|
| **Resume** or **Esc** | Closes the menu; the world resumes |
| **Settings** | Opens Settings over the pause menu; Esc returns here |
| **Main menu** | Leaves to the main menu |
| **Quit to desktop** | Opens the confirm dialog |

**Esc is "back"** throughout: it closes the topmost of confirm dialog → Settings → pause menu, in that order.

### Motion

| Animation | Target | Tracks |
|---|---|---|
| `ScrimIn` | Scrim | opacity `[0 → 0, linear] [0.15 → 1]` |
| `PanelIn` | Panel | opacity `[0 → 0, quadOut] [0.2 → 1]` · translate `[0 → (0, 16), cubicOut] [0.25 → (0, 0)]` |

Animations run on **UI time**: they play while the world is paused.

## Confirm dialog (reusable)

The standard confirm pattern. Its first use is **Quit to desktop?**, from both the main menu and pause.
Build it once and reuse it.

### Layout

```
WBP_ConfirmDialog                     layer: modal, above everything but notifications
├─ Scrim                              fill, brush Scrim (no blur)
└─ SBox                               centred, width 560
   └─ Panel                           brush PanelSolid; padding 32 × 36
      └─ SVerticalBox                 24 between children
         ├─ Title                     H2            "Quit to desktop?"
         ├─ Body                      Body, Dim, wraps   "Progress since your last save will be lost."
         └─ SHorizontalBox            right-aligned, 12 between
            ├─ Cancel                 Button, default focus
            └─ Confirm                Button, PRIMARY   "Quit"
```

- 🔴 **The panel is opaque** (`PanelSolid`). A translucent panel let the pause menu's buttons read through
  the text (fixed 2026-10-02).
- **Parameters:** title, body, confirm label, cancel label (default "Cancel").

### Behaviour

- **Focus starts on Cancel**, the safe choice. **Esc cancels.**
- Confirm runs the action (quit); Cancel closes the dialog and focus returns to whatever opened it.
- No intro animation in the prototype: it appears at once.

## Open, not blocking

- ⚠️ **The primary (bright white) button is Quit, but focus starts on Cancel.** The eye goes to the
  dangerous choice. Options: make Cancel the primary, or give destructive confirms their own style
  (`Bad` colour). Decide before the dialog gets a second use.
- **Main menu from pause has no confirm**, though it loses unsaved progress just like Quit does. Probably
  should use the same dialog.
