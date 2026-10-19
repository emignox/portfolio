/*
 * The asteroid belt between Mars and Jupiter.
 *
 * Everything lives on the GPU: each rock carries its own (slightly eccentric, slightly inclined)
 * orbit around the live belt ellipse written by the solar system (director.beltShape), and the
 * vertex shader advances it with Kepler-like speeds (inner rocks faster) and tumbles it.
 *
 *  - pebbles  : 4200 small fragments (icosphere detail 3, 8 baked shapes)        -> 1 draw call
 *  - boulders : 74 cratered rocks, a few up to ~0.6 units (detail 4, 6 shapes)   -> 1 draw call
 *  - points   : sub-pixel impostors of every rock + fine dust grains + faint haze -> 1 draw call
 *
 * The rock shapes are baked once on the CPU (lumps, craters with rims, fracture planes, a couple
 * of contact binaries, cavity occlusion) into a float texture read with gl_VertexID, so every
 * variant shares one instanced draw. A rock smaller than ~1 pixel is not rasterised as a mesh: it
 * is drawn as a soft point with the right flux (coverage x Lambert phase), so the belt reads as
 * fine, stable glitter at the home zoom and becomes real, crater-lit rocks when the camera flies
 * close. Shading matches planets.tsx: same light (the Sun pushed toward the camera), Lommel-Seeliger
 * regolith blend, soft terminator, near-black night side, ACES tone mapping.
 */
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { beltShape, currentMode, sunWorld } from "./director";

/* ------------------------------------------------------------------------------------------ */
/* Tuning                                                                                     */
/* ------------------------------------------------------------------------------------------ */

const PEBBLES = 2400;
const BOULDERS = 44;
// near-field detail, faded in only within NEAR_FAR units of the camera
const NEAR_PEBBLES = 1800;
const NEAR_BOULDERS = 30;
const GRAINS = 2600;
const PUFFS = 520;
const PEBBLE_VARIANTS = 8;
const BOULDER_VARIANTS = 6;
// angular speed (rad per second of "system time") of the belt centre line; planets use
// 0.26 * (0.26 / orbit)^1.5 in SolarSystem, the belt sits around orbit ~0.43
const BELT_OMEGA = 0.12;
// the planets are lit by the Sun pushed toward the camera (SolarSystem lightRef): same here
const LIGHT_OFFSET = new THREE.Vector3(0, 8, 55);
const SUN_I = 1.45;
// below this projected radius (drawing-buffer pixels) a rock is a point, above it a mesh
const MIN_PX = 1.1;
// reference belt size, only used to express family offsets in world-ish units
const REF_A = 52;
const SHAPE_W = 1024;

/* ------------------------------------------------------------------------------------------ */
/* Small CPU helpers                                                                          */
/* ------------------------------------------------------------------------------------------ */

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

function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

// seeded 3D gradient noise (improved Perlin), roughly -1..1
function makeNoise(rand: () => number) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = (h: number, x: number, y: number, z: number) => {
    const g = h & 15;
    const u = g < 8 ? x : y;
    const v = g < 4 ? y : g === 12 || g === 14 ? x : z;
    return ((g & 1) === 0 ? u : -u) + ((g & 2) === 0 ? v : -v);
  };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  return (x: number, y: number, z: number) => {
    const fx = Math.floor(x);
    const fy = Math.floor(y);
    const fz = Math.floor(z);
    const X = fx & 255;
    const Y = fy & 255;
    const Z = fz & 255;
    x -= fx;
    y -= fy;
    z -= fz;
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = perm[X] + Y;
    const AA = perm[A] + Z;
    const AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y;
    const BA = perm[B] + Z;
    const BB = perm[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
        lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
        v,
      ),
      lerp(
        lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
        v,
      ),
      w,
    );
  };
}

function fbm(n: (x: number, y: number, z: number) => number, x: number, y: number, z: number, oct: number) {
  let s = 0;
  let a = 0.5;
  for (let i = 0; i < oct; i++) {
    s += a * n(x, y, z);
    const nx = 0.8 * y + 0.6 * z;
    const ny = -0.8 * x + 0.36 * y - 0.48 * z;
    const nz = -0.6 * x - 0.48 * y + 0.64 * z;
    x = nx * 2.03;
    y = ny * 2.03;
    z = nz * 2.03;
    a *= 0.5;
  }
  return s;
}

// polynomial smooth minimum
function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

