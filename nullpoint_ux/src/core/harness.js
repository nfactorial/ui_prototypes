// The harness: toolbar, URL-hash state, keyboard shortcuts, overlays, design
// variants and the Slate-outline breadcrumb. None of this is ported.
//
// Harness shortcuts are Shift+letter so plain letters, Esc and arrows are
// free for the game UI itself (C = computer, Esc = pause/back, …).

import { ASPECTS } from './stage.js';

const SAFE_ZONES = { 0: 'Off', 0.025: '2.5%', 0.05: '5% (TV)', 0.1: '10%' };

// Primitive class → Slate widget, for the outline breadcrumb.
const SLATE = {
  's-overlay': 'SOverlay',
  's-hbox': 'SHorizontalBox',
  's-vbox': 'SVerticalBox',
  's-wrapbox': 'SWrapBox',
  's-grid': 'SGridPanel',
  's-uniformgrid': 'SUniformGridPanel',
  's-box': 'SBox',
  's-border': 'SBorder',
  's-spacer': 'SSpacer',
  's-safezone': 'SSafeZone',
  's-canvas': 'SConstraintCanvas',
  's-switcher': 'SWidgetSwitcher',
  's-scroll': 'SScrollBox',
  's-scalebox': 'SScaleBox',
  's-image': 'SImage',
  's-text': 'STextBlock',
  's-richtext': 'SRichTextBlock',
  's-progress': 'SProgressBar',
  's-button': 'SButton',
};

const DEFAULTS = {
  scene: '',
  backdrop: '',
  aspect: '16:9',
  scale: 1,
  safe: 0,
  outline: false,
  grid: false,
  paused: false,
  clean: false,
  speed: 1,
  style: 'director', // the user's current favourite (documents/direction.md)
};
const SPEEDS = { 1: '1×', 0.5: '½×', 0.25: '¼×', 0.1: '⅒×' };
const BOOLS = ['outline', 'grid', 'paused', 'clean'];
const HINT = 'Harness: [ ] scenes · Shift+S style · Shift+R replay · Shift+O outline · Shift+G grid · Shift+P pause · Shift+C clean';

// Variants live in the hash as v.<key>=<value>.
function readHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  const s = { ...DEFAULTS, variants: {} };
  for (const [k, v] of p) {
    if (k.startsWith('v.')) { s.variants[k.slice(2)] = v; continue; }
    if (!(k in DEFAULTS)) continue;
    if (BOOLS.includes(k)) s[k] = v === '1';
    else if (typeof DEFAULTS[k] === 'number') s[k] = Number(v) || DEFAULTS[k];
    else s[k] = v;
  }
  return s;
}

function writeHash(s) {
  const p = new URLSearchParams();
  for (const k of Object.keys(DEFAULTS)) {
    if (s[k] === DEFAULTS[k]) continue;
    p.set(k, BOOLS.includes(k) ? (s[k] ? '1' : '0') : String(s[k]));
  }
  for (const [k, v] of Object.entries(s.variants)) p.set(`v.${k}`, v);
  const next = `#${p}`;
  if (location.hash !== next) history.replaceState(null, '', next);
}

