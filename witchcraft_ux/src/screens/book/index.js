// The witch's book: the in-game menu. Two levels, never more (user, 2026-09-29):
//   tabs across the top      Satchel · Recipes · Almanac · Keepsakes   (5 max: D10)
//   categories down a rail   Recipes: Cooking · Potions · Spells
//                            Almanac: Fish · Flowers · Creatures
//                            Keepsakes: Small tasks · Milestones · Photos
// I opens the Satchel, K opens Recipes > Spells (the loadout stays one press away).
// The satchel follows inventory_ui_prd v0.1: a portrait beside the bag, a calm
// icon grid, count badges above 1, name + description on focus.
//
//   params.tab           'satchel' | 'recipes[:cooking|potions|spells|charms]' | 'almanac[:fish|flowers|creatures]'
//                        | 'keepsakes[:tasks|milestones|photos]'
//   variant 'book'       panel  (a window over the softened world)
//                        spread (a full-screen open book, two pages)
import { defineAnimation } from '../../core/motion.js';
import { glyph } from '../../input.js';
import { ITEMS, SPELLS, RECIPES, TASK_POOL, KIT, whereLabel, studyKnown, studyTotal, studyDone } from '../../mock/witch.js';
import { photoMarkup, FILTERS, FRAMES, BODIES, LENSES, bodyName } from '../../photo.js';

const IN = defineAnimation('BookIn', {
  opacity: [[0, 0, 'quadOut'], [0.25, 1]],
  translate: [[0, [0, 24], 'cubicOut'], [0.35, [0, 0]]],
});
const BACK_IN = defineAnimation('BookBackIn', { opacity: [[0, 0, 'linear'], [0.25, 1]] });
const OUT = defineAnimation('BookOut', { opacity: [[0, 1, 'quadIn'], [0.18, 0]] });
const PAGE = defineAnimation('BookPage', { opacity: [[0, 0, 'quadOut'], [0.2, 1]] });

const TABS = [
  { id: 'satchel', label: 'Satchel' },
  { id: 'recipes', label: 'Recipes', rail: [
    { id: 'cooking', label: 'Cooking', icon: 'flame' },
    { id: 'potions', label: 'Potions', icon: 'bottle' },
    { id: 'spells', label: 'Spells', icon: 'sparkle' },
    { id: 'charms', label: 'Charms', icon: 'moon' },
  ] },
  { id: 'almanac', label: 'Almanac', rail: [
    { id: 'fish', label: 'Fish', icon: 'fish' },
    { id: 'flowers', label: 'Flowers', icon: 'flower' },
    { id: 'creatures', label: 'Creatures', icon: 'feather' },
  ] },
  { id: 'keepsakes', label: 'Keepsakes', rail: [
    { id: 'tasks', label: 'Small tasks', icon: 'leaf' },
    { id: 'milestones', label: 'Milestones', icon: 'sparkle' },
    { id: 'photos', label: 'Photos', icon: 'book' },
    { id: 'kit', label: 'Camera kit', icon: 'circle' },
  ] },
];
const COST = { free: 'Free to cast', reagent: 'Needs a reagent', ritual: 'A ritual' };
const icon = (name, cls = '') => `<div class="s-image tint ${cls}" style="--img:url(/assets/icons/${name}.svg)"></div>`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const spell = (id) => SPELLS.find((s) => s.id === id);

