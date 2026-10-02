// Ship: hull and hardpoint modules (flow.md F6). Hardpoints exist as game data;
// modules are specified in the game's ship PRD but unbuilt. Scanners live here
// (scanning.md S1, S2).
import { hardpoints, itemTip } from '../../../mock/computer.js';
import { selectableList } from '../list.js';

// Where each hardpoint sits on the hull image, as anchors (0..1).
const PINS = { sensor1: [0.78, 0.3], sensor2: [0.7, 0.62], weapon: [0.5, 0.2], utility: [0.24, 0.7] };

export default function render(el, ctx) {
  el.innerHTML = /* html */ `
    <div class="s-hbox comp-split">
      <div class="s-vbox comp-list" data-points></div>
      <div class="s-vbox fill comp-center">
        <div class="s-hbox comp-hull-head">
          <div class="s-vbox fill">
            <div class="s-text gb-label">Hull</div>
            <div class="s-text gb-h2">Test ship (DA_TestShip)</div>
          </div>
          <button class="s-button gb-button" disabled data-tip-kind="unavailable" data-tip-meta="Unavailable" data-tip-title="Change hull" data-tip-body="Getting a new ship means an economy, which is cut for now (pillars §5, §7)." data-tip-place="below">Change hull</button>
        </div>
        <div class="s-overlay fill">
          <div class="gb-placeholder">Ship image: hull with hardpoints</div>
          <div class="s-canvas comp-pins">
            ${hardpoints.map((h, i) => `<div class="anchored comp-pin" data-pin="${h.id}" style="--ax:${PINS[h.id][0]}; --ay:${PINS[h.id][1]}; --px:0.5; --py:0.5">${i + 1}</div>`).join('')}
          </div>
        </div>
        <div class="gb-note">Changing hull is ship acquisition, which is an economy: cut for now (pillars §5, §7).</div>
      </div>
      <div class="s-vbox comp-list comp-options" data-options></div>
    </div>`;

  const optionsEl = el.querySelector('[data-options]');
  const pointHtml = (h) => /* html */ `
    <span class="s-vbox comp-card">
      <span class="s-text gb-label">${hardpoints.indexOf(h) + 1} · ${h.label}</span>
      <span class="s-text gb-h3">${ctx.vm.computer.get('modules')[h.id]}</span>
    </span>`;

  const points = selectableList(el.querySelector('[data-points]'), hardpoints, {
    render: pointHtml,
    onPreview: (h) => {
      el.querySelectorAll('[data-pin]').forEach((p) => p.classList.toggle('is-selected', p.dataset.pin === h.id));
      const fitted = ctx.vm.computer.get('modules')[h.id];
      optionsEl.innerHTML = /* html */ `
        <div class="s-text gb-label comp-options-head">${h.label}: modules</div>
        ${h.options.map((o) => /* html */ `
          <button class="s-button gb-card" data-option="${o}" aria-selected="${o === fitted}" ${itemTip(o, h.label)} data-tip-place="left">
            <span class="s-hbox"><span class="s-text gb-h3 fill">${o}</span>${o === fitted ? '<span class="s-text gb-label">Fitted</span>' : ''}</span>
            <span class="s-text gb-small">${h.note ?? 'Details to come'}</span>
          </button>`).join('')}`;
      optionsEl.querySelectorAll('[data-option]').forEach((b) => {
        b.onclick = () => {
          ctx.vm.computer.set('modules', { ...ctx.vm.computer.get('modules'), [h.id]: b.dataset.option });
          points.refresh(h.id, pointHtml(h));
          const chosen = b.dataset.option;
          el.querySelector(`[data-id="${h.id}"]`).dispatchEvent(new Event('focus'));
          optionsEl.querySelector(`[data-option="${CSS.escape(chosen)}"]`)?.focus({ preventScroll: true });
        };
      });
    },
  });
}
