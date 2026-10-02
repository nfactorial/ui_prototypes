// The witch's things: satchel, spells, collections (fish, flowers), studied creatures. Shapes follow the game's data:
//   UItemDefinition    ItemTag, DisplayName, Description, Icon, bStackable
//   FInventoryContainer ContainerId, Width × Height, Slots[{ Item, Count }]
//   USpellbookComponent EquippedSpells, active selection
//   FFishCatchEntry    FishTag, DisplayName, EFishRarity, time-of-day window
// Fields the game doesn't have yet are marked PROPOSED.
import { createViewModel } from '../core/viewmodel.js';

// Colour affinity (documents/design/color_affinity.md). Every item and spell has one.
// PROPOSED: whether the UI ever shows affinity is open (the wand's is never disclosed).
export const AFFINITIES = ['green', 'yellow', 'blue', 'red', 'black', 'white', 'void'];

export const ITEMS = {
  'Item.Stick.Birch':    { name: 'Birch sticks',     icon: 'stick',    affinity: 'white',  desc: 'Pale, papery bark. They catch easily.' },
  'Item.Stick.Hazel':    { name: 'Hazel sticks',     icon: 'stick',    affinity: 'green',  desc: 'Straight and supple. Good for a fire, better for a wand.' },
  'Item.Feather.Heron':  { name: 'Heron feather',    icon: 'feather',  affinity: 'blue',   desc: 'Long and grey, from the lake shore.' },
  'Item.Feather.Crow':   { name: 'Crow feather',     icon: 'feather',  affinity: 'black',  desc: 'Found on Hallow Ridge. It shines blue in the sun.' },
  'Item.Mushroom.Cap':   { name: 'Ink cap',          icon: 'mushroom', affinity: 'black',  desc: 'It dissolves into ink if you leave it.' },
  'Item.Flower.Gorse':   { name: 'Gorse flowers',    icon: 'flower',   affinity: 'yellow', desc: 'Smells of coconut. Prickly to pick.' },
  'Item.Flower.Thrift':  { name: 'Sea thrift',       icon: 'flower',   affinity: 'red',    desc: 'Pink cushions on the cliff edge.' },
  'Item.Stone.Hag':      { name: 'Hag stone',        icon: 'stone',    affinity: 'void',   desc: 'A pebble with a hole worn clean through. Look through it.' },
  'Item.Berry.Rowan':    { name: 'Rowan berries',    icon: 'berry',    affinity: 'red',    desc: 'Bitter raw. Birds love them.' },
  'Item.Bottle.Dew':     { name: 'Bottled dew',      icon: 'bottle',   affinity: 'white',  desc: 'Collected before sunrise, the way it has to be.' },
  'Item.Fish.Perch':     { name: 'Perch',            icon: 'fish',     affinity: 'green',  desc: 'Striped and cross-looking.' },
  'Item.Fish.Moonfish':  { name: 'Moonfish',         icon: 'fish',     affinity: 'white',  desc: 'Only bites after dark.' },
  'Item.Tool.Rod':       { name: 'Willow rod',       icon: 'rod',      affinity: 'void',   desc: 'Your fishing rod.', tool: true },
  'Item.Tool.Broom':     { name: 'Old Faithful',     icon: 'broom',    affinity: 'void',   desc: 'A broom is known by its name and how it flies, never by a stat block.', tool: true },
};

// The satchel: one container, 8 × 3. null = empty slot.
const SATCHEL = [
  ['Item.Tool.Broom', 1], ['Item.Tool.Rod', 1], ['Item.Stick.Birch', 7], ['Item.Stick.Hazel', 3],
  ['Item.Feather.Heron', 1], ['Item.Feather.Crow', 2], ['Item.Mushroom.Cap', 4], ['Item.Flower.Gorse', 12],
  ['Item.Flower.Thrift', 5], ['Item.Stone.Hag', 1], ['Item.Berry.Rowan', 9], ['Item.Bottle.Dew', 2],
  ['Item.Fish.Perch', 1], null, null, null, null, null, null, null, null, null, null, null,
].map((s) => (s ? { item: s[0], count: s[1] } : null));

