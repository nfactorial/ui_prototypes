// Dev server: static files + live reload over Server-Sent Events. No dependencies.
//   node tools/serve.mjs            → http://localhost:5320
//   PORT=9000 node tools/serve.mjs
//
// Listens on BOTH 127.0.0.1 and ::1, so "localhost" reaches it whichever way the
// browser resolves it. (On this machine 8080 is taken by Docker, and WSL relays
// [::1]:8080, so "localhost:8080" silently reached the wrong server.)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 5320;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff2': 'font/woff2',
};

// --- live reload ------------------------------------------------------------
const clients = new Set();
let pending = new Set();
let timer = null;

fs.watch(ROOT, { recursive: true }, (_event, file) => {
  if (!file) return;
  const rel = file.split(path.sep).join('/');
  if (rel.startsWith('.') || rel.includes('/.') || rel.startsWith('tools/')) return;
  pending.add(rel);
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const f of pending) for (const res of clients) res.write(`data: ${f}\n\n`);
    pending = new Set();
  }, 60);
});

// --- server -----------------------------------------------------------------
function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(ROOT, '.' + rel);
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end(`404 ${rel}`);
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}

// One server per loopback address. Fail loudly if the port is taken: a silent
// fallback is how you end up looking at someone else's server.
let listening = 0;
for (const host of ['127.0.0.1', '::1']) {
  const server = http.createServer(handler);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`✗ Port ${PORT} is already in use on ${host}. Something else is serving there.`);
      console.error(`  Try another: PORT=5330 node tools/serve.mjs`);
      process.exit(1);
    }
    if (err.code === 'EADDRNOTAVAIL' && host === '::1') return; // no IPv6 loopback: fine
    throw err;
  });
  server.listen(PORT, host, () => {
    if (++listening === 1) console.log(`Witchcraft UX → http://localhost:${PORT}  (live reload on)`);
  });
}
