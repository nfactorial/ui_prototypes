# NullPoint UX — browser prototype of the game's UI

A **fast design bench** for the UI of *Null Point*, built in plain HTML/CSS/JS so it can be iterated in
seconds. The shipping UI will be Slate/UMG in Unreal. This prototype is where the UI gets *designed*, and
what the Unreal implementation will use as its **reference**: how each screen looks, moves and behaves,
plus notes on how to build it.

🔴 **It's a prototype, not a replica.** It does **not** have to match Slate 1:1 (user, 2026-09-28). The
Slate-shaped primitives below are a convenient default vocabulary that keeps the port easy. They are not
a cage. If a design idea needs something Slate can't do trivially, **try it anyway** and write down what
it would cost in Unreal. A good idea that needs a UI material is worth more than a dull one that ports for free.

🔴 **Expect many iterations, not a one-shot.** Screens will be built, looked at, argued with and rebuilt.
Keep changes small and reviewable. Don't polish something the user hasn't reacted to yet, and keep each
screen's `README.md` current, because it's the handoff note the Unreal work will read.

| | |
|---|---|
| **The game** | `E:\dev\unreal\nullpoint`. Read its `CLAUDE.md` and `documents/design/pillars.md` before designing a screen. UE 5.8, C++ |
| **The world** | `E:\learning\story_writing\stories\nullpoint\nullpoint.md`. The **reference rating** (A1.0), the insurance instrument (A1.0e) and the three-number wreck record (A1.0c) are the world's most UI-shaped ideas |
| **Engine evidence** | `E:\learning\unreal_engine\ui\` (Slate/UMG; read its `README.md` first) and `space\18-ui-hud-and-readability.md` (the HUD problem in space). Use these when a port question comes up, not as a design constraint |
| **Textures** | tessera, `E:\dev\terrain\tessera`. See *Textures* below |

🔴 **How it reads is the user's call**, as with everything look-critical in this project. Build, show,
ask. Don't declare a screen "done" on your own judgement.

🔴 **`documents/direction.md` holds the settled UI direction. Read it before designing anything.** In short:
menus and flow come first; the in-game menus are *the player's computer*; the look is **welcoming and grand
(Halo, Destiny, Starfield), not dry and technical (EVE)**. The current amber-terminal placeholder look is the
opposite of that. Replace it, don't iterate on it. **`documents/flow.md`** holds the screen flow and
inventory: which screens exist, what's decided, and what's open. Feature plans sit beside them
(e.g. `documents/scanning.md`).

## What the game needs from its UI

- **Two layers, two HUDs, deliberately different** (`pillars.md` §1, §3): third-person 6DOF **flight**
  (open, fast, you-as-vehicle) and first-person **boarding** (slow, enclosed, you-as-body, horror
  register, where the UI should get out of the way).
- **Tone: Firefly · Star Trek · Aliens.** Grubby, lived-in frontier tech. **Not a navy**: no clean
  military glass-cockpit chrome. Arcade over sim.
- **Flight HUD burden** (`space/18`): markers, off-screen indicators (🔴 handle the *behind-camera*
  case), orientation, distances over six orders of magnitude, shape-not-just-colour for faction.
- ⚠️ The game has **no economy, crew or progression yet** (cut in the game's `CLAUDE.md`). Screens for
  those are speculative. Fine to sketch, but label them so and don't let them drive design.

## Running it

```sh
node tools/serve.mjs          # http://localhost:5310 (static server + live reload, no dependencies)
node tools/bake.mjs           # re-bake tessera textures (needs python + tessera)
```

CSS edits hot-swap without losing state; JS/HTML edits reload the page. ⚠️ `file://` doesn't work, because
ES modules need a server.

⚠️ **Not port 8080:** on this machine Docker holds 8080 and WSL relays `[::1]:8080`, so `localhost:8080`
reaches some other server (it answers "Ok"). The server uses 5310, listens on both `127.0.0.1` and `::1`,
and exits with a message if the port is taken rather than falling back silently.

**No build step and no npm packages** so far. Adding a library is allowed if it earns its place, but ask
first. 3D content is represented by 2D backdrop images; there's no 3D library.

### The harness (the chrome around the stage, never ported)

Top bar: scene, backdrop, aspect ratio, HUD scale, safe zone, motion speed, and the scene's **design
variants** (orange labels). State lives in the URL hash, so any view is a shareable, reloadable link.

🔴 **Harness shortcuts are Shift+letter**, so plain letters, Esc and arrows belong to the game UI (C = computer,
Esc = pause/back, Q/E = tabs). Don't give the harness an unmodified key.

