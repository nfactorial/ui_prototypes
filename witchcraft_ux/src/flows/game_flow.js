// The game flow (documents/flow.md) as a small state machine standing in for the
// game: which screens are open, keys the screens didn't handle, and actions sent
// with ctx.action().
//
//   Main menu ──Continue/New──▶ the world (world HUD + zone banner)
//   In the world:  I satchel · K spells (the book: Recipes › Spells) · T tools · Tab spell wheel
//                  1–5 spell buttons · Q/E cycle spell · G interact · F fish · P photo mode · N study (demo)
//                  Z next zone · 6–0 toasts
//                  Esc → pause (or back out of whatever is open)
//   🔴 Only the pause menu pauses the world (user, 2026-09-29, flow.md D3). The
//   book, selectors and fishing reveal all run with the world carrying on.
//
// Keys are placeholders: the game is keyboard or joypad, and the prototype needn't match 1:1 (D4).

import { ZONES } from '../mock/world.js';
import { FISH, studyDone } from '../mock/witch.js';
import { dayPhase } from '../core/format.js';

const DEMO_TOASTS = {
  6: { kind: 'collected', title: 'Gorse flowers', body: '×3' },
  7: { kind: 'caught', title: 'Perch', body: 'Into the satchel' },
  8: { kind: 'notice', title: 'Your hands are full' },
  9: { kind: 'learned', title: 'Kindle', body: 'Coax a flame from dry wood.' },
  0: { kind: 'milestone', title: 'The Hagstones are open', body: 'A way through to somewhere new.' },
};

// The mock clock follows the backdrop, so the time card doesn't say "Morning" under the moon.
const BACKDROP_TIME = {
  'path-day': [0.46, 17], 'path-golden': [0.74, 15], 'rocky-hill': [0.5, 18], 'meadow-sea': [0.55, 16],
  'cliff-sunset': [0.8, 12], 'cliff-golden': [0.77, 13], 'broom-sunset': [0.79, 12], 'night-moon': [0.96, 6],
};

// The only thing that pauses the world (D3). Settings/quit opened from it keep it open underneath.
const PAUSING = ['pause-menu'];

