// Mock boarding (first-person) state: shield + health (vitals_model.js), ammo,
// objective, interaction prompt. Driven by the combat lab and an optional
// auto-combat loop that throws hits at the player.
// ⚠️ Numbers are placeholders; the game's first-person layer doesn't define them yet.

import { createViewModel } from '../core/viewmodel.js';
import { onTick } from '../core/sim.js';
import { createVitals } from './vitals_model.js';

export const vitals = createVitals();

export const boarding = createViewModel('boarding', {
  shield: 1,
  health: 1,
  shieldState: 'full',      // full | damaged | recharging | broken
  healthState: 'ok',        // ok | danger | dead
  hit: null,                // last hit: { id, toShield, toHealth, broke } (id changes every hit)
  dead: false,
  deadHint: '',
  autoCombat: true,
  sound: false,             // danger warning beep (off by default)

  objective: 'Recover the nav log',
  ammo: 23,
  magazine: 30,
  reserve: 90,
  promptVisible: true,
  promptKey: 'E',
  promptText: 'Force hatch',
});

let hitId = 0;
export function damage(amount) {
  const r = vitals.damage(amount);
  if (r.toShield || r.toHealth) boarding.set('hit', { id: ++hitId, ...r });
  publish();
  return r;
}
export function heal(amount) { vitals.heal(amount); publish(); }
export function resetVitals() { vitals.reset(); publish(); }

function publish(state = vitals.state) {
  boarding.patch({
    shield: Math.round(state.shield * 1000) / 1000,
    health: Math.round(state.health * 1000) / 1000,
    shieldState: state.shieldState,
    healthState: state.healthState,
  });
}

// Auto-combat: bursts of small hits with pauses, so the shield breaks, recharges,
// and health occasionally dips into danger. Respawns a few seconds after death.
let nextHitAt = 2;
let deadAt = null;
onTick((t) => {
  publish(vitals.tick(t));
  if (!boarding.get('autoCombat')) return;

  if (boarding.get('healthState') === 'dead') {
    deadAt ??= t;
    if (t - deadAt > 4) { resetVitals(); deadAt = null; nextHitAt = t + 2; }
    return;
  }
  if (t >= nextHitAt) {
    damage(0.06 + Math.random() * 0.12);
    boarding.set('ammo', Math.max(0, boarding.get('ammo') - 1) || 30);
    // mostly quick follow-ups, sometimes a long pause (lets the shield recharge)
    nextHitAt = t + (Math.random() < 0.8 ? 0.25 + Math.random() * 0.5 : 4 + Math.random() * 3);
  }
});