| Key | |
|---|---|
| `[` / `]` | Previous / next scene |
| `Shift+R` | Replay the scene (restarts a flow, re-runs intros) |
| `Shift+O` | **Slate outline**: outlines every primitive; hover shows the widget path in the footer |
| `Shift+G` | 8 px layout grid |
| `Shift+P` | Pause the mock simulation |
| `Shift+C` | Clean mode: hides the harness for screenshots |

The **Motion** dropdown slows every animation (½×, ¼×, ⅒×) so timing can be judged.

**In the game UI:** arrows move focus, Enter/Space activate, mouse hover also moves focus (one highlight
state, like a console game). In the flow scenes, `C` opens the computer, `Esc` goes back or pauses.
⚠️ **Keyboard/gamepad polish is not a priority** (user, 2026-09-28): the prototype is for testing **flow and
layout**. Keep it working where it's cheap, but don't sink time into perfect focus behaviour.

## Layout

```
index.html              harness page: toolbar + the stage
styles/
  harness.css           harness chrome only
  tokens.css            the style set: colours, fonts, text styles, brushes   → Slate style set
  slate.css             Slate-shaped primitive vocabulary (s-*)
  widgets.css           reusable game widgets (np-*)                          → SCompoundWidgets / WBPs
  greybox.css           grey-box vocabulary (gb-*): plain, for judging flow. Never ported
src/
  main.js               boot + input routing
  scenes.js             🔴 the registry: backdrops, screens, scenes, variants. Add new ones here
  core/                 stage, harness, screen manager, focus, viewmodel, bindings, sim, motion, format, HUD maths
  flows/                flow controllers: the "game" deciding which screens open (game_flow.js)
  mock/                 mock viewmodels + simulation ticks (stand-in for game state)
  screens/<name>/       one folder per screen: index.js, style.css, README.md (intent + port notes)
tessera/                tessera .toml sources for UI textures (+ README write-ups)
assets/
  tessera/              baked tessera PNGs
  backdrops/            2D stand-ins for the 3D view. Drop real in-engine screenshots here
  icons/  brushes/      hand-made white SVGs (tinted at runtime) and 9-slice brushes
  fonts/                vendored OFL fonts: the same .ttf files import into Unreal
tools/                  serve.mjs, bake.mjs
```

## Building with the port in mind

**Default to the primitives; step outside them when the design wants to.** The `s-*` classes each behave
like a Slate widget, so a screen built from them ports almost mechanically, and the `O` outline shows
the Slate tree for free. When something *can't* be expressed that way, that's fine. Mark it in CSS with a
`/* SLATE: <what it needs> */` comment and list it under **Port notes** in the screen's README, e.g.
*"glow: UI material or baked texture"*, *"custom OnPaint widget"*.

### The stage is (roughly) Slate units

- **Reference resolution is 1080 tall.** 16:9 → 1920×1080; 21:9 → 2520×1080. At 1080p Slate's DPI scale is
  1.0, so **1 CSS px ≈ 1 Slate unit**. Prefer `px` so sizes carry over.
- The **HUD scale** slider lays the UI out at `stage ÷ scale` and scales it up, like Unreal's DPI /
  application scale. Worth checking a screen at 1.25× now and then.
- Proportional layout is best done with **Fill** slots (`fill`, `fill-2`) rather than `%`/`vw`, since that's
  how it'll be built, but it's a preference, not a rule.

### Primitive → Slate map

