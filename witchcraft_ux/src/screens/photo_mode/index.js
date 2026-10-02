// Photo mode (user, 2026-09-29; not yet designed in the game). Two views:
//   viewfinder  she lifts the camera and we see through it (world photos)
//   selfie      the camera is out in front, looking back at her
// Around that, proposals to react to: filters, frames (AC:NH-style, with a
// handwritten caption), selfie poses, hide UI. Taking a photo flashes, then the
// framed photo drops into the corner: "Saved to Keepsakes".
//
//   variant 'photoui'  body    (the viewfinder of whichever camera she holds)
//                      clean   (corner brackets over the view)
//
// Cameras and lenses (user, 2026-10-01): collectibles from her camera kit. A
// camera brings a viewfinder look and a colour grade; a lens brings how much
// fits (zoom) and what's out of focus. B / L cycle the ones she owns.
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { VIEWS, FILTERS, FRAMES, POSES, BODIES, LENSES, photoMarkup, sceneMarkup, isSquare, bodyName } from '../../photo.js';
import { KIT } from '../../mock/witch.js';
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
// Changing camera or lens: a blink of dark while one comes off and the other goes on.
const SWAP = defineAnimation('KitSwap', { opacity: [[0, 0.15, 'quadOut'], [0.3, 1]], scale: [[0, [0.97, 0.97], 'cubicOut'], [0.3, [1, 1]]] });
const NUDGE = defineAnimation('PhotoNudge', { scale: [[0, [1.08, 1.08], 'cubicOut'], [0.2, [1, 1]]] });

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cycle = (list, cur, dir = 1) => list[(list.indexOf(cur) + dir + list.length) % list.length];

