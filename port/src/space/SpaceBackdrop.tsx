import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/*
 * Deep-space backdrop, built as a real 3D volume:
 *  - stars spread at many depths (150..2600 units) so any camera motion parallaxes,
 *  - near-field space dust (z ~ +7..-62) that drifts slowly and parallaxes strongly,
 *  - bright stars with soft glow + 4-point diffraction spikes at mixed depths,
 *  - occasional shooting stars,
 *  - a very subtle baked nebula / Milky Way glow at infinity (cube map).
 * Everything is procedural; colours are written display-referred (no tone mapping).
 */

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const R_NEBULA = 3000;
const STAR_R_MIN = 150;
const STAR_R_MAX = 2600;
const BAKE_ORDER = [5, 0, 1, 2, 3, 4];

// Near-field dust: 3..70 units in front of the nominal camera (z ~ 10, looking at ~(0, 15, -75)).
const DUST_COUNT = 560;
const DUST_CAM_Z = 10;

// Default view frame used for art direction: camera near the origin looking at (0, 15, -75).
const VIEW_F = new THREE.Vector3(0, 15, -85).normalize();
const VIEW_R = new THREE.Vector3(1, 0, 0);
const VIEW_U = new THREE.Vector3().crossVectors(VIEW_R, VIEW_F).normalize();
/** Direction through tangent-space point (x, y) of the default view (x right, y up). */
function viewDir(x: number, y: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.copy(VIEW_F).addScaledVector(VIEW_R, x).addScaledVector(VIEW_U, y).normalize();
}

// Milky Way great circle: runs from the lower-left of the default view to the
// top, passing above-left of the centre (keeps the title area calm).
const BAND_A = viewDir(-1.25, -0.7);
const BAND_B = viewDir(0.3, 0.95);
const BAND_N = new THREE.Vector3().crossVectors(BAND_A, BAND_B).normalize();
const BAND_E1 = BAND_A.clone();
const BAND_E2 = new THREE.Vector3().crossVectors(BAND_N, BAND_E1).normalize();
// Galactic bulge, outside the lower-left corner
const BULGE = viewDir(-1.9, -1.15);
BULGE.addScaledVector(BAND_N, -BULGE.dot(BAND_N)).normalize();
// Nebula complexes (very faint): upper right violet/magenta, lower right teal, lower left indigo
const ART_A = viewDir(1.05, 0.5);
const ART_B = viewDir(0.95, -0.78);
const ART_C = viewDir(-0.95, -0.85);

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rng: () => number): number {
  let u = 0;
  while (u === 0) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

function randomDir(rng: () => number, out: THREE.Vector3): THREE.Vector3 {
  const z = rng() * 2 - 1;
  const t = rng() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  return out.set(s * Math.cos(t), s * Math.sin(t), z);
}

// Star colours (approximate blackbody, sRGB) with relative frequency
const STAR_TYPES: { c: [number, number, number]; w: number }[] = [
  { c: [0.62, 0.71, 1.0], w: 0.06 }, // O/B
  { c: [0.74, 0.81, 1.0], w: 0.14 }, // B/A
  { c: [0.87, 0.9, 1.0], w: 0.22 }, // A
  { c: [1.0, 0.98, 0.96], w: 0.22 }, // F
  { c: [1.0, 0.93, 0.83], w: 0.17 }, // G
  { c: [1.0, 0.83, 0.64], w: 0.12 }, // K
  { c: [1.0, 0.7, 0.47], w: 0.07 }, // M
];

function pickStarColor(rng: () => number): [number, number, number] {
  let r = rng();
  for (const t of STAR_TYPES) {
    if (r < t.w) return t.c;
    r -= t.w;
  }
  return STAR_TYPES[3].c;
}

// ---------------------------------------------------------------------------
// GLSL
// ---------------------------------------------------------------------------

// 3D simplex noise -- Ashima Arts / Stefan Gustavson (MIT license)
const SNOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const BAKE_VERT = /* glsl */ `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BAKE_FRAG = /* glsl */ `
uniform vec3 uBandN;
uniform vec3 uBulge;
uniform vec3 uArtA;
uniform vec3 uArtB;
uniform vec3 uArtC;
varying vec3 vPos;
${SNOISE}
float fbm(vec3 p, int oct) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 8; i++) {
    if (i >= oct) break;
    s += a * snoise(p);
    p = p * 2.03 + vec3(19.1, 7.3, 3.7);
    a *= 0.5;
  }
  return s;
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
float blob(vec3 d, vec3 c, float w) { return exp((dot(d, normalize(c)) - 1.0) / w); }

