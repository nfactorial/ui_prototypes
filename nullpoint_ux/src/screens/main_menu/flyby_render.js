// Renders the flyby (flyby_sequence.js) into a canvas with one WebGL fragment
// shader: ray-traced spheres and a ring plane, procedural nebula and stars.
// A stand-in for the 3D menu level, not ported as code. The shader is a sketch
// of the MATERIAL work the look needs in Unreal (see README port notes).

import { WORLD, SEQUENCE, evaluate } from './flyby_sequence.js';
import { clock } from '../../core/motion.js';

const RENDER_SCALE = 0.75; // render below UI resolution; the canvas is stretched

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec3 uCamPos, uCamF, uCamR, uCamU;
uniform float uTanHalf, uTime, uFade, uGlint, uDerAngle, uSunVis;
uniform vec3 uSun, uNeb;
uniform vec4 uPlanet;               // xyz centre, w radius
uniform vec3 uRingN; uniform vec2 uRingR;
uniform vec4 uMoon;
uniform vec3 uDer; uniform vec2 uDerSize;
uniform sampler2D uDerTex, uDerRim;
uniform vec3 uSunNdc;               // xy screen position, z = 1 if in front

float hash13(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash13(i), hash13(i + vec3(1,0,0)), f.x), mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x), mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }

float sphere(vec3 ro, vec3 rd, vec4 s) {
  vec3 oc = ro - s.xyz; float b = dot(oc, rd); float h = b * b - dot(oc, oc) + s.w * s.w;
  if (h < 0.0) return -1.0; float t = -b - sqrt(h); return t > 0.0 ? t : -1.0;
}

// --- sky -------------------------------------------------------------------------
vec3 stars(vec3 d) {
  vec3 col = vec3(0.0);
  for (int L = 0; L < 3; L++) {
    float sc = 90.0 + float(L) * 110.0;
    float px = sc * 2.0 * uTanHalf / uRes.y;          // one pixel, in cells
    vec3 p = d * sc, c = floor(p);
    float h = hash13(c + float(L) * 17.0);
    if (h > 0.94) {
      vec3 sp = c + vec3(hash13(c + 1.3), hash13(c + 2.7), hash13(c + 5.1));
      float dist = length(p - sp);
      float b = pow(hash13(c + 9.1), 10.0) * 8.0 + 0.06;
      vec3 tint = mix(vec3(1.0, 0.72, 0.5), vec3(0.6, 0.78, 1.0), hash13(c + 4.4));
      col += tint * b * exp(-dist * dist / (px * px * 0.8));
    }
  }
  return col;
}

vec3 nebula(vec3 d) {
  float k = dot(d, uNeb);
  float mask = smoothstep(0.25, 0.95, k);
  vec3 q = d * 2.2;
  float w = fbm(q + vec3(fbm(q * 1.7), fbm(q * 1.7 + 3.3), 0.0) * 1.6);
  float dens = pow(smoothstep(0.3, 0.85, w), 1.8) * mask * 1.6;
  vec3 c = mix(vec3(0.04, 0.22, 0.32), vec3(0.55, 0.16, 0.32), fbm(q * 0.7 + 5.0));
  c = mix(c, vec3(1.0, 0.55, 0.25), smoothstep(0.55, 0.8, w) * 0.7);
  float dust = smoothstep(0.42, 0.68, fbm(q * 3.0 + 11.0));
  return c * dens * (1.0 - dust * 0.75);
}

vec3 sky(vec3 d) {
  float sd = max(dot(d, uSun), 0.0);
  vec3 sun = vec3(1.0, 0.93, 0.82) * (smoothstep(0.99996, 0.99999, sd) * 30.0);
  float dim = 1.0 - smoothstep(0.9, 1.0, sd);         // the glare drowns the stars
  return nebula(d) + stars(d) * dim + sun;
}

