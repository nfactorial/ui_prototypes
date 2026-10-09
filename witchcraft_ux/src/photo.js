// How a photo looks: the view, the camera + lens it was taken with, a filter, a frame, a caption. Shared by photo mode
// (what you're composing) and Keepsakes › Photos (what you kept), so a photo
// renders the same in both. All PROPOSED: photo mode isn't designed in the game
// yet (take_photo_mode.md: selfie + first-person; todo_prd: filters, borders,
// stickers à la AC:NH, an album).

// The two views (user, 2026-09-29), each an in-engine screenshot from that camera
// (the user's viewfinder.png / selfie.png). `size` / `focus` crop, if ever needed.
export const VIEWS = {
  viewfinder: { label: 'Viewfinder', hint: 'Through her camera', src: '/assets/backdrops/viewfinder.jpg', size: 'cover', focus: '50% 50%' },
  selfie:     { label: 'Selfie',     hint: 'Camera held out, looking back', src: '/assets/backdrops/selfie.jpg', size: 'cover', focus: '50% 55%' },
};

// 🔴 Every piece's `desc` is FLAVOUR: what it looks like, its character. Never technical:
// not what it does, how well, or a number (user, 2026-10-09: D32). What a piece does is
// shown, not told: each card in Tools › Camera carries a sample photo taken with it.
// `learnings`: what she might come to know about it (a hazy idea, not designed, never
// shown; see src/mock/witch.js).

// Filters. In the game each is a post-process preset. SLATE/UE: post-process material.
export const FILTERS = [
  { id: 'none',      label: 'No filter',   css: 'none',      desc: 'Nothing between her and the world.' },
  { id: 'old',       label: 'Old photo',   css: 'sepia(0.75) contrast(1.05) brightness(1.03)', desc: 'Tea-brown glass, like a photo from the back of a drawer.' },
  { id: 'film',      label: 'Faded film',  css: 'saturate(0.7) contrast(0.88) brightness(1.1)', desc: 'Cloudy glass that softens everything a little.' },
  { id: 'dusk',      label: 'Dusk',        css: 'sepia(0.25) saturate(1.3) hue-rotate(-12deg) brightness(0.9)', desc: 'Rose-coloured glass, warm as the end of the day.' },
  { id: 'ink',       label: 'Ink & wash',  css: 'grayscale(1) contrast(1.25) brightness(1.05)', desc: 'Grey glass, washed in night ink.' },
  { id: 'storybook', label: 'Storybook',   css: 'saturate(1.4) contrast(1.1)', desc: 'Painted round the edge with tiny flowers.' },
];

// Frames (AC:NH-style borders). Rendered as a border round the image.
export const FRAMES = [
  { id: 'none',     label: 'No frame',        desc: 'Just the photo, edge to edge.' },
  { id: 'polaroid', label: 'Polaroid',        desc: 'A white border, with room to write underneath.' },
  { id: 'postcard', label: 'Postcard',        desc: 'A stamp in the corner and a line for a message.' },
  { id: 'pressed',  label: 'Pressed flowers', desc: 'Pressed flowers, glued down one by one.' },
];

