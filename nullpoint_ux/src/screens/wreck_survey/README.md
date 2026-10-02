# Wreck survey (modal)

**Serves:** the derelict hunt in the flight demonstration. The content comes from the world:
`nullpoint.md` A1.0c (*"Hull certified to 6. Filed transit: 7. Found at 4."*) and A1.0e (insurance
voiding, the loss adjuster vs the salvor).

⚠️ **Speculative screen.** The game has no survey/scan flow yet, and the actions (strip, recover log, tow,
leave) are illustrative, not designed. It's here to show a **modal layer over the HUD**, and to try the
world's strongest bit of evidence as UI: *three numbers that tell a story with no dialogue.*

## Open questions

- Where does this record come from in the fiction? A scanner read, a beacon, a document found aboard?
- Is it a modal at all, or a panel the player can keep open while flying?
- 🔴 A1.0d: the numbers are forensic evidence, never a difficulty rating. Don't add "threat" to this card.

## Port notes

- Modal layer + input routing: CommonUI activatable widget on the modal layer (`ui/08`, `ui/16` §4).
- `s-uniformgrid` → `SUniformGridPanel` with slot padding in place of `gap`.
