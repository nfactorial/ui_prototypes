// Settings (stub). Reached from the main menu and the pause menu.
import { defineAnimation } from '../../core/motion.js';

const TABS = {
  Gameplay: [['Difficulty', ['Normal', 'Hard', 'Story']], ['Subtitles', ['On', 'Off']], ['Tutorial prompts', ['On', 'Off']]],
  Controls: [['Invert look', ['Off', 'On']], ['Look sensitivity', ['5', '6', '7', '3', '4']], ['Flight assist', ['On', 'Off']]],
  Video: [['Display mode', ['Fullscreen', 'Windowed', 'Borderless']], ['Resolution', ['1920×1080', '2560×1440', '3840×2160']], ['Quality', ['High', 'Epic', 'Low', 'Medium']]],
  Audio: [['Master', ['80%', '90%', '100%', '60%', '70%']], ['Music', ['60%', '80%', '100%', '40%']], ['Dialogue', ['100%', '80%']]],
  Accessibility: [['HUD scale', ['100%', '125%', '150%', '75%']], ['Screen shake', ['On', 'Reduced', 'Off']], ['Colour-blind mode', ['Off', 'Deuteranopia', 'Protanopia', 'Tritanopia']]],
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
            <button class="s-button gb-button" data-back>Back <span class="gb-key">Esc</span></button>
          </div>
          <div class="s-hbox fill set-body">
            <div class="s-vbox set-tabs">
              ${Object.keys(TABS).map((t, i) => `<button class="s-button gb-card" data-tab="${t}" aria-selected="${i === 0}" ${i === 0 ? 'data-focus-default' : ''}>${t}</button>`).join('')}
            </div>
            <div class="s-vbox fill set-rows" data-rows></div>
          </div>
          <div class="gb-note">Stub. Settings content isn't designed. This exists so the flow has somewhere to go.</div>
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
    show('Gameplay');
    root.querySelector('[data-back]').onclick = () => ctx.action('back');
    ctx.play(root.querySelector('.set'), IN);
  },
};