export default {
  id: 'photo-mode',
  title: 'Photo mode',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const { world, witch } = ctx.vm;
    const ui = ctx.variant('photoui') ?? 'body';
    const blassi = ctx.variant('blassi') ?? 'square';
    const names = ctx.variant('names') ?? 'anagram';
    // The camera kit: only pieces she owns can be chosen (Keepsakes › Camera kit).
    // Harness variant 'kit' = 'all' hands her the whole kit, to try everything.
    const kit = ctx.variant('kit') === 'all' ? KIT.map((k) => `${k.kind}:${k.id}`) : witch.get('kit');
    const asList = (o) => Object.entries(o).map(([id, d]) => ({ id, ...d }));
    const owned = (kind, list) => list.filter((x) => kit.includes(`${kind}:${x.id}`));
    const filters = owned('filter', FILTERS);
    const frames = owned('frame', FRAMES);
    const bodies = owned('body', asList(BODIES));
    const lenses = owned('lens', asList(LENSES));
    const st = { view: ctx.params.view ?? 'viewfinder', body: bodies[0]?.id ?? 'box', lens: lenses[0]?.id ?? 'std',
      filter: 'none', frame: 'none', pose: POSES[0], hidden: false };

    root.innerHTML = /* html */ `
      <div class="s-overlay gb pm2" data-widget="WBP_PhotoMode" data-ui="${ui}">
        <!-- The camera's view (in the game: the 3D scene through the photo camera + post-process) -->
        <div class="pm2-view" data-view></div>
        <div class="s-overlay pm2-frame hit-invisible" data-frame-preview></div>
        <div class="pm2-vignette hit-invisible"></div> <!-- camera look. SLATE: material -->
        <div class="s-overlay pm2-finder hit-invisible" data-finder></div> <!-- the camera's viewfinder. SLATE: textures + text -->
        <div class="s-overlay pm2-marks hit-invisible">
          <span class="pm2-corner tl"></span><span class="pm2-corner tr"></span><span class="pm2-corner bl"></span><span class="pm2-corner br"></span>
        </div>

        <!-- UI (Hide UI removes all of this) -->
        <div class="s-overlay pm2-ui hit-invisible" data-ui-layer>
          <div class="s-vbox pm2-top h-left v-top ts-world">
            <div class="s-text pm2-mode" data-mode></div>
            <div class="s-text gb-small pm2-sub" data-sub></div>
          </div>
          <div class="s-vbox pm2-where h-right v-top ts-world">
            <div class="s-text gb-h3" data-bind="world.zoneName"></div>
            <div class="s-text gb-small"><span data-bind="world.timeOfDay | dayPhase"></span> · <span data-bind="world.timeOfDay | clock"></span></div>
          </div>
          <div class="s-hbox pm2-pose h-center v-bottom ts-world" data-pose-row>
            ${glyph('photoPose', 'sm')}<span class="s-text gb-small">Pose</span><span class="s-text gb-h3" data-pose></span>
          </div>
          <div class="s-hbox pm2-bar h-center v-bottom" data-widget="WBP_PhotoControls">
            <button class="s-button s-hbox pm2-ctl primary" data-do="take" data-focus-default>${glyph('photoTake', 'sm')}<span class="s-text gb-small">Take photo</span></button>
            <button class="s-button s-hbox pm2-ctl" data-do="view">${glyph('photoView', 'sm')}<span class="s-text gb-small" data-viewlabel></span></button>
            <button class="s-button s-hbox pm2-ctl" data-do="body">${glyph('photoBody', 'sm')}<span class="s-text gb-small" data-bodylabel></span></button>
            <button class="s-button s-hbox pm2-ctl" data-do="lens">${glyph('photoLens', 'sm')}<span class="s-text gb-small" data-lenslabel></span></button>
            <button class="s-button s-hbox pm2-ctl" data-do="filter">${glyph('photoFilter', 'sm')}<span class="s-text gb-small" data-filterlabel></span></button>
            <button class="s-button s-hbox pm2-ctl" data-do="frame">${glyph('photoFrame', 'sm')}<span class="s-text gb-small" data-framelabel></span></button>
            <button class="s-button s-hbox pm2-ctl" data-do="hide">${glyph('photoHide', 'sm')}<span class="s-text gb-small">Hide UI</span></button>
            <button class="s-button s-hbox pm2-ctl" data-do="exit">${glyph('back', 'sm')}<span class="s-text gb-small">Put away</span></button>
          </div>
          <div class="s-box pm2-note h-left v-bottom"><div class="gb-note on-world">Speculative: photo mode isn't designed yet. The views are in-engine shots from each camera. Open: does the world pause?</div></div>
        </div>

        <div class="pm2-flash hit-invisible"></div>
        <div class="s-box pm2-saved h-right v-bottom hit-invisible" data-saved></div>
      </div>`;
    ctx.bind();

    const view = root.querySelector('[data-view]');
    const framePreview = root.querySelector('[data-frame-preview]');
    const $ = (sel) => root.querySelector(sel);

    function caption() {
      return `${world.get('zoneName') || 'Somewhere'} · ${clock(world.get('timeOfDay'))}`;
    }

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
        case 'blassi': return /* html */ `
          <span class="pm2-f-hood ${isSquare({ body: 'blassi' }, blassi) ? 'square' : ''}"><span class="pm2-f-grid"></span><span class="pm2-f-circle"></span></span>`;
        default: return '';
      }
    }

    function render() {
      const v = VIEWS[st.view];
      // Icale is a rangefinder: the view doesn't zoom; its bright lines shrink instead.
      const zoom = through() && st.body === 'icale' ? 1 : undefined;
      view.innerHTML = sceneMarkup({ view: st.view, body: st.body, lens: st.lens, filter: st.filter }, { zoom });
      const pm = root.querySelector('.pm2');
      pm.dataset.view = st.view;
      pm.dataset.body = through() ? st.body : '';
      const finder = $('[data-finder]');
      finder.dataset.finder = through() ? st.body : '';
      finder.innerHTML = through() ? finderMarkup() : '';
      $('[data-mode]').textContent = v.label;
      $('[data-sub]').textContent = `${bodyName(st.body, names)} · ${LENSES[st.lens].label}`;
      $('[data-viewlabel]').textContent = st.view === 'viewfinder' ? 'Selfie' : 'Viewfinder';
      $('[data-bodylabel]').textContent = `${bodyName(st.body, names)} · ${bodies.length} of ${Object.keys(BODIES).length}`;
      $('[data-lenslabel]').textContent = `${LENSES[st.lens].label} · ${lenses.length} of ${Object.keys(LENSES).length}`;
      $('[data-filterlabel]').textContent = `${FILTERS.find((f) => f.id === st.filter).label} · ${filters.length} of ${FILTERS.length}`;
      $('[data-framelabel]').textContent = `${FRAMES.find((f) => f.id === st.frame).label} · ${frames.length} of ${FRAMES.length}`;
      $('[data-pose]').textContent = st.pose;
      $('[data-pose-row]').classList.toggle('collapsed', st.view !== 'selfie');
      // Frame preview: the frame drawn round the whole screen, the way AC:NH shows it.
      framePreview.dataset.frame = st.frame;
      framePreview.innerHTML = st.frame === 'none' ? '' : `<div class="pm2-frame-cap">${esc(st.frame === 'polaroid' || st.frame === 'postcard' ? caption() : '')}</div>`;
      $('[data-ui-layer]').classList.toggle('collapsed', st.hidden);
      root.querySelector('.pm2-marks').classList.toggle('collapsed', st.hidden);
      finder.classList.toggle('collapsed', st.hidden);
    }

    function take() {
      const photo = { id: `p${Date.now()}`, view: st.view, body: st.body, lens: st.lens, filter: st.filter, frame: st.frame === 'none' ? 'polaroid' : st.frame, caption: caption() };
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

    const nudge = (sel) => ctx.play($(sel), NUDGE);
    const DO = {
      take,
      view:   () => { st.view = st.view === 'viewfinder' ? 'selfie' : 'viewfinder'; render(); ctx.play(view, IN); },
      body:   () => { st.body = cycle(bodies.map((b) => b.id), st.body); render(); nudge('[data-bodylabel]'); ctx.play(view, SWAP); },
      lens:   () => { st.lens = cycle(lenses.map((l) => l.id), st.lens); render(); nudge('[data-lenslabel]'); ctx.play(view, SWAP); },
      filter: () => { st.filter = cycle(filters.map((f) => f.id), st.filter); render(); nudge('[data-filterlabel]'); },
      frame:  () => { st.frame = cycle(frames.map((f) => f.id), st.frame); render(); nudge('[data-framelabel]'); },
      hide:   () => { st.hidden = !st.hidden; render(); },
      pose:   (dir) => { if (st.view !== 'selfie') return; st.pose = cycle(POSES, st.pose, dir); render(); nudge('[data-pose]'); },
      exit:   () => ctx.action('back'),
    };
    const KEYS = { ' ': 'take', v: 'view', b: 'body', l: 'lens', f: 'filter', r: 'frame', h: 'hide' };
    ctx.onKey((e) => {
      const k = e.key.toLowerCase();
      if (KEYS[k]) { e.preventDefault(); DO[KEYS[k]](); return true; }
      if (k === 'q' || k === 'e') { DO.pose(k === 'e' ? 1 : -1); return true; }
      if (k === 'escape' && st.hidden) { DO.hide(); return true; }   // first Esc brings the UI back
      if (k === 'enter') return true;                                  // Enter would re-press the focused control
      return false;
    });
    // Mouse: the control bar is buttons.
    root.querySelectorAll('[data-do]').forEach((b) => { b.onclick = () => DO[b.dataset.do](); });

    render();
    ctx.play(root.querySelector('.pm2'), IN);
    return { outro: () => ctx.play(root.querySelector('.pm2'), OUT).finished };
  },
};
