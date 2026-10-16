/*
 * Procedural, physically-lit planets and a living Sun.
 *
 * Every surface is generated on the GPU: at mount each planet "bakes" its albedo / relief / clouds
 * into mip-mapped cube maps (no seams, no pole pinching, clean at a few pixels wide), then a light
 * per-frame shader lights them from the real direction of the Sun (world space), with a soft
 * terminator, dark night side, ocean glint, cloud shadows, ring shadows and a ray-marched
 * atmospheric rim. The Sun is an animated plasma sphere plus layered additive corona sprites.
 *
 * Simplex noise: Ashima Arts / Stefan Gustavson (MIT), written out below.
 */
import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------------------------------ */
/* Public API                                                                                 */
/* ------------------------------------------------------------------------------------------ */

export type PlanetKind = "earth" | "mars" | "jupiter" | "neptune" | "uranus" | "saturn" | "moon";

export interface PlanetProps {
  kind: PlanetKind;
  radius: number; // world units
  sunRef: React.MutableRefObject<THREE.Vector3>; // sun WORLD position, read every frame (it can move)
  highlightRef?: React.MutableRefObject<number>; // 0..1 hover glow
  dimRef?: React.MutableRefObject<number>; // 0..1 overall brightness multiplier, default 1
  seed?: number; // varies the noise pattern
  spin?: number; // self-rotation speed rad/s, default ~0.1
  tilt?: number; // axial tilt radians
}

export interface SunProps {
  radius: number;
  position?: [number, number, number];
  intensityRef?: React.MutableRefObject<number>; // 0..1, scales the glow (intro "ignition")
}

/* ------------------------------------------------------------------------------------------ */
/* Shared GLSL                                                                                */
/* ------------------------------------------------------------------------------------------ */

