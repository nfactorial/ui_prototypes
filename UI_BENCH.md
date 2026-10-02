# UI bench — the playbook for a game's UI prototype

A **UI bench** is a browser prototype of a game's UI: plain HTML/CSS/JS, no build step, iterated in
seconds, where the UI is *designed* before anything is built in Slate/UMG. It becomes the **reference**
the Unreal implementation is built from: how each screen looks, moves and behaves, plus port notes.

This file is the method and the shared framework. It is game-agnostic. Each bench's own `CLAUDE.md`
imports it (`@../UI_BENCH.md`) and adds only what is true of that game.

| Bench | Game | Port |
|---|---|---|
| `nullpoint_ux/` | Null Point (`E:\dev\unreal\nullpoint`): space flight + FPS boarding | 5310 |
| `witchcraft_ux/` | A Little Witchcraft (`E:\dev\unreal\alittlewitchcraft`): sandbox adventure, a witch | 5320 |

Give every new bench its own port (next: 5330) so two can run at once.

## The rules that matter most

🔴 **The look is the user's call.** Build, show, ask. Never declare a screen "done" on your own judgement.
Record every reaction, dated, in `documents/direction.md`.

🔴 **It's a prototype, not a replica.** The Slate-shaped primitives are a convenient default that keeps
the port easy, not a cage. If an idea needs something Slate can't do trivially, try it and write down
what it would cost (`/* SLATE: … */`). A good idea that needs a UI material beats a dull one that ports free.

🔴 **Expect many iterations, not a one-shot.** Small, reviewable changes. Don't polish what the user
hasn't reacted to. Keep each screen's `README.md` current: it's the handoff note.

🔴 **Flow first, look second.** Start with the menus and the flow in **grey-box** (`gb-*`), judge it,
then explore looks as **style sets** applied live to the same screens. (Null Point's first look was an
amber-terminal placeholder that turned out to be the opposite of what was wanted. Grey-box avoids
committing to a look by accident.)

🔴 **Decided vs open is always visible.** `documents/direction.md` and `documents/flow.md` keep dated
decisions in tables and open questions in their own section. Never resolve an open question silently.

**Speculative screens are welcome** for systems the game hasn't built yet (that's part of the point of a
bench), but label them *speculative* and don't let them drive design.

## Starting a bench for a new game

1. **Read the game first**: its `CLAUDE.md`, the design docs for every player-facing system, its
   tone/art-direction statements. Get in-engine screenshots from the user: they're the backdrops.
2. **Copy the framework** (below) from the most recent bench. Don't share it by symlink: benches
   diverge, and a fix worth having in both is copied by hand.
3. **Write the game-specific layer**: `CLAUDE.md`, `documents/direction.md` (the reading of the game,
   reference points to ask the user about, open questions), `documents/flow.md` (the screen flow and
   inventory, all *proposed* until the user decides), `src/scenes.js`, `src/mock/`, `src/flows/`, screens.
4. **Build the flow in grey-box**: main menu → the world → the in-game menu(s) → pause. Add two or
   three candidate **style sets** straight away so the user reacts to looks early, on real screens.
5. **Ask the user** the direction questions (reference games, density, which screens matter) and record
   the answers. Iterate.

### What is framework (copy as-is) and what is the game

| Framework: game-agnostic | The game: write fresh |
|---|---|
| `src/core/`: stage, harness, screen_manager, focus, bind, viewmodel, sim, motion, notify, tooltip | `src/scenes.js`: backdrops, screens, scenes, variants |
| `styles/`: harness.css, slate.css, greybox.css, feedback.css | `src/styles.js` + `styles/themes/*.css`: the style sets |
| `tools/serve.mjs` (change the port and name) | `styles/tokens.css`, `styles/widgets.css` (HUD tokens, game widgets) |
| `index.html` (change the brand) | `src/mock/`, `src/flows/`, `src/screens/`, `documents/`, `assets/` |

