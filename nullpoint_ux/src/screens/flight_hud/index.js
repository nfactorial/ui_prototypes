// Flight HUD — the third-person 6DOF layer.
import { placeContact } from '../../core/hud_math.js';
import { distance } from '../../core/format.js';
import { defineAnimation } from '../../core/motion.js';

// Panels boot in from their nearest edge: a flicker of opacity, then settle.
const bootIn = (dx, dy) => defineAnimation('BootIn', {
  opacity: [[0, 0, 'constant'], [0.06, 0.6, 'constant'], [0.1, 0.1, 'quadOut'], [0.3, 1]],
  translate: [[0, [dx, dy], 'cubicOut'], [0.4, [0, 0]]],
});
const BOOT_LEFT = bootIn(-24, 0);
const BOOT_RIGHT = bootIn(24, 0);

// "Cover void" warning: hard on/off blink (UMG constant keys), looped.
const BLINK = defineAnimation('Blink', {
  opacity: [[0, 1, 'constant'], [0.6, 0.35, 'constant'], [1.2, 0.35]],
});

const GLYPH = {
  derelict: '/assets/icons/diamond.svg',
  hostile: '/assets/icons/triangle.svg',
  neutral: '/assets/icons/square.svg',
  body: '/assets/icons/circle.svg',
};
const EDGE_INSET = 56;

