// Quick selectors: swap tool (T) or choose a spell from the loadout (Tab),
// in-game, without opening the book. (user, 2026-09-29: "swapping tools, opening
// inventory, choosing spells will all need UI in-game".)
//
//   params.kind   'tool' | 'spell'
//   variant 'selector'  radial (a wheel round the witch) | bar (a row, low centre)
//
// Toggle behaviour here: the same key again (or Enter / click) picks the focused
// one, Esc cancels. Hold-to-open / release-to-pick is the likely gamepad version
// (a setting sketched in Settings > Controls).
import { defineAnimation } from '../../core/motion.js';
import { ITEMS, SPELLS } from '../../mock/witch.js';

const IN = defineAnimation('QuickIn', {
  opacity: [[0, 0, 'quadOut'], [0.15, 1]],
  scale: [[0, [0.92, 0.92], 'cubicOut'], [0.2, [1, 1]]],
});
const SCRIM_IN = defineAnimation('QuickScrimIn', { opacity: [[0, 0, 'linear'], [0.15, 1]] });
const OUT = defineAnimation('QuickOut', { opacity: [[0, 1, 'quadIn'], [0.12, 0]] });

const icon = (name) => `<div class="s-image tint" style="--img:url(/assets/icons/${name}.svg)"></div>`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function entries(kind, vm) {
  if (kind === 'tool') {
    const tools = vm.witch.get('satchel').filter((s) => s && ITEMS[s.item]?.tool).map((s) => s.item);
    return [
      { id: null, name: 'Hands free', icon: 'circle', desc: 'Put it away.', current: vm.world.get('tool') === null },
      ...tools.map((id) => ({ id, name: ITEMS[id].name, icon: ITEMS[id].icon, desc: ITEMS[id].desc, affinity: ITEMS[id].affinity, current: vm.world.get('tool') === id })),
    ];
  }
  return vm.witch.get('loadout').map((id, i) => {
    const s = SPELLS.find((x) => x.id === id);
    if (!s) return { id: null, index: i, empty: true, name: 'Empty', icon: 'sparkle', desc: 'Choose a spell for this slot in your spellbook (K).' };
    const cost = s.cost === 'reagent' ? `Needs ${s.reagent}` : s.cost === 'ritual' ? 'A ritual: walk the figure' : 'Free to cast';
    return { id, index: i, name: s.name, icon: s.icon, desc: s.desc, meta: cost, affinity: s.affinity, current: vm.world.get('activeSpell') === i };
  });
}

export default {
  id: 'quick-select',
  title: 'Quick selector',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const kind = ctx.params.kind ?? 'spell';
    const shape = ctx.variant('selector') ?? 'radial';
    const list = entries(kind, ctx.vm);
    const R = 230; // wheel radius

    const slot = (e, i) => {
      const a = (i / list.length) * Math.PI * 2 - Math.PI / 2;
      const pos = shape === 'radial' ? `style="--x:${Math.cos(a) * R}px; --y:${Math.sin(a) * R}px"` : '';
      return /* html */ `
        <button class="s-button qs-slot ${shape === 'radial' ? 'anchored' : ''} ${e.empty ? 'empty' : ''}" ${pos}
          data-i="${i}" data-aff="${e.affinity ?? ''}" aria-selected="${!!e.current}" ${e.current ? 'data-focus-default' : ''}>
          ${icon(e.icon)}
          ${kind === 'spell' ? `<span class="qs-num">${i + 1}</span>` : ''}
        </button>`;
    };

    root.innerHTML = /* html */ `
      <div class="s-overlay gb qs" data-widget="WBP_QuickSelect" data-shape="${shape}" data-kind="${kind}">
        <div class="s-border qs-scrim"></div> <!-- SLATE: SBackgroundBlur if blurred; here a darkening only -->
        ${shape === 'radial' ? /* html */ `
          <div class="s-overlay qs-wheel h-center v-center">
            <div class="qs-ring"></div>
            <div class="s-canvas qs-canvas">${list.map(slot).join('')}</div>
            <div class="s-vbox qs-centre h-center v-center" data-detail></div>
          </div>` : /* html */ `
          <div class="s-vbox qs-bar-wrap h-center v-bottom">
            <div class="s-vbox qs-bar-detail" data-detail></div>
            <div class="s-border gb-panel qs-bar"><div class="s-hbox qs-row">${list.map(slot).join('')}</div></div>
          </div>`}
        <div class="s-vbox qs-note h-left v-bottom">
          <div class="gb-note on-world">${kind === 'tool' ? 'T again / Enter picks · Esc cancels' : 'Tab again / Enter picks · Esc cancels'}. The world carries on while this is open (D3).</div>
        </div>
      </div>`;

    const detail = root.querySelector('[data-detail]');
    const title = kind === 'tool' ? 'Tools' : 'Spells';
    const showDetail = (e) => {
      detail.innerHTML = /* html */ `
        <div class="s-text gb-label just-center">${title}</div>
        <div class="s-text gb-h2 just-center">${esc(e.name)}</div>
        ${e.meta ? `<div class="s-text gb-small just-center qs-meta">${esc(e.meta)}</div>` : ''}
        <div class="s-text gb-small wrap just-center qs-desc">${esc(e.desc)}</div>`;
    };
    const buttons = [...root.querySelectorAll('.qs-slot')];
    const pick = (i) => {
      const e = list[i];
      if (e.empty) return;
      ctx.action(kind === 'tool' ? 'select-tool' : 'select-spell', { id: e.id, index: e.index });
    };
    buttons.forEach((b) => {
      b.addEventListener('focus', () => showDetail(list[b.dataset.i]));
      b.onclick = () => pick(Number(b.dataset.i));
    });
    showDetail(list.find((e) => e.current) ?? list[0]);

    const key = kind === 'tool' ? 't' : 'tab';
    ctx.onKey((e) => {
      if (e.key.toLowerCase() !== key) return false;
      const f = buttons.indexOf(document.activeElement);
      if (f >= 0) pick(f);
      return true;
    });

    ctx.play(root.querySelector('.qs-scrim'), SCRIM_IN);
    ctx.play(root.querySelector(shape === 'radial' ? '.qs-wheel' : '.qs-bar-wrap'), IN);
    return { outro: () => ctx.play(root.querySelector('.qs'), OUT).finished };
  },
};
