// 🔴 Style sets: selectable looks for every menu screen (harness "Style" dropdown,
// Shift+S cycles). Each is one CSS file in styles/themes/ setting --th-*
// variables on #ui-root[data-style="<id>"]. See styles/themes/README.md.
//
// To add an experimental style: copy a theme file, change its id, add a row here.

export const styleSets = [
  { id: 'greybox',  title: 'Grey-box (neutral)',          file: null },
  { id: 'nasapunk', title: 'NASA-punk (Starfield-ish)',   file: 'styles/themes/nasapunk.css' },
  { id: 'director', title: 'Director (Destiny-ish)',      file: 'styles/themes/director.css' },
  { id: 'frontier', title: 'Frontier (Firefly-ish)',      file: 'styles/themes/frontier.css' },
];
