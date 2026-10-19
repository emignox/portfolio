import{r as c,u as Ce,j as g,b as de,L as Fo,d as Eo,e as Lo,H as jo,T as Tt,C as No}from"./r3f-DIZZbEk2.js";import{c as z,H as ao,d as Ee,m as Q,K as Ge,Q as se,D as Bo,X as Oo,J as no,Y as qo,s as fe,Z as Ye,r as Do,_ as Ho,f as Wo,$ as ro,G as Ue,a0 as kt,a1 as Vo,M as so,S as co,O as Go,a2 as io,a3 as lo,a4 as uo,R as Uo,a5 as we,a6 as Y,a7 as $o,a8 as _t,a9 as Yo,aa as Ko,ab as Pt,U as Zo,ac as Xo,ad as Qo,y as Jo,I as ea,F as It,z as Ft,ae as Et,af as ta,ag as oa,ah as aa,ai as na}from"./three-0dCoRM5G.js";import{p as ra,w as Fe,s as Lt}from"./index-hUwiUukL.js";const ft=`
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
`,mt=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,sa="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",ca=`
uniform float uFace;
uniform float uSize;
uniform vec3 uSeed;
uniform float uSeedF;
uniform int uPass;
${ft}
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
`,ia=`
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
`,la=`
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
`,ua=`
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
`,da=`
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
`,fa=`
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
`,ma=`
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
`,va=`
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
`,pa=`
vec4 bakeAlbedo(vec3 d) {
  float n = fbm(vec3(d.x * 2.0, d.y * 14.0, d.z * 2.0) + uSeed, 4);
  float y = d.y + n * 0.02;
  vec3 col = mix(vec3(0.52, 0.78, 0.84), vec3(0.6, 0.83, 0.87), 0.5 + 0.5 * sin(y * 9.0));
  col *= 0.985 + 0.03 * n;
  col = mix(col, vec3(0.68, 0.88, 0.9), smoothstep(0.55, 0.9, -y) * 0.6);
  col = mix(col, vec3(0.64, 0.86, 0.89), smoothstep(0.65, 0.95, y) * 0.4);
  return vec4(col, 0.0);
}
`,ha=`
varying vec3 vObj;
varying vec3 vWorld;
void main() {
  vObj = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,xa=`
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
  ${mt}
}
`,ga=`
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,ya=`
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
  ${mt}
}
`,wa=`
varying vec3 vWorld;
varying vec2 vLocal;
void main() {
  vLocal = position.xy;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,ba=`
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
  ${mt}
}
`,Ma=`
uniform float uTime;
uniform float uBright;
uniform mat3 uViewToObj;
varying vec2 vUv;
${ft}
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
`,jt=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Sa=`
uniform float uTime;
uniform float uI;
uniform float uScale;
varying vec2 vUv;
${ft}
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
`,fo={earth:{body:la,bake:512,normal:!0,clouds:!0,gas:!1,ls:0,limb:0,sunI:1.45,tilt:.41,seed:3,ring:null,segments:64,atmo:{color:[.2,.45,1],twilight:[.45,.16,.06],scale:1.05,falloff:3.4,intensity:.5,haze:.2}},mars:{body:ua,bake:512,normal:!0,clouds:!1,gas:!1,ls:.35,limb:0,sunI:1.4,tilt:.44,seed:5,ring:null,segments:64,atmo:{color:[1,.6,.4],twilight:[.7,.45,.4],scale:1.025,falloff:4,intensity:.4,haze:.18}},jupiter:{body:fa,bake:512,normal:!1,clouds:!1,gas:!0,ls:0,limb:.6,sunI:1.25,tilt:.05,seed:2,ring:null,segments:64,atmo:{color:[1,.86,.62],twilight:[.9,.55,.3],scale:1.025,falloff:4.5,intensity:.3,haze:.15}},saturn:{body:ma,bake:512,normal:!1,clouds:!1,gas:!0,ls:0,limb:.55,sunI:1.25,tilt:.47,seed:4,ring:"saturn",segments:64,atmo:{color:[1,.88,.62],twilight:[.9,.6,.32],scale:1.025,falloff:4.5,intensity:.28,haze:.15}},uranus:{body:pa,bake:256,normal:!1,clouds:!1,gas:!0,ls:0,limb:.6,sunI:1,tilt:1.71,seed:6,ring:"uranus",segments:64,atmo:{color:[.5,.9,1],twilight:[.4,.7,.9],scale:1.035,falloff:4,intensity:.45,haze:.25}},neptune:{body:va,bake:256,normal:!1,clouds:!1,gas:!0,ls:0,limb:.55,sunI:1.3,tilt:.49,seed:7,ring:null,segments:64,atmo:{color:[.3,.62,1],twilight:[.3,.45,.9],scale:1.035,falloff:4,intensity:.5,haze:.25}},moon:{body:da,bake:256,normal:!0,clouds:!1,gas:!1,ls:.85,limb:0,sunI:1.5,tilt:.1,seed:1,ring:null,segments:48,atmo:null,rim:[.75,.8,.9]}},ct=new WeakMap;function vt(e){let t=Math.floor(Math.abs(e))*2654435761+12345>>>0||1;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}function Ra(e,t,a){const l=fo[t],m=vt(a*977+31),r={},w=new Q({vertexShader:sa,fragmentShader:ca+l.body+ia,defines:r,uniforms:{uFace:{value:0},uSize:{value:l.bake},uSeed:{value:new z(m()*60-30,m()*60-30,m()*60-30)},uSeedF:{value:Math.abs(Math.floor(a))%1e3},uPass:{value:0}},depthTest:!1,depthWrite:!1}),v=new no(2,2),o=new so(v,w);o.frustumCulled=!1;const d=new co;d.add(o);const h=new Go(-1,1,1,-1,0,1),S=e.getRenderTarget(),n=e.xr.enabled,p=e.autoClear;e.xr.enabled=!1,e.autoClear=!0;const u=s=>{const i=new uo(l.bake,{generateMipmaps:!0,minFilter:ro,magFilter:Ue,depthBuffer:!1,stencilBuffer:!1});w.uniforms.uPass.value=s;for(let x=0;x<6;x++)i.texture.generateMipmaps=x===5,w.uniforms.uFace.value=x,e.setRenderTarget(i,x),e.render(d,h);return i},f={albedo:u(0),normal:l.normal?u(1):null,clouds:l.clouds?u(2):null};return e.setRenderTarget(S),e.xr.enabled=n,e.autoClear=p,w.dispose(),v.dispose(),f}function Aa(e){var t,a,l;(t=ct.get(e.gl))==null||t.delete(e.key),e.set.albedo.dispose(),(a=e.set.normal)==null||a.dispose(),(l=e.set.clouds)==null||l.dispose()}function mo(e,t){e.timer&&clearTimeout(e.timer),e.timer=setTimeout(()=>{e.timer=null,e.refs<=0&&Aa(e)},t)}function za(e,t,a){let l=ct.get(e);l||(l=new Map,ct.set(e,l));const m=`${t}:${a}`;let r=l.get(m);return r||(r={set:Ra(e,t,a),refs:0,timer:null,key:m,gl:e},l.set(m,r),mo(r,5e3)),r}function Ca(e){e.refs++,e.timer&&(clearTimeout(e.timer),e.timer=null)}function Ta(e){e.refs--,e.refs<=0&&mo(e,1500)}const ae=(e,t,a)=>{const l=Math.min(1,Math.max(0,(a-e)/(t-e)));return l*l*(3-2*l)};function ka(e,t){const l=new Uint8Array(8192),m=vt(t*131+7),r=1024,w=new Float32Array(r);for(let p=0;p<r;p++)w[p]=m();const v=p=>{const u=Math.floor(p),f=p-u,s=w[(u%r+r)%r],i=w[((u+1)%r+r)%r];return s+(i-s)*f*f*(3-2*f)},o=(p,u,f,s)=>ae(u-s,u+s,p)*(1-ae(f-s,f+s,p)),d=(p,u,f)=>Math.exp(-(((p-u)/f)**2)),h=e==="saturn"?1.11:1.6,S=e==="saturn"?2.34:2.06;for(let p=0;p<2048;p++){const u=h+(S-h)*(p+.5)/2048;let f=0,s;if(e==="saturn"){const i=v(u*55),x=v(u*260+50),b=v(u*1100+100),_=.82+.18*b,P=.035*o(u,1.11,1.236,.01)*(.5+.5*x),W=o(u,1.239,1.527,.003)*(.1+.08*i+.1*x+.16*ae(.72,.85,x))*_,O=o(u,1.527,1.951,.002)*(.58+.32*ae(1.56,1.74,u)+.08*i)*(.84+.16*x)*_,T=o(u,1.951,2.027,.002)*(.03+.05*x+.12*d(u,1.99,.004)),I=o(u,2.027,2.269,.002)*(.5+.12*i+.06*x)*(.85+.15*b)*(1-o(u,2.2115,2.2165,8e-4))*(1-o(u,2.2635,2.2655,4e-4))*(1-.25*ae(2.2,2.265,u)),E=.55*d(u,2.326,.0028);f=P+W+O+T+I+E;const C=[.5,.45,.39],j=[.86+.06*i,.74+.06*i,.54+.06*x],N=[.78,.7,.58],L=ae(1.5,1.56,u),V=ae(1.95,2.03,u);s=[0,1,2].map(q=>{const Z=C[q]+(j[q]-C[q])*L;return Z+(N[q]-Z)*V})}else{const i=[[1.637,.0035,.35],[1.652,.0035,.35],[1.666,.0035,.38],[1.75,.005,.42],[1.786,.005,.42],[1.834,.0035,.3],[1.863,.0045,.42],[1.9,.0055,.48],[2,.016,.8]];f=.012*o(u,1.62,2.03,.01);for(const[x,b,_]of i)f+=.6*_*d(u,x,b);s=[.36,.38,.41]}f=Math.min(1,Math.max(0,f)),l[p*4+0]=Math.round(255*Math.pow(s[0],1.1)),l[p*4+1]=Math.round(255*Math.pow(s[1],1.1)),l[p*4+2]=Math.round(255*Math.pow(s[2],1.1)),l[p*4+3]=Math.round(255*f)}const n=new Ho(l,2048,1,Wo);return n.generateMipmaps=!0,n.minFilter=ro,n.magFilter=Ue,n.wrapS=kt,n.wrapT=kt,n.needsUpdate=!0,{tex:n,inner:h,outer:S}}const vo=new z,He=new Ye,_a=new z(1,0,.45).normalize();function po(e,t){typeof e=="function"?e(t):e&&(e.current=t)}const Nt=c.forwardRef(function({kind:t,radius:a,sunRef:l,highlightRef:m,dimRef:r,seed:w,spin:v=.1,tilt:o,position:d},h){const S=de(T=>T.gl),n=fo[t],p=w??n.seed,u=o??n.tilt,f=c.useMemo(()=>za(S,t,p),[S,t,p]);c.useEffect(()=>(Ca(f),()=>Ta(f)),[f]);const s=c.useMemo(()=>n.ring?ka(n.ring,p):null,[n.ring,p]),i=c.useMemo(()=>{const T={uSunPos:{value:new z},uCenter:{value:new z},uPlanetR:{value:1},uDim:{value:1},uHighlight:{value:0},uSunI:{value:n.sunI},uRingNormal:{value:new z(0,1,0)}},I={};n.normal&&(I.HAS_NORMAL=""),n.gas&&(I.GAS=""),t==="earth"&&(I.EARTH=""),s&&(I.RING_SHADOW="");const E=n.atmo,C={...T,uAlbedo:{value:f.set.albedo.texture},uNormalMap:{value:f.set.normal?f.set.normal.texture:null},uClouds:{value:f.set.clouds?f.set.clouds.texture:null},uCloudRot:{value:new Ee(1,0)},uNormalMat:{value:new ao},uRimColor:{value:new z(...E?E.color:n.rim??[.8,.8,.8])},uHaze:{value:E?E.haze:0},uLS:{value:n.ls},uLimb:{value:n.limb},uDrift:{value:0},uRingTex:{value:s?s.tex:null},uRingInner:{value:s?s.inner:0},uRingOuter:{value:s?s.outer:1}},j=new Q({vertexShader:ha,fragmentShader:xa,uniforms:C,defines:I}),N=new Ge(1,n.segments,Math.round(n.segments*.75));let L=null,V=null;E&&(L=new Q({vertexShader:ga,fragmentShader:ya,uniforms:{...T,uAtmScale:{value:E.scale},uColor:{value:new z(...E.color)},uTwilight:{value:new z(...E.twilight)},uIntensity:{value:E.intensity},uFalloff:{value:E.falloff}},transparent:!0,depthWrite:!1,blending:se}),V=new Ge(1,48,32));let q=null,Z=null;return s&&(q=new Q({vertexShader:wa,fragmentShader:ba,uniforms:{...T,uRingTex:{value:s.tex},uRingInner:{value:s.inner},uRingOuter:{value:s.outer}},transparent:!0,depthWrite:!1,side:Bo}),Z=new Oo(s.inner,s.outer,192,1)),{shared:T,surface:j,sphere:N,atmo:L,atmoGeo:V,ringMat:q,ringGeo:Z}},[t,n,f,s]);c.useEffect(()=>()=>{var T,I,E,C;i.surface.dispose(),i.sphere.dispose(),(T=i.atmo)==null||T.dispose(),(I=i.atmoGeo)==null||I.dispose(),(E=i.ringMat)==null||E.dispose(),(C=i.ringGeo)==null||C.dispose()},[i]),c.useEffect(()=>()=>s==null?void 0:s.tex.dispose(),[s]);const x=c.useRef(null),b=c.useRef(null),_=c.useRef(null),P=c.useRef(null);c.useLayoutEffect(()=>{const T=x.current;if(!T)return;const I=i.shared,E=i.surface.uniforms.uNormalMat.value,C=L=>{const V=L.matrixWorld;I.uCenter.value.setFromMatrixPosition(V),I.uPlanetR.value=vo.setFromMatrixColumn(V,0).length()*T.scale.x/(L.scale.x||1),I.uSunPos.value.copy(l.current);const q=T.parent;q&&I.uRingNormal.value.setFromMatrixColumn(q.matrixWorld,1).normalize()};T.onBeforeRender=()=>{C(T),E.setFromMatrix4(T.matrixWorld)};const j=_.current;j&&(j.onBeforeRender=()=>C(j));const N=P.current;return N&&(N.onBeforeRender=()=>C(N)),()=>{T.onBeforeRender=()=>{},j&&(j.onBeforeRender=()=>{}),N&&(N.onBeforeRender=()=>{})}},[i,l]),c.useLayoutEffect(()=>{var T;(T=b.current)==null||T.quaternion.setFromAxisAngle(_a,u)},[u]),Ce((T,I)=>{const E=x.current;if(!E)return;const C=Math.min(I,.1);E.rotation.y+=v*C;const j=T.clock.elapsedTime,N=i.shared;N.uHighlight.value=fe.clamp((m==null?void 0:m.current)??0,0,1),N.uDim.value=fe.clamp((r==null?void 0:r.current)??1,0,1);const L=i.surface.uniforms;if(n.gas&&(L.uDrift.value=.22*Math.sin(j*.035)),t==="earth"){const V=j*.012;L.uCloudRot.value.set(Math.cos(V),Math.sin(V))}});const W=c.useCallback(T=>po(h,T),[h]),O=n.atmo;return g.jsxs("group",{ref:W,position:d,children:[g.jsxs("group",{ref:b,children:[g.jsx("mesh",{ref:x,geometry:i.sphere,material:i.surface,scale:a}),i.ringGeo&&i.ringMat&&g.jsx("mesh",{ref:P,geometry:i.ringGeo,material:i.ringMat,scale:a,rotation:[-Math.PI/2,0,0]})]}),i.atmoGeo&&i.atmo&&O&&g.jsx("mesh",{ref:_,geometry:i.atmoGeo,material:i.atmo,scale:a*O.scale})]})});function ho(e,t){const a=document.createElement("canvas");a.width=a.height=e;const l=a.getContext("2d");l&&t(l,e);const m=new io(a);return m.colorSpace=lo,m.needsUpdate=!0,m}function ot(e,t,a){return ho(e,(l,m)=>{const r=l.createImageData(m,m),w=m/2;for(let v=0;v<m;v++)for(let o=0;o<m;o++){const d=Math.hypot(o+.5-w,v+.5-w)/w,h=d>=1?0:Math.max(0,a(d)),S=(v*m+o)*4,n=Math.random()-.5;r.data[S]=Math.min(255,Math.max(0,h*t[0]*255+n)),r.data[S+1]=Math.min(255,Math.max(0,h*t[1]*255+n)),r.data[S+2]=Math.min(255,Math.max(0,h*t[2]*255+n)),r.data[S+3]=255}l.putImageData(r,0,0)})}function Bt(e,t,a,l,m){return ho(e,(r,w)=>{const v=vt(t),o=w/2;r.fillStyle="#000",r.fillRect(0,0,w,w),r.globalCompositeOperation="lighter";for(let h=0;h<a;h++){const S=v()*Math.PI*2,n=o*m*(.2+.8*Math.pow(v(),2.6)),p=.004+.012*v(),u=.025+.09*Math.pow(v(),2),f=v(),s=Math.round(200+40*f),i=Math.round(130+80*f);for(let x=0;x<3;x++){const b=p*(1+x*2.2),_=u/(1+x*2.5),P=r.createRadialGradient(o,o,o*l,o,o,n);P.addColorStop(0,`rgba(255,${s},${i},${_})`),P.addColorStop(.25,`rgba(255,${s},${i},${_*.5})`),P.addColorStop(1,`rgba(255,${s},${i},0)`),r.fillStyle=P,r.beginPath(),r.moveTo(o,o),r.lineTo(o+Math.cos(S-b)*n,o+Math.sin(S-b)*n),r.lineTo(o+Math.cos(S+b)*n,o+Math.sin(S+b)*n),r.closePath(),r.fill()}}r.globalCompositeOperation="destination-in";const d=r.createRadialGradient(o,o,0,o,o,o);d.addColorStop(0,"rgba(0,0,0,1)"),d.addColorStop(.8,"rgba(0,0,0,1)"),d.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=d,r.fillRect(0,0,w,w),r.globalCompositeOperation="destination-over",r.fillStyle="#000",r.fillRect(0,0,w,w)})}const ee={glow:5,corona:13,halo:46,rays1:22,rays2:16,coronaPlane:3.2};function Pa(){const e=new Q({vertexShader:jt,fragmentShader:Ma,uniforms:{uTime:{value:0},uBright:{value:1},uViewToObj:{value:new ao}},transparent:!0,depthWrite:!0,toneMapped:!1}),t=new Q({vertexShader:jt,fragmentShader:Sa,uniforms:{uTime:{value:0},uI:{value:1},uScale:{value:ee.coronaPlane}},transparent:!0,depthWrite:!1,blending:se,toneMapped:!1}),a=new no(2,2),l=f=>2/f,m=l(ee.glow),r=ot(256,[1,.7,.4],f=>{const s=f/m;return(s<1?1:.62*Math.exp(-(s-1)*4)+.38*Math.exp(-(s-1)*1.3))*(1-ae(.7,1,f))}),w=l(ee.corona),v=ot(256,[1,.56,.24],f=>{const s=f/w;return s<1?0:(.7*Math.exp(-(s-1)*1.1)+.3/(s*s))*(1-ae(.55,1,f))*ae(1,1.06,s)}),o=l(ee.halo),d=ot(256,[1,.5,.2],f=>{const s=Math.max(f/o,1);return 1/(1+Math.pow(s/2.4,2))*(1-ae(.3,1,f))}),h=Bt(1024,11,110,l(ee.rays1)*1.05,1),S=Bt(1024,23,70,l(ee.rays2)*1.05,.85),n=f=>new qo(new Vo({map:f,blending:se,transparent:!0,depthWrite:!1,toneMapped:!1})),p=[{sprite:n(d),size:ee.halo,opacity:.2,spinRate:0,phase:0,grow:.5},{sprite:n(v),size:ee.corona,opacity:.46,spinRate:0,phase:1.3,grow:.35},{sprite:n(h),size:ee.rays1,opacity:.3,spinRate:.006,phase:2.1,grow:.6},{sprite:n(S),size:ee.rays2,opacity:.26,spinRate:-.009,phase:4.2,grow:.6},{sprite:n(r),size:ee.glow,opacity:.62,spinRate:0,phase:3.3,grow:.25}];p.forEach((f,s)=>{f.sprite.renderOrder=s+1});const u=[r,v,d,h,S];return{sunMat:e,coronaMat:t,plane:a,layers:p,dispose(){e.dispose(),t.dispose(),a.dispose(),p.forEach(f=>f.sprite.material.dispose()),u.forEach(f=>f.dispose())}}}const at=new z,We=new z,ke=new z,Ot=new Ye,qt=new Ye,nt=new Ye,Dt=new Do,Ia=new z(0,1,0),Fa=c.forwardRef(function({radius:t,position:a,intensityRef:l},m){const r=c.useMemo(()=>Pa(),[]);c.useEffect(()=>()=>r.dispose(),[r]);const w=c.useRef(null),v=c.useRef(null),o=c.useRef(null),d=c.useRef(null);Ce(({camera:S,clock:n},p)=>{const u=w.current,f=v.current,s=o.current,i=d.current;if(!u||!f||!s||!i)return;const x=n.elapsedTime,b=Math.min(p,.1),_=fe.clamp((l==null?void 0:l.current)??1,0,1),P=_*_*(3-2*_);u.getWorldPosition(at);const W=vo.setFromMatrixColumn(u.matrixWorld,0).length()||1;S.getWorldPosition(ke),We.copy(ke).sub(at);const O=Math.max(We.length(),.001);We.multiplyScalar(1/O);const T=t*W;u.getWorldQuaternion(Ot),S.getWorldQuaternion(qt),He.copy(Ot).invert().multiply(qt),f.quaternion.copy(He),i.quaternion.copy(He);const I=Math.min(T/O,.95);f.scale.setScalar(t/Math.sqrt(1-I*I)),nt.setFromAxisAngle(Ia,x*.02).invert(),nt.multiply(He),Dt.makeRotationFromQuaternion(nt),r.sunMat.uniforms.uViewToObj.value.setFromMatrix4(Dt);const E=Math.min(T*1.05,O*.5);ke.copy(at).addScaledVector(We,E),u.worldToLocal(ke),s.position.copy(ke),s.scale.setScalar((O-E)/O),r.sunMat.uniforms.uTime.value=x,r.sunMat.uniforms.uBright.value=.12+.88*P,r.coronaMat.uniforms.uTime.value=x,r.coronaMat.uniforms.uI.value=P,i.scale.setScalar(t*ee.coronaPlane);for(const C of r.layers){const j=1+.04*Math.sin(x*1.3+C.phase)+.025*Math.sin(x*2.9+C.phase*1.7)+.015*Math.sin(x*6.1+C.phase*.6),N=C.sprite.material;N.opacity=C.opacity*P*j,N.rotation+=C.spinRate*b;const L=t*C.size*(1-C.grow+C.grow*P)*(1+(j-1)*.6);C.sprite.scale.set(L,L,1),C.sprite.visible=N.opacity>.002}});const h=c.useCallback(S=>{w.current=S,po(m,S)},[m]);return g.jsxs("group",{ref:h,position:a,children:[g.jsx("mesh",{ref:v,geometry:r.plane,material:r.sunMat,renderOrder:0}),g.jsxs("group",{ref:o,children:[g.jsx("mesh",{ref:d,geometry:r.plane,material:r.coronaMat,renderOrder:1}),r.layers.map((S,n)=>g.jsx("primitive",{object:S.sprite},n))]})]})}),Ea={core:"The core",product:"Product",erp:"Odoo & integrations",stack:"Stack"},Ht={core:"#fcd34d",product:"#fdba74",erp:"#5eead4",stack:"#c7d2fe"},_e=e=>{var t;return(t=ra.find(a=>a.title===e))==null?void 0:t.link},La=e=>new URL(e).hostname.replace("www.",""),H=[{id:"nemei",label:"Nemei",cat:"product",kind:"earth",desc:"AI fitness and nutrition platform: workouts, macros, food recognition.",link:_e("Nemei App"),radius:2.9,orbit:.26,phase:.6,uses:["python","ml","postgres","stripe","llm"],tilt:.41},{id:"ep",label:"EP Sportwear",cat:"product",kind:"mars",desc:"E-commerce for seamless activewear. Live and selling.",link:_e("EP Sportwear"),radius:2.4,orbit:.37,phase:2.7,uses:[],tilt:.44},{id:"reader",label:"Reader",cat:"product",kind:"jupiter",desc:"Reading app where the AI assistant lives inside the text.",link:_e("Reader"),radius:4.6,orbit:.5,phase:4.5,uses:["llm"],tilt:.05},{id:"odoo",label:"Odoo ERP",cat:"erp",kind:"saturn",desc:"Custom Odoo modules for billing, accounting workflows, API integrations and treasury.",radius:4,orbit:.63,phase:1.2,uses:["python","postgres","owl"],tilt:.47},{id:"radar",label:"Immoweb Radar",cat:"product",kind:"uranus",desc:"PWA that filters new Belgian listings and computes real costs.",link:_e("Immoweb Radar"),radius:3.1,orbit:.77,phase:3.6,uses:[],tilt:1.7},{id:"piano",label:"Piano Trainer",cat:"product",kind:"neptune",desc:"Learn to read music with daily practice built around your level.",link:_e("Piano Trainer"),radius:3.1,orbit:.9,phase:5.5,uses:[],tilt:.49}],te=[{id:"billing",label:"Usage-based billing",desc:"Turns metered usage records into orders and invoices with tariff, cap and VAT rules.",radius:.85,distance:9,speed:.46,phase:.3},{id:"api",label:"API integrations",desc:"JSON-2 API endpoints, a rejected-record replay queue and legacy flat-file order imports.",radius:.7,distance:11,speed:.36,phase:2},{id:"forecast",label:"Cash-flow forecasting",desc:"Treasury forecast engine with OWL/Chart.js dashboards, payment-term schedules and alerts.",radius:.8,distance:13,speed:.29,phase:3.7},{id:"approval",label:"Vendor bill approval",desc:"Blocks vendor bill payment until lines match the PO or routed approvals are done.",radius:.6,distance:15,speed:.23,phase:5.2}],pe=[{id:"python",label:"Python",desc:"FastAPI backends, Odoo modules and ML pipelines.",land:[-.84,-.2],port:[-.8,-.08]},{id:"ml",label:"scikit-learn",desc:"Random Forest models for personalised workout generation.",land:[-.68,-.47],port:[-.5,-.2]},{id:"stripe",label:"Stripe",desc:"Subscriptions, recurring billing and webhook-driven events.",land:[-.86,-.74],port:[-.8,-.52]},{id:"postgres",label:"PostgreSQL",desc:"Schema design and query optimisation for products and ERP.",land:[.84,-.2],port:[.8,-.08]},{id:"llm",label:"LLM APIs",desc:"Claude and Gemini running inside production features.",land:[.68,-.47],port:[.5,-.2]},{id:"owl",label:"OWL · QWeb",desc:"Odoo frontend components, PDF reports and templates.",land:[.86,-.74],port:[.8,-.52]}],Wt=[["python","ml"],["ml","stripe"],["python","stripe"],["postgres","llm"],["llm","owl"],["postgres","owl"]],Ve=e=>pe.findIndex(t=>t.id===e),re=[{type:"sun"},...H.map((e,t)=>({type:"planet",i:t})),...te.map((e,t)=>({type:"moon",i:t})),...pe.map((e,t)=>({type:"star",i:t}))],Ae=e=>1+e,Vt=H.findIndex(e=>e.id==="odoo"),it={current:!1},lt=new Map,xo=new z(0,28,-20),Gt=10,ja=75,ye=-75,Ut=-95,rt=128,$t="button, a, input, textarea, nav";function st(e){if(e.type==="sun")return{cat:"core",label:"React · Next.js · FastAPI",desc:"The full-stack core every product orbits around.",lines:[{title:"Orbiting",items:H.map(a=>a.label)}]};if(e.type==="planet"){const a=H[e.i],l=a.uses.map(r=>pe[Ve(r)].label),m=a.id==="odoo"?te.map(r=>r.label):[];return{cat:a.cat,label:a.label,desc:a.desc,link:a.link,lines:[{title:"Moons",items:m},{title:"Built with",items:l}].filter(r=>r.items.length>0)}}if(e.type==="moon"){const a=te[e.i];return{cat:"erp",label:a.label,desc:a.desc,lines:[{title:"Orbits",items:["Odoo ERP"]}]}}const t=pe[e.i];return{cat:"stack",label:t.label,desc:t.desc,lines:[{title:"Used in",items:H.filter(a=>a.uses.includes(t.id)).map(a=>a.label)}].filter(a=>a.items.length>0)}}function Yt(e,t=128){const a=document.createElement("canvas");a.width=a.height=t,e(a.getContext("2d"),t);const l=new io(a);return l.colorSpace=lo,l}const ue=e=>1-Math.pow(1-Math.min(Math.max(e,0),1),3),Na=({mode:e="home"})=>{const t=c.useRef(e);t.current=e;const{camera:a,size:l}=de(),[m,r]=c.useState(-1),w=c.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]),v=c.useRef(new z(0,20,ye)),o=c.useRef(new z(0,28,ye+55)),d=c.useRef(w?1:0),h=c.useMemo(()=>H.map(()=>({highlight:{current:0},dim:{current:1}})),[]),S=c.useMemo(()=>te.map(()=>({highlight:{current:0},dim:{current:1}})),[]),n=c.useRef(null),p=c.useRef([]),u=c.useRef([]),f=c.useRef([]),s=c.useRef([]),i=c.useRef([]),x=c.useRef([]),b=c.useRef(-1),_=c.useRef(0),P=c.useRef(1),W=c.useRef(-1),O=c.useRef(0),T=c.useRef(0),I=c.useRef(0),E=c.useRef(-2),C=c.useRef({x:0,y:0,active:!1}),j=c.useRef(H.map(()=>new z)),N=c.useRef(te.map(()=>new z)),L=c.useRef(pe.map(()=>new z)),V=c.useMemo(()=>new Uo,[]),q=c.useMemo(()=>new Ee,[]);c.useEffect(()=>(H.forEach((y,M)=>lt.set(y.id,{pos:j.current[M],radius:y.radius,ringed:y.kind==="saturn"})),()=>H.forEach(y=>lt.delete(y.id))),[]);const Z=c.useMemo(()=>Yt((y,M)=>{const R=y.createRadialGradient(M/2,M/2,0,M/2,M/2,M/2);R.addColorStop(0,"rgba(255,255,255,1)"),R.addColorStop(.18,"rgba(255,255,255,0.55)"),R.addColorStop(.45,"rgba(255,255,255,0.12)"),R.addColorStop(1,"rgba(255,255,255,0)"),y.fillStyle=R,y.fillRect(0,0,M,M)}),[]),Me=c.useMemo(()=>Yt((y,M)=>{const R=M/2;for(const[A,B]of[[M,3],[3,M]]){const U=y.createRadialGradient(R,R,0,R,R,R);U.addColorStop(0,"rgba(255,255,255,0.9)"),U.addColorStop(1,"rgba(255,255,255,0)"),y.fillStyle=U,y.fillRect(R-A/2,R-B/2,A,B)}},256),[]),he=c.useMemo(()=>H.map(()=>{const y=new we,M=new Y(new Float32Array(rt*3),3);M.setUsage($o),y.setAttribute("position",M);const R=new _t({color:"#c7d2fe",transparent:!0,opacity:0,depthWrite:!1}),A=new Yo(y,R);return A.frustumCulled=!1,A}),[]),me=c.useMemo(()=>{const y=new we;y.setAttribute("position",new Y(new Float32Array(Wt.length*6),3));const M=new _t({color:"#c7d2fe",transparent:!0,opacity:0,depthWrite:!1}),R=new Ko(y,M);return R.frustumCulled=!1,R},[]),je=8,ce=c.useMemo(()=>{const y=new Fo;y.setPositions(new Float32Array(je*6));const M=new Eo({color:14739455,linewidth:1.6,transparent:!0,opacity:.85,depthWrite:!1}),R=new Lo(y,M);return R.frustumCulled=!1,R},[]);c.useEffect(()=>{ce.material.resolution.set(l.width,l.height)},[ce,l]),c.useEffect(()=>()=>{Z.dispose(),Me.dispose(),he.forEach(y=>{y.geometry.dispose(),y.material.dispose()}),me.geometry.dispose(),me.material.dispose(),ce.geometry.dispose(),ce.material.dispose()},[Z,Me,he,me,ce]);const ht=(y,M)=>{q.set(y/window.innerWidth*2-1,-(M/window.innerHeight)*2+1),V.setFromCamera(q,a);const R=i.current.filter(Boolean),A=V.intersectObjects(R,!1)[0];return A?A.object.userData.pick:-1};c.useEffect(()=>{const y=A=>{const B=A.target;C.current.active=!(B!=null&&B.closest($t)),C.current.x=A.clientX,C.current.y=A.clientY,T.current=performance.now()},M=()=>{C.current.active=!1},R=A=>{var J;if((J=A.target)!=null&&J.closest($t))return;const B=ht(A.clientX,A.clientY);if(B<0)return;T.current=performance.now();const U=st(re[B]).link;U?window.open(U,"_blank","noopener,noreferrer"):(O.current=performance.now()+3500,W.current=B,r(B))};return window.addEventListener("pointermove",y),document.documentElement.addEventListener("pointerleave",M),window.addEventListener("click",R),()=>{window.removeEventListener("pointermove",y),document.documentElement.removeEventListener("pointerleave",M),window.removeEventListener("click",R),document.body.style.cursor="",it.current=!1}},[]);const xt=c.useMemo(()=>re.map(y=>{if(y.type==="sun")return H.map((R,A)=>Ae(A));if(y.type==="planet"){const R=H[y.i],A=R.uses.map(U=>1+H.length+te.length+Ve(U)),B=R.id==="odoo"?te.map((U,J)=>1+H.length+J):[];return[...A,...B]}if(y.type==="moon")return[Ae(Vt),...te.map((R,A)=>1+H.length+A)];const M=pe[y.i].id;return H.flatMap((R,A)=>R.uses.includes(M)?[Ae(A)]:[])}),[]),xe=c.useMemo(()=>new z,[]),Ke=(y,M)=>{const R=re[y];return R.type==="sun"?M.copy(v.current):R.type==="planet"?M.copy(j.current[R.i]):R.type==="moon"?M.copy(N.current[R.i]):M.copy(L.current[R.i])};Ce(({clock:y},M)=>{var Rt;const R=y.getElapsedTime();b.current<0&&(b.current=R);const A=w?100:R-b.current,B=a,U=Math.tan(fe.degToRad(ja/2)),J=t.current==="home",Te=B.aspect<.85,gt=performance.now();if(gt>O.current){const k=J&&C.current.active?ht(C.current.x,C.current.y):-1;k!==W.current&&(W.current=k,r(k),document.body.style.cursor=k>=0&&st(re[k]).link?"pointer":"")}const ve=W.current;it.current=J&&ve>=0;let yt=-1;J&&ve<0&&!w&&A>5&&gt-T.current>5e3&&(yt=Ae(Math.floor((A-5)/3.6)%H.length));const G=ve>=0?ve:yt,Ze=ve>=0?.38:.72,Se=k=>G>=0&&(k===G||xt[G].includes(k)),ko=ve>=0?.1:J?1:.35;P.current+=(ko-P.current)*(1-Math.exp(-M*4)),w||(_.current+=M*P.current);const wt=(Gt-ye)*U,bt=wt*B.aspect;v.current.set(0,wt*(Te?.36:.4),ye),(Rt=n.current)==null||Rt.position.copy(v.current),o.current.set(v.current.x,v.current.y+8,ye+55),xo.copy(o.current),d.current=ue(A/1.6);const Oe=(k,F,D,$=.12)=>(D.current+=(F-D.current)*$,k);H.forEach((k,F)=>{const D=ue((A-.7-F*.2)/1.8),$=k.orbit*bt*(Te?1.08:.95)*D,K=$*(Te?.85:.36),oe=Math.min($*.45,28),X=.26*Math.pow(.26/k.orbit,1.5),ne=k.phase+_.current*X,le=j.current[F];le.set(v.current.x+$*Math.cos(ne),v.current.y-K*Math.sin(ne),ye+oe*Math.sin(ne));const Re=p.current[F];Re&&(Re.position.copy(le),Re.scale.setScalar(Math.max(D,.001)));const qe=Ae(F),At=G===qe,et=Se(qe);Oe(qe,At?ve>=0?.6:.25:et?.2:0,h[F].highlight),Oe(qe,G<0||et?1:Ze,h[F].dim);const zt=he[F].geometry.getAttribute("position");for(let De=0;De<rt;De++){const tt=De/rt*Math.PI*2;zt.setXYZ(De,v.current.x+$*Math.cos(tt),v.current.y-K*Math.sin(tt),ye+oe*Math.sin(tt))}zt.needsUpdate=!0;const Ct=he[F].material,Io=J?G<0?.16:At||re[G].type==="sun"?.55:et?.3:.06:.07;Ct.opacity+=(Io*D-Ct.opacity)*.12});const Xe=j.current[Vt],Qe=Math.min(1,Math.max(.45,bt/94));te.forEach((k,F)=>{const D=k.phase+_.current*k.speed,$=N.current[F],K=ue((A-2.2-F*.25)/1.2);$.set(Xe.x+Math.cos(D)*k.distance*Qe*K,Xe.y+Math.sin(D)*k.distance*Qe*.28*K,Xe.z+Math.sin(D)*k.distance*Qe*.7*K);const oe=u.current[F];oe&&(oe.position.copy($),oe.scale.setScalar(Math.max(K,.001)));const X=1+H.length+F;Oe(X,G===X?.6:Se(X)?.3:0,S[F].highlight),Oe(X,G<0||Se(X)?1:Ze,S[F].dim)});const Mt=(Gt-Ut)*U,_o=Mt*B.aspect;pe.forEach((k,F)=>{var le,Re;const D=Te?k.port:k.land,$=L.current[F];$.set(D[0]*_o*.94,D[1]*Mt*.94,Ut),(le=f.current[F])==null||le.position.copy($);const K=1+H.length+te.length+F,oe=ue((A-1.4-F*.12)/1),X=w?1:.85+.15*Math.sin(R*2.3+F*1.9),ne=G===K?1.6:Se(K)?1.35:G>=0?.75:1;(Re=s.current[F])==null||Re.scale.setScalar(2.4*X*ne*oe*(J?1:0)+.001)});const Je=me.geometry.getAttribute("position");Wt.forEach(([k,F],D)=>{const $=L.current[Ve(k)],K=L.current[Ve(F)];Je.setXYZ(D*2,$.x,$.y,$.z),Je.setXYZ(D*2+1,K.x,K.y,K.z)}),Je.needsUpdate=!0;const St=me.material;St.opacity+=((J?G>=0?.12:.22:0)*ue((A-1.8)/1.5)-St.opacity)*.1,G!==E.current&&(E.current=G,I.current=0),I.current=Math.min(1,I.current+M*2.2);const Po=ue(I.current),ge=ce.geometry.attributes.instanceStart.data;let ie=0;if(G>=0&&re[G].type!=="sun"){const k=Ke(G,new z);for(const F of xt[G]){if(ie>=je)break;re[F].type==="moon"&&re[G].type!=="moon"||(Ke(F,xe),xe.lerp(k,1-Po),ge.array[ie*6]=k.x,ge.array[ie*6+1]=k.y,ge.array[ie*6+2]=k.z,ge.array[ie*6+3]=xe.x,ge.array[ie*6+4]=xe.y,ge.array[ie*6+5]=xe.z,ie++)}}ge.needsUpdate=!0,ce.geometry.instanceCount=ie,ce.material.opacity=ve>=0?.9:.5,re.forEach((k,F)=>{const D=x.current[F];if(!D)return;const $=k.type==="planet"?ue((A-1.2-k.i*.2)/1.2):k.type==="star"?ue((A-1.6-k.i*.12)/1):k.type==="sun"?ue((A-.8)/1):1,K=G<0||Se(F)?1:Ze*.7;D.style.opacity=String($*K);const oe=!J||k.type==="moon"&&G!==F||Te&&k.type==="star"&&G!==F&&!Se(F);if(D.style.visibility=oe?"hidden":"visible",oe)return;Ke(F,xe).project(B);const X=(xe.x+1)/2*l.width,ne=D.offsetWidth/2;let le=0;X-ne<8?le=8-(X-ne):X+ne>l.width-8&&(le=l.width-8-(X+ne)),D.style.transform=`translate(${Math.round(le)}px, ${D.dataset.offset}px)`})});const To="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/55 px-2.5 py-0.5 text-[10px] md:text-xs font-medium text-white backdrop-blur-md",Ne=y=>M=>{i.current[y]=M,M&&(M.userData.pick=y)},Be=(y,M,R="center")=>{const A=st(re[y]),B=R==="right"?"right-0":R==="left"?"left-0":"left-1/2 -translate-x-1/2";return g.jsx(jo,{center:!0,zIndexRange:m===y?[30,30]:[0,0],style:{pointerEvents:"none"},children:g.jsxs("div",{ref:U=>x.current[y]=U,className:"relative select-none","data-offset":M,style:{transform:`translateY(${M}px)`,opacity:0},children:[g.jsxs("div",{className:To,children:[g.jsx("span",{className:"mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle",style:{background:Ht[A.cat]}}),A.label,A.link?" ↗":""]}),m===y&&g.jsxs("div",{className:`absolute top-full mt-2 w-60 rounded-2xl border border-white/15 bg-slate-950/75 p-3.5 text-left text-xs leading-snug text-white/90 shadow-2xl backdrop-blur-xl ${B}`,children:[g.jsxs("div",{className:"mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60",children:[g.jsx("span",{className:"h-1.5 w-1.5 rounded-full",style:{background:Ht[A.cat]}}),Ea[A.cat]]}),g.jsx("div",{className:"text-sm font-semibold text-white",children:A.label}),g.jsx("p",{className:"mt-1",children:A.desc}),A.lines.map(U=>g.jsxs("p",{className:"mt-2 text-[11px] text-white/60",children:[g.jsxs("span",{className:"font-semibold text-white/75",children:[U.title,":"]})," ",U.items.join(" · ")]},U.title)),A.link&&g.jsxs("span",{className:"mt-2 block font-semibold text-white",children:["Visit ",La(A.link)," ↗"]})]})]})})};return g.jsxs("group",{children:[g.jsxs("group",{ref:n,children:[g.jsx(Fa,{radius:5.8,intensityRef:d}),g.jsxs("mesh",{ref:Ne(0),children:[g.jsx("sphereGeometry",{args:[7.5,12,12]}),g.jsx("meshBasicMaterial",{visible:!1})]}),Be(0,64)]}),he.map((y,M)=>g.jsx("primitive",{object:y},`orbit-${M}`)),H.map((y,M)=>{const R=Ae(M);return g.jsxs("group",{ref:A=>p.current[M]=A,children:[g.jsx(Nt,{kind:y.kind,radius:y.radius,sunRef:o,highlightRef:h[M].highlight,dimRef:h[M].dim,seed:M*7.3+1,tilt:y.tilt}),g.jsxs("mesh",{ref:Ne(R),children:[g.jsx("sphereGeometry",{args:[Math.max(y.radius*(y.kind==="saturn"?2:1.6),3),12,12]}),g.jsx("meshBasicMaterial",{visible:!1})]}),Be(R,Math.round(y.radius*7+14))]},y.id)}),te.map((y,M)=>{const R=1+H.length+M;return g.jsxs("group",{ref:A=>u.current[M]=A,children:[g.jsx(Nt,{kind:"moon",radius:y.radius,sunRef:o,highlightRef:S[M].highlight,dimRef:S[M].dim,seed:40+M*3.1}),g.jsxs("mesh",{ref:Ne(R),children:[g.jsx("sphereGeometry",{args:[Math.max(y.radius*2.5,1.8),10,10]}),g.jsx("meshBasicMaterial",{visible:!1})]}),Be(R,Math.round(y.radius*7+12))]},y.id)}),g.jsx("primitive",{object:me}),g.jsx("primitive",{object:ce}),pe.map((y,M)=>{const R=1+H.length+te.length+M,A=y.land[0]>0;return g.jsxs("group",{ref:B=>f.current[M]=B,children:[g.jsx("sprite",{ref:B=>s.current[M]=B,children:g.jsx("spriteMaterial",{map:Z,color:"#e0e7ff",transparent:!0,depthWrite:!1,blending:se})}),g.jsx("sprite",{scale:9,children:g.jsx("spriteMaterial",{map:Me,color:"#c7d2fe",transparent:!0,opacity:.55,depthWrite:!1,blending:se})}),g.jsxs("mesh",{ref:Ne(R),children:[g.jsx("sphereGeometry",{args:[2.6,10,10]}),g.jsx("meshBasicMaterial",{visible:!1})]}),Be(R,22,A?"right":"left")]},y.id)})]})},Ba=180,Oa=.86,Kt={color:"#ffffff",anchorX:"center",anchorY:"middle",fontWeight:"bold",outlineWidth:"6%",outlineBlur:"28%",outlineColor:"#1b2433",outlineOpacity:.55,renderOrder:1,"material-toneMapped":!1},qa=({position:e=[0,10,-120]})=>{const t=de(w=>w.camera),a=de(w=>w.size.width/w.size.height),m=2*(t.position.z-e[2])*Math.tan(fe.degToRad(t.fov/2))*a,r=Math.min(1,m*Oa/Ba);return g.jsxs("group",{position:e,scale:r,children:[g.jsx(Tt,{position:[0,5,0],fontSize:18,...Kt,children:"Fullstack Developer"}),g.jsx(Tt,{position:[0,-12,0],fontSize:12,...Kt,children:"Polizzotto Emanuele"})]})},Da=3e3,Ha=150,Zt=2600,Wa=[5,0,1,2,3,4],Pe=560,Va=10,Le=new z(0,15,-85).normalize(),go=new z(1,0,0),Ga=new z().crossVectors(go,Le).normalize();function be(e,t,a=new z){return a.copy(Le).addScaledVector(go,e).addScaledVector(Ga,t).normalize()}const yo=be(-1.25,-.7),Ua=be(.3,.95),ze=new z().crossVectors(yo,Ua).normalize(),wo=yo.clone(),$a=new z().crossVectors(ze,wo).normalize(),$e=be(-1.9,-1.15);$e.addScaledVector(ze,-$e.dot(ze)).normalize();const Ya=be(1.05,.5),Ka=be(.95,-.78),Za=be(-.95,-.85);function pt(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let a=t;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}function Xa(e){let t=0;for(;t===0;)t=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*e())}function bo(e,t){const a=e()*2-1,l=e()*Math.PI*2,m=Math.sqrt(1-a*a);return t.set(m*Math.cos(l),m*Math.sin(l),a)}const Xt=[{c:[.62,.71,1],w:.06},{c:[.74,.81,1],w:.14},{c:[.87,.9,1],w:.22},{c:[1,.98,.96],w:.22},{c:[1,.93,.83],w:.17},{c:[1,.83,.64],w:.12},{c:[1,.7,.47],w:.07}];function ut(e){let t=e();for(const a of Xt){if(t<a.w)return a.c;t-=a.w}return Xt[3].c}const Qa=`
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
`,Ja=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,en=`
uniform vec3 uBandN;
uniform vec3 uBulge;
uniform vec3 uArtA;
uniform vec3 uArtB;
uniform vec3 uArtC;
varying vec3 vPos;
${Qa}
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
`,tn=`
varying vec3 vDir;
varying vec3 vView;
void main() {
  vDir = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`,on=`
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
`,an=`
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
`,nn=`
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
`,rn=`
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
`,sn=`
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
`,cn=`
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
`,ln=`
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
`,un=`
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
`,dn=`
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
`;function Qt(e){const t=pt(e.seed),a=new Float32Array(e.count*3),l=new Float32Array(e.count*3),m=new Float32Array(e.count),r=new Float32Array(e.count*4),w=new z;for(let o=0;o<e.count;o++){const d=t()<e.bandFrac;let h=e.ext*.5;if(d){let i=0;for(let W=0;W<6;W++){i=t()*Math.PI*2;const O=.55+.25*Math.sin(i*3+1.3)+.2*Math.sin(i*7+4.1);if(t()<O)break}const x=Math.cos(i),b=Math.sin(i);w.set(0,0,0).addScaledVector(wo,x).addScaledVector($a,b);const _=Math.exp((w.dot($e)-1)/.18),P=Xa(t)*e.bandSigma*(1+1.2*_);w.multiplyScalar(Math.cos(P)).addScaledVector(ze,Math.sin(P)).normalize(),h=e.ext}else bo(t,w);const S=e.rMin*Math.pow(e.rMax/e.rMin,t());h*=Math.min(1,Math.max(0,(S-300)/600)),a[o*3]=w.x*S,a[o*3+1]=w.y*S,a[o*3+2]=w.z*S;const n=Math.pow(t(),e.brightPow),p=350/S;m[o]=(e.sizeMin+(e.sizeMax-e.sizeMin)*n)*Math.min(1.2,Math.max(.85,Math.pow(p,.15)));const u=(e.iMin+(e.iMax-e.iMin)*n)*Math.min(1.3,Math.max(.6,Math.pow(p,.3))),f=ut(t),s=.75+.25*n;l[o*3]=(1+(f[0]-1)*s)*u,l[o*3+1]=(1+(f[1]-1)*s)*u,l[o*3+2]=(1+(f[2]-1)*s)*u,r[o*4]=t()*Math.PI*2,r[o*4+1]=.5+t()*1.8,r[o*4+2]=t()<e.twinkleFrac?.12+t()*.28:.03,r[o*4+3]=h}const v=new we;return v.setAttribute("position",new Y(a,3)),v.setAttribute("aColor",new Y(l,3)),v.setAttribute("aSize",new Y(m,1)),v.setAttribute("aTw",new Y(r,4)),v}function fn(e){const t=pt(e),a=[],l=[[-.9,.55,64,1],[.64,.62,48,.85],[.98,-.3,58,.95],[-.62,-.58,44,.8],[.2,-.66,30,.6],[-1.02,-.12,34,.7],[1.02,.42,30,.6],[-.3,.7,28,.55],[.42,.34,22,.45],[-.5,.3,22,.45]];for(const[p,u,f,s]of l)a.push({d:be(p,u),r:260+t()*1100,size:f,c:ut(t),i:s});for(let p=0;p<14;p++){const u=bo(t,new z);if(u.dot(Le)>.45){p--;continue}a.push({d:u,r:300+t()*1500,size:20+t()*26,c:ut(t),i:.5+t()*.4})}const m=a.length,r=new Float32Array(m*12),w=new Float32Array(m*8),v=new Float32Array(m*4),o=new Float32Array(m*12),d=new Float32Array(m*4),h=[],S=[-1,-1,1,-1,-1,1,1,1];a.forEach((p,u)=>{const f=p.r,s=t()*100;for(let x=0;x<4;x++){const b=u*4+x;r[b*3]=p.d.x*f,r[b*3+1]=p.d.y*f,r[b*3+2]=p.d.z*f,w[b*2]=S[x*2],w[b*2+1]=S[x*2+1],v[b]=p.size,o[b*3]=p.c[0]*p.i,o[b*3+1]=p.c[1]*p.i,o[b*3+2]=p.c[2]*p.i,d[b]=s}const i=u*4;h.push(i,i+1,i+2,i+2,i+1,i+3)});const n=new we;return n.setAttribute("position",new Y(r,3)),n.setAttribute("aCorner",new Y(w,2)),n.setAttribute("aSize",new Y(v,1)),n.setAttribute("aColor",new Y(o,3)),n.setAttribute("aPhase",new Y(d,1)),n.setIndex(h),n}function mn(e){const t=pt(e),a=new Float32Array(Pe*3),l=new Float32Array(Pe*3),m=new Float32Array(Pe*3),r=new Float32Array(Pe*4),w=Le.y/-Le.z;for(let o=0;o<Pe;o++){const d=3+67*Math.pow(t(),1.15);a[o*3]=(t()*2-1)*(d*1.25+9),a[o*3+1]=d*w+(t()*2-1)*(d*.9+7),a[o*3+2]=Va-d,l[o*3]=t(),l[o*3+1]=t(),l[o*3+2]=t(),m[o*3]=.16+(t()*2-1)*.1,m[o*3+1]=.05+(t()*2-1)*.08,m[o*3+2]=(t()*2-1)*.05,r[o*4]=.05+Math.pow(t(),2.5)*.17,r[o*4+1]=.15+Math.pow(t(),2)*.45,r[o*4+2]=t()<.3?.5+t()*.5:t()*.3,r[o*4+3]=3+d*.35}const v=new we;return v.setAttribute("position",new Y(a,3)),v.setAttribute("aPhase",new Y(l,3)),v.setAttribute("aVel",new Y(m,3)),v.setAttribute("aDust",new Y(r,4)),v}function vn(){const e=new we;return e.setAttribute("position",new Y(new Float32Array(12),3)),e.setAttribute("aQuad",new Y(new Float32Array([0,-1,0,1,1,-1,1,1]),2)),e.setIndex([0,2,1,1,2,3]),e}const pn=131848,hn=({reducedMotion:e=!1})=>{const t=de(n=>n.gl),a=de(n=>n.scene),l=de(n=>n.size),m=de(n=>n.viewport.dpr),r=de(n=>n.get),w=c.useRef(null),v=c.useRef(null),o=c.useMemo(()=>({active:!1,timer:2.5+Math.random()*3,t:0,dur:1,len:100,start:new z,vel:new z,right:new z,up:new z,fwd:new z,tmp:new z}),[]),d=c.useMemo(()=>({uTime:{value:0},uTwinkle:{value:e?0:1},uDpr:{value:1},uRes:{value:new Ee(1,1)},uNeb:{value:null},uFade:{value:0},uDrift:{value:e?0:1},uScale:{value:500}}),[]),h=c.useMemo(()=>{const n=new Ge(Da,48,24),p=new Q({vertexShader:tn,fragmentShader:on,uniforms:{uNeb:d.uNeb,uFade:d.uFade},side:Pt,depthWrite:!1,depthTest:!1,toneMapped:!1}),u=new Q({vertexShader:an,fragmentShader:nn,uniforms:{uTime:d.uTime,uTwinkle:d.uTwinkle,uDpr:d.uDpr,uFade:d.uFade,uNeb:d.uNeb},transparent:!0,depthWrite:!1,blending:se,toneMapped:!1}),f=Qt({count:9500,rMin:Ha,rMax:Zt,seed:11,bandFrac:.15,bandSigma:.1,sizeMin:.6,sizeMax:1.7,iMin:.14,iMax:.95,brightPow:3.2,ext:.9,twinkleFrac:.3}),s=Qt({count:8e3,rMin:450,rMax:Zt,seed:23,bandFrac:1,bandSigma:.065,sizeMin:.5,sizeMax:1.1,iMin:.1,iMax:.55,brightPow:3.5,ext:1,twinkleFrac:.1}),i=fn(77),x=new Q({vertexShader:rn,fragmentShader:sn,uniforms:{uTime:d.uTime,uTwinkle:d.uTwinkle,uRes:d.uRes},transparent:!0,depthWrite:!1,blending:se,toneMapped:!1}),b=mn(91),_=new Q({vertexShader:un,fragmentShader:dn,uniforms:{uTime:d.uTime,uDrift:d.uDrift,uDpr:d.uDpr,uScale:d.uScale},transparent:!0,depthWrite:!1,blending:se,toneMapped:!1}),P=vn(),W=new Q({vertexShader:cn,fragmentShader:ln,uniforms:{uHead:{value:new z},uTail:{value:new z},uRes:d.uRes,uAlpha:{value:0}},transparent:!0,depthWrite:!1,blending:se,toneMapped:!1});return{skyGeo:n,skyMat:p,starMat:u,field:f,band:s,brightGeo:i,brightMat:x,dustGeo:b,dustMat:_,meteorGeo:P,meteorMat:W}},[d]),S=c.useRef(null);return c.useLayoutEffect(()=>{const n=r(),p=Math.max(n.size.height,n.size.width*.6)*n.viewport.dpr,u=Math.min(n.size.width,n.size.height)<600,f=Math.ceil(p*1.3/256)*256,s=Math.min(Math.max(f,768),u?1024:1536,t.capabilities.maxCubemapSize),i=new uo(s,{type:Zo,generateMipmaps:!1,minFilter:Ue,magFilter:Ue}),x=new co,b=new Ge(1,32,16),_=new Q({vertexShader:Ja,fragmentShader:en,uniforms:{uBandN:{value:ze},uBulge:{value:$e},uArtA:{value:Ya},uArtB:{value:Ka},uArtC:{value:Za}},side:Pt,depthTest:!1,depthWrite:!1,blending:Xo,toneMapped:!1});x.add(new so(b,_));const P=new Qo(.1,10,i);return P.coordinateSystem=t.coordinateSystem,P.updateCoordinateSystem(),P.updateMatrixWorld(!0),S.current={rt:i,scene:x,cam:P,geo:b,mat:_,face:0},d.uFade.value=0,()=>{b.dispose(),_.dispose(),i.dispose(),d.uNeb.value=null,d.uFade.value=0,S.current=null}},[t,d,r]),c.useEffect(()=>{d.uDpr.value=m,d.uRes.value.set(l.width,l.height)},[m,l,d]),c.useLayoutEffect(()=>{d.uTwinkle.value=e?0:1,d.uDrift.value=e?0:1,v.current&&(e||!o.active)&&(v.current.visible=!1)},[e,d,o]),c.useEffect(()=>{if(a.background)return;const n=new Jo(pn);return a.background=n,()=>{a.background===n&&(a.background=null)}},[a]),c.useEffect(()=>()=>{h.skyGeo.dispose(),h.skyMat.dispose(),h.starMat.dispose(),h.field.dispose(),h.band.dispose(),h.dustGeo.dispose(),h.dustMat.dispose(),h.brightGeo.dispose(),h.brightMat.dispose(),h.meteorGeo.dispose(),h.meteorMat.dispose()},[h]),Ce((n,p)=>{const u=Math.min(p,.1),f=n.clock.elapsedTime,s=S.current;if(s&&s.face<6){const I=Wa[s.face],E=t.getRenderTarget(),C=t.xr.enabled;t.xr.enabled=!1,t.setRenderTarget(s.rt,I),t.render(s.scene,s.cam.children[I]),t.setRenderTarget(E),t.xr.enabled=C,s.face++,s.face===6&&(d.uNeb.value=s.rt.texture,s.geo.dispose(),s.mat.dispose())}else s&&d.uFade.value<1&&(d.uFade.value=e?1:Math.min(1,d.uFade.value+u/1.6));const i=n.camera;i.isPerspectiveCamera&&(d.uScale.value=.5*n.size.height/Math.tan(i.fov*(Math.PI/360))),e||(d.uTime.value=f,w.current&&w.current.quaternion.setFromAxisAngle(ze,.03*Math.sin(f*.026)));const x=v.current;if(!x)return;if(e){x.visible=!1;return}const b=h.meteorMat.uniforms;if(!o.active){if(o.timer-=u,o.timer>0)return;const I=n.camera;o.right.setFromMatrixColumn(I.matrixWorld,0),o.up.setFromMatrixColumn(I.matrixWorld,1),o.fwd.setFromMatrixColumn(I.matrixWorld,2).negate();const E=l.width/Math.max(l.height,1),C=420,j=(Math.random()*2-1)*.7*E*.77,N=.3+Math.random()*.42;o.tmp.copy(o.fwd).addScaledVector(o.right,j).addScaledVector(o.up,N).normalize(),o.start.copy(I.position).addScaledVector(o.tmp,C);const L=.25+Math.random()*.5,V=j>0?-1:1,q=C*(.55+Math.random()*.35);o.vel.set(0,0,0).addScaledVector(o.right,Math.cos(L)*V*q).addScaledVector(o.up,-Math.sin(L)*q),o.dur=.55+Math.random()*.45,o.len=C*(.16+Math.random()*.1),o.t=0,o.active=!0,x.visible=!0}o.t+=u;const _=o.t/o.dur;if(_>=1){o.active=!1,o.timer=5+Math.random()*5,x.visible=!1,b.uAlpha.value=0;return}const P=b.uHead.value,W=b.uTail.value;P.copy(o.start).addScaledVector(o.vel,o.t);const O=o.vel.length(),T=Math.min(o.len,O*o.t);W.copy(o.vel).multiplyScalar(-T/O).add(P),b.uAlpha.value=fe.smoothstep(_,0,.12)*(1-fe.smoothstep(_,.55,1))}),g.jsxs("group",{children:[g.jsxs("group",{ref:w,children:[g.jsx("mesh",{geometry:h.skyGeo,material:h.skyMat,renderOrder:-1e3,frustumCulled:!1}),g.jsx("points",{geometry:h.band,material:h.starMat,renderOrder:-990,frustumCulled:!1}),g.jsx("points",{geometry:h.field,material:h.starMat,renderOrder:-989,frustumCulled:!1}),g.jsx("mesh",{geometry:h.brightGeo,material:h.brightMat,renderOrder:-987,frustumCulled:!1})]}),g.jsx("points",{geometry:h.dustGeo,material:h.dustMat,renderOrder:-985,frustumCulled:!1}),g.jsx("mesh",{ref:v,geometry:h.meteorGeo,material:h.meteorMat,renderOrder:-986,frustumCulled:!1})]})},Ie=850,Mo=.4,So=72,Ro=40,Ao=1.35,zo=Mo-Ro*Ao,Co=So-zo,Jt=Co*10,xn=`
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

const float Z_NEAR = ${Mo.toFixed(3)};
const float Z_FAR = ${So.toFixed(3)};
const float Z_MIN = ${zo.toFixed(3)};
const float RANGE = ${Co.toFixed(3)};
const float L_VAR = ${Ao.toFixed(3)};

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
`,gn=`
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
`,yn=`
varying vec2 vP;
void main() {
  vP = position.xy;
  // at the far end of the depth range: it lights up empty space, never a planet
  gl_Position = vec4(position.xy, 0.99999, 1.0);
}
`,wn=`
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
`;function bn(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let a=t;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}const eo=()=>{},Mn=({intensityRef:e})=>{const t=c.useRef(null),a=c.useRef({travel:0,time:0}),{streakGeo:l,streakMat:m,tunnelGeo:r,tunnelMat:w}=c.useMemo(()=>{const v=bn(6221122),o=new ea;o.setAttribute("position",new It([0,-1,0,1,-1,0,0,1,0,1,1,0],3)),o.setIndex([0,1,2,2,1,3]);const d=new Float32Array(Ie*4),h=new Float32Array(Ie*4);for(let u=0;u<Ie;u++){d[u*4]=v()*Math.PI*2,d[u*4+1]=4.2+24*Math.pow(v(),1.35),d[u*4+2]=v(),d[u*4+3]=.8+.1*Math.floor(v()*5);const f=v();let s,i,x;f<.5?[s,i,x]=[.78,.88,1]:f<.7?[s,i,x]=[.96,.97,1]:f<.92?[s,i,x]=[.42,.66,1]:[s,i,x]=[1,.76,.5];const b=.55+.6*Math.pow(v(),1.6);h[u*4]=s*b,h[u*4+1]=i*b,h[u*4+2]=x*b,h[u*4+3]=.6+.8*Math.pow(v(),2)}o.setAttribute("aSeed",new Ft(d,4)),o.setAttribute("aColor",new Ft(h,4)),o.instanceCount=Ie;const S=new Q({vertexShader:xn,fragmentShader:gn,uniforms:{uTravel:{value:0},uI:{value:0},uLen:{value:1},uRes:{value:new Ee(1,1)},uDpr:{value:1}},transparent:!0,depthTest:!0,depthWrite:!1,blending:se,toneMapped:!1}),n=new we;n.setAttribute("position",new It([-1,-1,0,3,-1,0,-1,3,0],3));const p=new Q({vertexShader:yn,fragmentShader:wn,uniforms:{uI:{value:0},uTravel:{value:0},uTime:{value:0},uAspect:{value:1},uCenter:{value:new Ee(0,0)}},transparent:!0,depthTest:!0,depthWrite:!1,blending:na,blendEquation:aa,blendSrc:Et,blendDst:oa,blendSrcAlpha:ta,blendDstAlpha:Et,toneMapped:!1});return{streakGeo:o,streakMat:S,tunnelGeo:n,tunnelMat:p}},[]);return c.useEffect(()=>()=>{l.dispose(),m.dispose(),r.dispose(),w.dispose()},[l,m,r,w]),Ce((v,o)=>{const d=t.current;if(!d)return;const h=e.current,S=h>0?h<1?h:1:0;if(S<.002){d.visible&&(d.visible=!1);return}d.visible=!0;const n=a.current,p=o<.05?o:.05;n.travel+=p*(3+120*S*S),n.travel>Jt&&(n.travel-=Jt),n.time+=p;const u=v.viewport.dpr,f=v.size.width*u,s=v.size.height*u,i=m.uniforms;i.uTravel.value=n.travel,i.uI.value=S,i.uLen.value=.25+(Ro-.25)*Math.pow(S,2.1),i.uRes.value.set(f,s),i.uDpr.value=u;const x=w.uniforms;x.uI.value=S,x.uTravel.value=n.travel,x.uTime.value=n.time,x.uAspect.value=f/s;const b=Math.round(Ie*Math.min(1,Math.max(.62,.45+.4*(f/s))));l.instanceCount!==b&&(l.instanceCount=b);const _=v.camera.projectionMatrix.elements;x.uCenter.value.set(-_[8],-_[9])}),g.jsxs("group",{ref:t,visible:!1,children:[g.jsx("mesh",{geometry:r,material:w,frustumCulled:!1,renderOrder:9998,raycast:eo}),g.jsx("mesh",{geometry:l,material:m,frustumCulled:!1,renderOrder:9999,raycast:eo})]})},to=new z(0,0,-75),Sn=new z(58,46,2),Rn=new z(0,12,-75),An=new z(-34,30,18),oo=new z(-.78,.22,-1).normalize(),dt=75,zn=e=>e==="/"?"home":e==="/scroll"?"projects":"about";function Cn({mode:e}){const t=c.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]),a=c.useRef({x:0,y:0}),l=c.useRef(to.clone()),m=c.useMemo(()=>new z,[]),r=c.useMemo(()=>new z,[]),w=c.useMemo(()=>new z(0,0,10),[]),v=c.useMemo(()=>new z,[]),o=c.useMemo(()=>new z,[]),d=c.useMemo(()=>new z,[]),h=c.useMemo(()=>new z,[]),S=c.useMemo(()=>new z(0,1,0),[]),n=c.useMemo(()=>new z,[]),p=c.useMemo(()=>new z,[]),u=c.useRef({x:0,y:0,active:!1});return c.useEffect(()=>{const f=s=>{a.current.x=s.clientX/window.innerWidth*2-1,a.current.y=-(s.clientY/window.innerHeight)*2+1};return window.addEventListener("pointermove",f),()=>window.removeEventListener("pointermove",f)},[]),Ce(({camera:f,clock:s,size:i},x)=>{const b=f,_=s.getElapsedTime(),P=t?0:1,W=a.current.x*P,O=a.current.y*P,T=b.aspect<.85;if(e==="home")it.current?m.copy(b.position):m.set(W*4+Math.sin(_*.07)*2*P,O*2.5+Math.sin(_*.05+1)*1.2*P,10),r.copy(to);else if(e==="about"){const V=Math.max(1,document.documentElement.scrollHeight-window.innerHeight),q=Math.min(1,Math.max(0,window.scrollY/V));m.copy(An).addScaledVector(oo,q*150),m.x+=W*3,m.y+=O*2,r.copy(m).addScaledVector(oo,100)}else{const V=Lt.current?lt.get(Lt.current):void 0;if(V){const q=V.radius*(V.ringed?2.3:1),Z=V.pos;n.copy(xo).sub(Z).normalize(),p.crossVectors(S,n).normalize(),v.copy(n).multiplyScalar(.64).addScaledVector(p,.77).normalize(),d.crossVectors(S,v).normalize(),d.dot(n)<0&&v.copy(n).multiplyScalar(.64).addScaledVector(p,-.77).normalize(),v.y+=.12,v.normalize();const Me=Math.tan(fe.degToRad(dt/2)),he=T?.34:.42,me=T?.7:.3,je=Math.max(2*q/(he*2*Me),2*q/(me*2*Me*b.aspect));m.copy(Z).addScaledVector(v,je),r.copy(Z),o.copy(Z).sub(m).normalize(),d.crossVectors(o,S).normalize(),h.crossVectors(d,o).normalize(),m.addScaledVector(d,W*q*.25).addScaledVector(h,O*q*.2)}else m.copy(Sn),m.x+=W*3,m.y+=O*2,r.copy(Rn)}const I=e==="projects"?T?{x:0,y:.3}:{x:.26,y:0}:{x:0,y:0},E=t?1:1-Math.exp(-x*2);u.current.x+=(I.x-u.current.x)*E,u.current.y+=(I.y-u.current.y)*E;const C=t?1:1-Math.exp(-x*1.5);b.position.lerp(m,C),l.current.lerp(r,t?1:1-Math.exp(-x*2.2)),b.lookAt(l.current);const j=x>0?b.position.distanceTo(w)/x:0;w.copy(b.position);const N=t?0:fe.clamp((j-18)/110,0,1);Fe.current+=(N-Fe.current)*(1-Math.exp(-x*(N>Fe.current?6:2.5))),b.fov=dt+Fe.current*14;const L=u.current;Math.abs(L.x)+Math.abs(L.y)>5e-4?(b.setViewOffset(i.width,i.height,L.x*i.width,L.y*i.height,i.width,i.height),L.active=!0):L.active?(b.clearViewOffset(),L.active=!1):b.updateProjectionMatrix()}),null}const Fn=({route:e})=>{const t=zn(e),a=c.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]);return g.jsxs(No,{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:-1,background:"#02030a"},dpr:[1,1.5],camera:{position:[0,0,10],fov:dt,far:5e3},children:[g.jsx(Cn,{mode:t}),g.jsx(hn,{reducedMotion:a}),g.jsx(Na,{mode:t}),t==="home"&&g.jsx(qa,{position:[0,-36,-120]}),g.jsx(Mn,{intensityRef:Fe})]})};export{Fn as default};
