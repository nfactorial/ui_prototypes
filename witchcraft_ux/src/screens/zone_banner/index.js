// Zone banner (built in the game: WBP_ZoneBanner + UZoneBannerComponent).
// Rules from zones_prd §Name banner, kept exactly:
//   • arriving/spawning is silent (no banner at launch)
//   • an unnamed zone shows nothing
//   • a new zone while a banner is showing restarts it
import { defineAnimation } from '../../core/motion.js';

// In, hold, out, as one animation (the WBP does fade in / hold / fade out).
const BANNER = defineAnimation('ZoneBanner', {
  opacity: [[0, 0, 'quadOut'], [0.9, 1, 'linear'], [3.4, 1, 'quadIn'], [4.4, 0]],
  translate: [[0, [0, 10], 'cubicOut'], [1.2, [0, 0]]],
});
const RULE = defineAnimation('ZoneBannerRule', { scale: [[0, [0, 1], 'cubicOut'], [1.4, [1, 1]]] });

export default {
  id: 'zone-banner',
  title: 'Zone banner',
  layer: 'game',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    // Variant 'banner': the name alone, or with the map's name above it (world/structure.md: themed maps).
    const withMap = ctx.variant('banner') === 'map';
    root.innerHTML = /* html */ `
      <div class="s-overlay gb zb hit-invisible" data-widget="WBP_ZoneBanner">
        <div class="s-vbox zb-banner h-center v-top ts-world">
          <div class="s-text zb-kicker ${withMap ? '' : 'collapsed'}">The Greenmarch</div>
          <div class="s-text zb-name" data-widget="ZoneNameText"></div>
          <div class="s-hbox zb-rules"><div class="zb-rule l fill"></div><div class="zb-dot"></div><div class="zb-rule r fill"></div></div>
        </div>
      </div>`;
    const banner = root.querySelector('.zb-banner');
    const nameEl = root.querySelector('.zb-name');
    let running = [];

    const reveal = (name) => {
      if (!name) return;                          // unnamed zone: nothing (a showing banner finishes)
      running.forEach((h) => h.stop());          // restart if one is showing
      running = [];
      nameEl.textContent = name;
      running.push(ctx.play(banner, BANNER));
      root.querySelectorAll('.zb-rule').forEach((r) => running.push(ctx.play(r, RULE, { delay: 0.3 })));
    };

    const off = ctx.vm.world.on('zoneName', reveal, { immediate: false }); // silent on spawn

    return off;
  },
};
