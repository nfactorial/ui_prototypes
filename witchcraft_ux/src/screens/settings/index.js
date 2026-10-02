// Settings (grey-box). Reached from the main menu and the pause menu.
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';

// Camera is the one tab with real requirements: camera PRD stage G (todo 8).
// "Look inversion and sensitivity are settings, not tuning", stick and mouse separately.
const TABS = {
  Camera: [['Mouse sensitivity (horizontal)', ['5', '6', '7', '8', '1', '2', '3', '4']], ['Mouse sensitivity (vertical)', ['5', '6', '7', '8', '1', '2', '3', '4']], ['Invert mouse look', ['Off', 'On']],
           ['Stick sensitivity (horizontal)', ['5', '6', '7', '8', '1', '2', '3', '4']], ['Stick sensitivity (vertical)', ['5', '6', '7', '8', '1', '2', '3', '4']], ['Invert stick look', ['Off', 'On']],
           ['Camera auto-centre', ['On', 'Off']], ['Camera shake', ['On', 'Reduced', 'Off']]],
  Controls: [['Keyboard layout', ['ESDF', 'WASD']], ['Remap keys', ['…']], ['Hold or toggle selectors', ['Hold', 'Toggle']]],
  Video: [['Display mode', ['Fullscreen', 'Windowed', 'Borderless']], ['Resolution', ['1920×1080', '2560×1440', '3840×2160']], ['Quality', ['High', 'Epic', 'Low', 'Medium']]],
  Audio: [['Master', ['80%', '90%', '100%', '60%', '70%']], ['Music', ['60%', '80%', '100%', '40%']], ['Villager voices', ['100%', '80%', '50%', 'Off']], ['World', ['100%', '80%']]],
  Accessibility: [['UI scale', ['100%', '125%', '150%', '75%']], ['Subtitles', ['On', 'Off']], ['Screen transitions', ['Wipe', 'Fade', 'Cut']], ['Cinematics', ['Play', 'Ask first', 'Skip']]],
};

const IN = defineAnimation('SettingsIn', { opacity: [[0, 0, 'quadOut'], [0.2, 1]] });

export default {
  id: 'settings',
  title: 'Settings',
  layer: 'menu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay gb set" data-widget="WBP_Settings">
        <div class="s-border set-scrim"></div>
        <div class="s-vbox set-frame">
          <div class="s-hbox set-head">
            <div class="s-text gb-title fill">Settings</div>
            <button class="s-button gb-button" data-back>Back ${glyph('back')}</button>
          </div>
          <div class="s-hbox fill set-body">
            <div class="s-vbox set-tabs">
              ${Object.keys(TABS).map((t, i) => `<button class="s-button gb-card" data-tab="${t}" aria-selected="${i === 0}" ${i === 0 ? 'data-focus-default' : ''}>${t}</button>`).join('')}
            </div>
            <div class="s-vbox fill set-rows" data-rows></div>
          </div>
          <div class="gb-note">Camera rows are from the camera PRD stage G (todo 8). The other tabs are placeholders.</div>
        </div>
      </div>`;

    const rows = root.querySelector('[data-rows]');
    const show = (tab) => {
      rows.innerHTML = TABS[tab].map(([label, values], i) => /* html */ `
        <button class="s-button gb-card set-row" data-row="${i}">
          <span class="s-hbox"><span class="s-text gb-body fill">${label}</span><span class="s-text gb-body set-value">◂ ${values[0]} ▸</span></span>
        </button>`).join('');
      rows.querySelectorAll('[data-row]').forEach((b) => {
        const values = TABS[tab][b.dataset.row][1];
        let v = 0;
        b.onclick = () => { v = (v + 1) % values.length; b.querySelector('.set-value').textContent = `◂ ${values[v]} ▸`; };
      });
    };
    root.querySelectorAll('[data-tab]').forEach((b) => {
      b.onclick = () => {
        root.querySelectorAll('[data-tab]').forEach((t) => t.setAttribute('aria-selected', String(t === b)));
        show(b.dataset.tab);
      };
    });
    show('Camera');
    root.querySelector('[data-back]').onclick = () => ctx.action('back');
    ctx.play(root.querySelector('.set'), IN);
  },
};
