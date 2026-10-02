# UI prototypes

Browser prototypes ("UI benches") of game UIs. Each one runs from its own folder with one command:

| Prototype | Run, from its folder | Open |
|---|---|---|
| `nullpoint_ux/`: *Null Point* | `node tools/serve.mjs` | http://localhost:5310 |
| `witchcraft_ux/`: *A Little Witchcraft* | `node tools/serve.mjs` | http://localhost:5320 |

They need Node and nothing else. Each has its own port, so both can run at once.
`UI_BENCH.md` is the shared method behind them.
