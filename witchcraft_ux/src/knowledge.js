// What she knows: how an ingredient/reagent is shown, given her Almanac and satchel.
// Items are always known; a fish or flower is known once it's in her Almanac
// (count > 0), otherwise it reads "Unknown fish" / "Unknown flower".
import { ITEMS } from './mock/witch.js';

const KINDS = {
  fish:   { list: 'fish',    unknown: 'Unknown fish',   icon: 'fish' },
  flower: { list: 'flowers', unknown: 'Unknown flower', icon: 'flower' },
};

export function resolveIngredient(witch, r) {
  const inSatchel = (name) => witch.get('satchel').some((s) => s && ITEMS[s.item]?.name === name);
  if (r.kind === 'item') {
    const it = ITEMS[r.tag];
    return { name: it?.name ?? r.tag, icon: it?.icon ?? 'circle', known: true, carried: inSatchel(it?.name) };
  }
  const k = KINDS[r.kind];
  const e = witch.get(k.list).find((x) => x.tag === r.tag);
  const found = !!(e && e.count > 0);
  return { name: found ? e.name : k.unknown, icon: k.icon, known: found, carried: found && inSatchel(e.name) };
}
