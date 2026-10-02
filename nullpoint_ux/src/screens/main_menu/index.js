// Main menu (flow.md F1, F10): basic options over an animated derelict in space.
import { defineAnimation } from '../../core/motion.js';

// Background motion. In Unreal this is a live 3D menu scene; here it's layered 2D.
const STARS_FAR = defineAnimation('StarsFar', { translate: [[0, [0, 0], 'linear'], [240, [-1024, 0]]] });
const STARS_NEAR = defineAnimation('StarsNear', { translate: [[0, [0, 0], 'linear'], [120, [-1400, 0]]] });
const TUMBLE = defineAnimation('Tumble', { angle: [[0, 0, 'linear'], [360, -360]] });
const DRIFT = defineAnimation('Drift', { translate: [[0, [40, -10], 'quadInOut'], [60, [-40, 14]]] });
// Light sweeping across the hull as it turns: rim fades up, holds, fades away.
const GLINT = defineAnimation('Glint', { opacity: [[0, 0, 'quadInOut'], [5, 0.9, 'quadInOut'], [7, 0.9, 'quadInOut'], [12, 0], [18, 0]] });

const MENU_IN = defineAnimation('MenuIn', {
  opacity: [[0, 0, 'quadOut'], [0.6, 1]],
  translate: [[0, [-20, 0], 'cubicOut'], [0.8, [0, 0]]],
});
const BG_IN = defineAnimation('BgIn', { opacity: [[0, 0, 'quadOut'], [2.5, 1]] });

export default {
  id: 'main-menu',
  title: 'Main menu',
  layer: 'menu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay gb mm" data-widget="WBP_MainMenu">

        <!-- Stand-in for the 3D menu scene -->
        <div class="s-overlay mm-bg hit-invisible" data-widget="(3D menu scene)">
          <div class="mm-stars far"></div>
          <div class="mm-stars near"></div>
          <div class="s-box mm-derelict-pos h-center v-center">
            <div class="s-overlay mm-derelict">
              <div class="s-image stretch" style="--img:url(/assets/menu/derelict.svg)"></div>
              <div class="s-image stretch mm-rim" style="--img:url(/assets/menu/derelict_rim.svg)"></div>
            </div>
          </div>
          <div class="mm-vignette"></div> <!-- SLATE: material (radial gradient) -->
        </div>

        <!-- The menu -->
        <div class="s-vbox mm-menu h-left v-bottom">
          <div class="s-text gb-display">NULL POINT</div>
          <div class="s-text gb-label mm-sub">Working title</div>
          <div class="s-vbox mm-buttons">
            <button class="s-button gb-button big primary" data-action="continue" data-focus-default
              data-tip-meta="Last save" data-tip-title="The Kestrel" data-tip-body="Docked, Harrow system. Recovery contract active." data-tip-stats="Saved:2 hours ago|Played:4 h 12 m">Continue</button>
            <button class="s-button gb-button big" data-action="new-game">New game</button>
            <button class="s-button gb-button big" data-action="settings">Settings</button>
            <button class="s-button gb-button big" data-action="quit">Quit</button>
          </div>
        </div>

        <div class="s-vbox mm-notes h-right v-bottom">
          <div class="gb-note">Grey-box. F1: basic menu · F10: derelict background</div>
          <div class="s-text gb-small just-right">Arrows + Enter, or mouse</div>
        </div>
      </div>`;

    root.querySelectorAll('[data-action]').forEach((b) => { b.onclick = () => ctx.action(b.dataset.action); });

    const bg = root.querySelector('.mm-bg');
    const derelict = root.querySelector('.mm-derelict');
    ctx.play(bg, BG_IN);
    ctx.play(root.querySelector('.mm-stars.far'), STARS_FAR, { loops: Infinity });
    ctx.play(root.querySelector('.mm-stars.near'), STARS_NEAR, { loops: Infinity });
    const style = ctx.variant('menubg');
    if (style !== 'drift') ctx.play(derelict, TUMBLE, { loops: Infinity });
    ctx.play(root.querySelector('.mm-derelict-pos'), DRIFT, { loops: Infinity, mode: 'pingpong' });
    ctx.play(root.querySelector('.mm-rim'), GLINT, { loops: Infinity, delay: 2 });
    ctx.play(root.querySelector('.mm-menu'), MENU_IN, { delay: 0.8 });
  },
};
