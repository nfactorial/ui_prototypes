// Records: every ship you've scanned (scanning.md). The three numbers, readings
// placed on a schematic, and readings that disagree (possible falsification, S3).
import { records } from '../../../mock/computer.js';
import { selectableList } from '../list.js';

const MARK = { uncertain: '?', conflict: '≠' };
const FLAG_TIP = {
  uncertain: 'data-tip-title="Uncertain reading" data-tip-body="Sensors can be blocked, fooled or simply wrong. Treat this as evidence, not fact."',
  conflict: 'data-tip-title="Readings disagree" data-tip-body="Two readings contradict each other. One of them may have been falsified."',
};

export default function render(el) {
  el.innerHTML = /* html */ `
    <div class="s-hbox comp-split">
      <div class="s-vbox comp-list" data-list></div>
      <div class="s-vbox fill comp-detail" data-detail></div>
    </div>`;

  const detail = el.querySelector('[data-detail]');
  const num = (v) => (v == null ? '—' : v);

  selectableList(el.querySelector('[data-list]'), records, {
    render: (r) => /* html */ `
      <span class="s-vbox comp-card">
        <span class="s-text gb-label">${r.registry}</span>
        <span class="s-text gb-h3">${r.name}</span>
        <span class="s-text gb-small">${r.cls}</span>
      </span>`,
    onPreview: (r) => {
      detail.innerHTML = /* html */ `
        <div class="s-text gb-label">${r.registry} · ${r.cls}</div>
        <div class="s-text gb-title">${r.name}</div>
        <div class="s-uniformgrid comp-numbers">
          <div class="s-vbox gb-panel comp-number"><div class="s-text gb-label">Hull certified</div><div class="s-text comp-number-v">${num(r.cert)}</div></div>
          <div class="s-vbox gb-panel comp-number"><div class="s-text gb-label">Filed transit</div><div class="s-text comp-number-v">${num(r.filed)}</div></div>
          <div class="s-vbox gb-panel comp-number"><div class="s-text gb-label">Found at</div><div class="s-text comp-number-v">${num(r.found)}</div></div>
        </div>
        <div class="s-hbox fill comp-scan">
          <div class="gb-placeholder comp-schematic">Schematic: scan results placed on the ship's plan</div>
          <div class="s-vbox fill comp-readings">
            ${r.readings.map(([k, v, flag]) => /* html */ `
              <div class="s-hbox comp-reading ${flag}">
                <div class="s-text gb-label comp-reading-k">${k}</div>
                <div class="s-text gb-body wrap fill">${v}</div>
                <div class="s-text comp-flag" ${FLAG_TIP[flag] ?? ''} data-tip-place="left">${MARK[flag] ?? ''}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="gb-note">? = uncertain reading (Star Trek-style sensors) · ≠ = readings disagree, a possible falsification (scanning.md S3)</div>`;
    },
  });
}
