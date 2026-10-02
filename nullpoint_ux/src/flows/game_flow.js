// The game flow (documents/flow.md) as a small state machine. It stands in for
// the game: it owns which screens are open, reacts to keys the screens didn't
// handle, and to actions the screens send via ctx.action().
//
//   Main menu ──Continue/New──▶ In the world (on your ship)
//   In the world:  C → computer (F3, F7), Esc → pause menu (F9)
//   Computer / pause open → the world is paused (F8)
//
// A scene opts in with  controller: () => import('./flows/game_flow.js')
// and may pass  start: 'mainmenu' | 'world' | 'computer' | 'pause'.

// Demo toasts, fired with number keys while in the world (not in menus).
const DEMO_TOASTS = {
  1: { kind: 'acquired', title: 'Ship logs', body: 'Meridian Cartwright, partial' },
  2: { kind: 'mission', title: 'The Meridian Cartwright', body: 'Nav log recovered intact' },
  3: { kind: 'warning', title: 'Below policy floor', body: 'Reference 5.8. Hull and crew cover void.' },
  4: { kind: 'objective', title: 'Find the cargo manifest' },
  5: { kind: 'log', title: 'Crew recording, day 212' },
  6: { kind: 'powerup', title: 'Overcharge ready', body: 'Suit capacitors at full' },
};

export default function createFlow({ screens, setBackdrop, viewmodels, setGamePaused, message, toast, start }) {
  let state = 'mainmenu'; // 'mainmenu' | 'world'

  const isOpen = (id) => screens.isOpen(id);

  function syncPause() {
    setGamePaused(isOpen('computer') || isOpen('pause-menu'));
  }

  async function toMainMenu() {
    state = 'mainmenu';
    setBackdrop('black');
    await screens.show(['main-menu']);
    syncPause();
  }

  async function toWorld() {
    state = 'world';
    setBackdrop('space');
    await screens.show(['flight-hud', 'world-prompts']);
    syncPause();
  }

  async function openComputer() {
    if (state !== 'world' || isOpen('pause-menu')) return;
    await screens.open('computer');
    viewmodels.game.set('computerSeen', true);
    syncPause();
  }

  async function close(id) {
    await screens.close(id);
    syncPause();
  }

  // Esc is "back": close the topmost thing, or open the pause menu in-world.
  function back() {
    for (const id of ['quit-confirm', 'settings', 'computer', 'pause-menu']) {
      if (isOpen(id)) { close(id); return true; }
    }
    if (state === 'world') { screens.open('pause-menu').then(syncPause); return true; }
    return false;
  }

  return {
    async start() {
      // Each run of the flow starts fresh (a replay should show onboarding again).
      viewmodels.game.patch({ computerSeen: false, activeMission: null });
      if (start === 'world' || start === 'computer' || start === 'pause') {
        await toWorld();
        if (start === 'computer') await openComputer();
        if (start === 'pause') { await screens.open('pause-menu'); syncPause(); }
      } else {
        await toMainMenu();
      }
    },

    onKey(e) {
      if (e.key === 'Escape') return back();
      if (DEMO_TOASTS[e.key] && state === 'world' && !isOpen('pause-menu')) {
        toast(DEMO_TOASTS[e.key]);
        return true;
      }
      if (e.key.toLowerCase() === 'c' && state === 'world') {
        if (isOpen('computer')) close('computer');
        else openComputer();
        return true;
      }
      return false;
    },

    onAction(name, data) {
      switch (name) {
        case 'continue':
        case 'new-game':     return toWorld();
        case 'settings':     return screens.open('settings');
        case 'back':         return back();
        case 'resume':       return close('pause-menu');
        case 'main-menu':    return toMainMenu();
        case 'quit':         return screens.open('quit-confirm');
        case 'quit-confirmed':
          close('quit-confirm');
          return message('Quit to desktop: the game would exit here.');
        case 'close-computer': return close('computer');
        case 'accept-mission':
          viewmodels.game.set('activeMission', data.id);
          return toast({ kind: 'info', label: 'Mission accepted', title: data.title, body: data.lead });
        default:
          return message(`Action "${name}" has no handler in game_flow.js`);
      }
    },
  };
}