const GLSL_NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
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
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
const mat3 ROT3 = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);
float fbm(vec3 p, int oct) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 10; i++) {
    if (i >= oct) break;
    s += a * snoise(p);
    p = ROT3 * p * 2.03;
    a *= 0.5;
  }
  return s;
}
float ridged(vec3 p, int oct) {
  float s = 0.0, a = 0.5, w = 1.0;
  for (int i = 0; i < 10; i++) {
    if (i >= oct) break;
    float n = 1.0 - abs(snoise(p));
    n *= n * w;
    w = clamp(n * 1.6, 0.0, 1.0);
    s += a * n;
    p = ROT3 * p * 2.1;
    a *= 0.5;
  }
  return s;
}
// smoothstep that also accepts edge0 > edge1 (plain smoothstep is undefined there)
float sstep(float a, float b, float x) {
  float t = clamp((x - a) / (b - a), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}
uvec4 pcg4d(uvec4 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
  v ^= v >> 16u;
  v.x += v.y * v.w; v.y += v.z * v.x; v.z += v.x * v.y; v.w += v.y * v.z;
  return v;
}
`;

const GLSL_COLOR_OUT = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

/* ------------------------------------------------------------------------------------------ */
/* Bake shaders (run once per planet, write cube maps)                                        */
/* ------------------------------------------------------------------------------------------ */

const BAKE_VERT = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const BAKE_HEAD = /* glsl */ `
uniform float uFace;
uniform float uSize;
uniform vec3 uSeed;
uniform float uSeedF;
uniform int uPass;
${GLSL_NOISE}
vec4 hash44(vec3 c, float s) {
  ivec3 ic = ivec3(c) + ivec3(40000);
  uvec4 u = pcg4d(uvec4(uvec3(ic), uint(s * 7.0 + uSeedF * 131.0 + 5.0)));
  return vec4(u) * (1.0 / 4294967295.0);
}
// GL cube-map convention: face index + texel -> direction
vec3 faceDir(vec2 st) {
  vec2 c = st * 2.0 - 1.0;
  int f = int(uFace + 0.5);
  if (f == 0) return vec3(1.0, -c.y, -c.x);
  if (f == 1) return vec3(-1.0, -c.y, c.x);
  if (f == 2) return vec3(c.x, 1.0, c.y);
  if (f == 3) return vec3(c.x, -1.0, -c.y);
  if (f == 4) return vec3(c.x, -c.y, 1.0);
  return vec3(-c.x, -c.y, -1.0);
}
vec3 latlon(float lat, float lon) { return vec3(cos(lat) * cos(lon), sin(lat), cos(lat) * sin(lon)); }
// vortex: rotates the domain around an elliptical storm centred at c (unit vector)
vec3 swirl(vec3 d, vec3 c, float a, float b, float strength, out float r) {
  vec3 e = normalize(cross(vec3(0.0, 1.0, 0.0), c));
  vec3 n = cross(c, e);
  vec3 off = d - c;
  float u = dot(off, e) / a;
  float v = dot(off, n) / b;
  r = sqrt(u * u + v * v);
  if (dot(d, c) < 0.0) { r = 1e3; return d; }
  float ang = strength * exp(-r * r * 0.9);
  float cs = cos(ang), sn = sin(ang);
  vec2 uv = vec2(u * cs - v * sn, u * sn + v * cs);
  return normalize(c * dot(d, c) + e * (uv.x * a) + n * (uv.y * b));
}
// one octave of impact craters (3D cellular). x = height, y = fresh/bright ejecta
vec2 craterLayer(vec3 p, float freq, float density, float salt) {
  vec3 q = p * freq;
  vec3 ip = floor(q);
  vec2 acc = vec2(0.0);
  for (int k = -1; k <= 1; k++)
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec3 c = ip + vec3(float(i), float(j), float(k));
    vec4 r = hash44(c, salt);
    if (r.w > density) continue;
    float rad = 0.22 + 0.33 * fract(r.w * 91.7 + r.x * 7.1);
    vec3 cp = c + 0.15 + 0.7 * r.xyz;
    float x = length(q - cp) / rad;
    if (x > 2.2) continue;
    float bowl = max(x * x - 1.0, -0.62);
    float rim = 0.30 * exp(-pow((x - 1.0) * 3.4, 2.0));
    float ejecta = x > 1.0 ? 0.07 * exp(-(x - 1.0) * 2.6) : 0.0;
    float peak = rad > 0.42 ? 0.24 * exp(-x * x * 26.0) : 0.0;
    acc.x += ((x < 1.0 ? bowl : 0.0) + rim + ejecta + peak) * rad;
    float fresh = step(fract(r.w * 37.3 + r.y * 3.7), 0.2);
    acc.y += fresh * (1.0 - smoothstep(0.9, 1.7, x)) + rim * 0.6;
  }
  acc.x /= freq;
  return acc;
}
`;

const BAKE_MAIN = /* glsl */ `
void main() {
  vec2 st = gl_FragCoord.xy / uSize;
  vec3 d = normalize(faceDir(st));
  if (uPass == 0) {
    vec4 a = bakeAlbedo(d);
    // stored as sqrt(linear) to keep precision in dark tones (decoded with x*x)
    gl_FragColor = vec4(pow(clamp(a.rgb, 0.0, 1.0), vec3(1.1)), a.a);
  }
#ifdef HAS_NORMAL
  else if (uPass == 1) {
    vec3 up = abs(d.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 t1 = normalize(cross(up, d));
    vec3 t2 = cross(d, t1);
    float e = 1.0 / uSize;
    float h0 = bakeHeight(d);
    float h1 = bakeHeight(normalize(d + t1 * e));
    float h2 = bakeHeight(normalize(d + t2 * e));
    vec3 n = normalize(d - BUMP * ((h1 - h0) * t1 + (h2 - h0) * t2) / e);
    gl_FragColor = vec4(n * 0.5 + 0.5, bakeAux(d));
  }
#endif
#ifdef HAS_CLOUDS
  else {
    float c = bakeClouds(d);
    gl_FragColor = vec4(c, c, c, 1.0);
  }
#endif
}
`;

/* ---- per kind bake bodies ---- */

const BAKE_EARTH = /* glsl */ `
#define HAS_NORMAL
#define HAS_CLOUDS
#define BUMP 0.6
const float SEA = 0.03;
float continent(vec3 d) {
  vec3 p = d * 1.15 + uSeed;
  vec3 w = vec3(snoise(p * 0.9), snoise(p * 0.9 + vec3(7.3, 1.1, 3.7)), snoise(p * 0.9 + vec3(2.9, 8.3, 5.1)));
  return fbm(p + w * 0.5, 8) + 0.08 * snoise(d * 0.7 + uSeed.zxy);
}
float mountains(vec3 d) { return ridged(d * 6.0 + uSeed.yzx, 6); }
float moisture(vec3 d) { return fbm(d * 2.6 + uSeed.zxy, 5); }
float bakeHeight(vec3 d) {
  float c = continent(d) - SEA;
  if (c <= 0.0) return 0.0;
  return c * 0.04 + mountains(d) * smoothstep(0.0, 0.18, c) * 0.014;
}
vec4 bakeAlbedo(vec3 d) {
  float c = continent(d) - SEA;
  float alat = abs(d.y);
  float n1 = moisture(d);
  float n2 = fbm(d * 9.0 + uSeed.yzx, 4);
  float iceLine = 0.915 + 0.03 * n2 + 0.03 * n1;
  vec3 col;
  float ocean;
  if (c < 0.0) {
    float depth = -c;
    col = mix(vec3(0.05, 0.22, 0.30), vec3(0.015, 0.055, 0.14), smoothstep(0.0, 0.07, depth));
    col = mix(col, vec3(0.008, 0.03, 0.09), smoothstep(0.07, 0.35, depth));
    ocean = 1.0;
    float seaIce = smoothstep(iceLine + 0.025, iceLine + 0.045, alat);
    col = mix(col, vec3(0.86, 0.90, 0.95), seaIce);
    ocean *= 1.0 - seaIce;
  } else {
    float m = mountains(d) * smoothstep(0.0, 0.2, c);
    float temp = 1.0 - alat * 1.12 - m * 0.3 + n2 * 0.06;
    float moist = n1 * 1.2 + 0.25 * (1.0 - smoothstep(0.0, 0.1, c))
                - 0.6 * exp(-pow((alat - 0.40) / 0.13, 2.0))
                + 0.35 * exp(-pow(alat / 0.13, 2.0));
    vec3 desert = vec3(0.80, 0.64, 0.43);
    vec3 savanna = vec3(0.52, 0.46, 0.27);
    vec3 forest = vec3(0.10, 0.22, 0.07);
    vec3 temperate = vec3(0.22, 0.31, 0.13);
    vec3 boreal = vec3(0.14, 0.20, 0.12);
    vec3 tundra = vec3(0.42, 0.40, 0.34);
    vec3 rock = vec3(0.42, 0.37, 0.31);
    vec3 wet = mix(forest, temperate, sstep(0.78, 0.6, temp));
    wet = mix(wet, boreal, sstep(0.52, 0.38, temp));
    wet = mix(wet, tundra, sstep(0.34, 0.24, temp));
    vec3 dry = mix(desert, savanna, smoothstep(-0.3, 0.0, moist));
    col = mix(dry, wet, smoothstep(-0.05, 0.25, moist));
    col = mix(col, rock, smoothstep(0.35, 0.75, m) * 0.8);
    float snow = max(smoothstep(iceLine - 0.02, iceLine + 0.005, alat), smoothstep(0.8, 1.0, m + (1.0 - temp) * 0.35));
    col = mix(col, vec3(0.93, 0.95, 0.98), snow);
    col *= 0.86 + 0.28 * (fbm(d * 32.0 + uSeed, 3) * 0.5 + 0.5);
    ocean = 0.0;
  }
  return vec4(col, ocean);
}
// city lights
float bakeAux(vec3 d) {
  float c = continent(d) - SEA;
  if (c < 0.0) return 0.0;
  float alat = abs(d.y);
  float pop = smoothstep(-0.1, 0.35, fbm(d * 2.4 + uSeed.yxz * 1.3, 4));
  pop *= 1.0 - smoothstep(0.62, 0.78, alat);
  pop *= 0.25 + 0.75 * smoothstep(-0.25, 0.1, moisture(d));
  float coast = 1.0 - smoothstep(0.0, 0.10, c);
  float cl = fbm(d * 55.0 + uSeed, 3) * 0.6 + fbm(d * 140.0 + uSeed.zyx, 2) * 0.4;
  float dots = smoothstep(0.12, 0.5, cl);
  return clamp(dots * pop * (0.35 + 0.65 * coast) * 1.6, 0.0, 1.0);
}
float bakeClouds(vec3 d) {
  // mid-latitude cyclones (spiral arms) + one tropical storm
  float r1, r2, r3, r4, r5;
  vec3 q = swirl(d, latlon(0.85, 0.4 + uSeed.x), 0.26, 0.24, 6.5, r1);
  q = swirl(q, latlon(-0.92, 2.6 + uSeed.y), 0.28, 0.26, -6.5, r2);
  q = swirl(q, latlon(0.98, -2.2 + uSeed.z), 0.22, 0.2, 5.5, r3);
  q = swirl(q, latlon(-0.78, -0.9 + uSeed.x), 0.22, 0.2, -6.0, r4);
  q = swirl(q, latlon(0.30, 1.9 + uSeed.y), 0.075, 0.075, 6.0, r5);
  float alat = abs(d.y);
  float jet = smoothstep(0.35, 0.65, alat);
  vec3 qs = vec3(q.x, q.y * (1.0 + 0.6 * jet), q.z);
  vec3 p = qs * 1.4 + uSeed.zyx + 31.0;
  vec3 a = vec3(fbm(p, 4), fbm(p + vec3(5.2, 1.3, 2.8), 4), fbm(p + vec3(1.7, 9.2, 4.4), 4));
  vec3 pw = p + 2.0 * a;
  float systems = fbm(pw * 0.9, 5);              // large overcast regions
  float fronts = ridged(pw * 1.1 + 7.0, 5);       // long frontal bands
  float cumulus = fbm(q * 22.0 + a * 2.0 + uSeed, 4);
  float lat = 0.10 * exp(-pow(alat / 0.07, 2.0))
            - 0.24 * exp(-pow((alat - 0.33) / 0.12, 2.0))
            + 0.10 * exp(-pow((alat - 0.66) / 0.18, 2.0));
  float storm = 0.3 * (exp(-r1 * r1 * 0.7) + exp(-r2 * r2 * 0.7) + exp(-r3 * r3 * 0.7) + exp(-r4 * r4 * 0.7))
              + 0.5 * exp(-r5 * r5 * 1.2);
  float cov = systems + lat + storm;
  float d1 = smoothstep(0.06, 0.46, cov);
  float d2 = smoothstep(0.6, 0.86, fronts) * smoothstep(-0.25, 0.1, cov);
  float tropic = exp(-pow(alat / 0.25, 2.0));
  float d3 = smoothstep(0.25, 0.55, cumulus) * (0.25 + 0.75 * tropic) * 0.5 * smoothstep(-0.3, -0.05, cov);
  float dens = max(max(d1, d2 * 0.85), d3);
  float edge = fbm(q * 14.0 + uSeed.yzx, 4);
  dens *= smoothstep(-0.6, 0.3, edge + dens * 0.6);
  dens *= smoothstep(0.04, 0.12, r5);
  return clamp(dens, 0.0, 1.0);
}
`;

const BAKE_MARS = /* glsl */ `
#define HAS_NORMAL
#define BUMP 0.9
float marsBase(vec3 d) { return fbm(d * 1.7 + uSeed, 6); }
vec3 tharsis() { return normalize(vec3(-0.55, 0.05, 0.83)); }
float canyon(vec3 d) {
  float lon = atan(d.z, d.x);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  float center = -0.13 + 0.04 * sin(lon * 3.0) + 0.02 * snoise(d * 6.0 + uSeed);
  float span = smoothstep(0.15, 0.4, lon) * (1.0 - smoothstep(1.3, 1.6, lon));
  float w = 0.022 + 0.012 * snoise(d * 9.0 + uSeed.yzx);
  return span * (1.0 - smoothstep(0.0, w, abs(lat - center)));
}
float bakeHeight(vec3 d) {
  float h = marsBase(d) * 0.04 + ridged(d * 4.0 + uSeed, 4) * 0.01;
  h += 0.05 * exp(-pow(length(d - tharsis()) / 0.35, 2.0));
  h += 0.035 * exp(-pow(length(d - normalize(vec3(-0.75, 0.32, 0.58))) / 0.06, 2.0));
  h -= 0.03 * canyon(d);
  // cratered southern highlands, smooth northern lowlands
  float south = sstep(0.25, -0.35, d.y + 0.15 * snoise(d * 2.0 + uSeed));
  h += craterLayer(d, 3.0, 0.1 + 0.3 * south, 11.0).x * 0.08;
  h += craterLayer(d, 7.0, 0.1 + 0.45 * south, 12.0).x * 0.22;
  h += craterLayer(d, 16.0, 0.15 + 0.45 * south, 13.0).x * 0.28;
  h += craterLayer(d, 36.0, 0.2 + 0.4 * south, 14.0).x * 0.25;
  return h;
}
vec4 bakeAlbedo(vec3 d) {
  float b = marsBase(d);
  float n2 = fbm(d * 6.0 + uSeed * 1.9, 4);
  float n3 = fbm(d * 20.0 + uSeed * 2.7, 3);
  float big = fbm(d * 0.9 + uSeed.zxy, 3);
  vec3 bright = vec3(0.82, 0.52, 0.31);
  vec3 mid = vec3(0.68, 0.38, 0.21);
  vec3 dark = vec3(0.30, 0.19, 0.13);
  vec3 dust = vec3(0.88, 0.64, 0.43);
  vec3 col = mix(mid, bright, smoothstep(-0.1, 0.3, b + n2 * 0.2));
  // large dark albedo provinces (Syrtis / Acidalia-like), with streaky wind-blown edges
  float darkM = sstep(-0.02, -0.28, b + 0.3 * big + 0.22 * n2);
  col = mix(col, dark, darkM * 0.9);
  col = mix(col, dust, exp(-pow(length(d - tharsis()) / 0.45, 2.0)) * 0.4);
  col *= 0.9 + 0.2 * (n3 * 0.5 + 0.5);
  col = mix(col, vec3(0.45, 0.25, 0.16), canyon(d) * 0.6);
  float capN = smoothstep(0.935, 0.95, d.y + 0.02 * n2 + 0.012 * n3);
  float capS = smoothstep(0.955, 0.97, -d.y + 0.02 * n2);
  col = mix(col, vec3(0.95, 0.93, 0.90), max(capN, capS));
  return vec4(col, 0.0);
}
float bakeAux(vec3 d) { return 0.0; }
`;

const BAKE_MOON = /* glsl */ `
#define HAS_NORMAL
#define BUMP 1.25
float mareMask(vec3 d) { return smoothstep(0.08, 0.2, fbm(d * 1.4 + uSeed, 5) + 0.16 * d.z); }
vec2 moonCraters(vec3 d, float mare) {
  vec2 c = vec2(0.0);
  c += craterLayer(d, 2.2, 0.45, 21.0);
  c += craterLayer(d, 4.5, 0.55, 22.0);
  c += craterLayer(d, 9.0, 0.6 - 0.3 * mare, 23.0) * vec2(1.0, 0.7);
  c += craterLayer(d, 18.0, 0.65 - 0.35 * mare, 24.0) * vec2(1.0, 0.5);
  c += craterLayer(d, 38.0, 0.7 - 0.35 * mare, 25.0) * vec2(1.0, 0.3);
  return c;
}
float rays(vec3 d) {
  vec3 q = d * 3.0;
  vec3 ip = floor(q);
  float acc = 0.0;
  for (int k = -1; k <= 1; k++)
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec3 c = ip + vec3(float(i), float(j), float(k));
    vec4 r = hash44(c, 31.0);
    if (r.w > 0.16) continue;
    vec3 cp = c + 0.2 + 0.6 * r.xyz;
    vec3 v = q - cp;
    float dist = length(v);
    float x = dist / (0.035 + 0.03 * r.x);
    if (x > 30.0) continue;
    vec3 dv = v / max(dist, 1e-4);
    float a = snoise(dv * 6.0 + r.xyz * 40.0) * 0.5 + 0.5;
    float streak = pow(smoothstep(0.5, 1.0, a), 1.5);
    acc += streak * exp(-x * 0.16) * smoothstep(0.8, 1.5, x) + exp(-pow(x / 2.0, 2.0)) * 0.5;
  }
  return acc;
}
float bakeHeight(vec3 d) {
  float m = mareMask(d);
  vec2 c = moonCraters(d, m);
  return c.x * 0.55 + fbm(d * 8.0 + uSeed, 4) * 0.006 * (1.0 - m) - m * 0.008;
}
vec4 bakeAlbedo(vec3 d) {
  float m = mareMask(d);
  vec2 c = moonCraters(d, m);
  float n = fbm(d * 10.0 + uSeed * 3.0, 4);
  vec3 tint = mix(vec3(1.0), vec3(1.04, 1.0, 0.94), fract(uSeedF * 0.618));
  vec3 high = vec3(0.60, 0.58, 0.55) * tint;
  vec3 mare = vec3(0.30, 0.29, 0.28) * tint;
  vec3 col = mix(high, mare, m * (0.85 + 0.15 * n));
  col *= 0.9 + 0.2 * (n * 0.5 + 0.5);
  col += vec3(0.16) * clamp(c.y, 0.0, 1.5) * 0.4;
  col += vec3(0.20) * min(rays(d), 1.5);
  return vec4(col, 0.0);
}
float bakeAux(vec3 d) { return 0.0; }
`;

const BAKE_JUPITER = /* glsl */ `
const int BN = 21;
const float BY[BN] = float[BN](-1.0, -0.80, -0.66, -0.58, -0.50, -0.45, -0.385, -0.31, -0.20, -0.12,
                                0.0, 0.10, 0.155, 0.29, 0.355, 0.46, 0.53, 0.62, 0.72, 0.85, 1.0);