void main() {
  vec3 d = normalize(vPos);

  // ---- domain warping -------------------------------------------------------
  vec3 p = d * 1.25 + vec3(4.1, 2.7, 9.3);
  vec3 q = vec3(fbm(p, 4), fbm(p + vec3(5.2, 1.3, 7.1), 4), fbm(p + vec3(1.7, 9.2, 2.6), 4));
  vec3 pw = p + 0.95 * q;
  float f = fbm(pw, 7);
  float lf = fbm(pw * 0.55 + vec3(3.3, 6.1, 0.4), 3);
  float detail = fbm(pw * 4.2 + vec3(8.3, 2.8, 5.6), 4);

  // ---- where the gas lives --------------------------------------------------
  float region = smoothstep(-0.3, 0.45, fbm(d * 0.7 + vec3(7.7, 1.1, 4.4), 3));
  // art direction for the default view (camera near the origin looking at ~(0, 15, -75))
  float artA = blob(d, uArtA, 0.13); // upper right: violet / magenta complex
  float artB = blob(d, uArtB, 0.12); // lower right: teal / OIII
  float artC = blob(d, uArtC, 0.1);  // lower left: indigo / violet veil
  float mask = clamp(region * 0.35 + artA + artB * 0.95 + artC * 0.6, 0.0, 1.3);

  // log-normal density: bright concentrated cores, wide faint fringes
  float dens = exp(2.7 * (f + 0.55 * lf)) * mask * (1.0 + 0.4 * detail);

  // ---- colour: three emission "species", each with a density ramp -------------
  float hue = 0.5 + 0.5 * fbm(d * 1.0 + q * 0.5 + vec3(2.2, 8.8, 5.5), 3) + artA * 0.55 - artB * 0.65 + 0.2 * lf;
  float wTeal = 1.0 - smoothstep(0.18, 0.45, hue);
  float wMag = smoothstep(0.6, 0.92, hue);
  float wInd = clamp(1.0 - wTeal - wMag, 0.0, 1.0);

  float hi = fbm(pw * 7.5 + q * 2.0 + vec3(4.4, 1.2, 7.7), 4);
  float e = dens * 0.075 * (0.82 + 0.36 * smoothstep(-0.5, 0.5, hi));
  float L = 1.0 - exp(-e * 2.5);
  float t1 = smoothstep(0.0, 0.32, L);
  float t2 = smoothstep(0.3, 0.75, L);
  vec3 cMag = mix(mix(vec3(0.2, 0.07, 0.42), vec3(0.7, 0.15, 0.5), t1), vec3(1.0, 0.58, 0.8), t2);
  vec3 cTea = mix(mix(vec3(0.03, 0.1, 0.34), vec3(0.03, 0.44, 0.5), t1), vec3(0.62, 0.96, 0.96), t2);
  vec3 cInd = mix(mix(vec3(0.06, 0.05, 0.25), vec3(0.24, 0.17, 0.58), t1), vec3(0.74, 0.72, 1.0), t2);
  vec3 gas = cMag * wMag + cTea * wTeal + cInd * wInd;

  vec3 col = gas * L;
  // soft diffuse glow around the clouds
  col += gas * mask * 0.03;
  // faint all-sky haze
  vec3 cIndigo = vec3(0.07, 0.075, 0.26);
  col += cIndigo * 0.06 * (0.5 + 0.5 * fbm(d * 1.1 + q, 3));

  // ---- dust inside the clouds ---------------------------------------------------
  float dustF = fbm(pw * 1.7 + vec3(6.1, 3.3, 0.2), 6);
  float lanes = smoothstep(0.02, 0.38, dustF + 0.15 * detail);

  // ---- Milky Way -------------------------------------------------------------
  float b = dot(d, uBandN);
  float bulge = blob(d, uBulge, 0.2);
  float sig = 0.06 + 0.04 * bulge;
  float bw = b + 0.025 * snoise(d * 2.2 + vec3(3.0));
  float mwCore = exp(-0.5 * bw * bw / (sig * sig));
  float mwHalo = exp(-0.5 * b * b / (0.22 * 0.22));
  float clump = fbm(d * 6.0 + q * 0.35 + vec3(9.9, 1.4, 3.2), 5) * 0.5 + 0.5;
  float mottle = fbm(d * 16.0 + vec3(1.1, 2.2, 3.3), 3) * 0.5 + 0.5;
  vec3 mwCol = mix(vec3(0.46, 0.52, 0.7), vec3(0.62, 0.6, 0.66), clump);
  float mw = mwCore * (0.18 + 1.25 * pow(clump, 2.0)) * (0.7 + 0.6 * mottle) + mwHalo * 0.05;
  col += mwCol * mw * (0.4 + 0.15 * bulge);

  // ---- dust -------------------------------------------------------------------
  float riftC = bw - 0.008;
  float rift = exp(-0.5 * riftC * riftC / (sig * sig * 0.22)) * smoothstep(-0.25, 0.3, fbm(d * 4.0 + q * 0.8 + vec3(1.3, 7.7, 2.9), 6));
  float patches = smoothstep(0.08, 0.38, fbm(d * 7.0 + q * 0.8 + vec3(5.5, 0.3, 8.8), 5)) * mwCore;
  float tau = lanes * 1.6 * smoothstep(0.0, 0.6, mask) + rift * 1.8 + patches * 1.1;
  float trans = exp(-tau);
  col *= trans;

  // ---- base -------------------------------------------------------------------
  col += vec3(0.0035, 0.0045, 0.011);
  col += (hash13(vPos * 1731.0) - 0.5) / 255.0;
  gl_FragColor = vec4(max(col, 0.0), clamp(trans, 0.0, 1.0));
}
`;

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
varying vec3 vView;
void main() {
  vDir = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const SKY_FRAG = /* glsl */ `
