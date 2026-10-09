// A new tool (user, 2026-10-09: D28): "You received a new tool! BROOM". The first of a
// kind is made active for her (it's on the wheel and in her hands at once), and this is
// the moment that says so: a reward, since the kinds are unknown until she has them.
// Shaped like the fish catch's hold-up (letterbox + big name; in the game she holds it up).
//
//   params   { kind (a TOOL_KINDS entry), part (its parts entry), name, icon, first }
//            first: the first of its kind. Otherwise a later piece (a second broom, a
//            line), which only goes to its page: what that moment says is PROPOSED.
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';

const LETTERBOX = defineAnimation('NewToolLetterbox', { scale: [[0, [1, 0], 'cubicOut'], [0.5, [1, 1]]] });
const HOLDUP_IN = defineAnimation('NewToolIn', {
  opacity: [[0, 0, 'quadOut'], [0.5, 1]],
  scale: [[0, [0.85, 0.85], 'cubicOut'], [0.6, [1, 1]]],
});
const OUT = defineAnimation('NewToolOut', { opacity: [[0, 1, 'quadIn'], [0.3, 0]] });

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (name) => `<div class="s-image tint" style="--img:url(/assets/icons/${name}.svg)"></div>`;

export default {
  id: 'new-tool',
  title: 'A new tool',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const { kind, part, name, first } = ctx.params;
    root.innerHTML = /* html */ `
      <div class="s-overlay gb nw" data-widget="WBP_NewTool" data-first="${!!first}">
        <div class="nw-bar top h-fill v-top"></div>
        <div class="nw-bar bottom h-fill v-bottom"></div>
        <div class="s-vbox nw-holdup h-center v-top ts-world">
          <div class="nw-icon">${icon(ctx.params.icon ?? kind.icon)}</div>
          <div class="s-text nw-kicker">${first ? 'You received a new tool!' : `A new ${esc(part.noun)}!`}</div>
          <div class="s-text gb-display nw-name">${esc(first ? kind.label : name)}</div>
          ${first ? `<div class="s-text gb-h3 nw-piece">${esc(name)}</div>` : ''}
          <div class="s-text gb-small nw-where">${first ? "It's on your tool wheel, and in your hands" : `In your book: Tools › ${esc(kind.label)}`}</div>
        </div>
        <div class="s-vbox nw-continue h-center v-bottom">
          <button class="s-button gb-button primary" data-ok data-focus-default>Lovely ${glyph('confirm', 'sm')}</button>
        </div>
        <div class="s-box nw-note h-left v-bottom"><div class="gb-note on-world">D28: the first of a kind is made active for her and announced. She holds it up in the 3D scene (a short cinematic); here, letterbox + name. A later piece (J again) only goes to its page: that wording is a proposal.</div></div>
      </div>`;

    let closing = false;
    const close = () => { if (!closing) { closing = true; ctx.action('new-tool-done'); } };
    root.querySelector('[data-ok]').onclick = close;
    ctx.onKey((e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); return true; } return false; });

    root.querySelectorAll('.nw-bar').forEach((b) => ctx.play(b, LETTERBOX));
    ctx.play(root.querySelector('.nw-holdup'), HOLDUP_IN, { delay: 0.35 });
    return { outro: () => ctx.play(root.querySelector('.nw'), OUT).finished };
  },
};