export default function createFlow({ screens, setBackdrop, viewmodels, setGamePaused, message, toast, start, worldBackdrop }) {
  const { world, witch, game } = viewmodels;
  let state = 'mainmenu'; // 'mainmenu' | 'world'
  let zoneIndex = 0;
  let fishCount = 0;
  let bookTab = null;

  const isOpen = (id) => screens.isOpen(id);
  const syncPause = () => setGamePaused(PAUSING.some(isOpen));
  const menuOpen = () => ['book', 'pause-menu', 'quick-select', 'fishing', 'photo-mode', 'dialogue', 'study-reveal', 'settings', 'quit-confirm'].some(isOpen);
  // Studying an animal (demo): the next creature with something left to learn takes a step,
  // revealing one charm reagent.
  function study() {
    const list = witch.get('creatures');
    const c = list.find((x) => x.learn?.length);
    if (!c) { message('Nothing left to learn about the animals in the mock.'); return; }
    const [reagent, ...rest] = c.learn;
    const next = { ...c, reagents: [...c.reagents, reagent], learn: rest };
    witch.set('creatures', list.map((x) => (x === c ? next : x)));
    screens.open('study-reveal', { creature: next, reagent, complete: studyDone(next) });
  }
  // Small tasks move on from things she does (a mock of the game's event → task progress).
  const bumpTask = (match) => witch.set('tasks', witch.get('tasks').map((t) => (match.test(t.text) ? { ...t, progress: t.progress + 1 } : t)));

  async function toMainMenu() {
    state = 'mainmenu';
    setBackdrop('black');
    await screens.show(['main-menu']);
    syncPause();
  }

  async function toWorld() {
    state = 'world';
    setBackdrop(worldBackdrop ?? 'path-day');
    await screens.show(['world-hud', 'zone-banner']);
    syncPause();
  }

  async function openBook(tab) {
    if (state !== 'world') return;
    if (isOpen('book')) {
      await screens.close('book');
      if (bookTab === tab) { syncPause(); return; }   // same key again closes it
    }
    bookTab = tab;
    await screens.open('book', { tab });
    if (tab === 'satchel') game.set('satchelSeen', true);
    syncPause();
  }

  async function openSelector(kind) {
    if (state !== 'world' || menuOpen()) return;
    await screens.open('quick-select', { kind });
    syncPause();
  }

  async function close(id) {
    await screens.close(id);
    syncPause();
  }

  async function fish() {
    if (state !== 'world' || menuOpen()) return;
    fishCount++;
    // First try: a Mackerel she's never caught (it turns from "Unknown fish" into a known one in the book).
    const tag = fishCount % 4 === 0 ? null : [FISH[0], FISH[4], FISH[3]][fishCount % 3].tag;
    const f = tag && witch.get('fish').find((x) => x.tag === tag);
    const params = f ? { fish: { ...f, first: f.count === 0 } } : { fish: null };
    await screens.open('fishing', params);
    syncPause();
  }

  // Esc is "back": close the topmost thing, or open the pause menu in-world.
  function back() {
    for (const id of ['quit-confirm', 'settings', 'quick-select', 'photo-mode', 'dialogue', 'study-reveal', 'book', 'pause-menu']) {
      if (isOpen(id)) { close(id); return true; }
    }
    if (state === 'world' && !isOpen('fishing')) { screens.open('pause-menu').then(syncPause); return true; }
    return false;
  }

  function cycleSpell(dir) {
    const loadout = witch.get('loadout');
    const filled = loadout.map((id, i) => (id ? i : -1)).filter((i) => i >= 0);
    if (!filled.length) return;
    const at = filled.indexOf(world.get('activeSpell'));
    world.set('activeSpell', filled[(at + dir + filled.length) % filled.length]);
  }

  return {
    async start() {
      game.patch({ satchelSeen: false });
      const [timeOfDay, temperature] = BACKDROP_TIME[worldBackdrop ?? 'path-day'] ?? BACKDROP_TIME['path-day'];
      world.patch({ zoneName: ZONES[0], activeSpell: 0, tool: 'Item.Tool.Rod', timeOfDay, temperature });
      zoneIndex = 0;
      fishCount = 0;
      if (start === 'mainmenu' || !start) return toMainMenu();
      await toWorld();
      if (start === 'satchel') await openBook('satchel');
      if (start === 'spells') await openBook('recipes:spells');
      if (start?.startsWith('book:')) await openBook(start.slice(5));
      if (start === 'tools') await openSelector('tool');
      if (start === 'spellsel') await openSelector('spell');
      if (start === 'fishing') setTimeout(fish, 800);
      if (start === 'photo') await screens.open('photo-mode');
      if (start === 'kit') await openBook('keepsakes:kit');
      if (start === 'talk') await screens.open('dialogue', { who: 'Hazel' });
      if (start === 'study') setTimeout(study, 600);
      if (start === 'pause') { await screens.open('pause-menu'); syncPause(); }
    },

    onKey(e) {
      if (e.key === 'Escape') return back();
      if (state !== 'world') return false;
      const k = e.key.toLowerCase();

      // Keys that work with the book open too: I / K jump between its tabs or close it.
      if (k === 'i' || k === 'k') {
        if (isOpen('pause-menu') || isOpen('quick-select') || isOpen('fishing') || isOpen('photo-mode')) return true;
        const tab = k === 'i' ? 'satchel' : 'recipes:spells';
        openBook(tab);
        return true;
      }
      if (menuOpen()) return false;

      if (DEMO_TOASTS[e.key]) { toast(DEMO_TOASTS[e.key]); return true; }
      // Spell buttons: the same 1–5 the book assigns to. An empty slot does nothing.
      if (/^[1-5]$/.test(e.key)) {
        const n = Number(e.key) - 1;
        if (witch.get('loadout')[n]) world.set('activeSpell', n);
        return true;
      }
      switch (k) {
        case 't':   openSelector('tool'); return true;
        case 'tab': openSelector('spell'); return true;
        case 'q':   cycleSpell(-1); return true;
        case 'e':   cycleSpell(1); return true;
        case 'f':   fish(); return true;
        case 'p':   screens.open('photo-mode'); return true;
        case 'n':   study(); return true;
        case 'z':   zoneIndex = (zoneIndex + 1) % ZONES.length; world.set('zoneName', ZONES[zoneIndex]); return true;
        case 'g': {
          const p = world.get('prompt');
          if (!p) { message('Nothing nearby to interact with.'); return true; }
          if (/pick/i.test(p.verb)) toast({ kind: 'collected', title: p.target });
          else if (p.verb === 'Talk') { screens.open('dialogue', { who: p.target }); bumpTask(/neighbour/i); }
          else message(`${p.verb} ${p.target}: that would start an interaction (petting…).`);
          world.set('prompt', null);
          return true;
        }
        default: return false;
      }
    },

    onAction(name, data) {
      switch (name) {
        case 'continue':
        case 'new-game':     return toWorld();
        case 'settings':     return screens.open('settings').then(syncPause);
        case 'back':         return back();
        case 'resume':       return close('pause-menu');
        case 'main-menu':    return toMainMenu();
        case 'quit':         return screens.open('quit-confirm');
        case 'quit-confirmed':
          close('quit-confirm');
          return message('Quit to desktop: the game would exit here.');
        case 'select-tool':
          world.set('tool', data.id);
          if (data.from !== 'book') return close('quick-select');
          return;
        case 'select-spell':
          world.set('activeSpell', data.index);
          return close('quick-select');
        case 'fishing-done':
          close('fishing');
          if (data.fish) {
            // Into her knowledge (the Fish collection) as well as the satchel.
            witch.set('fish', witch.get('fish').map((x) => (x.tag === data.fish.tag ? { ...x, count: x.count + 1 } : x)));
            bumpTask(/catch .* fish/i);
            toast({ kind: 'caught', title: data.fish.name, body: data.fish.first ? 'New to your book of fish' : 'Into the satchel' });
          }
          return;
        case 'study-done':
          return close('study-reveal');
        case 'talk-done':
          return close('dialogue');
        case 'photo-taken':
          if (dayPhase(world.get('timeOfDay')) === 'Evening') bumpTask(/photo at sunset/i);
          return;
        default:
          return message(`Action "${name}" has no handler in game_flow.js`);
      }
    },
  };
}
