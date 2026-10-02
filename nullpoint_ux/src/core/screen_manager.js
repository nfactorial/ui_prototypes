// Mounts screens into the layer stack: all at once for a static scene, or one
// at a time as a flow opens and closes them (CommonUI's activatable stack).
//
// A screen module exports:
//
//   export default {
//     id: 'flight-hud',
//     title: 'Flight HUD',
//     layer: 'game',                  // game | gamemenu | menu | modal
//     styles: [new URL('./style.css', import.meta.url).href],
//     mount(root, ctx) {
//       ...
//       return () => {}               // cleanup, or
//       return { cleanup, outro }     // outro(): Promise, played before removal
//     },
//   }
//
// ctx gives the screen everything it may touch:
//   ctx.vm                  the viewmodels, by name
//   ctx.params              whatever the opener passed to nav.open(id, params)
//   ctx.bind(el?)           wire data-bind* attributes under el (default: screen root)
//   ctx.play(el, anim, o)   play a motion.js animation (stopped on unmount)
//   ctx.onTick(fn)          per-frame callback (t, dt) from the mock sim
//   ctx.onKey(fn)           key handler, called only while this is the topmost
//                           interactive screen; return true if handled
//   ctx.action(name, data)  tell the scene's flow controller something happened
//   ctx.toast(opts)         show a toast notification (core/notify.js)
//   ctx.nav                 { open(id, params), close(id), closeSelf(), isOpen(id) }
//   ctx.variant(key)        the harness variant value for key (e.g. 'computer')
//   ctx.uiSize()            current UI size in Slate units { w, h }
//   ctx.onResize(fn)        called with the UI size when it changes
// Subscriptions made through ctx are cleaned up automatically on unmount.

import { bindAll } from './bind.js';
import { onTick } from './sim.js';
import { play } from './motion.js';
import { focusables, focusDefault } from './focus.js';
import { toast } from './notify.js';

const LAYERS = ['game', 'gamemenu', 'menu', 'modal', 'notify'];
const loadedCss = new Map(); // href -> Promise

function loadCss(href) {
  if (!loadedCss.has(href)) {
    loadedCss.set(href, new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = () => { console.error(`[screens] failed to load ${href}`); resolve(); };
      document.head.appendChild(link);
    }));
  }
  return loadedCss.get(href);
}

export function createScreenManager({ uiRoot, stage, viewmodels, registry, onAction }) {
  const open = new Map(); // id -> entry
  const closing = new Set(); // entries playing their outro
  let order = 0;
  let gen = 0; // bumped by closeAll, so late-arriving loads are dropped

  async function load(id) {
    const loader = registry[id];
    if (!loader) throw new Error(`No screen registered as "${id}" (src/scenes.js)`);
    const mod = (await loader()).default;
    await Promise.all((mod.styles ?? []).map(loadCss));
    return mod;
  }

  function showError(message) {
    const layer = uiRoot.querySelector('[data-layer="modal"]');
    const root = document.createElement('div');
    root.style.cssText = 'place-self:center;padding:16px 24px;background:#400;color:#fdd;font:16px monospace;white-space:pre';
    root.textContent = message;
    layer.appendChild(root);
    open.set(`error-${order++}`, { root, offs: [], keys: [], layerIndex: 3, order });
  }

  function mount(mod, params) {
    const layer = uiRoot.querySelector(`[data-layer="${mod.layer}"]`);
    if (!layer) { showError(`Screen "${mod.id}" has unknown layer "${mod.layer}"`); return null; }

    const root = document.createElement('div');
    root.className = 'screen s-overlay';
    root.dataset.screen = mod.id;
    layer.appendChild(root);

    const entry = {
      id: mod.id, mod, root, offs: [], keys: [], cleanup: null, outro: null,
      layerIndex: LAYERS.indexOf(mod.layer), order: order++,
      returnFocus: document.activeElement,
    };
    const track = (off) => { entry.offs.push(off); return off; };
    const ctx = {
      vm: viewmodels,
      params: params ?? {},
      bind: (el = root) => track(bindAll(el, viewmodels)),
      play: (el, anim, opts) => { const h = play(el, anim, opts); track(h.stop); return h; },
      onTick: (fn) => track(onTick(fn)),
      onKey: (fn) => { entry.keys.push(fn); },
      action: (name, data) => onAction?.(name, data, mod.id),
      toast,
      nav: { open: openScreen, close: closeScreen, closeSelf: () => closeScreen(mod.id), isOpen: (id) => open.has(id) },
      variant: (key) => uiRoot.getAttribute(`data-v-${key}`),
      uiSize: () => stage.uiSize,
      onResize: (fn) => track(stage.onResize(fn)),
    };
    open.set(mod.id, entry);

    try {
      const result = mod.mount(root, ctx);
      entry.cleanup = typeof result === 'function' ? result : result?.cleanup;
      entry.outro = result?.outro;
    } catch (e) {
      console.error(e);
      showError(`${mod.id}: ${e.message}`);
    }
    if (mod.layer !== 'game' && focusables(root).length) focusDefault(root);
    return entry;
  }

  function teardown(entry) {
    try { entry.cleanup?.(); } catch (e) { console.error(e); }
    entry.offs.forEach((off) => off());
    entry.root.remove();
  }

  async function openScreen(id, params) {
    if (open.has(id)) return open.get(id);
    const myGen = gen;
    let mod;
    try { mod = await load(id); } catch (e) { console.error(e); showError(String(e.message ?? e)); return null; }
    if (myGen !== gen || open.has(id)) return open.get(id) ?? null;
    return mount(mod, params);
  }

  async function closeScreen(id) {
    const entry = open.get(id);
    if (!entry) return;
    open.delete(id);
    closing.add(entry);
    if (entry.outro) {
      // Cap the wait: animations don't advance in a background tab.
      const cap = new Promise((r) => setTimeout(r, 1000));
      try { await Promise.race([entry.outro(), cap]); } catch (e) { console.error(e); }
    }
    if (!closing.delete(entry)) return; // closeAll already tore it down
    teardown(entry);
    // Hand focus back to whatever had it when this opened, if it's still there.
    const back = entry.returnFocus;
    if (back?.isConnected && back !== document.body) back.focus({ preventScroll: true });
    else { const top = topInteractive(); if (top) focusDefault(top.root); }
  }

  function closeAll() {
    gen++;
    for (const entry of [...open.values(), ...closing]) teardown(entry);
    open.clear();
    closing.clear();
  }

  // Replace everything with this set of screens (a static scene).
  async function show(ids) {
    closeAll();
    const myGen = gen;
    let mods;
    try { mods = await Promise.all(ids.map(load)); } catch (e) { console.error(e); if (myGen === gen) showError(String(e.message ?? e)); return; }
    if (myGen !== gen) return;
    mods.forEach((m) => mount(m));
  }

  // The topmost screen that has something to focus: where input goes.
  function topInteractive() {
    return [...open.values()]
      .filter((e) => e.mod && focusables(e.root).length)
      .sort((a, b) => a.layerIndex - b.layerIndex || a.order - b.order)
      .at(-1) ?? null;
  }

  // Offer a key to the topmost interactive screen's handlers.
  function routeKey(e) {
    const top = topInteractive();
    return !!top?.keys.some((fn) => fn(e));
  }

  return { show, open: openScreen, close: closeScreen, closeAll, isOpen: (id) => open.has(id), topInteractive, routeKey };
}
