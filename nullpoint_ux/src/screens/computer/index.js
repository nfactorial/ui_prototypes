// The computer (flow.md F3, F5–F8): the player's in-game menus. Opens with C
// anywhere aboard your own ship, pauses the world, never available off-ship.
//
// Variant "computer" (harness toolbar) tries both presentations:
//   overlay     the world stays visible, blurred, behind the UI
//   fullscreen  its own opaque display: "in the computer"
import { defineAnimation } from '../../core/motion.js';
import missions from './sections/missions.js';
import loadout from './sections/loadout.js';
import ship from './sections/ship.js';
import records from './sections/records.js';

const SECTIONS = [
  { id: 'missions', label: 'Missions', render: missions },
  { id: 'loadout', label: 'Loadout', render: loadout },
  { id: 'ship', label: 'Ship', render: ship },
  { id: 'records', label: 'Records', render: records },
];

// Overlay: backing fades in, content rises. Fullscreen: the display powers on.
const BACKING_IN = defineAnimation('BackingIn', { opacity: [[0, 0, 'linear'], [0.18, 1]] });
const FRAME_RISE = defineAnimation('FrameRise', {
  opacity: [[0, 0, 'quadOut'], [0.2, 1]],
  translate: [[0, [0, 30], 'cubicOut'], [0.3, [0, 0]]],
});
const FRAME_POWER_ON = defineAnimation('FramePowerOn', {
  opacity: [[0, 0, 'constant'], [0.02, 1]],
  scale: [[0, [1, 0.01], 'cubicOut'], [0.16, [1, 1]]],
});
const OUT = defineAnimation('Out', { opacity: [[0, 1, 'quadIn'], [0.14, 0]] });

export default {
  id: 'computer',
  title: 'Computer',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay gb comp" data-widget="WBP_Computer">
        <div class="s-border comp-backing"></div>
        <div class="s-vbox comp-frame">

          <div class="s-hbox comp-head">
            <div class="s-vbox comp-ship">
              <div class="s-text gb-label">Aboard</div>
              <div class="s-text gb-h2">The Kestrel</div>
            </div>
            <div class="s-hbox fill comp-tabs" role="tablist" data-nav-down=".comp-section.active .comp-list [aria-selected='true']">
              <span class="gb-key comp-tabkey">Q</span>
              ${SECTIONS.map((s, i) => `<button class="s-button gb-tab" data-tab="${s.id}" aria-selected="${i === 0}" ${i === 0 ? 'data-focus-default' : ''}>${s.label}</button>`).join('')}
              <button class="s-button gb-tab" disabled data-tip-kind="unavailable" data-tip-meta="Not designed yet" data-tip-title="Map" data-tip-body="Free exploration makes a system map likely. Destiny-style map-as-hub is a candidate (flow.md)." data-tip-place="below">Map</button>
              <span class="gb-key comp-tabkey">E</span>
            </div>
            <button class="s-button gb-button comp-close" data-close>Close <span class="gb-key">C</span></button>
          </div>
          <div class="gb-rule"></div>

          <div class="s-switcher fill comp-body">
            ${SECTIONS.map((s, i) => `<div class="comp-section ${i === 0 ? 'active' : ''}" data-section="${s.id}"></div>`).join('')}
          </div>

          <div class="s-hbox comp-foot">
            <div class="gb-note">Grey-box. The world is paused while this is open (F8). Map and Crew are open questions.</div>
          </div>
        </div>
      </div>`;

    for (const s of SECTIONS) s.render(root.querySelector(`[data-section="${s.id}"]`), ctx);

    const tabs = [...root.querySelectorAll('[data-tab]')];
    const showTab = (id, focus) => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
      root.querySelectorAll('[data-section]').forEach((s) => s.classList.toggle('active', s.dataset.section === id));
      if (focus) tabs.find((t) => t.dataset.tab === id)?.focus({ preventScroll: true });
    };
    tabs.forEach((t) => { t.onclick = () => showTab(t.dataset.tab); });

    // Q / E cycle sections from anywhere in the computer (shoulder buttons on a pad).
    ctx.onKey((e) => {
      const k = e.key.toLowerCase();
      if (k !== 'q' && k !== 'e') return false;
      const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      const n = (i + (k === 'e' ? 1 : -1) + tabs.length) % tabs.length;
      showTab(tabs[n].dataset.tab, true);
      return true;
    });

    root.querySelector('[data-close]').onclick = () => ctx.action('close-computer');

    const backing = root.querySelector('.comp-backing');
    const frame = root.querySelector('.comp-frame');
    ctx.play(backing, BACKING_IN);
    ctx.play(frame, ctx.variant('computer') === 'fullscreen' ? FRAME_POWER_ON : FRAME_RISE);

    return {
      outro: () => ctx.play(root.querySelector('.comp'), OUT).finished,
    };
  },
};
