// Mock content for the computer's sections, plus the game-flow state.
// ⚠️ All placeholder. The flavour comes from the world (nullpoint.md): salvage
// contracts, insurance, the three-number record. None of it is designed.

import { createViewModel } from '../core/viewmodel.js';

// Flow state the prompts and computer care about.
export const game = createViewModel('game', {
  computerSeen: false,     // has the player opened the computer yet? (onboarding tip)
  activeMission: null,     // id of the accepted mission
});

export const missions = [
  {
    id: 'm1', type: 'Recovery contract', title: 'The Meridian Cartwright',
    image: '/assets/art/space_01.jpg', focus: '50% 45%',
    issuer: 'Halden Freight Co.', where: 'Harrow system, lanes 6–7',
    summary: 'A bulk freighter missed its window 212 days ago. The owner wants the hull; the insurer wants the nav log. Both pay.',
    lead: 'Last filed transit at 7. Search the lane edges.',
  },
  {
    id: 'm2', type: 'Distress fragment', title: 'A voice on channel nine',
    image: '/assets/art/entry_02.jpg', focus: '50% 28%',
    issuer: 'Unknown, looping', where: 'Harrow belt',
    summary: 'A partial distress call, repeating every 40 minutes. No transponder. It may be old.',
    lead: 'Signal strongest near the belt\'s inner edge.',
  },
  {
    id: 'm3', type: 'Loss adjustment', title: 'Prove the breach',
    image: '/assets/art/boarding_02.jpg', focus: '50% 40%',
    issuer: 'Calder & Wren, adjusters', where: 'Any rated wreck',
    summary: 'Recover a nav log intact from a hull certified above where it was found. Evidence of breach voids the claim.',
    lead: 'Pays for the log, not the salvage.',
  },
  {
    id: 'm4', type: 'Survey request', title: 'Chart the Tessel drift',
    image: '/assets/art/entry_01.jpg', focus: '50% 35%',
    issuer: 'Rim survey office', where: 'Tessel drift',
    summary: 'Scan and log every hull in the drift field. No boarding required.',
    lead: 'Passive and active scans both count.',
  },
];

// Personal loadout: slots and the options for each. Locked off-ship (flow.md F5).
export const loadoutSlots = [
  { id: 'primary', label: 'Primary weapon', options: ['Carbine', 'Shotgun', 'Breaching rifle'] },
  { id: 'sidearm', label: 'Sidearm', options: ['Service pistol', 'Flare pistol'] },
  { id: 'suit', label: 'Suit', options: ['Light EVA suit', 'Salvage hardsuit', 'Insulated suit'] },
  { id: 'tool', label: 'Tool', options: ['Cutting torch', 'Door jack', 'Hand scanner'] },
  { id: 'kit', label: 'Consumables', options: ['Med kit ×2', 'Oxygen canister ×2', 'Flares ×6'] },
];

// Ship: hardpoints and modules (the game has hardpoints as data; modules are unbuilt).
export const hardpoints = [
  { id: 'sensor1', label: 'Sensor · passive', options: ['Ship detection (always on)'] , note: 'Always active (scanning.md S2)' },
  { id: 'sensor2', label: 'Sensor · active', options: ['Life-sign scanner', 'Power-signature scanner', 'Hull profiler'], note: 'Adds a scan you trigger in flight' },
  { id: 'weapon', label: 'Weapon', options: ['Point-defence gun', 'Mass driver'] },
  { id: 'utility', label: 'Utility', options: ['Tow line', 'Cargo clamp'] },
];

// Records: ships you've scanned (scanning.md).
export const records = [
  {
    id: 'r1', name: 'Meridian Cartwright', registry: 'RL-0917-C', cls: 'Bulk freighter',
    cert: 6, filed: 7, found: 4,
    readings: [
      ['Life signs', 'One, faint, aft. Intermittent', 'uncertain'],
      ['Power', 'Reactor cold. Emergency cells active', ''],
      ['Atmosphere', 'Partial. Breach, forward cargo', ''],
      ['Transponder', 'Reads RL-0917-C. Hull profile disagrees', 'conflict'],
    ],
  },
  {
    id: 'r2', name: 'Unregistered hull', registry: '—', cls: 'Light hauler (profile)',
    cert: null, filed: null, found: 5,
    readings: [
      ['Life signs', 'None detected. Shielding may block scans', 'uncertain'],
      ['Power', 'None', ''],
      ['Atmosphere', 'Vented', ''],
    ],
  },
];

