import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { currentMode, sunWorld } from "./director";

/*
 * An occasional comet on the home page.
 *
 * Every ~20-35 s a comet sweeps across the upper part of the view on a real hyperbolic Kepler
 * orbit around the Sun (Sun at the focus, Kepler's equation solved every frame), so it speeds up
 * near perihelion and its tails swing round as it passes the Sun:
 *  - small icy nucleus inside a soft blue-white / green (C2) coma,
 *  - straight blue ion tail pointing exactly away from the Sun, with fine streamers and knots,
 *  - broader, curved, warmer dust tail lagging behind the motion, sharp on its leading edge,
 *  - grains shed by the nucleus drifting down both tails.
 * Brightness and tail length grow as the comet nears the Sun. Before each launch the path is
 * checked against the home camera: it enters and leaves through the sides of the screen and keeps
 * the nucleus and both tails in the upper part of the view (the title area stays clear).
 * One mesh, one draw call: tails and grains are built in the vertex shader from a few uniforms.
 */

/* -------------------------------------------------------------------------------------------- */
/* Tuning                                                                                       */
/* -------------------------------------------------------------------------------------------- */

const FIRST_DELAY = 6;
const GAP_MIN = 20; // seconds between two launches
const GAP_MAX = 35;
const DUR_MIN = 6.2; // seconds on screen
const DUR_MAX = 8.8;
const HOME_SETTLE = 2.5; // the camera must have been home this long before a launch
const PLAN_TRIES = 120;

const SEG = 64; // segments per tail ribbon
const GRAINS = 72;

// reference home camera (Universe): at (0, 0, 10) looking down -z, vertical fov 75
const REF_CAM_Z = 10;
const REF_TAN = Math.tan(THREE.MathUtils.degToRad(75 / 2));

// safe band (NDC y, +1 = top): nucleus and tail ends stay above these
const MIN_NUC_Y = 0.15;
const MAX_NUC_Y = 0.86; // and below the top edge, so the head is never clipped
const MIN_TAIL_Y = 0.07;

const ION_LEN = 62;
const DUST_LEN = 34;
const DUST_BEND = 0.42;

const ionLenOf = (act: number, sc: number) => sc * ION_LEN * (0.4 + 0.6 * act);
const dustLenOf = (act: number, sc: number) => sc * DUST_LEN * (0.45 + 0.55 * act);

/* -------------------------------------------------------------------------------------------- */
/* Shaders                                                                                      */
/* -------------------------------------------------------------------------------------------- */

const BEND = DUST_BEND.toFixed(4);

