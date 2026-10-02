// Shield + health rules. Pure logic, no DOM: this is the behaviour the game's
// character component would implement, written so it ports directly.
//
//   • Damage hits the shield first; whatever the shield can't absorb comes off health.
//   • The shield recharges once no damage has been taken for `rechargeDelay` seconds.
//   • Health doesn't regenerate (heal() is an explicit pickup/med kit).
//   • Health at or below `dangerAt` → danger mode. Health 0 → dead.
//
// Values are 0..1. Times are seconds of game time.

export const DEFAULT_PARAMS = {
  rechargeDelay: 3,     // seconds without damage before the shield starts refilling
  rechargeRate: 0.4,    // shield per second while recharging (0.4 → empty to full in 2.5 s)
  dangerAt: 0.25,       // health fraction that triggers danger mode
};

export function createVitals(params = {}) {
  const p = { ...DEFAULT_PARAMS, ...params };
  const s = { shield: 1, health: 1, lastDamageAt: -Infinity, time: 0, dead: false };

  const derive = () => ({
    shield: s.shield,
    health: s.health,
    // full | damaged (waiting to recharge) | recharging | broken (empty)
    shieldState: s.shield >= 1 ? 'full'
      : s.time - s.lastDamageAt >= p.rechargeDelay && !s.dead ? 'recharging'
      : s.shield <= 0 ? 'broken' : 'damaged',
    // ok | danger | dead
    healthState: s.dead ? 'dead' : s.health <= p.dangerAt ? 'danger' : 'ok',
    // 0..1 progress towards the recharge starting (for a "cooldown" readout)
    rechargeWait: Math.min(1, (s.time - s.lastDamageAt) / p.rechargeDelay),
  });

  return {
    params: p,

    // Returns what the hit did, for hit feedback: { toShield, toHealth, broke, died }
    damage(amount) {
      if (s.dead || amount <= 0) return { toShield: 0, toHealth: 0, broke: false, died: false };
      const hadShield = s.shield > 0;
      const toShield = Math.min(s.shield, amount);
      s.shield -= toShield;
      const toHealth = Math.min(s.health, amount - toShield);
      s.health -= toHealth;
      s.lastDamageAt = s.time;
      if (s.health <= 0) { s.health = 0; s.dead = true; }
      return { toShield, toHealth, broke: hadShield && s.shield <= 0, died: s.dead };
    },

    heal(amount) {
      if (!s.dead) s.health = Math.min(1, s.health + amount);
    },

    reset() {
      Object.assign(s, { shield: 1, health: 1, lastDamageAt: -Infinity, dead: false });
    },

    tick(time) {
      const dt = Math.max(0, time - s.time);
      s.time = time;
      const sinceDelay = s.time - s.lastDamageAt - p.rechargeDelay; // time spent past the delay
      if (!s.dead && s.shield < 1 && sinceDelay >= 0) {
        s.shield = Math.min(1, s.shield + p.rechargeRate * Math.min(dt, sinceDelay));
      }
      return derive();
    },

    get state() { return derive(); },
  };
}
