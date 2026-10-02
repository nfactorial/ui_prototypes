// 🔴 The registry. Add backdrops, screens and scenes here.

// The "3D view" — 2D stand-ins. Replace placeholders with in-engine screenshots.
export const backdrops = {
  space:    { title: 'Space — system (placeholder)', src: 'assets/backdrops/space.svg' },
  planet:   { title: 'Sunlit planet — contrast test (placeholder)', src: 'assets/backdrops/planet_bright.svg' },
  corridor: { title: 'Derelict corridor (placeholder)', src: 'assets/backdrops/corridor.svg' },
  // concept art (assets/art, generated: see assets/art/CREDITS.md)
  'art-corridor-frost': { title: 'Art: frozen corridor', src: 'assets/art/entry_01.jpg' },
  'art-corridor-red':   { title: 'Art: red-lit corridor', src: 'assets/art/entry_02.jpg' },
  'art-bulkhead':       { title: 'Art: bulkhead door', src: 'assets/art/boarding_01.jpg' },
  'art-vault':          { title: 'Art: vault door', src: 'assets/art/boarding_02.jpg' },
  'art-freighter':      { title: 'Art: freighter in space', src: 'assets/art/space_01.jpg' },
  grey:     { title: 'Flat mid-grey', color: '#50555a' },
  black:    { title: 'Black', color: '#000' },
};

// Screen modules, loaded on demand. id → import.
export const screens = {
  // menus + flow (grey-box)
  'main-menu':     () => import('./screens/main_menu/index.js'),
  'settings':      () => import('./screens/settings/index.js'),
  'pause-menu':    () => import('./screens/pause_menu/index.js'),
  'quit-confirm':  () => import('./screens/quit_confirm/index.js'),
  'world-prompts': () => import('./screens/world_prompts/index.js'),
  'computer':      () => import('./screens/computer/index.js'),
  // HUDs (placeholder look)
  'flight-hud':    () => import('./screens/flight_hud/index.js'),
  'boarding-hud':  () => import('./screens/boarding_hud/index.js'),
  'wreck-survey':  () => import('./screens/wreck_survey/index.js'),
  'style-guide':   () => import('./screens/style_guide/index.js'),
  'component-lab': () => import('./screens/component_lab/index.js'),
  'combat-lab':    () => import('./screens/combat_lab/index.js'),
};

// Design variants a scene can offer in the harness toolbar. The chosen value is
// set as data-v-<key> on #ui-root. `remount: true` restarts the scene on change
// (for variants read in JS at mount time); otherwise CSS reacts live.
const COMPUTER_VARIANT = {
  computer: { label: 'Computer', options: { overlay: 'Overlay (blurred world)', fullscreen: 'Full screen' } },
};
const VITALS_VARIANT = {
  vitals: { label: 'Vitals', options: { corner: 'Corner bars', top: 'Top centre', bottom: 'Bottom centre', arcs: 'Arcs round crosshair' }, remount: true },
  hudvis: { label: 'Show vitals', options: { always: 'Always', contextual: 'Only when relevant' } },
};
const MENU_BG_VARIANT = {
  menubg: { label: 'Menu bg', options: { tumble: 'Derelict tumbling', drift: 'Derelict drifting, no spin' }, remount: true },
};

// A scene = a backdrop + the screens showing at once (across layers), or a flow
// controller that opens and closes screens itself (start = where it begins).
const FLOW = () => import('./flows/game_flow.js');

export const scenes = [
  { id: 'flow',          title: 'Flow — from main menu',       controller: FLOW, start: 'mainmenu', variants: { ...MENU_BG_VARIANT, ...COMPUTER_VARIANT } },
  { id: 'flow-world',    title: 'Flow — in the world',         controller: FLOW, start: 'world',    variants: COMPUTER_VARIANT },
  { id: 'flow-computer', title: 'Flow — computer open',        controller: FLOW, start: 'computer', variants: COMPUTER_VARIANT },
  { id: 'flow-pause',    title: 'Flow — paused',               controller: FLOW, start: 'pause',    variants: COMPUTER_VARIANT },
  { id: 'components',    title: 'Components — toasts & tooltips', backdrop: 'space', screens: ['flight-hud', 'component-lab'] },
  { id: 'flight',          title: 'HUD — flight',                 backdrop: 'space',    screens: ['flight-hud'] },
  { id: 'flight-contrast', title: 'HUD — flight on bright planet', backdrop: 'planet',   screens: ['flight-hud'] },
  { id: 'wreck-survey',    title: 'HUD — wreck survey (modal)',   backdrop: 'space',    screens: ['flight-hud', 'wreck-survey'] },
  { id: 'boarding',        title: 'HUD — boarding (shield & health)', backdrop: 'art-corridor-frost', screens: ['boarding-hud', 'combat-lab'], variants: VITALS_VARIANT },
  { id: 'style-guide',     title: 'Style guide',                  backdrop: 'grey',     screens: ['style-guide'] },
];
