// Tooltips: hover (or keyboard-focus) something for a moment and it explains
// itself. Declared in markup, no JS per screen:
//
//   data-tip="Plain one-line text"
//   data-tip-title="Carbine"                  rich tooltip: title…
//   data-tip-meta="Primary weapon"            …a small label above it…
//   data-tip-body="Reliable at mid range."    …a description…
//   data-tip-stats="Damage:32|Range:Medium"   …and a stat table
//   data-tip-place="below"                    right (default) · left · below · above
//   data-tip-kind="unavailable"               styles it as "why is this disabled?"
//
// It positions beside the target, flips if it would leave the screen, and clamps
// inside it. Rendered into the 'notify' layer. Port: Slate's ToolTip attribute
// with a custom SToolTip widget (or UMG's tooltip widget binding).

import { play, defineAnimation } from './motion.js';

const DELAY_MS = 380;
const GAP = 12;
const MARGIN = 16;
const SELECTOR = '[data-tip], [data-tip-title]';
const FADE_IN = defineAnimation('TooltipIn', {
  opacity: [[0, 0, 'quadOut'], [0.12, 1]],
  translate: [[0, [0, 4], 'cubicOut'], [0.16, [0, 0]]],
});

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function installTooltips({ uiRoot, layerEl, stage }) {
  layerEl.innerHTML = '<div class="s-canvas gb tt-canvas hit-invisible"></div>';
  const canvas = layerEl.firstElementChild;
  let tip = null;
  let target = null;
  let timer = null;

  function content(el) {
    const d = el.dataset;
    if (!d.tipTitle) return `<div class="s-text gb-body wrap tt-plain">${esc(d.tip)}</div>`;
    const stats = (d.tipStats ?? '').split('|').filter(Boolean).map((row) => row.split(':'));
    return /* html */ `
      ${d.tipMeta ? `<div class="s-text gb-label tt-meta">${esc(d.tipMeta)}</div>` : ''}
      <div class="s-text gb-h3 tt-title">${esc(d.tipTitle)}</div>
      ${d.tipBody ? `<div class="s-text gb-small wrap tt-body">${esc(d.tipBody)}</div>` : ''}
      ${stats.length ? `<div class="s-grid tt-stats">${stats.map(([k, v]) =>
        `<div class="s-text gb-label">${esc(k)}</div><div class="s-text gb-body just-right">${esc(v)}</div>`).join('')}</div>` : ''}`;
  }

  function hide() {
    clearTimeout(timer);
    timer = null;
    target = null;
    tip?.remove();
    tip = null;
  }

  function show(el) {
    hide();
    target = el;
    tip = document.createElement('div');
    tip.className = 'anchored s-border tt';
    tip.dataset.widget = 'SNpTooltip';
    if (el.dataset.tipKind) tip.dataset.kind = el.dataset.tipKind;
    tip.innerHTML = `<div class="s-vbox tt-inner">${content(el)}</div>`;
    tip.style.visibility = 'hidden';
    canvas.appendChild(tip);

    // Target rect in UI units (the stage and UI root are both scaled).
    const root = uiRoot.getBoundingClientRect();
    const k = root.width / stage.uiSize.w;
    const r = el.getBoundingClientRect();
    const t = { x: (r.left - root.left) / k, y: (r.top - root.top) / k, w: r.width / k, h: r.height / k };
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const W = stage.uiSize.w;
    const H = stage.uiSize.h;

    const spots = {
      right: [t.x + t.w + GAP, t.y],
      left: [t.x - tw - GAP, t.y],
      below: [t.x, t.y + t.h + GAP],
      above: [t.x, t.y - th - GAP],
    };
    const fits = ([x, y]) => x >= MARGIN && y >= MARGIN && x + tw <= W - MARGIN && y + th <= H - MARGIN;
    const order = { right: ['right', 'left', 'below', 'above'], left: ['left', 'right', 'below', 'above'],
      below: ['below', 'above', 'right', 'left'], above: ['above', 'below', 'right', 'left'] }[el.dataset.tipPlace ?? 'right'];
    let [x, y] = spots[order.find((p) => fits(spots[p])) ?? order[0]];
    x = Math.min(Math.max(x, MARGIN), W - tw - MARGIN);
    y = Math.min(Math.max(y, MARGIN), H - th - MARGIN);

    tip.style.setProperty('--x', `${x}px`);
    tip.style.setProperty('--y', `${y}px`);
    tip.style.visibility = '';
    play(tip, FADE_IN);
  }

  function arm(el) {
    if (el === target) return;
    hide();
    target = el;
    timer = setTimeout(() => { if (target === el && el.isConnected) show(el); }, DELAY_MS);
  }

  uiRoot.addEventListener('pointerover', (e) => {
    const el = e.target.closest?.(SELECTOR);
    if (el && uiRoot.contains(el)) arm(el);
    else if (target) hide();
  });
  uiRoot.addEventListener('pointerleave', hide);

  // Disabled controls don't reliably receive pointer events in Chrome, but a
  // tooltip explaining *why* something is disabled is exactly what we want.
  // So they're pointer-events:none (feedback.css) and hit-tested here instead.
  const DISABLED = '[disabled][data-tip], [disabled][data-tip-title]';
  uiRoot.addEventListener('pointermove', (e) => {
    if (e.target.closest?.(SELECTOR)) return; // an enabled target: pointerover handles it
    const hit = [...uiRoot.querySelectorAll(DISABLED)].find((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (hit) arm(hit);
    else if (target?.matches(DISABLED)) hide();
  });
  // Focus shows tooltips only when the player is actually using the keyboard,
  // not when a screen focuses its default button on open.
  let keyboardMode = false;
  window.addEventListener('pointermove', () => { keyboardMode = false; }, true);
  uiRoot.addEventListener('focusin', (e) => {
    if (!keyboardMode) return;
    const el = e.target.closest?.(SELECTOR);
    if (el) arm(el);
    else if (target) hide();
  });
  window.addEventListener('keydown', (e) => {
    keyboardMode = true;
    if (!/^Arrow/.test(e.key)) hide();
  }, true);
  window.addEventListener('pointerdown', hide, true);

  return { hide };
}
