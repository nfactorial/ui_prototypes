// The in-world HUD. Direction (user, 2026-09-29): as little UI as possible while
// playing, but not nothing, and nothing is final. So the amount is a VARIANT:
//   hud=quiet       only what the moment needs: the interaction prompt, and the
//                   spell/tool hint for a moment when you change them
//   hud=contextual  quiet + the time/weather card when the day turns (and on arrival)
//   hud=present     a small always-on corner: current tool + spell, time and weather
// Zone banners, toasts and the quick selectors are their own screens and show in every mode.
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { ITEMS, SPELLS } from '../../mock/witch.js';
import { dayPhase } from '../../core/format.js';

const FADE_IN = defineAnimation('HudFadeIn', {
  opacity: [[0, 0, 'quadOut'], [0.25, 1]],
  translate: [[0, [0, 8], 'cubicOut'], [0.3, [0, 0]]],
});
const FADE_OUT = defineAnimation('HudFadeOut', { opacity: [[0, 1, 'quadIn'], [0.4, 0]] });
const HINT = defineAnimation('HudHint', {       // in, hold, out
  opacity: [[0, 0, 'quadOut'], [0.2, 1, 'linear'], [1.8, 1, 'quadIn'], [2.4, 0]],
});
const CARD = defineAnimation('HudDayCard', {
  opacity: [[0, 0, 'quadOut'], [0.6, 1, 'linear'], [4, 1, 'quadIn'], [5, 0]],
});
const TIP_IN = defineAnimation('TipIn', {
  opacity: [[0, 0, 'quadOut'], [0.5, 1]],
  translate: [[0, [0, 16], 'cubicOut'], [0.6, [0, 0]]],
});

const icon = (name, cls = '') => `<div class="s-image tint ${cls}" style="--img:url(/assets/icons/${name}.svg)"></div>`;
const spellById = (id) => SPELLS.find((s) => s.id === id);

