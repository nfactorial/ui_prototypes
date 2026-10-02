# Witchcraft UX

Browser prototype of *A Little Witchcraft*'s UI.

## Run it

```sh
node tools/serve.mjs
```

Run it from this folder, then open **http://localhost:5320**. It needs Node and nothing else: no install
and no build. Edits reload the page live. Stop it with Ctrl+C.

- Use another port with `PORT=9000 node tools/serve.mjs` in bash, or `$env:PORT=9000; node tools/serve.mjs`
  in PowerShell.
- `python tools/colours.py` prints the style's colours as UMG/Slate-ready tables.

## More

- `CLAUDE.md`: how the prototype works
- `../UI_BENCH.md`: the shared method behind both prototypes
