import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/*
 * Hyperspace / warp-speed streaks.
 *
 * Everything is drawn in camera space straight from the shaders (only the camera's
 * projectionMatrix is used), so the effect sticks to whatever camera is active,
 * wherever it is. Two draw calls:
 *  1. a full-screen "tunnel" triangle behind everything: edge vignette, streaming light rays on the tunnel
 *     wall and a chromatic rim (premultiplied alpha: it can both darken and glow),
 *  2. ~850 instanced streak quads (depth-tested, so solid bodies hide them): stars on a cylinder around the view axis rushing
 *     toward the camera; each streak spans the star's head and the point it occupied a
 *     moment ago, so perspective makes them short and slow near the centre and long and
 *     fast toward the edges. Additive, tapered, with a soft halo and a light RGB split.
 * intensityRef.current (0..1) is read every frame; at 0 the group is hidden.
 */

const COUNT = 850;
const Z_NEAR = 0.4;
const Z_FAR = 72;
const L_MAX = 40; // streak length in depth units at full intensity
const L_VAR = 1.35; // longest per-star length factor
// virtual head depth goes past the camera so tails keep flowing out after the head has left
const Z_MIN = Z_NEAR - L_MAX * L_VAR;
const RANGE = Z_FAR - Z_MIN;
const WRAP = RANGE * 10; // speeds are multiples of 0.1, so travel can wrap here seamlessly

const STREAK_VERT = /* glsl */ `
uniform float uTravel;
uniform float uI;
uniform float uLen;
uniform vec2 uRes;
uniform float uDpr;
attribute vec4 aSeed;   // angle, radius, phase, speed factor
attribute vec4 aColor;  // rgb (with brightness), width factor
varying vec3 vColor;
varying float vAlong;
varying float vSide;
varying float vLen;
varying float vHalfW;
varying float vRad;
varying float vAlpha;
varying float vCA;

const float Z_NEAR = ${Z_NEAR.toFixed(3)};
const float Z_FAR = ${Z_FAR.toFixed(3)};
const float Z_MIN = ${Z_MIN.toFixed(3)};
const float RANGE = ${RANGE.toFixed(3)};
const float L_VAR = ${L_VAR.toFixed(3)};

void main() {
  float d = fract(aSeed.z + uTravel * aSeed.w / RANGE);   // 0 = just born far away
  float zV = Z_FAR - d * RANGE;
  float zH = max(zV, Z_NEAR);
  float zT = clamp(zV + uLen * (L_VAR - 0.7 * fract(aSeed.z * 7.31)), Z_NEAR, Z_FAR);
  vec2 xy = vec2(cos(aSeed.x), sin(aSeed.x)) * aSeed.y;

  vec4 cH = projectionMatrix * vec4(xy, -zH, 1.0);
  vec4 cT = projectionMatrix * vec4(xy, -zT, 1.0);
  vec2 hr = 0.5 * uRes;
  vec2 sH = cH.xy / cH.w * hr;
  vec2 sT = cT.xy / cT.w * hr;
  // vanishing point (view axis) in pixels, so a view offset keeps working
  vec4 cC = projectionMatrix * vec4(0.0, 0.0, -1.0, 1.0);
  vec2 sC = cC.xy / cC.w * hr;

  vec2 dv = sH - sT;
  float len = length(dv);
  vec2 dir = len > 1e-3 ? dv / len : normalize(sH - sC + vec2(1e-4, 0.0));
  vec2 nrm = vec2(-dir.y, dir.x);

  float radH = length(sH - sC) / hr.y;   // head distance from centre, in half-heights
  float near = clamp(radH, 0.0, 1.8);
  float halfW = uDpr * aColor.w * (0.45 + 0.55 * near) * (0.75 + 0.35 * uI);
  float pad = halfW * 4.0 + uDpr;        // room for the halo
  float ca = uDpr * (0.5 + 2.0 * near) * uI * uI * uI;   // chromatic split, px
  float padHead = pad + ca + halfW * 2.0;

  float a = position.x;                  // 0 tail .. 1 head
  vec2 s = a < 0.5 ? sT - dir * pad : sH + dir * padHead;
  s += nrm * position.y * pad;
  // real depth of each end: planets and other solid bodies hide the streaks behind them
  float z = a < 0.5 ? cT.z / cT.w : cH.z / cH.w;
  gl_Position = vec4(s / hr, clamp(z, -0.99999, 0.99999), 1.0);

  vAlong = a < 0.5 ? -pad : len + padHead;
  vSide = position.y * pad;
  vLen = len;
  vHalfW = halfW;
  vRad = length(s - sC) / hr.y;
  vCA = ca;

  // born softly far away; brighter as the star nears the camera
  float born = smoothstep(0.0, 0.07, d);
  float bright = clamp(0.35 + 0.75 * near, 0.35, 1.25);
  vAlpha = born * bright * smoothstep(0.0, 0.45, uI) * (0.55 + 0.45 * uI);
  vColor = aColor.rgb;
}
`;

