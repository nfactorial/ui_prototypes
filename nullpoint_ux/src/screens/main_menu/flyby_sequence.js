// The main menu flyby (menubg = flyby), as data: the bodies in the menu scene
// and the camera's keyed tracks. In Unreal this is a menu level + a Level
// Sequence; these keys are the sequence. Pure: no DOM, no WebGL.
//
// Tracks are keys [timeSeconds, value, interp?]. interp is how the curve LEAVES
// the key: 'auto' (default) is a smooth cubic through the keys, like
// Sequencer's Auto tangents; the motion.js ease names also work.
//
// World units are arbitrary (the gas giant's radius is 20).
// Y is up.

const norm = ([x, y, z]) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; };

export const WORLD = {
  sun: norm([-1, 0.3, -0.4]),               // direction toward the sun
  nebula: norm([0, -0.1, -1]),              // centre of the nebula on the sky
  planet: { pos: [0, 0, 0], radius: 20 },   // ringed gas giant
  rings: { normal: norm([0.15, 1, 0.1]), inner: 27, outer: 46 },
  moon: { pos: [36, 9, 22], radius: 2.5 },
  derelict: { pos: [52, 5, 67], width: 9 }, // height comes from the texture aspect
};

const D = WORLD.derelict.pos;

// Beats: approach the ringed giant against the nebula → skim low over the
// rings → close pass of the moon → swing wide round and find the derelict against
// the planet → hold on it → fade, and the whole thing replays.
export const SEQUENCE = {
  length: 52,
  tracks: {
    camPos: [
      [0, [-120, 40, 160]],
      [10, [-55, 12, 70]],
      [18, [-10, 4, 42]],
      [23, [22, 8, 36]],
      [27, [42, 10, 32]],
      [31, [72, 16, 60]],
      [36, [84, 12, 102]],
      [50, [72, 9, 92]],
    ],
    // The final targets sit left of the derelict, so it lands right of centre, clear of the menu.
    camTarget: [
      [0, [-20, 0, 0]],
      [10, [0, 0, 0]],
      [18, [30, 0, -10]],
      [23, [36, 9, 22]],
      [27, [D[0], D[1], D[2]]],
      [31, [D[0] - 3, D[1], D[2] + 2]],
      [36, [D[0] - 6, D[1], D[2] + 4.5]],
      [50, [D[0] - 6.5, D[1] + 0.5, D[2] + 5]],
    ],
    roll: [[0, 0], [10, 6], [18, -14], [23, 4], [27, 10], [32, -4], [37, 0], [50, 0]], // degrees
    fov: [[0, 45], [18, 60], [23, 50], [36, 40], [50, 36]],                  // vertical, degrees
    fade: [[0, 1, 'quadOut'], [2.5, 0, 'constant'], [49, 0, 'quadIn'], [51, 1]], // 1 = black
    glint: [[0, 0, 'constant'], [37, 0, 'quadInOut'], [41, 1, 'quadInOut'], [45, 1, 'quadInOut'], [48, 0]],
    derelictAngle: [[0, 4, 'linear'], [52, -14]], // slow roll of the wreck, degrees
  },
};

// --- sampling ---------------------------------------------------------------------

const EASE = {
  linear: (x) => x,
  constant: () => 0,
  quadIn: (x) => x * x,
  quadOut: (x) => 1 - (1 - x) ** 2,
  quadInOut: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2),
  cubicIn: (x) => x ** 3,
  cubicOut: (x) => 1 - (1 - x) ** 3,
  cubicInOut: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
};

// Component-wise maths over numbers or arrays.
const zip = (f, a, b) => (Array.isArray(a) ? a.map((v, i) => f(v, b[i])) : f(a, b));
const lerp = (a, b, x) => zip((p, q) => p + (q - p) * x, a, b);

// Auto tangent at key i: the slope between its neighbours (Catmull-Rom over
// time). Flat at the first and last key.
function tangent(keys, i) {
  if (i === 0 || i === keys.length - 1) return zip(() => 0, keys[i][1], keys[i][1]);
  const [ta, va] = keys[i - 1];
  const [tb, vb] = keys[i + 1];
  return zip((a, b) => (b - a) / (tb - ta), va, vb);
}

export function sample(keys, t) {
  const last = keys.length - 1;
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys[last][0]) return keys[last][1];
  let i = 0;
  while (keys[i + 1][0] < t) i++;
  const [t0, v0, interp = 'auto'] = keys[i];
  const [t1, v1] = keys[i + 1];
  const dt = t1 - t0;
  const x = (t - t0) / dt;
  if (interp !== 'auto') return lerp(v0, v1, EASE[interp](x));
  // Cubic Hermite.
  const m0 = tangent(keys, i);
  const m1 = tangent(keys, i + 1);
  const h00 = 2 * x ** 3 - 3 * x ** 2 + 1;
  const h10 = x ** 3 - 2 * x ** 2 + x;
  const h01 = -2 * x ** 3 + 3 * x ** 2;
  const h11 = x ** 3 - x ** 2;
  return Array.isArray(v0)
    ? v0.map((_, c) => h00 * v0[c] + h10 * dt * m0[c] + h01 * v1[c] + h11 * dt * m1[c])
    : h00 * v0 + h10 * dt * m0 + h01 * v1 + h11 * dt * m1;
}

// Every track at time t.
export function evaluate(t) {
  return Object.fromEntries(Object.entries(SEQUENCE.tracks).map(([k, keys]) => [k, sample(keys, t)]));
}