| Class | Slate | Notes |
|---|---|---|
| `s-overlay` | `SOverlay` | Children stack, later on top. Align with `h-left/h-center/h-right/h-fill`, `v-top/v-center/v-bottom/v-fill` (default fill) |
| `s-hbox` / `s-vbox` | `SHorizontalBox` / `SVerticalBox` | Children are **Auto** by default; `fill` / `fill-2` / `fill-3` = **Fill** with that weight. Cross-axis alignment with `v-*` (in hbox) / `h-*` (in vbox) |
| `s-wrapbox` | `SWrapBox` | |
| `s-grid` / `s-uniformgrid` | `SGridPanel` / `SUniformGridPanel` | Place children with `grid-column` / `grid-row` |
| `s-box` | `SBox` | `--w --h --min-w --max-w --min-h --max-h` = size overrides |
| `s-border` | `SBorder` | One background brush (`brush-*` class) + `padding` |
| `s-canvas` | `SConstraintCanvas` | Children `anchored` with `--ax --ay` (anchor 0–1), `--x --y` (offset), `--px --py` (alignment). Best kept for data-positioned things (markers); canvas panels cost draw calls (`ui/04` §2) |
| `s-switcher` | `SWidgetSwitcher` | Only the `.active` child shows |
| `s-scroll` | `SScrollBox` | |
| `s-spacer` | `SSpacer` | Size via `--w` / `--h` |
| `s-scalebox` | `SScaleBox` | Contain-fit of its image child |
| `s-safezone` | `SSafeZone` | Padding comes from the harness safe-zone setting |
| `s-image` | `SImage` | `--img: url(/assets/...)`, size via `--w --h`. `tint` colours a white-with-alpha texture with `color`; `tile` repeats it at `--tile-w --tile-h`; `stretch` fills the slot. ⚠️ **URLs must be root-absolute** (`/assets/…`): a `url()` inside a CSS variable resolves against the stylesheet, not the page |
| `s-text` | `STextBlock` | Doesn't wrap by default (like Slate); `wrap` to wrap. Style with a `ts-*` class |
| `s-richtext` | `SRichTextBlock` | `<span class="rt-*">` = a rich-text style |
| `s-progress` | `SProgressBar` | `--pct` 0–1 (bind with `data-bind-pct`) |
| `s-button` | `SButton` | `:hover` / `:active` / `[disabled]` states |
| `[data-widget="Name"]` | custom widget / Widget Blueprint | Name it what it'll become in Unreal. Shows in the outline breadcrumb |

Visibility: `collapsed` = **Collapsed**, `hidden` = **Hidden**, `hit-invisible` = **HitTestInvisible**.

### What CSS costs in Slate — a guide, not a rulebook

| Cheap (native in Slate) | Costs something (UI material, texture or custom widget) |
|---|---|
| flex/grid via primitives, `margin` (→ slot padding), `padding` | gradients, `box-shadow`, glows, blur, `backdrop-filter` (`SBackgroundBlur` has a real cost, `ui/05` §6) |
| solid colour, `border` + `border-radius` (rounded-box brush), `border-image` (9-slice box brush) | one-sided borders (use an `np-rule` SBox, or accept a custom brush) |
| `opacity`, transforms + `transform-origin` (render transform + pivot) | non-rectangular `clip-path`, `mix-blend-mode`, `filter` |
| font family/size/weight, `letter-spacing`, uppercase, `line-height`, `text-shadow` without blur | blurred text shadows, text on a path, per-glyph effects |
| `overflow: hidden` (clipping), tinted images, tiled images | anything that needs `::before/::after` *text* or `:nth-child` layout tricks (fine in the prototype, but they become explicit widgets) |

Use the right-hand column freely when it makes the design better; just leave the `/* SLATE: */` note.

### Fonts

🔧 **Slate font sizes are points at 96 DPI, so CSS px ≈ Slate size × 4/3.** `tokens.css` defines
`--pt: 1.3333px` and writes font sizes as `calc(<slate size> * var(--pt))`, so the number in the token
is the number to type into Unreal. Unverified: check it against an in-engine screenshot before trusting it.

Fonts are vendored in `assets/fonts/` (OFL, licences alongside). Stick to fonts we could ship and import
as a Font Face.

## Motion — `src/core/motion.js`

A small wrapper over the browser's Web Animations API, shaped like a **UMG widget animation** so timing
carries over as data: named animations, one **track** per property (`opacity`, `translate`, `scale`,
`shear`, `angle`, `color`), **keys** in seconds with an interpolation per key (Slate's ease set:
`linear`, `constant`, `quad*`, `cubic*`). Play it from a screen with `ctx.play(el, anim, { delay, loops,
mode, speed })`. It's cleaned up when the screen unmounts.

- **Why not GSAP / Motion One / anime.js:** they make springs, physics and path motion easy, which UMG
  doesn't have, and they're a dependency. If a design genuinely wants a spring or a physics feel, that's a
  legitimate prototype choice. Discuss adding a library, and note the port (baked keys, or a C++ ticked value).
- Prefer defining motion in JS via `defineAnimation` over CSS `@keyframes`, so every animation lives in one
  readable, portable form. Simple CSS `transition`s for hover states are fine.
- The **Motion** speed dropdown and `R` replay exist so timing can actually be judged. Use them.

## Textures — tessera

UI textures (grime, sweeps, reticles, 9-slice frames, glows) can be generated with **tessera** from `.toml`
node graphs kept in `tessera/`, baked to `assets/tessera/` with `node tools/bake.mjs`. The same `.toml`
moves to the game repo when adopted, so the texture is reproducible on both sides. **Read
`tessera/README.md` first.** The one rule that bites: **tintable textures are white RGB + alpha
coverage**, because a Slate tint multiplies RGB. Tessera's own README and `effects/discover_ui_*.toml`
show its UI-element techniques. The game repo's `documents/tessera/README.md` has the workflow conventions.

