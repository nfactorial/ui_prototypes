// Boarding HUD: first person, on foot inside a derelict.
// The main information is SHIELD + HEALTH (mock/vitals_model.js). Variant
// "vitals" tries four layouts: corner bars, top-centre, bottom-centre, and arcs
// around the crosshair. Everything else stays sparse: the horror register wants
// the player to see very little (pillars.md §3).
import { defineAnimation } from '../../core/motion.js';

const FLASH = defineAnimation('BarFlash', { opacity: [[0, 0.9, 'quadOut'], [0.25, 0]] });
const HIT_EDGE = defineAnimation('HitEdge', { opacity: [[0, 0.85, 'quadOut'], [0.5, 0]] });
const SHAKE = defineAnimation('VitalsShake', {
  translate: [[0, [0, 0], 'linear'], [0.04, [-4, 0], 'linear'], [0.08, [4, 0], 'linear'], [0.12, [-2, 0], 'linear'], [0.16, [0, 0]]],
});

// Bars show "SHIELD" + state, so the state is a single word ("SHIELD DOWN").
// Arcs have no name label, so they use the full phrase.
const SHIELD_LABEL = { full: '', damaged: '', recharging: 'Recharging', broken: 'Down' };
const HEALTH_LABEL = { ok: '', danger: 'Critical', dead: 'Flatline' };
const SHIELD_PHRASE = { full: '', damaged: '', recharging: 'Shield recharging', broken: 'Shield down' };
const HEALTH_PHRASE = { ok: '', danger: 'Health critical', dead: 'Flatline' };

// --- markup ---------------------------------------------------------------------
const bar = (kind) => /* html */ `
  <div class="vt-bar" data-kind="${kind}">
    <div class="vt-trail"></div>
    <div class="vt-fill"></div>
    <div class="vt-ticks"></div>   <!-- SLATE: segment texture -->
    <div class="vt-flash"></div>
  </div>`;

const barsBlock = (layout) => /* html */ `
  <div class="s-vbox vt vt--${layout}" data-widget="SNpVitals">
    <div class="s-hbox vt-head">
      <div class="s-text gb-label vt-name">Shield</div>
      <div class="s-text gb-label vt-state fill" data-state-text="shield"></div>
    </div>
    ${bar('shield')}
    ${bar('health')}
    <div class="s-hbox vt-head">
      <div class="s-text gb-label vt-name">Health</div>
      <div class="s-text gb-label vt-state fill" data-state-text="health"></div>
      <div class="s-text vt-num" data-health-num></div>
    </div>
  </div>`;