// Cameras and lenses (user, 2026-10-01; the game's take_photo_mode.md). COLLECTIBLES:
// things to find or earn, "different, not better", never a stat. A player who
// doesn't care never meets them. Names only nod to the real makers: no logos.
//
// A camera = a viewfinder look (photo mode draws it) + a colour grade (its "colour
// science"). Blassi's photos can be square (variant 'blassi'). SLATE/UE: the grade
// is a post-process LUT; the viewfinder is a UMG overlay of textures.
// `maker` and `kind` are notes for us, never shown: what each finder does is in the
// photo_mode README's viewfinder table. `desc` is flavour (above).
export const BODIES = {
  box:    { label: 'Box camera', maker: '',       kind: 'Her first camera',  desc: 'A black box with a brass winder, worn at the corners.',
            grade: '' },
  onnik:  { label: 'Onnik',      maker: 'Nikon',  kind: 'Film SLR',          desc: 'Heavy and black, with a chrome top worn silver at the edges.', learnings: ['A split circle to focus with, and a green readout beneath.'],
            grade: 'saturate(0.95) contrast(1.06)' },
  aconn:  { label: 'Aconn',      maker: 'Canon',  kind: 'SLR, quick to focus', desc: 'Rounded and comfortable, with a grip of pebbled leather.', learnings: ['Quick to focus.', 'Warm, and kind to faces.'],
            grade: 'sepia(0.1) saturate(1.12) brightness(1.02)' },
  nyso:   { label: 'Nyso',       maker: 'Sony',   kind: 'Mirrorless',        desc: 'Small and square-edged, matte grey, cool to the touch.', learnings: ['A little screen to look into, full of readouts.', 'Sees well in the dark.'],
            grade: 'contrast(1.08) saturate(0.94) hue-rotate(6deg)' },
  icale:  { label: 'Icale',      maker: 'Leica',  kind: 'Rangefinder',       desc: 'Brass under black paint, worn through where a thumb rests.', learnings: ['You see past the edges: bright lines mark the photo.'],
            grade: 'contrast(1.16) saturate(1.1) brightness(0.96)' },
  blassi: { label: 'Blassi',     maker: 'Hasselblad', kind: 'Medium format', desc: 'A heavy cube, with a hood that folds up from the top.', learnings: ['Looked down into, square, and back to front.'],
            grade: 'contrast(0.92) saturate(0.88) brightness(1.06)' },
  // Named by the user, 2026-10-05: said aloud, "Expanse" is "x-pan" (the panoramic
  // rangefinder Hasselblad made with Fujifilm), and it means a wide view to anyone else.
  // Deliberately not "Blassi Expanse": one maker shouldn't carry two cameras.
  expanse: { label: 'Expanse',   maker: 'Hasselblad XPan', kind: 'Panoramic rangefinder', desc: 'Long and low, as wide as two cameras side by side.', learnings: ['Takes in the whole horizon: a long, low photo.'],
            grade: 'contrast(1.05) saturate(0.96)' },
};
// A panoramic photo's shape, width : height (the XPan's 65 × 24 mm frame).
export const PANO_RATIO = 65 / 24;
// A lens = how much of the scene fits (zoom on the screenshot here; FOV in the
// game) + what's out of focus (dof: blur outside an ellipse rx×ry; DoF in the game).
// Focal length and f-number only appear as viewfinder readouts (flavour, D24), never on
// a card: a lens is described, not specified. What each is for is a learning.
export const LENSES = {
  std:      { label: 'Everyday lens', mm: '50 mm',  zoom: 1.25, desc: 'Small and plain, with a scratch across the cap.',          fstop: 'f/5.6', learnings: ['Sees about as she does.'] },
  wide:     { label: 'Wide lens',     mm: '24 mm',  zoom: 1.0,  desc: 'Short and stubby, its front glass bulging like an eye.',   fstop: 'f/8', learnings: ['For a whole valley.'] },
  portrait: { label: 'Portrait lens', mm: '85 mm',  zoom: 1.7,  desc: 'Heavy for its size, with a wide glass that catches the light.', fstop: 'f/1.8', dof: { blur: 14, rx: 22, ry: 34 }, learnings: ['Melts the background away.'] },
  long:     { label: 'Long lens',     mm: '300 mm', zoom: 2.6,  desc: 'As long as her forearm, in a scuffed leather case.',       fstop: 'f/5.6', dof: { blur: 6, rx: 36, ry: 44 }, learnings: ["For a creature that won't let her near."] },
  macro:    { label: 'Macro lens',    mm: '100 mm', zoom: 3.2,  desc: 'A ridged brass ring and a tiny hood.',                     fstop: 'f/11', dof: { blur: 22, rx: 14, ry: 18 }, learnings: ['For a moth, or the inside of a flower.'] },
};
export const bodyOf = (p) => BODIES[p.body] ?? BODIES.box;

