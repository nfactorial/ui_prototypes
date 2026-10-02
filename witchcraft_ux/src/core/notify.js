// Toast notifications: the game telling the player something happened.
//
//   toast({ kind: 'collected', title: 'Birch sticks', body: '×3' })
//   toast({ kind: 'learned', title: 'Will-o'-wisp' })
//   toast({ kind: 'notice', title: 'Your hands are full' })
//
// A kind picks a PRESENTATION and defaults (label, icon, duration). Any of those
// can be overridden per call.
//   stack   small cards, queued, a bar drains to show time left
//   banner  one big centred moment at a time (milestones)
//   alert   top-centre warning with an edge colour
//
// Toasts run on UI time (the animation timeline), not game time: they keep going
// while the world is paused, and the harness Motion speed slows them too.
// Rendered into the 'notify' layer, above everything, never taking input.

import { play, wait, defineAnimation } from './motion.js';

// 🔴 BANNERS ARE FOR MUST-KNOW PROGRESS ONLY (carried over from Null Point, and
// doubly true in a game whose design says "no HUD"): a spell learned, a portal
// opened. Routine pickups are stack toasts. A banner that fires often stops meaning anything.
// The kinds are A Little Witchcraft's events (documents/flow.md, "Feedback").
export const TOAST_KINDS = {
  collected: { presentation: 'stack',  label: 'Collected',       icon: 'leaf',    duration: 3.5 },  // Collectible pickup (EItemChangeReason::Collected)
  caught:    { presentation: 'stack',  label: 'Caught',          icon: 'fish',    duration: 4 },    // Event.Fishing.FishCaught
  info:      { presentation: 'stack',  label: 'Note',            icon: 'info',    duration: 4 },
  learned:   { presentation: 'banner', label: 'A new spell',     icon: 'sparkle', duration: 4 },    // speculative: how spells are gained is undecided
  milestone: { presentation: 'banner', label: 'Something changed', icon: 'moon',  duration: 4 },    // e.g. a portal unlocked (world/structure.md)
  notice:    { presentation: 'alert',  label: 'Hmm',             icon: 'info',    duration: 3 },    // e.g. hands full (collectible_prd ReceiveCollectRefused)
};

const MAX_STACK = 4;

// --- motion ---------------------------------------------------------------------
const STACK_IN = defineAnimation('ToastStackIn', {
  opacity: [[0, 0, 'quadOut'], [0.2, 1]],
  translate: [[0, [-40, 0], 'cubicOut'], [0.3, [0, 0]]],
});
const STACK_OUT = defineAnimation('ToastStackOut', {
  opacity: [[0, 1, 'quadIn'], [0.25, 0]],
  translate: [[0, [0, 0], 'quadIn'], [0.25, [-24, 0]]],
});
const BANNER_IN = defineAnimation('ToastBannerIn', { opacity: [[0, 0, 'quadOut'], [0.35, 1]] });
const BANNER_LINES = defineAnimation('ToastBannerLines', { scale: [[0, [0, 1], 'cubicOut'], [0.6, [1, 1]]] });
const BANNER_TEXT = defineAnimation('ToastBannerText', {
  opacity: [[0, 0, 'quadOut'], [0.4, 1]],
  translate: [[0, [0, 10], 'cubicOut'], [0.5, [0, 0]]],
});
const BANNER_OUT = defineAnimation('ToastBannerOut', { opacity: [[0, 1, 'quadIn'], [0.4, 0]] });
const ALERT_IN = defineAnimation('ToastAlertIn', {
  opacity: [[0, 0, 'quadOut'], [0.15, 1]],
  translate: [[0, [0, -20], 'cubicOut'], [0.25, [0, 0]]],
});
const ALERT_PULSE = defineAnimation('ToastAlertPulse', { opacity: [[0, 1, 'quadInOut'], [0.5, 0.35, 'quadInOut'], [1, 1]] });
const OUT = defineAnimation('ToastOut', { opacity: [[0, 1, 'quadIn'], [0.3, 0]] });
const drain = (seconds) => defineAnimation('ToastDrain', { scale: [[0, [1, 1], 'linear'], [seconds, [0, 1]]] });

// --- host --------------------------------------------------------------------------
let host = null;

export function installNotifier(layerEl) {
  layerEl.innerHTML = /* html */ `
    <div class="s-overlay gb nt hit-invisible" data-widget="WBP_Notifications">
      <div class="s-vbox nt-stack h-left v-top" data-widget="SWcToastStack"></div>
      <div class="s-overlay nt-banner-slot h-fill v-top"></div>
      <div class="s-vbox nt-alerts h-center v-top"></div>
    </div>`;
  host = {
    stack: layerEl.querySelector('.nt-stack'),
    bannerSlot: layerEl.querySelector('.nt-banner-slot'),
    alerts: layerEl.querySelector('.nt-alerts'),
    stackQueue: [],
    bannerQueue: [],
    bannerBusy: false,
    live: new Set(),
  };
}

