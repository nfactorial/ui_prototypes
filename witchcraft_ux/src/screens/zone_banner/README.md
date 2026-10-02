# Zone banner

**Serves:** the game's built banner (`WBP_ZoneBanner`, `UZoneBannerComponent`, `zones_prd` §Name banner).
The rules are the game's and are kept exactly: **silent on spawn**, **unnamed zone = nothing**, **a new
zone while showing restarts it**. The look is the open part.

- Fade in / hold / fade out as one animation (~4.4 s), with an ornament rule growing out from the centre.
- **Variant `banner`**: the name alone, or with the map's name above it (themed maps joined by portals,
  `world/structure.md`; "The Greenmarch" is one candidate map name).
- In the flow, **Z** walks into the next zone (one of them is unnamed, to show the silence).

## Open
- Position: upper third (here) or lower? Size? Does it pair with the entry sound (`DefaultEntrySound`)?

## Port notes
- The C++ widget only carries the name (`ZoneNameText`, `OnZoneRevealed(FText)`); everything here is
  the WBP's animation, so it ports as a UMG widget animation.
