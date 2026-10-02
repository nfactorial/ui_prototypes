// Fishing feedback (fishing_prd v0.9, built): cast → wait → bite → a timed
// reaction press → "You caught X!" or "It got away." Today the game shows the
// result only as a debug message; this is what it could be.
//
//   params.fish      a FISH entry + { first }   or null = it got away
//   variant 'catch'  card   (a small card low-right, play carries on)
//                    holdup (Animal Crossing's hold-up moment: letterbox + big name,
//                            cinematic_sequences.md §3.1)
//
// The bite itself has no UI in the design (the bobber and the sound do it). The
// optional "!" is here to be judged, as variant 'bite'.
import { defineAnimation, wait } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { whereLabel } from '../../mock/witch.js';

const BITE = defineAnimation('FishBite', {
  opacity: [[0, 0, 'quadOut'], [0.08, 1, 'linear'], [0.7, 1, 'quadIn'], [0.9, 0]],
  scale: [[0, [0.4, 0.4], 'cubicOut'], [0.15, [1.15, 1.15], 'quadOut'], [0.3, [1, 1]]],
});
const LETTERBOX = defineAnimation('FishLetterbox', { scale: [[0, [1, 0], 'cubicOut'], [0.5, [1, 1]]] });
const HOLDUP_IN = defineAnimation('FishHoldupIn', {
  opacity: [[0, 0, 'quadOut'], [0.5, 1]],
  scale: [[0, [0.85, 0.85], 'cubicOut'], [0.6, [1, 1]]],
});
const CARD_IN = defineAnimation('FishCardIn', {
  opacity: [[0, 0, 'quadOut'], [0.3, 1]],
  translate: [[0, [30, 0], 'cubicOut'], [0.4, [0, 0]]],
});
const OUT = defineAnimation('FishOut', { opacity: [[0, 1, 'quadIn'], [0.3, 0]] });

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const article = (name) => (/^[aeiou]/i.test(name) ? 'an' : 'a');

export default {
  id: 'fishing',
  title: 'Fishing: bite and catch',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const fish = ctx.params.fish ?? null;
    const shape = ctx.variant('catch') ?? 'holdup';
    const showBite = (ctx.variant('bite') ?? 'mark') === 'mark';

    root.innerHTML = /* html */ `
      <div class="s-overlay gb fi" data-widget="WBP_FishingFeedback" data-shape="${shape}" data-rarity="${(fish?.rarity ?? 'common').toLowerCase()}">
        <div class="s-text fi-bite h-center v-center ts-world">!</div>
        <div class="s-overlay fi-result collapsed"></div>
      </div>`;
    const result = root.querySelector('.fi-result');
    const bite = root.querySelector('.fi-bite');
    let dismiss = null;

    function renderResult() {
      result.classList.remove('collapsed');
      if (!fish) {
        result.innerHTML = /* html */ `
          <div class="s-vbox fi-away h-center v-bottom ts-world">
            <div class="s-text gb-h2">It got away.</div>
            <div class="s-text gb-small fi-away-sub">The line goes slack.</div>
          </div>`;
        ctx.play(result, CARD_IN);
        return wait(2.2).finished;
      }
      const name = esc(fish.name);
      if (shape === 'holdup') {
        result.innerHTML = /* html */ `
          <div class="fi-bar top h-fill v-top"></div>
          <div class="fi-bar bottom h-fill v-bottom"></div>
          <div class="s-vbox fi-holdup h-center v-top ts-world">
            ${fish.first ? '<div class="s-text fi-new">First catch!</div>' : ''}
            <div class="s-text fi-you">You caught ${article(fish.name)}</div>
            <div class="s-text gb-display fi-name">${name}</div>
            <div class="s-text gb-label fi-rarity">${esc(fish.rarity)}</div>
          </div>
          <div class="s-vbox fi-continue h-center v-bottom">
            <button class="s-button gb-button primary" data-ok data-focus-default>Lovely ${glyph('confirm', 'sm')}</button>
          </div>
          <div class="s-box fi-note h-left v-bottom"><div class="gb-note on-world">The witch holds it up in the 3D scene (a short cinematic). Here: letterbox + name only.</div></div>`;
        result.querySelectorAll('.fi-bar').forEach((b) => ctx.play(b, LETTERBOX));
        ctx.play(result.querySelector('.fi-holdup'), HOLDUP_IN, { delay: 0.35 });
        result.querySelector('[data-ok]').focus();
        return new Promise((resolve) => { dismiss = resolve; result.querySelector('[data-ok]').onclick = resolve; });
      }
      result.innerHTML = /* html */ `
        <div class="s-border gb-panel fi-card h-right v-bottom">
          <div class="s-hbox fi-card-row">
            <div class="fi-card-icon"><div class="s-image tint" style="--img:url(/assets/icons/fish.svg)"></div></div>
            <div class="s-vbox fill">
              <div class="s-text gb-label fi-rarity">${fish.first ? 'First catch · ' : ''}${esc(fish.rarity)}</div>
              <div class="s-text gb-h2">${name}</div>
              <div class="s-text gb-small">${esc(whereLabel(fish))}</div>
            </div>
          </div>
        </div>`;
      ctx.play(result, CARD_IN);
      return wait(3.2).finished;                 // the card doesn't stop play
    }

    ctx.onKey((e) => {
      if (e.key === 'Enter' && dismiss) { dismiss(); return true; }
      return false;
    });

    (async () => {
      if (showBite) await ctx.play(bite, BITE).finished;
      else await wait(0.6).finished;
      await renderResult();
      await ctx.play(root.querySelector('.fi'), OUT).finished;
      ctx.action('fishing-done', { fish });
    })();
  },
};