const VERT = /* glsl */ `
attribute vec4 aData; // kind, u, v, seed
attribute vec4 aRand; // grains only
uniform vec3 uNuc;
uniform vec3 uAnti;   // unit, Sun -> comet
uniform vec3 uBend;   // unit, trailing side, perpendicular to uAnti
uniform float uIonLen;
uniform float uDustLen;
uniform float uComa;  // coma radius, world units
uniform float uScale;
uniform float uTime;
uniform float uPx;    // device pixels per world unit at distance 1
uniform float uDpr;
varying vec2 vUv;
varying vec4 vMisc;
varying float vKind;

vec3 dustPoint(float s) {
  return uNuc + (uAnti * s + uBend * (s * s * ${BEND})) * uDustLen;
}
vec3 dustTangent(float s) {
  return normalize(uAnti + uBend * (2.0 * s * ${BEND}));
}
vec3 acrossOf(vec3 c, vec3 tng) {
  vec3 v = normalize(cameraPosition - c);
  vec3 a = cross(tng, v);
  float l = length(a);
  return l > 1e-4 ? a / l : vec3(0.0, 1.0, 0.0);
}
float ionWidth(float s) { return uScale * mix(0.3, 4.2, pow(s, 0.9)) + uComa * 0.3 * (1.0 - s); }
float dustWidth(float s) { return uScale * mix(0.6, 8.0, pow(s, 0.8)) + uComa * 0.55 * (1.0 - s); }

void main() {
  float kind = aData.x;
  vKind = kind;
  vMisc = vec4(0.0);
  if (kind < 0.5) {
    // nucleus + coma: camera-facing quad, never smaller than a few pixels
    vec4 mv = viewMatrix * vec4(uNuc, 1.0);
    float dist = max(-mv.z, 1.0);
    float rPx = max(uComa * 4.0 * uPx / dist, 26.0 * uDpr);
    mv.xy += aData.yz * rPx * dist / uPx;
    gl_Position = projectionMatrix * mv;
    vUv = aData.yz;
    vMisc.x = rPx;
    vMisc.y = uComa * uPx / dist; // coma radius in px
  } else if (kind < 2.5) {
    // tails: ribbons facing the camera
    float s = aData.y;
    float side = aData.z;
    vec3 c;
    vec3 tng;
    float w;
    if (kind < 1.5) {
      c = uNuc + uAnti * (uIonLen * s);
      tng = uAnti;
      w = ionWidth(s);
    } else {
      c = dustPoint(s);
      tng = dustTangent(s);
      w = dustWidth(s);
    }
    vec3 ac = acrossOf(c, tng);
    // vMisc.x: +1 when +side is the trailing (concave) side of the dust tail
    vMisc.x = dot(ac, uBend) >= 0.0 ? 1.0 : -1.0;
    vec4 mv = viewMatrix * vec4(c + ac * side * w, 1.0);
    gl_Position = projectionMatrix * mv;
    vUv = vec2(s, side);
    vMisc.y = w * uPx / max(-mv.z, 1.0); // half width in px (keeps thin streamers from aliasing)
  } else {
    // grains shed by the nucleus, drifting down the tails
    float rate = 1.0 / (2.2 + 2.6 * aRand.y);
    float age = fract(uTime * rate + aRand.x);
    float ion = step(aRand.z, 0.55);
    float s = ion > 0.5 ? pow(age, 0.85) * 0.92 : age * 0.9;
    vec3 c = ion > 0.5 ? uNuc + uAnti * (uIonLen * s) : dustPoint(s);
    vec3 tng = ion > 0.5 ? uAnti : dustTangent(s);
    float w = ion > 0.5 ? ionWidth(s) * 0.6 : dustWidth(s) * 0.7;
    float off = fract(aRand.w * 7.31) * 2.0 - 1.0;
    off = sign(off) * pow(abs(off), 1.15);
    c += acrossOf(c, tng) * off * w;
    vec4 mv = viewMatrix * vec4(c, 1.0);
    float dist = max(-mv.z, 1.0);
    float sizePx = (1.8 + 1.6 * aRand.w) * uDpr;
    mv.xy += aData.yz * sizePx * dist / uPx;
    gl_Position = projectionMatrix * mv;
    vUv = aData.yz;
    float tw = 0.6 + 0.4 * sin(uTime * (2.5 + 4.0 * aRand.y) + aRand.x * 40.0);
    vMisc.x = smoothstep(0.0, 0.1, age) * pow(1.0 - age, 1.5) * tw;
    vMisc.y = ion;
  }
}
`;

