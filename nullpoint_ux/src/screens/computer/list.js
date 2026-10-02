// A selectable list of gb-cards where focusing a card previews it
// (Destiny-style "selection follows focus"), and clicking confirms it.

export function selectableList(listEl, items, { render, onPreview, onConfirm, selectedId }) {
  listEl.innerHTML = items.map((item) => /* html */ `
    <button class="s-button gb-card" data-id="${item.id}" aria-selected="false">${render(item)}</button>`).join('');

  const cards = [...listEl.querySelectorAll('[data-id]')];
  const select = (id) => {
    cards.forEach((c) => c.setAttribute('aria-selected', String(c.dataset.id === id)));
    onPreview?.(items.find((i) => i.id === id));
  };
  cards.forEach((c) => {
    c.addEventListener('focus', () => select(c.dataset.id));
    c.onclick = () => { select(c.dataset.id); onConfirm?.(items.find((i) => i.id === c.dataset.id)); };
  });
  select(selectedId ?? items[0]?.id);

  return {
    refresh(id, html) {
      const card = cards.find((c) => c.dataset.id === id);
      if (card) card.innerHTML = html;
    },
  };
}
