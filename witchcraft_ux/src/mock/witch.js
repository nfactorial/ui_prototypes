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

// 🔴 Detail strings (`desc`) are FLAVOUR, for everything: what a thing looks like, its
// character. Never what it does, how well, or a number (user, 2026-10-09: D32).
// `learnings` (user's term, 2026-10-09; not designed yet, never shown): what she might come
// to know about a thing over time ("Only bites after dark", "Your wisp burns green for a
// while"). Kept with the thing so they aren't lost; whether and how she learns them is open.

export const ITEMS = {
  'Item.Stick.Birch':    { name: 'Birch sticks',     icon: 'stick',    affinity: 'white',  desc: 'Pale, papery bark that peels away in curls.', learnings: ['They catch easily.'] },
  'Item.Stick.Hazel':    { name: 'Hazel sticks',     icon: 'stick',    affinity: 'green',  desc: 'Straight and supple, with smooth brown bark.', learnings: ['Good for a fire, better for a wand.'] },
  'Item.Feather.Heron':  { name: 'Heron feather',    icon: 'feather',  affinity: 'blue',   desc: 'Long and grey, from the lake shore.' },
  'Item.Feather.Crow':   { name: 'Crow feather',     icon: 'feather',  affinity: 'black',  desc: 'Found on Hallow Ridge. It shines blue in the sun.' },
  'Item.Mushroom.Cap':   { name: 'Ink cap',          icon: 'mushroom', affinity: 'black',  desc: 'It dissolves into ink if you leave it.' },
  'Item.Flower.Gorse':   { name: 'Gorse flowers',    icon: 'flower',   affinity: 'yellow', desc: 'Smells of coconut. Prickly to pick.' },
  'Item.Flower.Thrift':  { name: 'Sea thrift',       icon: 'flower',   affinity: 'red',    desc: 'Pink cushions on the cliff edge.' },
  'Item.Stone.Hag':      { name: 'Hag stone',        icon: 'stone',    affinity: 'void',   desc: 'A pebble with a hole worn clean through. Look through it.' },
  'Item.Berry.Rowan':    { name: 'Rowan berries',    icon: 'berry',    affinity: 'red',    desc: 'Bitter raw. Birds love them.' },
  'Item.Bottle.Dew':     { name: 'Bottled dew',      icon: 'bottle',   affinity: 'white',  desc: 'Collected before sunrise, the way it has to be.' },
  'Item.Fish.Perch':     { name: 'Perch',            icon: 'fish',     affinity: 'green',  desc: 'Striped and cross-looking.' },
  'Item.Fish.Moonfish':  { name: 'Moonfish',         icon: 'fish',     affinity: 'white',  desc: 'Pale and round, with a sheen like moonlight.', learnings: ['Only bites after dark.'] },
  // Bait: made from Recipes › Bait, kept in the satchel (user, 2026-10-09: D31). Which one
  // goes on the hook is chosen on Tools › Fishing.
  'Item.Bait.Rowan':     { name: 'Rowan dough',      icon: 'berry',    affinity: 'red',    desc: 'Squashed rowan berries in a ball of dough.', bait: true },
  'Item.Bait.Inkcap':    { name: 'Ink-cap paste',    icon: 'mushroom', affinity: 'black',  desc: 'Dark and oily. It smells of the bog.', bait: true },
};

// The satchel: one container, 8 × 3. null = empty slot. No tools: she keeps those in
// her collection (user, 2026-10-09: D25), so they never take a slot.
const SATCHEL = [
  ['Item.Stick.Birch', 7], ['Item.Stick.Hazel', 3], ['Item.Feather.Heron', 1], ['Item.Feather.Crow', 2],
  ['Item.Mushroom.Cap', 4], ['Item.Flower.Gorse', 12], ['Item.Flower.Thrift', 5], ['Item.Stone.Hag', 1],
  ['Item.Berry.Rowan', 9], ['Item.Bottle.Dew', 2], ['Item.Fish.Perch', 1], ['Item.Bait.Rowan', 6],
  null, null, null, null, null, null, null, null, null, null, null, null,
].map((s) => (s ? { item: s[0], count: s[1] } : null));

