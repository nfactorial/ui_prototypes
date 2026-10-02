// Mock flight state — stands in for the ship, the scanner and the rating.
// ⚠️ The game has no scanner or contact system yet; these fields are a guess at
// what the HUD will need, to be replaced by the real viewmodel's shape.

import { createViewModel } from '../core/viewmodel.js';
import { onTick } from '../core/sim.js';

export const flight = createViewModel('flight', {
  speed: 212,          // m/s
  hull: 0.82,          // 0..1
  power: 0.64,
  heat: 0.31,
  heatState: 'ok',     // ok | warn | danger

  rating: 6.2,         // reference rating at the ship's position (nullpoint.md A1.0)
  policyFloor: 6,      // the hull policy's warranted rating (A1.0e)
  belowPolicy: false,  // rating < policyFloor → cover void from the point of breach

  targetName: 'Unidentified hull',
  targetDist: 18400,   // m
  closing: 42,         // m/s, + = closing

  // Contacts, as the HUD would receive them after projection:
  // u, v normalised screen position; behind = target is behind the camera.
  contacts: [],
});

// Paths in normalised screen space, chosen so that at any moment some contacts
// are on screen, some off an edge and one is behind the camera.
const CONTACTS = [
  { id: 'd1', kind: 'derelict', name: 'Unidentified hull', dist: 18400, cu: 0.62, cv: 0.42, ru: 0.05, rv: 0.03, w: 0.05 },
  { id: 'b1', kind: 'body', name: 'Harrow III', dist: 3.1e8, cu: 0.24, cv: 0.62, ru: 0.02, rv: 0.02, w: 0.02 },
  { id: 'n1', kind: 'neutral', name: 'Tender Kass', dist: 64000, cu: 0.95, cv: 0.3, ru: 0.25, rv: 0.1, w: 0.09 },
  { id: 'h1', kind: 'hostile', name: 'Contact', dist: 9200, cu: 0.5, cv: 1.1, ru: 0.6, rv: 0.2, w: 0.07 },
  { id: 'd2', kind: 'derelict', name: 'Signal', dist: 2.4e6, cu: 0.8, cv: 0.35, ru: 0.1, rv: 0.1, w: 0.04, behind: true },
];

onTick((t) => {
  flight.set('speed', 212 + Math.sin(t * 0.4) * 30);
  flight.set('targetDist', Math.max(400, 18400 - ((t * 42) % 18000)));
  flight.set('closing', 42 + Math.sin(t * 0.7) * 6);

  // Drift the rating across the policy floor so the warning can be seen.
  const rating = 6.15 + Math.sin(t * 0.15) * 0.75;
  flight.set('rating', Math.round(rating * 10) / 10);
  flight.set('belowPolicy', flight.get('rating') < flight.get('policyFloor'));

  const heat = 0.5 + Math.sin(t * 0.23) * 0.45;
  flight.set('heat', Math.round(heat * 100) / 100);
  flight.set('heatState', heat > 0.85 ? 'danger' : heat > 0.65 ? 'warn' : 'ok');

  flight.set('contacts', CONTACTS.map((c) => ({
    id: c.id,
    kind: c.kind,
    name: c.name,
    dist: c.id === 'd1' ? flight.get('targetDist') : c.dist,
    u: c.cu + Math.cos(t * c.w * Math.PI * 2) * c.ru,
    v: c.cv + Math.sin(t * c.w * Math.PI * 2) * c.rv,
    behind: !!c.behind,
  })));
});
