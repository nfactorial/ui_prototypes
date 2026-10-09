// The viewfinder: she raises the camera and we look through it. Follows the game's
// take_photo_mode.md / take_photo_mode_prd.md (2026-10-05):
//   the camera is a wheel tool; use tool raises it, and each further press is the shutter
//   back (Esc / B) puts it away; the world keeps running
//   no zoom until lenses exist; the overlay is plain to begin with, and each camera
//   body will bring its own later
//
// 🔴 The camera is set up in the book: it opens over the viewfinder on Tools › Camera
// (D27, D30), where she picks the camera and lens and ENABLES filters and frames. In the
// viewfinder she switches between the enabled ones (user, 2026-10-08: D26): Q the
// filter, E the frame (pad LB / RB, placeholders). The view follows witch.camera live.
//
//   variant 'photoui'  plain  nothing over the view but a hint row that fades (stage 3)
//                      clean  corner brackets
//                      body   the viewfinder of whichever camera she has on
//
// Selfie (V) and poses (Q/E) still work but aren't advertised: the game defers selfie.
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { POSES, LENSES, FILTERS, FRAMES, photoMarkup, sceneMarkup, isSquare, photoShape } from '../../photo.js';
import { clock, dayPhase } from '../../core/format.js';

const IN = defineAnimation('PhotoIn', {         // lifting the camera: a quick dip to dark
  opacity: [[0, 0, 'quadOut'], [0.35, 1]],
  scale: [[0, [1.06, 1.06], 'cubicOut'], [0.45, [1, 1]]],
});
const OUT = defineAnimation('PhotoOut', { opacity: [[0, 1, 'quadIn'], [0.25, 0]] });
const FLASH = defineAnimation('Shutter', { opacity: [[0, 0, 'linear'], [0.04, 0.9, 'quadOut'], [0.4, 0]] });
const SAVED = defineAnimation('PhotoSaved', {
  opacity: [[0, 0, 'quadOut'], [0.2, 1, 'linear'], [2.2, 1, 'quadIn'], [2.7, 0]],
  translate: [[0, [0, 30], 'cubicOut'], [0.35, [0, 0]]],
  angle: [[0, -8, 'cubicOut'], [0.4, -3]],
});
// Changing camera or lens (from the book): a blink of dark while one comes off and the other goes on.
const SWAP = defineAnimation('KitSwap', { opacity: [[0, 0.15, 'quadOut'], [0.3, 1]], scale: [[0, [0.97, 0.97], 'cubicOut'], [0.3, [1, 1]]] });
const NUDGE = defineAnimation('PhotoNudge', { scale: [[0, [1.08, 1.08], 'cubicOut'], [0.2, [1, 1]]] });
// The hint row: there on raising, gone after a few seconds.
const HINTS_OUT = defineAnimation('ViewfinderHintsOut', { opacity: [[0, 1, 'quadIn'], [0.6, 0]] });
// A filter or frame switched (D26): its name, briefly.
const SWITCHED = defineAnimation('ViewfinderSwitched', {
  opacity: [[0, 0, 'quadOut'], [0.12, 1, 'linear'], [1.2, 1, 'quadIn'], [1.6, 0]],
  translate: [[0, [0, 8], 'cubicOut'], [0.2, [0, 0]]],
});
const HINT_SECONDS = 4;

const cycle = (list, cur, dir = 1) => list[(list.indexOf(cur) + dir + list.length) % list.length];

