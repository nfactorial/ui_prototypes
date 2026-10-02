// Conversations (speculative: no dialogue content exists). villagers.md: 10–20
// villagers, each with one friendliness value that "must never change what the
// player can do", so no friendship meter is shown. *word* = a highlighted word.
// A node: { lines: [...], choices?: [{ text, next }] }. next: null = goodbye.

export const SPEAKERS = {
  Hazel: { color: '#d98a4e', voice: { base: 520, wave: 'triangle' } },
  Wren:  { color: '#7a6aa8', voice: { base: 640, wave: 'sine' } },       // the witch (replies aren't voiced here)
  Bramble: { color: '#6f9a4a', voice: { base: 300, wave: 'square' } },   // a grumpy familiar, some day
};

export const TALKS = {
  Hazel: {
    start: {
      lines: [
        "Oh! Hello there. You're the *new witch*, aren't you?",
        'I saw your little light bobbing about the woods last night. Gave me quite the fright!',
        'Say... have you been down to *Mirrormere* yet?',
      ],
      choices: [
        { text: 'Tell me about Mirrormere', next: 'mirrormere' },
        { text: 'What was that about my light?', next: 'light' },
        { text: 'I should get going', next: 'bye' },
      ],
    },
    mirrormere: {
      lines: [
        "It's the still lake past the birches. The *pike* bite at dusk, or so my uncle claims.",
        "He's never caught one himself, mind you. Not once in forty years!",
      ],
      choices: [
        { text: 'What was that about my light?', next: 'light' },
        { text: "I'll take a look", next: 'bye' },
      ],
    },
    light: {
      lines: [
        'A little glowing thing, floating along all by itself! I thought it was a *will-o\'-the-wisp*.',
        'Oh. It WAS a will-o\'-the-wisp? Well! You learn something new.',
      ],
      choices: [
        { text: 'Tell me about Mirrormere', next: 'mirrormere' },
        { text: 'See you around, Hazel', next: 'bye' },
      ],
    },
    bye: {
      lines: ['Mind how you go! And do come by for tea sometime.'],
    },
  },
};
