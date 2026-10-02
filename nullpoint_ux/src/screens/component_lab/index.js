// Component lab: a test bench (not a game screen) for the dynamic UI elements.
// Trigger every toast kind, and hover examples of every tooltip form, over a
// realistic backdrop and HUD.
import { TOAST_KINDS } from '../../core/notify.js';
import { itemTip } from '../../mock/computer.js';

const SAMPLES = {
  acquired:  { title: 'Ship logs', body: 'Meridian Cartwright, partial' },
  log:       { title: 'Crew recording, day 212' },
  info:      { label: 'Mission accepted', title: 'The Meridian Cartwright', body: 'Last filed transit at 7.' },
  mission:   { title: 'The Meridian Cartwright', body: 'Nav log recovered intact' },
  objective: { title: 'Find the cargo manifest' },
  powerup:   { title: 'Overcharge ready', body: 'Suit capacitors at full' },
  warning:   { title: 'Oxygen low', body: '15% remaining' },
};
const BURST = ['Hull plating ×3', 'Nav core', 'Coolant cell', 'Ship logs', 'Med kit', 'Unknown artefact'];

export default {
  id: 'component-lab',
  title: 'Component lab',
  layer: 'menu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay gb lab">
        <div class="s-border gb-panel lab-panel h-right v-fill">
          <div class="s-vbox lab-body">
            <div class="s-text gb-h2">Component lab</div>
            <div class="gb-note">Test bench, not a game screen. Switch Style in the toolbar to see each set's take.</div>

            <div class="s-text gb-label lab-head">Toasts</div>
            <div class="s-grid lab-grid">
              ${Object.entries(TOAST_KINDS).map(([k, v]) => /* html */ `
                <button class="s-button gb-button" data-toast="${k}" data-tip="Presentation: ${v.presentation} · ${v.duration}s">${v.label}</button>`).join('')}
              <button class="s-button gb-button lab-wide" data-burst data-tip="Six pickups at once: shows the stack limit (4) and the queue">Burst of pickups ×6</button>
            </div>

            <div class="s-text gb-label lab-head">Tooltips: hover or focus</div>
            <div class="s-vbox lab-tips">
              <button class="s-button gb-button" data-tip="A plain one-line tooltip.">Plain text</button>
              <button class="s-button gb-card" ${itemTip('Breaching rifle', 'Primary weapon')}>
                <span class="s-vbox"><span class="s-text gb-label">Rich: item</span><span class="s-text gb-h3">Breaching rifle</span></span>
              </button>
              <button class="s-button gb-card" ${itemTip('Life-sign scanner', 'Sensor · active')}>
                <span class="s-vbox"><span class="s-text gb-label">Rich: module</span><span class="s-text gb-h3">Life-sign scanner</span></span>
              </button>
              <button class="s-button gb-button" disabled data-tip-kind="unavailable" data-tip-meta="Unavailable" data-tip-title="Tow"
                data-tip-body="Needs a tow line fitted (Ship → Utility).">Disabled, with a reason</button>
              <button class="s-button gb-button" data-tip="Placed below instead of beside." data-tip-place="below">Placement: below</button>
            </div>
          </div>
        </div>
      </div>`;

    root.querySelectorAll('[data-toast]').forEach((b) => {
      b.onclick = () => ctx.toast({ kind: b.dataset.toast, ...SAMPLES[b.dataset.toast] });
    });
    root.querySelector('[data-burst]').onclick = () => BURST.forEach((title) => ctx.toast({ kind: 'acquired', title }));
  },
};