// Spells. The only built one is the wisp; the rest are placeholders for layout.
// cost: free | reagent | ritual (documents/todo/spell-grammar-and-loadout.md)
// `desc` is flavour (D32); what a spell does is a learning.
export const SPELLS = [
  { id: 'wisp',   name: "Will-o'-wisp",       icon: 'wisp',    affinity: 'white',  cost: 'free',    built: true,
    desc: 'A small, curious light, like a lantern with a mind of its own.',
    learnings: ['Conjure a small light that follows you. Cast again to call it home.'] },
  { id: 'kindle', name: 'Kindle',             icon: 'flame',   affinity: 'red',    cost: 'reagent', reagent: 'Birch sticks',
    desc: 'An old word for a spark, whispered to dry wood.',
    learnings: ['Coax a flame from dry wood.'] },
  { id: 'still',  name: 'Still the Water',    icon: 'water',   affinity: 'blue',   cost: 'free',
    desc: 'A hush laid on the water, like a hand on a cat\'s back.',
    learnings: ['Flatten a pond long enough to see what lives in it.'] },
  { id: 'wind',   name: 'Call of the Gorse',  icon: 'flower',  affinity: 'yellow', cost: 'reagent', reagent: 'Gorse flowers',
    desc: 'Smells of coconut and summer, and of somewhere else.',
    learnings: ['Scatter petals on the wind, and follow where they go.'] },
  { id: 'ring',   name: 'The Walked Ring',    icon: 'circle',  affinity: 'green',  cost: 'ritual',
    desc: 'Older than the village, and older than the hedges.',
    learnings: ['Walk a circle in the grass at dusk. Something answers.'] },
  { id: 'mend',   name: 'Mend',               icon: 'sparkle', affinity: 'void',   cost: 'free',
    desc: 'Warm thread and a patient word.',
    learnings: ['Put a broken thing back the way it was.'] },
  { id: 'hush',   name: 'Hush',               icon: 'moon',    affinity: 'black',  cost: 'free',
    desc: 'As quiet as snow falling on snow.',
    learnings: ['Every creature nearby forgets you were ever here.'] },
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
    { id: 'warming', name: 'Warming draught', station: 'Cauldron', learnt: true, desc: 'Thick and golden, and it smells of gorse.', learnings: ['For cold hands and long nights out.'],
      ingredients: [{ kind: 'flower', tag: 'Flower.Gorse' }, { kind: 'item', tag: 'Item.Berry.Rowan' }, { kind: 'item', tag: 'Item.Bottle.Dew' }] },
    { id: 'night-ink', name: 'Night ink', station: 'Cauldron', learnt: true, desc: "Black as a crow's wing, with a faint blue shine.", learnings: ['Writes words that only show by moonlight.'],
      ingredients: [{ kind: 'item', tag: 'Item.Mushroom.Cap' }, { kind: 'item', tag: 'Item.Feather.Crow' }] },
    { id: 'marsh-light', name: 'Marsh-light tonic', station: 'Cauldron', learnt: true, desc: 'Murky green, and it glows a little in the dark.', learnings: ['Your wisp burns green for a while.'],
      ingredients: [{ kind: 'flower', tag: 'Flower.Asphodel' }, { kind: 'item', tag: 'Item.Bottle.Dew' }] },
    { id: 'unknown-brew', name: 'A brew from the Hagstones', station: 'Cauldron', learnt: false },
  ],
  // Bait (user, 2026-10-09: D31): a recipe like any other; what she makes goes in the satchel.
  // `makes` = the satchel item. Brewed from what she forages (fishing.md), so the cauldron.
  bait: [
    { id: 'rowan-dough', name: 'Rowan dough', station: 'Cauldron', learnt: true, makes: 'Item.Bait.Rowan', desc: 'Sticky and sweet, and it stains her fingers red.', learnings: ["Roach and perch can't leave it alone."],
      ingredients: [{ kind: 'item', tag: 'Item.Berry.Rowan' }, { kind: 'item', tag: 'Item.Bottle.Dew' }] },
    { id: 'inkcap-paste', name: 'Ink-cap paste', station: 'Cauldron', learnt: true, makes: 'Item.Bait.Inkcap', desc: 'Black and glossy, and best made outdoors.', learnings: ['Eels, they say. Nobody says why.'],
      ingredients: [{ kind: 'item', tag: 'Item.Mushroom.Cap' }, { kind: 'fish', tag: 'Fish.Perch' }] },
    { id: 'moon-bait', name: 'Something the Moonfish like', station: 'Cauldron', learnt: false },
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
  { kind: 'body',   id: 'expanse',   how: 'photo',  hint: 'A whole horizon: the sea at sunset, end to end' },
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

// The camera as she carries it, set up on Tools › Camera. One camera and one lens.
// Filters and frames: she ENABLES several there and switches between those in the
// viewfinder (user, 2026-10-08: D26); `filter` / `frame` are the ones on right now.
// PROPOSED game data: the camera tool's setup, saved with her.
export const CAMERA_DEFAULT = { body: 'box', lens: 'std', filter: 'none', frame: 'none', filters: ['none', 'film'], frames: ['none', 'polaroid'] };

// --- Her tools (user, 2026-10-08/09: D25, D28, D30) ----------------------------------
// 🔴 Things she KEEPS live in her collection, not the satchel: a page per kind in the
// book's Tools tab. On a page she makes one of each part active; the active MAIN piece
// (a broom, a rod, a camera) is the one on the tool wheel and in her hands. Only what
// she owns is ever listed: the kinds she hasn't met stay unknown (a leaning, 2026-10-09).
// Different, not better: a rod's strength is internal and never shown (D29); the name
// carries it. One page design serves every kind: the kind is data (its parts), as below.
//
//   angle   the kind's fixed place on the wheel, clockwise from the top (the game's
//           tool_wheel_prd: broom 0°, rod 60°, camera 120°; Hands free 180°)
//   on      what a chosen part's card says ("On the rod"); the main piece says "On the wheel"
//   parts   the sections of its page. [0] is the main piece. `many`: she enables
//           several (switched in use); `optional`: a "none" card; `from: 'satchel'`:
//           the pieces are satchel items (bait), only chosen here
// The camera's pieces are its kit (KIT above, photo.js); the rest are TOOLS below.
export const TOOL_KINDS = [
  { id: 'broom', label: 'Broom', icon: 'broom', angle: 0, on: 'On the broom', parts: [
    { part: 'broom',   label: 'Brooms',   noun: 'broom' },
    { part: 'trinket', label: 'Trinkets', noun: 'trinket', optional: 'No trinket' },
  ] },
  { id: 'fishing', label: 'Fishing', icon: 'rod', angle: 60, on: 'On the rod', parts: [
    { part: 'rod',  label: 'Rods',  noun: 'fishing rod' },
    { part: 'line', label: 'Lines', noun: 'line' },
    { part: 'bait', label: 'Bait',  noun: 'bait', optional: 'No bait', from: 'satchel' },
  ] },
  { id: 'camera', label: 'Camera', icon: 'camera', angle: 120, on: 'On the camera', parts: [
    { part: 'body',   label: 'Cameras', noun: 'camera' },
    { part: 'lens',   label: 'Lenses',  noun: 'lens' },
    { part: 'filter', label: 'Filters', noun: 'filter', many: true },
    { part: 'frame',  label: 'Frames',  noun: 'frame', many: true },
  ] },
];
export const toolKind = (id) => TOOL_KINDS.find((k) => k.id === id);

// The NAME says what it is ("Waverly's Ocean Fishing Rod": a rod's strength is only ever
// hinted at by its name, D29). The flavour line DESCRIBES it, what it looks like ("Ornately
// decorated with iridescent abalone shell", user, 2026-10-09): never a capability, never
// how well it does anything. Brooms are known by their name and how they fly
// (broom_flight_design.md); lines are "a look before anything else" (fishing.md).
export const TOOLS = {
  'broom:old-faithful': { part: 'broom', name: 'Old Faithful', icon: 'broom', meta: 'Her first broom', desc: 'A hazel handle and a bundle of birch twigs, bound with green twine.', learnings: ['Pulls a little to the left.'] },
  'broom:silverwood':   { part: 'broom', name: 'Silverwood',   icon: 'broom', desc: 'Pale bristles on a silver birch handle, worn smooth by someone else first.' },
  'trinket:bell':       { part: 'trinket', name: 'Bell on a ribbon', icon: 'circle', desc: 'A small brass bell on a faded red ribbon.', learnings: ['It rings when she banks.'] },
  'trinket:tassel':     { part: 'trinket', name: 'Rowan tassel',     icon: 'berry',  desc: 'Red rowan berries threaded on a waxed cord.' },
  'rod:willow':         { part: 'rod', name: 'Willow rod', icon: 'rod', meta: 'Her first rod', desc: 'Pale willow, whittled smooth, with the bark left on at the grip.' },
  'rod:waverly':        { part: 'rod', name: "Waverly's Ocean Fishing Rod", icon: 'rod', desc: 'Ornately decorated with iridescent abalone shell.' },
  'line:plain':         { part: 'line', name: 'Plain line',     icon: 'water', meta: 'Came with the rod', desc: 'Ordinary brown twine.' },
  'line:silk':          { part: 'line', name: 'Spider silk',    icon: 'water', desc: 'A thread of spider silk, caught silver at dawn.' },
  'line:moon':          { part: 'line', name: 'Moonlight line', icon: 'moon',  desc: 'Spun from moonlight, with a faint glow after dark.' },
};
// What she starts with, and what's on.
export const TOOLS_START = ['broom:old-faithful', 'trinket:bell', 'rod:willow', 'line:plain'];
export const ACTIVE_START = { broom: 'broom:old-faithful', trinket: null, rod: 'rod:willow', line: 'line:plain', bait: 'Item.Bait.Rowan' };
// Bench demo (J in the world): the next thing she's given, in this order. The first of a
// kind is made active for her and announced (D28); later ones wait on their page.
export const GIFTS = ['broom:old-faithful', 'broom:silverwood', 'rod:waverly', 'line:silk', 'trinket:tassel', 'line:moon'];

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
  kit: KIT.filter((k) => k.how === 'start').map((k) => `${k.kind}:${k.id}`),   // owned camera pieces
  camera: CAMERA_DEFAULT,          // the camera's setup: chosen on Tools › Camera (D26, D30)
  tools: TOOLS_START,              // the rest of her collection (D25)
  active: ACTIVE_START,            // what's on, per part (the camera's is `camera`)
});

