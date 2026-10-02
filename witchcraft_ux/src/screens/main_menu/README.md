# Main menu (grey-box)

**Serves:** `flow.md` M1.

- Continue / New game go straight into the world. Settings and Quit open their screens.
- The background stands in for a **live 3D menu scene**: an in-engine screenshot pushing in slowly.
- **Variant `menubg`:** golden cliff · night · golden path.
- **Tagline** (user, 2026-09-29): "Every witch needs a home" (from `story.md`), no full stop, centred under
  "Witchcraft" and tight to it so it reads as its sub-heading. Italic is right; 16px, a step below body. The title block shrinks to the title's width.

## Open
- Title treatment (the logo is a placeholder in the display font).
- What Continue shows: a hover card with the last place, time of day, days played is sketched as a tooltip.
- Does the menu scene follow the real clock/weather of your save (the world you left)?

## Port notes
- The background is a 3D level behind the UMG menu, not UI. The vignette is a UI material or post-process.
- `ts-world` text uses a blurred shadow: a material, or two offset shadows.