Every texture gets a write-up in `tessera/README.md`: what it's for, how the graph works, and 📊 measured
facts about the bake.

## Data: viewmodels, not bindings

Screens read **viewmodels** (`src/mock/`) through `data-bind` attributes or `vm.on(field, fn)`, the shape
of UMG MVVM (field notify + one-way bindings; see `ui/06`, `ui/07`). This keeps the mock data honest about
what the game will need to expose.

- `data-bind="flight.speed | speed"`: text, through a formatter in `core/format.js`
- `data-bind-pct="flight.hull"`: sets `--pct` (progress bars)
- `data-bind-visible="flight.belowPolicy"`: Collapsed when falsy (`!` inverts)
- `data-bind-attr="flight.heatState:data-state"`: sets an attribute, for state-driven styling

Formatting and HUD maths (`core/format.js`, `core/hud_math.js`) are pure functions that port straight to
C++. Keep them free of DOM.

## Scenes, flows and navigation

A **scene** is either static (a backdrop + a fixed list of screens, good for a HUD) or a **flow**: a
controller in `src/flows/` that opens and closes screens as the player moves through them. It stands in
for the game. `game_flow.js` implements `documents/flow.md`: main menu → world → computer / pause, with
`start` choosing where a scene begins (`mainmenu`, `world`, `computer`, `pause`). When `flow.md` changes,
this controller should change with it.

- Screens don't navigate directly. They report what happened with `ctx.action('settings')`, and the
  controller decides. That keeps flow decisions in one readable place.
- **Keys** go to the topmost interactive screen first (`ctx.onKey`), then to the controller (`onKey`).
  Arrows are handled centrally as focus movement (`core/focus.js`), CommonUI-style.
- **Focus:** a screen on a menu layer focuses `[data-focus-default]` (or its first button) when it opens,
  and closing hands focus back. Spatial navigation picks the nearest widget in that direction. When it
  picks wrong, add an explicit rule on an ancestor: `data-nav-right="<selector>"` (→ Slate's explicit
  navigation rules).
- **Outros:** `mount` may return `{ cleanup, outro }`. `outro()` returns a promise (usually an animation's
  `finished`), and the screen is removed when it resolves (capped at 1 s).

### Design variants

To compare two ideas, declare a **variant** on the scene (`scenes.js`), and it appears in the harness toolbar.
The value lands as `data-v-<key>` on `#ui-root` for CSS, and `ctx.variant(key)` for JS. Use
`remount: true` when the screen reads the variant at mount time. Current variants: `computer` (overlay vs
full screen) and `menubg` (tumble vs drift).

### Toasts and tooltips (global services)

Not screens: they render into the top **notify** layer and work in every scene. Styled in `styles/feedback.css`,
themed by the style sets. Try them in the **Components — toasts & tooltips** scene (and keys 1–5 in the world).

- **Toasts** (`core/notify.js`): `ctx.toast({ kind, title, body? })` from a screen, `toast(...)` in a flow.
  A kind picks a presentation: **stack** (pickups, info; queued, max 4, a draining time bar), **banner**
  (mission completed, new objective; one at a time, centred), or **alert** (warnings, top-centre). They run
  on UI time: they keep going while the world is paused, and follow the Motion speed. The stack sits
  left-middle in the world and moves bottom-right while the computer is open (its left column is the list).
- ⚠️ **Testing note:** the Chrome automation tool's `hover` doesn't produce real pointer events, and animations
  freeze while the tab is in the background. Trigger hovers with a dispatched `PointerEvent` from JS, and check
  `document.hidden` before judging motion.
- 🔴 **`element.click()` from JS proves nothing about clickability.** It ignores whatever is on top. A
  full-screen wrapper once swallowed every click in the app while scripted tests passed. Check with
  `document.elementFromPoint()` at the button's centre, or a real mouse click. Anything that covers the stage
  without being interactive needs `pointer-events: none`, and `#ui-root > .layer > *` (pointer-events:
  auto) outranks a plain class, so set it inline or with an ID-level selector.
- **Tooltips** (`core/tooltip.js`): declare them in markup: `data-tip="…"` for plain text, or
  `data-tip-title / -meta / -body / -stats="K:V|K:V"` for rich ones. Also `data-tip-place` and
  `data-tip-kind="unavailable"`, used to explain *why* a control is disabled. They show on hover, or on focus
  when the keyboard is in use. Item/module tooltips come from `itemTip()` in `mock/computer.js`.

### Style sets

