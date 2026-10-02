// Style guide: every token, text style, brush, control and icon in one place.
// The first thing to look at when changing the look, and the checklist for
// building the Slate style set.

import { defineAnimation } from '../../core/motion.js';

const SWEEP = defineAnimation('Sweep', { angle: [[0, 0, 'linear'], [3, 360]] });

const COLOURS = [
  'void', 'panel', 'panel-solid', 'scrim', 'line', 'line-strong',
  'primary', 'primary-dim', 'text', 'text-dim', 'text-faint',
  'ref', 'caution', 'danger',
  'derelict', 'hostile', 'neutral', 'body',
];
const TEXT_STYLES = ['ts-title', 'ts-heading', 'ts-label', 'ts-body', 'ts-caption', 'ts-readout', 'ts-readout-lg', 'ts-prompt'];
const BRUSHES = ['brush-panel', 'brush-panel-solid', 'brush-chamfer', 'brush-scrim'];
const ICONS = ['diamond', 'triangle', 'square', 'circle', 'arrow', 'reticle'];
const TINTS = ['c-primary', 'c-text', 'c-ref', 'c-caution', 'c-danger'];

export default {
  id: 'style-guide',
  title: 'Style guide',
  layer: 'menu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-border brush-panel-solid sg" data-widget="WBP_StyleGuide">
        <div class="s-scroll">
          <div class="s-vbox sg-body">

            <div class="s-text ts-title">Style guide</div>
            <div class="s-text ts-caption sg-sub">styles/tokens.css → FSlateStyleSet · font sizes are Slate sizes</div>

            ${section('Colours', `<div class="s-wrapbox sg-swatches">${COLOURS.map(swatch).join('')}</div>`)}

            ${section('Text styles', `<div class="s-vbox sg-list">${TEXT_STYLES.map(textRow).join('')}</div>`)}

            ${section('Brushes', `<div class="s-hbox sg-row">${BRUSHES.map(brush).join('')}</div>`)}

            ${section('Tessera textures — tessera/*.toml → assets/tessera/', /* html */ `
              <div class="s-hbox sg-row">
                <div class="s-vbox sg-swatch">
                  <div class="s-box" style="--w:320px; --h:140px">
                    <div class="s-overlay">
                      <div class="s-border brush-panel"></div>
                      <div class="s-image tint tile stretch c-primary sg-grime"
                           style="--img:url(/assets/tessera/panel_grime.png); --tile-w:128px; --tile-h:128px"></div>
                    </div>
                  </div>
                  <div class="s-text ts-caption">panel_grime · tiled 128 · tint primary @ 12%</div>
                </div>
                <div class="s-vbox sg-swatch">
                  <div class="s-box" style="--w:140px; --h:140px">
                    <div class="s-overlay">
                      <div class="s-border sg-scope"></div>
                      <div class="s-image tint stretch c-ref sg-sweep" style="--img:url(/assets/tessera/scanner_sweep.png)"></div>
                    </div>
                  </div>
                  <div class="s-text ts-caption">scanner_sweep · angle track, looped</div>
                </div>
              </div>`)}

            ${section('Buttons', /* html */ `
              <div class="s-hbox sg-row">
                <button class="s-button np-button">Normal</button>
                <button class="s-button np-button danger">Danger</button>
                <button class="s-button np-button" disabled>Disabled</button>
                <div class="s-border np-key v-center"><div class="s-text">E</div></div>
              </div>`)}

            ${section('Progress bars', /* html */ `
              <div class="s-hbox sg-row">
                ${[0.15, 0.5, 0.85].map((p) => `
                  <div class="s-box" style="--w:220px"><div class="s-vbox np-bar">
                    <div class="s-hbox"><div class="s-text ts-label fill">Value</div><div class="s-text ts-readout">${Math.round(p * 100)}%</div></div>
                    <div class="s-progress" style="--pct:${p}"></div>
                  </div></div>`).join('')}
                <div class="s-box" style="--w:220px"><div class="s-vbox np-bar" data-state="warn">
                  <div class="s-hbox"><div class="s-text ts-label fill">Warn</div></div>
                  <div class="s-progress" style="--pct:0.3"></div>
                </div></div>
                <div class="s-box" style="--w:220px"><div class="s-vbox np-bar" data-state="danger">
                  <div class="s-hbox"><div class="s-text ts-label fill">Danger</div></div>
                  <div class="s-progress" style="--pct:0.1"></div>
                </div></div>
              </div>`)}

            ${section('Icons — white SVG × tint', /* html */ `
              <div class="s-vbox sg-list">
                ${TINTS.map((t) => `<div class="s-hbox sg-icons">${ICONS.map((i) =>
                  `<div class="s-image tint ${t}" style="--img:url(/assets/icons/${i}.svg); --w:28px; --h:28px"></div>`).join('')}
                  <div class="s-text ts-caption v-center">${t}</div></div>`).join('')}
              </div>`)}

            ${section('Contact shapes — never colour alone', /* html */ `
              <div class="s-hbox sg-row">
                ${[['derelict', 'diamond'], ['hostile', 'triangle'], ['neutral', 'square'], ['body', 'circle']].map(([k, i]) => `
                  <div class="s-hbox np-contact np-marker" data-kind="${k}">
                    <div class="s-image tint glyph" style="--img:url(/assets/icons/${i}.svg)"></div>
                    <div class="s-text name">${k}</div>
                  </div>`).join('')}
              </div>`)}

            ${section('Box slots — Auto vs Fill', /* html */ `
              <div class="s-vbox sg-list">
                ${slots(['auto', 'fill', 'auto'])}
                ${slots(['fill', 'fill-2', 'fill'])}
                ${slots(['auto', 'auto', 'fill-3'])}
              </div>`)}

          </div>
        </div>
      </div>`;

    ctx.play(root.querySelector('.sg-sweep'), SWEEP, { loops: Infinity });
  },
};

function section(title, body) {
  return /* html */ `
    <div class="s-vbox sg-section">
      <div class="s-text ts-heading">${title}</div>
      <div class="s-box np-rule sg-rule"></div>
      ${body}
    </div>`;
}

function swatch(name) {
  return /* html */ `
    <div class="s-vbox sg-swatch">
      <div class="s-box sg-chip" style="--w:120px; --h:48px"><div class="s-border" style="background-color:var(--col-${name})"></div></div>
      <div class="s-text ts-caption">--col-${name}</div>
    </div>`;
}

function textRow(cls) {
  return /* html */ `
    <div class="s-hbox sg-text-row">
      <div class="s-box" style="--w:160px"><div class="s-text ts-caption v-center">${cls}</div></div>
      <div class="s-text ${cls}">Reference 6.2 — Hull certified</div>
    </div>`;
}

function brush(cls) {
  return /* html */ `
    <div class="s-vbox sg-swatch">
      <div class="s-box" style="--w:200px; --h:96px"><div class="s-border ${cls}"></div></div>
      <div class="s-text ts-caption">${cls}</div>
    </div>`;
}

function slots(kinds) {
  return /* html */ `
    <div class="s-hbox sg-slots">
      ${kinds.map((k) => `<div class="s-border sg-slot ${k === 'auto' ? '' : k}"><div class="s-text ts-readout">${k}</div></div>`).join('')}
    </div>`;
}