// indexed unit icosphere (shared vertices, so the baked normals are smooth)
function icosphere(detail: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  const v: number[] = [
    -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t,
    0, 1,
  ];
  for (let i = 0; i < v.length; i += 3) {
    const l = Math.hypot(v[i], v[i + 1], v[i + 2]);
    v[i] /= l;
    v[i + 1] /= l;
    v[i + 2] /= l;
  }
  let f: number[] = [
    0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2,
    3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
  ];
  for (let d = 0; d < detail; d++) {
    const cache = new Map<number, number>();
    const mid = (a: number, b: number) => {
      const key = a < b ? a * 100003 + b : b * 100003 + a;
      const hit = cache.get(key);
      if (hit !== undefined) return hit;
      const x = v[a * 3] + v[b * 3];
      const y = v[a * 3 + 1] + v[b * 3 + 1];
      const z = v[a * 3 + 2] + v[b * 3 + 2];
      const l = Math.hypot(x, y, z);
      v.push(x / l, y / l, z / l);
      const idx = v.length / 3 - 1;
      cache.set(key, idx);
      return idx;
    };
    const nf: number[] = [];
    for (let i = 0; i < f.length; i += 3) {
      const a = f[i];
      const b = f[i + 1];
      const c = f[i + 2];
      const ab = mid(a, b);
      const bc = mid(b, c);
      const ca = mid(c, a);
      nf.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
    }
    f = nf;
  }
  // outward (counter-clockwise) winding
  for (let i = 0; i < f.length; i += 3) {
    const a = f[i] * 3;
    const b = f[i + 1] * 3;
    const c = f[i + 2] * 3;
    const ux = v[b] - v[a];
    const uy = v[b + 1] - v[a + 1];
    const uz = v[b + 2] - v[a + 2];
    const wx = v[c] - v[a];
    const wy = v[c + 1] - v[a + 1];
    const wz = v[c + 2] - v[a + 2];
    const nx = uy * wz - uz * wy;
    const ny = uz * wx - ux * wz;
    const nz = ux * wy - uy * wx;
    if (nx * v[a] + ny * v[a + 1] + nz * v[a + 2] < 0) {
      const tmp = f[i + 1];
      f[i + 1] = f[i + 2];
      f[i + 2] = tmp;
    }
  }
  return { pos: new Float32Array(v), index: new Uint16Array(f) };
}

/* ------------------------------------------------------------------------------------------ */
/* Baked rock shapes                                                                          */
/* ------------------------------------------------------------------------------------------ */

interface ShapeSet {
  geometry: THREE.InstancedBufferGeometry;
  texture: THREE.DataTexture;
  rows: number;
}

