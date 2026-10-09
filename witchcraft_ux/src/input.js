// 🔴 Every input glyph the UI shows comes from here, so keyboard and gamepad stay
// in step. The harness "Input" variant picks which one shows (data-v-input on
// #ui-root); both are rendered and CSS hides one, so switching is live.
// In the game this is CommonUI-style: the prompt follows the last device used.
//
// ALL PROPOSED (user, 2026-09-29: "the controls haven't been thought through yet";
// placeholder keys are fine, no 1:1 with the game needed). Keyboard is the
// prototype's keys, not the game's ESDF layout. Gamepad names are Xbox-style.
// Where the game's docs name a button it's used: Interact/Use tool = X, Cast = Y
// (controls.md, both "final placement to be decided").

export const BINDINGS = {
  //                keyboard      gamepad
  interact:     { kb: 'G',     pad: 'X' },
  useTool:      { kb: 'F',     pad: 'X' },      // fishing = using the rod
  cast:         { kb: 'R',     pad: 'Y' },
  satchel:      { kb: 'I',     pad: 'View' },   // opens the book on the satchel
  spellbook:    { kb: 'K',     pad: 'View' },   // opens Recipes › Spells (gamepad: open the book, then LB/RB, LT/RT)
  toolWheel:    { kb: 'T',     pad: 'RB' },     // hold on gamepad
  spellWheel:   { kb: 'Tab',   pad: 'LB' },     // hold on gamepad
  spellPrev:    { kb: 'Q',     pad: 'D←' },
  spellNext:    { kb: 'E',     pad: 'D→' },
  tabPrev:      { kb: 'Q',     pad: 'LB' },     // book pages (user: shoulders replace Q/E)
  tabNext:      { kb: 'E',     pad: 'RB' },
  // The spell buttons ("4–6 castable spells, bound to quick buttons"). Gamepad: hold LB
  // (the spell wheel) + a face button, a guess.
  spell1:       { kb: '1',     pad: 'LB+A' },
  spell2:       { kb: '2',     pad: 'LB+B' },
  spell3:       { kb: '3',     pad: 'LB+X' },
  spell4:       { kb: '4',     pad: 'LB+Y' },
  spell5:       { kb: '5',     pad: 'LB+D↑' },
  railPrev:     { kb: 'W',     pad: 'LT' },     // book categories down the left
  railNext:     { kb: 'S',     pad: 'RT' },
  // The camera (user, 2026-10-05; the game's take_photo_mode_prd): a wheel tool. Use tool
  // raises it and is the shutter; back puts it away; the book opens on Tools › Camera
  // (D27), where the camera and lens are chosen and filters and frames enabled. In the
  // viewfinder the enabled ones are switched between (D26).
  photoMode:    { kb: 'P',     pad: 'D↓' },     // bench shortcut: take the camera in hand and raise it
  cameraKit:    { kb: 'I',     pad: 'View' },   // the book, on Tools › Camera
  photoFilter:  { kb: 'Q',     pad: 'LB' },     // viewfinder: next enabled filter (D26)
  photoFrame:   { kb: 'E',     pad: 'RB' },     // viewfinder: next enabled frame
  giveTool:     { kb: 'J',     pad: '—' },      // bench demo: she's given the next tool
  photoPose:    { kb: 'Q/E',   pad: 'D←/D→' },  // selfie only (deferred in the game)
  claim:        { kb: 'Enter', pad: 'A' },
  confirm:      { kb: 'Enter', pad: 'A' },
  back:         { kb: 'Esc',   pad: 'B' },
  pause:        { kb: 'Esc',   pad: 'Menu' },
};

// Face buttons get their colour; everything else is a neutral pill.
const FACE = { A: 'a', B: 'b', X: 'x', Y: 'y' };

// Markup for one action's glyph, both devices. `size`: '' | 'sm'.
export function glyph(action, size = '') {
  const b = BINDINGS[action];
  if (!b) { console.warn(`[input] no binding "${action}"`); return ''; }
  const face = FACE[b.pad];
  return `<span class="wc-glyph" data-widget="SInputGlyph(${action})">`
    + `<span class="wc-key ${size} kb">${b.kb}</span>`
    + `<span class="wc-key ${size} pad ${face ? `face face-${face}` : ''}">${b.pad}</span>`
    + '</span>';
}