// What the cameras are called (user, 2026-10-01: in fun, never in marketing, no
// reference to the real brands). Three sets to compare, harness variant 'names':
//   anagram  the makers' letters shuffled (Onnik was Konni until 2026-10-01: too close to Konica)
//   birds    each camera named for a bird that does what it's good at
//   makers   invented makers, old workshop names
export const BODY_NAMES = {
  anagram: { box: 'Box camera', onnik: 'Onnik',  aconn: 'Aconn',   nyso: 'Nyso',     icale: 'Icale',  blassi: 'Blassi', expanse: 'Expanse' },
  birds:   { box: 'Sparrow',    onnik: 'Dipper', aconn: 'Kestrel', nyso: 'Nightjar', icale: 'Magpie', blassi: 'Heron',  expanse: 'Albatross' },
  makers:  { box: 'Box camera', onnik: 'Fathom & Co.', aconn: 'Swiftwell', nyso: 'Glimmer', icale: 'Hollis', blassi: 'Lunetta', expanse: 'Wideacre' },
};
// Why each bird: the dipper walks under water (Onnik's underwater nod); the kestrel
// hangs in the air to catch a moving thing; the nightjar comes out at dusk (low
// light); the magpie picks up the bright bits of everyday life (street); the heron
// stands still and looks down into the water (a waist-level finder; and the moon);
// the sparrow is the plain, everyday one; the albatross has the widest wings, over the open sea.
// (The 'anagram' set is really "nods": Expanse is a pun, not an anagram, and stays the same.)
export const bodyName = (id, set = 'anagram') => (BODY_NAMES[set] ?? BODY_NAMES.anagram)[id] ?? BODIES[id]?.label ?? id;
export const lensOf = (p) => LENSES[p.lens] ?? LENSES.std;
// Is this photo square? Only Blassi, and only with the 'square' variant (passed in).
export const isSquare = (p, blassi = 'square') => p.body === 'blassi' && blassi === 'square';
// The photo's shape: 'square' (Blassi), 'pano' (Expanse, always), or 'wide' (everything else).
export const photoShape = (p, blassi = 'square') => (p.body === 'expanse' ? 'pano' : isSquare(p, blassi) ? 'square' : 'wide');

// Selfie poses: wanted, for the future (D14): they need pose animations (a library
// or an animator). The 3D side does them; here they're a label.
export const POSES = ['Smile', 'Wink', 'Wave', 'Surprised', 'Hat tip', 'Sleepy'];

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const filterCss = (id) => (FILTERS.find((f) => f.id === id) ?? FILTERS[0]).css;
// The whole grade: the camera's colour, then the filter on top.
export const lookCss = (p) => [bodyOf(p).grade, filterCss(p.filter)].filter((x) => x && x !== 'none').join(' ') || 'none';

// The scene through a lens: the view scaled by the lens's zoom, and, for a lens with
// shallow depth of field, a blurred copy masked to everything outside the subject.
// `px` scales the blur (1 = full screen; a thumbnail passes less).
// SLATE: in the game this is the camera itself (FOV + post-process DoF), not UMG.
export function sceneMarkup(p, { px = 1, zoom } = {}) {
  const v = VIEWS[p.view] ?? VIEWS.viewfinder;
  const lens = lensOf(p);
  const z = zoom ?? lens.zoom;
  const bg = `background-image:url(${v.src}); background-size:${v.size}; background-position:${v.focus}; transform:scale(${z})`;
  const look = lookCss(p);
  const dof = lens.dof
    ? `<div class="ph-scene ph-dof" style="${bg}; filter:${look === 'none' ? '' : look} blur(${(lens.dof.blur * px).toFixed(1)}px);
         --rx:${lens.dof.rx}%; --ry:${lens.dof.ry}%"></div>`
    : '';
  return `<div class="ph-scene" style="${bg}; filter:${look}"></div>${dof}`;
}

// A photo as markup: { view, filter, frame, caption }. The frame is a wrapper
// with padding; the caption is handwritten (Caveat) on polaroid and postcard.
export function photoMarkup(p, cls = '', { blassi = 'square' } = {}) {
  const flowers = p.frame === 'pressed'
    ? ['tl', 'tr', 'bl', 'br'].map((c) => `<span class="ph-flower ${c}"><span class="s-image tint" style="--img:url(/assets/icons/flower.svg)"></span></span>`).join('')
    : '';
  return /* html */ `
    <div class="ph-photo ${cls}" data-frame="${p.frame ?? 'none'}" data-shape="${photoShape(p, blassi)}" data-widget="WBP_Photo">
      <div class="ph-image">${sceneMarkup(p, { px: 0.18 })}</div>
      ${flowers}
      ${p.frame === 'postcard' ? '<span class="ph-stamp"></span>' : ''}
      ${(p.frame === 'polaroid' || p.frame === 'postcard') && p.caption ? `<div class="ph-caption">${esc(p.caption)}</div>` : ''}
    </div>`;
}