const STREAK_FRAG = /* glsl */ `
uniform float uI;
varying vec3 vColor;
varying float vAlong;
varying float vSide;
varying float vLen;
varying float vHalfW;
varying float vRad;
varying float vAlpha;
varying float vCA;

// brightness along the streak: dark tail -> bright head, round soft cap past the head
float along(float x) {
  float L = max(vLen, 1.0);
  float t = clamp(x / L, 0.0, 1.0);
  float body = t * t * (0.35 + 0.65 * t);
  float tailCap = smoothstep(-vHalfW * 1.5, vHalfW * 0.5, x);
  float past = max(x - vLen, 0.0) / (vHalfW * 1.6 + 0.5);
  float head = exp(-past * past);
  return body * tailCap * head;
}

void main() {
  float L = max(vLen, 1.0);
  float t = clamp(vAlong / L, 0.0, 1.0);
  float w = vHalfW * mix(0.3, 1.0, t);           // tapered
  float x = abs(vSide) / max(w, 0.2);
  float core = exp(-x * x * 1.6);
  float halo = exp(-x * 0.85) * 0.22;
  float prof = core + halo;

  // blue runs ahead of the head, red lags behind: a light lens-like split
  vec3 c = vec3(along(vAlong + vCA * 0.6), along(vAlong), along(vAlong - vCA));
  // tails cool down toward violet-blue at high intensity
  vec3 tint = mix(vColor, vColor * vec3(0.62, 0.72, 1.08), (1.0 - t) * uI);
  vec3 col = tint * c * prof;
  // hot white core near the head
  col += vec3(0.9, 0.95, 1.0) * core * core * along(vAlong) * t * 0.35;

  float clearC = smoothstep(0.05, 0.34, vRad);   // keep the middle of the screen calm
  gl_FragColor = vec4(col * vAlpha * clearC, 1.0);
}
`;

const TUNNEL_VERT = /* glsl */ `
varying vec2 vP;
void main() {
  vP = position.xy;
  // at the far end of the depth range: it lights up empty space, never a planet
  gl_Position = vec4(position.xy, 0.99999, 1.0);
}
`;

const TUNNEL_FRAG = /* glsl */ `
uniform float uI;
uniform float uTravel;
uniform float uTime;
uniform float uAspect;
uniform vec2 uCenter;
varying vec2 vP;

float h21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
// value noise, periodic in x
float vnoise(vec2 x, float per) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float i0 = mod(i.x, per);
  float i1 = mod(i.x + 1.0, per);
  float a = h21(vec2(i0, i.y));
  float b = h21(vec2(i1, i.y));
  float c = h21(vec2(i0, i.y + 1.0));
  float d = h21(vec2(i1, i.y + 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 p = (vP - uCenter) * vec2(uAspect, 1.0);
  float r = length(p);
  float ang = atan(p.y, p.x) / 6.2831853 + 0.5;
  float lr = log(max(r, 0.02));

  // light rays on the tunnel wall, streaming outward
  float flow = lr * 1.6 - uTravel * 0.045;
  float n1 = vnoise(vec2(ang * 140.0, flow), 140.0);
  float n2 = vnoise(vec2(ang * 56.0 + 17.0, flow * 0.6 + 3.1), 56.0);
  float rays = pow(n1, 4.0) * 0.8 + pow(n2, 3.0) * 0.5;

  float I = uI;
  float I2 = I * I;
  float wall = smoothstep(0.3, 1.45, r);
  float edge = smoothstep(0.75, 1.9, r);

  // cool blue on the inner wall, deep indigo toward the edges, faint cyan/violet split on the rim
  vec3 cIn = vec3(0.20, 0.42, 1.0);
  vec3 cOut = vec3(0.30, 0.24, 0.95);
  vec3 col = mix(cIn, cOut, smoothstep(0.5, 1.7, r));
  vec3 glow = col * wall * (0.035 + 0.30 * rays) * I2;
  float rim = smoothstep(1.05, 1.95, r);
  float split = I2 * I;
  glow += vec3(0.42, 0.12, 0.75) * rim * 0.09 * split * (0.5 + 0.9 * n2);
  glow += vec3(0.05, 0.50, 0.80) * smoothstep(0.55, 1.05, r) * (1.0 - rim) * 0.05 * split * (0.5 + n1);

  // a small, sharp light at the vanishing point (the destination)
  glow += vec3(0.75, 0.85, 1.0) * exp(-r * r * 3000.0) * 0.4 * I2 * I;
  glow += vec3(0.35, 0.5, 1.0) * exp(-r * r * 400.0) * 0.035 * I2 * I;

  // darken the periphery so the streaks own the frame
  float dark = I * (0.22 * wall + 0.4 * edge);

  float dither = (h21(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  gl_FragColor = vec4(glow + dither, clamp(dark, 0.0, 0.85));
}
`;

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

const noRaycast = () => undefined;

