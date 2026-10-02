// Keyboard / gamepad-style focus navigation, in the manner of Slate/CommonUI:
// arrow keys move focus spatially between focusable widgets on the topmost
// interactive screen, Enter/Space activate (native button behaviour), and
// hovering with the mouse moves focus too, so there's one highlight state.

const FOCUSABLE = 'button:not([disabled]), [tabindex="0"]';

export function focusables(root) {
  return [...root.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);
}

export function focusDefault(root) {
  const el = root.querySelector('[data-focus-default]:not([disabled])') ?? focusables(root)[0];
  el?.focus({ preventScroll: true });
  return !!el;
}

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// Move focus to the nearest focusable in a direction. Returns true if handled.
export function moveFocus(root, dir) {
  const items = focusables(root);
  if (!items.length) return false;
  const cur = root.contains(document.activeElement) ? document.activeElement : null;
  if (!cur || !items.includes(cur)) return focusDefault(root);

  // Explicit rule (Slate's EUINavigationRule::Explicit): an ancestor with
  // data-nav-<dir>="<selector>" names where focus goes in that direction.
  const rule = cur.closest(`[data-nav-${dir}]`)?.getAttribute(`data-nav-${dir}`);
  const target = rule && [...root.querySelectorAll(rule)].find((el) => items.includes(el));
  if (target) { target.focus({ preventScroll: false }); return true; }

  const r = cur.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const [dx, dy] = DIRS[dir];

  // Prefer candidates "in the beam" (overlapping us on the other axis), nearest
  // first; only if there are none, fall back to the best off-axis candidate.
  const inBeam = (b) => (dx !== 0
    ? b.bottom > r.top && b.top < r.bottom
    : b.right > r.left && b.left < r.right);

  let best = null;
  let bestScore = Infinity;
  for (const el of items) {
    if (el === cur) continue;
    const b = el.getBoundingClientRect();
    const vx = b.left + b.width / 2 - cx;
    const vy = b.top + b.height / 2 - cy;
    const along = vx * dx + vy * dy;
    if (along <= 1) continue; // not in that direction
    const across = Math.abs(vx * -dy + vy * dx);
    const score = (inBeam(b) ? 0 : 1e6) + along + across * 2;
    if (score < bestScore) { bestScore = score; best = el; }
  }
  best?.focus({ preventScroll: false });
  return true; // swallow the key even at an edge, like a menu would
}

export function keyToDir(key) {
  return { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[key];
}

// Hover moves focus (one highlight state for mouse and keyboard).
export function installHoverFocus(root) {
  root.addEventListener('pointerover', (e) => {
    const el = e.target.closest?.(FOCUSABLE);
    if (el && root.contains(el) && document.activeElement !== el) el.focus({ preventScroll: true });
  });
}