// Spells. The only built one is the wisp; the rest are placeholders for layout.
// cost: free | reagent | ritual (documents/todo/spell-grammar-and-loadout.md)
export const SPELLS = [
  { id: 'wisp',   name: "Will-o'-wisp",       icon: 'wisp',    affinity: 'white',  cost: 'free',    built: true,
    desc: 'Conjure a small light that follows you. Cast again to call it home.' },
  { id: 'kindle', name: 'Kindle',             icon: 'flame',   affinity: 'red',    cost: 'reagent', reagent: 'Birch sticks',
    desc: 'Coax a flame from dry wood.' },
  { id: 'still',  name: 'Still the Water',    icon: 'water',   affinity: 'blue',   cost: 'free',
    desc: 'Flatten a pond long enough to see what lives in it.' },
  { id: 'wind',   name: 'Call of the Gorse',  icon: 'flower',  affinity: 'yellow', cost: 'reagent', reagent: 'Gorse flowers',
    desc: 'Scatter petals on the wind, and follow where they go.' },
  { id: 'ring',   name: 'The Walked Ring',    icon: 'circle',  affinity: 'green',  cost: 'ritual',
    desc: 'Walk a circle in the grass at dusk. Something answers.' },
  { id: 'mend',   name: 'Mend',               icon: 'sparkle', affinity: 'void',   cost: 'free',
    desc: 'Put a broken thing back the way it was.' },
  { id: 'hush',   name: 'Hush',               icon: 'moon',    affinity: 'black',  cost: 'free',
    desc: 'Every creature nearby forgets you were ever here.' },
];

// --- Collections: what she KNOWS (user, 2026-09-29) --------------------------
// Fish and Flowers are knowledge collections. They matter because Study (below)
// names reagents, and a reagent she hasn't found yet reads "Unknown fish".
//
// PROPOSED game data: a location range on each entry (FFishCatchEntry today has
// none), shown in the book as the third field:
//   range 'widespread' → "Various"             (can appear in many places)
//   range 'region'     → the region's name     (only in one region)
//   range 'specific'   → the water/place name  (only in one spot)
// ⚠️ Called "Common / Region / Specific" in conversation; renamed Widespread here
// so it can't be confused with the rarity "Common".
// count = how many she has caught/picked (kept for now: maybe achievements).
export const FISH = [
  { tag: 'Fish.Perch',    name: 'Perch',        rarity: 'Common',    range: 'widespread',                        count: 3 },
  { tag: 'Fish.Roach',    name: 'Roach',        rarity: 'Common',    range: 'region',   place: 'Reedmoor',       count: 1 },
  { tag: 'Fish.Pike',     name: 'Pike',         rarity: 'Uncommon',  range: 'specific', place: 'Mirrormere',     count: 1 },
  { tag: 'Fish.Moonfish', name: 'Moonfish',     rarity: 'Rare',      range: 'region',   place: 'Midnight Coast', count: 1 },
  { tag: 'Fish.Mackerel', name: 'Mackerel',     rarity: 'Common',    range: 'region',   place: 'Crystal Coast',  count: 0 },
  { tag: 'Fish.Eel',      name: "Selkie's Eel", rarity: 'Legendary', range: 'specific', place: 'Selkie Strand',  count: 0 },
];

export const FLOWERS = [
  { tag: 'Flower.Gorse',    name: 'Gorse',            rarity: 'Common',    range: 'widespread',                        count: 12 },
  { tag: 'Flower.Thrift',   name: 'Sea thrift',       rarity: 'Common',    range: 'region',   place: 'Midnight Coast', count: 5 },
  { tag: 'Flower.Harebell', name: 'Harebell',         rarity: 'Uncommon',  range: 'region',   place: 'Hallow Ridge',   count: 2 },
  { tag: 'Flower.Asphodel', name: 'Bog asphodel',     rarity: 'Rare',      range: 'specific', place: 'Reedmoor',       count: 0 },
  { tag: 'Flower.Foxglove', name: 'Foxglove',         rarity: 'Uncommon',  range: 'widespread',                        count: 0 },
  { tag: 'Flower.Nightbloom', name: 'Night-scented stock', rarity: 'Rare', range: 'specific', place: 'Ritual Peak',    count: 0 },
];