const FRAG = /* glsl */ `
uniform float uAlpha;
uniform float uBright;
uniform float uTime;
uniform float uDpr;
uniform vec4 uSeed;
varying vec2 vUv;
varying vec4 vMisc;
varying float vKind;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float filament(float y, float c, float w) {
  float d = (y - c) / w;
  return exp(-d * d);
}

void main() {
  vec3 col;
  if (vKind < 0.5) {
    // nucleus + coma
    float r = length(vUv);
    if (r > 1.0) discard;
    float d = r * vMisc.x;           // px from the nucleus
    float rc = max(vMisc.y, 2.5 * uDpr); // coma radius, px
    float sig = 1.1 * uDpr;
    float core = exp(-0.5 * d * d / (sig * sig));
    float inner = exp(-d / (rc * 0.2));
    float outer = exp(-d / (rc * 0.7));
    float halo = 1.0 / (1.0 + d * d / (rc * rc * 1.5));
    float edge = 1.0 - smoothstep(0.45, 1.0, r);
    col = vec3(1.0, 0.99, 0.97) * core * 1.5
        + (vec3(0.82, 0.94, 1.0) * inner * 0.9
         + vec3(0.42, 0.95, 0.76) * outer * 0.38
         + vec3(0.55, 0.85, 0.95) * halo * 0.07) * (0.45 + 0.55 * uBright);
    col *= edge;
  } else if (vKind < 1.5) {
    // ion tail: thin streamers, brighter knots running outwards
    float s = vUv.x;
    float y = vUv.y;
    float along = smoothstep(0.0, 0.05, s) * pow(1.0 - s, 1.5);
    float core = exp(-y * y * mix(9.0, 26.0, s)) * (1.0 - 0.45 * s);
    float st = 0.0;
    float spread = pow(s, 0.75);
    float fw0 = 0.035 + 0.08 * s;
    float fw = max(fw0, 1.0 * uDpr / max(vMisc.y, 0.5));
    float fk = fw0 / fw; // widened filaments keep their energy
    st += 0.9 * filament(y, (uSeed.x - 0.5) * 1.3 * spread + 0.05 * s * sin(s * 11.0 - uTime * 0.9), fw);
    st += 0.7 * filament(y, (uSeed.y - 0.5) * 1.4 * spread + 0.06 * s * sin(s * 9.0 - uTime * 0.7 + 2.0), fw);
    st += 0.6 * filament(y, (uSeed.z - 0.5) * 1.5 * spread + 0.05 * s * sin(s * 13.0 - uTime * 1.1 + 4.0), fw * 1.3);
    st += 0.5 * filament(y, (uSeed.w - 0.5) * 1.2 * spread + 0.07 * s * sin(s * 7.0 - uTime * 0.6 + 1.0), fw * 0.8);
    float knots = 1.0 + 0.45 * s * pow(0.5 + 0.5 * sin(s * 12.0 - uTime * 1.4 + uSeed.x * 6.28), 4.0);
    float edge = 1.0 - smoothstep(0.7, 1.0, abs(y));
    vec3 c = mix(vec3(0.82, 0.92, 1.0), vec3(0.3, 0.52, 1.0), smoothstep(0.0, 0.4, s));
    // near the head the streamers merge into the core: let them emerge with distance
    st *= fk * smoothstep(0.02, 0.3, s);
    col = c * along * (0.55 * core + 0.3 * st + 0.08 * exp(-y * y * 2.0)) * knots * edge * uBright;
  } else if (vKind < 2.5) {
    // dust tail: broad and smooth, sharp bright leading edge, faint striae
    float s = vUv.x;
    float y = vUv.y * vMisc.x; // +1 = trailing (concave) side
    float along = smoothstep(0.0, 0.04, s) * pow(1.0 - s, 1.25);
    float yc = y + 0.22 + 0.12 * s;
    float prof = yc < 0.0 ? exp(-yc * yc / 0.06) : exp(-yc * yc / 0.5);
    float striae = 1.0 + 0.08 * sin((y * 0.9 + s * 1.3) * 13.0 + uSeed.y * 6.28) * smoothstep(0.2, 0.7, s);
    float edge = 1.0 - smoothstep(0.75, 1.0, abs(vUv.y));
    vec3 c = mix(vec3(1.0, 0.94, 0.85), vec3(1.0, 0.77, 0.52), smoothstep(0.0, 0.8, s));
    col = c * along * prof * striae * edge * 0.8 * uBright;
  } else {
    // grains
    float r2 = dot(vUv, vUv);
    if (r2 > 1.0) discard;
    float g = exp(-r2 * 6.0);
    vec3 c = vMisc.y > 0.5 ? vec3(0.62, 0.8, 1.0) * 0.55 : vec3(1.0, 0.88, 0.7) * 0.3;
    col = c * g * vMisc.x * uBright;
  }
  col *= uAlpha;
  // dither the faint gradients against banding
  float lum = max(col.r, max(col.g, col.b));
  col += (hash12(gl_FragCoord.xy) - 0.5) * (1.0 / 255.0) * step(0.004, lum);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

/* -------------------------------------------------------------------------------------------- */
/* Geometry                                                                                     */
/* -------------------------------------------------------------------------------------------- */

function buildGeometry(): THREE.BufferGeometry {
  const nVerts = 4 + 2 * (SEG + 1) * 2 + GRAINS * 4;
  const data = new Float32Array(nVerts * 4);
  const rand = new Float32Array(nVerts * 4);
  const index: number[] = [];
  let v = 0;
  const quad = (kind: number, r: [number, number, number, number] | null) => {
    const base = v;
    for (const [x, y] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      data.set([kind, x, y, 0], v * 4);
      if (r) rand.set(r, v * 4);
      v++;
    }
    index.push(base, base + 1, base + 2, base + 2, base + 1, base + 3);
  };
  const ribbon = (kind: number) => {
    const base = v;
    for (let i = 0; i <= SEG; i++) {
      const s = Math.pow(i / SEG, 1.25); // denser near the nucleus
      data.set([kind, s, -1, 0], v * 4);
      data.set([kind, s, 1, 0], (v + 1) * 4);
      v += 2;
    }
    for (let i = 0; i < SEG; i++) {
      const a = base + i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  };
  // dust first, ion over it, coma on top, grains last (additive: order only matters for ties)
  ribbon(2);
  ribbon(1);
  quad(0, null);
  for (let i = 0; i < GRAINS; i++) quad(3, [Math.random(), Math.random(), Math.random(), Math.random()]);

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nVerts * 3), 3));
  g.setAttribute("aData", new THREE.BufferAttribute(data, 4));
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  g.setIndex(index);
  return g;
}

/* -------------------------------------------------------------------------------------------- */
/* Orbit                                                                                        */
/* -------------------------------------------------------------------------------------------- */

// hyperbolic orbit, Sun at the focus, perihelion along P, motion at perihelion along Q
interface Orbit {
  P: THREE.Vector3;
  Q: THREE.Vector3;
  q: number;
  e: number;
  a: number; // q / (e - 1)
  bq: number; // a * sqrt(e^2 - 1)
  Ms: number; // mean anomaly window on screen
  Me: number;
  dur: number;
  sc: number;
  dir: number;
}

const _p = new THREE.Vector3();
const _v = new THREE.Vector3();
const _A = new THREE.Vector3();
const _B = new THREE.Vector3();
const _t = new THREE.Vector3();
const _W = new THREE.Vector3();
const _sun = new THREE.Vector3();

const orbitPos = (o: Orbit, F: number, sun: THREE.Vector3, out: THREE.Vector3) =>
  out
    .copy(sun)
    .addScaledVector(o.P, o.a * (o.e - Math.cosh(F)))
    .addScaledVector(o.Q, o.bq * Math.sinh(F));

const orbitVel = (o: Orbit, F: number, out: THREE.Vector3) =>
  out
    .copy(o.P)
    .multiplyScalar(-o.a * Math.sinh(F))
    .addScaledVector(o.Q, o.bq * Math.cosh(F))
    .normalize();

// Kepler's equation for hyperbolic orbits: e sinh F - F = M
function solveF(e: number, M: number) {
  let F = Math.asinh(M / e);
  for (let i = 0; i < 8; i++) {
    const f = e * Math.sinh(F) - F - M;
    F -= f / (e * Math.cosh(F) - 1);
  }
  return F;
}

// sun -> comet unit vector, activity (q / r), and the trailing direction for the dust tail
function tailFrame(o: Orbit, pos: THREE.Vector3, vel: THREE.Vector3, sun: THREE.Vector3) {
  _A.copy(pos).sub(sun);
  const r = Math.max(_A.length(), 1e-3);
  _A.multiplyScalar(1 / r);
  _B.copy(vel).addScaledVector(_A, -vel.dot(_A)).negate();
  if (_B.lengthSq() < 1e-8) _B.set(0, -1, 0).addScaledVector(_A, _A.y).normalize();
  else _B.normalize();
  return Math.min(1, o.q / r);
}

// NDC through the reference home camera; z = distance in front of the camera
const ndc = { x: 0, y: 0, d: 0 };
function project(p: THREE.Vector3, aspect: number) {
  ndc.d = REF_CAM_Z - p.z;
  const d = Math.max(ndc.d, 1e-3);
  ndc.x = p.x / d / (REF_TAN * aspect);
  ndc.y = p.y / d / REF_TAN;
  return ndc;
}

function offScreen(p: THREE.Vector3, aspect: number) {
  const n = project(p, aspect);
  return n.d < 5 || Math.abs(n.x) > 1.1;
}

// tail ends stay in the safe band (and well in front of the camera)
function tailsOk(o: Orbit, pos: THREE.Vector3, vel: THREE.Vector3, sun: THREE.Vector3, aspect: number) {
  const act = tailFrame(o, pos, vel, sun);
  const li = ionLenOf(act, o.sc);
  const ld = dustLenOf(act, o.sc);
  _t.copy(pos).addScaledVector(_A, li);
  let n = project(_t, aspect);
  if (n.d < 20 || n.y < MIN_TAIL_Y) return false;
  for (const s of [0.5, 1]) {
    _t.copy(pos)
      .addScaledVector(_A, s * ld)
      .addScaledVector(_B, s * s * DUST_BEND * ld);
    n = project(_t, aspect);
    if (n.d < 20 || n.y < MIN_TAIL_Y) return false;
  }
  return true;
}

function planOrbit(o: Orbit, sun: THREE.Vector3, aspect: number): boolean {
  const halfW = (REF_CAM_Z - sun.z) * REF_TAN * aspect;
  o.sc = THREE.MathUtils.clamp(halfW / 94, 0.5, 1.15);
  // sun on screen
  _sun.copy(sun);
  const sn = project(_sun, aspect);
  const sunX = sn.x;
  const sunY = sn.y;
  // wide screens need flatter (more hyperbolic) paths to cross the whole width
  const eMax = 5 + Math.max(0, aspect - 1.5) * 4;
  for (let tries = 0; tries < PLAN_TRIES; tries++) {
    const s = o.dir;
    o.q = o.sc * (20 + 14 * Math.random());
    o.e = 2.2 + (eMax - 2.2) * Math.random();
    // perihelion above the Sun, tilted towards or away from the camera
    o.P.set((Math.random() - 0.5) * 1.1, 1, -0.95 + 1.3 * Math.random()).normalize();
    o.Q.set(s, 0, 0).addScaledVector(o.P, -s * o.P.x).normalize();
    _W.crossVectors(o.P, o.Q);
    const inc = (Math.random() - 0.5) * 1.0;
    o.Q.multiplyScalar(Math.cos(inc)).addScaledVector(_W, Math.sin(inc)).normalize();
    o.a = o.q / (o.e - 1);
    o.bq = o.a * Math.sqrt(o.e * o.e - 1);

    // march out from perihelion until the comet is off screen on both sides
    let Fs = 0;
    let Fe = 0;
    let found = 0;
    for (let i = 1; i <= 150 && found < 2; i++) {
      const F = i * 0.04;
      if (!Fe && offScreen(orbitPos(o, F, sun, _p), aspect)) {
        Fe = F;
        found++;
      }
      if (!Fs && offScreen(orbitPos(o, -F, sun, _p), aspect)) {
        Fs = -F;
        found++;
      }
    }
    if (found < 2) continue;
    // in through one side, out through the other
    const xs = project(orbitPos(o, Fs, sun, _p), aspect).x;
    const xe = project(orbitPos(o, Fe, sun, _p), aspect).x;
    if (Math.abs(xs) < 1 || Math.abs(xe) < 1 || Math.sign(xs) === Math.sign(xe)) continue;

    let ok = true;
    const N = 90;
    for (let i = 0; i <= N && ok; i++) {
      const F = Fs + ((Fe - Fs) * i) / N;
      orbitPos(o, F, sun, _p);
      const n = project(_p, aspect);
      if (Math.abs(n.x) > 1.12) continue;
      if (n.y < MIN_NUC_Y || n.y > MAX_NUC_Y || _p.z < -135 || _p.z > -42) ok = false;
      // not lost in the solar glare
      else if (Math.hypot((n.x - sunX) * aspect, n.y - sunY) < 0.16) ok = false;
      else if (!tailsOk(o, _p, orbitVel(o, F, _v), sun, aspect)) ok = false;
    }
    if (!ok) continue;
    o.Ms = o.e * Math.sinh(Fs) - Fs;
    o.Me = o.e * Math.sinh(Fe) - Fe;
    o.dur = DUR_MIN + (DUR_MAX - DUR_MIN) * Math.random();
    return true;
  }
  return false;
}

/* -------------------------------------------------------------------------------------------- */
/* Component                                                                                    */
/* -------------------------------------------------------------------------------------------- */

const CometBody: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const res = useMemo(() => {
    const geometry = buildGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uNuc: { value: new THREE.Vector3() },
        uAnti: { value: new THREE.Vector3(1, 0, 0) },
        uBend: { value: new THREE.Vector3(0, -1, 0) },
        uIonLen: { value: 1 },
        uDustLen: { value: 1 },
        uComa: { value: 1 },
        uScale: { value: 1 },
        uTime: { value: 0 },
        uPx: { value: 500 },
        uDpr: { value: 1 },
        uAlpha: { value: 0 },
        uBright: { value: 1 },
        uSeed: { value: new THREE.Vector4() },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    return { geometry, material };
  }, []);
  useEffect(
    () => () => {
      res.geometry.dispose();
      res.material.dispose();
    },
    [res]
  );

  const st = useMemo(
    () => ({
      active: false,
      timer: FIRST_DELAY + Math.random(),
      homeFor: 0,
      t: 0,
      clock: 0,
      kill: 1, // fades to 0 when leaving the home page mid-flight
      orbit: {
        P: new THREE.Vector3(),
        Q: new THREE.Vector3(),
        q: 1,
        e: 2,
        a: 1,
        bq: 1,
        Ms: 0,
        Me: 0,
        dur: 7,
        sc: 1,
        dir: Math.random() < 0.5 ? 1 : -1,
      } as Orbit,
    }),
    []
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.1);
    const home = currentMode.current === "home";
    st.homeFor = home ? st.homeFor + dt : 0;
    _sun.set(sunWorld.x, sunWorld.y, sunWorld.z);

    if (!st.active) {
      mesh.visible = false;
      st.timer -= dt;
      if (st.timer > 0) return;
      if (st.homeFor < HOME_SETTLE) {
        st.timer = 1;
        return;
      }
      const aspect = state.size.width / Math.max(state.size.height, 1);
      if (!planOrbit(st.orbit, _sun, aspect)) {
        st.timer = 4;
        return;
      }
      st.active = true;
      st.t = 0;
      st.kill = 1;
      st.timer = GAP_MIN + (GAP_MAX - GAP_MIN) * Math.random();
      st.orbit.dir = -st.orbit.dir; // next one comes from the other side
      (res.material.uniforms.uSeed.value as THREE.Vector4).set(
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random()
      );
    }

    st.t += dt;
    st.timer -= dt;
    st.clock += dt;
    if (!home) st.kill = Math.max(0, st.kill - dt * 2);
    const o = st.orbit;
    const u = st.t / o.dur;
    if (u >= 1 || st.kill <= 0) {
      st.active = false;
      mesh.visible = false;
      if (st.timer < 8) st.timer = 8 + Math.random() * 6;
      return;
    }

    const F = solveF(o.e, o.Ms + (o.Me - o.Ms) * u);
    const uni = res.material.uniforms;
    const nuc = uni.uNuc.value as THREE.Vector3;
    orbitPos(o, F, _sun, nuc);
    orbitVel(o, F, _v);
    const act = tailFrame(o, nuc, _v, _sun);
    (uni.uAnti.value as THREE.Vector3).copy(_A);
    (uni.uBend.value as THREE.Vector3).copy(_B);
    uni.uIonLen.value = ionLenOf(act, o.sc);
    uni.uDustLen.value = dustLenOf(act, o.sc);
    uni.uComa.value = o.sc * (1.1 + 1.2 * act);
    uni.uScale.value = o.sc;
    uni.uBright.value = 0.35 + 0.65 * Math.pow(act, 1.5);
    uni.uAlpha.value = THREE.MathUtils.smoothstep(u, 0, 0.1) * (1 - THREE.MathUtils.smoothstep(u, 0.9, 1)) * st.kill;
    uni.uTime.value = st.clock;
    const cam = state.camera as THREE.PerspectiveCamera;
    const dpr = state.viewport.dpr;
    uni.uDpr.value = dpr;
    uni.uPx.value = (0.5 * state.size.height * dpr) / Math.tan(THREE.MathUtils.degToRad((cam.fov || 75) / 2));
    mesh.visible = true;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={res.geometry}
      material={res.material}
      frustumCulled={false}
      visible={false}
      renderOrder={6}
    />
  );
};

export const Comet: React.FC = () => {
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  return reduceMotion ? null : <CometBody />;
};