uniform samplerCube uNeb;
uniform float uFade;
varying vec3 vDir;
varying vec3 vView;
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  vec3 c = texture(uNeb, normalize(vDir)).rgb;
  // calm, darker horizontal band in the middle of the screen (title + labels)
  vec3 v = normalize(vView);
  float fwd = smoothstep(0.25, 0.75, -v.z);
  vec2 t = v.xy / max(-v.z, 0.05);
  float band = exp(-0.5 * pow((t.y - 0.03) / 0.3, 2.0)) * exp(-0.5 * pow(t.x / 1.15, 2.0)) * fwd;
  vec3 base = vec3(0.0035, 0.0045, 0.011);
  // keep the glow very subtle: it sits at infinity behind a 3D volume of stars and dust
  c = base + (c - base) * mix(0.34, 0.13, band);
  c *= uFade;
  c += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(c, 1.0);
}
`;

const STAR_VERT = /* glsl */ `
uniform float uTime;
uniform float uTwinkle;
uniform float uDpr;
uniform float uFade;
uniform samplerCube uNeb;
attribute float aSize;
attribute vec3 aColor;
attribute vec4 aTw; // phase, speed, amount, extinction weight
varying vec3 vColor;
varying float vSigma;
varying float vPx;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 1.0 + uTwinkle * aTw.z * (0.6 * sin(uTime * aTw.y + aTw.x) + 0.4 * sin(uTime * aTw.y * 2.37 + aTw.x * 1.7));
  float trans = texture(uNeb, normalize(position)).a;
  float ext = mix(1.0, trans, aTw.w * uFade);
  float sigma = max(aSize * uDpr * 0.42, 0.62);
  vSigma = sigma;
  vPx = max(sigma * 7.0, 3.0);
  vColor = aColor * tw * ext;
  gl_PointSize = vPx;
}
`;

const STAR_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vSigma;
varying float vPx;
void main() {
  vec2 c = (gl_PointCoord - 0.5) * vPx;
  float r2 = dot(c, c);
  float r = sqrt(r2);
  float core = exp(-0.5 * r2 / (vSigma * vSigma));
  float halo = 0.06 * exp(-r / (vSigma * 1.6));
  float edge = 1.0 - smoothstep(vPx * 0.36, vPx * 0.5, r);
  vec3 col = mix(vColor, vec3(dot(vColor, vec3(0.333))), 0.0) * (core + halo) * edge;
  gl_FragColor = vec4(col, 1.0);
}
`;

const BRIGHT_VERT = /* glsl */ `
uniform vec2 uRes;
uniform float uTime;
uniform float uTwinkle;
attribute vec2 aCorner;
attribute float aSize;
attribute vec3 aColor;
attribute float aPhase;
varying vec2 vPx;
varying vec3 vColor;
varying float vSize;
varying float vTw;
void main() {
  vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  clip.xy += aCorner * aSize * 2.0 / uRes * clip.w;
  gl_Position = clip;
  vPx = aCorner * aSize;
  vSize = aSize;
  vColor = aColor;
  vTw = 1.0 + uTwinkle * 0.08 * sin(uTime * (0.6 + fract(aPhase * 7.13) * 0.8) + aPhase);
}
`;

const BRIGHT_FRAG = /* glsl */ `
varying vec2 vPx;
varying vec3 vColor;
varying float vSize;
varying float vTw;
void main() {
  vec2 p = vPx;
  float r = length(p);
  float s = vSize;
  float core = exp(-0.5 * r * r / (1.25 * 1.25));
  float bloom = exp(-r / (s * 0.06)) * 0.45 + exp(-r / (s * 0.2)) * 0.07;
  const float ang = 0.14;
  vec2 rp = vec2(cos(ang) * p.x - sin(ang) * p.y, sin(ang) * p.x + cos(ang) * p.y);
  float sx = exp(-abs(rp.y) / 0.5) * pow(max(1.0 - abs(rp.x) / s, 0.0), 2.6);
  float sy = exp(-abs(rp.x) / 0.5) * pow(max(1.0 - abs(rp.y) / s, 0.0), 2.6);
  float spikes = (sx + sy) * 0.5;
  float edge = 1.0 - smoothstep(0.8 * s, s, r);
  vec3 white = vec3(1.0, 0.98, 0.96);
  vec3 col = mix(vColor, white, 0.7) * core * 1.3 + vColor * (bloom * edge + spikes) * vTw;
  gl_FragColor = vec4(col, 1.0);
}
`;

