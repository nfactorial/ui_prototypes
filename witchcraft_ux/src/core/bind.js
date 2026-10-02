// Declarative one-way bindings from viewmodels to markup — the MVVM seam.
//
//   data-bind="flight.speed | speed"        text content, through a formatter
//   data-bind-pct="flight.hull"             sets --pct (0..1) for s-progress
//   data-bind-visible="flight.belowPolicy"  Collapsed when falsy (prefix ! to invert)
//   data-bind-attr="flight.state:data-state" sets an attribute
//
// Returns a cleanup function that removes every subscription it made.

import { formatters } from './format.js';

export function bindAll(root, viewmodels) {
  const offs = [];

  const lookup = (expr, el) => {
    const [vmName, field] = expr.trim().split('.');
    const vm = viewmodels[vmName];
    if (!vm || !field) {
      console.warn(`[bind] unknown viewmodel field "${expr}"`, el);
      return null;
    }
    return { vm, field };
  };

  for (const el of root.querySelectorAll('[data-bind]')) {
    const [path, fmtName = 'raw'] = el.dataset.bind.split('|').map((s) => s.trim());
    const src = lookup(path, el);
    const fmt = formatters[fmtName];
    if (!fmt) console.warn(`[bind] unknown formatter "${fmtName}"`, el);
    if (src) offs.push(src.vm.on(src.field, (v) => { el.textContent = (fmt ?? formatters.raw)(v); }));
  }

  for (const el of root.querySelectorAll('[data-bind-pct]')) {
    const src = lookup(el.dataset.bindPct, el);
    if (src) offs.push(src.vm.on(src.field, (v) => el.style.setProperty('--pct', v ?? 0)));
  }

  for (const el of root.querySelectorAll('[data-bind-visible]')) {
    let expr = el.dataset.bindVisible.trim();
    const invert = expr.startsWith('!');
    if (invert) expr = expr.slice(1);
    const src = lookup(expr, el);
    if (src) offs.push(src.vm.on(src.field, (v) => el.classList.toggle('collapsed', invert ? !!v : !v)));
  }

  for (const el of root.querySelectorAll('[data-bind-attr]')) {
    const [path, attr] = el.dataset.bindAttr.split(':').map((s) => s.trim());
    const src = lookup(path, el);
    if (src && attr) offs.push(src.vm.on(src.field, (v) => el.setAttribute(attr, v ?? '')));
  }

  return () => offs.forEach((off) => off());
}