// --- rings -----------------------------------------------------------------------
float ringDensity(float r) {
  float x = (r - uRingR.x) / (uRingR.y - uRingR.x);
  if (x < 0.0 || x > 1.0) return 0.0;
  float d = 0.6 + 0.25 * sin(x * 70.0) + 0.15 * sin(x * 193.0 + 1.0);
  d *= 0.55 + 0.45 * noise(vec3(x * 260.0, 0.5, 0.5));
  d *= smoothstep(0.0, 0.06, x) * smoothstep(1.0, 0.92, x);
  d *= 1.0 - 0.92 * smoothstep(0.6, 0.615, x) * smoothstep(0.68, 0.665, x);   // the big gap
  d *= mix(0.55, 1.0, smoothstep(0.2, 0.35, x));                              // fainter inner ring
  return clamp(d, 0.0, 1.0) * 0.85;
}
float ringPlaneT(vec3 ro, vec3 rd) {
  float den = dot(rd, uRingN);
  if (abs(den) < 1e-5) return -1.0;
  return dot(uPlanet.xyz - ro, uRingN) / den;
}

// --- bodies ----------------------------------------------------------------------
vec3 shadePlanet(vec3 p, vec3 rd) {
  vec3 n = normalize(p - uPlanet.xyz);
  float lat = dot(n, uRingN);
  float v = lat * 7.0 + (fbm(n * 3.5 + vec3(uTime * 0.004, 0.0, 0.0)) - 0.5) * 1.4;
  vec3 col = mix(vec3(0.78, 0.5, 0.26), vec3(1.0, 0.9, 0.72), smoothstep(0.2, 0.8, 0.5 + 0.5 * sin(v * 2.0)));
  col = mix(col, vec3(0.6, 0.26, 0.12), smoothstep(0.55, 1.0, 0.5 + 0.5 * sin(v * 5.3 + 1.0)) * 0.6);
  col *= 0.85 + 0.3 * fbm(n * vec3(4.0, 40.0, 4.0));
  float ndl = dot(n, uSun);
  float lit = smoothstep(-0.08, 0.4, ndl) * (0.45 + 0.85 * clamp(ndl, 0.0, 1.0));
  // Shadow of the rings on the cloud tops.
  float ts = ringPlaneT(p, uSun);
  if (ts > 0.0) lit *= 1.0 - 0.85 * ringDensity(length(p + uSun * ts - uPlanet.xyz));
  vec3 c = col * lit;
  // Warm at the terminator, hazy at the limb.
  c += vec3(0.9, 0.4, 0.15) * 0.12 * exp(-ndl * ndl * 40.0) * smoothstep(-0.15, 0.05, ndl);
  float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  c += vec3(1.0, 0.7, 0.45) * fres * smoothstep(-0.2, 0.4, ndl) * 0.6;
  // A little bounce light from the rings on the night side.
  c += col * 0.015;
  return c;
}

vec3 shadeMoon(vec3 p) {
  vec3 n = normalize(p - uMoon.xyz);
  float a = 0.3 + 0.45 * fbm(n * 5.0) + 0.15 * smoothstep(0.55, 0.6, noise(n * 14.0));
  vec3 col = vec3(a) * vec3(0.95, 0.92, 0.88);
  // Planet shadow on the moon (it sits near the planet's night side sometimes).
  float sh = sphere(p, uSun, uPlanet) > 0.0 ? 0.05 : 1.0;
  return col * (max(dot(n, uSun), 0.0) * sh * 1.2 + 0.015); // + planetshine
}

