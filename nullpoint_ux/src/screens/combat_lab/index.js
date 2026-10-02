// Combat lab: a test bench (not a game screen) for the boarding HUD's vitals.
// Throw hits, heal, kill, toggle auto-combat and the warning sound, and tune
// the rules (recharge delay, danger threshold) live.
import { damage, heal, resetVitals, vitals } from '../../mock/boarding.js';

const DELAYS = [1.5, 3, 5];
const DANGER = [0.15, 0.25, 0.35];

export default {
  id: 'combat-lab',
  title: 'Combat lab',
  layer: 'menu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const vm = ctx.vm.boarding;
    root.innerHTML = /* html */ `
      <div class="s-overlay gb clab">
        <div class="s-border gb-panel clab-panel h-right v-center">
          <div class="s-vbox clab-body">
            <div class="s-hbox clab-head">
              <div class="s-text gb-h3 fill">Combat lab</div>
              <button class="s-button gb-button clab-mini" data-collapse data-tip="Hide the panel (the HUD keeps running)">Hide</button>
            </div>
            <div class="s-vbox clab-content">
              <div class="gb-note">Test bench. Switch <b>Vitals</b> in the toolbar for the four layouts.</div>

              <div class="s-text gb-label">Damage</div>
              <div class="s-grid clab-grid">
                <button class="s-button gb-button" data-dmg="0.1">Light hit 10%</button>
                <button class="s-button gb-button" data-dmg="0.3">Heavy hit 30%</button>
                <button class="s-button gb-button" data-dmg="0.6">Blast 60%</button>
                <button class="s-button gb-button" data-dmg="9">Kill</button>
                <button class="s-button gb-button" data-heal="0.5">Med kit +50%</button>
                <button class="s-button gb-button" data-reset>Reset</button>
              </div>

              <div class="s-text gb-label">Behaviour</div>
              <button class="s-button gb-card clab-toggle" data-toggle="autoCombat"></button>
              <button class="s-button gb-card clab-toggle" data-toggle="sound"></button>

              <div class="s-text gb-label">Recharge delay</div>
              <div class="s-hbox clab-seg" data-param="rechargeDelay">
                ${DELAYS.map((d) => `<button class="s-button gb-button" data-value="${d}">${d}s</button>`).join('')}
              </div>
              <div class="s-text gb-label">Danger below</div>
              <div class="s-hbox clab-seg" data-param="dangerAt">
                ${DANGER.map((d) => `<button class="s-button gb-button" data-value="${d}">${Math.round(d * 100)}%</button>`).join('')}
              </div>

              <div class="s-grid clab-readout">
                <div class="s-text gb-label">Shield</div><div class="s-text gb-body" data-read="shield"></div>
                <div class="s-text gb-label">Health</div><div class="s-text gb-body" data-read="health"></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    root.querySelectorAll('[data-dmg]').forEach((b) => { b.onclick = () => damage(Number(b.dataset.dmg)); });
    root.querySelector('[data-heal]').onclick = () => heal(0.5);
    root.querySelector('[data-reset]').onclick = () => resetVitals();

    const LABELS = { autoCombat: 'Auto-combat', sound: 'Warning sound (danger)' };
    root.querySelectorAll('[data-toggle]').forEach((b) => {
      const key = b.dataset.toggle;
      const render = () => { b.innerHTML = `<span class="s-hbox"><span class="s-text gb-body fill">${LABELS[key]}</span><span class="s-text gb-label">${vm.get(key) ? 'On' : 'Off'}</span></span>`; b.setAttribute('aria-selected', String(!!vm.get(key))); };
      b.onclick = () => { vm.set(key, !vm.get(key)); render(); };
      render();
    });

    root.querySelectorAll('[data-param]').forEach((group) => {
      const key = group.dataset.param;
      const mark = () => group.querySelectorAll('[data-value]').forEach((b) => b.classList.toggle('primary', Number(b.dataset.value) === vitals.params[key]));
      group.querySelectorAll('[data-value]').forEach((b) => { b.onclick = () => { vitals.params[key] = Number(b.dataset.value); mark(); }; });
      mark();
    });

    const collapse = root.querySelector('[data-collapse]');
    collapse.onclick = () => {
      const hidden = root.querySelector('.clab-content').classList.toggle('collapsed');
      collapse.textContent = hidden ? 'Show' : 'Hide';
    };

    const fmt = (v, st) => `${Math.round(v * 100)}%${st && st !== 'ok' && st !== 'full' ? ` · ${st}` : ''}`;
    const offs = [
      vm.on('shield', () => { root.querySelector('[data-read="shield"]').textContent = fmt(vm.get('shield'), vm.get('shieldState')); }),
      vm.on('shieldState', () => { root.querySelector('[data-read="shield"]').textContent = fmt(vm.get('shield'), vm.get('shieldState')); }),
      vm.on('health', () => { root.querySelector('[data-read="health"]').textContent = fmt(vm.get('health'), vm.get('healthState')); }),
      vm.on('healthState', () => { root.querySelector('[data-read="health"]').textContent = fmt(vm.get('health'), vm.get('healthState')); }),
    ];
    return () => offs.forEach((off) => off());
  },
};