// rows of the texture for variant k: [k*2*rows .. ) = position.xyz + cavity AO,
// [(k*2+1)*rows .. ) = normal.xyz + albedo modulation
function bakeShapes(detail: number, variants: number, seed: number, boulder: boolean): ShapeSet {
  const { pos, index } = icosphere(detail);
  const n = pos.length / 3;
  const rows = Math.ceil(n / SHAPE_W);
  const data = new Float32Array(SHAPE_W * rows * 2 * variants * 4);
  const P = new Float32Array(n * 3);
  const N = new Float32Array(n * 3);
  const S = new Float32Array(n * 3);
  const alb = new Float32Array(n);

  // mean edge length of the sphere, used to normalise the cavity term
  let edge = 0;
  for (let i = 0; i < index.length; i += 3) {
    const a = index[i] * 3;
    const b = index[i + 1] * 3;
    edge += Math.hypot(pos[a] - pos[b], pos[a + 1] - pos[b + 1], pos[a + 2] - pos[b + 2]);
  }
  edge /= index.length / 3;

  for (let k = 0; k < variants; k++) {
    const rand = mulberry32(seed * 7919 + k * 104729 + 17);
    const noise = makeNoise(rand);
    const o = [rand() * 50, rand() * 50, rand() * 50];

    // craters: power-law radii, a few fresh (bright floors)
    const nCr = boulder ? 16 + Math.floor(rand() * 14) : 2 + Math.floor(rand() * 3);
    const cr: number[] = [];
    for (let c = 0; c < nCr; c++) {
      const z = rand() * 2 - 1;
      const ph = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - z * z);
      const rad = boulder ? 0.08 + 0.42 * Math.pow(rand(), 2.4) : 0.3 + 0.4 * rand();
      const depth = boulder ? 0.55 + 0.35 * rand() : 0.35 + 0.25 * rand();
      const fresh = rand() < 0.22 ? 0.6 + 0.4 * rand() : 0;
      cr.push(s * Math.cos(ph), s * Math.sin(ph), z, rad, depth, fresh);
    }
    // fracture planes: fragments are chips of bigger bodies
    const nCut = boulder ? (rand() < 0.5 ? 1 + Math.floor(rand() * 2) : 0) : 3 + Math.floor(rand() * 3);
    const cuts: number[] = [];
    for (let c = 0; c < nCut; c++) {
      const z = rand() * 2 - 1;
      const ph = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - z * z);
      cuts.push(s * Math.cos(ph), s * Math.sin(ph), z, boulder ? 0.74 + 0.14 * rand() : 0.55 + 0.3 * rand());
    }
    // a couple of boulder shapes are contact binaries (two lobes, like Itokawa)
    const pinch = boulder && k % 3 === 2 ? 0.2 + 0.08 * rand() : 0;
    const sx = pinch > 0 ? 1.4 : 1;
    const lump = boulder ? 0.25 : 0.26;
    const fine = boulder ? 0.035 : 0.05;

    let mean = 0;
    for (let i = 0; i < n; i++) {
      const x = pos[i * 3];
      const y = pos[i * 3 + 1];
      const z = pos[i * 3 + 2];
      let rho = 1 + lump * fbm(noise, x * 1.1 + o[0], y * 1.1 + o[1], z * 1.1 + o[2], 3);
      let a = 1;
      for (let c = 0; c < cr.length; c += 6) {
        const cosd = x * cr[c] + y * cr[c + 1] + z * cr[c + 2];
        const rad = cr[c + 3];
        if (cosd < Math.cos(Math.min(1.7 * rad, Math.PI))) continue;
        const d = Math.acos(Math.min(1, cosd)) / rad;
        let prof = d < 1 ? Math.max(d * d - 1, -0.6) : 0;
        prof += 0.24 * Math.exp(-(((d - 1) / 0.22) ** 2));
        rho += prof * rad * cr[c + 4];
        if (cr[c + 5] > 0) a += 0.12 * cr[c + 5] * (1 - Math.min(1, Math.max(0, (d - 0.6) / 0.6)));
      }
      const uncut = rho;
      for (let c = 0; c < cuts.length; c += 4) {
        const dp = x * cuts[c] + y * cuts[c + 1] + z * cuts[c + 2];
        if (dp > 0.05) rho = smin(rho, cuts[c + 3] / dp, boulder ? 0.1 : 0.05);
      }
      // rough relief on top of everything; fracture faces get a stronger, ridged roughness
      const onCut = Math.min(1, (uncut - rho) * 12);
      const rough = 1 - Math.abs(noise(x * 3.1 + o[1], y * 3.1 + o[2], z * 3.1 + o[0]));
      rho +=
        fine * fbm(noise, x * 4.7 + o[2], y * 4.7 + o[0], z * 4.7 + o[1], 3) +
        fine * (0.8 + 0.9 * onCut) * (rough * rough - 0.5);
      if (pinch > 0) rho *= 1 - pinch * Math.exp(-((x / 0.36) ** 2));
      rho = Math.max(rho, 0.35);
      // broad albedo patches (space weathering)
      a *= 0.9 + 0.2 * (0.5 + 0.5 * fbm(noise, x * 1.7 + o[1], y * 1.7 + o[2], z * 1.7 + o[0], 2));
      alb[i] = a;
      P[i * 3] = x * rho * sx;
      P[i * 3 + 1] = y * rho;
      P[i * 3 + 2] = z * rho;
      mean += rho;
    }
    // mean radius 1 so the instance "size" is the mean radius
    const inv = n / mean / Math.cbrt(sx);
    for (let i = 0; i < n * 3; i++) P[i] *= inv;

    // smooth normals (area weighted) and neighbour averages for the cavity term
    N.fill(0);
    S.fill(0);
    const cnt = new Float32Array(n);
    for (let i = 0; i < index.length; i += 3) {
      const ia = index[i];
      const ib = index[i + 1];
      const ic = index[i + 2];
      const a = ia * 3;
      const b = ib * 3;
      const c = ic * 3;
      const ux = P[b] - P[a];
      const uy = P[b + 1] - P[a + 1];
      const uz = P[b + 2] - P[a + 2];
      const wx = P[c] - P[a];
      const wy = P[c + 1] - P[a + 1];
      const wz = P[c + 2] - P[a + 2];
      const nx = uy * wz - uz * wy;
      const ny = uz * wx - ux * wz;
      const nz = ux * wy - uy * wx;
      for (const q of [a, b, c]) {
        N[q] += nx;
        N[q + 1] += ny;
        N[q + 2] += nz;
      }
      S[a] += P[b] + P[c];
      S[a + 1] += P[b + 1] + P[c + 1];
      S[a + 2] += P[b + 2] + P[c + 2];
      S[b] += P[a] + P[c];
      S[b + 1] += P[a + 1] + P[c + 1];
      S[b + 2] += P[a + 2] + P[c + 2];
      S[c] += P[a] + P[b];
      S[c + 1] += P[a + 1] + P[b + 1];
      S[c + 2] += P[a + 2] + P[b + 2];
      cnt[ia] += 2;
      cnt[ib] += 2;
      cnt[ic] += 2;
    }
    for (let i = 0; i < n; i++) {
      const q = i * 3;
      const l = Math.hypot(N[q], N[q + 1], N[q + 2]) || 1;
      const nx = N[q] / l;
      const ny = N[q + 1] / l;
      const nz = N[q + 2] / l;
      const cx = S[q] / cnt[i] - P[q];
      const cy = S[q + 1] / cnt[i] - P[q + 1];
      const cz = S[q + 2] / cnt[i] - P[q + 2];
      // > 0 in hollows (neighbours stand above the vertex), < 0 on ridges and crater rims
      const cav = (cx * nx + cy * ny + cz * nz) / edge;
      const ao = Math.min(1.06, Math.max(0.5, 1 - (boulder ? 2.2 : 1.2) * cav));
      const col = i % SHAPE_W;
      const row = Math.floor(i / SHAPE_W);
      const t0 = ((k * 2 * rows + row) * SHAPE_W + col) * 4;
      const t1 = (((k * 2 + 1) * rows + row) * SHAPE_W + col) * 4;
      data[t0] = P[q];
      data[t0 + 1] = P[q + 1];
      data[t0 + 2] = P[q + 2];
      data[t0 + 3] = ao;
      data[t1] = nx;
      data[t1 + 1] = ny;
      data[t1 + 2] = nz;
      data[t1 + 3] = alb[i];
    }
  }

  const texture = new THREE.DataTexture(data, SHAPE_W, rows * 2 * variants, THREE.RGBAFormat, THREE.FloatType);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setIndex(new THREE.BufferAttribute(index, 1));
  // positions come from the texture (gl_VertexID); three still wants a position attribute
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return { geometry, texture, rows };
}

/* ------------------------------------------------------------------------------------------ */
/* Shaders                                                                                    */
/* ------------------------------------------------------------------------------------------ */

