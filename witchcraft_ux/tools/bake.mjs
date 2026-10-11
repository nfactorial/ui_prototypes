// Bake tessera documents into assets/tessera/.
//   node tools/bake.mjs                 → every tessera/*.toml
//   node tools/bake.mjs panel_grime     → just that one
//   node tools/bake.mjs panel_grime --samples 1   (extra args pass through to tessera)
// Needs tessera importable by `python` (E:\dev\terrain\tessera, installed with pip -e).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const SRC = path.join(ROOT, 'tessera');
const OUT = path.join(ROOT, 'assets', 'tessera');

const args = process.argv.slice(2);
const names = args.filter((a) => !a.startsWith('-') && !/^\d+$/.test(a));
const passthrough = args.filter((a) => !names.includes(a));

const docs = names.length
  ? names.map((n) => path.join(SRC, n.endsWith('.toml') ? n : `${n}.toml`))
  : fs.readdirSync(SRC).filter((f) => f.endsWith('.toml')).map((f) => path.join(SRC, f));

fs.mkdirSync(OUT, { recursive: true });
let failed = 0;
for (const doc of docs) {
  const r = spawnSync('python', ['-m', 'tessera', 'bake', doc, '--out', OUT, ...passthrough], { stdio: 'inherit' });
  if (r.status !== 0) { failed++; console.error(`✗ ${path.basename(doc)}`); }
}
process.exit(failed ? 1 : 0);