// The display rule for the third field.
export const whereLabel = (e) => (e.range === 'widespread' ? 'Various' : e.place);

// --- Study → familiars (the user's idea, 2026-09-29; speculative) ------------
// She studies an animal (not fish) until she knows what charming it takes. Known
// reagents she hasn't found yet show as "Unknown fish" / "Unknown flower", which
// gives fishing and picking a reason.
// 🔴 One study step reveals one ingredient (user, 2026-10-01), so a charm's ingredient
// count IS its number of study pips: one ingredient, one pip; five, five pips.
// `reagents` = what she knows, `learn` = what's still to learn (the mock's queue,
// in the order study reveals it). Nothing else is stored: pips derive from these.
// A reagent: { kind: 'fish' | 'flower' | 'item', tag }. Shown in the book two ways:
// Almanac › Creatures (the animal: study, where) and Recipes › Charms (the reagents).
export const CREATURES = [
  { id: 'heron', name: 'Grey heron', icon: 'feather', rarity: 'Common', range: 'widespread', reagents: [
    { kind: 'fish', tag: 'Fish.Perch' }, { kind: 'flower', tag: 'Flower.Asphodel' }, { kind: 'item', tag: 'Item.Bottle.Dew' },
  ], learn: [] },
  { id: 'hare', name: 'Mountain hare', icon: 'leaf', rarity: 'Uncommon', range: 'region', place: 'Hallow Ridge', reagents: [
    { kind: 'flower', tag: 'Flower.Harebell' }, { kind: 'fish', tag: 'Fish.Mackerel' },
  ], learn: [{ kind: 'flower', tag: 'Flower.Foxglove' }] },
  { id: 'owl', name: 'Barn owl', icon: 'moon', rarity: 'Uncommon', range: 'specific', place: 'Ritual Peak', reagents: [
    { kind: 'item', tag: 'Item.Feather.Crow' },
  ], learn: [{ kind: 'fish', tag: 'Fish.Moonfish' }, { kind: 'flower', tag: 'Flower.Nightbloom' }, { kind: 'item', tag: 'Item.Mushroom.Cap' }, { kind: 'flower', tag: 'Flower.Thrift' }] },
  { id: 'hedgehog', name: 'Hedgehog', icon: 'berry', rarity: 'Common', range: 'widespread', reagents: [],
    learn: [{ kind: 'item', tag: 'Item.Berry.Rowan' }] },
];
// Study progress, derived: one pip per ingredient.
export const studyKnown = (c) => c.reagents.length;
export const studyTotal = (c) => c.reagents.length + (c.learn?.length ?? 0);
export const studyDone = (c) => studyKnown(c) >= studyTotal(c);

// --- Recipes: Cooking, Potions (speculative: no cooking or brewing design yet) --
// An ingredient is { kind: 'item' | 'fish' | 'flower', tag }. A fish/flower she
// hasn't found reads "Unknown fish" / "Unknown flower", same as Study's reagents.
// learnt: false = she knows a recipe exists but not what goes in it.
export const RECIPES = {
  cooking: [
    { id: 'perch-stick', name: 'Perch on a stick', station: 'Campfire', learnt: true, desc: 'Charred outside, flaky in the middle.',
      ingredients: [{ kind: 'fish', tag: 'Fish.Perch' }, { kind: 'item', tag: 'Item.Stick.Hazel' }] },
    { id: 'gorse-tea', name: 'Gorse-flower tea', station: 'Campfire', learnt: true, desc: 'Tastes faintly of coconut and summer.',
      ingredients: [{ kind: 'flower', tag: 'Flower.Gorse' }, { kind: 'item', tag: 'Item.Bottle.Dew' }] },
    { id: 'smoked-mackerel', name: 'Smoked mackerel', station: 'Campfire', learnt: true, desc: 'Worth the smell in your hair.',
      ingredients: [{ kind: 'fish', tag: 'Fish.Mackerel' }, { kind: 'item', tag: 'Item.Stick.Birch' }] },
    { id: 'rowan-jelly', name: 'Rowan jelly', station: 'Campfire', learnt: false },
  ],
  potions: [
    { id: 'warming', name: 'Warming draught', station: 'Cauldron', learnt: true, desc: 'For cold hands and long nights out.',
      ingredients: [{ kind: 'flower', tag: 'Flower.Gorse' }, { kind: 'item', tag: 'Item.Berry.Rowan' }, { kind: 'item', tag: 'Item.Bottle.Dew' }] },
    { id: 'night-ink', name: 'Night ink', station: 'Cauldron', learnt: true, desc: 'Writes words that only show by moonlight.',
      ingredients: [{ kind: 'item', tag: 'Item.Mushroom.Cap' }, { kind: 'item', tag: 'Item.Feather.Crow' }] },
    { id: 'marsh-light', name: 'Marsh-light tonic', station: 'Cauldron', learnt: true, desc: 'Your wisp burns green for a while.',
      ingredients: [{ kind: 'flower', tag: 'Flower.Asphodel' }, { kind: 'item', tag: 'Item.Bottle.Dew' }] },
    { id: 'unknown-brew', name: 'A brew from the Hagstones', station: 'Cauldron', learnt: false },
  ],
};

