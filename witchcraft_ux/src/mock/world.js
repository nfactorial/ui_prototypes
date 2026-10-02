// The world around the witch: time, weather, the zone she's in, and what she's
// looking at. Field names follow the game's C++ where it exists:
//   ClimateFramework  TimeOfDay [0,1), EDayPhase, FWeatherParameters, EWeatherMood
//   ZoneFramework     ZoneName (the banner shows it on entry)
//   CozyFramework     ICozyInteractable::GetInteractionPrompt (a verb) + the focused actor
import { createViewModel } from '../core/viewmodel.js';
import { onTick } from '../core/sim.js';

export const world = createViewModel('world', {
  timeOfDay: 0.29,          // ~07:00
  weatherMood: 'Clear',     // Clear | Cloudy | Overcast | Foggy | Rainy
  temperature: 14,          // °C (air)
  zoneName: 'Silverwood',
  // What the interactor is focused on, or null. The verb is the game's; the
  // target name is a proposal (ICozyInteractable has no display name yet).
  prompt: null,             // { verb: 'Pick', target: 'Birch sticks' }
  // Spells (USpellbookComponent): the active one, for a brief on-change hint.
  activeSpell: 0,           // index into witch.loadout
  tool: 'Item.Tool.Rod',   // the one equipped tool slot (equipped_tool_prd), or null = hands free
});

// Zones (documents/design/world/zones/names.md). '' = an unnamed zone: no banner.
export const ZONES = ['Silverwood', 'Midnight Coast', '', 'Hallow Ridge', 'Crystal Coast', 'Siren\'s Call', 'Ritual Peak'];

// Things the witch might wander up to. The prompt appears as she nears one.
const NEARBY = [
  { verb: 'Pick', target: 'Birch sticks' },
  null,
  { verb: 'Talk', target: 'Hazel' },
  null,
  { verb: 'Pet', target: 'A grey cat' },
  null,
  { verb: 'Pick Up', target: 'Heron feather' },
  null,
];

let wanderT = 0;
let idx = 0;
onTick((t, dt) => {
  // A day passes in about ten minutes of wall time.
  world.set('timeOfDay', (world.get('timeOfDay') + dt / 600) % 1);
  wanderT += dt;
  if (wanderT > 3.2) {
    wanderT = 0;
    idx = (idx + 1) % NEARBY.length;
    world.set('prompt', NEARBY[idx]);
  }
});
