# Combat lab (test bench)

Not a game screen. Drives the boarding HUD's shield/health so the vitals can be judged in action:
hits of different sizes, heal, kill, reset, auto-combat, the danger warning sound, and live tuning of the
recharge delay and danger threshold. The rules themselves live in `src/mock/vitals_model.js` (pure logic,
ports to the game's character component).