const vec3 BC[BN] = vec3[BN](
  vec3(0.40, 0.39, 0.38), vec3(0.50, 0.46, 0.42), vec3(0.68, 0.60, 0.50), vec3(0.56, 0.46, 0.37),
  vec3(0.82, 0.74, 0.62), vec3(0.60, 0.47, 0.36), vec3(0.91, 0.85, 0.75), vec3(0.60, 0.40, 0.27),
  vec3(0.55, 0.36, 0.24), vec3(0.86, 0.76, 0.60), vec3(0.93, 0.86, 0.70), vec3(0.85, 0.71, 0.53),
  vec3(0.50, 0.32, 0.22), vec3(0.57, 0.39, 0.28), vec3(0.90, 0.83, 0.70), vec3(0.63, 0.49, 0.37),
  vec3(0.84, 0.76, 0.64), vec3(0.62, 0.54, 0.45), vec3(0.70, 0.64, 0.56), vec3(0.52, 0.49, 0.45),
  vec3(0.40, 0.39, 0.39));
vec3 bands(float y) {
  y = clamp(y, -1.0, 1.0);
  vec3 c = BC[0];
  for (int i = 0; i < BN - 1; i++) c = mix(c, BC[i + 1], smoothstep(BY[i], BY[i + 1], y));
  return c;
}
vec4 bakeAlbedo(vec3 d) {
  float rG, rO1, rO2, rO3, rB;
  vec3 q = swirl(d, latlon(-0.385, 2.2), 0.14, 0.085, 3.2, rG);
  q = swirl(q, latlon(-0.575, 2.2), 0.04, 0.03, 2.6, rO1);
  q = swirl(q, latlon(-0.575, 3.0), 0.034, 0.027, 2.6, rO2);
  q = swirl(q, latlon(-0.70, -1.5), 0.03, 0.025, 2.6, rO3);
  q = swirl(q, latlon(0.30, -0.6), 0.045, 0.02, -2.2, rB);
  // multi-scale zonal turbulence: each octave advects the domain, mostly along longitude
  // turbulence is strongest where neighbouring bands shear (belt/zone boundaries)
  float e = 0.012;
  float shear = abs(dot(bands(q.y + e) - bands(q.y - e), vec3(1.0))) / (2.0 * e);
  float turb = 0.35 + 1.4 * clamp(shear * 0.18, 0.0, 1.0);
  vec3 q2 = q;
  q2.y += 0.014 * fbm(vec3(q.x * 2.0, q.y * 9.0, q.z * 2.0) + uSeed, 4);
  float amp = 0.045 * turb;
  float fr = 5.0;
  for (int i = 0; i < 5; i++) {
    vec3 s = vec3(q2.x * fr, q2.y * fr * 2.2, q2.z * fr) + uSeed * float(i + 1);
    q2 += amp * vec3(snoise(s), 0.32 * snoise(s + 19.1), snoise(s + 37.7));
    fr *= 2.1;
    amp *= 0.55;
  }
  q2 = normalize(q2);
  vec3 col = bands(q2.y);
  float fil = fbm(vec3(q2.x * 3.0, q2.y * 70.0, q2.z * 3.0) + uSeed * 1.7, 4);
  col *= 0.93 + 0.13 * fil;
  float eddy = fbm(q2 * 24.0 + uSeed.zxy, 4);
  float lum = dot(col, vec3(0.333));
  float belt = 1.0 - smoothstep(0.55, 0.8, lum);
  col *= 1.0 + 0.12 * eddy * (0.4 + belt);
  float cells = smoothstep(0.5, 0.8, fbm(q2 * 42.0 + 3.0, 3)) * belt;
  col = mix(col, vec3(0.92, 0.88, 0.80), cells * 0.45);
  float fest = smoothstep(0.3, 0.65, fbm(vec3(q2.x * 6.0, q2.y * 14.0, q2.z * 6.0) + 11.0, 4)) * exp(-pow((q2.y - 0.125) / 0.025, 2.0));
  col = mix(col, vec3(0.36, 0.38, 0.44), fest * 0.7);
  float core = 1.0 - smoothstep(0.75, 1.0, rG);
  vec3 grs = mix(vec3(0.70, 0.38, 0.26), vec3(0.82, 0.55, 0.42), 1.0 - smoothstep(0.0, 0.7, rG));
  grs *= 0.88 + 0.24 * (fbm(q * 30.0, 3) * 0.5 + 0.5);
  col = mix(col, grs, core);
  float collar = exp(-pow((rG - 1.18) / 0.2, 2.0));
  col = mix(col, vec3(0.94, 0.90, 0.82), collar * 0.55);
  float ov = (1.0 - smoothstep(0.55, 1.0, rO1)) + (1.0 - smoothstep(0.55, 1.0, rO2)) + (1.0 - smoothstep(0.55, 1.0, rO3));
  col = mix(col, vec3(0.95, 0.93, 0.90), clamp(ov, 0.0, 1.0) * 0.85);
  col = mix(col, vec3(0.40, 0.24, 0.17), (1.0 - smoothstep(0.5, 1.0, rB)) * 0.8);
  col = mix(col, col * vec3(0.78, 0.80, 0.86), smoothstep(0.72, 0.97, abs(d.y)));
  return vec4(col, 0.0);
}
`;

const BAKE_SATURN = /* glsl */ `
const int BN = 15;
const float BY[BN] = float[BN](-1.0, -0.78, -0.58, -0.42, -0.27, -0.13, 0.0, 0.12, 0.25, 0.40, 0.55, 0.72, 0.86, 0.95, 1.0);
const vec3 BC[BN] = vec3[BN](
  vec3(0.55, 0.55, 0.50), vec3(0.68, 0.62, 0.48), vec3(0.79, 0.69, 0.50), vec3(0.87, 0.77, 0.57),
  vec3(0.79, 0.67, 0.47), vec3(0.90, 0.80, 0.60), vec3(0.94, 0.85, 0.65), vec3(0.88, 0.77, 0.57),
  vec3(0.77, 0.65, 0.45), vec3(0.86, 0.76, 0.56), vec3(0.75, 0.67, 0.51), vec3(0.66, 0.63, 0.55),
  vec3(0.56, 0.59, 0.58), vec3(0.48, 0.55, 0.58), vec3(0.45, 0.52, 0.56));
vec3 bands(float y) {
  y = clamp(y, -1.0, 1.0);
  vec3 c = BC[0];
  for (int i = 0; i < BN - 1; i++) c = mix(c, BC[i + 1], smoothstep(BY[i], BY[i + 1], y));
  return c;
}
vec4 bakeAlbedo(vec3 d) {
  vec3 w = vec3(fbm(d * 3.0 + uSeed, 3), fbm(d * 3.0 + uSeed + 4.3, 3), fbm(d * 3.0 + uSeed + 8.1, 3));
  vec3 q = d + w * 0.015;
  float streak = fbm(vec3(q.x * 2.0, q.y * 40.0, q.z * 2.0) + uSeed, 5);
  float y = q.y + streak * 0.0025;
  vec3 col = bands(y);
  col *= 0.975 + 0.05 * streak;
  col *= 0.99 + 0.01 * sin(y * 170.0 + streak * 3.0);
  float rr = length(d.xz);
  float phi = atan(d.z, d.x);
  float seg = mod(phi + 0.5235988, 1.0471976) - 0.5235988;
  float hexR = 0.21 * 0.8660254 / cos(seg);
  float north = step(0.0, d.y);
  col = mix(col, vec3(0.45, 0.55, 0.60), north * (1.0 - smoothstep(hexR - 0.01, hexR + 0.01, rr)) * 0.5);
  col = mix(col, vec3(0.82, 0.79, 0.70), north * exp(-pow((rr - hexR) / 0.012, 2.0)) * 0.35);
  col = mix(col, vec3(0.35, 0.40, 0.45), north * (1.0 - smoothstep(0.02, 0.05, rr)));
  return vec4(col, 0.0);
}
`;

const BAKE_NEPTUNE = /* glsl */ `
const int BN = 11;
const float BY[BN] = float[BN](-1.0, -0.75, -0.58, -0.45, -0.25, 0.0, 0.2, 0.38, 0.55, 0.78, 1.0);
const vec3 BC[BN] = vec3[BN](
  vec3(0.22, 0.38, 0.76), vec3(0.24, 0.42, 0.84), vec3(0.17, 0.32, 0.72), vec3(0.24, 0.43, 0.86),
  vec3(0.27, 0.47, 0.90), vec3(0.25, 0.45, 0.89), vec3(0.28, 0.48, 0.91), vec3(0.20, 0.37, 0.80),
  vec3(0.25, 0.44, 0.86), vec3(0.22, 0.40, 0.80), vec3(0.21, 0.37, 0.75));