const METEOR_VERT = /* glsl */ `
uniform vec3 uHead;
uniform vec3 uTail;
uniform vec2 uRes;
attribute vec2 aQuad;
varying vec2 vP;
varying float vLen;
void main() {
  vec4 h = projectionMatrix * viewMatrix * vec4(uHead, 1.0);
  vec4 t = projectionMatrix * viewMatrix * vec4(uTail, 1.0);
  vec2 hs = h.xy / h.w * 0.5 * uRes;
  vec2 ts = t.xy / t.w * 0.5 * uRes;
  vec2 ax = ts - hs;
  float len = max(length(ax), 0.001);
  ax /= len;
  vec2 pr = vec2(-ax.y, ax.x);
  float pad = 12.0;
  float along = mix(-pad, len + 2.0, aQuad.x);
  float across = aQuad.y * pad;
  vec2 s = hs + ax * along + pr * across;
  vP = vec2(along, across);
  vLen = len;
  gl_Position = vec4(s / (0.5 * uRes), clamp(h.z / h.w, -1.0, 1.0), 1.0);
}
`;

const METEOR_FRAG = /* glsl */ `
uniform float uAlpha;
varying vec2 vP;
varying float vLen;
void main() {
  float a = clamp(vP.x / vLen, 0.0, 1.0);
  float tail = vP.x >= 0.0 ? pow(1.0 - a, 2.2) : 0.0;
  float wdt = mix(1.05, 0.35, a);
  float across = exp(-0.5 * vP.y * vP.y / (wdt * wdt));
  float r2 = dot(vP, vP);
  float head = exp(-0.5 * r2 / 2.4);
  float glow = 0.16 * exp(-sqrt(r2) / 4.0);
  vec3 headCol = vec3(1.0, 0.97, 0.92);
  vec3 tailCol = mix(vec3(0.75, 0.88, 1.0), vec3(0.55, 0.95, 0.85), a);
  vec3 col = tailCol * tail * across * 0.95 + headCol * (head * 1.3 + glow);
  gl_FragColor = vec4(col * uAlpha, 1.0);
}
`;

const DUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uDrift;
uniform float uDpr;
uniform float uScale; // CSS px per world unit at distance 1
attribute vec3 aPhase; // position inside the mote's own wander cell, [0, 1)
attribute vec3 aVel;   // world units per second
attribute vec4 aDust;  // world size, brightness, warm tint, wander-cell size
varying vec3 vColor;
varying float vPx;
varying float vSigma;
varying float vDisc;
void main() {
  // each mote drifts slowly through its own cell around a fixed home (position);
  // it fades out at the cell border and re-enters on the other side
  vec3 f = fract(aPhase + aVel * (uTime * uDrift) / aDust.w);
  vec3 e = min(f, 1.0 - f);
  float edge = smoothstep(0.0, 0.1, min(e.x, min(e.y, e.z)));
  vec3 world = position + (f - 0.5) * aDust.w;
  vec4 mv = viewMatrix * vec4(world, 1.0);
  float dist = -mv.z;
  gl_Position = projectionMatrix * mv;
  float sz = min(aDust.x * uScale / max(dist, 0.1) * uDpr, 40.0 * uDpr); // physical px
  float a = aDust.y * edge * smoothstep(1.5, 6.0, dist);
  // keep the centre of the screen (title, labels) almost free of dust
  vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.001);
  float c = length(vec2(ndc.x / 0.78, (ndc.y + 0.05) / 0.5));
  a *= mix(0.05, 1.0, smoothstep(0.6, 1.3, c));
  // tiny far motes keep their flux; very close ones defocus into soft, dim discs
  float s0 = 1.4 * uDpr;
  a *= sz < s0 ? (sz / s0) * (sz / s0) : 1.0;
  vDisc = smoothstep(5.0 * uDpr, 12.0 * uDpr, sz);
  a *= mix(1.0, (6.0 * uDpr) / sz, vDisc);
  vSigma = max(sz * 0.42, 0.7);
  vPx = mix(max(vSigma * 6.0, 3.0), sz, vDisc);
  vColor = mix(vec3(0.72, 0.8, 0.96), vec3(0.98, 0.86, 0.72), aDust.z) * a;
  if (dist < 0.3) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = vPx;
}
`;

const DUST_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vPx;
varying float vSigma;
varying float vDisc;
void main() {
  vec2 c = (gl_PointCoord - 0.5) * vPx;
  float r = length(c);
  float point = exp(-0.5 * r * r / (vSigma * vSigma));
  float rn = r / (0.5 * vPx);
  float disc = (1.0 - smoothstep(0.7, 1.0, rn)) * (0.55 + 0.45 * smoothstep(0.25, 0.9, rn));
  float a = mix(point, disc * 0.5, vDisc);
  gl_FragColor = vec4(vColor * a, 1.0);
}
`;

