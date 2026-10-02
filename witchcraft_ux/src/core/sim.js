// The mock simulation clock. Mock viewmodels register tick functions here to
// stand in for game state changing over time.
//
// Pausing has sources: the harness Pause toggle ('harness') and the game's own
// pause menu ('game', flow.md D3). The sim runs only when no
// source is holding it.

const ticks = new Set();
const pausedBy = new Set();
let simTime = 0;
let last = performance.now();

export function onTick(fn) {
  ticks.add(fn);
  return () => ticks.delete(fn);
}

export function setPaused(source, paused) {
  if (paused) pausedBy.add(source);
  else pausedBy.delete(source);
}

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (pausedBy.size === 0) {
    simTime += dt;
    for (const fn of ticks) fn(simTime, dt);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
