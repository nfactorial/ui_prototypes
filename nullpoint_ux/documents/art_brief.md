# Art brief — prototype concept art

What artwork the UI prototype needs, the sizes and safe areas for each slot, the look to aim for, and
notes on the first pass. Written as input for the owner's AI story-sequence tool, but it works as a brief
for any artist.

⚠️ **Placeholder art for a prototype**, not final game art. The goal is for the prototype to *feel like the
real game*, so screens can be judged in context.

## Delivery

- **Folder:** `assets/art/`. Name by subject (`mission_meridian.jpg`, `menu_derelict.jpg`). Numbered
  variants are fine (`_01`, `_02`).
- **Format:** JPG (photographic/painted) or PNG (anything needing transparency). WebP also works.
- **Resolution:** at least **1920 px wide** for anything shown full-screen. The first pass (~1350×768) is
  visibly soft when stretched to 1920×1080. 2560+ wide is ideal for backdrops.
- **Credits:** add each file to `assets/art/CREDITS.md` (source, date, where it's used).

## Slots

| Slot | Where it appears | Aspect | Target size | Safe area / composition |
|---|---|---|---|---|
| **Mission image** | Computer → Missions, banner above the details | ~3.3:1 (cropped from 16:9 is fine) | 1920 × 580, or 16:9 with the subject in the middle band | The **middle horizontal band** survives the crop. Keep the subject there; top and bottom get cut |
| **Main menu background** | Behind the main menu (animated in the prototype; a live 3D scene in the game) | 16:9 | 2560 × 1440 | 🔴 **Left 40% stays dark and quiet**: the title and buttons sit there. Subject on the right third. A derelict in space (flow.md F10) |
| **Boarding backdrop** | Behind the boarding HUD | 16:9 | 1920 × 1080+ | Ideally **first person** (the HUD is first person). Keep the **centre** readable (crosshair) and the **bottom corners** darker (vitals, ammo) |
| **Flight backdrop** | Behind the flight HUD | 16:9 | 1920 × 1080+ | Third person, **ship from behind**, camera slightly above (the game's chase camera). Space and a planet; room for HUD panels in the corners |
| **Ship portrait** | Computer → Ship, with hardpoint pins over it | ~1:1 | 1200 × 1100 | Side or three-quarter view on a **plain dark background**, the whole hull in frame (pins are placed on it) |
| **Character / kit** | Computer → Loadout, centre panel | ~3:4 portrait | 900 × 1200 | Full figure, **neutral stance**, plain dark background, so kit changes could be shown later |
| **Record schematic** | Computer → Records | ~2:1 | 1400 × 700 | Optional: a technical side-plan of a derelict (blueprint-style), for placing scan readings on |

## The look

Observed from the first pass, and worth keeping (Claude's reading, to confirm):

- **The protagonist:** a woman with dark hair (a bun or braid), charcoal suit with **mustard/ochre shoulder
  and panel accents**, green-drab webbing and pouches, a helmet lamp. She recurs across images, which is
  what makes them read as one game. Keep her consistent.
- **Palette:** gunmetal and charcoal, ochre accents, **hazard stripes**, frost and ice, and **red emergency
  light** as the danger colour. Cold, dim, lived-in.
- **Materials:** riveted plate, pipes and cable trays, grating floors, chipped paint, rust, frost build-up.
  *"Grubby, lived-in frontier tech, not a navy"* (pillars §2).
- **Tone range** (pillars §2): Firefly (worn, human), Star Trek (curiosity), Alien (dread). The frozen,
  red-lit corridors are the Alien end, and they're the strongest images so far.

Reusable style keywords: *painted concept art, cinematic lighting, used-future industrial sci-fi, frost,
hazard stripes, helmet lamp, volumetric haze, muted palette with ochre accents, dramatic scale.*

## Making it epic

The first pass is atmospheric but *not epic enough* (owner's verdict). What epic usually comes from:

| Technique | In practice |
|---|---|
| **Scale contrast** | A tiny suited figure against a vast hull, hangar or planet. Scale needs a human reference to read |
| **Camera** | Low angles looking up; very wide shots; or extreme close-ups. Avoid eye-level mid-shots, which read as documentary |
| **Backlight and silhouette** | The sun behind a planet or hull, rim light carving out shapes, figures in silhouette against light |
| **Depth and atmosphere** | Volumetric light shafts, haze, particles, foreground elements framing the subject (a doorway, debris, a gantry) |
| **Negative space** | Big empty areas of dark space or fog. Emptiness *is* the Alien register, and it's also where the UI goes |
| **Story in the frame** | Something just happened or is about to: a breach, a flickering light, a body, a door ajar, a distress beacon |

## Subjects wanted

**Missions** (one image each; the current mock missions):
- **The Meridian Cartwright** (recovery contract): a bulk freighter adrift, lights dead, vast against a
  planet. Scale: our tiny ship approaching.
- **A voice on channel nine** (distress fragment): an unidentified wreck among asteroids, one blinking
  beacon, something wrong.
- **Prove the breach** (loss adjustment): cold and procedural, an inspector's view of a hull breach, or a
  recovered nav log in a gloved hand.
- **Chart the Tessel drift** (survey): a field of scattered derelict hulls, seen from a distance.

**Main menu:** a derelict freighter tumbling slowly, half in shadow, one edge catching sunlight, the left
side empty space.

**Your own ship** (*The Kestrel*, working name): a small, worn salvage ship (Firefly-scale, not a warship)
for the Ship page and flight backdrops.

## First pass (2026-09-28)

| File | Used for | Works | Could be better |
|---|---|---|---|
| `entry_01.jpg`: frozen corridor | Default boarding backdrop; mission *Tessel drift* | Frost, helmet-lamp beam, drifting particles, depth | Over-the-shoulder, not first person; subject centred |
| `entry_02.jpg`: red-lit corridor | Mission *Channel nine* | Strongest dread; red emergency light; framing | Back of head fills the frame; little space |
| `boarding_01.jpg`: at the bulkhead | Loadout figure | Clear character and kit | Mid-shot, flat; an AI signature artefact at bottom right |
| `boarding_02.jpg`: vault door | Mission *Prove the breach* | Clean composition, hazard stripes | Static; no story |
| `space_01.jpg`: freighter by a station | Mission *Meridian Cartwright* | Colour scheme matches the suit | Boxy, toy-like ship; no scale or atmosphere; lighting flat. The main candidate for "not epic" |
