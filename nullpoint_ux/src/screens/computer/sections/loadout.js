// Loadout: personal kit for boarding. Set here, locked once off the ship (flow.md F5).
import { loadoutSlots, itemTip, itemInfo } from '../../../mock/computer.js';
import { selectableList } from '../list.js';

export default function render(el, ctx) {
  el.innerHTML = /* html */ `
    <div class="s-hbox comp-split">
      <div class="s-vbox comp-list" data-slots></div>
      <div class="s-vbox fill comp-center">
        <div class="s-image cover fill comp-figure" style="--img:url(/assets/art/boarding_01.jpg); --focus:56% 40%"></div>
        <div class="gb-note">F5: what you configure here is what you board with. It can't be changed once you've left the ship.</div>
      </div>
      <div class="s-vbox comp-list comp-options" data-options></div>
    </div>`;

  const optionsEl = el.querySelector('[data-options]');
  const slotHtml = (s) => /* html */ `
    <span class="s-vbox comp-card">
      <span class="s-text gb-label">${s.label}</span>
      <span class="s-text gb-h3">${ctx.vm.computer.get('loadout')[s.id]}</span>
    </span>`;

  const slots = selectableList(el.querySelector('[data-slots]'), loadoutSlots, {
    render: slotHtml,
    onPreview: (slot) => {
      const equipped = ctx.vm.computer.get('loadout')[slot.id];
      optionsEl.innerHTML = /* html */ `
        <div class="s-text gb-label comp-options-head">${slot.label}: options</div>
        ${slot.options.map((o) => /* html */ `
          <button class="s-button gb-card" data-option="${o}" aria-selected="${o === equipped}" ${itemTip(o, slot.label)} data-tip-place="left">
            <span class="s-hbox"><span class="s-text gb-h3 fill">${o}</span>${o === equipped ? '<span class="s-text gb-label">Equipped</span>' : ''}</span>
            <span class="s-text gb-small wrap">${itemInfo[o]?.body ?? ''}</span>
          </button>`).join('')}`;
      optionsEl.querySelectorAll('[data-option]').forEach((b) => {
        b.onclick = () => {
          ctx.vm.computer.set('loadout', { ...ctx.vm.computer.get('loadout'), [slot.id]: b.dataset.option });
          slots.refresh(slot.id, slotHtml(slot));
          const focused = b.dataset.option;
          // re-render options to move the Equipped mark, keeping focus on the clicked one
          el.querySelector(`[data-id="${slot.id}"]`).dispatchEvent(new Event('focus'));
          optionsEl.querySelector(`[data-option="${CSS.escape(focused)}"]`)?.focus({ preventScroll: true });
        };
      });
    },
  });
}
