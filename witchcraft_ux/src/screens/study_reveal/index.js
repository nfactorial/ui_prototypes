// Study progress (user, 2026-09-29): when studying an animal teaches her something,
// a moment like the fish catch: "Aha!", the creature, its study meter filling a
// pip, and the charm reagent she just learned (possibly "Unknown flower": a reason
// to go and find it). On completion: she knows how to charm it now.
//
//   params   { creature, reagent, complete }
//   variant 'insight'  card    (fades by itself; play carries on)
//                      moment  (bigger; waits for a press, like the catch hold-up)
import { defineAnimation, wait } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { resolveIngredient } from '../../knowledge.js';
import { studyKnown, studyTotal } from '../../mock/witch.js';

const IN = defineAnimation('InsightIn', {
  opacity: [[0, 0, 'quadOut'], [0.3, 1]],
  scale: [[0, [0.9, 0.9], 'cubicOut'], [0.4, [1, 1]]],
});
const AHA = defineAnimation('InsightAha', {
  opacity: [[0, 0, 'quadOut'], [0.25, 1]],
  angle: [[0, -12, 'cubicOut'], [0.45, -4]],
  scale: [[0, [1.5, 1.5], 'cubicOut'], [0.45, [1, 1]]],
});
const PIP = defineAnimation('InsightPip', {          // the new pip fills with a little pop
  scale: [[0, [1, 1], 'quadOut'], [0.15, [1.5, 1.5], 'quadIn'], [0.35, [1, 1]]],
});
const CHIP = defineAnimation('InsightChip', {
  opacity: [[0, 0, 'quadOut'], [0.3, 1]],
  translate: [[0, [0, 12], 'cubicOut'], [0.35, [0, 0]]],
});
const OUT = defineAnimation('InsightOut', { opacity: [[0, 1, 'quadIn'], [0.35, 0]] });

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (name) => `<div class="s-image tint" style="--img:url(/assets/icons/${name}.svg)"></div>`;

export default {
  id: 'study-reveal',
  title: 'Study: something learned',
  layer: 'gamemenu',
  styles: [new URL('../book/style.css', import.meta.url).href, new URL('./style.css', import.meta.url).href],   // the book's ingredient chip

  mount(root, ctx) {
    const { creature, reagent, complete } = ctx.params;
    const moment = (ctx.variant('insight') ?? 'moment') === 'moment';
    const g = resolveIngredient(ctx.vm.witch, reagent);
    const steps = studyKnown(creature);                     // pips now filled (the last one is new)
    const total = studyTotal(creature);                     // one pip per charm ingredient

    root.innerHTML = /* html */ `
      <div class="s-overlay gb sr" data-look="${moment ? 'moment' : 'card'}" data-widget="WBP_StudyReveal">
        <div class="sr-shade hit-invisible"></div>
        <div class="s-vbox gb-panel sr-card">
          <div class="s-hbox sr-head">
            <span class="sr-spark">${icon('sparkle')}</span>
            <span class="s-text sr-aha">Aha!</span>
          </div>
          <div class="s-text gb-small sr-sub">${complete ? 'You finally understand the' : 'You noticed something about the'}</div>
          <div class="s-text gb-title sr-name">${esc(creature.name)}</div>
          <div class="s-hbox sr-pips">${Array.from({ length: total }, (_, n) => `<span class="sr-pip ${n < steps ? 'on' : ''} ${n === steps - 1 ? 'new' : ''}"></span>`).join('')}</div>
          <div class="s-vbox sr-learned">
            <span class="s-text gb-label">${complete ? 'The last thing its charm needs' : 'Its charm will need'}</span>
            <span class="s-hbox bk-reagent sr-chip ${g.known ? (g.carried ? 'carried' : '') : 'unknown'}">${icon(g.icon)}<span class="s-text gb-body">${esc(g.name)}</span></span>
            ${g.known ? '' : `<span class="s-text gb-small sr-hint">You haven't found this yet</span>`}
          </div>
          ${complete ? `<div class="s-text wrap gb-body sr-complete">You know how to charm the ${esc(creature.name.toLowerCase())} now. <span class="gb-dim">(Recipes › Charms)</span></div>` : ''}
          ${moment ? `<button class="s-button gb-button primary sr-ok" data-focus-default>Noted ${glyph('confirm', 'sm')}</button>` : ''}
        </div>
        <div class="s-box sr-note h-left v-bottom"><div class="gb-note on-world">Proposed. Variant: Insight (card fades by itself / moment waits for a press). N in the world studies the next animal.</div></div>
      </div>`;

    const card = root.querySelector('.sr-card');
    let done;
    const finished = new Promise((r) => { done = r; });
    const ok = root.querySelector('.sr-ok');
    if (ok) ok.onclick = () => done();
    ctx.onKey((e) => { if (moment && (e.key === 'Enter' || e.key === ' ')) { done(); return true; } return false; });

    (async () => {
      ctx.play(card, IN);
      ctx.play(root.querySelector('.sr-head'), AHA, { delay: 0.1 });
      const pip = root.querySelector('.sr-pip.new');
      if (pip) ctx.play(pip, PIP, { delay: 0.55 });
      ctx.play(root.querySelector('.sr-learned'), CHIP, { delay: 0.8 });
      if (!moment) { await wait(4.5).finished; done(); }
      await finished;
      await ctx.play(root.querySelector('.sr'), OUT).finished;
      ctx.action('study-done', { creature });
    })();
  },
};