// --- main ------------------------------------------------------------------------
void main() {
  vec2 ndc = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  float aspect = uRes.x / uRes.y;
  vec3 rd = normalize(uCamF + uCamR * ndc.x * uTanHalf * aspect + uCamU * ndc.y * uTanHalf);
  vec3 ro = uCamPos;

  float tP = sphere(ro, rd, uPlanet);
  float tM = sphere(ro, rd, uMoon);
  float tOpaque = 1e9;
  vec3 col;
  if (tP > 0.0 && (tM < 0.0 || tP < tM)) { col = shadePlanet(ro + rd * tP, rd); tOpaque = tP; }
  else if (tM > 0.0) { col = shadeMoon(ro + rd * tM); tOpaque = tM; }
  else {
    col = sky(rd);
    // Atmosphere halo just outside the limb, brightest where the sun is behind it.
    vec3 oc = uPlanet.xyz - ro; float tc = dot(oc, rd);
    if (tc > 0.0) {
      vec3 cp = ro + rd * tc; float dmin = length(cp - uPlanet.xyz);
      float hgt = (dmin - uPlanet.w) / uPlanet.w;
      if (hgt > 0.0) {
        vec3 limbN = normalize(cp - uPlanet.xyz);
        float sunSide = smoothstep(-0.3, 0.5, dot(limbN, uSun));
        float forward = pow(max(dot(rd, uSun), 0.0), 6.0);
        col += vec3(1.0, 0.62, 0.35) * exp(-hgt * 70.0) * (sunSide * 0.5 + forward * 2.0);
      }
    }
  }

  // Rings and derelict: transparent, composited back to front.
  float tR = ringPlaneT(ro, rd);
  float dens = 0.0; vec3 ringCol = vec3(0.0);
  if (tR > 0.0 && tR < tOpaque) {
    vec3 q = ro + rd * tR;
    dens = ringDensity(length(q - uPlanet.xyz));
    float sh = sphere(q, uSun, uPlanet) > 0.0 ? 0.04 : 1.0;
    float fwd = pow(max(dot(rd, uSun), 0.0), 4.0);                 // forward scatter when backlit
    float sunSide = step(0.0, dot(rd, uRingN) * dot(uSun, uRingN)); // looking at the unlit face
    float light = mix(0.25 + 0.9 * abs(dot(uSun, uRingN)), 0.35 + fwd * 1.5, sunSide);
    ringCol = vec3(0.85, 0.75, 0.62) * light * sh;
  }

  float tD = -1.0; vec4 der = vec4(0.0); float rim = 0.0;
  {
    float den = dot(rd, uCamF);
    float t = dot(uDer - ro, uCamF) / den;
    if (t > 0.0 && t < tOpaque) {
      vec3 h = ro + rd * t - uDer;
      float ca = cos(uDerAngle), sa = sin(uDerAngle);
      vec3 ax = ca * uCamR + sa * uCamU, ay = -sa * uCamR + ca * uCamU;
      vec2 uv = vec2(dot(h, ax) / uDerSize.x + 0.5, 0.5 - dot(h, ay) / uDerSize.y);
      if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {
        der = texture2D(uDerTex, uv); rim = texture2D(uDerRim, uv).a; tD = t;
      }
    }
  }

  vec3 hull = pow(der.rgb, vec3(2.2)) * 4.0 + vec3(0.006, 0.007, 0.009);
  vec3 rimC = vec3(1.0, 0.9, 0.75) * rim * uGlint * 2.5;
  if (tD > 0.0 && tD > tR) { col = mix(col, hull, der.a) + rimC; col = mix(col, ringCol, dens); }
  else { col = mix(col, ringCol, dens); if (tD > 0.0) col = mix(col, hull, der.a) + rimC; }

  // Sun glare and an anamorphic streak, only while the sun is in view.
  float sd = max(dot(rd, uSun), 0.0);
  col += vec3(1.0, 0.88, 0.7) * (pow(sd, 300.0) * 0.8 + pow(sd, 20.0) * 0.12) * uSunVis;
  if (uSunNdc.z > 0.5) {
    vec2 dd = (ndc - uSunNdc.xy) * vec2(aspect, 1.0);
    col += vec3(0.45, 0.65, 1.0) * exp(-abs(dd.y) * 140.0) * exp(-abs(dd.x) * 1.4) * 0.35 * uSunVis;
  }

  // Tone map, grain, fade.
  col = col / (1.0 + col * 0.9) * 1.15;
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  col += (hash13(vec3(gl_FragCoord.xy, uTime * 60.0)) - 0.5) * 0.02;
  gl_FragColor = vec4(col * (1.0 - uFade), 1.0);
}`;

// --- small vector helpers --------------------------------------------------------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
const add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];

// How much of the sun disc a body leaves visible from `ro`: 0 behind, 1 clear.
function sunVisibility(ro, body, radius) {
  const oc = sub(body, ro);
  const tc = dot(oc, WORLD.sun);
  if (tc < 0) return 1;
  const d = Math.hypot(...sub(oc, WORLD.sun.map((v) => v * tc)));
  const x = Math.min(Math.max((d - radius * 0.99) / (radius * 0.04), 0), 1);
  return x * x * (3 - 2 * x);
}

function loadTexture(gl, unit, url) {
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); // rasterise the SVG at a power of two
    c.width = 1024; c.height = 512;
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  };
  img.src = url;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

// Start rendering into `canvas`. Returns stop().
export function startFlyby(canvas, getSize) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) { console.error('[flyby] WebGL unavailable'); return () => {}; }

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error('[flyby]', gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error('[flyby]', gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = new Proxy({}, { get: (c, k) => (c[k] ??= gl.getUniformLocation(prog, k)) });
  const { planet, rings, moon, derelict } = WORLD;
  gl.uniform3fv(U.uSun, WORLD.sun);
  gl.uniform3fv(U.uNeb, WORLD.nebula);
  gl.uniform4f(U.uPlanet, ...planet.pos, planet.radius);
  gl.uniform3fv(U.uRingN, rings.normal);
  gl.uniform2f(U.uRingR, rings.inner, rings.outer);
  gl.uniform4f(U.uMoon, ...moon.pos, moon.radius);
  gl.uniform3fv(U.uDer, derelict.pos);
  gl.uniform2f(U.uDerSize, derelict.width, derelict.width * 520 / 1200);

  loadTexture(gl, 0, '/assets/menu/derelict.svg');
  loadTexture(gl, 1, '/assets/menu/derelict_rim.svg');
  gl.uniform1i(U.uDerTex, 0);
  gl.uniform1i(U.uDerRim, 1);

  const playhead = clock(SEQUENCE.length);
  // Debug: scrub from the console. hold(t) freezes on a frame, hold(null) resumes.
  let held = null;
  window.npFlyby = { seek: playhead.seek, hold: (t) => { held = t; }, length: SEQUENCE.length };
  let raf = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    const { w, h } = getSize();
    const cw = Math.round(w * RENDER_SCALE), ch = Math.round(h * RENDER_SCALE);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    gl.viewport(0, 0, cw, ch);

    const t = held ?? playhead.time();
    const s = evaluate(t);
    const f = norm(sub(s.camTarget, s.camPos));
    let r = norm(cross(f, [0, 1, 0]));
    let u = cross(r, f);
    const roll = (s.roll * Math.PI) / 180;
    [r, u] = [add(r.map((v) => v * Math.cos(roll)), u, Math.sin(roll)), add(u.map((v) => v * Math.cos(roll)), r, -Math.sin(roll))];
    const tanHalf = Math.tan(((s.fov / 2) * Math.PI) / 180);
    const aspect = cw / ch;

    // Where the sun is on screen, for the streak.
    const sf = dot(WORLD.sun, f);
    const sunNdc = sf > 0 ? [dot(WORLD.sun, r) / (sf * tanHalf * aspect), dot(WORLD.sun, u) / (sf * tanHalf), 1] : [0, 0, 0];
    const vis = sunVisibility(s.camPos, planet.pos, planet.radius) * sunVisibility(s.camPos, moon.pos, moon.radius);

    gl.uniform2f(U.uRes, cw, ch);
    gl.uniform3fv(U.uCamPos, s.camPos);
    gl.uniform3fv(U.uCamF, f);
    gl.uniform3fv(U.uCamR, r);
    gl.uniform3fv(U.uCamU, u);
    gl.uniform1f(U.uTanHalf, tanHalf);
    gl.uniform1f(U.uTime, t);
    gl.uniform1f(U.uFade, s.fade);
    gl.uniform1f(U.uGlint, s.glint);
    gl.uniform1f(U.uDerAngle, (s.derelictAngle * Math.PI) / 180);
    gl.uniform1f(U.uSunVis, vis);
    gl.uniform3fv(U.uSunNdc, sunNdc);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  frame();

  return () => {
    cancelAnimationFrame(raf);
    playhead.stop();
    delete window.npFlyby;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