const GLSL_ORBIT = /* glsl */ `
uniform vec4 uBeltC;   // centre xyz, appear
uniform vec3 uBeltABD; // a, b, d of the belt ellipse
uniform float uTime;   // system time (slows down with the solar system)
uniform vec3 uLightPos;
uniform vec3 uSunPos;
uniform float uPxScale; // drawing-buffer pixels per (world unit / distance)
uniform float uMinPx;
uniform float uSunI;
attribute vec4 aOrbit; // th0, r0, omega, eccentricity
attribute vec4 aIncl;  // inclination (fraction of a), node, perihelion, spin phase
vec3 beltCenter() {
  float th = aOrbit.x + aOrbit.z * uTime;
  float r = aOrbit.y * (1.0 + aOrbit.w * cos(th - aIncl.z));
  float h = aIncl.x * sin(th - aIncl.y);
  float s = sin(th);
  vec3 p = uBeltC.xyz + vec3(uBeltABD.x * r * cos(th), -uBeltABD.y * r * s, uBeltABD.z * r * s);
  // normal of the (tilted) belt plane, pointing up
  vec3 n = vec3(0.0, uBeltABD.z, uBeltABD.y);
  float nl = length(n);
  n = nl > 1e-5 ? n / nl : vec3(0.0, 1.0, 0.0);
  return p + n * (h * uBeltABD.x);
}
// near-field rocks exist only close to the camera (from home they would be clutter)
float nearFade(float dist) { return 1.0 - smoothstep(22.0, 40.0, dist); }
vec3 rotAxis(vec3 v, vec3 k, float a) {
  float c = cos(a);
  float s = sin(a);
  return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
}
`;

const ROCK_VERT = /* glsl */ `
${GLSL_ORBIT}
uniform highp sampler2D uShape;
attribute vec4 aSpin;    // axis xyz, rate
attribute vec4 aBody;    // size (mean radius), variant, noise seed, near-field flag
attribute vec3 aStretch;
attribute vec3 aColor;   // linear albedo
varying vec3 vWorld;
varying vec3 vNrm;
varying vec3 vObj;
varying vec3 vAlb;
varying vec2 vAux;       // cavity AO, noise seed
varying float vSize;
void main() {
  vec3 c = beltCenter();
  float dist = length(cameraPosition - c);
  float size = aBody.x * uBeltC.w * mix(1.0, nearFade(dist), aBody.w);
  float ext = size * max(aStretch.x, max(aStretch.y, aStretch.z));
  // same measure as the point impostor (mean radius), so the hand-over is seamless
  float rpx = size * uPxScale / max(dist, 1e-3);
  // never let a rock swallow the camera
  size *= smoothstep(ext * 1.3, ext * 2.6, dist);
  vWorld = c; vNrm = vec3(0.0, 1.0, 0.0); vObj = vec3(0.0); vAlb = vec3(0.0); vAux = vec2(0.0); vSize = 0.0;
  if (rpx < uMinPx || size <= 1e-5) {
    // sub-pixel: the point impostor draws it; collapse the whole instance outside the clip volume
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  int vi = gl_VertexID;
  int set = int(aBody.y + 0.5) * 2;
  ivec2 t0 = ivec2(vi % ${SHAPE_W}, set * ROWS + vi / ${SHAPE_W});
  vec4 P = texelFetch(uShape, t0, 0);
  vec4 Nd = texelFetch(uShape, t0 + ivec2(0, ROWS), 0);
  float ang = aIncl.w + aSpin.w * uTime;
  vec3 w = c + rotAxis(P.xyz * aStretch * size, aSpin.xyz, ang);
  vNrm = rotAxis(normalize(Nd.xyz / aStretch), aSpin.xyz, ang);
  vWorld = w;
  vObj = P.xyz;
  vAlb = aColor * Nd.w;
  vAux = vec2(P.w, aBody.z);
  vSize = size;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}
`;

const GLSL_GNOISE = /* glsl */ `
uvec3 pcg3(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  return v;
}
vec3 grad3(vec3 c) {
  uvec3 h = pcg3(uvec3(ivec3(c) + 4096));
  return vec3(h & 0xffffu) * (2.0 / 65535.0) - 1.0;
}
float gnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = p - i;
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n000 = dot(grad3(i), f);
  float n100 = dot(grad3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float n010 = dot(grad3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float n110 = dot(grad3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float n001 = dot(grad3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float n101 = dot(grad3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float n011 = dot(grad3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float n111 = dot(grad3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
             mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
}
`;