export function clearToasts() {
  if (!host) return;
  host.live.forEach((stop) => stop());
  host.live.clear();
  host.stack.replaceChildren();
  host.bannerSlot.replaceChildren();
  host.alerts.replaceChildren();
  host.stackQueue = [];
  host.bannerQueue = [];
  host.bannerBusy = false;
}

export function toast(opts) {
  if (!host) { console.warn('[toast] notifier not installed'); return; }
  const kind = TOAST_KINDS[opts.kind] ?? TOAST_KINDS.info;
  const t = { ...kind, ...opts };
  if (t.presentation === 'banner') { host.bannerQueue.push(t); nextBanner(); }
  else if (t.presentation === 'alert') showAlert(t);
  else { host.stackQueue.push(t); nextStack(); }
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (name, cls = '') => `<div class="s-image tint ${cls}" style="--img:url(/assets/icons/${name}.svg)"></div>`;

function run(el, anim, opts) {
  const h = play(el, anim, opts);
  host.live.add(h.stop);
  return h.finished.finally(() => host.live.delete(h.stop));
}

// --- stack -----------------------------------------------------------------------------
function nextStack() {
  while (host.stackQueue.length && host.stack.children.length < MAX_STACK) showStack(host.stackQueue.shift());
}

async function showStack(t) {
  const el = document.createElement('div');
  el.className = 's-border nt-toast';
  el.dataset.kind = t.kind ?? 'info';
  el.dataset.widget = 'SWcToast';
  el.innerHTML = /* html */ `
    <div class="s-hbox nt-toast-row">
      <div class="s-border nt-toast-icon v-center">${icon(t.icon)}</div>
      <div class="s-vbox fill nt-toast-text">
        <div class="s-text gb-label nt-toast-label">${esc(t.label)}</div>
        <div class="s-text gb-h3">${esc(t.title)}</div>
        ${t.body ? `<div class="s-text gb-small wrap">${esc(t.body)}</div>` : ''}
      </div>
    </div>
    <div class="nt-drain"></div>`;
  host.stack.appendChild(el);
  await run(el, STACK_IN);
  await run(el.querySelector('.nt-drain'), drain(t.duration));
  await run(el, STACK_OUT);
  el.remove();
  nextStack();
}

// --- banner ----------------------------------------------------------------------------
async function nextBanner() {
  if (host.bannerBusy || !host.bannerQueue.length) return;
  host.bannerBusy = true;
  const t = host.bannerQueue.shift();
  const el = document.createElement('div');
  el.className = 's-vbox nt-banner h-center';
  el.dataset.kind = t.kind ?? 'learned';
  el.dataset.widget = 'SWcBanner';
  el.innerHTML = /* html */ `
    <div class="s-hbox nt-banner-head">
      <div class="nt-line left fill"></div>
      ${icon(t.icon, 'nt-banner-icon')}
      <div class="nt-line right fill"></div>
    </div>
    <div class="s-text nt-banner-label just-center">${esc(t.label)}</div>
    <div class="s-text gb-title nt-banner-title just-center">${esc(t.title)}</div>
    ${t.body ? `<div class="s-text gb-body nt-banner-body just-center">${esc(t.body)}</div>` : ''}`;
  host.bannerSlot.appendChild(el);
  run(el, BANNER_IN);
  el.querySelectorAll('.nt-line').forEach((l) => run(l, BANNER_LINES));
  el.querySelectorAll('.s-text, .nt-banner-icon').forEach((n, i) => run(n, BANNER_TEXT, { delay: 0.15 + i * 0.08 }));
  const hold = wait(t.duration);
  host.live.add(hold.stop);
  await hold.finished;
  host.live.delete(hold.stop);
  await run(el, BANNER_OUT);
  el.remove();
  host.bannerBusy = false;
  nextBanner();
}

// --- alert -----------------------------------------------------------------------------
async function showAlert(t) {
  const el = document.createElement('div');
  el.className = 's-border nt-alert';
  el.dataset.widget = 'SWcAlert';
  el.innerHTML = /* html */ `
    <div class="s-hbox nt-alert-row">
      ${icon(t.icon, 'nt-alert-icon v-center')}
      <div class="s-vbox">
        <div class="s-text gb-label nt-alert-label">${esc(t.label)}</div>
        <div class="s-text gb-h3">${esc(t.title)}</div>
        ${t.body ? `<div class="s-text gb-small">${esc(t.body)}</div>` : ''}
      </div>
    </div>`;
  host.alerts.appendChild(el);
  await run(el, ALERT_IN);
  await run(el.querySelector('.nt-alert-icon'), ALERT_PULSE, { loops: Math.max(1, Math.round(t.duration)) });
  await run(el, OUT);
  el.remove();
}
