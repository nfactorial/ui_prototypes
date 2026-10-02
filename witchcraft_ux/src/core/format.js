// Pure formatting functions. No DOM — these port straight to C++ helpers.
// Used by data-bind="vm.field | formatter".

export function int(v) {
  return v == null ? '—' : `${Math.round(v)}`;
}

export function pad2(v) {
  return v == null ? '—' : `${Math.round(v)}`.padStart(2, '0');
}

export function pct(v) {
  return v == null ? '—' : `${Math.round(v * 100)}%`;
}

export function upper(v) {
  return v == null ? '' : `${v}`.toUpperCase();
}

export function raw(v) {
  return v == null ? '' : `${v}`;
}

// --- A Little Witchcraft ------------------------------------------------------

// Time of day: ClimateFramework's TimeOfDay in [0,1) → "06:30" (GetTimeOfDayText).
export function clock(t) {
  if (t == null) return '—';
  const mins = Math.floor((((t % 1) + 1) % 1) * 24 * 60);
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

// EDayPhase from TimeOfDay. Boundaries are placeholders, not the plugin's.
export function dayPhase(t) {
  if (t == null) return '';
  const h = (((t % 1) + 1) % 1) * 24;
  if (h < 5 || h >= 21) return 'Night';
  if (h < 11) return 'Morning';
  if (h < 14) return 'Midday';
  if (h < 18) return 'Afternoon';
  return 'Evening';
}

export function celsius(v) {
  return v == null ? '—' : `${Math.round(v)}°`;
}

// Stack count badge: shown only above 1 (inventory_ui_prd).
export function count(v) {
  return v > 1 ? `${v}` : '';
}

export const formatters = {
  int, pad2, pct, upper, raw, clock, dayPhase, celsius, count,
};
