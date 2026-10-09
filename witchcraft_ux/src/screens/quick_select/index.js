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
//
// Tools (user, 2026-10-09: D25): one place per KIND, at a fixed angle (the game's
// tool_wheel_prd), showing that kind's active piece from her collection. Hands free at
// the bottom. A kind she hasn't got:
//   variant 'wheelempty'  hidden  (default) no place at all: the kinds stay unknown
//                         empty   an empty place reading "Something goes here"
// Naming the missing kind ("A place for a fishing rod") is out: it gives it away (2026-10-09).
// The book key while aiming at a tool opens that tool's page (proposed, from the user's idea).
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { SPELLS, TOOL_KINDS, activeTool } from '../../mock/witch.js';
import { bodyName, BODIES } from '../../photo.js';

const IN = defineAnimation('QuickIn', {
  opacity: [[0, 0, 'quadOut'], [0.15, 1]],
  scale: [[0, [0.92, 0.92], 'cubicOut'], [0.2, [1, 1]]],
});
const SCRIM_IN = defineAnimation('QuickScrimIn', { opacity: [[0, 0, 'linear'], [0.15, 1]] });
const OUT = defineAnimation('QuickOut', { opacity: [[0, 1, 'quadIn'], [0.12, 0]] });

const icon = (name) => `<div class="s-image tint" style="--img:url(/assets/icons/${name}.svg)"></div>`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function entries(kind, vm, { showEmpty, camera }) {
  if (kind === 'tool') {
    const held = vm.world.get('tool');
    const places = TOOL_KINDS.flatMap((k) => {
      const t = activeTool(vm.witch, k.id, camera);
      if (t) return [{ id: k.id, tool: k.id, angle: k.angle, name: t.name, icon: t.icon, desc: t.desc, current: held === k.id }];
      return showEmpty ? [{ id: null, angle: k.angle, empty: true, name: 'Something goes here', icon: null, desc: '' }] : [];
    });
    return [...places, { id: null, angle: 180, name: 'Hands free', icon: 'circle', desc: 'Put it away.', current: held === null }]
      .sort((a, b) => a.angle - b.angle);
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
    const list = entries(kind, ctx.vm, {
      showEmpty: ctx.variant('wheelempty') === 'empty',
      camera: (id) => ({ name: bodyName(id, ctx.variant('names') ?? 'anagram'), desc: BODIES[id]?.desc }),
    });
    const R = 230; // wheel radius

    const slot = (e, i) => {
      // A tool's place is fixed by its kind (clockwise from the top); spells share the ring evenly.
      const a = e.angle !== undefined ? (e.angle - 90) * Math.PI / 180 : (i / list.length) * Math.PI * 2 - Math.PI / 2;
      const pos = shape === 'radial' ? `style="--x:${Math.cos(a) * R}px; --y:${Math.sin(a) * R}px"` : '';
      return /* html */ `
        <button class="s-button qs-slot ${shape === 'radial' ? 'anchored' : ''} ${e.empty ? 'empty' : ''}" ${pos}
          data-i="${i}" data-aff="${e.affinity ?? ''}" aria-selected="${!!e.current}" ${e.current ? 'data-focus-default' : ''}>
          ${e.icon ? icon(e.icon) : ''}
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
          <div class="gb-note on-world">${kind === 'tool' ? 'T again / Enter picks · I opens the aimed tool\'s page (proposed) · Esc cancels. One place per kind; variant <b>Wheel: missing tool</b>' : 'Tab again / Enter picks · Esc cancels'}. The world carries on while this is open (D3).</div>
        </div>
      </div>`;

    const detail = root.querySelector('[data-detail]');
    const title = kind === 'tool' ? 'Tools' : 'Spells';
    const showDetail = (e) => {
      detail.innerHTML = /* html */ `
        <div class="s-text gb-label just-center">${title}</div>
        <div class="s-text gb-h2 just-center">${esc(e.name)}</div>
        ${e.meta ? `<div class="s-text gb-small just-center qs-meta">${esc(e.meta)}</div>` : ''}
        <div class="s-text gb-small wrap just-center qs-desc">${esc(e.desc)}</div>
        ${e.tool ? `<div class="s-hbox qs-page">${glyph('satchel', 'sm')}<span class="s-text gb-small">Its page in the book</span></div>` : ''}`;
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
      const k = e.key.toLowerCase();
      const f = buttons.indexOf(document.activeElement);
      // The book key while aiming: the aimed tool's page (Hands free, or nothing: the Satchel).
      if (kind === 'tool' && k === 'i') { ctx.action('tool-page', { kind: list[f]?.tool ?? null }); return true; }
      if (k !== key) return false;
      if (f >= 0) pick(f);
      return true;
    });

    ctx.play(root.querySelector('.qs-scrim'), SCRIM_IN);
    ctx.play(root.querySelector(shape === 'radial' ? '.qs-wheel' : '.qs-bar-wrap'), IN);
    return { outro: () => ctx.play(root.querySelector('.qs'), OUT).finished };
  },
};