export const WarpStreaks: React.FC<{ intensityRef: React.MutableRefObject<number> }> = ({
  intensityRef,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const state = useRef({ travel: 0, time: 0 });

  const { streakGeo, streakMat, tunnelGeo, tunnelMat } = useMemo(() => {
    const rnd = mulberry32(0x5eed42);

    // streak geometry: one quad (x: 0 tail .. 1 head, y: -1 .. 1 across), instanced
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, -1, 0, 1, -1, 0, 0, 1, 0, 1, 1, 0], 3)
    );
    g.setIndex([0, 1, 2, 2, 1, 3]);
    const seeds = new Float32Array(COUNT * 4);
    const colors = new Float32Array(COUNT * 4);
    for (let i = 0; i < COUNT; i++) {
      seeds[i * 4] = rnd() * Math.PI * 2;
      // radius of the cylinder: most stars close to the axis, some far out
      seeds[i * 4 + 1] = 4.2 + 24 * Math.pow(rnd(), 1.35);
      seeds[i * 4 + 2] = rnd();
      seeds[i * 4 + 3] = 0.8 + 0.1 * Math.floor(rnd() * 5);

      const k = rnd();
      let r: number, gg: number, b: number;
      if (k < 0.5) [r, gg, b] = [0.78, 0.88, 1.0]; // blue-white
      else if (k < 0.7) [r, gg, b] = [0.96, 0.97, 1.0]; // white
      else if (k < 0.92) [r, gg, b] = [0.42, 0.66, 1.0]; // blue
      else [r, gg, b] = [1.0, 0.76, 0.5]; // a few warm ones
      const bright = 0.55 + 0.6 * Math.pow(rnd(), 1.6);
      colors[i * 4] = r * bright;
      colors[i * 4 + 1] = gg * bright;
      colors[i * 4 + 2] = b * bright;
      colors[i * 4 + 3] = 0.6 + 0.8 * Math.pow(rnd(), 2.0); // width factor
    }
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 4));
    g.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 4));
    g.instanceCount = COUNT;

    const sm = new THREE.ShaderMaterial({
      vertexShader: STREAK_VERT,
      fragmentShader: STREAK_FRAG,
      uniforms: {
        uTravel: { value: 0 },
        uI: { value: 0 },
        uLen: { value: 1 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uDpr: { value: 1 },
      },
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    const tg = new THREE.BufferGeometry();
    tg.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3)
    );
    const tm = new THREE.ShaderMaterial({
      vertexShader: TUNNEL_VERT,
      fragmentShader: TUNNEL_FRAG,
      uniforms: {
        uI: { value: 0 },
        uTravel: { value: 0 },
        uTime: { value: 0 },
        uAspect: { value: 1 },
        uCenter: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
      depthTest: true,
      depthWrite: false,
      // premultiplied: rgb is added, alpha darkens what is behind
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.ZeroFactor,
      blendDstAlpha: THREE.OneFactor,
      toneMapped: false,
    });
    return { streakGeo: g, streakMat: sm, tunnelGeo: tg, tunnelMat: tm };
  }, []);

  useEffect(
    () => () => {
      streakGeo.dispose();
      streakMat.dispose();
      tunnelGeo.dispose();
      tunnelMat.dispose();
    },
    [streakGeo, streakMat, tunnelGeo, tunnelMat]
  );

  useFrame((st, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const raw = intensityRef.current;
    const I = raw > 0 ? (raw < 1 ? raw : 1) : 0;
    if (I < 0.002) {
      if (g.visible) g.visible = false;
      return;
    }
    g.visible = true;

    const s = state.current;
    const dt = delta < 0.05 ? delta : 0.05;
    // forward speed (depth units / s) grows sharply with intensity
    s.travel += dt * (3 + 120 * I * I);
    if (s.travel > WRAP) s.travel -= WRAP;
    s.time += dt;

    const dpr = st.viewport.dpr;
    const w = st.size.width * dpr;
    const h = st.size.height * dpr;

    const su = streakMat.uniforms;
    su.uTravel.value = s.travel;
    su.uI.value = I;
    su.uLen.value = 0.25 + (L_MAX - 0.25) * Math.pow(I, 2.1);
    (su.uRes.value as THREE.Vector2).set(w, h);
    su.uDpr.value = dpr;

    const tu = tunnelMat.uniforms;
    tu.uI.value = I;
    tu.uTravel.value = s.travel;
    tu.uTime.value = s.time;
    tu.uAspect.value = w / h;
    // portrait screens see a narrower slice of the tunnel: fewer streaks keep it airy
    const n = Math.round(COUNT * Math.min(1, Math.max(0.62, 0.45 + 0.4 * (w / h))));
    if (streakGeo.instanceCount !== n) streakGeo.instanceCount = n;
    // vanishing point of the view axis (non-zero only with a view offset)
    const pm = st.camera.projectionMatrix.elements;
    (tu.uCenter.value as THREE.Vector2).set(-pm[8], -pm[9]);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh
        geometry={tunnelGeo}
        material={tunnelMat}
        frustumCulled={false}
        renderOrder={9998}
        raycast={noRaycast}
      />
      <mesh
        geometry={streakGeo}
        material={streakMat}
        frustumCulled={false}
        renderOrder={9999}
        raycast={noRaycast}
      />
    </group>
  );
};