const ROCK_FRAG = /* glsl */ `
uniform vec3 uLightPos;
uniform float uSunI;
varying vec3 vWorld;
varying vec3 vNrm;
varying vec3 vObj;
varying vec3 vAlb;
varying vec2 vAux;
varying float vSize;
${GLSL_GNOISE}
// bump mapping on an unparametrised surface (Mikkelsen 2010), heights in world units
vec3 perturb(vec3 pos, vec3 n, float dHx, float dHy) {
  vec3 sx = dFdx(pos);
  vec3 sy = dFdy(pos);
  vec3 r1 = cross(sy, n);
  vec3 r2 = cross(n, sx);
  float det = dot(sx, r1);
  vec3 g = sign(det) * (dHx * r1 + dHy * r2);
  return normalize(abs(det) * n - g);
}
void main() {
  vec3 Ng = normalize(vNrm);
  vec3 L = normalize(uLightPos - vWorld);
  vec3 V = normalize(cameraPosition - vWorld);

  // regolith relief and grain, faded out below the pixel footprint (no shimmer)
  vec3 q = vObj * 2.6 + vAux.y * 37.0;
  float fp = length(fwidth(vObj)) * 2.6;
  float h = 0.0;
  float amp = 0.5;
  float f = 1.0;
  for (int i = 0; i < 5; i++) {
    float fade = 1.0 - smoothstep(0.35, 0.8, fp * f);
    if (fade <= 0.0) break;
    float nz = gnoise(q * f);
    // pitted look: sharpen the lows a little on the finer octaves
    nz = i > 1 ? nz - 0.6 * nz * nz : nz;
    h += amp * fade * nz;
    f *= 2.17;
    amp *= 0.5;
  }
  // no relief right at the silhouette (derivative bump turns to noise at grazing angles)
  float bump = 0.16 * vSize * smoothstep(0.02, 0.25, dot(Ng, V));
  vec3 N = perturb(vWorld, Ng, dFdx(h) * bump, dFdy(h) * bump);

  float mott = gnoise(q * 0.55 + 7.3) * (1.0 - smoothstep(0.35, 0.8, fp * 0.55));
  vec3 alb = vAlb * (0.84 + 0.3 * smoothstep(-0.45, 0.45, mott + 0.6 * h));
  float ao = vAux.x;

  float nlg = dot(Ng, L);
  float nl = max(dot(N, L), 0.0);
  float nv = max(dot(N, V), 0.0);
  float ls = min(2.0 * nl / (nl + nv + 0.06), 1.6);
  float diff = mix(nl, ls, 0.35);
  diff *= smoothstep(-0.06, 0.16, nlg);
  vec3 sunCol = vec3(1.0, 0.96, 0.9) * uSunI;
  vec3 col = alb * ao * diff * sunCol;
  // whisper of fill (dust glow / planet shine) so the night side is not a hole
  col += alb * ao * (0.006 + 0.01 * max(-nlg, 0.0)) * vec3(0.8, 0.85, 1.0);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const POINT_VERT = /* glsl */ `