export default {
  id: 'book',
  title: "The witch's book",
  layer: 'gamemenu',
  styles: [new URL('./style.css', import.meta.url).href],

  mount(root, ctx) {
    const { witch, world } = ctx.vm;
    const look = ctx.variant('book') ?? 'panel';
    const [startTab, startSub] = (ctx.params.tab ?? 'satchel').split(':');
    let tab = startTab;
    const railSel = { recipes: 'cooking', almanac: 'fish', keepsakes: 'tasks' };   // remembered per tab
    if (startSub) railSel[startTab] = startSub;

    root.innerHTML = /* html */ `
      <div class="s-overlay gb bk" data-widget="WBP_WitchBook" data-look="${look}">
        <div class="s-border bk-backing"></div> <!-- SLATE: SBackgroundBlur (panel) / book texture (spread) -->
        <div class="s-vbox bk-frame h-center v-center">
          <div class="s-hbox bk-head">
            <div class="s-hbox bk-tabs fill">
              <span class="bk-q">${glyph('tabPrev', 'sm')}</span>
              ${TABS.map((t) => `<button class="s-button gb-tab" data-tab="${t.id}">${t.label}</button>`).join('')}
              <span class="bk-q">${glyph('tabNext', 'sm')}</span>
            </div>
            <button class="s-button gb-button bk-close" data-close>Close ${glyph('back', 'sm')}</button>
          </div>
          <div class="s-hbox fill bk-pages" data-pages></div>
        </div>
      </div>`;

    const pages = root.querySelector('[data-pages]');
    let target = pages;   // where a page renders: the whole page area, or the body beside the rail
    const render = {
      satchel: renderSatchel,
      cooking: () => renderRecipes('cooking'),
      potions: () => renderRecipes('potions'),
      spells: () => renderSpells(),
      charms: renderCharms,
      fish: () => renderCollection('fish'),
      flowers: () => renderCollection('flowers'),
      creatures: renderCreatures,
      tasks: renderTasks,
      milestones: renderMilestones,
      photos: renderPhotos,
      kit: renderKit,
    };
    const tabDef = (id) => TABS.find((t) => t.id === id);

    function show(id) {
      tab = id;
      root.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
      const def = tabDef(id);
      if (!def.rail) {
        target = pages;
        render[id]();
      } else {
        // The rail: categories down the left, the same on every tab that has one.
        pages.innerHTML = /* html */ `
          <div class="s-vbox bk-page bk-rail" data-widget="WBP_BookRail">
            <span class="bk-rail-glyph">${glyph('railPrev', 'sm')}</span>
            ${def.rail.map((r) => /* html */ `
              <button class="s-button gb-card bk-rail-item" data-rail="${r.id}" aria-selected="${r.id === railSel[id]}">
                <span class="s-hbox bk-rail-row">${icon(r.icon)}<span class="s-text gb-h3">${r.label}</span></span>
              </button>`).join('')}
            <span class="bk-rail-glyph">${glyph('railNext', 'sm')}</span>
          </div>
          <div class="s-hbox fill bk-body" data-body></div>`;
        target = pages.querySelector('[data-body]');
        pages.querySelectorAll('[data-rail]').forEach((b) => { b.onclick = () => showRail(b.dataset.rail); });
        render[railSel[id]]();
      }
      ctx.play(pages, PAGE);
      const first = target.querySelector('[data-focus-default]') ?? target.querySelector('button');
      first?.focus({ preventScroll: true });
    }

    function showRail(sub) {
      railSel[tab] = sub;
      pages.querySelectorAll('[data-rail]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.rail === sub)));
      render[sub]();
      ctx.play(target, PAGE);
    }

    // --- Satchel -----------------------------------------------------------------
    function renderSatchel() {
      const slots = witch.get('satchel');
      target.innerHTML = /* html */ `
        <div class="s-vbox bk-page bk-left">
          <div class="s-overlay bk-portrait" data-widget="SWitchPortrait">
            <div class="s-image cover" style="--img:url(/assets/backdrops/path_day.jpg); --focus: 48% 62%; background-size: 420%"></div>
          </div>
          <div class="s-text gb-h2 bk-name">${esc(witch.get('name'))}</div>
          <div class="s-text gb-small">In her hands: <span class="bk-strong">${esc(ITEMS[world.get('tool')]?.name ?? 'nothing')}</span></div>
          <div class="gb-note bk-note">Portrait: a crop of an in-engine shot. The game renders it live (GetCharacterPortrait). Her name is a placeholder.</div>
        </div>
        <div class="s-vbox fill bk-page bk-right">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Satchel</div><div class="s-text gb-small">${slots.filter(Boolean).length} / ${slots.length}</div></div>
          <div class="s-grid bk-grid" data-widget="WBP_InventoryGrid">
            ${slots.map((s, i) => {
              if (!s) return `<div class="wc-slot empty" data-widget="WBP_InventorySlot"></div>`;
              const it = ITEMS[s.item];
              return /* html */ `
                <button class="s-button wc-slot" data-slot="${i}" data-aff="${it.affinity}" ${i === 0 ? 'data-focus-default' : ''} aria-selected="${world.get('tool') === s.item}" data-widget="WBP_InventorySlot">
                  <span class="wc-aff"></span>${icon(it.icon)}<span class="wc-count">${s.count > 1 ? s.count : ''}</span>
                </button>`;
            }).join('')}
          </div>
          <div class="s-border bk-detail" data-detail></div>
        </div>`;
      const detail = target.querySelector('[data-detail]');
      const showItem = (s) => {
        const it = ITEMS[s.item];
        detail.innerHTML = /* html */ `
          <div class="s-hbox bk-detail-row">
            <div class="bk-detail-icon" data-aff="${it.affinity}">${icon(it.icon)}</div>
            <div class="s-vbox fill">
              <div class="s-text gb-h3">${esc(it.name)}${s.count > 1 ? ` <span class="gb-dim">×${s.count}</span>` : ''}</div>
              <div class="s-text gb-small wrap">${esc(it.desc)}</div>
              <div class="s-text gb-label bk-aff-label" data-aff="${it.affinity}">${it.tool ? (world.get('tool') === s.item ? 'Tool · in hand · ' : 'Tool · click to hold · ') : ''}${it.affinity} affinity</div>
            </div>
          </div>`;
      };
      target.querySelectorAll('[data-slot]').forEach((b) => {
        b.addEventListener('focus', () => showItem(slots[b.dataset.slot]));
        b.onclick = () => {
          const it = ITEMS[slots[b.dataset.slot].item];
          if (!it.tool) return;
          ctx.action('select-tool', { id: slots[b.dataset.slot].item, from: 'book' });
          const i = b.dataset.slot;
          renderSatchel();
          target.querySelector(`[data-slot="${i}"]`)?.focus();
        };
      });
      showItem(slots[0]);
    }

    // --- Spells (user, 2026-09-29) ------------------------------------------------------
    // One list. Click a spell → the strip asks "Assign to…" → press a spell button
    // (1–5) and it goes in that slot, replacing what was there. If the spell was
    // already in another slot, the two swap. Esc cancels. Outside of assigning, the
    // strip is read-only: information, not a control.
    let assigning = null;   // spell id waiting for a slot
    function renderSpells(focusId) {
      const loadout = witch.get('loadout');
      const known = witch.get('knownSpells').map(spell);
      const a = assigning && spell(assigning);
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide bk-spells">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Spellbook</div><div class="s-text gb-small">Choose a spell, then press the button to put it on</div></div>
          <div class="s-scroll fill"><div class="s-grid bk-known">
            ${known.map((s, i) => /* html */ `
              <button class="s-button gb-card bk-spell ${s.id === assigning ? 'assigning' : ''}" data-spell="${s.id}" aria-selected="${loadout.includes(s.id)}" ${i === 0 ? 'data-focus-default' : ''}>
                <span class="s-hbox bk-spell-row">
                  <span class="bk-spell-icon big" data-aff="${s.affinity}">${icon(s.icon)}</span>
                  <span class="s-vbox fill">
                    <span class="s-text gb-h3">${esc(s.name)}</span>
                    <span class="s-text gb-label bk-cost" data-cost="${s.cost}">${COST[s.cost]}${s.reagent ? `: ${esc(s.reagent)}` : ''}</span>
                    <span class="s-text gb-small wrap">${esc(s.desc)}</span>
                  </span>
                </span>
              </button>`).join('')}
          </div></div>
          <div class="s-hbox bk-ready-strip ${a ? 'assigning' : ''}" data-widget="WBP_ReadySpells">
            <span class="s-vbox bk-strip-head">
              <span class="s-text gb-label bk-strip-label">${a ? `Assign ${esc(a.name)} to…` : 'Ready to cast'}</span>
              ${a ? `<span class="s-hbox bk-cancel">${glyph('back', 'sm')}<span class="s-text gb-small">Cancel</span></span>` : ''}
            </span>
            <span class="s-hbox bk-ready-pips">
              ${loadout.map((id, n) => {
                const s = spell(id);
                const tag = a ? 'button' : 'span';   // slots are clickable only while assigning
                return /* html */ `
                  <${tag} class="${a ? 's-button ' : ''}s-hbox bk-ready-pip ${s ? '' : 'empty'}" ${s ? `data-aff="${s.affinity}"` : ''} data-slot-n="${n}">
                    ${glyph(`spell${n + 1}`, 'sm')}
                    ${s ? `${icon(s.icon)}<span class="s-text gb-small">${esc(s.name)}</span>` : '<span class="s-text gb-small">Empty</span>'}
                  </${tag}>`;
              }).join('')}
            </span>
          </div>
        </div>`;
      target.querySelectorAll('[data-spell]').forEach((b) => {
        b.onclick = () => { assigning = b.dataset.spell; renderSpells(assigning); };
      });
      if (a) target.querySelectorAll('button[data-slot-n]').forEach((b) => { b.onclick = () => assignTo(Number(b.dataset.slotN)); });
      if (focusId) target.querySelector(`[data-spell="${focusId}"]`)?.focus({ preventScroll: true });
    }
    function assignTo(slot) {
      const id = assigning;
      const next = [...witch.get('loadout')];
      if (slot >= next.length) return;
      const from = next.indexOf(id);
      if (from >= 0) next[from] = next[slot];   // already on another button: swap
      next[slot] = id;
      witch.set('loadout', next);
      assigning = null;
      renderSpells(id);
    }

    // --- Collections: Fish, Flowers (user, 2026-09-29: intended) ---------------------
    // Her knowledge, not her bag. Each entry: name · RARITY · where (Various / a region /
    // a specific place). Unfound ones read "Unknown fish": Study can name them as reagents.
    const COLLECTIONS = {
      fish:    { label: 'Fish',    unknown: 'Unknown fish',   icon: 'fish',   verb: 'caught' },
      flowers: { label: 'Flowers', unknown: 'Unknown flower', icon: 'flower', verb: 'picked' },
    };
    function renderCollection(kind) {
      const c = COLLECTIONS[kind];
      const list = witch.get(kind);
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">${c.label}</div><div class="s-text gb-small">${list.filter((f) => f.count).length} of ${list.length} known</div></div>
          <div class="s-grid bk-fish">
            ${list.map((f, i) => /* html */ `
              <button class="s-button gb-card bk-fishcard ${f.count ? '' : 'unknown'}" ${i === 0 ? 'data-focus-default' : ''} data-rarity="${f.rarity.toLowerCase()}">
                <span class="s-hbox bk-fish-row">
                  <span class="bk-fish-icon">${icon(c.icon)}</span>
                  <span class="s-vbox fill">
                    <span class="s-text gb-h3">${f.count ? esc(f.name) : c.unknown}</span>
                    ${f.count ? /* html */ `
                      <span class="s-hbox bk-fish-meta"><span class="s-text gb-label bk-rarity">${f.rarity}</span><span class="s-text gb-small bk-where">${esc(whereLabel(f))}</span></span>
                      <span class="s-text gb-small bk-count">${c.verb} ${f.count}</span>` : ''}
                  </span>
                </span>
              </button>`).join('')}
          </div>
          <div class="gb-note bk-note">Where = the proposed location range: "Various" (widespread), a region, or one specific place. The ${c.verb} count is kept for now (achievements?).</div>
        </div>`;
    }

    // --- Ingredients / reagents: shared by Recipes and Creatures ----------------------
    // known:   she knows what it is (items always; fish/flowers once in the Almanac)
    // carried: it's in her satchel right now (matched by name)
    const inSatchel = (name) => witch.get('satchel').some((s) => s && ITEMS[s.item]?.name === name);
    function ingredient(r) {
      if (r.kind === 'item') {
        const it = ITEMS[r.tag];
        return { name: it?.name ?? r.tag, icon: it?.icon ?? 'circle', known: true, carried: inSatchel(it?.name) };
      }
      const c = COLLECTIONS[r.kind === 'fish' ? 'fish' : 'flowers'];
      const e = witch.get(r.kind === 'fish' ? 'fish' : 'flowers').find((x) => x.tag === r.tag);
      const found = !!(e && e.count > 0);
      return { name: found ? e.name : c.unknown, icon: c.icon, known: found, carried: found && inSatchel(e.name) };
    }
    const chip = (g) => `<span class="s-hbox bk-reagent ${g.known ? (g.carried ? 'carried' : '') : 'unknown'}">${icon(g.icon)}<span class="s-text gb-body">${esc(g.name)}</span></span>`;

    // --- Recipes: Cooking, Potions (speculative) --------------------------------------
    function renderRecipes(kind) {
      const list = RECIPES[kind];
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">${kind === 'cooking' ? 'Cooking' : 'Potions'}</div><div class="s-text gb-small">${list.filter((r) => r.learnt).length} learnt</div></div>
          <div class="s-vbox bk-creatures">
            ${list.map((r, i) => {
              if (!r.learnt) return /* html */ `
                <button class="s-button gb-card bk-creature unlearnt">
                  <span class="s-hbox bk-creature-row">
                    <span class="bk-recipe-icon unknown"><span class="s-text">?</span></span>
                    <span class="s-vbox bk-creature-name"><span class="s-text gb-h3">${esc(r.name)}</span><span class="s-text gb-small">${r.station}</span></span>
                    <span class="s-wrapbox fill bk-reagents"><span class="s-hbox bk-reagent unlearned"><span class="s-text gb-body">She hasn't worked this one out yet</span></span></span>
                  </span>
                </button>`;
              const gs = r.ingredients.map(ingredient);
              const ready = gs.every((g) => g.carried);
              return /* html */ `
                <button class="s-button gb-card bk-creature" ${i === 0 ? 'data-focus-default' : ''}>
                  <span class="s-hbox bk-creature-row">
                    <span class="bk-recipe-icon" data-widget="SImage (recipe icon)" title="Placeholder: the dish / potion's icon">${r.icon ? `<span class="s-image" style="--img:url(${r.icon})"></span>` : icon('image')}</span>
                    <span class="s-vbox bk-creature-name">
                      <span class="s-text gb-h3">${esc(r.name)}</span>
                      <span class="s-text gb-small">${r.station}${ready ? ' · <span class="bk-ready">can make now</span>' : ''}</span>
                      <span class="s-text gb-small wrap bk-recipe-desc">${esc(r.desc)}</span>
                    </span>
                    <span class="s-wrapbox fill bk-reagents">${gs.map(chip).join('')}</span>
                  </span>
                </button>`;
            }).join('')}
          </div>
          <div class="gb-note bk-note">Speculative: no cooking or brewing design yet (the campfire as a station and the cauldron are ideas in the game docs). Icons are placeholders (a recipe's "icon" field takes a real one). Solid chip = in the satchel · faint = known, not carried · dashed = not yet found.</div>
        </div>`;
    }

    // --- Creatures: Study → familiars (speculative, the user's idea) -----------------
    // One pip per charm ingredient (user, 2026-10-01): filled = learned by study.
    const studyPips = (cr) => `<span class="s-hbox bk-study" title="How well she knows it">${Array.from({ length: studyTotal(cr) }, (_, n) => `<span class="bk-study-pip ${n < studyKnown(cr) ? 'on' : ''}"></span>`).join('')}</span>`;

    // Almanac > Creatures: what she knows about the animal (study, where it lives).
    function renderCreatures() {
      const creatures = witch.get('creatures');
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Creatures</div><div class="s-text gb-small">${creatures.filter(studyKnown).length} studied</div></div>
          <div class="s-grid bk-fish">
            ${creatures.map((cr, i) => /* html */ `
              <button class="s-button gb-card bk-fishcard" ${i === 0 ? 'data-focus-default' : ''} data-rarity="${cr.rarity.toLowerCase()}">
                <span class="s-hbox bk-fish-row">
                  <span class="bk-fish-icon">${icon(cr.icon)}</span>
                  <span class="s-vbox fill">
                    <span class="s-text gb-h3">${esc(cr.name)}</span>
                    <span class="s-hbox bk-fish-meta"><span class="s-text gb-label bk-rarity">${cr.rarity}</span><span class="s-text gb-small bk-where">${esc(whereLabel(cr))}</span></span>
                    <span class="s-hbox bk-study-row">${studyPips(cr)}<span class="s-text gb-small bk-count">${studyDone(cr) ? 'Charm known' : studyKnown(cr) ? 'Still studying' : 'Not studied yet'}</span></span>
                  </span>
                </span>
              </button>`).join('')}
          </div>
          <div class="gb-note bk-note">Speculative (user's idea, 2026-09-29): Study an animal to learn how to charm it as a familiar. What she knows lives here; what charming it takes is under Recipes › Charms.</div>
        </div>`;
    }

    // Recipes > Charms: what it takes to charm each studied creature as a familiar.
    // Reagents appear as study reveals them; unfound ones read "Unknown fish".
    function renderCharms() {
      const creatures = witch.get('creatures');
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Charms</div><div class="s-text gb-small">${creatures.filter(studyDone).length} complete</div></div>
          <div class="s-vbox bk-creatures">
            ${creatures.map((cr, i) => {
              const done = studyDone(cr);
              const gs = cr.reagents.map(ingredient);
              const ready = done && gs.every((g) => g.carried);
              return /* html */ `
                <button class="s-button gb-card bk-creature" ${i === 0 ? 'data-focus-default' : ''}>
                  <span class="s-hbox bk-creature-row">
                    <span class="s-vbox bk-creature-name">
                      <span class="s-text gb-h3">${esc(cr.name)}</span>
                      ${studyPips(cr)}
                      <span class="s-text gb-small">${done ? (ready ? '<span class="bk-ready">can charm now</span>' : 'All reagents known') : 'Keep watching it'}</span>
                    </span>
                    <span class="s-wrapbox fill bk-reagents">
                      ${gs.map(chip).join('')}
                      ${'<span class="s-hbox bk-reagent unlearned" title="Still to learn"><span class="s-text gb-body">?</span></span>'.repeat(studyTotal(cr) - studyKnown(cr))}
                    </span>
                  </span>
                </button>`;
            }).join('')}
          </div>
          <div class="gb-note bk-note">Speculative. A reagent she hasn't found reads "Unknown fish" / "Unknown flower", a reason to fish and pick. Try F in the world: the first catch is a Mackerel, and the hare's charm updates.</div>
        </div>`;
    }

    // --- Keepsakes (user, 2026-09-29) -----------------------------------------------------
    // 🔴 Optional. Nothing here expires, and missing a day never costs something
    // exclusive (D9). Rewards wait in the book until she claims them: a small ritual,
    // never a pop-up she has to deal with.
    // Claiming a reward that's a camera piece adds it to her kit.
    const claimToast = (title, body) => {
      const piece = KIT.find((k) => k.reward === title);
      if (piece && !witch.get('kit').includes(`${piece.kind}:${piece.id}`)) {
        witch.set('kit', [...witch.get('kit'), `${piece.kind}:${piece.id}`]);
        body = `${body} · added to your camera kit`;
      }
      ctx.toast({ kind: 'collected', label: 'Keepsake', title, body });
    };

    function renderTasks(focusId) {
      const tasks = witch.get('tasks');
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Small tasks</div><div class="s-text gb-small">Whenever you like: nothing here expires</div></div>
          <div class="s-vbox bk-creatures">
            ${tasks.map((t, i) => {
              const done = t.progress >= t.goal;
              return /* html */ `
                <div class="s-hbox gb-card bk-task ${done ? 'done' : ''}">
                  <span class="s-vbox fill bk-task-text">
                    <span class="s-text gb-h3">${esc(t.text)}</span>
                    <span class="s-hbox bk-task-progress"><span class="s-progress bk-bar" style="--pct:${Math.min(1, t.progress / t.goal)}"></span><span class="s-text gb-small">${Math.min(t.progress, t.goal)} / ${t.goal}</span></span>
                  </span>
                  <span class="s-vbox bk-task-reward"><span class="s-text gb-label">Reward</span><span class="s-text gb-small">${esc(t.reward)}</span></span>
                  ${done ? `<button class="s-button gb-button primary bk-claim" data-claim="${t.id}" ${focusId === t.id || (!focusId && i === tasks.findIndex((x) => x.progress >= x.goal)) ? 'data-focus-default' : ''}>Claim ${glyph('claim', 'sm')}</button>`
                         : '<span class="bk-claim-space"></span>'}
                </div>`;
            }).join('')}
          </div>
          <div class="gb-note bk-note">Proposed, Animal Crossing-style: a handful of small tasks; claim one and a new one takes its place. Rewards are cosmetic (frames, filters, keepsake items): the game has no currency.</div>
        </div>`;
      target.querySelectorAll('[data-claim]').forEach((b) => {
        b.onclick = () => {
          const list = witch.get('tasks');
          const t = list.find((x) => x.id === b.dataset.claim);
          const pool = TASK_POOL[(renderTasks.n = (renderTasks.n ?? -1) + 1) % TASK_POOL.length];
          const fresh = { id: `t${Date.now()}`, progress: 0, ...pool };
          witch.set('tasks', list.map((x) => (x === t ? fresh : x)));
          claimToast(t.reward, `For: ${t.text}`);
          renderTasks(fresh.id);
        };
      });
      if (focusId) target.querySelector('[data-claim]')?.focus({ preventScroll: true });
    }

    // Progress comes from what she already has: nothing extra to track.
    function milestoneProgress(source) {
      const sum = (k) => witch.get(k).reduce((n, x) => n + (x.count ?? 0), 0);
      switch (source) {
        case 'fishCaught': return sum('fish');
        case 'flowersPicked': return sum('flowers');
        case 'almanacKnown': return ['fish', 'flowers'].reduce((n, k) => n + witch.get(k).filter((x) => x.count).length, 0) + witch.get('creatures').length;
        case 'photosTaken': return witch.get('photos').length;
        case 'charmed': return 0;
        default: return 0;
      }
    }
    // Two layouts (variant 'milestones'):
    //   cards  (default, user 2026-09-29) square cards, AC-style: a stamp, earned tiers +
    //          ONE outline for the next, progress to the next only. Nothing beyond it shows.
    //   rows   every threshold laid out (1 · 10 · 50 · 100)
    function renderMilestones(focusId) {
      const ms = witch.get('milestones');
      // variant 'msgoal': count (default: "Fish caught", bar + "6 / 10") or sentence ("Catch 10 fish", bar only).
      const sentence = ctx.variant('msgoal') === 'sentence';
      // ⚠️ Prototype-only English hack ("a familiar", dropping the s). In the game each goal is ONE
      // localised FText with a plural modifier, e.g. "Catch {Count} fish" / {Count}|plural(one=…,other=…).
      const goalText = (m, n) => (n === 1 ? m.goal.replace('{n} ', 'a ').replace(/familiars$/, 'familiar').replace(/photos$/, 'photo') : m.goal.replace('{n}', n));
      if ((ctx.variant('milestones') ?? 'cards') === 'cards') {
        target.innerHTML = /* html */ `
          <div class="s-vbox fill bk-page bk-wide">
            <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Milestones</div><div class="s-text gb-small">For as long as you play</div></div>
            <div class="s-scroll fill"><div class="s-grid bk-mcards">
              ${ms.map((m) => {
                const have = milestoneProgress(m.source);
                const reached = m.tiers.filter((t) => have >= t).length;
                const next = m.tiers[reached];
                const claimable = reached > m.claimed;
                const pips = m.tiers.slice(0, reached).map((t, i) => `<span class="bk-mpip ${i < m.claimed ? 'claimed' : 'ready'}"></span>`).join('')
                  + (next ? '<span class="bk-mpip next"></span>' : '');
                return /* html */ `
                  <div class="s-vbox gb-card bk-mcard ${claimable ? 'done' : ''}" data-widget="WBP_MilestoneCard">
                    <span class="bk-mcard-stamp ${m.claimed ? 'earned' : ''}">${icon(m.icon)}</span>
                    <span class="s-text gb-h3">${esc(m.name)}</span>
                    <span class="s-text gb-small ${sentence && next ? 'bk-mgoal' : ''}">${sentence && next ? esc(goalText(m, next)) : esc(m.desc)}</span>
                    <span class="s-hbox bk-mpips" title="Stamps earned, and the next">${pips}</span>
                    ${next
                      ? `<span class="s-hbox bk-mprogress"><span class="s-progress bk-bar" style="--pct:${Math.min(1, have / next)}"></span>${sentence ? '' : `<span class="s-text gb-small">${have} / ${next}</span>`}</span>`
                      : '<span class="s-text gb-small bk-mdone">All done</span>'}
                    ${claimable ? `<button class="s-button gb-button primary bk-claim" data-ms="${m.id}" ${focusId === m.id ? 'data-focus-default' : ''}>Claim ${glyph('claim', 'sm')}</button>` : ''}
                  </div>`;
              }).join('')}
            </div></div>
            <div class="gb-note bk-note">Cards (user, 2026-09-29): earned stamps + one outline for the next; progress to the next only, nothing beyond. Variant: Milestones (cards / rows). Take a photo (P) and watch Photographer.</div>
          </div>`;
        wireMilestoneClaims(focusId);
        return;
      }
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Milestones</div><div class="s-text gb-small">For as long as you play</div></div>
          <div class="s-vbox bk-creatures">
            ${ms.map((m) => {
              const have = milestoneProgress(m.source);
              const reached = m.tiers.filter((t) => have >= t).length;
              const next = m.tiers[reached];
              const claimable = reached > m.claimed;
              return /* html */ `
                <div class="s-hbox gb-card bk-milestone ${claimable ? 'done' : ''}">
                  <span class="s-vbox bk-ms-name">
                    <span class="s-text gb-h3">${esc(m.name)}</span>
                    <span class="s-text gb-small">${esc(m.desc)}: ${have}${next ? ` · next at ${next}` : ' · all done'}</span>
                  </span>
                  <span class="s-hbox fill bk-stamps">
                    ${m.tiers.map((t, i) => `<span class="bk-stamp ${i < m.claimed ? 'claimed' : i < reached ? 'ready' : ''}" title="${esc(m.rewards[i])}"><span class="s-text">${t}</span></span>`).join('')}
                  </span>
                  ${claimable ? `<button class="s-button gb-button primary bk-claim" data-ms="${m.id}" ${focusId === m.id ? 'data-focus-default' : ''}>Claim ${glyph('claim', 'sm')}</button>` : '<span class="bk-claim-space"></span>'}
                </div>`;
            }).join('')}
          </div>
          <div class="gb-note bk-note">Rows: every threshold laid out. Variant: Milestones (cards / rows). Hover a stamp for its reward.</div>
        </div>`;
      wireMilestoneClaims(focusId);
    }
    function wireMilestoneClaims(focusId) {
      target.querySelectorAll('[data-ms]').forEach((b) => {
        b.onclick = () => {
          const m = witch.get('milestones').find((x) => x.id === b.dataset.ms);
          claimToast(m.rewards[m.claimed], `${m.name}: ${m.tiers[m.claimed]}`);
          witch.set('milestones', witch.get('milestones').map((x) => (x === m ? { ...x, claimed: x.claimed + 1 } : x)));
          renderMilestones(m.id);
        };
      });
      if (focusId) (target.querySelector(`[data-ms="${focusId}"]`) ?? target.querySelector('[data-ms]'))?.focus({ preventScroll: true });
    }

    function renderPhotos() {
      const photos = witch.get('photos');
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">Photos</div><div class="s-text gb-small">${photos.length} kept · take more with ${glyph('photoMode', 'sm')}</div></div>
          <div class="s-scroll fill"><div class="s-grid bk-album">
            ${photos.map((p, i) => `<button class="s-button bk-album-item" ${i === 0 ? 'data-focus-default' : ''} style="--tilt:${[-2, 1.5, -1, 2, -1.5][i % 5]}deg">${photoMarkup(p, 'bk-album-photo')}</button>`).join('')}
          </div></div>
        </div>`;
    }

    // Keepsakes › Camera kit (user, 2026-09-29): the filters and frames she's gathered;
    // cameras and lenses joined them on 2026-10-01. Harness variant 'kit' = 'all'
    // shows the whole kit, to try every piece.
    function renderKit() {
      const owned = ctx.variant('kit') === 'all' ? KIT.map((k) => `${k.kind}:${k.id}`) : witch.get('kit');
      const blassi = ctx.variant('blassi') ?? 'square';
      const names = ctx.variant('names') ?? 'anagram';
      const asList = (o) => Object.entries(o).map(([id, d]) => ({ id, ...d, label: o === BODIES ? bodyName(id, names) : d.label }));
      const section = (kind, defs, label, noun) => {
        const pieces = KIT.filter((k) => k.kind === kind);
        const n = pieces.filter((k) => owned.includes(`${kind}:${k.id}`)).length;
        return /* html */ `
          <div class="s-hbox bk-page-head"><div class="s-text gb-label fill">${label}</div><div class="s-text gb-small">${n} of ${pieces.length}</div></div>
          <div class="s-grid bk-kit">
            ${pieces.map((k) => {
              const def = defs.find((d) => d.id === k.id);
              const have = owned.includes(`${kind}:${k.id}`);
              const sample = { view: 'viewfinder', filter: kind === 'filter' ? k.id : 'none', frame: kind === 'frame' ? k.id : 'none',
                body: kind === 'body' ? k.id : 'box', lens: kind === 'lens' ? k.id : 'std', caption: 'Sample' };
              const meta = kind === 'body' ? def.kind : kind === 'lens' ? def.mm : '';
              const line = !have ? esc(k.hint) : def.desc ? esc(def.desc) : k.how === 'start' ? 'Came with the camera' : 'In your kit';
              return /* html */ `
                <button class="s-button gb-card bk-kit-item ${have ? '' : 'missing'}">
                  <span class="bk-kit-sample">${have ? photoMarkup(sample, 'bk-kit-photo', { blassi }) : '<span class="bk-kit-unknown">?</span>'}</span>
                  <span class="s-text gb-h3">${have ? def.label : `Unknown ${noun}`}</span>
                  ${have && meta ? `<span class="s-text gb-small bk-kit-meta">${esc(meta)}</span>` : ''}
                  <span class="s-text gb-small wrap">${line}</span>
                </button>`;
            }).join('')}
          </div>`;
      };
      target.innerHTML = /* html */ `
        <div class="s-vbox fill bk-page bk-wide">
          <div class="s-scroll fill"><div class="s-vbox bk-kit-wrap">
            ${section('body', asList(BODIES), 'Cameras', 'camera')}
            ${section('lens', asList(LENSES), 'Lenses', 'lens')}
            ${section('filter', FILTERS, 'Filters', 'filter')}
            ${section('frame', FRAMES, 'Frames', 'frame')}
          </div></div>
          <div class="gb-note bk-note">The user's idea (2026-09-29): gather a full camera kit over the game. Filters and frames are found, brewed, or Keepsake rewards (claim "Take a photo at sunset" to get Dusk). Cameras and lenses (2026-10-01) each come from a photo: the moon, a bird in flight, a vista. Collectibles, different not better. Harness: Kit › Whole kit tries them all.</div>
        </div>`;
    }

    root.querySelectorAll('[data-tab]').forEach((b) => { b.onclick = () => show(b.dataset.tab); });
    root.querySelector('[data-close]').onclick = () => ctx.action('back');
    ctx.onKey((e) => {
      const k = e.key.toLowerCase();
      if (assigning && tab === 'recipes' && railSel.recipes === 'spells') {
        if (/^[1-9]$/.test(k)) { assignTo(Number(k) - 1); return true; }
        if (k === 'escape') { const id = assigning; assigning = null; renderSpells(id); return true; }
      }
      if (k === 'q' || k === 'e') {
        const i = TABS.findIndex((t) => t.id === tab);
        show(TABS[(i + (k === 'e' ? 1 : TABS.length - 1)) % TABS.length].id);
        return true;
      }
      const rail = tabDef(tab).rail;
      if (rail && (k === 'w' || k === 's')) {
        const i = rail.findIndex((r) => r.id === railSel[tab]);
        showRail(rail[(i + (k === 's' ? 1 : rail.length - 1)) % rail.length].id);
        return true;
      }
      return false;
    });

    show(tab);
    ctx.play(root.querySelector('.bk-backing'), BACK_IN);
    ctx.play(root.querySelector('.bk-frame'), IN);
    return { outro: () => ctx.play(root.querySelector('.bk'), OUT).finished };
  },
};