vec3 bands(float y) {
  y = clamp(y, -1.0, 1.0);
  vec3 c = BC[0];
  for (int i = 0; i < BN - 1; i++) c = mix(c, BC[i + 1], smoothstep(BY[i], BY[i + 1], y));
  return c;
}
vec4 bakeAlbedo(vec3 d) {
  float rS;
  vec3 q = swirl(d, latlon(-0.36, 2.1), 0.12, 0.065, 2.2, rS);
  vec3 w = vec3(fbm(q * 3.0 + uSeed, 4), fbm(q * 3.0 + uSeed + 2.7, 4), fbm(q * 3.0 + uSeed + 6.1, 4));
  vec3 q2 = q + w * 0.03;
  vec3 col = bands(q2.y + fbm(vec3(q2.x * 3.0, q2.y * 20.0, q2.z * 3.0), 4) * 0.02);
  col *= 0.94 + 0.12 * (fbm(q2 * 8.0, 4) * 0.5 + 0.5);
  float spot = 1.0 - smoothstep(0.55, 1.0, rS);
  col = mix(col, vec3(0.07, 0.13, 0.40), spot * 0.85);
  vec3 comp = latlon(-0.45, 2.12);
  float cmp = exp(-pow(length((d - comp) * vec3(1.0, 2.5, 1.0)) / 0.05, 2.0));
  float s = fbm(vec3(q2.x * 2.2, q2.y * 26.0, q2.z * 2.2) + uSeed * 2.1 + 5.0, 5);
  float lat = exp(-pow((d.y - 0.42) / 0.10, 2.0)) + exp(-pow((d.y + 0.62) / 0.06, 2.0)) + 0.6 * exp(-pow((d.y + 0.18) / 0.05, 2.0));
  float st = smoothstep(0.2, 0.62, s) * lat;
  col = mix(col, vec3(0.92, 0.96, 1.0), clamp(st * 0.9 + cmp * 0.9, 0.0, 1.0));
  return vec4(col, 0.0);
}
`;

const BAKE_URANUS = /* glsl */ `
vec4 bakeAlbedo(vec3 d) {
  float n = fbm(vec3(d.x * 2.0, d.y * 14.0, d.z * 2.0) + uSeed, 4);
  float y = d.y + n * 0.02;
  vec3 col = mix(vec3(0.52, 0.78, 0.84), vec3(0.6, 0.83, 0.87), 0.5 + 0.5 * sin(y * 9.0));
  col *= 0.985 + 0.03 * n;
  col = mix(col, vec3(0.68, 0.88, 0.9), smoothstep(0.55, 0.9, -y) * 0.6);
  col = mix(col, vec3(0.64, 0.86, 0.89), smoothstep(0.65, 0.95, y) * 0.4);
  return vec4(col, 0.0);
}
`;

/* ------------------------------------------------------------------------------------------ */
/* Render shaders                                                                             */
/* ------------------------------------------------------------------------------------------ */

const SURFACE_VERT = /* glsl */ `
varying vec3 vObj;
varying vec3 vWorld;
void main() {
  vObj = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const SURFACE_FRAG = /* glsl */ `
uniform samplerCube uAlbedo;
uniform mat3 uNormalMat;
uniform vec3 uSunPos;
uniform vec3 uCenter;
uniform float uPlanetR;
uniform float uDim;
uniform float uHighlight;
uniform float uSunI;
uniform vec3 uRimColor;
uniform float uHaze;
uniform float uLS;
uniform float uLimb;
uniform float uDrift;
#ifdef HAS_NORMAL
uniform samplerCube uNormalMap;
#endif
#ifdef EARTH
uniform samplerCube uClouds;
uniform vec2 uCloudRot;
#endif
#ifdef RING_SHADOW
uniform sampler2D uRingTex;
uniform vec3 uRingNormal;
uniform float uRingInner;
uniform float uRingOuter;
#endif
varying vec3 vObj;
varying vec3 vWorld;

vec3 rotY(vec3 v, vec2 cs) { return vec3(cs.x * v.x - cs.y * v.z, v.y, cs.y * v.x + cs.x * v.z); }

void main() {
  vec3 d = normalize(vObj);
  vec3 Ng = normalize(vWorld - uCenter);
  vec3 L = normalize(uSunPos - vWorld);
  vec3 V = normalize(cameraPosition - vWorld);
  float nlg = dot(Ng, L);
  float nv = clamp(dot(Ng, V), 0.0, 1.0);

  vec3 sd = d;
#ifdef GAS
  float ang = uDrift * sin(d.y * 15.708);
  sd = rotY(d, vec2(cos(ang), sin(ang)));
#endif
  vec4 A = texture(uAlbedo, sd);
  vec3 alb = A.rgb * A.rgb;

  vec3 N = Ng;
#ifdef HAS_NORMAL
  vec4 NM = texture(uNormalMap, d);
  N = normalize(uNormalMat * (NM.xyz * 2.0 - 1.0));
#endif
  float nl = max(dot(N, L), 0.0);
  float nvb = max(dot(N, V), 0.0);
  float ls = min(2.0 * nl / (nl + nvb + 0.08), 1.5);
  float diff = mix(nl, ls, uLS);
  diff *= smoothstep(-0.02, 0.10, nlg);
  diff *= mix(1.0, 0.55 + 0.45 * sqrt(nv), uLimb);

  vec3 sunCol = vec3(1.0, 0.96, 0.9) * uSunI;
  vec3 col = alb * diff * sunCol;

#ifdef RING_SHADOW
  float denom = dot(L, uRingNormal);
  if (abs(denom) > 1e-4) {
    float t = dot(uCenter - vWorld, uRingNormal) / denom;
    if (t > 0.0) {
      vec3 Q = vWorld + L * t;
      float rr = length(Q - uCenter) / uPlanetR;
      float u = (rr - uRingInner) / (uRingOuter - uRingInner);
      if (u > 0.0 && u < 1.0) {
        float a = textureLod(uRingTex, vec2(u, 0.5), 2.0).a;
        col *= 1.0 - 0.88 * a;
      }
    }
  }
#endif

#ifdef EARTH
  float ocean = A.a;
  float cloud = texture(uClouds, rotY(d, uCloudRot)).r;
  vec3 Lobj = normalize(transpose(uNormalMat) * L);
  vec3 Lt = Lobj - d * dot(Lobj, d);
  float cshadow = texture(uClouds, rotY(normalize(d + Lt * 0.012), uCloudRot)).r;
  col *= 1.0 - 0.6 * cshadow;
  vec3 H = normalize(L + V);
  float nh = max(dot(Ng, H), 0.0);
  float fres = 0.02 + 0.98 * pow(1.0 - nv, 5.0);
  float spec = (pow(nh, 160.0) * 0.9 + pow(nh, 24.0) * 0.1) * (0.3 + fres);
  col += vec3(1.0, 0.88, 0.7) * spec * ocean * (1.0 - cloud) * smoothstep(0.0, 0.15, nlg) * uSunI;
  float cdiff = clamp(nlg * 0.95 + 0.05, 0.0, 1.0) * smoothstep(-0.08, 0.06, nlg);
  vec3 ctint = mix(vec3(1.0, 0.6, 0.4), vec3(1.0), smoothstep(-0.02, 0.12, nlg));
  col = mix(col, vec3(0.86) * ctint * cdiff * sunCol, cloud);
  float night = 1.0 - smoothstep(-0.15, 0.02, nlg);
  col += vec3(1.0, 0.6, 0.26) * NM.a * NM.a * night * (1.0 - 0.9 * cloud) * 1.1;
#endif

  float day = smoothstep(-0.12, 0.3, nlg);
  float haze = pow(1.0 - nv, 4.0) * uHaze * day;
  col = col * (1.0 - 0.5 * haze) + uRimColor * haze * uSunI;
  col += alb * (0.004 + 0.07 * uHighlight);
  // hover: soft fresnel outline all around the limb
  col += uRimColor * pow(1.0 - nv, 3.0) * 0.35 * uHighlight;
  col *= uDim;
  gl_FragColor = vec4(col, 1.0);
  ${GLSL_COLOR_OUT}
}
`;

const ATMO_VERT = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const ATMO_FRAG = /* glsl */ `
uniform vec3 uSunPos;
uniform vec3 uCenter;
uniform float uPlanetR;
uniform float uAtmScale;
uniform vec3 uColor;
uniform vec3 uTwilight;
uniform float uIntensity;
uniform float uFalloff;
uniform float uDim;
uniform float uHighlight;
uniform float uSunI;
varying vec3 vWorld;
vec2 sphereHit(vec3 ro, vec3 rd, vec3 c, float r) {
  vec3 oc = ro - c;
  float b = dot(oc, rd);
  float k = dot(oc, oc) - r * r;
  float h = b * b - k;
  if (h < 0.0) return vec2(-1.0);
  h = sqrt(h);
  return vec2(-b - h, -b + h);
}
void main() {
  float atmR = uPlanetR * uAtmScale;
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vWorld - ro);
  vec2 ta = sphereHit(ro, rd, uCenter, atmR);
  if (ta.y <= 0.0) discard;
  float t0 = max(ta.x, 0.0);
  float t1 = ta.y;
  vec2 tp = sphereHit(ro, rd, uCenter, uPlanetR);
  if (tp.x > 0.0) t1 = min(t1, tp.x);
  float H = atmR - uPlanetR;
  vec3 Ls = normalize(uSunPos - uCenter);
  float dt = (t1 - t0) / 8.0;
  vec3 acc = vec3(0.0);
  float glow = 0.0;
  for (int i = 0; i < 8; i++) {
    vec3 p = ro + rd * (t0 + (float(i) + 0.5) * dt);
    vec3 q = p - uCenter;
    float r = length(q);
    float h = clamp((r - uPlanetR) / H, 0.0, 1.0);
    float dens = exp(-h * uFalloff) * (1.0 - h);
    float mu = dot(q / r, Ls);
    float lit = smoothstep(-0.12, 0.1, mu);
    vec3 c = mix(uTwilight, uColor, smoothstep(-0.06, 0.12, mu));
    acc += c * dens * lit;
    glow += dens;
  }
  acc *= dt / H;
  glow *= dt / H;
  float cosT = dot(rd, Ls);
  // Rayleigh + Henyey-Greenstein forward lobe (bright ring when the planet eclipses the star)
  const float g = 0.72;
  float hg = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosT, 1.5);
  float phase = 0.3 * (1.0 + cosT * cosT) + 0.2 * hg;
  vec3 col = acc * phase * uIntensity * (1.0 + 1.6 * uHighlight) * uSunI;
  col += uColor * glow * 0.12 * uHighlight;
  col *= uDim;
  gl_FragColor = vec4(col, 1.0);
  ${GLSL_COLOR_OUT}
}
`;

const RING_VERT = /* glsl */ `
varying vec3 vWorld;
varying vec2 vLocal;
void main() {
  vLocal = position.xy;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const RING_FRAG = /* glsl */ `
uniform sampler2D uRingTex;
uniform float uRingInner;
uniform float uRingOuter;
uniform vec3 uSunPos;
uniform vec3 uCenter;
uniform float uPlanetR;
uniform vec3 uRingNormal;
uniform float uDim;
uniform float uHighlight;
uniform float uSunI;
varying vec3 vWorld;
varying vec2 vLocal;
void main() {
  float r = length(vLocal);
  float u = (r - uRingInner) / (uRingOuter - uRingInner);
  if (u < 0.0 || u > 1.0) discard;
  vec4 s = texture(uRingTex, vec2(u, 0.5));
  float a = s.a;
  if (a < 0.003) discard;
  vec3 albedo = s.rgb * s.rgb;
  vec3 L = normalize(uSunPos - vWorld);
  vec3 V = normalize(cameraPosition - vWorld);
  float nl = dot(uRingNormal, L);
  float nv = dot(uRingNormal, V);
  vec3 oc = vWorld - uCenter;
  float tc = -dot(oc, L);
  float dc = length(oc + L * tc);
  float shadow = tc > 0.0 ? smoothstep(uPlanetR * 0.985, uPlanetR * 1.02, dc) : 1.0;
  vec3 c;
  if (nl * nv > 0.0) {
    c = albedo * (0.3 + 0.7 * sqrt(abs(nl)));
  } else {
    // unlit face: light diffusely transmitted through the ring (thin parts glow, dense B ring stays dark)
    float fwd = pow(max(-dot(V, L), 0.0), 3.0);
    c = albedo * (1.0 - a) * (1.0 - a) * (0.6 + 2.6 * fwd);
  }
  c *= shadow * uSunI * vec3(1.0, 0.96, 0.9);
  c += albedo * 0.05 * uHighlight;
  c *= uDim;
  gl_FragColor = vec4(c, a);
  ${GLSL_COLOR_OUT}
}
`;

/* ---- Sun ---- */

// The star is drawn as a camera-facing impostor (a ray-traced sphere on a quad) so that it stays a
// perfect disc, concentric with its glow sprites, anywhere in a wide-angle frame.
const SUN_FRAG = /* glsl */ `
uniform float uTime;
uniform float uBright;
uniform mat3 uViewToObj;
varying vec2 vUv;
${GLSL_NOISE}
vec3 hash33(vec3 c) {
  uvec4 u = pcg4d(uvec4(uvec3(ivec3(c) + ivec3(40000)), 17u));
  return vec3(u.xyz) * (1.0 / 4294967295.0);
}
vec2 worley(vec3 p, float t) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float f1 = 8.0, f2 = 8.0;
  for (int k = -1; k <= 1; k++)
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec3 o = vec3(float(i), float(j), float(k));
    vec3 h = hash33(ip + o);
    vec3 pt = o + 0.5 + 0.42 * sin(t + 6.2831 * h);
    float dd = length(pt - fp);
    if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) { f2 = dd; }
  }
  return vec2(f1, f2);
}
vec3 ramp(float t) {
  vec3 c0 = vec3(0.16, 0.012, 0.0);
  vec3 c1 = vec3(0.75, 0.15, 0.008);
  vec3 c2 = vec3(1.25, 0.43, 0.05);
  vec3 c3 = vec3(1.85, 0.98, 0.24);
  vec3 c4 = vec3(2.6, 2.0, 1.05);
  t = clamp(t, 0.0, 1.0);
  if (t < 0.3) return mix(c0, c1, t / 0.3);
  if (t < 0.55) return mix(c1, c2, (t - 0.3) / 0.25);
  if (t < 0.8) return mix(c2, c3, (t - 0.55) / 0.25);
  return mix(c3, c4, (t - 0.8) / 0.2);
}
void main() {
  vec2 q = vUv * 2.0 - 1.0;
  float rr = length(q);
  float aa = fwidth(rr) * 1.2;
  if (rr > 1.0 + aa) discard;
  float mu = sqrt(max(1.0 - rr * rr, 0.0));
  vec3 d = normalize(uViewToObj * vec3(q, mu));
  float t = uTime;
  // pixel footprint on the unit sphere: fades detail that would shimmer at small sizes
  float px = length(fwidth(d));
  vec3 p = d * 2.0;
  vec3 w = vec3(snoise(p + vec3(0.0, 0.0, t * 0.03)),
                snoise(p + vec3(5.2, 1.3, -t * 0.025)),
                snoise(p + vec3(2.1, 7.7, t * 0.02)));
  float big = fbm(p * 1.3 + w * 0.7, 4);
  // magnetic plasma filaments (bright ridges)
  float plasma = ridged(d * 4.5 + w * 1.3 + vec3(t * 0.015, 0.0, -t * 0.012), 4);
  float detailA = 1.0 - smoothstep(0.02, 0.06, px * 3.0);
  vec2 F = worley(d * 22.0 + w * 0.6, t * 0.5);
  float gran = smoothstep(0.0, 0.3, F.y - F.x) * (1.0 - 0.6 * F.x);
  float gA = 1.0 - smoothstep(0.25, 0.6, px * 22.0);
  vec2 F2 = worley(d * 55.0 + w * 1.1, t * 0.8 + 3.0);
  float gran2 = smoothstep(0.0, 0.3, F2.y - F2.x);
  float gB = 1.0 - smoothstep(0.25, 0.6, px * 55.0);
  float heat = 0.78 + 0.2 * big + 0.1 * (plasma - 0.45) * (0.5 + 0.5 * detailA)
             + 0.08 * (gran - 0.45) * gA + 0.04 * (gran2 - 0.5) * gB;
  // a few sunspot groups (dark umbra, orange penumbra) in the activity belts
  float sp = fbm(d * 2.4 + vec3(40.0, 3.0, 7.0), 3) + 0.22 * snoise(d * 9.0 + 9.0);
  float lat = abs(d.y);
  float band = smoothstep(0.08, 0.22, lat) * (1.0 - smoothstep(0.42, 0.58, lat));
  float umbra = smoothstep(0.5, 0.55, sp) * band;
  float penum = smoothstep(0.43, 0.5, sp) * band;
  heat -= penum * 0.16 + umbra * 0.32;
  // faculae: bright patches around active regions, mostly visible toward the limb
  heat += smoothstep(0.25, 0.38, sp) * band * 0.08 * (1.0 - mu);
  // limb darkening: cooler and dimmer toward the edge
  heat *= 0.58 + 0.42 * pow(mu, 0.5);
  vec3 col = ramp(heat) * (0.42 + 0.58 * pow(mu, 0.4)) * (1.0 - umbra * 0.88) * (1.0 - penum * 0.3);
  col += vec3(1.2, 0.3, 0.04) * pow(1.0 - mu, 6.0) * 0.3;
  col *= uBright;
  // own hue-preserving exposure curve (display-referred, like the additive glow layers)
  col = 1.0 - exp(-col * 1.1);
  gl_FragColor = vec4(col, 1.0 - smoothstep(1.0 - aa, 1.0 + aa, rr));
}
`;

const CORONA_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// animated inner corona + limb prominences (display-referred, additive)
const CORONA_FRAG = /* glsl */ `
uniform float uTime;
uniform float uI;
uniform float uScale;
varying vec2 vUv;
${GLSL_NOISE}
void main() {
  vec2 p = (vUv * 2.0 - 1.0) * uScale;
  float r = length(p);
  if (r > uScale) discard;
  vec2 dir = p / max(r, 1e-4);
  float lr = log(max(r, 1.0));
  float t = uTime;
  float n1 = fbm(vec3(dir * 2.6, lr * 2.2 - t * 0.06), 4);
  float n2 = fbm(vec3(dir * 8.0 + 7.0, lr * 5.0 - t * 0.12), 3);
  float str = clamp(0.55 + 0.6 * n1 + 0.3 * n2, 0.0, 1.6);
  float x = max(r - 1.0, 0.0);
  float inner = smoothstep(0.99, 1.07, r);
  float edge = 1.0 - smoothstep(uScale * 0.7, uScale, r);
  float I = (exp(-x * 3.2) * str * 0.32 + exp(-x * 1.15) * 0.14 * str) * inner * edge;
  float prom = smoothstep(0.25, 0.6, n2 + 0.2 * n1) * exp(-x * 22.0) * inner;
  vec3 col = mix(vec3(1.0, 0.42, 0.10), vec3(1.0, 0.82, 0.52), exp(-x * 2.2)) * I;
  col += vec3(1.0, 0.30, 0.08) * prom * 0.9;
  gl_FragColor = vec4(col * uI, 1.0);
}
`;

/* ------------------------------------------------------------------------------------------ */
/* Kind configuration                                                                         */
/* ------------------------------------------------------------------------------------------ */

interface AtmoCfg {
  color: [number, number, number];
  twilight: [number, number, number];
  scale: number; // shell radius / planet radius
  falloff: number;
  intensity: number;
  haze: number; // in-surface limb haze
}

interface KindCfg {
  body: string;
  bake: number; // cube face size
  normal: boolean;
  clouds: boolean;
  gas: boolean;
  ls: number; // Lommel-Seeliger blend (rocky regolith look)
  limb: number; // limb darkening amount
  sunI: number;
  tilt: number;
  seed: number;
  ring: "saturn" | "uranus" | null;
  atmo: AtmoCfg | null;
  segments: number;
  rim?: [number, number, number]; // hover outline colour when there is no atmosphere
}

const KINDS: Record<PlanetKind, KindCfg> = {
  earth: {
    body: BAKE_EARTH, bake: 512, normal: true, clouds: true, gas: false, ls: 0.0, limb: 0.0, sunI: 1.45,
    tilt: 0.41, seed: 3, ring: null, segments: 64,
    atmo: { color: [0.2, 0.45, 1.0], twilight: [0.45, 0.16, 0.06], scale: 1.05, falloff: 3.4, intensity: 0.5, haze: 0.2 },
  },
  mars: {
    body: BAKE_MARS, bake: 512, normal: true, clouds: false, gas: false, ls: 0.35, limb: 0.0, sunI: 1.4,
    tilt: 0.44, seed: 5, ring: null, segments: 64,
    atmo: { color: [1.0, 0.6, 0.4], twilight: [0.7, 0.45, 0.4], scale: 1.025, falloff: 4.0, intensity: 0.4, haze: 0.18 },
  },
  jupiter: {
    body: BAKE_JUPITER, bake: 512, normal: false, clouds: false, gas: true, ls: 0.0, limb: 0.6, sunI: 1.25,
    tilt: 0.05, seed: 2, ring: null, segments: 64,
    atmo: { color: [1.0, 0.86, 0.62], twilight: [0.9, 0.55, 0.3], scale: 1.025, falloff: 4.5, intensity: 0.3, haze: 0.15 },
  },
  saturn: {
    body: BAKE_SATURN, bake: 512, normal: false, clouds: false, gas: true, ls: 0.0, limb: 0.55, sunI: 1.25,
    tilt: 0.47, seed: 4, ring: "saturn", segments: 64,
    atmo: { color: [1.0, 0.88, 0.62], twilight: [0.9, 0.6, 0.32], scale: 1.025, falloff: 4.5, intensity: 0.28, haze: 0.15 },
  },
  uranus: {
    body: BAKE_URANUS, bake: 256, normal: false, clouds: false, gas: true, ls: 0.0, limb: 0.6, sunI: 1.0,
    tilt: 1.71, seed: 6, ring: "uranus", segments: 64,
    atmo: { color: [0.5, 0.9, 1.0], twilight: [0.4, 0.7, 0.9], scale: 1.035, falloff: 4.0, intensity: 0.45, haze: 0.25 },
  },
  neptune: {
    body: BAKE_NEPTUNE, bake: 256, normal: false, clouds: false, gas: true, ls: 0.0, limb: 0.55, sunI: 1.3,
    tilt: 0.49, seed: 7, ring: null, segments: 64,
    atmo: { color: [0.3, 0.62, 1.0], twilight: [0.3, 0.45, 0.9], scale: 1.035, falloff: 4.0, intensity: 0.5, haze: 0.25 },
  },
  moon: {
    body: BAKE_MOON, bake: 256, normal: true, clouds: false, gas: false, ls: 0.85, limb: 0.0, sunI: 1.5,
    tilt: 0.1, seed: 1, ring: null, segments: 48, atmo: null, rim: [0.75, 0.8, 0.9],
  },
};

/* ------------------------------------------------------------------------------------------ */
/* Bake cache (GPU cube maps), ref-counted per renderer                                       */
/* ------------------------------------------------------------------------------------------ */

interface BakeSet {
  albedo: THREE.WebGLCubeRenderTarget;
  normal: THREE.WebGLCubeRenderTarget | null;
  clouds: THREE.WebGLCubeRenderTarget | null;
}
interface BakeEntry {
  set: BakeSet;
  refs: number;
  timer: ReturnType<typeof setTimeout> | null;
  key: string;
  gl: THREE.WebGLRenderer;
}

const bakeCaches = new WeakMap<THREE.WebGLRenderer, Map<string, BakeEntry>>();

function lcg(seed: number) {
  let s = (Math.floor(Math.abs(seed)) * 2654435761 + 12345) >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function runBake(gl: THREE.WebGLRenderer, kind: PlanetKind, seed: number): BakeSet {
  const cfg = KINDS[kind];
  const rnd = lcg(seed * 977 + 31);
  const defines: Record<string, string> = {};
  const mat = new THREE.ShaderMaterial({
    vertexShader: BAKE_VERT,
    fragmentShader: BAKE_HEAD + cfg.body + BAKE_MAIN,
    defines,
    uniforms: {
      uFace: { value: 0 },
      uSize: { value: cfg.bake },
      uSeed: { value: new THREE.Vector3(rnd() * 60 - 30, rnd() * 60 - 30, rnd() * 60 - 30) },
      uSeedF: { value: Math.abs(Math.floor(seed)) % 1000 },
      uPass: { value: 0 },
    },
    depthTest: false,
    depthWrite: false,
  });
  const geo = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(geo, mat);
  quad.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(quad);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const prevTarget = gl.getRenderTarget();
  const prevXr = gl.xr.enabled;
  const prevAutoClear = gl.autoClear;
  gl.xr.enabled = false;
  gl.autoClear = true;

  const pass = (p: number) => {
    const rt = new THREE.WebGLCubeRenderTarget(cfg.bake, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    mat.uniforms.uPass.value = p;
    for (let f = 0; f < 6; f++) {
      rt.texture.generateMipmaps = f === 5;
      mat.uniforms.uFace.value = f;
      gl.setRenderTarget(rt, f);
      gl.render(scene, cam);
    }
    return rt;
  };

  const set: BakeSet = {
    albedo: pass(0),
    normal: cfg.normal ? pass(1) : null,
    clouds: cfg.clouds ? pass(2) : null,
  };

  gl.setRenderTarget(prevTarget);
  gl.xr.enabled = prevXr;
  gl.autoClear = prevAutoClear;
  mat.dispose();
  geo.dispose();
  return set;
}

function disposeBake(e: BakeEntry) {
  bakeCaches.get(e.gl)?.delete(e.key);
  e.set.albedo.dispose();
  e.set.normal?.dispose();
  e.set.clouds?.dispose();
}

function scheduleCollect(e: BakeEntry, ms: number) {
  if (e.timer) clearTimeout(e.timer);
  e.timer = setTimeout(() => {
    e.timer = null;
    if (e.refs <= 0) disposeBake(e);
  }, ms);
}

function getBake(gl: THREE.WebGLRenderer, kind: PlanetKind, seed: number): BakeEntry {
  let map = bakeCaches.get(gl);
  if (!map) {
    map = new Map();
    bakeCaches.set(gl, map);
  }
  const key = `${kind}:${seed}`;
  let e = map.get(key);
  if (!e) {
    e = { set: runBake(gl, kind, seed), refs: 0, timer: null, key, gl };
    map.set(key, e);
    scheduleCollect(e, 5000); // collected if no component ever retains it
  }
  return e;
}

function retainBake(e: BakeEntry) {
  e.refs++;
  if (e.timer) {
    clearTimeout(e.timer);
    e.timer = null;
  }
}

function releaseBake(e: BakeEntry) {
  e.refs--;
  if (e.refs <= 0) scheduleCollect(e, 1500);
}

/* ------------------------------------------------------------------------------------------ */
/* Ring textures (1D radial profiles, mip-mapped)                                             */
/* ------------------------------------------------------------------------------------------ */

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

interface RingData {
  tex: THREE.DataTexture;
  inner: number;
  outer: number;
}

function makeRing(kind: "saturn" | "uranus", seed: number): RingData {
  const W = 2048;
  const data = new Uint8Array(W * 4);
  const rnd = lcg(seed * 131 + 7);
  const TN = 1024;
  const tab = new Float32Array(TN);
  for (let i = 0; i < TN; i++) tab[i] = rnd();
  const vn = (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const a = tab[((i % TN) + TN) % TN];
    const b = tab[(((i + 1) % TN) + TN) % TN];
    return a + (b - a) * f * f * (3 - 2 * f);
  };
  const band = (r: number, a: number, b: number, soft: number) => smooth(a - soft, a + soft, r) * (1 - smooth(b - soft, b + soft, r));
  const gauss = (r: number, c: number, w: number) => Math.exp(-(((r - c) / w) ** 2));

  const inner = kind === "saturn" ? 1.11 : 1.6;
  const outer = kind === "saturn" ? 2.34 : 2.06;
  for (let i = 0; i < W; i++) {
    const r = inner + ((outer - inner) * (i + 0.5)) / W;
    let dens = 0;
    let col: [number, number, number];
    if (kind === "saturn") {
      const n1 = vn(r * 55);
      const n2 = vn(r * 260 + 50);
      const n3 = vn(r * 1100 + 100);
      const fine = 0.82 + 0.18 * n3;
      const dRing = 0.035 * band(r, 1.11, 1.236, 0.01) * (0.5 + 0.5 * n2);
      const cRing = band(r, 1.239, 1.527, 0.003) * (0.1 + 0.08 * n1 + 0.1 * n2 + 0.16 * smooth(0.72, 0.85, n2)) * fine;
      const bRing =
        band(r, 1.527, 1.951, 0.002) * (0.58 + 0.32 * smooth(1.56, 1.74, r) + 0.08 * n1) * (0.84 + 0.16 * n2) * fine;
      const cassini = band(r, 1.951, 2.027, 0.002) * (0.03 + 0.05 * n2 + 0.12 * gauss(r, 1.99, 0.004));
      const aRing =
        band(r, 2.027, 2.269, 0.002) *
        (0.5 + 0.12 * n1 + 0.06 * n2) *
        (0.85 + 0.15 * n3) *
        (1 - band(r, 2.2115, 2.2165, 0.0008)) *
        (1 - band(r, 2.2635, 2.2655, 0.0004)) *
        (1 - 0.25 * smooth(2.2, 2.265, r));
      const fRing = 0.55 * gauss(r, 2.326, 0.0028);
      dens = dRing + cRing + bRing + cassini + aRing + fRing;
      const cC: [number, number, number] = [0.5, 0.45, 0.39];
      const cB: [number, number, number] = [0.86 + 0.06 * n1, 0.74 + 0.06 * n1, 0.54 + 0.06 * n2];
      const cA: [number, number, number] = [0.78, 0.7, 0.58];
      const tBC = smooth(1.5, 1.56, r);
      const tBA = smooth(1.95, 2.03, r);
      col = [0, 1, 2].map((k) => {
        const bc = cC[k] + (cB[k] - cC[k]) * tBC;
        return bc + (cA[k] - bc) * tBA;
      }) as [number, number, number];
    } else {
      const rings: [number, number, number][] = [
        [1.637, 0.0035, 0.35],
        [1.652, 0.0035, 0.35],
        [1.666, 0.0035, 0.38],
        [1.75, 0.005, 0.42],
        [1.786, 0.005, 0.42],
        [1.834, 0.0035, 0.3],
        [1.863, 0.0045, 0.42],
        [1.9, 0.0055, 0.48],
        [2.0, 0.016, 0.8],
      ];
      dens = 0.012 * band(r, 1.62, 2.03, 0.01);
      for (const [c, w, a] of rings) dens += 0.6 * a * gauss(r, c, w);
      col = [0.36, 0.38, 0.41];
    }
    dens = Math.min(1, Math.max(0, dens));
    data[i * 4 + 0] = Math.round(255 * Math.pow(col[0], 1.1));
    data[i * 4 + 1] = Math.round(255 * Math.pow(col[1], 1.1));
    data[i * 4 + 2] = Math.round(255 * Math.pow(col[2], 1.1));
    data[i * 4 + 3] = Math.round(255 * dens);
  }
  const tex = new THREE.DataTexture(data, W, 1, THREE.RGBAFormat);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return { tex, inner, outer };
}

/* ------------------------------------------------------------------------------------------ */
/* Planet                                                                                     */
/* ------------------------------------------------------------------------------------------ */

const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const TILT_AXIS = new THREE.Vector3(1, 0, 0.45).normalize();

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

export const Planet = forwardRef<THREE.Group, PlanetProps & { position?: [number, number, number] }>(function Planet(
  { kind, radius, sunRef, highlightRef, dimRef, seed, spin = 0.1, tilt, position },
  ref,
) {
  const gl = useThree((s) => s.gl);
  const cfg = KINDS[kind];
  const seedV = seed ?? cfg.seed;
  const tiltV = tilt ?? cfg.tilt;

  const bake = useMemo(() => getBake(gl, kind, seedV), [gl, kind, seedV]);
  useEffect(() => {
    retainBake(bake);
    return () => releaseBake(bake);
  }, [bake]);

  const ring = useMemo(() => (cfg.ring ? makeRing(cfg.ring, seedV) : null), [cfg.ring, seedV]);

  const res = useMemo(() => {
    // uniforms shared by the surface, the atmosphere and the rings
    const shared = {
      uSunPos: { value: new THREE.Vector3() },
      uCenter: { value: new THREE.Vector3() },
      uPlanetR: { value: 1 },
      uDim: { value: 1 },
      uHighlight: { value: 0 },
      uSunI: { value: cfg.sunI },
      uRingNormal: { value: new THREE.Vector3(0, 1, 0) },
    };
    const defines: Record<string, string> = {};
    if (cfg.normal) defines.HAS_NORMAL = "";
    if (cfg.gas) defines.GAS = "";
    if (kind === "earth") defines.EARTH = "";
    if (ring) defines.RING_SHADOW = "";
    const a = cfg.atmo;
    const surfaceUniforms: Record<string, THREE.IUniform> = {
      ...shared,
      uAlbedo: { value: bake.set.albedo.texture },
      uNormalMap: { value: bake.set.normal ? bake.set.normal.texture : null },
      uClouds: { value: bake.set.clouds ? bake.set.clouds.texture : null },
      uCloudRot: { value: new THREE.Vector2(1, 0) },
      uNormalMat: { value: new THREE.Matrix3() },
      uRimColor: { value: new THREE.Vector3(...(a ? a.color : cfg.rim ?? [0.8, 0.8, 0.8])) },
      uHaze: { value: a ? a.haze : 0 },
      uLS: { value: cfg.ls },
      uLimb: { value: cfg.limb },
      uDrift: { value: 0 },
      uRingTex: { value: ring ? ring.tex : null },
      uRingInner: { value: ring ? ring.inner : 0 },
      uRingOuter: { value: ring ? ring.outer : 1 },
    };
    const surface = new THREE.ShaderMaterial({
      vertexShader: SURFACE_VERT,
      fragmentShader: SURFACE_FRAG,
      uniforms: surfaceUniforms,
      defines,
    });
    const sphere = new THREE.SphereGeometry(1, cfg.segments, Math.round(cfg.segments * 0.75));
    let atmo: THREE.ShaderMaterial | null = null;
    let atmoGeo: THREE.SphereGeometry | null = null;
    if (a) {
      atmo = new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: {
          ...shared,
          uAtmScale: { value: a.scale },
          uColor: { value: new THREE.Vector3(...a.color) },
          uTwilight: { value: new THREE.Vector3(...a.twilight) },
          uIntensity: { value: a.intensity },
          uFalloff: { value: a.falloff },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      atmoGeo = new THREE.SphereGeometry(1, 48, 32);
    }
    let ringMat: THREE.ShaderMaterial | null = null;
    let ringGeo: THREE.RingGeometry | null = null;
    if (ring) {
      ringMat = new THREE.ShaderMaterial({
        vertexShader: RING_VERT,
        fragmentShader: RING_FRAG,
        uniforms: {
          ...shared,
          uRingTex: { value: ring.tex },
          uRingInner: { value: ring.inner },
          uRingOuter: { value: ring.outer },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      ringGeo = new THREE.RingGeometry(ring.inner, ring.outer, 192, 1);
    }
    return { shared, surface, sphere, atmo, atmoGeo, ringMat, ringGeo };
  }, [kind, cfg, bake, ring]);

  useEffect(
    () => () => {
      res.surface.dispose();
      res.sphere.dispose();
      res.atmo?.dispose();
      res.atmoGeo?.dispose();
      res.ringMat?.dispose();
      res.ringGeo?.dispose();
    },
    [res],
  );
  useEffect(() => () => ring?.tex.dispose(), [ring]);

  const surfRef = useRef<THREE.Mesh>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const atmoRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // world-space uniforms are refreshed right before drawing (matrices are final at that point)
  useLayoutEffect(() => {
    const surf = surfRef.current;
    if (!surf) return;
    const u = res.shared;
    const nm = (res.surface.uniforms.uNormalMat.value as THREE.Matrix3);
    const sync = (obj: THREE.Object3D) => {
      const m = obj.matrixWorld;
      u.uCenter.value.setFromMatrixPosition(m);
      // every child is centred on the planet; its local scale relative to the surface gives R
      u.uPlanetR.value = (_v.setFromMatrixColumn(m, 0).length() * surf.scale.x) / (obj.scale.x || 1);
      u.uSunPos.value.copy(sunRef.current);
      const tiltObj = surf.parent;
      if (tiltObj) u.uRingNormal.value.setFromMatrixColumn(tiltObj.matrixWorld, 1).normalize();
    };
    surf.onBeforeRender = () => {
      sync(surf);
      nm.setFromMatrix4(surf.matrixWorld);
    };
    const atm = atmoRef.current;
    if (atm) atm.onBeforeRender = () => sync(atm);
    const rg = ringRef.current;
    if (rg) rg.onBeforeRender = () => sync(rg);
    return () => {
      surf.onBeforeRender = () => {};
      if (atm) atm.onBeforeRender = () => {};
      if (rg) rg.onBeforeRender = () => {};
    };
  }, [res, sunRef]);

  useLayoutEffect(() => {
    tiltRef.current?.quaternion.setFromAxisAngle(TILT_AXIS, tiltV);
  }, [tiltV]);

  useFrame((state, delta) => {
    const surf = surfRef.current;
    if (!surf) return;
    const dt = Math.min(delta, 0.1);
    surf.rotation.y += spin * dt;
    const t = state.clock.elapsedTime;
    const u = res.shared;
    u.uHighlight.value = THREE.MathUtils.clamp(highlightRef?.current ?? 0, 0, 1);
    u.uDim.value = THREE.MathUtils.clamp(dimRef?.current ?? 1, 0, 1);
    const su = res.surface.uniforms;
    if (cfg.gas) su.uDrift.value = 0.22 * Math.sin(t * 0.035);
    if (kind === "earth") {
      const a = t * 0.012;
      (su.uCloudRot.value as THREE.Vector2).set(Math.cos(a), Math.sin(a));
    }
  });

  const setOuter = useCallback((g: THREE.Group | null) => assignRef(ref, g), [ref]);
  const a = cfg.atmo;

  return (
    <group ref={setOuter} position={position}>
      <group ref={tiltRef}>
        <mesh ref={surfRef} geometry={res.sphere} material={res.surface} scale={radius} />
        {res.ringGeo && res.ringMat && (
          <mesh ref={ringRef} geometry={res.ringGeo} material={res.ringMat} scale={radius} rotation={[-Math.PI / 2, 0, 0]} />
        )}
      </group>
      {res.atmoGeo && res.atmo && a && (
        <mesh ref={atmoRef} geometry={res.atmoGeo} material={res.atmo} scale={radius * a.scale} />
      )}
    </group>
  );
});

/* ------------------------------------------------------------------------------------------ */
/* Sun                                                                                        */
/* ------------------------------------------------------------------------------------------ */

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// radial profile -> RGB intensity (alpha 1, used with additive blending), dithered against banding
function radialTexture(size: number, color: [number, number, number], profile: (r: number) => number) {
  return canvasTexture(size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    const h = s / 2;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const r = Math.hypot(x + 0.5 - h, y + 0.5 - h) / h;
        const I = r >= 1 ? 0 : Math.max(0, profile(r));
        const o = (y * s + x) * 4;
        const dz = Math.random() - 0.5;
        img.data[o] = Math.min(255, Math.max(0, I * color[0] * 255 + dz));
        img.data[o + 1] = Math.min(255, Math.max(0, I * color[1] * 255 + dz));
        img.data[o + 2] = Math.min(255, Math.max(0, I * color[2] * 255 + dz));
        img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
}

function raysTexture(size: number, seed: number, count: number, discFrac: number, reach: number) {
  return canvasTexture(size, (ctx, s) => {
    const rnd = lcg(seed);
    const h = s / 2;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, s, s);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < count; i++) {
      const ang = rnd() * Math.PI * 2;
      const len = h * reach * (0.2 + 0.8 * Math.pow(rnd(), 2.6));
      const w = 0.004 + 0.012 * rnd();
      const a = 0.025 + 0.09 * Math.pow(rnd(), 2.0);
      const warm = rnd();
      const gc = Math.round(200 + 40 * warm);
      const bc = Math.round(130 + 80 * warm);
      // three nested wedges = soft falloff across the streak
      for (let k = 0; k < 3; k++) {
        const ww = w * (1 + k * 2.2);
        const aa = a / (1 + k * 2.5);
        const g = ctx.createRadialGradient(h, h, h * discFrac, h, h, len);
        g.addColorStop(0, `rgba(255,${gc},${bc},${aa})`);
        g.addColorStop(0.25, `rgba(255,${gc},${bc},${aa * 0.5})`);
        g.addColorStop(1, `rgba(255,${gc},${bc},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(h, h);
        ctx.lineTo(h + Math.cos(ang - ww) * len, h + Math.sin(ang - ww) * len);
        ctx.lineTo(h + Math.cos(ang + ww) * len, h + Math.sin(ang + ww) * len);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "destination-in";
    const m = ctx.createRadialGradient(h, h, 0, h, h, h);
    m.addColorStop(0, "rgba(0,0,0,1)");
    m.addColorStop(0.8, "rgba(0,0,0,1)");
    m.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = m;
    ctx.fillRect(0, 0, s, s);
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, s, s);
  });
}

