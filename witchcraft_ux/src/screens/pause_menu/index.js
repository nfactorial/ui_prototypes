// Pause / system menu (flow.md): Esc, anywhere.
import { defineAnimation } from '../../core/motion.js';

const SCRIM_IN = defineAnimation('ScrimIn', { opacity: [[0, 0, 'linear'], [0.15, 1]] });
const PANEL_IN = defineAnimation('PanelIn', {
  opacity: [[0, 0, 'quadOut'], [0.2, 1]],
  translate: [[0, [0, 16], 'cubicOut'], [0.25, [0, 0]]],
});

export default {
  id: 'pause-menu',
  title: 'Pause menu',
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay gb pm" data-widget="WBP_PauseMenu">
        <div class="s-border pm-scrim"></div> <!-- SLATE: SBackgroundBlur if blurred -->
        <div class="s-vbox pm-panel h-center v-center">
          <div class="s-text gb-title pm-title">Paused</div>
          <button class="s-button gb-button big primary" data-action="resume" data-focus-default>Resume</button>
          <button class="s-button gb-button big" data-action="settings">Settings</button>
          <button class="s-button gb-button big" data-action="main-menu">Main menu</button>
          <button class="s-button gb-button big" data-action="quit">Quit to desktop</button>
          <div class="gb-note pm-note">Proposed: Esc pauses anywhere. Open: does the world stop, or does the day keep turning behind the menu?</div>
        </div>
      </div>`;
    root.querySelectorAll('[data-action]').forEach((b) => { b.onclick = () => ctx.action(b.dataset.action); });
    ctx.play(root.querySelector('.pm-scrim'), SCRIM_IN);
    ctx.play(root.querySelector('.pm-panel'), PANEL_IN);
  },
};