export default {
  id: 'photo-mode',
  title: 'Viewfinder',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const { world, witch } = ctx.vm;
    const ui = ctx.variant('photoui') ?? 'plain';
    const blassi = ctx.variant('blassi') ?? 'square';
    // body / lens / filter / frame come from witch.camera: the book sets them.
    const st = { view: ctx.params.view ?? 'viewfinder', pose: POSES[0], ...witch.get('camera') };

    root.innerHTML = /* html */ `
      <div class="s-overlay gb pm2" data-widget="WBP_ViewfinderOverlay" data-ui="${ui}">
        <!-- The camera's view (in the game: the 3D scene through the photo camera + post-process) -->
        <div class="pm2-view" data-view></div>
        <div class="s-overlay pm2-frame hit-invisible" data-frame-preview></div>
        <div class="pm2-vignette hit-invisible"></div> <!-- camera look. SLATE: material -->
        <div class="s-overlay pm2-finder hit-invisible" data-finder></div> <!-- the camera's viewfinder. SLATE: textures + text -->
        <!-- Plain and brackets: a camera whose photo isn't wide (Blassi square, Expanse panoramic)
             dims what falls outside it. SLATE: four borders round an SBox, or a mask material -->
        <span class="pm2-shape hit-invisible" data-shape="wide"></span>
        <div class="s-overlay pm2-marks hit-invisible">
          <span class="pm2-corner tl"></span><span class="pm2-corner tr"></span><span class="pm2-corner bl"></span><span class="pm2-corner br"></span>
        </div>

        <div class="s-overlay pm2-ui hit-invisible">
          <div class="s-hbox pm2-pose h-center v-bottom ts-world" data-pose-row>
            ${glyph('photoPose', 'sm')}<span class="s-text gb-small">Pose</span><span class="s-text gb-h3" data-pose></span>
          </div>
          <!-- What the buttons do, shown on raising, then faded. Buttons, so the mouse
               works and the screen takes input. SLATE: an SHorizontalBox of glyphs + text -->
          <div class="s-hbox pm2-switched h-center v-bottom ts-world" data-switched></div>
          <div class="s-hbox pm2-hints h-center v-bottom ts-world" data-widget="WBP_ViewfinderHints" data-hints>
            <button class="s-button s-hbox pm2-hint" data-do="take" data-focus-default>${glyph('useTool', 'sm')}<span class="s-text gb-small">Take photo</span></button>
            <button class="s-button s-hbox pm2-hint" data-do="filter" data-many="filters">${glyph('photoFilter', 'sm')}<span class="s-text gb-small">Filter</span></button>
            <button class="s-button s-hbox pm2-hint" data-do="frame" data-many="frames">${glyph('photoFrame', 'sm')}<span class="s-text gb-small">Frame</span></button>
            <button class="s-button s-hbox pm2-hint" data-do="kit">${glyph('cameraKit', 'sm')}<span class="s-text gb-small">Camera</span></button>
            <button class="s-button s-hbox pm2-hint" data-do="exit">${glyph('back', 'sm')}<span class="s-text gb-small">Put away</span></button>
          </div>
          <div class="s-box pm2-note h-left v-bottom"><div class="gb-note on-world">Plain overlay, as the game's stage 3. Q / E switch between the filters and frames enabled on Tools › Camera (D26); the book opens there (I) to choose the camera and lens. Variant <b>Viewfinder</b> tries brackets, or each camera's own finder.</div></div>
        </div>

        <div class="pm2-flash hit-invisible"></div>
        <div class="s-box pm2-saved h-right v-bottom hit-invisible" data-saved></div>
      </div>`;
    ctx.bind();

    const $ = (sel) => root.querySelector(sel);
    const view = $('[data-view]');
    const framePreview = $('[data-frame-preview]');
    const caption = () => `${world.get('zoneName') || 'Somewhere'} · ${clock(world.get('timeOfDay'))}`;

    // Is a camera's own viewfinder drawn? Only when she's looking through it.
    const through = () => ui === 'body' && st.view === 'viewfinder';

    // Each camera's viewfinder, a nod to the real thing. The readouts are dressing
    // (they follow the light and the lens), never a score. SLATE: textures + text.
    function finderMarkup() {
      const lens = LENSES[st.lens];
      const phase = dayPhase(world.get('timeOfDay'));
      const shutter = phase === 'Night' ? '1/15' : phase === 'Evening' ? '1/60' : '1/250';
      const f = lens.fstop.replace('f/', '');
      const AF = [[0, -2], [-2, -1], [2, -1], [-3, 0], [-1, 0], [0, 0], [1, 0], [3, 0], [-2, 1], [2, 1], [0, 2]];
      switch (st.body) {
        case 'box':   return '<span class="pm2-f-ring"></span>';
        case 'onnik': return /* html */ `
          <span class="pm2-f-gate"></span><span class="pm2-f-prism"></span><span class="pm2-f-split"></span>
          <div class="s-hbox pm2-f-lcd"><span>${shutter}</span><span>${f}</span><span>▸ ▸ ● ◂ ◂</span><span>[ 24 ]</span></div>`;
        case 'aconn': return /* html */ `
          <span class="pm2-f-gate"></span>
          <span class="pm2-f-af">${AF.map(([x, y]) => `<span class="pm2-f-pt ${x || y ? '' : 'on'}" style="--x:${x};--y:${y}"></span>`).join('')}</span>
          <div class="s-hbox pm2-f-lcd"><span>${shutter}</span><span>${f}</span><span>ISO 200</span><span>●</span></div>`;
        case 'nyso':  return /* html */ `
          <div class="s-hbox pm2-f-evf"><span>P</span><span>${shutter}</span><span>F${f}</span><span>ISO ${phase === 'Night' ? '3200' : '400'}</span><span class="fill"></span><span>${lens.mm}</span><span>▮▮▮</span></div>
          <span class="pm2-f-level"></span><span class="pm2-f-focus"></span>
          <svg class="pm2-f-histo" viewBox="0 0 100 40" preserveAspectRatio="none"><polygon points="0,40 8,34 18,22 28,26 40,12 52,18 62,8 74,20 86,28 100,36 100,40"/></svg>`;
        case 'icale': return /* html */ `
          <span class="pm2-f-lines" style="--frame:${(88 / lens.zoom).toFixed(1)}%"><span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span></span>
          <span class="pm2-f-patch"></span>
          <div class="s-hbox pm2-f-led"><span>▸</span><span>●</span><span>◂</span></div>`;
        // Expanse: a TRUE panorama (user, 2026-10-05), not a crop. The frame is wider, so
        // the same lens takes in more of the world sideways: the strip spans the whole
        // screen and dark bars close in above and below. Bright lines just inside it.
        // GAME: the camera's horizontal FOV from a 65 mm-wide frame (FCozyLens'
        // SensorWidthMm) + a 65:24 constrained aspect. The bench's screenshot is 16:9,
        // so the strip here shows less sideways than the game would: a pano shot is wanted.
        case 'expanse': return /* html */ `
          <span class="pm2-f-strip"><span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span></span>
          <span class="pm2-f-patch"></span>
          <div class="s-hbox pm2-f-led"><span>▸</span><span>●</span><span>◂</span></div>`;
        case 'blassi': return /* html */ `
          <span class="pm2-f-hood ${isSquare({ body: 'blassi' }, blassi) ? 'square' : ''}"><span class="pm2-f-grid"></span><span class="pm2-f-circle"></span></span>`;
        default: return '';
      }
    }

    function render() {
      // Icale and Expanse are rangefinders: the view doesn't zoom; their bright lines shrink instead.
      const zoom = through() && st.body === 'icale' ? 1 : undefined;
      view.innerHTML = sceneMarkup({ view: st.view, body: st.body, lens: st.lens, filter: st.filter }, { zoom });
      const pm = $('.pm2');
      pm.dataset.view = st.view;
      pm.dataset.body = through() ? st.body : '';
      const finder = $('[data-finder]');
      finder.dataset.finder = through() ? st.body : '';
      finder.innerHTML = through() ? finderMarkup() : '';
      // The photo's shape, when the camera's own finder isn't there to show it.
      $('[data-shape]').dataset.shape = !through() && st.view === 'viewfinder' ? photoShape(st, blassi) : 'wide';
      $('[data-pose]').textContent = st.pose;
      $('[data-pose-row]').classList.toggle('collapsed', st.view !== 'selfie');
      // A switch hint only when there's something to switch between.
      root.querySelectorAll('[data-many]').forEach((b) => b.classList.toggle('collapsed', (st[b.dataset.many]?.length ?? 0) < 2));
      // Frame preview: the frame drawn round the whole screen, the way AC:NH shows it.
      framePreview.dataset.frame = st.frame;
      framePreview.innerHTML = st.frame === 'none' ? ''
        : `<div class="pm2-frame-cap">${st.frame === 'polaroid' || st.frame === 'postcard' ? caption() : ''}</div>`;
    }

    // The hints show on raising, then fade for good: the shutter is the button that
    // raised the camera, and the book and Esc are where they always are.
    const hints = $('[data-hints]');
    const hintTimer = setTimeout(() => ctx.play(hints, HINTS_OUT).finished.then(() => hints.classList.add('faded')), HINT_SECONDS * 1000);

    function take() {
      const photo = { id: `p${Date.now()}`, view: st.view, body: st.body, lens: st.lens, filter: st.filter,
        frame: st.frame === 'none' ? 'polaroid' : st.frame, caption: caption() };
      witch.set('photos', [photo, ...witch.get('photos')]);
      ctx.play($('.pm2-flash'), FLASH);
      const saved = $('[data-saved]');
      saved.innerHTML = /* html */ `
        <div class="s-vbox pm2-saved-card">
          ${photoMarkup(photo, 'pm2-thumb', { blassi })}
          <div class="s-text gb-small pm2-saved-label ts-world">Saved to Keepsakes</div>
        </div>`;
      ctx.play(saved, SAVED, { delay: 0.25 });
      ctx.action('photo-taken', { photo });
    }

    // The book changed what's on the camera: follow it. A new camera or lens blinks.
    const unsub = witch.on('camera', (cam) => {
      const swapped = cam.body !== st.body || cam.lens !== st.lens;
      Object.assign(st, cam);
      render();
      if (swapped) ctx.play(view, SWAP);
    }, { immediate: false });

    // Switch to the next enabled filter or frame (D26). Only the ones enabled on Tools ›
    // Camera take part; the book's list is the order.
    const switched = $('[data-switched]');
    function switchTo(part) {
      const cam = witch.get('camera');
      const list = cam[`${part}s`];
      if (list.length < 2) return;
      const next = list[(list.indexOf(cam[part]) + 1) % list.length];
      witch.set('camera', { ...cam, [part]: next });   // the camera listener re-renders
      const label = (part === 'filter' ? FILTERS : FRAMES).find((x) => x.id === next)?.label ?? next;
      switched.innerHTML = `<span class="s-text gb-small">${part === 'filter' ? 'Filter' : 'Frame'}</span><span class="s-text gb-h3">${label}</span>`;
      ctx.play(switched, SWITCHED);
    }

    const DO = {
      take,
      filter: () => switchTo('filter'),
      frame:  () => switchTo('frame'),
      kit:  () => ctx.action('camera-kit'),
      exit: () => ctx.action('back'),
      view: () => { st.view = st.view === 'viewfinder' ? 'selfie' : 'viewfinder'; render(); ctx.play(view, IN); },
      pose: (dir) => { if (st.view !== 'selfie') return; st.pose = cycle(POSES, st.pose, dir); render(); ctx.play($('[data-pose]'), NUDGE); },
    };
    ctx.onKey((e) => {
      const k = e.key.toLowerCase();
      if (k === 'f' || k === ' ') { e.preventDefault(); take(); return true; }   // use tool is the shutter (Space: a bench alias)
      if (k === 'v') { DO.view(); return true; }                                  // selfie: deferred in the game, kept here
      if ((k === 'q' || k === 'e') && st.view === 'selfie') { DO.pose(k === 'e' ? 1 : -1); return true; }
      if (k === 'q') { DO.filter(); return true; }                                 // D26: switch between the enabled ones
      if (k === 'e') { DO.frame(); return true; }
      if (k === 'enter') return true;                                             // Enter would re-press the focused hint
      return false;                                                               // I (the kit) and Esc (put away) are the flow's
    });
    root.querySelectorAll('[data-do]').forEach((b) => { b.onclick = () => DO[b.dataset.do](); });

    render();
    ctx.play($('.pm2'), IN);
    return {
      cleanup: () => { unsub(); clearTimeout(hintTimer); },
      outro: () => ctx.play($('.pm2'), OUT).finished,
    };
  },
};
