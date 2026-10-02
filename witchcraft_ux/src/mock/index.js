// Every mock viewmodel, by the name used in data-bind="<name>.<field>".
import { createViewModel } from '../core/viewmodel.js';
import { world } from './world.js';
import { witch } from './witch.js';

// Flow state the prototype needs (not game data).
export const game = createViewModel('game', {
  satchelSeen: false,   // onboarding tip until the satchel has been opened once
});

// Player settings (camera PRD stage G: "settings, not tuning"; todo 8).
export const settings = createViewModel('settings', {
  mouseSensX: 0.5, mouseSensY: 0.5, mouseInvertY: false,
  stickSensX: 0.5, stickSensY: 0.5, stickInvertY: false,
  cameraShake: true, autoCenter: true, subtitles: true, uiScale: 1,
});

export const viewmodels = { world, witch, game, settings };
