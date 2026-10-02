// Missions: optional offers (flow.md F4). Free exploration stays possible.
import { missions } from '../../../mock/computer.js';
import { selectableList } from '../list.js';

export default function render(el, ctx) {
  el.innerHTML = /* html */ `
    <div class="s-hbox comp-split">
      <div class="s-vbox comp-list" data-list data-nav-right="[data-accept]"></div>
      <div class="s-vbox fill comp-detail" data-detail></div>
    </div>`;

  const detail = el.querySelector('[data-detail]');
  const cardHtml = (m) => /* html */ `
    <span class="s-vbox comp-card">
      <span class="s-hbox"><span class="s-text gb-label fill">${m.type}</span>${ctx.vm.game.get('activeMission') === m.id ? '<span class="s-text gb-label comp-badge">Active</span>' : ''}</span>
      <span class="s-text gb-h3">${m.title}</span>
      <span class="s-text gb-small">${m.where}</span>
    </span>`;

  const list = selectableList(el.querySelector('[data-list]'), missions, {
    render: cardHtml,
    onPreview: (m) => {
      const active = ctx.vm.game.get('activeMission') === m.id;
      detail.innerHTML = /* html */ `
        ${m.image
          ? `<div class="s-image cover comp-hero comp-hero-img" style="--img:url(${m.image}); --focus:${m.focus ?? '50% 50%'}"></div>`
          : '<div class="gb-placeholder comp-hero">Mission image: the system, the ship, the lead</div>'}
        <div class="s-text gb-label">${m.type}</div>
        <div class="s-text gb-title">${m.title}</div>
        <div class="s-text gb-body wrap comp-summary">${m.summary}</div>
        <div class="s-grid comp-facts">
          <div class="s-text gb-label">Issuer</div><div class="s-text gb-body">${m.issuer}</div>
          <div class="s-text gb-label">Where</div><div class="s-text gb-body">${m.where}</div>
          <div class="s-text gb-label">Lead</div><div class="s-text gb-body wrap">${m.lead}</div>
        </div>
        <div class="s-hbox comp-actions">
          <button class="s-button gb-button primary" data-accept ${active ? 'disabled' : ''}>${active ? 'Active mission' : 'Accept'}</button>
          <button class="s-button gb-button" disabled data-tip-kind="unavailable" data-tip-meta="Unavailable" data-tip-title="Show on map" data-tip-body="The Map isn't designed yet: an open question in flow.md.">Show on map</button>
        </div>
        <div class="gb-note">Open: what a mission is. Pillars §5 says the hunt is the gameplay, so a mission gives a <em>lead</em>, not a marker (direction.md).</div>`;
      detail.querySelector('[data-accept]').onclick = () => {
        const prev = ctx.vm.game.get('activeMission');
        ctx.action('accept-mission', m);
        if (prev) list.refresh(prev, cardHtml(missions.find((x) => x.id === prev)));
        list.refresh(m.id, cardHtml(m));
        const btn = detail.querySelector('[data-accept]');
        btn.textContent = 'Active mission';
        btn.disabled = true;
      };
    },
  });
}
