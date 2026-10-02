# Handoff: toasts (notifications)

**Tag:** `ui-handoff-core` · **Decided:** 2026-10-02 · **Look:** `style_set.md`
**Source:** `src/core/notify.js` (kinds, queueing, motion), `styles/feedback.css` (`nt-*`)
**Scene:** *Components — toasts & tooltips* (buttons fire each kind, plus a burst) · **Screenshot:** `img/toasts.jpg`

The game telling the player something happened. Not a screen: a **global service** any system can call,
drawing into the top layer above everything, never taking input.

```
Toast(kind, title, body?)          // label, icon and duration come from the kind; any can be overridden
```

## Kinds

A kind picks a **presentation** and its defaults.

| Kind | Presentation | Label | Icon | Duration (s) | Colour |
|---|---|---|---|---|---|
| `acquired` | stack | Acquired | `crate` | 4 | Good |
| `log` | stack | Log recovered | `log` | 4 | Good |
| `info` | stack | Update | `info` | 4 | Accent |
| `mission` | banner | Mission completed | `check` | 4.5 | Good |
| `objective` | banner | New objective | `diamond` | 3.5 | Accent |
| `powerup` | banner | Super charged | `bolt` | 3.5 | Power + glow |
| `warning` | alert | Warning | `warning` | 5 | Warn |

- 🔴 **Banners are for must-know progress only** (user, 2026-09-28): mission complete, new objective, a
  major power-up. Never routine pickups; those are stack toasts. A banner that fires often stops meaning
  anything.
- `powerup` demonstrates that a banner kind can carry its own colour, icon and glow. It isn't a game
  feature.
- 🔴 **Toasts run on UI time**, not game time. They keep playing while the world is paused (pause menu open).

## Stack toasts

Small cards, one under another.

**Queueing:** at most **4** visible. Further toasts wait in a FIFO queue, and each one shows when a slot frees.

```
SNpToast                         brush Panel (+ background blur 8, optional); padding T 14, R 18, B 16, L 14; clips
├─ SHorizontalBox                14 between
│  ├─ IconBox                    44 × 44, radius 6, fill <kind colour> @ 0.12; v-centre
│  │  └─ Icon                    26 × 26, tinted <kind colour>
│  └─ SVerticalBox (fill)        3 between
│     ├─ Label                   Label style, coloured <kind colour> for acquired / log
│     ├─ Title                   H3
│     └─ Body (optional)         Small, wraps
└─ DrainBar                      overlay, bottom edge, full width, 3 tall, <kind colour> @ 0.5
```

The **drain bar** shows the time left: it shrinks from full width to nothing, pivot at the left edge.

**Lifecycle:** `StackIn` → drain over *duration* → `StackOut` → removed → next queued toast shows.

| Animation | Tracks |
|---|---|
| `ToastStackIn` | opacity `[0 → 0, quadOut] [0.2 → 1]` · translate `[0 → (−40, 0), cubicOut] [0.3 → (0, 0)]` |
| `ToastDrain` | DrainBar scale `[0 → (1, 1), linear] [duration → (0, 1)]`, pivot (0, 0.5) |
| `ToastStackOut` | opacity `[0 → 1, quadIn] [0.25 → 0]` · translate `[0 → (0, 0), quadIn] [0.25 → (−24, 0)]` |

### ⚠️ Placement: provisional

Depends on the world HUD layout, which isn't decided. In the prototype:
- **In the world:** a column 420 wide, top-left, offset (48, 300) from the corner, 10 between toasts.
- **While the computer is open:** bottom-right, offset (72, 110) from that corner, because the computer's
  left column is its list.

Build the stack so the placement is chosen per context (HUD vs menu), not fixed.

## Banners

One big centred moment at a time. **Queued:** a new banner waits until the current one has gone.

```
SNpBanner                        full width, top; padding T 190
└─ SVerticalBox                  width 1000, h-centre, 10 between; text shadow (0, 2) black @ 0.6
   ├─ Head (SHorizontalBox)      22 between
   │  ├─ LineLeft (fill)         2 tall, <colour> @ 0.7, pivot RIGHT end
   │  ├─ Icon                    40 × 40 (48 for powerup), tinted <colour>
   │  └─ LineRight (fill)        2 tall, <colour> @ 0.7, pivot LEFT end
   ├─ Label                      BannerLabel, <colour>, centred; padding T 6
   ├─ Title                      BannerTitle, centred
   └─ Body (optional)            Body, Dim, centred
```

Banner colour: `mission` Good · `objective` Accent · `powerup` Power.

| Animation | Target | Tracks |
|---|---|---|
| `ToastBannerIn` | Banner | opacity `[0 → 0, quadOut] [0.35 → 1]` |
| `ToastBannerLines` | both lines | scale `[0 → (0, 1), cubicOut] [0.6 → (1, 1)]`: they grow **outward from the icon** |
| `ToastBannerText` | icon, label, title, body in turn | opacity `[0 → 0, quadOut] [0.4 → 1]` · translate `[0 → (0, 10), cubicOut] [0.5 → (0, 0)]`; delay **0.15 + 0.08 × index** |
| *(hold)* | | *duration* |
| `ToastBannerOut` | Banner | opacity `[0 → 1, quadIn] [0.4 → 0]` |

## Alerts

Warnings, top-centre. **Not queued:** each shows at once, stacking downward, 10 apart.

```
SNpAlert                         column h-centre, padding T 36
└─ Panel                         brush Panel, 1 px border Warn, radius 8; padding 14 × 22; min width 440
   └─ SHorizontalBox             16 between
      ├─ Icon                    34 × 34, tinted Warn, v-centre
      └─ SVerticalBox
         ├─ Label                Label style, Warn
         ├─ Title                H3
         └─ Body (optional)      Small
```

| Animation | Target | Tracks |
|---|---|---|
| `ToastAlertIn` | Alert | opacity `[0 → 0, quadOut] [0.15 → 1]` · translate `[0 → (0, −20), cubicOut] [0.25 → (0, 0)]` |
| `ToastAlertPulse` | Icon | opacity `[0 → 1, quadInOut] [0.5 → 0.35, quadInOut] [1 → 1]`, looped **round(duration)** times |
| `ToastOut` | Alert | opacity `[0 → 1, quadIn] [0.3 → 0]` |

## Port notes

- A **notification subsystem** (e.g. a local-player subsystem) owning the queues, and one widget in the top
  layer that it pushes cards into. Which subsystem and layer system (CommonUI or not) is the game's
  technical design to decide.
- The kinds table is data: a DataTable or data assets, so new kinds don't need code.
- Durations count UI time: real time, ignoring game pause and time dilation.

## Port costs

| What | Suggestion |
|---|---|
| Background blur behind stack toasts (8) | Optional. Drop it first if blur costs too much |
| Banner text shadow (blurred) | Unblurred offset shadow, or a soft dark texture behind the banner |
| Power-up glow (icon, label, lines) | Glow texture or material. Only matters if power-ups become real |
| Alert's soft outer glow | A 9-slice glow texture, or drop it (the Warn border carries it) |
