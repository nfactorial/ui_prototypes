// Motion, shaped like a UMG widget animation so it ports as data.
//
// An animation is a set of TRACKS, one per animatable property, each a list of
// KEYS: [timeSeconds, value, interp?]. `interp` is how the curve LEAVES that
// key toward the next one (UMG/Sequencer semantics), default 'cubicInOut'.
//
//   export const intro = defineAnimation('Intro', {
//     opacity:   [[0, 0, 'quadOut'], [0.25, 1]],
//     translate: [[0, [-24, 0], 'cubicOut'], [0.35, [0, 0]]],
//   });
//   ctx.play(el, intro, { delay: 0.1 });
//
// Tracks are limited to what a UMG animation can key on a widget:
//   opacity    number 0..1        → RenderOpacity
//   translate  [x, y] Slate units → RenderTransform.Translation
//   scale      [x, y]             → RenderTransform.Scale
//   shear      [x, y] degrees     → RenderTransform.Shear
//   angle      degrees            → RenderTransform.Angle
//   color      CSS colour         → ColorAndOpacity (text) / tint (images)
// Pivot comes from CSS `transform-origin` (RenderTransformPivot).
//
// Built on the Web Animations API — no library. A third-party motion library
// would make springs, physics and path motion easy, none of which UMG has.

// Slate's ECurveEaseFunction set (FCurveSequence) as CSS timing functions.
// ⚠️ Cubic-bezier fits of the polynomial curves — close, not exact.
export const EASE = {
  linear: 'linear',
  constant: 'steps(1, jump-end)', // UMG "constant" key: hold, then jump
  quadIn: 'cubic-bezier(0.11, 0, 0.5, 0)',
  quadOut: 'cubic-bezier(0.5, 1, 0.89, 1)',
  quadInOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
  cubicIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
  cubicOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  cubicInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
};

const PROPS = {
  opacity: (v) => ({ opacity: v }),
  translate: ([x, y]) => ({ translate: `${x}px ${y}px` }),
  scale: ([x, y]) => ({ scale: `${x} ${y}` }),
  shear: ([x, y]) => ({ transform: `skew(${x}deg, ${y}deg)` }),
  angle: (v) => ({ rotate: `${v}deg` }),
  color: (v) => ({ color: v }),
};

export function defineAnimation(name, tracks) {
  for (const [prop, keys] of Object.entries(tracks)) {
    if (!PROPS[prop]) throw new Error(`[motion] ${name}: "${prop}" is not a UMG-animatable track`);
    for (const k of keys) if (k[2] && !EASE[k[2]]) throw new Error(`[motion] ${name}: unknown interp "${k[2]}"`);
  }
  const length = Math.max(...Object.values(tracks).flatMap((keys) => keys.map((k) => k[0])));
  return { name, tracks, length };
}

// --- global time scale (harness slow-motion) ------------------------------------
let timeScale = 1;
export function setTimeScale(s) {
  timeScale = s;
  // Covers CSS transitions/animations too, not just ours.
  for (const a of document.getAnimations()) a.playbackRate = (a.npSpeed ?? 1) * s;
}

// Wait on UI time: like a timer, but it respects the harness Motion speed (and
// is cancellable via the returned stop). A no-op animation on the document.
export function wait(seconds) {
  const a = document.documentElement.animate([], { duration: seconds * 1000 });
  a.npSpeed = 1;
  a.playbackRate = timeScale;
  return { finished: a.finished.then(() => {}, () => {}), stop: () => a.cancel() };
}

// Play an animation on an element. Options, mirroring UMG's PlayAnimation:
//   delay     seconds before starting
//   loops     number of plays, Infinity to loop (UMG NumLoopsToPlay = 0)
//   mode      'forward' | 'reverse' | 'pingpong'
//   speed     playback speed multiplier
// Returns { finished: Promise, stop() }. The end state is held (fill: both).
export function play(el, anim, { delay = 0, loops = 1, mode = 'forward', speed = 1 } = {}) {
  const lengthMs = anim.length * 1000;
  const running = Object.entries(anim.tracks).map(([prop, keys]) => {
    const frames = keys.map(([t, v, interp]) => ({
      ...PROPS[prop](v),
      offset: lengthMs ? (t * 1000) / lengthMs : 0,
      easing: EASE[interp ?? 'cubicInOut'],
    }));
    // A track shorter than the animation holds its last key to the end.
    if (frames.at(-1).offset < 1) frames.push({ ...frames.at(-1), offset: 1 });
    const a = el.animate(frames, {
      duration: lengthMs,
      delay: delay * 1000,
      iterations: loops,
      direction: mode === 'reverse' ? 'reverse' : mode === 'pingpong' ? 'alternate' : 'normal',
      fill: 'both',
    });
    a.npSpeed = speed;
    a.playbackRate = speed * timeScale;
    return a;
  });

  return {
    finished: Promise.all(running.map((a) => a.finished)).catch(() => {}),
    stop: () => running.forEach((a) => a.cancel()),
  };
}
