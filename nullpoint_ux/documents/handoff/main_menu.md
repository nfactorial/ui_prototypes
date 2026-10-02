# Handoff: main menu

**Tag:** `ui-handoff-core` · **Decided:** 2026-10-02 · **Look:** `style_set.md`
**Source:** `src/screens/main_menu/` (`index.js`, `style.css`, `README.md`) · **Serves:** `../flow.md` F1, F2
**Scene:** *Flow — from main menu* · **Screenshot:** `img/main_menu.jpg` (background shown is the flyby, not part of this handoff)

A basic menu (Continue / New game / Settings / Quit) at the bottom left, over a live 3D scene. The game
launches straight into the world from here (F2): there is no hub screen.

🔴 **Out of scope: the background.** It's a 3D menu level behind the widget, and whether it's a tumbling
derelict or the flyby sequence is still open. This spec covers the widget only, which must sit over
whatever the level renders.

## Layout

```
WBP_MainMenu                              SOverlay, full screen
├─ Vignette                               fill. SLATE: material (see Port costs)
└─ Menu                                   SVerticalBox, slot: left, bottom; padding L 140, B 120
   ├─ "NULL POINT"                        Display
   ├─ "Working title"                     Label; padding T 12, B 48, L 4
   └─ Buttons                             SVerticalBox, 10 between buttons
      ├─ Continue                         ButtonBig, PRIMARY, default focus, rich tooltip
      ├─ New game                         ButtonBig
      ├─ Settings                         ButtonBig
      └─ Quit                             ButtonBig
```

- Buttons are **big** (`style_set.md`): padding 18 × 28, min width 340, label centred. All the same width.
- The title is a placeholder (*Null Point* is the working title); the `Working title` label goes when
  there's a real one.
- At 21:9 the menu stays anchored bottom-left; the extra width goes to the background.

## Behaviour

| Control | Does |
|---|---|
| **Continue** | Loads the last save, straight into the world. Its tooltip shows the save (below) |
| **New game** | Starts a new game, straight into the world |
| **Settings** | Opens Settings (a stub: content not designed) |
| **Quit** | Opens the confirm dialog (`pause_and_confirm.md`) |
| **Esc** | Nothing on the main menu itself; it closes Settings or the dialog if open |

- **Focus** starts on Continue. Up/down move between buttons; hover moves focus too.
- 🔧 **No save yet:** the prototype always has one. Without a save, hide Continue and make New game
  primary and default-focused (not prototyped).

### Continue's tooltip: the save summary

A rich tooltip (`tooltips.md`) built from the save:

| Part | Example | Data |
|---|---|---|
| Meta | `Last save` | fixed |
| Title | `The Kestrel` | the player's ship name |
| Body | `Docked, Harrow system. Recovery contract active.` | where, and the active mission |
| Stats | `Saved: 2 hours ago` · `Played: 4 h 12 m` | save time (relative), play time |

## Data

| Field | Type | Source |
|---|---|---|
| `HasSave` | bool | the save system |
| `SaveShipName`, `SaveLocation`, `SaveActivity` | text | the latest save's header |
| `SaveTime` | timestamp | shown relative ("2 hours ago") |
| `PlayTime` | duration | shown `4 h 12 m` |

## Motion

| Animation | Target | Tracks |
|---|---|---|
| `MenuIn` (delay **0.8 s**) | Menu | opacity `[0 → 0, quadOut] [0.6 → 1]` · translate `[0 → (−20, 0), cubicOut] [0.8 → (0, 0)]` |

The delay lets the background establish first. Nothing animates on the way out (the world loads).

## Port costs

| What | Suggestion |
|---|---|
| **Vignette**: a left-to-right darkening (black 0.75 at the left edge → 0.2 at 45 % → none at 70 %) plus a radial darkening at the edges (centre 60 % / 45 %, clear to 40 %, black 0.7 at the rim) so the menu reads over a bright scene | A UI material, or bake it into the menu level's post-process. Keep it whatever the background becomes |
| Focus ring + glow | `style_set.md` |
