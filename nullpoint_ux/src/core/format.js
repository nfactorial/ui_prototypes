// Pure formatting functions. No DOM — these port straight to C++ helpers.
// Used by data-bind="vm.field | formatter".

// Auto-scaling distance with fixed significant figures so the number does not
// jitter as it changes (space/18 §3). Metres in.
const AU = 1.495978707e11;
export function distance(m) {
  if (m == null || Number.isNaN(m)) return '—';
  const a = Math.abs(m);
  if (a < 1000) return `${Math.round(m)} m`;
  if (a < 1e6) return `${sig3(m / 1e3)} km`;
  if (a < 1e9) return `${sig3(m / 1e6)} Mm`;
  if (a < 0.1 * AU) return `${sig3(m / 1e9)} Gm`;
  return `${sig3(m / AU)} AU`;
}

function sig3(v) {
  const a = Math.abs(v);
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

export function speed(mps) {
  if (mps == null) return '—';
  return `${Math.round(mps)}`;
}

export function signedSpeed(mps) {
  if (mps == null) return '—';
  const r = Math.round(mps);
  return `${r > 0 ? '+' : ''}${r} m/s`;
}

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

// --- The reference rating (nullpoint.md A1.0) --------------------------------
// Beaufort-style, running DOWN: 10 = full reference, 0 = the last rated band,
// below that the instrument means nothing → UNRATED (Null Point).

export function rating(r) {
  if (r == null) return '—';
  if (r < 0) return '--';
  return r.toFixed(1);
}

// Who goes there — the ladder in A1.0b.
export function bandName(r) {
  if (r == null) return '';
  if (r < 0) return 'Unrated';
  if (r >= 9) return 'Normal space';
  if (r >= 8) return 'Passenger limit';
  if (r >= 6) return 'Commercial lanes';
  if (r >= 5) return 'Military limit';
  if (r >= 1) return 'No legitimate traffic';
  return 'Last rated band';
}

export const formatters = {
  distance, speed, signedSpeed, int, pad2, pct, upper, raw, rating, bandName,
};
