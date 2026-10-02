// Wreck survey — a modal over the flight HUD. The world's three-number record
// (nullpoint.md A1.0c): certified rating, filed transit, where it was found.
import { defineAnimation } from '../../core/motion.js';

export default {
  id: 'wreck-survey',
  title: 'Wreck survey',
  layer: 'modal',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay" data-widget="WBP_WreckSurvey">
        <div class="s-border brush-scrim"></div>

        <div class="s-box h-center v-center" style="--w:780px">
          <div class="s-border brush-panel-solid wsv-panel">
            <div class="s-vbox">

              <div class="s-hbox np-panel-header">
                <div class="s-vbox fill">
                  <div class="s-text ts-label">Survey record</div>
                  <div class="s-text ts-title" data-bind="wreck.vessel"></div>
                </div>
                <div class="s-vbox v-bottom h-right wsv-reg">
                  <div class="s-text ts-caption just-right">Registry</div>
                  <div class="s-text ts-readout just-right" data-bind="wreck.registry"></div>
                </div>
              </div>
              <div class="s-box np-rule wsv-rule"></div>

              <div class="s-uniformgrid wsv-facts">
                ${fact('Operator', 'wreck.operator')}
                ${fact('Class', 'wreck.class')}
                ${fact('Last contact', 'wreck.lastContact')}
              </div>

              <!-- The three numbers -->
              <div class="s-uniformgrid wsv-numbers" data-widget="SNpRatingRecord">
                ${number('Hull certified', 'wreck.hullCert')}
                ${number('Filed transit', 'wreck.filedTransit')}
                ${number('Found at', 'wreck.foundAt', 'is-breach')}
              </div>

              <div class="s-hbox wsv-finding">
                <div class="s-box wsv-finding-rule" style="--w:2px"></div>
                <div class="s-text ts-body wrap c-danger fill" data-bind="wreck.finding"></div>
              </div>

              <div class="s-hbox wsv-actions">
                <button class="s-button np-button">Strip hull</button>
                <button class="s-button np-button">Recover nav log</button>
                <div class="s-spacer fill"></div>
                <button class="s-button np-button" disabled>Tow</button>
                <button class="s-button np-button danger">Leave</button>
              </div>

            </div>
          </div>
        </div>
      </div>`;

    ctx.bind();
    ctx.play(root.querySelector('.brush-scrim'), SCRIM_IN);
    ctx.play(root.querySelector('.wsv-panel'), PANEL_IN, { delay: 0.08 });
    root.querySelectorAll('.wsv-number').forEach((el, i) =>
      ctx.play(el, NUMBER_IN, { delay: 0.3 + i * 0.12 }));
  },
};

const SCRIM_IN = defineAnimation('ScrimIn', { opacity: [[0, 0, 'linear'], [0.2, 1]] });
const PANEL_IN = defineAnimation('PanelIn', {
  opacity: [[0, 0, 'quadOut'], [0.2, 1]],
  scale: [[0, [0.96, 0.96], 'cubicOut'], [0.3, [1, 1]]],
});
// The three numbers land one after another, the breach last.
const NUMBER_IN = defineAnimation('NumberIn', {
  opacity: [[0, 0, 'constant'], [0.05, 1]],
  translate: [[0, [0, 8], 'cubicOut'], [0.25, [0, 0]]],
});

function fact(label, path) {
  return /* html */ `
    <div class="s-vbox np-stat">
      <div class="s-text ts-caption">${label}</div>
      <div class="s-text ts-body" data-bind="${path}"></div>
    </div>`;
}

function number(label, path, mod = '') {
  return /* html */ `
    <div class="s-border wsv-number ${mod}">
      <div class="s-vbox">
        <div class="s-text ts-label">${label}</div>
        <div class="s-text wsv-number-value" data-bind="${path} | int"></div>
      </div>
    </div>`;
}
