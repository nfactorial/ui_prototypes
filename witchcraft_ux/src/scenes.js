// 🔴 The registry. Add backdrops, screens and scenes here.

// The "3D view": in-engine screenshots (E:\dev\Unreal\screenshots\alittlewitchcraft, 2026-09-15).
export const backdrops = {
  'path-day':     { title: 'Path through the trees, day', src: 'assets/backdrops/path_day.jpg' },
  'path-golden':  { title: 'Path, golden hour, sea behind', src: 'assets/backdrops/path_golden.jpg' },
  'rocky-hill':   { title: 'Rocky hill, bright sky (contrast test)', src: 'assets/backdrops/rocky_hill.jpg' },
  'meadow-sea':   { title: 'Bright meadow by the sea (contrast test)', src: 'assets/backdrops/meadow_sea.jpg' },
  'cliff-sunset': { title: 'Cliff at sunset', src: 'assets/backdrops/cliff_sunset.jpg' },
  'cliff-golden': { title: 'Cliff, golden light', src: 'assets/backdrops/cliff_golden.jpg' },
  'broom-sunset': { title: 'On the broom, sunset', src: 'assets/backdrops/broom_sunset.jpg' },
  'night-moon':   { title: 'Night, moon over the sea (dark test)', src: 'assets/backdrops/night_moon.jpg' },
  grey:           { title: 'Flat mid-grey', color: '#50555a' },
  black:          { title: 'Black', color: '#000' },
};

// Screen modules, loaded on demand. id → import.
export const screens = {
  'main-menu':    () => import('./screens/main_menu/index.js'),
  'settings':     () => import('./screens/settings/index.js'),
  'pause-menu':   () => import('./screens/pause_menu/index.js'),
  'quit-confirm': () => import('./screens/quit_confirm/index.js'),
  'world-hud':    () => import('./screens/world_hud/index.js'),
  'zone-banner':  () => import('./screens/zone_banner/index.js'),
  'quick-select': () => import('./screens/quick_select/index.js'),
  'book':         () => import('./screens/book/index.js'),
  'fishing':      () => import('./screens/fishing/index.js'),
  'photo-mode':   () => import('./screens/photo_mode/index.js'),
  'dialogue':     () => import('./screens/dialogue/index.js'),
  'study-reveal': () => import('./screens/study_reveal/index.js'),
};

// Design variants a scene can offer in the harness toolbar (data-v-<key> on #ui-root,
// ctx.variant(key) in JS). `remount: true` restarts the scene on change.
const V = {
  hud:      { label: 'HUD', options: { quiet: 'Quiet', contextual: 'Contextual', present: 'Always-on corner' }, remount: true },
  selector: { label: 'Selector', options: { radial: 'Radial wheel', bar: 'Bar' } , remount: true },
  book:     { label: 'Book', options: { panel: 'Panel over world', spread: 'Full-screen spread' } },
  affinity: { label: 'Affinity', options: { shown: 'Shown', hidden: 'Hidden' } },
  banner:   { label: 'Zone banner', options: { name: 'Name only', map: 'With map name' }, remount: true },
  catch:    { label: 'Catch', options: { holdup: 'Hold-up (letterbox)', card: 'Card' } },
  bite:     { label: 'Bite', options: { mark: '"!" mark', none: 'Nothing' } },
  input:    { label: 'Input', options: { keyboard: 'Keyboard', gamepad: 'Gamepad' } },   // live: CSS swaps the glyphs (src/input.js)
  speech:   { label: 'Speech', options: { panel: 'Panel (AC-style)', bubble: 'Bubble' }, remount: true },
  babble:   { label: 'Babble', options: { on: 'Babble on', off: 'Babble off' }, remount: true },
  milestones: { label: 'Milestones', options: { cards: 'Cards (next only)', rows: 'Rows (all tiers)' }, remount: true },
  msgoal:   { label: 'Goal', options: { count: 'Count (6 / 10)', sentence: 'Sentence (Catch 10 fish)' }, remount: true },
  insight:  { label: 'Study', options: { moment: 'Moment (waits)', card: 'Card (fades)' }, remount: true },
  photoui:  { label: 'Camera', options: { body: 'Through the camera', clean: 'Clean brackets' }, remount: true },
  kit:      { label: 'Kit', options: { earned: 'As earned', all: 'Whole kit (to try)' }, remount: true },
  names:    { label: 'Camera names', options: { anagram: 'Anagrams (Nyso, Icale…)', birds: 'Birds (Kestrel, Heron…)', makers: 'Makers (Hollis, Lunetta…)' }, remount: true },
  blassi:   { label: 'Blassi', options: { square: 'Square photos', look: 'Look only' }, remount: true },
  menubg:   { label: 'Menu bg', options: { golden: 'Golden cliff', night: 'Night', path: 'Golden path' }, remount: true },
};
const WORLD_VARIANTS = { input: V.input, hud: V.hud, selector: V.selector, book: V.book, affinity: V.affinity, catch: V.catch, bite: V.bite, banner: V.banner, photoui: V.photoui, kit: V.kit, names: V.names, blassi: V.blassi, speech: V.speech, babble: V.babble, insight: V.insight, milestones: V.milestones, msgoal: V.msgoal };