export default {
  id: 'world-hud',
  title: 'World HUD',
  layer: 'game',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const { world, witch, game } = ctx.vm;
    const mode = ctx.variant('hud') ?? 'quiet';
    root.innerHTML = /* html */ `
      <div class="s-overlay gb wh hit-invisible" data-widget="WBP_WorldHud" data-mode="${mode}">

        <!-- Interaction prompt: ICozyInteractable::GetInteractionPrompt -->
        <div class="s-hbox wh-prompt h-center v-bottom" data-widget="WBP_InteractPrompt"></div>

        <!-- Brief hint when the spell or tool changes -->
        <div class="s-vbox wh-hint h-center v-bottom" data-widget="WBP_ChangeHint"></div>

        <!-- Time / weather card (contextual, present) -->
        <div class="s-vbox wh-day h-right v-top ts-world" data-widget="WBP_DayCard">
          <div class="s-text wh-day-phase" data-bind="world.timeOfDay | dayPhase"></div>
          <div class="s-text gb-small wh-day-meta"><span data-bind="world.timeOfDay | clock"></span> · <span data-bind="world.weatherMood"></span> · <span data-bind="world.temperature | celsius"></span></div>
        </div>

        <!-- Always-on corner (present) -->
        <div class="s-hbox wh-corner h-left v-bottom" data-widget="WBP_HudCorner">
          <div class="s-vbox wh-corner-slot"><div class="s-border wh-chip" data-tool></div><div class="s-text gb-label">Tool ${glyph('toolWheel', 'sm')}</div></div>
          <div class="s-vbox wh-corner-slot"><div class="s-border wh-chip" data-spell></div><div class="s-text gb-label">Spell ${glyph('spellPrev', 'sm')}${glyph('spellNext', 'sm')}</div></div>
        </div>

        <!-- Onboarding tip until the satchel has been opened once -->
        <div class="s-box h-center v-top wh-tip-pos" style="--w:520px" data-bind-visible="!game.satchelSeen">
          <div class="s-border gb-panel wh-tip">
            <div class="s-hbox wh-tip-row">
              ${glyph('satchel')}
              <div class="s-vbox fill">
                <div class="s-text gb-h3">Your satchel</div>
                <div class="s-text gb-small wrap">Everything you gather goes in here. Your spells are in the book beside it.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="s-vbox wh-demo h-left v-top">
          <div class="gb-note on-world">Demo keys: I satchel · K spells · T tools · Tab spell wheel · 1–5 spell buttons · Q/E cycle spell · G interact · F fish · P photo · N study · Z next zone · 6–0 toasts · Esc pause</div>
        </div>
      </div>`;
    ctx.bind();
    const offs = []; // vm.on subscriptions, released on unmount

    // --- interaction prompt ---------------------------------------------------
    const promptEl = root.querySelector('.wh-prompt');
    let fading = null;
    offs.push(world.on('prompt', (p) => {
      fading?.stop();
      if (!p) {
        if (promptEl.childElementCount) fading = ctx.play(promptEl, FADE_OUT);
        return;
      }
      promptEl.innerHTML = /* html */ `
        ${glyph('interact')}
        <span class="s-text wh-verb ts-world">${p.verb}</span>
        <span class="s-text wh-target ts-world">${p.target}</span>`;
      fading = ctx.play(promptEl, FADE_IN);
    }));

    // --- tool / spell --------------------------------------------------------
    const toolChip = root.querySelector('[data-tool]');
    const spellChip = root.querySelector('[data-spell]');
    const hint = root.querySelector('.wh-hint');
    const currentSpell = () => spellById(witch.get('loadout')[world.get('activeSpell')]);
    const currentTool = () => ITEMS[world.get('tool')];

    const renderChips = () => {
      const t = currentTool();
      toolChip.innerHTML = t ? `${icon(t.icon)}<span class="s-text gb-small">${t.name}</span>` : '<span class="s-text gb-small">Hands free</span>';
      const s = currentSpell();
      spellChip.innerHTML = s
        ? `<span data-aff="${s.affinity}" class="wh-aff">${icon(s.icon)}</span><span class="s-text gb-small">${s.name}</span>`
        : '<span class="s-text gb-small">—</span>';
    };
    const showHint = (html) => {
      if (mode === 'present') return;       // the corner already shows it
      hint.innerHTML = html;
      ctx.play(hint, HINT);
    };
    offs.push(world.on('tool', () => {
      renderChips();
      const t = currentTool();
      showHint(`<div class="s-hbox wh-hint-row ts-world">${t ? icon(t.icon) : ''}<span class="s-text gb-h3">${t ? t.name : 'Hands free'}</span></div>`);
    }, { immediate: false }));
    // Spell change: the loadout as a strip, the active one lit, so the player
    // learns the order without opening anything.
    offs.push(world.on('activeSpell', () => {
      renderChips();
      const loadout = witch.get('loadout').filter(Boolean);
      const active = currentSpell();
      showHint(/* html */ `
        <div class="s-hbox wh-strip">
          ${loadout.map((id) => { const s = spellById(id); return `<div class="wh-pip ${s === active ? 'on' : ''}" data-aff="${s.affinity}">${icon(s.icon)}</div>`; }).join('')}
        </div>
        <div class="s-text gb-h3 ts-world just-center">${active?.name ?? ''}</div>`);
    }, { immediate: false }));
    renderChips();

    // --- day card (contextual) -----------------------------------------------
    if (mode === 'contextual') {
      const day = root.querySelector('.wh-day');
      let phase = dayPhase(world.get('timeOfDay'));
      ctx.play(day, CARD, { delay: 1 });
      offs.push(world.on('timeOfDay', (t) => {
        const p = dayPhase(t);
        if (p !== phase) { phase = p; ctx.play(day, CARD); }
      }));
    }

    if (!game.get('satchelSeen')) ctx.play(root.querySelector('.wh-tip'), TIP_IN, { delay: 2 });
    return () => offs.forEach((off) => off());
  },
};
