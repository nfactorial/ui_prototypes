// Main menu (flow.md M1): basic options over the living world.
import { defineAnimation } from '../../core/motion.js';

// Which in-engine shot stands in for the menu scene (variant 'menubg').
const SHOTS = {
  golden: { src: '/assets/backdrops/cliff_golden.jpg', focus: '40% 60%' },
  night:  { src: '/assets/backdrops/night_moon.jpg',   focus: '50% 50%' },
  path:   { src: '/assets/backdrops/path_golden.jpg',  focus: '50% 60%' },
};

// A slow push-in: the stand-in for a live 3D menu scene with a drifting camera.
const PUSH = defineAnimation('MenuPush', {
  scale: [[0, [1.04, 1.04], 'quadInOut'], [40, [1.14, 1.14]]],
  translate: [[0, [0, 0], 'quadInOut'], [40, [-40, -10]]],
});
const BG_IN = defineAnimation('MenuBgIn', { opacity: [[0, 0, 'quadOut'], [2.5, 1]] });
const TITLE_IN = defineAnimation('MenuTitleIn', {
  opacity: [[0, 0, 'quadOut'], [1.2, 1]],
  translate: [[0, [0, 14], 'cubicOut'], [1.4, [0, 0]]],
});
const MENU_IN = defineAnimation('MenuIn', {
  opacity: [[0, 0, 'quadOut'], [0.6, 1]],
  translate: [[0, [-16, 0], 'cubicOut'], [0.8, [0, 0]]],
});

export default {
  id: 'main-menu',
  title: 'Main menu',
  layer: 'menu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const shot = SHOTS[ctx.variant('menubg')] ?? SHOTS.golden;
    root.innerHTML = /* html */ `
      <div class="s-overlay gb mm" data-widget="WBP_MainMenu">

        <div class="s-overlay mm-bg hit-invisible" data-widget="(3D menu scene)">
          <div class="s-image cover mm-shot" style="--img:url(${shot.src}); --focus:${shot.focus}"></div>
          <div class="mm-vignette"></div> <!-- SLATE: material (gradient), or the scene's post-process -->
        </div>

        <div class="s-vbox mm-menu h-left v-center">
          <div class="s-vbox mm-title-block">
            <div class="s-text mm-small ts-world">A Little</div>
            <div class="s-text gb-display mm-title ts-world">Witchcraft</div>
            <div class="s-text gb-body mm-tag ts-world h-center">Every witch needs a home</div>
          </div>
          <div class="s-vbox mm-buttons">
            <button class="s-button gb-button big primary" data-action="continue" data-focus-default
              data-tip-meta="Last visit" data-tip-title="Silverwood" data-tip-body="Evening, clear skies. Your wisp is still out." data-tip-stats="Saved:yesterday|Days in the Greenmarch:14">Continue</button>
            <button class="s-button gb-button big" data-action="new-game">New game</button>
            <button class="s-button gb-button big" data-action="settings">Settings</button>
            <button class="s-button gb-button big" data-action="quit">Quit</button>
          </div>
        </div>

        <div class="s-vbox mm-notes h-right v-bottom">
          <div class="gb-note on-world">Grey-box. Background is an in-engine shot pushing in slowly (a live 3D scene in the game). Variant: Menu bg</div>
        </div>
      </div>`;

    root.querySelectorAll('[data-action]').forEach((b) => { b.onclick = () => ctx.action(b.dataset.action); });
    ctx.play(root.querySelector('.mm-bg'), BG_IN);
    ctx.play(root.querySelector('.mm-shot'), PUSH, { loops: Infinity, mode: 'pingpong' });
    ctx.play(root.querySelector('.mm-title-block'), TITLE_IN, { delay: 0.6 });
    ctx.play(root.querySelector('.mm-buttons'), MENU_IN, { delay: 1.4 });
  },
};