const FLOW = () => import('./flows/game_flow.js');

export const scenes = [
  { id: 'flow',          title: 'Flow — from main menu',  controller: FLOW, start: 'mainmenu', variants: { ...WORLD_VARIANTS, menubg: V.menubg } },
  { id: 'flow-world',    title: 'Flow — in the world',    controller: FLOW, start: 'world',    variants: WORLD_VARIANTS },
  { id: 'flow-satchel',  title: 'Flow — satchel open',    controller: FLOW, start: 'satchel',  variants: WORLD_VARIANTS },
  { id: 'flow-spells',   title: 'Flow — book: recipes › spells',  controller: FLOW, start: 'spells',   variants: WORLD_VARIANTS },
  { id: 'flow-recipes',  title: 'Flow — book: recipes › cooking', controller: FLOW, start: 'book:recipes:cooking', variants: WORLD_VARIANTS },
  { id: 'flow-charms',   title: 'Flow — book: recipes › charms', controller: FLOW, start: 'book:recipes:charms', variants: WORLD_VARIANTS },
  { id: 'flow-fish',     title: 'Flow — book: almanac › fish', controller: FLOW, start: 'book:almanac:fish',      variants: WORLD_VARIANTS },
  { id: 'flow-creatures', title: 'Flow — book: almanac › creatures', controller: FLOW, start: 'book:almanac:creatures', variants: WORLD_VARIANTS },
  { id: 'flow-keepsakes', title: 'Flow — book: keepsakes', controller: FLOW, start: 'book:keepsakes:tasks', variants: WORLD_VARIANTS },
  { id: 'flow-talk',     title: 'Flow — talking to Hazel', controller: FLOW, start: 'talk', variants: WORLD_VARIANTS },
  { id: 'flow-study',    title: 'Flow — studied an animal', controller: FLOW, start: 'study', variants: WORLD_VARIANTS },
  { id: 'flow-kit',      title: 'Flow — book: keepsakes › camera kit', controller: FLOW, start: 'kit',
    variants: { ...WORLD_VARIANTS, kit: { ...V.kit, options: { all: V.kit.options.all, earned: V.kit.options.earned } } } },
  { id: 'flow-photo',    title: 'Flow — photo mode (sunset)', controller: FLOW, start: 'photo', backdrop: 'cliff-sunset',
    variants: { ...WORLD_VARIANTS, kit: { ...V.kit, options: { all: V.kit.options.all, earned: V.kit.options.earned } } } },   // the whole kit by default, to try it
  { id: 'flow-tools',    title: 'Flow — tool selector',   controller: FLOW, start: 'tools',    variants: WORLD_VARIANTS },
  { id: 'flow-spellsel', title: 'Flow — spell selector',  controller: FLOW, start: 'spellsel', variants: WORLD_VARIANTS },
  { id: 'flow-fishing',  title: 'Flow — fishing catch',   controller: FLOW, start: 'fishing',  variants: WORLD_VARIANTS, backdrop: 'meadow-sea' },
  { id: 'flow-pause',    title: 'Flow — paused',          controller: FLOW, start: 'pause',    variants: WORLD_VARIANTS },
  { id: 'flow-night',    title: 'Flow — at night (dark test)',     controller: FLOW, start: 'world', backdrop: 'night-moon', variants: WORLD_VARIANTS },
  { id: 'flow-bright',   title: 'Flow — bright meadow (light test)', controller: FLOW, start: 'world', backdrop: 'rocky-hill', variants: WORLD_VARIANTS },
];