interface GlowLayer {
  sprite: THREE.Sprite;
  size: number; // diameter in sun radii
  opacity: number;
  spinRate: number;
  phase: number;
  grow: number; // how much the layer swells with intensity
}

const SUN_LAYERS = {
  glow: 5, // inner glow, reaches 2.5 R
  corona: 13,
  halo: 46,
  rays1: 22,
  rays2: 16,
  coronaPlane: 3.2, // half-size in R of the animated corona billboard
};

function createSunResources() {
  const sunMat = new THREE.ShaderMaterial({
    vertexShader: CORONA_VERT,
    fragmentShader: SUN_FRAG,
    uniforms: { uTime: { value: 0 }, uBright: { value: 1 }, uViewToObj: { value: new THREE.Matrix3() } },
    transparent: true,
    depthWrite: true,
    toneMapped: false,
  });
  const coronaMat = new THREE.ShaderMaterial({
    vertexShader: CORONA_VERT,
    fragmentShader: CORONA_FRAG,
    uniforms: { uTime: { value: 0 }, uI: { value: 1 }, uScale: { value: SUN_LAYERS.coronaPlane } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const plane = new THREE.PlaneGeometry(2, 2);

  const disc = (d: number) => 2 / d; // disc radius in texture units for a sprite of d radii diameter
  const g0 = disc(SUN_LAYERS.glow);
  // bloom: a plateau over the disc (lens glare) continuing smoothly outside it
  const glowTex = radialTexture(256, [1.0, 0.7, 0.4], (r) => {
    const x = r / g0;
    const I = x < 1 ? 1 : 0.62 * Math.exp(-(x - 1) * 4.0) + 0.38 * Math.exp(-(x - 1) * 1.3);
    return I * (1 - smooth(0.7, 1, r));
  });
  const g1 = disc(SUN_LAYERS.corona);
  const coronaTex = radialTexture(256, [1.0, 0.56, 0.24], (r) => {
    const x = r / g1;
    if (x < 1) return 0;
    const I = 0.7 * Math.exp(-(x - 1) * 1.1) + 0.3 / (x * x);
    return I * (1 - smooth(0.55, 1, r)) * smooth(1, 1.06, x);
  });
  const g2 = disc(SUN_LAYERS.halo);
  const haloTex = radialTexture(256, [1.0, 0.5, 0.2], (r) => {
    const x = Math.max(r / g2, 1);
    return (1 / (1 + Math.pow(x / 2.4, 2))) * (1 - smooth(0.3, 1, r));
  });
  const rays1Tex = raysTexture(1024, 11, 110, disc(SUN_LAYERS.rays1) * 1.05, 1.0);
  const rays2Tex = raysTexture(1024, 23, 70, disc(SUN_LAYERS.rays2) * 1.05, 0.85);

  const mkSprite = (map: THREE.Texture) =>
    new THREE.Sprite(
      new THREE.SpriteMaterial({
        map,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    );
  const layers: GlowLayer[] = [
    { sprite: mkSprite(haloTex), size: SUN_LAYERS.halo, opacity: 0.2, spinRate: 0, phase: 0.0, grow: 0.5 },
    { sprite: mkSprite(coronaTex), size: SUN_LAYERS.corona, opacity: 0.46, spinRate: 0, phase: 1.3, grow: 0.35 },
    { sprite: mkSprite(rays1Tex), size: SUN_LAYERS.rays1, opacity: 0.3, spinRate: 0.006, phase: 2.1, grow: 0.6 },
    { sprite: mkSprite(rays2Tex), size: SUN_LAYERS.rays2, opacity: 0.26, spinRate: -0.009, phase: 4.2, grow: 0.6 },
    { sprite: mkSprite(glowTex), size: SUN_LAYERS.glow, opacity: 0.62, spinRate: 0, phase: 3.3, grow: 0.25 },
  ];
  layers.forEach((l, i) => {
    l.sprite.renderOrder = i + 1;
  });
  const textures = [glowTex, coronaTex, haloTex, rays1Tex, rays2Tex];
  return {
    sunMat,
    coronaMat,
    plane,
    layers,
    dispose() {
      sunMat.dispose();
      coronaMat.dispose();
      plane.dispose();
      layers.forEach((l) => l.sprite.material.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}

const _sunW = new THREE.Vector3();
const _toCam = new THREE.Vector3();
const _tmp = new THREE.Vector3();
const _sq = new THREE.Quaternion();
const _cq = new THREE.Quaternion();
const _spinQ = new THREE.Quaternion();
const _m4 = new THREE.Matrix4();
const Y_AXIS = new THREE.Vector3(0, 1, 0);

export const Sun = forwardRef<THREE.Group, SunProps>(function Sun({ radius, position, intensityRef }, ref) {
  const res = useMemo(() => createSunResources(), []);
  useEffect(() => () => res.dispose(), [res]);
  const groupRef = useRef<THREE.Group | null>(null);
  const discRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  useFrame(({ camera, clock }, delta) => {
    const g = groupRef.current;
    const discM = discRef.current;
    const glow = glowRef.current;
    const corona = coronaRef.current;
    if (!g || !discM || !glow || !corona) return;
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 0.1);
    const i = THREE.MathUtils.clamp(intensityRef?.current ?? 1, 0, 1);
    const ie = i * i * (3 - 2 * i);

    g.getWorldPosition(_sunW);
    const ws = _v.setFromMatrixColumn(g.matrixWorld, 0).length() || 1;
    camera.getWorldPosition(_tmp);
    _toCam.copy(_tmp).sub(_sunW);
    const D = Math.max(_toCam.length(), 1e-3);
    _toCam.multiplyScalar(1 / D);
    const Rw = radius * ws;

    // camera-facing orientation expressed in the group's local frame
    g.getWorldQuaternion(_sq);
    camera.getWorldQuaternion(_cq);
    _q.copy(_sq).invert().multiply(_cq);
    discM.quaternion.copy(_q);
    corona.quaternion.copy(_q);

    // impostor disc: same angular radius as a real sphere of that size
    const sinA = Math.min(Rw / D, 0.95);
    discM.scale.setScalar(radius / Math.sqrt(1 - sinA * sinA));
    _spinQ.setFromAxisAngle(Y_AXIS, t * 0.02).invert();
    _spinQ.multiply(_q);
    _m4.makeRotationFromQuaternion(_spinQ);
    (res.sunMat.uniforms.uViewToObj.value as THREE.Matrix3).setFromMatrix4(_m4);

    // glow layers sit just in front of the star and are rescaled to keep their angular size
    const off = Math.min(Rw * 1.05, D * 0.5);
    _tmp.copy(_sunW).addScaledVector(_toCam, off);
    g.worldToLocal(_tmp);
    glow.position.copy(_tmp);
    glow.scale.setScalar((D - off) / D);

    res.sunMat.uniforms.uTime.value = t;
    res.sunMat.uniforms.uBright.value = 0.12 + 0.88 * ie;
    res.coronaMat.uniforms.uTime.value = t;
    res.coronaMat.uniforms.uI.value = ie;
    corona.scale.setScalar(radius * SUN_LAYERS.coronaPlane);

    for (const l of res.layers) {
      const f =
        1 +
        0.04 * Math.sin(t * 1.3 + l.phase) +
        0.025 * Math.sin(t * 2.9 + l.phase * 1.7) +
        0.015 * Math.sin(t * 6.1 + l.phase * 0.6);
      const mat = l.sprite.material;
      mat.opacity = l.opacity * ie * f;
      mat.rotation += l.spinRate * dt;
      const s = radius * l.size * (1 - l.grow + l.grow * ie) * (1 + (f - 1) * 0.6);
      l.sprite.scale.set(s, s, 1);
      l.sprite.visible = mat.opacity > 0.002;
    }
  });

  const setGroup = useCallback(
    (g: THREE.Group | null) => {
      groupRef.current = g;
      assignRef(ref, g);
    },
    [ref],
  );

  return (
    <group ref={setGroup} position={position}>
      <mesh ref={discRef} geometry={res.plane} material={res.sunMat} renderOrder={0} />
      <group ref={glowRef}>
        <mesh ref={coronaRef} geometry={res.plane} material={res.coronaMat} renderOrder={1} />
        {res.layers.map((l, k) => (
          <primitive key={k} object={l.sprite} />
        ))}
      </group>
    </group>
  );
});