// Tooltip detail for items and modules, by name. Placeholder numbers.
export const itemInfo = {
  'Carbine': { body: 'Reliable at mid range. The salvor\'s default.', stats: { Damage: '24', Range: 'Medium', Weight: '3.4 kg' } },
  'Shotgun': { body: 'Devastating in corridors, useless past a few metres.', stats: { Damage: '9 × 8', Range: 'Short', Weight: '4.1 kg' } },
  'Breaching rifle': { body: 'Slow, loud, punches through bulkheads.', stats: { Damage: '70', Range: 'Long', Weight: '6.0 kg' } },
  'Service pistol': { body: 'Always there when the rifle isn\'t.', stats: { Damage: '14', Range: 'Short', Weight: '1.1 kg' } },
  'Flare pistol': { body: 'Lights a room for half a minute. Burns what it hits.', stats: { Flares: '4', Burn: '30 s' } },
  'Light EVA suit': { body: 'Moves well, protects little.', stats: { Armour: 'Low', Oxygen: '40 min', Speed: 'Fast' } },
  'Salvage hardsuit': { body: 'Built for cutting hulls, not for running.', stats: { Armour: 'High', Oxygen: '60 min', Speed: 'Slow' } },
  'Insulated suit': { body: 'For cold, dead ships and vented decks.', stats: { Armour: 'Medium', Oxygen: '50 min', Cold: 'Resistant' } },
  'Cutting torch': { body: 'Opens sealed doors and cargo. Takes time.', stats: { 'Cut time': '8 s' } },
  'Door jack': { body: 'Forces powered doors without power. Noisy.', stats: { 'Force time': '3 s', Noise: 'High' } },
  'Hand scanner': { body: 'Short-range reading of what\'s behind a wall.', stats: { Range: '12 m' } },
  'Med kit ×2': { body: 'Stops bleeding. Doesn\'t fix a suit breach.', stats: { Heals: '60%' } },
  'Oxygen canister ×2': { body: 'Buys time when the suit runs low.', stats: { Adds: '10 min each' } },
  'Flares ×6': { body: 'Throwable light. The dark is most of the danger.', stats: { Burn: '45 s' } },
  'Ship detection (always on)': { body: 'Passive. Picks up hulls and transponders at long range.', stats: { Range: '40 000 km' } },
  'Life-sign scanner': { body: 'Active: "Scan for life signatures". Honest about its uncertainty.', stats: { Range: '2 km', 'Scan time': '6 s' } },
  'Power-signature scanner': { body: 'Active: finds live systems, reactors, batteries.', stats: { Range: '5 km', 'Scan time': '4 s' } },
  'Hull profiler': { body: 'Active: the hull\'s real shape and class. Catches forged transponders.', stats: { Range: '1 km', 'Scan time': '10 s' } },
  'Point-defence gun': { body: 'Shoots down debris and small threats. Not for fights.', stats: { Damage: 'Low', 'Fire rate': 'High' } },
  'Mass driver': { body: 'A last resort that makes a point.', stats: { Damage: 'High', 'Fire rate': 'Low' } },
  'Tow line': { body: 'Drag salvage home. Slows the ship right down.', stats: { 'Max mass': '800 t' } },
  'Cargo clamp': { body: 'Carries a container rigidly. Faster than towing, less mass.', stats: { 'Max mass': '200 t' } },
};

// Turn itemInfo into data-tip-* attributes.
export function itemTip(name, meta) {
  const info = itemInfo[name];
  if (!info) return '';
  const stats = Object.entries(info.stats ?? {}).map(([k, v]) => `${k}:${v}`).join('|');
  const attr = (s) => String(s).replace(/"/g, '&quot;');
  return `data-tip-title="${attr(name)}" data-tip-meta="${attr(meta)}" data-tip-body="${attr(info.body)}" data-tip-stats="${attr(stats)}"`;
}

export const computer = createViewModel('computer', {
  loadout: { primary: 'Carbine', sidearm: 'Service pistol', suit: 'Light EVA suit', tool: 'Cutting torch', kit: 'Med kit ×2' },
  modules: { sensor1: 'Ship detection (always on)', sensor2: 'Life-sign scanner', weapon: 'Point-defence gun', utility: 'Tow line' },
});