${GLSL_ORBIT}
attribute vec4 aPt;    // radius, kind (0 rock, 1 grain, 2 haze, 3 near-field rock), sparkle phase, sparkle amount
attribute vec3 aColor; // rock: linear albedo; grain / haze: display colour
varying vec3 vCol;
varying float vCov;
varying float vKind;
varying float vK;      // gaussian falloff constant in point-coord space
const float PI = 3.14159265;
// Henyey-Greenstein relative to isotropic
float hg(float c, float g) { float d = 1.0 + g * g - 2.0 * g * c; return (1.0 - g * g) / (d * sqrt(d)); }
void main() {
  vec3 c = beltCenter();
  vec4 mv = viewMatrix * vec4(c, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(length(mv.xyz), 1e-3);
  float app = uBeltC.w;
  float kind = aPt.y;
  bool rock = kind < 0.5 || kind > 2.5;
  vKind = rock ? 0.0 : kind;
  vec3 V = (cameraPosition - c) / dist;
  float sigma;
  if (rock) {
    // sub-pixel rock: flux = disc area x Lambert-sphere phase; hands over to the mesh above uMinPx
    float rpx = aPt.x * app * uPxScale / dist * (kind > 2.5 ? nearFade(dist) : 1.0);
    vec3 L = normalize(uLightPos - c);
    float ca = clamp(dot(L, V), -1.0, 1.0);
    float al = acos(ca);
    float phase = (sin(al) + (PI - al) * ca) / PI;
    sigma = max(rpx, 0.62);
    float w = 1.0 - smoothstep(uMinPx * 0.95, uMinPx * 1.15, rpx);
    float spark = 1.0 + aPt.w * pow(max(0.0, sin(uTime * 0.9 + aPt.z)), 60.0) * 3.0;
    // 0.8: disc-averaged brightness of the rock shading (Lambert / Lommel-Seeliger blend)
    vCol = aColor * uSunI * 0.8 * phase;
    vCov = min(1.0, rpx * rpx / (sigma * sigma)) * w * spark;
  } else if (kind < 1.5) {
    // dust grain: forward-scatters the real Sun, only resolvable close to the camera
    float rpx = aPt.x * app * uPxScale / dist;
    vec3 Ls = normalize(c - uSunPos);
    float cs = dot(Ls, V);
    float ph = 0.75 * hg(cs, 0.6) + 0.25 * hg(cs, -0.25);
    // stays a crisp speck even right in front of the camera
    sigma = clamp(rpx, 0.6, 1.2);
    float spark = 1.0 + aPt.w * pow(max(0.0, sin(uTime * 1.3 + aPt.z)), 30.0) * 2.5;
    vCol = aColor * min(ph, 4.0);
    vCov = min(1.0, rpx * rpx / (sigma * sigma)) * spark * app;
  } else {
    // haze puff: extended source, constant surface brightness, fades near the camera
    float R = aPt.x * uBeltABD.x;
    float rpx = R * uPxScale / dist;
    vec3 Ls = normalize(c - uSunPos);
    float cs = dot(Ls, V);
    float ph = 0.7 * hg(cs, 0.55) + 0.3 * hg(cs, -0.2);
    sigma = clamp(rpx * 0.55, 0.8, 40.0);
    vCol = aColor * min(ph, 5.0);
    vCov = min(1.0, rpx * rpx * 0.3 / (sigma * sigma)) * smoothstep(R * 1.5, R * 5.0, dist) * app * app;
  }
  // point covers +-3.2 sigma
  float px = sigma * 6.4;
  vK = 3.2 * 3.2 * 0.5;
  gl_PointSize = px;
  if (vCov < 1e-4) gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
}
`;

const POINT_FRAG = /* glsl */ `
varying vec3 vCol;
varying float vCov;
varying float vKind;
varying float vK;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(p, p);
  if (r2 > 1.0) discard;
  float k = exp(-r2 * vK) * vCov;
  vec3 c = vCol;
  if (vKind < 0.5) {
    // same tone curve and encoding as the rock meshes, then scaled by coverage (like MSAA)
    #ifdef TONE_MAPPING
    c = toneMapping(c);
    #endif
    c = linearToOutputTexel(vec4(c, 1.0)).rgb;
  }
  gl_FragColor = vec4(c * k, 1.0);
}
`;

/* ------------------------------------------------------------------------------------------ */
/* Belt data                                                                                  */
/* ------------------------------------------------------------------------------------------ */

interface Orbit {
  th: number;
  r: number;
  omega: number;
  ecc: number;
  inc: number;
  node: number;
  peri: number;
}

// radial position (fraction of a): denser in the middle, with two faint Kirkwood gaps
function sampleR(rand: () => number, sigma: number, lim: number) {
  for (;;) {
    const r = 1 + gaussian(rand) * sigma;
    if (Math.abs(r - 1) > lim) continue;
    const gap = Math.exp(-(((r - 0.957) / 0.005) ** 2)) + Math.exp(-(((r - 1.034) / 0.005) ** 2));
    if (rand() < gap * 0.85) continue;
    return r;
  }
}

function sampleOrbit(rand: () => number, rs: number, lim: number, incS: number): Orbit {
  const r = sampleR(rand, rs, lim);
  return {
    th: rand() * Math.PI * 2,
    r,
    omega: BELT_OMEGA * Math.pow(r, -1.5),
    ecc: rand() * 0.022,
    inc: gaussian(rand) * incS,
    node: rand() * Math.PI * 2,
    peri: rand() * Math.PI * 2,
  };
}

// albedo of the main spectral classes (sRGB-ish, squared to linear like planets.tsx)
function rockColor(rand: () => number, out: number[]) {
  const u = rand();
  let c: [number, number, number];
  if (u < 0.6) c = [0.3, 0.29, 0.28]; // C-type, carbonaceous grey
  else if (u < 0.9) c = [0.41, 0.37, 0.32]; // S-type, stony brown
  else c = [0.39, 0.39, 0.385]; // X / M-type, lighter metallic grey
  const b = 0.88 + 0.24 * rand();
  const tint = (rand() - 0.5) * 0.04;
  out[0] = (c[0] * b + tint) ** 2;
  out[1] = (c[1] * b) ** 2;
  out[2] = (c[2] * b - tint) ** 2;
}

function randomAxis(rand: () => number, out: number[]) {
  const z = rand() * 2 - 1;
  const ph = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  out[0] = s * Math.cos(ph);
  out[1] = s * Math.sin(ph);
  out[2] = z;
}

interface Tier {
  orbit: Float32Array;
  incl: Float32Array;
  spin: Float32Array;
  body: Float32Array;
  stretch: Float32Array;
  color: Float32Array;
  count: number;
}

function makeTier(n: number): Tier {
  return {
    orbit: new Float32Array(n * 4),
    incl: new Float32Array(n * 4),
    spin: new Float32Array(n * 4),
    body: new Float32Array(n * 4),
    stretch: new Float32Array(n * 3),
    color: new Float32Array(n * 3),
    count: 0,
  };
}

function pushRock(
  t: Tier,
  o: Orbit,
  size: number,
  variant: number,
  stretch: [number, number, number],
  spinRate: number,
  near: boolean,
  rand: () => number,
) {
  const i = t.count++;
  const tmp = [0, 0, 0];
  t.orbit.set([o.th, o.r, o.omega, o.ecc], i * 4);
  t.incl.set([o.inc, o.node, o.peri, rand() * Math.PI * 2], i * 4);
  randomAxis(rand, tmp);
  t.spin.set([tmp[0], tmp[1], tmp[2], spinRate * (rand() < 0.5 ? -1 : 1)], i * 4);
  t.body.set([size, variant, rand(), near ? 1 : 0], i * 4);
  const g = Math.cbrt(stretch[0] * stretch[1] * stretch[2]);
  t.stretch.set([stretch[0] / g, stretch[1] / g, stretch[2] / g], i * 3);
  rockColor(rand, tmp);
  t.color.set(tmp, i * 3);
}

const RS = 0.034; // radial sigma (fraction of a)
const LIM = 0.085; // radial limit
const INC = 0.011; // inclination sigma

const pebbleStretch = (rand: () => number): [number, number, number] => [
  1 + 0.6 * rand(),
  0.65 + 0.35 * rand(),
  0.55 + 0.4 * rand(),
];

function addBoulders(t: Tier, n: number, near: boolean, rand: () => number, out: Orbit[]) {
  for (let i = 0; i < n; i++) {
    const o = sampleOrbit(rand, RS, LIM, INC);
    out.push(o);
    const size = near
      ? 0.15 + 0.3 * Math.pow(rand(), 1.8)
      : i < 4
        ? [0.6, 0.5, 0.44, 0.38][i]
        : 0.14 + 0.24 * Math.pow(rand(), 2.4);
    pushRock(
      t,
      o,
      size,
      Math.floor(rand() * BOULDER_VARIANTS),
      [1 + 0.45 * rand(), 0.78 + 0.22 * rand(), 0.68 + 0.27 * rand()],
      0.06 + 0.3 * rand(),
      near,
      rand,
    );
  }
}

// collisional families: fragments co-orbiting near a boulder (same elements, small offsets)
function addFamilies(t: Tier, n: number, hosts: Orbit[], hostSize: (i: number) => number, near: boolean, rand: () => number) {
  let made = 0;
  for (let b = 0; made < n; b = (b + 1) % hosts.length) {
    const host = hosts[b];
    const hs = hostSize(b);
    const k = 3 + Math.floor(rand() * 6);
    for (let j = 0; j < k && made < n; j++, made++) {
      const size = near ? 0.03 + 0.11 * Math.pow(rand(), 1.6) : 0.025 + 0.08 * Math.pow(rand(), 2);
      // offset in world-ish units, kept clear of the host
      let along = 0;
      let across = 0;
      let up = 0;
      for (let tries = 0; tries < 8; tries++) {
        along = gaussian(rand) * 1.6;
        across = gaussian(rand) * 0.5;
        up = gaussian(rand) * 0.35;
        if (Math.hypot(along, across, up) > (hs + size) * 1.9 + 0.15) break;
      }
      const o: Orbit = {
        ...host,
        th: host.th + along / (REF_A * host.r * 0.75),
        r: host.r + across / REF_A,
        inc: host.inc + up / REF_A,
      };
      pushRock(t, o, size, Math.floor(rand() * PEBBLE_VARIANTS), pebbleStretch(rand), 0.25 + 1.1 * rand(), near, rand);
    }
  }
}

function addField(t: Tier, n: number, near: boolean, rand: () => number) {
  for (let i = 0; i < n; i++) {
    const o = sampleOrbit(rand, RS, LIM, INC);
    const size = near ? 0.03 + 0.15 * Math.pow(rand(), 2.2) : 0.02 + 0.11 * Math.pow(rand(), 3.5);
    pushRock(t, o, size, Math.floor(rand() * PEBBLE_VARIANTS), pebbleStretch(rand), 0.3 + 1.3 * rand(), near, rand);
  }
}

function buildBelt() {
  const rand = mulberry32(20260419);
  const pebbles = makeTier(PEBBLES + NEAR_PEBBLES);
  const boulders = makeTier(BOULDERS + NEAR_BOULDERS);

  // the population seen from everywhere: sparse, mostly tiny (subtle at the home zoom)
  const hosts: Orbit[] = [];
  addBoulders(boulders, BOULDERS, false, rand, hosts);
  const famFar = Math.floor(PEBBLES * 0.22);
  addFamilies(pebbles, famFar, hosts, (i) => boulders.body[i * 4], false, rand);
  addField(pebbles, PEBBLES - famFar, false, rand);
  // near-field detail: only drawn when the camera is close (it would be clutter from home)
  addBoulders(boulders, NEAR_BOULDERS, true, rand, hosts);
  const famNear = Math.floor(NEAR_PEBBLES * 0.35);
  addFamilies(pebbles, famNear, hosts, (i) => boulders.body[i * 4], true, rand);
  addField(pebbles, NEAR_PEBBLES - famNear, true, rand);

  // points: impostors of every rock, then grains, then haze puffs
  const nPts = pebbles.count + boulders.count + GRAINS + PUFFS;
  const pOrbit = new Float32Array(nPts * 4);
  const pIncl = new Float32Array(nPts * 4);
  const pPt = new Float32Array(nPts * 4);
  const pColor = new Float32Array(nPts * 3);
  let n = 0;
  for (const t of [boulders, pebbles]) {
    for (let i = 0; i < t.count; i++, n++) {
      pOrbit.set(t.orbit.subarray(i * 4, i * 4 + 4), n * 4);
      pIncl.set(t.incl.subarray(i * 4, i * 4 + 4), n * 4);
      const glint = rand() < 0.12 ? 0.5 + rand() : 0;
      // kind 0: rock, 3: near-field rock (radius = mean radius, the stretch keeps the volume)
      pPt.set([t.body[i * 4], t.body[i * 4 + 3] > 0.5 ? 3 : 0, rand() * Math.PI * 2, glint], n * 4);
      pColor.set(t.color.subarray(i * 3, i * 3 + 3), n * 3);
    }
  }
  for (let i = 0; i < GRAINS; i++, n++) {
    const o = sampleOrbit(rand, 0.045, 0.12, 0.016);
    pOrbit.set([o.th, o.r, o.omega, o.ecc], n * 4);
    pIncl.set([o.inc, o.node, o.peri, 0], n * 4);
    const glint = rand() < 0.15 ? 0.5 + rand() : 0;
    pPt.set([0.004 + 0.008 * rand(), 1, rand() * Math.PI * 2, glint], n * 4);
    const b = 0.5 + 0.35 * rand();
    pColor.set([0.95 * b, 0.86 * b, 0.74 * b], n * 3);
  }
  for (let i = 0; i < PUFFS; i++, n++) {
    const o = sampleOrbit(rand, 0.04, 0.11, 0.014);
    pOrbit.set([o.th, o.r, o.omega, o.ecc], n * 4);
    pIncl.set([o.inc, o.node, o.peri, 0], n * 4);
    pPt.set([0.022 + 0.03 * rand(), 2, 0, 0], n * 4);
    const b = 0.02 * (0.6 + 0.8 * rand());
    pColor.set([0.95 * b, 0.84 * b, 0.7 * b], n * 3);
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nPts * 3), 3));
  pointsGeo.setAttribute("aOrbit", new THREE.BufferAttribute(pOrbit, 4));
  pointsGeo.setAttribute("aIncl", new THREE.BufferAttribute(pIncl, 4));
  pointsGeo.setAttribute("aPt", new THREE.BufferAttribute(pPt, 4));
  pointsGeo.setAttribute("aColor", new THREE.BufferAttribute(pColor, 3));

  return { pebbles, boulders, pointsGeo };
}

function attachTier(geo: THREE.InstancedBufferGeometry, t: Tier) {
  geo.setAttribute("aOrbit", new THREE.InstancedBufferAttribute(t.orbit, 4));
  geo.setAttribute("aIncl", new THREE.InstancedBufferAttribute(t.incl, 4));
  geo.setAttribute("aSpin", new THREE.InstancedBufferAttribute(t.spin, 4));
  geo.setAttribute("aBody", new THREE.InstancedBufferAttribute(t.body, 4));
  geo.setAttribute("aStretch", new THREE.InstancedBufferAttribute(t.stretch, 3));
  geo.setAttribute("aColor", new THREE.InstancedBufferAttribute(t.color, 3));
  geo.instanceCount = t.count;
}

function createBelt() {
  const { pebbles, boulders, pointsGeo } = buildBelt();
  const uniforms = {
    uBeltC: { value: new THREE.Vector4() },
    uBeltABD: { value: new THREE.Vector3() },
    uTime: { value: 0 },
    uLightPos: { value: new THREE.Vector3() },
    uSunPos: { value: new THREE.Vector3() },
    uPxScale: { value: 800 },
    uMinPx: { value: MIN_PX },
    uSunI: { value: SUN_I },
  };

  const pShapes = bakeShapes(3, PEBBLE_VARIANTS, 3, false);
  const bShapes = bakeShapes(4, BOULDER_VARIANTS, 11, true);
  attachTier(pShapes.geometry, pebbles);
  attachTier(bShapes.geometry, boulders);

  const rockMat = (s: ShapeSet) =>
    new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uShape: { value: s.texture } },
      vertexShader: ROCK_VERT,
      fragmentShader: ROCK_FRAG,
      defines: { ROWS: s.rows },
    });
  const pebbleMesh = new THREE.Mesh(pShapes.geometry, rockMat(pShapes));
  const boulderMesh = new THREE.Mesh(bShapes.geometry, rockMat(bShapes));
  pebbleMesh.frustumCulled = false;
  boulderMesh.frustumCulled = false;

  const pointsMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  points.frustumCulled = false;

  const dispose = () => {
    for (const m of [pebbleMesh, boulderMesh]) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
    pShapes.texture.dispose();
    bShapes.texture.dispose();
    pointsGeo.dispose();
    pointsMat.dispose();
  };

  return { uniforms, pebbleMesh, boulderMesh, points, dispose };
}

/* ------------------------------------------------------------------------------------------ */
/* Component                                                                                  */
/* ------------------------------------------------------------------------------------------ */

const _buf = new THREE.Vector2();

export const AsteroidBelt: React.FC = () => {
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const res = useMemo(() => createBelt(), []);
  useEffect(() => () => res.dispose(), [res]);
  const groupRef = useRef<THREE.Group>(null);
  // system time: slows down away from home, like the planets (SolarSystem rate 1 / 0.35)
  const clock = useRef({ tau: 0, rate: 1 });

  useFrame(({ camera, gl }, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const appear = Math.min(Math.max(beltShape.appear, 0), 1);
    const visible = appear > 0.002 && beltShape.a > 0.01;
    g.visible = visible;
    if (!visible) return;

    const u = res.uniforms;
    u.uBeltC.value.set(beltShape.cx, beltShape.cy, beltShape.cz, appear);
    u.uBeltABD.value.set(beltShape.a, beltShape.b, beltShape.d);
    u.uSunPos.value.set(sunWorld.x, sunWorld.y, sunWorld.z);
    u.uLightPos.value.set(sunWorld.x, sunWorld.y, sunWorld.z).add(LIGHT_OFFSET);

    const c = clock.current;
    if (!reduceMotion) {
      const dt = Math.min(delta, 0.1);
      const want = currentMode.current === "home" ? 1 : 0.35;
      c.rate += (want - c.rate) * (1 - Math.exp(-dt * 4));
      c.tau += dt * c.rate;
    }
    u.uTime.value = c.tau;

    const pc = camera as THREE.PerspectiveCamera;
    gl.getDrawingBufferSize(_buf);
    u.uPxScale.value = 0.5 * _buf.y * pc.projectionMatrix.elements[5];
  });

  return (
    <group ref={groupRef} visible={false}>
      <primitive object={res.boulderMesh} />
      <primitive object={res.pebbleMesh} />
      <primitive object={res.points} />
    </group>
  );
};