// Arcs: two arcs either side of the crosshair, drawn with SVG.
// SLATE: a radial-progress UI material (one per arc), or a custom OnPaint widget.
function arcPath(cx, cy, r, a0, a1) {
  const pt = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = pt(a0);
  const [x1, y1] = pt(a1);
  const sweep = a1 > a0 ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 ${sweep} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
const arc = (kind, d) => /* html */ `
  <g class="vt-arc" data-kind="${kind}">
    <path class="vt-arc-track" d="${d}" pathLength="100"/>
    <path class="vt-arc-trail" d="${d}" pathLength="100"/>
    <path class="vt-arc-fill" d="${d}" pathLength="100"/>
  </g>`;
const arcsBlock = () => /* html */ `
  <div class="s-overlay vt vt--arcs h-center v-center" data-widget="SNpVitalsArcs">
    <svg class="vt-arcs-svg" viewBox="0 0 320 320" width="320" height="320">
      ${arc('shield', arcPath(160, 160, 128, 140, 220))}   <!-- left, fills bottom → top -->
      ${arc('health', arcPath(160, 160, 128, 40, -40))}    <!-- right, fills bottom → top -->
    </svg>
    <div class="s-vbox vt-arc-labels h-center v-bottom">
      <div class="s-text gb-label vt-state just-center" data-state-text="shield"></div>
      <div class="s-text gb-label vt-state just-center" data-state-text="health"></div>
    </div>
  </div>`;

export default {
  id: 'boarding-hud',
  title: 'Boarding HUD',
  layer: 'game',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const layout = ctx.variant('vitals') ?? 'corner';
    const vitalsHtml = layout === 'arcs' ? '' : barsBlock(layout);
    const slot = { corner: 'h-left v-bottom', top: 'h-center v-top', bottom: 'h-center v-bottom' }[layout];

    root.innerHTML = /* html */ `
      <div class="s-overlay gb bh" data-widget="WBP_BoardingHud">
        <div class="bh-edge bh-edge--hit hit-invisible"></div>      <!-- SLATE: material (screen-edge vignette) -->
        <div class="bh-edge bh-edge--danger hit-invisible"></div>
        <div class="s-box bh-crosshair h-center v-center hit-invisible" style="--w:4px; --h:4px"></div>
        ${layout === 'arcs' ? arcsBlock() : ''}

        <div class="s-safezone hit-invisible">
          <div class="s-overlay bh-frame">
            <div class="s-vbox bh-objective h-left v-top" data-widget="SNpObjective">
              <div class="s-text gb-label">Objective</div>
              <div class="s-text gb-body" data-bind="boarding.objective"></div>
            </div>

            ${slot ? `<div class="s-box bh-vitals-slot bh-vitals-slot--${layout} ${slot}">${vitalsHtml}</div>` : ''}

            <div class="s-hbox bh-prompt h-center v-bottom" data-widget="SNpInteractPrompt" data-bind-visible="boarding.promptVisible">
              <span class="gb-key" data-bind="boarding.promptKey"></span>
              <span class="s-text gb-h3" data-bind="boarding.promptText"></span>
            </div>

            <div class="s-hbox bh-ammo h-right v-bottom" data-widget="SNpAmmoCounter">
              <div class="s-text bh-ammo-mag" data-bind="boarding.ammo | pad2"></div>
              <div class="s-vbox bh-ammo-side">
                <div class="s-text gb-label">Reserve</div>
                <div class="s-text gb-h3" data-bind="boarding.reserve | int"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="s-vbox bh-dead h-center v-center" data-bind-visible="boarding.dead">
          <div class="s-text bh-dead-title just-center">Suit failure</div>
          <div class="s-text gb-body gb-dim just-center" data-bind="boarding.deadHint"></div>
        </div>
      </div>`;

    const bh = root.querySelector('.bh');
    const vm = ctx.vm.boarding;
    const last = { shield: 1, health: 1 };

    // Set a bar's value. The trail (the chunk just lost) lingers, then drains;
    // gains snap the trail along with the fill.
    const setValue = (kind, pct) => {
      const prev = last[kind];
      last[kind] = pct;
      for (const barEl of root.querySelectorAll(`.vt-bar[data-kind="${kind}"]`)) {
        barEl.style.setProperty('--pct', pct);
        snapOrLag(barEl.querySelector('.vt-trail'), () => barEl.style.setProperty('--trail', pct), pct >= prev);
      }
      for (const g of root.querySelectorAll(`.vt-arc[data-kind="${kind}"]`)) {
        const fill = g.querySelector('.vt-arc-fill');
        fill.style.strokeDasharray = `${pct * 100} 200`;
        fill.style.visibility = pct <= 0.001 ? 'hidden' : ''; // a round cap would still draw a dot at 0
        const trail = g.querySelector('.vt-arc-trail');
        snapOrLag(trail, () => { trail.style.strokeDasharray = `${pct * 100} 200`; }, pct >= prev);
      }
    };
    const snapOrLag = (el, apply, snap) => {
      if (!snap) { apply(); return; }
      el.style.transition = 'none';
      apply();
      el.getBoundingClientRect(); // commit before restoring the transition
      el.style.transition = '';
    };

    const offs = [];
    offs.push(vm.on('shield', (v) => setValue('shield', v)));
    offs.push(vm.on('health', (v) => {
      setValue('health', v);
      root.querySelectorAll('[data-health-num]').forEach((n) => { n.textContent = Math.ceil(v * 100); });
    }));
    offs.push(vm.on('shieldState', (st) => {
      bh.dataset.shield = st;
      root.querySelectorAll('[data-state-text="shield"]').forEach((n) => { n.textContent = (n.closest('.vt--arcs') ? SHIELD_PHRASE : SHIELD_LABEL)[st] ?? ''; });
    }));
    offs.push(vm.on('healthState', (st) => {
      bh.dataset.health = st;
      root.querySelectorAll('[data-state-text="health"]').forEach((n) => { n.textContent = (n.closest('.vt--arcs') ? HEALTH_PHRASE : HEALTH_LABEL)[st] ?? ''; });
      vm.patch({ dead: st === 'dead', deadHint: vm.get('autoCombat') ? 'Respawning…' : 'Reset from the combat lab' });
    }));

    // Hit feedback: flash the bar that took it; health damage also flashes the screen edge.
    offs.push(vm.on('hit', (hit) => {
      if (!hit) return;
      if (hit.toShield) root.querySelectorAll('[data-kind="shield"] .vt-flash').forEach((f) => ctx.play(f, FLASH));
      if (hit.toHealth) {
        root.querySelectorAll('[data-kind="health"] .vt-flash').forEach((f) => ctx.play(f, FLASH));
        ctx.play(root.querySelector('.bh-edge--hit'), HIT_EDGE);
        const v = root.querySelector('.vt');
        if (v) ctx.play(v, SHAKE);
      }
    }, { immediate: false }));

    // Contextual visibility (variant "hudvis"): the vitals fade out once the shield is
    // full, health is fine and nothing has hit you for a few seconds. CSS does the fade.
    let lastHitAt = performance.now();
    offs.push(vm.on('hit', () => { lastHitAt = performance.now(); }, { immediate: false }));
    const idleTimer = setInterval(() => {
      const idle = vm.get('shieldState') === 'full' && vm.get('healthState') === 'ok' && performance.now() - lastHitAt > 3000;
      bh.toggleAttribute('data-idle', idle);
    }, 250);

    ctx.bind();
    const warning = startDangerBeep(vm);
    return () => { offs.forEach((off) => off()); warning(); clearInterval(idleTimer); };
  },
};

// Danger-mode audio cue: a two-tone beep, once a second, while health is critical
// and the lab's "Warning sound" is on. Placeholder for the game's real audio.
function startDangerBeep(vm) {
  let audio = null;
  const beep = () => {
    if (!vm.get('sound') || vm.get('healthState') !== 'danger') return;
    audio ??= new AudioContext();
    const now = audio.currentTime;
    [[880, 0], [660, 0.14]].forEach(([freq, at]) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + at);
      gain.gain.exponentialRampToValueAtTime(0.05, now + at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.12);
      osc.connect(gain).connect(audio.destination);
      osc.start(now + at);
      osc.stop(now + at + 0.13);
    });
  };
  const timer = setInterval(beep, 1000);
  return () => { clearInterval(timer); audio?.close(); };
}
