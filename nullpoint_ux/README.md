# NullPoint UX

Browser prototype of *Null Point*'s UI.

## Run it

```sh
node tools/serve.mjs
```

Run it from this folder, then open **http://localhost:5310**. It needs Node and nothing else: no install
and no build. Edits reload the page live. Stop it with Ctrl+C.

- Pick a screen from the **Scene** dropdown, or use `[` / `]` to step through them.
- Use another port with `PORT=9000 node tools/serve.mjs` in bash, or `$env:PORT=9000; node tools/serve.mjs`
  in PowerShell.
- `node tools/bake.mjs` re-bakes the tessera textures. Needs python and tessera. Rarely needed.

## More

- `CLAUDE.md`: how the prototype works, and the harness's keyboard shortcuts
- `documents/handoff/`: the specs the Unreal work builds from