The harness **Style** dropdown (Shift+S cycles) re-skins every menu screen at once. **Director is the default** (the user's favourite so far). A style set is one CSS
file in `styles/themes/`, registered in `src/styles.js`, that sets the `--th-*` variables grey-box reads,
plus optional decoration. **Read `styles/themes/README.md` for the contract.** The sets are explorations,
not decisions. Adding experimental ones is encouraged, and rejected ones are kept with a note on why.
When a screen needs a new visual value, add a `--th-*` variable to the contract (with a grey fallback)
rather than hard-coding a colour, so every style can answer it.

### Grey-box first

New flows and screens start as **grey-box**: `gb-*` classes, placeholders (`gb-placeholder`) for art, and
design notes in the UI itself (`gb-note`, citing the decision or open question). Judge the flow, then design
the look. A screen moves to tokens/widgets when it gets its real design.

## Adding a screen

1. Create `src/screens/<name>/` with `index.js`, `style.css`, `README.md`. Copy an existing screen.
2. `index.js` exports `{ id, title, layer, styles, mount(root, ctx) }`. `mount` writes markup, calls
   `ctx.bind()`, plays any intro with `ctx.play`, and may return a cleanup function or `{ cleanup, outro }`.
   `layer` is one of `game` · `gamemenu` · `menu` · `modal` (a CommonUI-style layer stack, `ui/16` §2). The
   full `ctx` API is documented at the top of `core/screen_manager.js`.
3. Register it in `src/scenes.js`. Add it to a static **scene**, or have a flow controller open it.
4. `README.md`: what it's for, which design doc it serves, open questions, and **port notes**.

Screen CSS: prefix classes with the screen's short name and use tokens rather than raw colours. Anything
reused across screens moves to `styles/widgets.css` as an `np-*` widget, and onto the style guide screen.

## Concept art

`assets/art/` holds **placeholder concept art** (AI-generated by the owner's own story-sequence tool). Every
file is listed in `assets/art/CREDITS.md`. **`documents/art_brief.md`** has the slots, sizes, safe areas,
the look, and notes on each image. Art goes into screens with `s-image cover` plus `--focus` (the part that
stays in view when cropped), e.g. missions carry `image` and `focus` fields in `mock/computer.js`. A slot
without art falls back to its `gb-placeholder`, so art can arrive gradually.

## Backdrops

The 3D view is a picture. The SVGs in `assets/backdrops/` are placeholders. Replace them with real
in-engine screenshots as soon as they exist (1920×1080 or wider; drawn `cover`). Test HUDs against the
**bright planet** backdrop as well as black space; contrast against a sunlit planet is the hard case
(`space/18` §10).

## Checking your work

Open it in the browser (Claude in Chrome, if connected), look at the scene you changed, and check the
console for errors. For layout changes, glance at 21:9 and HUD scale 1.25 too. Then show the user; the
look is theirs to sign off.

## The path to Unreal (agreed approach, 2026-09-28; not started)

The prototype is the **design stage** of the game repo's pipeline (design doc → technical design → PRD →
implementation, see the game's `CLAUDE.md`). It shows *what must be true*: layout, flow, states, timing,
feel. It does **not** hold PRDs, and an Unreal session should **not** be pointed at the raw HTML/CSS.
It can't tell harness from design, or decided from placeholder, and the prototype keeps moving.

**When a feature is agreed, write a handoff spec for it here:** `documents/handoff/<feature>.md`, built from
the screen's README. Each one covers:

| Section | Source in the prototype |
|---|---|
| Layout | Widget tree from the Shift+O outline, in Slate terms; sizes in Slate units |
| States and behaviour | The screen README; pure rules like `mock/vitals_model.js` |
| Data | The viewmodel fields it binds to (`data-bind*`, `vm.on`), which become the game's viewmodel |
| Motion | The `defineAnimation` definitions: keyframes, interps, durations (UMG terms already) |
| Style values | The chosen style set's `--th-*` values → the Slate style set |
| Assets | Textures (incl. tessera `.toml`), icons, fonts, art |
| Port costs | Every `/* SLATE: … */` note |
| Reference | Screenshots, the scene link, and the **git tag** the handoff describes |

The game repo's **technical design** then makes the engine decisions the prototype can't (UMG vs Slate,
CommonUI, MVVM, input routing: see `E:\learning\unreal_engine\ui\`), and its **PRD** references the
handoff rather than copying it (the game repo's rule: reference reasoning, don't copy it downward).

**Keep this possible as we go:** keep each screen README honest about decided vs placeholder and its port
notes, and **tag the commit** a handoff describes (e.g. `ui-handoff-vitals`) so the Unreal work has a fixed
reference while the prototype keeps evolving.
