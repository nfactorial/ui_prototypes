# Scanning derelicts — a plan to argue with

⚠️ **Mostly draft.** Claude's proposal (2026-09-28) for the user to accept, change or bin, with the user's
decisions recorded below as they're made. Anything settled should also go back to the game's design
docs, since scanning is gameplay, not just UI.

## Decided (user, 2026-09-28)

| # | Decision |
|---|---|
| S1 | **Different scanner types can be equipped on a ship.** Scanning is a set of scans, not one button |
| S2 | **A passive scan is always active**, likely ship detection. **Other scans are activated by the player**, e.g. *"Scan for life signatures"* |
| S3 | **Scans can be falsified** |
| S4 | **More involved scans should exist as an option**: not required, but beneficial to a player who uses them. Not designed yet |
| S5 | **Reference: Star Trek**, for inspiration, not a copy |

## What Star Trek offers (Claude's reading, to check)

- **Scans are named, chosen actions**: "scan for life signs", "scan for power signatures", "sweep the
  hull". This matches S2: a menu of scan types, each from an equipped scanner.
- **Results are statements, often with confidence**: *"one life sign, faint, aft section"*. More human
  than a table of numbers, and it fits the welcoming direction (`direction.md`).
- 🔴 **Sensors fail at the interesting moment**: interference, shielding, *"readings are inconsistent"*,
  a life sign that flickers and vanishes. This is what lets a **life-sign scan** (S2) coexist with pillars
  §2's not-knowing: the scan gives you *evidence*, not the answer. A life sign doesn't say whether it's a
  survivor, and a clean scan doesn't mean the ship is empty.
- **Results are placed on a schematic of the ship**: a deck plan showing where the life sign is, where
  the breach is, where power still runs. A strong UI candidate: it turns scans into *planning* (where to
  send the drone, where to dock, whether to go in alone) rather than trivia.
- **Falsified readings (S3) become detectable discrepancies**: the transponder says one registry, the
  hull profile says another. The UI needs a way to show *readings disagree*, and that disagreement is a clue.

## What the game docs already say

- The loop is **search → scan → dock → optional drone survey → board** (`the_player.md`).
- The scanner is a **ship module in a hardpoint**, one of the two modules the flight demonstration still
  needs (`ship.md`, `ship_prd.md`: *"one weapon + one scanner"*). So better scanners are a Ship-loadout
  choice (F6).
- **The hunt is the gameplay** (pillars §5): *"sensors, reading a system, working out where something
  would have drifted to."* Scanning is part of the hunt, not a button that ends it.
- Drones carry **their own scanners** (`drone.md`), and buy *"information, not salvage"* (`nullpoint.md` B1).
- 🔴 **The rating must not predict what's aboard** (`nullpoint.md` A1.0d). *"A ship at 7 can be full of
  something; a ship at 2 can be empty."*
- 🔴 **Not knowing which register you've walked into is the tension engine** (pillars §2), and the
  alone-vs-squad choice is made *before* you know (pillars §6).

## The proposal in one line

**Scanning tells you about the ship, never about what's in it.** The outside scan gives you the ship's
*story* (who, where from, how it died, what it's worth). The drone gives you glimpses *inside*. Only
boarding gives you the truth. Each step answers some questions and leaves the scariest one open.

## Stages

| Stage | When | What you learn | UI |
|---|---|---|---|
| **1. Detect** | Long range, passive, part of searching | *Something is there*: a signal, a heat trace, a transponder ping. Vague direction/distance | A contact on the HUD, deliberately fuzzy (search area, not a point?) |
| **2. Identify** | Closer, active, you point the scanner at it | What it is: hull class, size, registry, **the three numbers** (certified / filed / found at) | Hold-to-scan on the marker, a progress ring, then a compact result card on the HUD |
| **3. Survey** | Close, takes time, maybe needs a better scanner | Condition: power, atmosphere, breaches, working airlock, salvage estimate, anomalies | A fuller record, stored in the computer's Records |
| *(Drone)* | Docked, from the drone console | Inside, partially: what the drone can see and reach before it's jammed or lost | Drone HUD |

## What a scan should and shouldn't reveal

⚠️ Written before S2. Life signs are now a scan, so they belong in the middle column: real evidence,
never certainty.

| ✅ Reveal (the ship's story) | ⚠️ Ambiguous on purpose | ❌ Never |
|---|---|---|
| Registry, class, operator | **Life signs** (S2): count, location and strength, with honest uncertainty | "Hostiles aboard: 3" |
| | **Heat / power anomalies**: could be a survivor, a reactor, or something worse | |
| The three numbers (forensic, A1.0c) | **Signal fragments**: a looping distress call, a partial log | A threat or difficulty level |
| Hull breaches, atmosphere, power | **"Readings inconsistent"**: the scan itself doesn't add up | Whether it's "safe" |
| Salvage value estimate | | |
| Airlock / docking status | | |

The middle column is where the dread lives: facts that *invite* a guess without answering it.

## UI questions this raises

- **Scanning happens in real time, in the flight HUD.** The computer pauses the world (F8), so the act of
  scanning belongs to flight, not the computer. The computer is where you *read* results afterwards. Agree?
- **The result card.** A compact card on the HUD when a scan completes, with the full record in the
  computer. Our existing wreck survey screen could become that full record.
- **Records** as a computer section: every ship you've scanned, the three numbers, notes. It could also
  be where missions *point*: a mission is a lead that says "find this registry".
- **Scanner quality in the Ship loadout:** range, speed, which fields it can read. A cheap scanner
  leaves more of the record as "—".

- **Choosing a scan in flight.** Scans are player-activated (S2) and happen in real time. A radial or quick
  menu on the flight HUD? A hotkey per scan type? The computer is out, since it pauses the world (F8).
- **The derelict schematic.** Where do scan results live: on the HUD card, a schematic in the computer's
  Records, or both?
- **"Readings disagree"** (S3): how a falsified or conflicting reading looks, without shouting "fraud".

## Design questions (not UI, but UI depends on them)

1. ~~Passive or triggered detection?~~ Both: passive ship detection plus player-activated scan types (S2).
2. ~~Can a scan be falsified?~~ Yes (S3). Open: what can be faked (transponder, registry, the three numbers,
   life signs?) and how the player catches it.
3. Does scanning **cost** anything: time, exposure, attention from whatever's out there? (Scanner details
   are not figured out yet: S4.)
4. Life signs exist as a scan (S2). Open: how uncertain are they? The Star Trek reading above suggests
   *always* somewhat uncertain, so the scan informs the alone-vs-squad choice without settling it.
5. What do the optional **involved scans** (S4) look like? Longer scans for more detail? A calibration or
   tuning interaction? Scans from specific positions around the hull?