// ---------------------------------------------------------------------------
// Data builders
// ---------------------------------------------------------------------------

type LayerOpts = {
  count: number;
  rMin: number;
  rMax: number;
  seed: number;
  bandFrac: number;
  bandSigma: number;
  sizeMin: number;
  sizeMax: number;
  iMin: number;
  iMax: number;
  brightPow: number;
  ext: number;
  twinkleFrac: number;
};

function buildStarLayer(o: LayerOpts): THREE.BufferGeometry {
  const rng = mulberry32(o.seed);
  const pos = new Float32Array(o.count * 3);
  const col = new Float32Array(o.count * 3);
  const size = new Float32Array(o.count);
  const tw = new Float32Array(o.count * 4);
  const d = new THREE.Vector3();
  for (let i = 0; i < o.count; i++) {
    const inBand = rng() < o.bandFrac;
    let ext = o.ext * 0.5;
    if (inBand) {
      // longitude with clumps (star clouds), latitude gaussian, wider at the bulge
      let lon = 0;
      for (let k = 0; k < 6; k++) {
        lon = rng() * Math.PI * 2;
        const wgt = 0.55 + 0.25 * Math.sin(lon * 3 + 1.3) + 0.2 * Math.sin(lon * 7 + 4.1);
        if (rng() < wgt) break;
      }
      const cl = Math.cos(lon);
      const sl = Math.sin(lon);
      d.set(0, 0, 0).addScaledVector(BAND_E1, cl).addScaledVector(BAND_E2, sl);
      const bulge = Math.exp((d.dot(BULGE) - 1) / 0.18);
      const lat = gauss(rng) * o.bandSigma * (1 + 1.2 * bulge);
      d.multiplyScalar(Math.cos(lat)).addScaledVector(BAND_N, Math.sin(lat)).normalize();
      ext = o.ext;
    } else {
      randomDir(rng, d);
    }
    // log-uniform depth: the same number of stars per octave of distance
    const r = o.rMin * Math.pow(o.rMax / o.rMin, rng());
    // stars in front of the Milky Way dust are not dimmed by it
    ext *= Math.min(1, Math.max(0, (r - 300) / 600));
    pos[i * 3] = d.x * r;
    pos[i * 3 + 1] = d.y * r;
    pos[i * 3 + 2] = d.z * r;

    const b = Math.pow(rng(), o.brightPow);
    // mild depth cue: nearer stars a little larger / brighter
    const near = 350 / r;
    size[i] = (o.sizeMin + (o.sizeMax - o.sizeMin) * b) * Math.min(1.2, Math.max(0.85, Math.pow(near, 0.15)));
    const inten = (o.iMin + (o.iMax - o.iMin) * b) * Math.min(1.3, Math.max(0.6, Math.pow(near, 0.3)));
    const c = pickStarColor(rng);
    const sat = 0.75 + 0.25 * b;
    col[i * 3] = (1 + (c[0] - 1) * sat) * inten;
    col[i * 3 + 1] = (1 + (c[1] - 1) * sat) * inten;
    col[i * 3 + 2] = (1 + (c[2] - 1) * sat) * inten;

    tw[i * 4] = rng() * Math.PI * 2;
    tw[i * 4 + 1] = 0.5 + rng() * 1.8;
    tw[i * 4 + 2] = rng() < o.twinkleFrac ? 0.12 + rng() * 0.28 : 0.03;
    tw[i * 4 + 3] = ext;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aTw", new THREE.BufferAttribute(tw, 4));
  return g;
}

function buildBrightStars(seed: number): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const stars: { d: THREE.Vector3; r: number; size: number; c: [number, number, number]; i: number }[] = [];
  // hand-placed in the default view (tangent-space x, y), away from the centre band, at mixed depths
  const placed: [number, number, number, number][] = [
    // x, y, half-size (css px), intensity
    [-0.9, 0.55, 64, 1.0],
    [0.64, 0.62, 48, 0.85],
    [0.98, -0.3, 58, 0.95],
    [-0.62, -0.58, 44, 0.8],
    [0.2, -0.66, 30, 0.6],
    [-1.02, -0.12, 34, 0.7],
    [1.02, 0.42, 30, 0.6],
    [-0.3, 0.7, 28, 0.55],
    [0.42, 0.34, 22, 0.45],
    [-0.5, 0.3, 22, 0.45],
  ];
  for (const [x, y, s, i] of placed) {
    stars.push({ d: viewDir(x, y), r: 260 + rng() * 1100, size: s, c: pickStarColor(rng), i });
  }
  // a few more around the rest of the sky
  for (let k = 0; k < 14; k++) {
    const d = randomDir(rng, new THREE.Vector3());
    if (d.dot(VIEW_F) > 0.45) {
      k--;
      continue;
    }
    stars.push({ d, r: 300 + rng() * 1500, size: 20 + rng() * 26, c: pickStarColor(rng), i: 0.5 + rng() * 0.4 });
  }
  const n = stars.length;
  const pos = new Float32Array(n * 12);
  const corner = new Float32Array(n * 8);
  const size = new Float32Array(n * 4);
  const color = new Float32Array(n * 12);
  const phase = new Float32Array(n * 4);
  const index: number[] = [];
  const corners = [-1, -1, 1, -1, -1, 1, 1, 1];
  stars.forEach((s, k) => {
    const r = s.r;
    const ph = rng() * 100;
    for (let v = 0; v < 4; v++) {
      const j = k * 4 + v;
      pos[j * 3] = s.d.x * r;
      pos[j * 3 + 1] = s.d.y * r;
      pos[j * 3 + 2] = s.d.z * r;
      corner[j * 2] = corners[v * 2];
      corner[j * 2 + 1] = corners[v * 2 + 1];
      size[j] = s.size;
      color[j * 3] = s.c[0] * s.i;
      color[j * 3 + 1] = s.c[1] * s.i;
      color[j * 3 + 2] = s.c[2] * s.i;
      phase[j] = ph;
    }
    const b = k * 4;
    index.push(b, b + 1, b + 2, b + 2, b + 1, b + 3);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aCorner", new THREE.BufferAttribute(corner, 2));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  g.setIndex(index);
  return g;
}

function buildDust(seed: number): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const home = new Float32Array(DUST_COUNT * 3);
  const phase = new Float32Array(DUST_COUNT * 3);
  const vel = new Float32Array(DUST_COUNT * 3);
  const dust = new Float32Array(DUST_COUNT * 4);
  const slope = VIEW_F.y / -VIEW_F.z; // the view rises towards the solar system
  for (let i = 0; i < DUST_COUNT; i++) {
    // depth in front of the nominal camera, homes spread over the frustum (+ sway margin)
    const d = 3 + 67 * Math.pow(rng(), 1.15);
    home[i * 3] = (rng() * 2 - 1) * (d * 1.25 + 9);
    home[i * 3 + 1] = d * slope + (rng() * 2 - 1) * (d * 0.9 + 7);
    home[i * 3 + 2] = DUST_CAM_Z - d;
    phase[i * 3] = rng();
    phase[i * 3 + 1] = rng();
    phase[i * 3 + 2] = rng();
    // slow common sideways flow plus a little individual wander (units / s)
    vel[i * 3] = 0.16 + (rng() * 2 - 1) * 0.1;
    vel[i * 3 + 1] = 0.05 + (rng() * 2 - 1) * 0.08;
    vel[i * 3 + 2] = (rng() * 2 - 1) * 0.05;
    dust[i * 4] = 0.05 + Math.pow(rng(), 2.5) * 0.17;
    dust[i * 4 + 1] = 0.15 + Math.pow(rng(), 2) * 0.45;
    dust[i * 4 + 2] = rng() < 0.3 ? 0.5 + rng() * 0.5 : rng() * 0.3;
    dust[i * 4 + 3] = 3 + d * 0.35;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(home, 3));
  g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 3));
  g.setAttribute("aVel", new THREE.BufferAttribute(vel, 3));
  g.setAttribute("aDust", new THREE.BufferAttribute(dust, 4));
  return g;
}