// --- Tool helpers: pure, no DOM (they port to C++) -------------------------------------
// Does she have a tool of this kind? `kit` is the camera pieces she owns (the harness can
// hand her the whole kit). A kind she has nothing of has no page and no wheel place.
export function hasKind(w, kindId, kit = w.get('kit')) {
  if (kindId === 'camera') return kit.some((k) => k.startsWith('body:'));
  const main = toolKind(kindId).parts[0].part;
  return w.get('tools').some((id) => TOOLS[id]?.part === main);
}
export const kindsOwned = (w, kit) => TOOL_KINDS.filter((k) => hasKind(w, k.id, kit));
// The active main piece of a kind, as the wheel and the HUD show it: { name, icon, desc }.
// `camera` turns a camera body id into { name, desc } (photo.js: bodyName, BODIES).
export function activeTool(w, kindId, camera = (id) => ({ name: id })) {
  if (!kindId || !hasKind(w, kindId)) return null;
  const k = toolKind(kindId);
  if (kindId === 'camera') return { ...camera(w.get('camera').body), icon: k.icon };
  const t = TOOLS[w.get('active')[k.parts[0].part]];
  return t ? { name: t.name, icon: t.icon, desc: t.desc } : null;
}
// How many of a satchel item she has.
export const satchelCount = (w, item) => w.get('satchel').reduce((n, s) => n + (s?.item === item ? s.count : 0), 0);
