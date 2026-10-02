// Talking to villagers (user, 2026-09-29: lean Animal Crossing; animalese audio
// planned). One widget, two looks to compare (variant 'speech'):
//   panel   a wide panel low on screen, a tilted name tag (AC:NH)
//   bubble  a speech bubble with a tail, above where the speaker stands
// Text types out; each typed letter babbles (src/babble.js, variant 'babble').
// Enter / Space / G: finish the line, then next. Replies are buttons.
//   params.who   a key of TALKS (src/mock/talk.js)
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { SPEAKERS, TALKS } from '../../mock/talk.js';
import { blip, BABBLE_CAP } from '../../babble.js';

const IN = defineAnimation('TalkIn', {
  opacity: [[0, 0, 'quadOut'], [0.18, 1]],
  scale: [[0, [0.94, 0.94], 'cubicOut'], [0.22, [1, 1]]],
});
const OUT = defineAnimation('TalkOut', { opacity: [[0, 1, 'quadIn'], [0.15, 0]] });
const NEXT = defineAnimation('TalkNext', { translate: [[0, [0, 0], 'quadInOut'], [0.4, [0, 5], 'quadInOut'], [0.8, [0, 0]]] });
const CHOICE_IN = defineAnimation('TalkChoices', {
  opacity: [[0, 0, 'quadOut'], [0.2, 1]],
  translate: [[0, [16, 0], 'cubicOut'], [0.25, [0, 0]]],
});

const CPS = 34;                                   // characters per second
const PAUSE = { '.': 7, '!': 7, '?': 7, ',': 3, '…': 9 };   // extra beats after punctuation
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// "*word*" → segments [{ text, em }]
const parse = (line) => line.split(/(\*[^*]+\*)/).filter(Boolean).map((t) => (t.startsWith('*') ? { text: t.slice(1, -1), em: true } : { text: t, em: false }));

export default {
  id: 'dialogue',
  title: 'Dialogue',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const who = ctx.params.who ?? 'Hazel';
    const talk = TALKS[who];
    const speaker = SPEAKERS[who];
    const look = ctx.variant('speech') ?? 'panel';
    const voiced = (ctx.variant('babble') ?? 'on') === 'on';

    root.innerHTML = /* html */ `
      <div class="s-overlay gb dl" data-look="${look}" style="--who:${speaker.color}" data-widget="WBP_Dialogue">
        <div class="dl-shade hit-invisible"></div>
        <div class="dl-mark hit-invisible"><span class="s-text gb-small">(${who} stands here)</span></div>
        <div class="s-vbox dl-box" tabindex="0" data-focus-default data-widget="WBP_SpeechBox">
          <div class="s-text dl-name">${who}</div>
          <div class="s-text wrap dl-text" data-text></div>
          <div class="dl-next collapsed" data-next>${glyph('confirm', 'sm')}</div>
          <span class="dl-tail"></span>
        </div>
        <div class="s-vbox dl-choices collapsed" data-choices data-widget="WBP_Replies"></div>
        <div class="s-box dl-note h-left v-top"><div class="gb-note on-world">Speculative content. The babble is a synthesised stand-in for recorded animalese (1 blip per letter, capped at ${BABBLE_CAP}). Variant: Speech (panel / bubble), Babble.</div></div>
      </div>`;
    const box = root.querySelector('.dl-box');
    const textEl = root.querySelector('[data-text]');
    const nextEl = root.querySelector('[data-next]');
    const choicesEl = root.querySelector('[data-choices]');

    let node = talk.start;
    let lineIx = 0;
    let segs = [];
    let total = 0;       // characters in the line
    let shown = 0;       // characters revealed
    let budget = 0;      // time owed to reveal the next character
    let typing = false;

    function paint() {
      let left = shown;
      textEl.innerHTML = segs.map((s) => {
        const part = s.text.slice(0, Math.max(0, left));
        left -= s.text.length;
        return s.em ? `<span class="dl-em">${esc(part)}</span>` : esc(part);
      }).join('');
    }
    function startLine() {
      const line = node.lines[lineIx];
      segs = parse(line);
      total = segs.reduce((n, s) => n + s.text.length, 0);
      shown = 0; budget = 0; typing = true;
      nextEl.classList.add('collapsed');
      choicesEl.classList.add('collapsed');
      paint();
    }
    function finishLine() {
      shown = total; typing = false; paint();
      const last = lineIx === node.lines.length - 1;
      if (last && node.choices) showChoices();
      else { nextEl.classList.remove('collapsed'); ctx.play(nextEl, NEXT, { loops: Infinity }); }
    }
    function showChoices() {
      choicesEl.innerHTML = node.choices.map((c, i) => `<button class="s-button gb-card dl-choice" data-i="${i}" ${i === 0 ? 'data-focus-default' : ''}>${esc(c.text)}</button>`).join('');
      choicesEl.classList.remove('collapsed');
      ctx.play(choicesEl, CHOICE_IN);
      choicesEl.querySelectorAll('[data-i]').forEach((b) => { b.onclick = () => go(node.choices[b.dataset.i].next); });
      choicesEl.querySelector('button')?.focus({ preventScroll: true });
    }
    function go(next) {
      if (!next) { ctx.action('talk-done', { who }); return; }
      node = talk[next]; lineIx = 0; box.focus({ preventScroll: true }); startLine();
    }
    function advance() {
      if (typing) { finishLine(); return; }                   // first press: show the whole line
      if (!choicesEl.classList.contains('collapsed')) return; // waiting on a reply
      if (lineIx < node.lines.length - 1) { lineIx++; startLine(); return; }
      ctx.action('talk-done', { who });                       // the last line of a goodbye
    }

    // Typing runs on the sim clock, so the harness Pause freezes it for inspection.
    ctx.onTick((t, dt) => {
      if (!typing) return;
      budget += dt * CPS;
      while (typing && budget >= 1) {
        const plain = segs.map((s) => s.text).join('');
        const ch = plain[shown];
        budget -= 1;
        shown++;
        if (voiced && shown <= BABBLE_CAP) {
          // Intonation follows the sentence this letter is in: up into a "?", down into a ".".
          const ending = plain.slice(shown).match(/[.?!]/)?.[0] ?? '.';
          blip(speaker.voice, ch, { progress: (shown % 24) / 24, ending });
        }
        if (PAUSE[ch]) budget -= PAUSE[ch];                    // a beat after punctuation
        if (shown >= total) finishLine();
      }
      if (typing) paint();
    });

    ctx.onKey((e) => {
      const k = e.key.toLowerCase();
      if (k === 'enter' || k === ' ' || k === 'g') {
        if (document.activeElement?.classList.contains('dl-choice')) return false;   // Enter picks the reply
        advance(); return true;
      }
      return false;
    });
    box.onclick = advance;

    startLine();
    ctx.play(root.querySelector('.dl-box'), IN);
    return { outro: () => ctx.play(root.querySelector('.dl'), OUT).finished };
  },
};