export function createHarness({ scenes, backdrops, styleSets, onChange, onReplay }) {
  const $ = (id) => document.getElementById(id);
  const sceneSel = $('hx-scene');
  const backdropSel = $('hx-backdrop');
  const aspectSel = $('hx-aspect');
  const safeSel = $('hx-safe');
  const speedSel = $('hx-speed');
  const scaleInput = $('hx-scale');
  const scaleValue = $('hx-scale-value');
  const variantsEl = $('hx-variants');
  const pathEl = $('hx-path');
  const infoEl = $('hx-info');
  const uiRoot = $('ui-root');

  const option = (value, label) => new Option(label, value);
  scenes.forEach((s) => sceneSel.add(option(s.id, s.title)));
  backdropSel.add(option('', '(scene default)'));
  Object.entries(backdrops).forEach(([id, b]) => backdropSel.add(option(id, b.title)));
  Object.keys(ASPECTS).forEach((a) => aspectSel.add(option(a, a)));
  Object.entries(SAFE_ZONES).forEach(([v, label]) => safeSel.add(option(v, label)));
  Object.entries(SPEEDS).sort((a, b) => b[0] - a[0]).forEach(([v, label]) => speedSel.add(option(v, label)));
  const styleSel = $('hx-style');
  styleSets.forEach((s) => styleSel.add(option(s.id, s.title)));

  // Style sets: every theme's CSS is loaded up front so switching is instant.
  for (const s of styleSets) {
    if (!s.file) continue;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = s.file;
    document.head.appendChild(link);
  }

  const validate = (s) => {
    if (!scenes.some((x) => x.id === s.scene)) s.scene = scenes[0].id;
    if (!styleSets.some((x) => x.id === s.style)) s.style = DEFAULTS.style;
    return s;
  };
  let state = validate(readHash());
  const scene = () => scenes.find((s) => s.id === state.scene);

  function set(patch) {
    const prev = state;
    state = { ...state, ...patch };
    sync();
    writeHash(state);
    onChange(state, prev);
  }

  // --- design variants ----------------------------------------------------------
  // A scene can declare variants: { key: { label, options: { value: label } } }.
  // The chosen value is set as data-v-<key> on #ui-root, for CSS and ctx.variant().
  let variantScene = null;
  function syncVariants() {
    const defs = scene().variants ?? {};
    if (variantScene !== state.scene) {
      variantScene = state.scene;
      variantsEl.replaceChildren();
      for (const [key, def] of Object.entries(defs)) {
        const label = document.createElement('label');
        label.className = 'hx-field hx-variant';
        const span = document.createElement('span');
        span.textContent = def.label;
        const sel = document.createElement('select');
        sel.dataset.variant = key;
        Object.entries(def.options).forEach(([v, l]) => sel.add(option(v, l)));
        sel.onchange = () => set({ variants: { ...state.variants, [key]: sel.value } });
        label.append(span, sel);
        variantsEl.append(label);
      }
    }
    for (const attr of [...uiRoot.attributes]) if (attr.name.startsWith('data-v-')) uiRoot.removeAttribute(attr.name);
    for (const [key, def] of Object.entries(defs)) {
      const value = state.variants[key] in def.options ? state.variants[key] : Object.keys(def.options)[0];
      uiRoot.setAttribute(`data-v-${key}`, value);
      const sel = variantsEl.querySelector(`[data-variant="${key}"]`);
      if (sel) sel.value = value;
    }
  }

  function sync() {
    sceneSel.value = state.scene;
    backdropSel.value = state.backdrop;
    aspectSel.value = state.aspect;
    safeSel.value = String(state.safe);
    speedSel.value = String(state.speed);
    styleSel.value = state.style;
    uiRoot.dataset.style = state.style;
    scaleInput.value = String(state.scale);
    scaleValue.textContent = `${state.scale.toFixed(2)}×`;
    for (const btn of document.querySelectorAll('[data-toggle]')) {
      btn.setAttribute('aria-pressed', String(state[btn.dataset.toggle]));
    }
    document.body.toggleAttribute('data-outline', state.outline);
    document.body.toggleAttribute('data-clean', state.clean);
    $('hx-grid').classList.toggle('collapsed', !state.grid);
    $('hx-safe-overlay').classList.toggle('collapsed', state.safe === 0);
    syncVariants();
    if (!state.outline) { clearHover(); pathEl.textContent = HINT; }
  }

  sceneSel.onchange = () => set({ scene: sceneSel.value });
  backdropSel.onchange = () => set({ backdrop: backdropSel.value });
  aspectSel.onchange = () => set({ aspect: aspectSel.value });
  safeSel.onchange = () => set({ safe: Number(safeSel.value) });
  speedSel.onchange = () => set({ speed: Number(speedSel.value) });
  styleSel.onchange = () => set({ style: styleSel.value });
  scaleInput.oninput = () => set({ scale: Number(scaleInput.value) });
  $('hx-replay').onclick = () => onReplay?.();
  for (const btn of document.querySelectorAll('[data-toggle]')) {
    btn.onclick = () => set({ [btn.dataset.toggle]: !state[btn.dataset.toggle] });
  }
  // Toolbar controls shouldn't keep keyboard focus: the game UI wants the keys.
  for (const el of document.querySelectorAll('.hx-bar select, .hx-bar input, .hx-bar button')) {
    el.addEventListener('change', () => el.blur());
    el.addEventListener('click', () => { if (el.tagName === 'BUTTON') el.blur(); });
  }

  window.addEventListener('hashchange', () => {
    const prev = state;
    state = validate(readHash());
    sync();
    onChange(state, prev);
  });

  // --- keyboard (Shift+letter, and [ ]) --------------------------------------------
  const KEYS = { o: 'outline', g: 'grid', p: 'paused', c: 'clean' };
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest?.('input, select, textarea')) return;
    const k = e.key.toLowerCase();
    if (k === '[' || k === ']') {
      const i = scenes.findIndex((s) => s.id === state.scene);
      const n = (i + (k === ']' ? 1 : -1) + scenes.length) % scenes.length;
      set({ scene: scenes[n].id });
      e.stopImmediatePropagation();
      return;
    }
    if (!e.shiftKey) return;
    if (KEYS[k]) set({ [KEYS[k]]: !state[KEYS[k]] });
    else if (k === 'r') onReplay?.();
    else if (k === 's') {
      const i = styleSets.findIndex((s) => s.id === state.style);
      set({ style: styleSets[(i + 1) % styleSets.length].id });
    } else return;
    e.stopImmediatePropagation(); // harness keys never reach the game UI
  });

  // --- outline breadcrumb -----------------------------------------------------
  let hovered = null;
  function clearHover() {
    hovered?.classList.remove('hx-hover');
    hovered = null;
  }
  function describe(el) {
    const cls = [...el.classList];
    const prim = cls.find((c) => SLATE[c]);
    const style = cls.find((c) => /^(ts|brush)-/.test(c));
    const name = el.dataset.widget ? `«${el.dataset.widget}»` : '';
    if (!prim && !name) return null;
    return [name, prim && SLATE[prim]].filter(Boolean).join(' ') + (style ? `(${style})` : '');
  }
  uiRoot.addEventListener('mousemove', (e) => {
    if (!state.outline) return;
    const chain = [];
    let target = null;
    for (let el = e.target; el && el !== uiRoot; el = el.parentElement) {
      const d = describe(el);
      if (d) { chain.unshift(d); target ??= el; }
    }
    if (target !== hovered) { clearHover(); hovered = target; hovered?.classList.add('hx-hover'); }
    pathEl.textContent = chain.join(' › ') || '—';
  });
  uiRoot.addEventListener('mouseleave', () => { clearHover(); });

  let messageTimer = null;
  return {
    get state() { return state; },
    setInfo(text) { infoEl.textContent = text; },
    // A transient note in the footer, e.g. "Quit → the game would exit here".
    message(text) {
      pathEl.textContent = `▸ ${text}`;
      clearTimeout(messageTimer);
      messageTimer = setTimeout(() => { if (!state.outline) pathEl.textContent = HINT; }, 4000);
    },
    start() { sync(); onChange(state, null); },
  };
}