Game-specific leftovers to check after copying: the harness's default `style` (`core/harness.js`), the
toast **kinds** (`core/notify.js`: they are the game's events), placement rules in `feedback.css` that
name a screen, and domain formatters in `core/format.js`.

## Running it

```sh
node tools/serve.mjs          # static server + live reload, no dependencies
```

CSS edits hot-swap without losing state; JS/HTML reload the page. `file://` doesn't work (ES modules).
⚠️ Not port 8080: on this machine Docker holds it and WSL relays `[::1]:8080` to something else. The
server listens on `127.0.0.1` and `::1` and exits loudly if its port is taken.

**No build step and no npm packages.** A library is allowed if it earns its place, but ask first. 3D
content is 2D backdrop images; there's no 3D library.

## Layout

```
index.html              harness page: toolbar + the stage
CLAUDE.md               the game-specific rules; imports this file
styles/
  harness.css           harness chrome only (never ported)
  tokens.css            the HUD style set: colours, fonts, text styles, brushes   → Slate style set
  slate.css             Slate-shaped primitive vocabulary (s-*)
  widgets.css           reusable game widgets                                    → SCompoundWidgets / WBPs
  greybox.css           grey-box vocabulary (gb-*), themed by --th-* variables
  feedback.css          toasts + tooltips
  themes/               style sets (one CSS file each) + README (the --th-* contract)
src/
  main.js               boot + input routing
  scenes.js             🔴 the registry: backdrops, screens, scenes, variants
  styles.js             the style-set registry
  core/                 the framework
  flows/                flow controllers: the "game" deciding which screens open
  mock/                 mock viewmodels + simulation ticks (stand-in for game state)
  screens/<name>/       index.js, style.css, README.md (intent, open questions, port notes)
assets/                 backdrops (in-engine screenshots), icons (white SVG, tinted), fonts (OFL), art
documents/              direction.md, flow.md, feature plans, handoff/
tools/                  serve.mjs (+ bake.mjs if the bench uses tessera textures)
```

## The harness (never ported)

Top bar: scene, backdrop, aspect, HUD scale, safe zone, style, motion speed, and the scene's **design
variants**. State lives in the URL hash, so any view is a shareable link.

🔴 **Harness shortcuts are Shift+letter** (or `[` `]`), so plain letters, Esc and arrows belong to the
game UI. Never give the harness an unmodified key.

| Key | |
|---|---|
| `[` / `]` | Previous / next scene |
| `Shift+S` | Cycle style set |
| `Shift+R` | Replay the scene |
| `Shift+O` | Slate outline: outlines every primitive; hover shows the widget path in the footer |
| `Shift+G` | 8 px grid |
| `Shift+P` | Pause the mock simulation |
| `Shift+C` | Clean mode (hides the harness, for screenshots) |

In the game UI: arrows move focus, Enter/Space activate, hover also moves focus (one highlight state).
Keyboard/gamepad polish is not the point: keep it working where it's cheap.

## Building with the port in mind

### The stage is (roughly) Slate units

**Reference resolution is 1080 tall** (16:9 → 1920×1080, 21:9 → 2520×1080). At 1080p Slate's DPI scale
is 1.0, so **1 CSS px ≈ 1 Slate unit**. Prefer `px`. The **HUD scale** slider lays the UI out at
`stage ÷ scale` and scales it up, like Unreal's DPI scale. Proportional layout: prefer **Fill** slots
(`fill`, `fill-2`) over `%`/`vw`.

### Primitive → Slate map

| Class | Slate | Notes |
|---|---|---|
| `s-overlay` | `SOverlay` | Children stack. Align with `h-left/h-center/h-right/h-fill`, `v-top/v-center/v-bottom/v-fill` |
| `s-hbox` / `s-vbox` | `SHorizontalBox` / `SVerticalBox` | Children **Auto** by default; `fill` / `fill-2` / `fill-3` = **Fill** |
| `s-wrapbox` | `SWrapBox` | |
| `s-grid` / `s-uniformgrid` | `SGridPanel` / `SUniformGridPanel` | |
| `s-box` | `SBox` | `--w --h --min-w --max-w --min-h --max-h` |
| `s-border` | `SBorder` | One brush + padding |
| `s-canvas` | `SConstraintCanvas` | `anchored` children with `--ax --ay --x --y --px --py`. Keep for data-positioned things |
| `s-switcher` | `SWidgetSwitcher` | Only `.active` shows |
| `s-scroll` / `s-spacer` / `s-scalebox` / `s-safezone` | `SScrollBox` / `SSpacer` / `SScaleBox` / `SSafeZone` | |
| `s-image` | `SImage` | `--img: url(/assets/…)` 🔴 **root-absolute** (a `url()` in a CSS variable resolves against the stylesheet). `tint`, `tile`, `stretch`, `cover` |
| `s-text` / `s-richtext` | `STextBlock` / `SRichTextBlock` | No wrap by default; `wrap` to wrap |
| `s-progress` | `SProgressBar` | `--pct` 0–1 |
| `s-button` | `SButton` | |
| `[data-widget="Name"]` | custom widget / WBP | Name it what it'll be called in Unreal |

Visibility: `collapsed` = Collapsed, `hidden` = Hidden, `hit-invisible` = HitTestInvisible.

⚠️ **Slot alignment classes win over a bare `align-self`/`justify-self`.** A child with `v-top` in an
overlay ignores `align-self: end` from a screen or feedback stylesheet (the slot rule is more specific).
To move it, change the alignment class in the markup, or position it with margins. (Witchcraft's toast
stack once sat flush in the top corner for this reason.)

### What CSS costs in Slate (a guide, not a rulebook)

| Cheap | Costs something (material, texture or custom widget) |
|---|---|
| flex/grid via primitives, margin, padding | gradients, box-shadow, glows, blur, `backdrop-filter` |
| solid colour, border + radius, `border-image` (9-slice) | one-sided borders, non-rectangular `clip-path`, blend modes, `filter` |
| opacity, transforms | blurred text shadows, text on a path, per-glyph effects |
| font family/size/weight, spacing, case | `::before` text, `:nth-child` layout tricks |

Use the right-hand column freely when it helps; leave a `/* SLATE: … */` note and list it in the
screen README's **Port notes**.

### Fonts

Slate font sizes are points at 96 DPI: **CSS px ≈ Slate size × 4/3**. `tokens.css` defines `--pt` so
`calc(<slate size> * var(--pt))` keeps the Unreal number visible. Only vendored **OFL** fonts, with the
licence alongside: the same `.ttf` imports into Unreal.

## Motion: `src/core/motion.js`

A Web Animations wrapper shaped like a **UMG widget animation**: named animations, one track per
property (`opacity`, `translate`, `scale`, `shear`, `angle`, `color`), keys in seconds with Slate's
interpolations (`linear`, `constant`, `quad*`, `cubic*`). `ctx.play(el, anim, { delay, loops, mode, speed })`.
Define motion in JS with `defineAnimation`, not CSS `@keyframes`, so it lives in one portable form. The
harness **Motion** speed and `Shift+R` replay exist so timing can be judged. Springs/physics need a
discussion and a port note.

## Data: viewmodels

Screens read **viewmodels** (`src/mock/`) through `data-bind` or `vm.on(field, fn)`, the shape of UMG
MVVM. Mock data is honest about what the game will need to expose.

- `data-bind="vm.field | formatter"` text (formatters in `core/format.js`)
- `data-bind-pct="vm.field"` sets `--pct`
- `data-bind-visible="vm.field"` Collapsed when falsy (`!` inverts)
- `data-bind-attr="vm.field:data-state"` sets an attribute for state styling

Formatting and HUD maths are pure functions with no DOM: they port straight to C++.

## Scenes, flows, screens

A **scene** is static (backdrop + screens, good for a HUD) or a **flow**: a controller in `src/flows/`
standing in for the game, opening and closing screens. It implements `documents/flow.md`; when one
changes, so does the other.

- Screens don't navigate. They report with `ctx.action('name', data)`; the controller decides.
- Keys go to the topmost interactive screen (`ctx.onKey`), then the controller (`onKey`). Arrows are focus.
- Focus: `[data-focus-default]` on open; closing hands focus back. Fix wrong spatial picks with
  `data-nav-right="<selector>"` etc.
- Layers: `game` · `gamemenu` · `menu` · `modal` · `notify` (CommonUI-style stack).
- `mount` may return `{ cleanup, outro }`; `outro()` returns a promise (capped at 1 s).
- The full `ctx` API is at the top of `core/screen_manager.js`.

**Design variants:** declare on the scene in `scenes.js`; they appear in the toolbar, land as
`data-v-<key>` on `#ui-root` (CSS) and `ctx.variant(key)` (JS). `remount: true` if read at mount.

**Toasts** (`core/notify.js`, `ctx.toast({ kind, title, body })`): presentations **stack** (routine),
**banner** (one at a time, must-know progress only) and **alert**. The kinds are the game's events.
**Tooltips** (`core/tooltip.js`): declared in markup, `data-tip` or `data-tip-title/-meta/-body/-stats`.

### Adding a screen

1. `src/screens/<name>/` with `index.js`, `style.css`, `README.md` (copy an existing one).
2. `index.js` exports `{ id, title, layer, styles, mount(root, ctx) }`.
3. Register it in `src/scenes.js`, in a static scene or opened by a flow.
4. `README.md`: what it's for, which design doc it serves, open questions, **port notes**.

Prefix a screen's classes with its short name. Use `--th-*`/tokens, never raw colours. Anything reused
moves to `widgets.css` and onto the style-guide screen.

## Style sets

The harness **Style** dropdown re-skins every grey-box screen at once. A style set is one CSS file in
`styles/themes/` setting the `--th-*` variables grey-box reads (grey fallback), plus optional decoration,
registered in `src/styles.js`. **The contract is in `styles/themes/README.md`.** Sets are explorations,
not decisions: keep rejected ones with a note on why. A screen needing a new visual value adds a
`--th-*` variable to the contract (with a grey fallback), never a hard-coded colour.

## Backdrops and art

The 3D view is a picture. Use **real in-engine screenshots** (1920×1080 or wider, drawn `cover`) as soon
as they exist, and test HUDs against the **hardest** ones: the brightest (sunlit sky, snow, sea glare) and
the darkest (night). Concept art for UI slots goes in `assets/art/` with a `CREDITS.md`.

## Checking your work

Open it in the browser (Claude in Chrome), look at the scene you changed, read the console. For layout
changes glance at 21:9 and HUD scale 1.25. Then show the user.

- 🔴 **`element.click()` from JS proves nothing about clickability**: it ignores whatever is on top. Check
  with `document.elementFromPoint()` at the button's centre, or a real click. Anything covering the stage
  without being interactive needs `pointer-events: none`, and `#ui-root > .layer > *` (pointer-events:
  auto) outranks a class, so set it inline or with an ID-level selector.
- The Chrome tool's hover doesn't produce real pointer events: dispatch a `PointerEvent` from JS.
- Animations freeze in a background tab: check `document.hidden` before judging motion.

## The path to Unreal

The bench is the **design stage** of the game repo's pipeline (design doc → PRD → implementation). It
shows *what must be true*: layout, flow, states, timing, feel. An Unreal session is **not** pointed at the
raw HTML/CSS: it can't tell harness from design, or decided from placeholder.

When a feature is agreed, write **`documents/handoff/<feature>.md`**: layout (widget tree from the
outline, Slate units), states and behaviour (screen README, pure rules), data (the viewmodel fields bound),
motion (`defineAnimation` keys), style values (the chosen set's `--th-*`), assets, port costs (every
`/* SLATE: */`), reference (screenshots, scene link, and a **git tag** for the commit it describes). The
game repo's PRD references the handoff rather than copying it.
