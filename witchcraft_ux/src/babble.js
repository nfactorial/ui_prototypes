// A rough "animalese" stand-in: one short synthesised blip per typed character,
// so text speed can be judged against sound. The game will use recorded syllables
// (documents/content-creation/villager_voice_bank.md); this only mimics the rules
// in documents/design/characters/villagers.md:
//   • babble per typed character, driven by the dialogue widget
//   • rising / falling intonation (up towards a "?", down into a ".")
//   • a hard cap on babble length (the rest of a long line types silently)
// Web Audio, no library. A voice = { base: Hz, wave }.

let ctx = null;
const audio = () => (ctx ??= new AudioContext());

export const BABBLE_CAP = 40;   // syllables per line before it goes quiet

// Letters map to a small spread of pitches, so words have a shape.
const SPREAD = { a: 0, e: 3, i: 7, o: -2, u: -4, y: 5 };

export function blip(voice, ch, { progress = 0, ending = '.', volume = 0.06 } = {}) {
  if (!/[a-z0-9]/i.test(ch)) return;
  const ac = audio();
  if (ac.state === 'suspended') ac.resume();
  const semis = (SPREAD[ch.toLowerCase()] ?? ((ch.charCodeAt(0) % 5) - 2))
    + (ending === '?' ? progress * 6 : ending === '!' ? 2 : -progress * 3);   // intonation
  const freq = voice.base * 2 ** (semis / 12);
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = voice.wave ?? 'triangle';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.92, t + 0.06);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.08);
}