// --- Keepsakes (user, 2026-09-29: own tab; more Animal Crossing than Stardew) ------
// 🔴 Reward tasks are OPTIONAL. Daily ones are fine, but missing one never costs
// something exclusive. So small tasks never expire: a finished one is replaced by a
// new one, whenever she gets to it. Rewards are PROPOSED as cosmetic (photo frames,
// keepsake items): the game has no currency.
export const TASKS = [
  { id: 't1', text: 'Catch 3 fish',              progress: 1, goal: 3, reward: 'A sprig of heather' },
  { id: 't2', text: 'Pick 5 flowers',            progress: 5, goal: 5, reward: 'Pressed-flower frame' },
  { id: 't3', text: 'Take a photo at sunset',    progress: 0, goal: 1, reward: 'Dusk filter' },
  { id: 't4', text: 'Say hello to a neighbour',  progress: 1, goal: 1, reward: 'A pebble with a face' },
];
// Replacements, drawn in order as tasks are claimed.
export const TASK_POOL = [
  { text: 'Light a campfire',          goal: 1, reward: 'Birch bark' },
  { text: 'Pet 2 cats',                goal: 2, reward: 'Cat-shaped cookie cutter' },
  { text: 'Fly your broom over water',  goal: 1, reward: 'A wind-blown feather' },
  { text: 'Brew a potion',             goal: 1, reward: 'Tiny cork' },
];

// Milestones: lifetime and tiered. Progress comes from what she already has (the
// Almanac counts, photos taken): nothing extra to track. `claimed` = tiers claimed.
export const MILESTONES = [
  { id: 'angler',   icon: 'fish',    name: 'Angler',          goal: 'Catch {n} fish',                 desc: 'Fish caught',               source: 'fishCaught',   tiers: [1, 10, 50, 100], claimed: 1, rewards: ['Cork float', 'Willow creel', 'Fish-scale frame', 'Golden hook'] },
  { id: 'gatherer', icon: 'flower',  name: 'Flower gatherer', goal: 'Pick {n} flowers',               desc: 'Flowers picked',            source: 'flowersPicked', tiers: [1, 10, 50, 100], claimed: 1, rewards: ['Flower press', 'Garland', 'Pressed-flower frame', 'Everlasting posy'] },
  { id: 'almanac',  icon: 'book',    name: 'Almanac keeper',  goal: 'Fill {n} pages of her Almanac',  desc: 'Entries in her Almanac',    source: 'almanacKnown', tiers: [5, 10, 25, 50],  claimed: 0, rewards: ['Bookmark', 'Ribbon', 'Gilded edges', 'A second volume'] },
  { id: 'photo',    icon: 'image',   name: 'Photographer',    goal: 'Take {n} photos',                desc: 'Photos taken',              source: 'photosTaken',  tiers: [1, 5, 20, 50],   claimed: 0, rewards: ['Postcard frame', 'Old photo filter', 'A spare lens cap', 'Tripod'] },
  { id: 'charmer',  icon: 'moon',    name: 'Charmer',         goal: 'Charm {n} familiars',            desc: 'Familiars charmed',         source: 'charmed',      tiers: [1, 3, 5],        claimed: 0, rewards: ['Collar bell', 'Tiny scarf', 'Familiar portrait'] },
];

