// Quit confirmation: the standard modal pattern (modal layer, focus defaults to the safe choice).
export default {
  id: 'quit-confirm',
  title: 'Quit confirmation',
  layer: 'modal',
  styles: [],

  mount(root, ctx) {
    root.innerHTML = /* html */ `
      <div class="s-overlay gb" data-widget="WBP_ConfirmDialog">
        <div class="s-border" style="background-color:var(--gb-scrim)"></div>
        <div class="s-box h-center v-center" style="--w:560px">
          <div class="s-border gb-panel" style="padding:32px 36px">
            <div class="s-vbox" style="gap:24px">
              <div class="s-text gb-h2">Quit to desktop?</div>
              <div class="s-text gb-body wrap gb-dim">Progress since your last save will be lost.</div>
              <div class="s-hbox" style="gap:12px; justify-content:flex-end">
                <button class="s-button gb-button" data-action="back" data-focus-default>Cancel</button>
                <button class="s-button gb-button primary" data-action="quit-confirmed">Quit</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    root.querySelectorAll('[data-action]').forEach((b) => { b.onclick = () => ctx.action(b.dataset.action); });
  },
};
