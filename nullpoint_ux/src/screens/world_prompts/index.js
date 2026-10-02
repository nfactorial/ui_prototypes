// In-world prompts (flow.md F2): the game launches straight into the world and
// teaches through prompts. Two kinds here, as a first pass:
//   • an onboarding tip, shown until the player has opened the computer once
//   • persistent key hints, always available
// Interaction prompts ("E  Force hatch") live on the boarding HUD.
import { defineAnimation } from '../../core/motion.js';

const TIP_IN = defineAnimation('TipIn', {
  opacity: [[0, 0, 'quadOut'], [0.4, 1]],
  translate: [[0, [0, 24], 'cubicOut'], [0.5, [0, 0]]],
});

export default {
  id: 'world-prompts',
  title: 'In-world prompts',
  layer: 'game',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay gb wp hit-invisible" data-widget="WBP_WorldPrompts">

        <div class="s-hbox wp-hints h-right v-top" data-widget="SNpKeyHints">
          <span class="s-hbox wp-hint"><span class="gb-key">C</span><span class="s-text gb-small">Computer</span></span>
          <span class="s-hbox wp-hint"><span class="gb-key">Esc</span><span class="s-text gb-small">Menu</span></span>
          <span class="s-hbox wp-hint wp-demo"><span class="gb-key">1–6</span><span class="s-text gb-small">Demo toasts</span></span>
        </div>

        <div class="s-box h-center v-bottom wp-tip-pos" style="--w:560px" data-bind-visible="!game.computerSeen">
          <div class="s-border gb-panel wp-tip" data-widget="SNpOnboardingTip">
            <div class="s-hbox wp-tip-row">
              <span class="gb-key wp-tip-key">C</span>
              <div class="s-vbox fill">
                <div class="s-text gb-h3">Your computer</div>
                <div class="s-text gb-body wrap gb-dim">Missions, loadout and your ship live there. You can open it any time you're aboard.</div>
              </div>
            </div>
          </div>
        </div>

      </div>`;
    ctx.bind();
    ctx.play(root.querySelector('.wp-tip'), TIP_IN, { delay: 1.5 });
  },
};