// Photos she has kept (the album), taken with her starting kit. New ones come from photo mode.
export const PHOTOS = [
  { id: 'p1', view: 'viewfinder', filter: 'none',  frame: 'polaroid', caption: 'Crystal Coast · midday' },
  { id: 'p2', view: 'selfie',     filter: 'film',  frame: 'polaroid', caption: 'Silverwood · morning' },
  { id: 'p3', view: 'viewfinder', filter: 'film',  frame: 'polaroid', caption: 'The sea from the meadow' },
];

// --- The camera kit (user, 2026-09-29): gathered over play -------------------------
// She starts with a basic camera; filters and frames are found, brewed, or given as
// Keepsake rewards, so a full kit builds up over the game. Photo mode only offers
// what she owns. `how` says where a missing piece comes from (the hint shown).
// A reward whose name matches `reward` adds the piece when it's claimed.
//
// Cameras and lenses (user, 2026-10-01): each unlocks from a photo that plays on its
// maker's reputation (cameras) or on what it's for (lenses). `how: 'photo'` = take
// that photo, with any camera. Detecting "the moon" or "a bird in flight" is the
// game's job (PROPOSED: a tag on what's in frame); here they're hints only.
export const KIT = [
  { kind: 'body',   id: 'box',       how: 'start' },
  { kind: 'body',   id: 'icale',     how: 'photo',  hint: 'Street photography: folk going about the town' },
  { kind: 'body',   id: 'blassi',    how: 'photo',  hint: 'Photograph the moon' },
  { kind: 'body',   id: 'onnik',     how: 'photo',  hint: 'A photo taken under water' },
  { kind: 'body',   id: 'aconn',     how: 'photo',  hint: 'A bird in flight, or a creature mid-leap' },
  { kind: 'body',   id: 'nyso',      how: 'photo',  hint: 'A photo under the stars, or in a storm' },
  { kind: 'lens',   id: 'std',       how: 'start' },
  { kind: 'lens',   id: 'wide',      how: 'photo',  hint: 'A vista, from somewhere high' },
  { kind: 'lens',   id: 'portrait',  how: 'photo',  hint: 'A portrait: a neighbour, or your familiar' },
  { kind: 'lens',   id: 'long',      how: 'photo',  hint: 'A shy creature, from a long way off' },
  { kind: 'lens',   id: 'macro',     how: 'photo',  hint: 'A moth or a flower, up close' },
  { kind: 'filter', id: 'none',      how: 'start' },
  { kind: 'filter', id: 'film',      how: 'start' },
  { kind: 'filter', id: 'old',       how: 'reward', reward: 'Old photo filter', hint: 'A Photographer milestone' },
  { kind: 'filter', id: 'dusk',      how: 'reward', reward: 'Dusk filter',      hint: 'A small task: a photo at sunset' },
  { kind: 'filter', id: 'ink',       how: 'recipe', hint: 'Brew Night ink (Recipes › Potions)' },
  { kind: 'filter', id: 'storybook', how: 'found',  hint: 'A painted lens, lost somewhere in the Hagstones' },
  { kind: 'frame',  id: 'none',      how: 'start' },
  { kind: 'frame',  id: 'polaroid',  how: 'start' },
  { kind: 'frame',  id: 'postcard',  how: 'reward', reward: 'Postcard frame',       hint: 'A Photographer milestone' },
  { kind: 'frame',  id: 'pressed',   how: 'reward', reward: 'Pressed-flower frame', hint: 'A small task, or the Flower gatherer milestone' },
];

export const witch = createViewModel('witch', {
  name: 'Wren',                    // PROPOSED: the witch has no name in the docs
  satchel: SATCHEL,
  loadout: ['wisp', 'kindle', 'still', 'wind', null],   // 4–6 quick slots; 5 shown
  knownSpells: SPELLS.map((s) => s.id),
  fish: FISH,
  flowers: FLOWERS,
  creatures: CREATURES,
  tasks: TASKS,
  milestones: MILESTONES,
  photos: PHOTOS,
  kit: KIT.filter((k) => k.how === 'start').map((k) => `${k.kind}:${k.id}`),   // owned pieces
});