export default {
  id: 'flight-hud',
  title: 'Flight HUD',
  layer: 'game',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay fhud" data-widget="WBP_FlightHud">

        <!-- Layer 1+2: world markers and off-screen pips (data-positioned) -->
        <div class="s-canvas fhud-contacts hit-invisible" data-widget="SNpContactLayer"></div>

        <!-- Centre reticle -->
        <div class="s-image tint fhud-reticle h-center v-center hit-invisible"
             style="--img:url(/assets/icons/reticle.svg); --w:56px; --h:56px"></div>

        <!-- Layer 3: instruments -->
        <div class="s-safezone">
          <div class="s-vbox fhud-frame">

            <!-- Top row -->
            <div class="s-hbox">
              <div class="s-border brush-chamfer fhud-rating" data-widget="SNpRatingReadout">
                <div class="s-vbox">
                  <div class="s-text ts-label">Reference</div>
                  <div class="s-hbox fhud-rating-row">
                    <div class="s-text ts-readout-lg c-ref v-bottom" data-bind="flight.rating | rating"></div>
                    <div class="s-vbox v-bottom fhud-rating-side">
                      <div class="s-text ts-caption">Policy floor</div>
                      <div class="s-text ts-readout" data-bind="flight.policyFloor | int"></div>
                    </div>
                  </div>
                  <div class="s-text ts-label c-ref" data-bind="flight.rating | bandName"></div>
                  <div class="s-hbox fhud-ladder" data-ref="ladder"></div>
                  <div class="s-border fhud-void" data-bind-visible="flight.belowPolicy">
                    <div class="s-text ts-label c-danger">Below policy · cover void</div>
                  </div>
                </div>
              </div>
              <div class="s-spacer fill"></div>
            </div>

            <div class="s-spacer fill"></div>

            <!-- Bottom row -->
            <div class="s-hbox v-bottom">
              <div class="s-border brush-panel fhud-status" data-widget="SNpShipStatus">
                <div class="s-vbox fhud-bars">
                  ${bar('Hull', 'flight.hull')}
                  ${bar('Power', 'flight.power')}
                  ${bar('Heat', 'flight.heat', 'flight.heatState')}
                </div>
              </div>

              <div class="s-spacer fill"></div>

              <div class="s-border brush-panel fhud-nav" data-widget="SNpNavReadout">
                <div class="s-vbox">
                  <div class="s-text ts-label">Target</div>
                  <div class="s-text ts-heading" data-bind="flight.targetName"></div>
                  <div class="s-hbox fhud-nav-row">
                    <div class="s-vbox np-stat fill">
                      <div class="s-text ts-caption">Range</div>
                      <div class="s-text ts-readout" data-bind="flight.targetDist | distance"></div>
                    </div>
                    <div class="s-vbox np-stat fill">
                      <div class="s-text ts-caption">Closing</div>
                      <div class="s-text ts-readout" data-bind="flight.closing | signedSpeed"></div>
                    </div>
                  </div>
                  <div class="s-box np-rule"></div>
                  <div class="s-hbox fhud-speed">
                    <div class="s-text ts-readout-lg" data-bind="flight.speed | speed"></div>
                    <div class="s-text ts-label v-bottom fhud-unit">m/s</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>`;

    ctx.bind();
    ctx.play(root.querySelector('.fhud-rating'), BOOT_LEFT);
    ctx.play(root.querySelector('.fhud-status'), BOOT_LEFT, { delay: 0.12 });
    ctx.play(root.querySelector('.fhud-nav'), BOOT_RIGHT, { delay: 0.2 });
    ctx.play(root.querySelector('.fhud-void'), BLINK, { loops: Infinity });
    const offLadder = buildLadder(root.querySelector('[data-ref="ladder"]'), ctx.vm.flight);
    const offContacts = mountContacts(root.querySelector('.fhud-contacts'), ctx);
    return () => { offLadder(); offContacts(); };
  },
};

function bar(label, path, statePath) {
  return /* html */ `
    <div class="s-vbox np-bar" ${statePath ? `data-bind-attr="${statePath}:data-state"` : ''}>
      <div class="s-hbox">
        <div class="s-text ts-label fill">${label}</div>
        <div class="s-text ts-readout" data-bind="${path} | pct"></div>
      </div>
      <div class="s-progress" data-bind-pct="${path}"></div>
    </div>`;
}

// The 10 → 0 ladder under the rating, current band lit. Rebuilt on change only.
function buildLadder(el, vm) {
  el.innerHTML = Array.from({ length: 11 }, (_, i) => 10 - i)
    .map((n) => `<div class="s-box fhud-rung" data-n="${n}"></div>`)
    .join('');
  const rungs = [...el.children];
  return vm.on('rating', (r) => {
    const band = Math.floor(r);
    const floor = vm.get('policyFloor');
    for (const rung of rungs) {
      const n = Number(rung.dataset.n);
      rung.classList.toggle('is-current', n === band);
      rung.classList.toggle('is-below-floor', n < floor);
    }
  });
}

// Contacts: one element per contact, keyed by id, repositioned each update.
// On screen → bracketed marker with name + range. Off screen → edge pip with
// the same glyph and colour, plus an arrow.
function mountContacts(layer, ctx) {
  const els = new Map();

  function make(c) {
    const el = document.createElement('div');
    el.className = 'anchored np-contact';
    el.dataset.kind = c.kind;
    el.innerHTML = /* html */ `
      <div class="s-switcher">
        <div class="s-hbox np-marker" data-widget="SNpContactMarker">
          <div class="s-image tint glyph" style="--img:url(${GLYPH[c.kind]})"></div>
          <div class="s-vbox label">
            <div class="s-text name"></div>
            <div class="s-text dist"></div>
          </div>
        </div>
        <div class="s-vbox np-offscreen" data-widget="SNpOffscreenPip">
          <div class="s-image tint arrow" style="--img:url(/assets/icons/arrow.svg)"></div>
          <div class="s-image tint glyph" style="--img:url(${GLYPH[c.kind]})"></div>
          <div class="s-text dist"></div>
        </div>
      </div>`;
    el.querySelector('.name').textContent = c.name;
    layer.appendChild(el);
    return {
      el,
      marker: el.querySelector('.np-marker'),
      pip: el.querySelector('.np-offscreen'),
      arrow: el.querySelector('.arrow'),
      dists: el.querySelectorAll('.dist'),
    };
  }

  const off = ctx.vm.flight.on('contacts', (contacts) => {
    const { w, h } = ctx.uiSize();
    const seen = new Set();
    for (const c of contacts) {
      seen.add(c.id);
      const e = els.get(c.id) ?? els.set(c.id, make(c)).get(c.id);
      const p = placeContact(c.u, c.v, c.behind, w, h, EDGE_INSET);

      e.marker.classList.toggle('active', p.onScreen);
      e.pip.classList.toggle('active', !p.onScreen);
      // On screen the glyph centre sits on the contact; off screen the pip is centred.
      e.el.style.setProperty('--x', `${p.x}px`);
      e.el.style.setProperty('--y', `${p.y}px`);
      e.el.style.setProperty('--px', p.onScreen ? '0.0' : '0.5');
      e.el.style.setProperty('--py', '0.5');
      if (p.onScreen) e.marker.style.translate = '-9px 0'; else e.marker.style.translate = '';
      e.arrow.style.rotate = `${p.angle}rad`;
      const d = distance(c.dist);
      e.dists.forEach((n) => { if (n.textContent !== d) n.textContent = d; });
    }
    for (const [id, e] of els) if (!seen.has(id)) { e.el.remove(); els.delete(id); }
  });

  return () => { off(); els.clear(); };
}