function buildMeteorGeometry(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12), 3));
  g.setAttribute("aQuad", new THREE.BufferAttribute(new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]), 2));
  g.setIndex([0, 2, 1, 1, 2, 3]);
  return g;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BASE_COLOR = 0x020308;

export const SpaceBackdrop: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion = false }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const getState = useThree((s) => s.get);

  const groupRef = useRef<THREE.Group>(null);
  const meteorRef = useRef<THREE.Mesh>(null);

  // shooting-star state (mutable, no per-frame allocations)
  const m = useMemo(
    () => ({
      active: false,
      timer: 2.5 + Math.random() * 3,
      t: 0,
      dur: 1,
      len: 100,
      start: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      fwd: new THREE.Vector3(),
      tmp: new THREE.Vector3(),
    }),
    [],
  );

  // shared uniforms
  const u = useMemo(
    () => ({
      uTime: { value: 0 },
      uTwinkle: { value: reducedMotion ? 0 : 1 },
      uDpr: { value: 1 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uNeb: { value: null as THREE.CubeTexture | null },
      uFade: { value: 0 },
      uDrift: { value: reducedMotion ? 0 : 1 },
      uScale: { value: 500 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const res = useMemo(() => {
    const skyGeo = new THREE.SphereGeometry(R_NEBULA, 48, 24);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      uniforms: { uNeb: u.uNeb, uFade: u.uFade },
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    const starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      uniforms: { uTime: u.uTime, uTwinkle: u.uTwinkle, uDpr: u.uDpr, uFade: u.uFade, uNeb: u.uNeb },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    // stars at every depth from 150 to 2600 units (log-uniform), plus a fainter Milky Way band
    const field = buildStarLayer({
      count: 9500, rMin: STAR_R_MIN, rMax: STAR_R_MAX, seed: 11, bandFrac: 0.15, bandSigma: 0.1,
      sizeMin: 0.6, sizeMax: 1.7, iMin: 0.14, iMax: 0.95, brightPow: 3.2, ext: 0.9, twinkleFrac: 0.3,
    });
    const band = buildStarLayer({
      count: 8000, rMin: 450, rMax: STAR_R_MAX, seed: 23, bandFrac: 1, bandSigma: 0.065,
      sizeMin: 0.5, sizeMax: 1.1, iMin: 0.1, iMax: 0.55, brightPow: 3.5, ext: 1, twinkleFrac: 0.1,
    });
    const brightGeo = buildBrightStars(77);
    const brightMat = new THREE.ShaderMaterial({
      vertexShader: BRIGHT_VERT,
      fragmentShader: BRIGHT_FRAG,
      uniforms: { uTime: u.uTime, uTwinkle: u.uTwinkle, uRes: u.uRes },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const dustGeo = buildDust(91);
    const dustMat = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      uniforms: {
        uTime: u.uTime,
        uDrift: u.uDrift,
        uDpr: u.uDpr,
        uScale: u.uScale,
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const meteorGeo = buildMeteorGeometry();
    const meteorMat = new THREE.ShaderMaterial({
      vertexShader: METEOR_VERT,
      fragmentShader: METEOR_FRAG,
      uniforms: {
        uHead: { value: new THREE.Vector3() },
        uTail: { value: new THREE.Vector3() },
        uRes: u.uRes,
        uAlpha: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    return { skyGeo, skyMat, starMat, field, band, brightGeo, brightMat, dustGeo, dustMat, meteorGeo, meteorMat };
  }, [u]);

  // Bake nebula + Milky Way into a cube map once, one face per frame (no long stall),
  // then fade the sky in.
  const bake = useRef<{
    rt: THREE.WebGLCubeRenderTarget;
    scene: THREE.Scene;
    cam: THREE.CubeCamera;
    geo: THREE.BufferGeometry;
    mat: THREE.ShaderMaterial;
    face: number;
  } | null>(null);

  useLayoutEffect(() => {
    const st = getState();
    const physH = Math.max(st.size.height, st.size.width * 0.6) * st.viewport.dpr;
    const small = Math.min(st.size.width, st.size.height) < 600;
    const want = Math.ceil((physH * 1.3) / 256) * 256;
    const faceSize = Math.min(Math.max(want, 768), small ? 1024 : 1536, gl.capabilities.maxCubemapSize);
    const rt = new THREE.WebGLCubeRenderTarget(faceSize, {
      type: THREE.UnsignedByteType,
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    const scene = new THREE.Scene();
    const geo = new THREE.SphereGeometry(1, 32, 16);
    const mat = new THREE.ShaderMaterial({
      vertexShader: BAKE_VERT,
      fragmentShader: BAKE_FRAG,
      uniforms: {
        uBandN: { value: BAND_N },
        uBulge: { value: BULGE },
        uArtA: { value: ART_A },
        uArtB: { value: ART_B },
        uArtC: { value: ART_C },
      },
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
      toneMapped: false,
    });
    scene.add(new THREE.Mesh(geo, mat));
    const cam = new THREE.CubeCamera(0.1, 10, rt);
    cam.coordinateSystem = gl.coordinateSystem;
    cam.updateCoordinateSystem();
    cam.updateMatrixWorld(true);
    bake.current = { rt, scene, cam, geo, mat, face: 0 };
    u.uFade.value = 0;
    return () => {
      geo.dispose();
      mat.dispose();
      rt.dispose();
      u.uNeb.value = null;
      u.uFade.value = 0;
      bake.current = null;
    };
  }, [gl, u, getState]);

  useEffect(() => {
    u.uDpr.value = dpr;
    u.uRes.value.set(size.width, size.height);
  }, [dpr, size, u]);

  useLayoutEffect(() => {
    u.uTwinkle.value = reducedMotion ? 0 : 1;
    u.uDrift.value = reducedMotion ? 0 : 1;
    if (meteorRef.current && (reducedMotion || !m.active)) meteorRef.current.visible = false;
  }, [reducedMotion, u, m]);

  // near-black clear colour if nobody else set a background
  useEffect(() => {
    if (scene.background) return;
    const c = new THREE.Color(BASE_COLOR);
    scene.background = c;
    return () => {
      if (scene.background === c) scene.background = null;
    };
  }, [scene]);

  useEffect(
    () => () => {
      res.skyGeo.dispose();
      res.skyMat.dispose();
      res.starMat.dispose();
      res.field.dispose();
      res.band.dispose();
      res.dustGeo.dispose();
      res.dustMat.dispose();
      res.brightGeo.dispose();
      res.brightMat.dispose();
      res.meteorGeo.dispose();
      res.meteorMat.dispose();
    },
    [res],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const time = state.clock.elapsedTime;

    const bk = bake.current;
    if (bk && bk.face < 6) {
      // faces facing the default view first: -Z, +X, -X, +Y, -Y, +Z
      const order = BAKE_ORDER[bk.face];
      const prev = gl.getRenderTarget();
      const xr = gl.xr.enabled;
      gl.xr.enabled = false;
      gl.setRenderTarget(bk.rt, order);
      gl.render(bk.scene, bk.cam.children[order] as THREE.Camera);
      gl.setRenderTarget(prev);
      gl.xr.enabled = xr;
      bk.face++;
      if (bk.face === 6) {
        u.uNeb.value = bk.rt.texture;
        bk.geo.dispose();
        bk.mat.dispose();
      }
    } else if (bk && u.uFade.value < 1) {
      u.uFade.value = reducedMotion ? 1 : Math.min(1, u.uFade.value + dt / 1.6);
    }
    const pcam = state.camera as THREE.PerspectiveCamera;
    if (pcam.isPerspectiveCamera) u.uScale.value = (0.5 * state.size.height) / Math.tan(pcam.fov * (Math.PI / 360));
    if (!reducedMotion) {
      u.uTime.value = time;
      // very slow back-and-forth drift of the whole sky around the Milky Way axis
      if (groupRef.current) groupRef.current.quaternion.setFromAxisAngle(BAND_N, 0.03 * Math.sin(time * 0.026));
    }

    const mesh = meteorRef.current;
    if (!mesh) return;
    if (reducedMotion) {
      mesh.visible = false;
      return;
    }
    const uni = res.meteorMat.uniforms;
    if (!m.active) {
      m.timer -= dt;
      if (m.timer > 0) return;
      // spawn in the upper part of the current view
      const cam = state.camera;
      m.right.setFromMatrixColumn(cam.matrixWorld, 0);
      m.up.setFromMatrixColumn(cam.matrixWorld, 1);
      m.fwd.setFromMatrixColumn(cam.matrixWorld, 2).negate();
      const aspect = size.width / Math.max(size.height, 1);
      const dist = 420;
      const x = (Math.random() * 2 - 1) * 0.7 * aspect * 0.77;
      const y = 0.3 + Math.random() * 0.42;
      m.tmp.copy(m.fwd).addScaledVector(m.right, x).addScaledVector(m.up, y).normalize();
      m.start.copy(cam.position).addScaledVector(m.tmp, dist);
      const ang = 0.25 + Math.random() * 0.5;
      const dir = x > 0 ? -1 : 1; // travel towards the other side
      const speed = dist * (0.55 + Math.random() * 0.35);
      m.vel.set(0, 0, 0).addScaledVector(m.right, Math.cos(ang) * dir * speed).addScaledVector(m.up, -Math.sin(ang) * speed);
      m.dur = 0.55 + Math.random() * 0.45;
      m.len = dist * (0.16 + Math.random() * 0.1);
      m.t = 0;
      m.active = true;
      mesh.visible = true;
    }
    m.t += dt;
    const k = m.t / m.dur;
    if (k >= 1) {
      m.active = false;
      m.timer = 5 + Math.random() * 5;
      mesh.visible = false;
      uni.uAlpha.value = 0;
      return;
    }
    const head = uni.uHead.value as THREE.Vector3;
    const tail = uni.uTail.value as THREE.Vector3;
    head.copy(m.start).addScaledVector(m.vel, m.t);
    const speedLen = m.vel.length();
    const tl = Math.min(m.len, speedLen * m.t);
    tail.copy(m.vel).multiplyScalar(-tl / speedLen).add(head);
    uni.uAlpha.value = THREE.MathUtils.smoothstep(k, 0, 0.12) * (1 - THREE.MathUtils.smoothstep(k, 0.55, 1));
  });

  return (
    <group>
      <group ref={groupRef}>
        <mesh geometry={res.skyGeo} material={res.skyMat} renderOrder={-1000} frustumCulled={false} />
        <points geometry={res.band} material={res.starMat} renderOrder={-990} frustumCulled={false} />
        <points geometry={res.field} material={res.starMat} renderOrder={-989} frustumCulled={false} />
        <mesh geometry={res.brightGeo} material={res.brightMat} renderOrder={-987} frustumCulled={false} />
      </group>
      <points geometry={res.dustGeo} material={res.dustMat} renderOrder={-985} frustumCulled={false} />
      <mesh
        ref={meteorRef}
        geometry={res.meteorGeo}
        material={res.meteorMat}
        renderOrder={-986}
        frustumCulled={false}
      />
    </group>
  );
};
