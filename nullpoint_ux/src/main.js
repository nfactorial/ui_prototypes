import { createStage } from './core/stage.js';
import { createHarness } from './core/harness.js';
import { createScreenManager } from './core/screen_manager.js';
import { setPaused } from './core/sim.js';
import { setTimeScale } from './core/motion.js';
import { moveFocus, keyToDir, installHoverFocus } from './core/focus.js';
import { installNotifier, clearToasts, toast } from './core/notify.js';
import { installTooltips } from './core/tooltip.js';
import { viewmodels } from './mock/index.js';
import { backdrops, screens, scenes } from './scenes.js';
import { styleSets } from './styles.js';

const $ = (id) => document.getElementById(id);

const stage = createStage({
  viewport: $('hx-viewport'),
  stage: $('stage'),
  uiRoot: $('ui-root'),
  backdrop: $('backdrop'),
  safeRect: $('hx-safe-rect'),
});

let flow = null; // the current scene's flow controller, if it has one

// Global feedback services, rendering into the top 'notify' layer. Toasts get a
// sub-layer each so tooltips always sit above them.
const notifyLayer = document.querySelector('[data-layer="notify"]');
const toastLayer = document.createElement('div');
const tooltipLayer = document.createElement('div');
// These cover the whole stage and must never take input from the screens below.
// Inline, because harness.css's `#ui-root > .layer > *` (pointer-events: auto) outranks a class.
toastLayer.className = tooltipLayer.className = 's-overlay';
toastLayer.style.pointerEvents = tooltipLayer.style.pointerEvents = 'none';
notifyLayer.append(toastLayer, tooltipLayer);
installNotifier(toastLayer);
const tooltips = installTooltips({ uiRoot: $('ui-root'), layerEl: tooltipLayer, stage });

const screenManager = createScreenManager({
  uiRoot: $('ui-root'),
  stage,
  viewmodels,
  registry: screens,
  onAction(name, data, from) {
    if (flow) flow.onAction(name, data, from);
    else harness.message(`Action "${name}" from ${from}. This scene has no flow controller.`);
  },
});

let backdropOverride = '';
let sceneBackdrop = '';
function applyBackdrop() {
  stage.setBackdrop(backdrops[backdropOverride || sceneBackdrop]);
}

// Start a scene: either a static set of screens, or a flow controller.
let sceneToken = 0;
async function startScene(scene) {
  const token = ++sceneToken;
  flow = null;
  setPaused('game', false);
  clearToasts();
  tooltips.hide();
  sceneBackdrop = scene.backdrop ?? 'black';
  applyBackdrop();
  if (!scene.controller) { screenManager.show(scene.screens); return; }

  const create = (await scene.controller()).default;
  if (token !== sceneToken) return;
  flow = create({
    screens: screenManager,
    viewmodels,
    start: scene.start,
    setBackdrop: (id) => { sceneBackdrop = id; applyBackdrop(); },
    setGamePaused: (p) => setPaused('game', p),
    message: (text) => harness.message(text),
    toast,
  });
  flow.start();
}

const harness = createHarness({
  scenes,
  backdrops,
  styleSets,
  onChange(state, prev) {
    const scene = scenes.find((s) => s.id === state.scene);
    backdropOverride = state.backdrop;
    stage.configure({
      aspect: state.aspect,
      scale: state.scale,
      safe: state.safe,
      margin: state.clean ? 0 : 16,
    });
    setPaused('harness', state.paused);
    setTimeScale(state.speed);
    const remountVariantChanged = prev && Object.entries(scene.variants ?? {})
      .some(([key, def]) => def.remount && prev.variants[key] !== state.variants[key]);
    if (!prev || prev.scene !== state.scene || remountVariantChanged) startScene(scene);
    else applyBackdrop();

    const { w, h } = stage.stageSize;
    const ui = stage.uiSize;
    harness.setInfo(`stage ${w}×${h} · UI ${Math.round(ui.w)}×${Math.round(ui.h)} Slate units`);
  },
  onReplay() {
    startScene(scenes.find((s) => s.id === harness.state.scene));
  },
});
harness.start();

// --- input routing --------------------------------------------------------------
// Like CommonUI: arrows move focus on the topmost interactive screen; other keys
// go to that screen's own handlers first, then to the scene's flow controller.
installHoverFocus($('ui-root'));
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target.closest?.('.hx-bar input, .hx-bar select')) return;

  const dir = keyToDir(e.key);
  if (dir) {
    const top = screenManager.topInteractive();
    if (top && moveFocus(top.root, dir)) e.preventDefault();
    return;
  }
  if (screenManager.routeKey(e) || flow?.onKey(e)) e.preventDefault();
});

// --- live reload (tools/serve.mjs) --------------------------------------------
// CSS changes hot-swap in place; anything else reloads the page.
if (location.protocol.startsWith('http')) {
  const es = new EventSource('/__reload');
  es.onmessage = (e) => {
    const file = e.data;
    if (file.endsWith('.css')) {
      for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
        const url = new URL(link.href);
        if (url.pathname.endsWith(`/${file}`)) {
          url.searchParams.set('v', Date.now());
          link.href = url.href;
        }
      }
    } else if (!file.endsWith('.md')) {
      location.reload();
    }
  };
  // Under a plain static server /__reload 404s and EventSource gives up quietly.
}
