// 🔴 Style sets: selectable looks for every grey-box screen (harness "Style"
// dropdown, Shift+S cycles). Each is one CSS file in styles/themes/ setting --th-*
// variables on #ui-root[data-style="<id>"]. See styles/themes/README.md.
// None is decided (documents/direction.md). To add one: copy a theme file, change its id, add a row.

export const styleSets = [
  { id: 'greybox',    title: 'Grey-box (neutral)',             file: null },
  { id: 'hedgewitch', title: 'Hedgewitch (folk-craft, dark)',  file: 'styles/themes/hedgewitch.css' },
  { id: 'parchment',  title: 'Parchment (light, storybook)',   file: 'styles/themes/parchment.css' },
  { id: 'moonlit',    title: 'Moonlit (indigo glass)',         file: 'styles/themes/moonlit.css' },
];
