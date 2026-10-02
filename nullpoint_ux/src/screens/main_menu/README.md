# Main menu (grey-box)

**Serves:** `flow.md` F1 (basic menu) and F10 (derelict background).

- Continue / New game go straight into the world (F2). Settings and Quit open their screens.
- The background stands in for a live 3D menu scene: two parallax star layers, the derelict slowly
  tumbling and drifting, and a rim of light sweeping over the hull now and then.
- **Variant `menubg`:** tumbling vs drifting without spin, or **flyby**.

## Flyby (`menubg = flyby`, exploration, 2026-10-02)

A Star-Trek-opening-style camera flight through a system, replaying on a loop (52 s). Beats: approach a
ringed gas giant against a nebula → skim low over the rings → pass a moon → swing wide and find the
derelict against the planet → hold on it (rim light sweeps the hull) → fade to black, replay.

- `flyby_sequence.js` is the sequence **as data**: the bodies, and keyed camera tracks (position, target,
  roll, FOV, fade, glint). Keys default to `auto` interp, a smooth cubic through the keys like Sequencer's
  Auto tangents. This is the part that carries over.
- `flyby_render.js` draws it with one WebGL fragment shader (ray-traced spheres + ring plane, procedural
  nebula and stars). It's a stand-in for the 3D level, but it doubles as a sketch of the material work.
- Debug: `npFlyby.hold(t)` freezes a frame, `npFlyby.hold(null)` resumes, `npFlyby.seek(t)` jumps.
- The menu stays up throughout. The hold is framed with the subject right of centre, clear of the menu.

Open: the beats and their pacing, the hold length, whether the menu waits for the sequence, whether to
add a phenomenon beat (storm, pulsar, a wreck graveyard), and frame cost (not yet measured).

## Port notes (flyby)
- A **menu level + Level Sequence** (CineCamera, keys from `flyby_sequence.js`), looping. Geometry is
  trivial (spheres, a ring disc, one ship); the cost is in **materials and lighting**:
  - gas giant: banded, domain-warped clouds, terminator warmth, limb haze → a custom material
  - **ring shadow on the planet and planet shadow on the rings**: analytic in the material, or real
    shadowing (rings are translucent: shadows from translucency need care)
  - rings: translucent disc with radial density bands; forward scattering when backlit
  - atmosphere halo at the limb: SkyAtmosphere doesn't do a planet seen from orbit at this scale; likely a
    custom shell material
  - nebula + stars: a skybox texture (baked, maybe from this shader) is the cheap answer
  - sun glare + anamorphic streak: post-process lens flare / bloom
- The derelict here is the old SVG on a camera-facing card; in Unreal it's the real mesh.

## Open
- The derelict itself: which ship, how close, how much light. The SVG is a placeholder silhouette.
- Title treatment, and what "Continue" shows (a save summary?).

## Port notes
- The background is a 3D level behind the UMG menu, not UI. The rim glint becomes real lighting.
- The vignette is a UI material (or part of the 3D scene's post-process).
