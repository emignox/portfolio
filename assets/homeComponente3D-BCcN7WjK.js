import{r as l,u as ke,j as m,b as ue,L as uo,d as fo,e as mo,H as vo,T as bt,C as po}from"./r3f-B2G6OFXa.js";import{Q as xe,d as k,ao as De,m as ho,a2 as Wt,c as at,n as J,ap as Ee,am as de,D as xo,aq as go,a3 as Gt,ar as yo,a6 as wo,f as bo,as as Ht,u as Ie,a4 as Mt,at as Mo,M as Vt,S as Ut,O as So,au as Yt,ag as $t,al as Kt,R as Ro,av as Se,aw as U,ax as zo,ay as St,az as Ao,aA as Co,p as Rt,U as To,ah as ko,aB as _o,h as Po}from"./three-BQ5Hzf4R.js";import{p as Bo}from"./index-odWwlooN.js";const nt=`
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
`,rt=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,jo="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",No=`
uniform float uFace;
uniform float uSize;
uniform vec3 uSeed;
uniform float uSeedF;
uniform int uPass;
${nt}
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
`,Fo=`
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
`,qo=`
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
`,Lo=`
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
`,Eo=`
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
`,Io=`
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
`,Oo=`
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
`,Do=`
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
`,Wo=`
vec4 bakeAlbedo(vec3 d) {
  float n = fbm(vec3(d.x * 2.0, d.y * 14.0, d.z * 2.0) + uSeed, 4);
  float y = d.y + n * 0.02;
  vec3 col = mix(vec3(0.52, 0.78, 0.84), vec3(0.6, 0.83, 0.87), 0.5 + 0.5 * sin(y * 9.0));
  col *= 0.985 + 0.03 * n;
  col = mix(col, vec3(0.68, 0.88, 0.9), smoothstep(0.55, 0.9, -y) * 0.6);
  col = mix(col, vec3(0.64, 0.86, 0.89), smoothstep(0.65, 0.95, y) * 0.4);
  return vec4(col, 0.0);
}
`,Go=`
varying vec3 vObj;
varying vec3 vWorld;
void main() {
  vObj = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,Ho=`
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
  ${rt}
}
`,Vo=`
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,Uo=`
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
  ${rt}
}
`,Yo=`
varying vec3 vWorld;
varying vec2 vLocal;
void main() {
  vLocal = position.xy;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,$o=`
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
  ${rt}
}
`,Ko=`
uniform float uTime;
uniform float uBright;
uniform mat3 uViewToObj;
varying vec2 vUv;
${nt}
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
`,zt=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Qo=`
uniform float uTime;
uniform float uI;
uniform float uScale;
varying vec2 vUv;
${nt}
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
`,Qt={earth:{body:qo,bake:512,normal:!0,clouds:!0,gas:!1,ls:0,limb:0,sunI:1.45,tilt:.41,seed:3,ring:null,segments:64,atmo:{color:[.2,.45,1],twilight:[.45,.16,.06],scale:1.05,falloff:3.4,intensity:.5,haze:.2}},mars:{body:Lo,bake:512,normal:!0,clouds:!1,gas:!1,ls:.35,limb:0,sunI:1.4,tilt:.44,seed:5,ring:null,segments:64,atmo:{color:[1,.6,.4],twilight:[.7,.45,.4],scale:1.025,falloff:4,intensity:.4,haze:.18}},jupiter:{body:Io,bake:512,normal:!1,clouds:!1,gas:!0,ls:0,limb:.6,sunI:1.25,tilt:.05,seed:2,ring:null,segments:64,atmo:{color:[1,.86,.62],twilight:[.9,.55,.3],scale:1.025,falloff:4.5,intensity:.3,haze:.15}},saturn:{body:Oo,bake:512,normal:!1,clouds:!1,gas:!0,ls:0,limb:.55,sunI:1.25,tilt:.47,seed:4,ring:"saturn",segments:64,atmo:{color:[1,.88,.62],twilight:[.9,.6,.32],scale:1.025,falloff:4.5,intensity:.28,haze:.15}},uranus:{body:Wo,bake:256,normal:!1,clouds:!1,gas:!0,ls:0,limb:.6,sunI:1,tilt:1.71,seed:6,ring:"uranus",segments:64,atmo:{color:[.5,.9,1],twilight:[.4,.7,.9],scale:1.035,falloff:4,intensity:.45,haze:.25}},neptune:{body:Do,bake:256,normal:!1,clouds:!1,gas:!0,ls:0,limb:.55,sunI:1.3,tilt:.49,seed:7,ring:null,segments:64,atmo:{color:[.3,.62,1],twilight:[.3,.45,.9],scale:1.035,falloff:4,intensity:.5,haze:.25}},moon:{body:Eo,bake:256,normal:!0,clouds:!1,gas:!1,ls:.85,limb:0,sunI:1.5,tilt:.1,seed:1,ring:null,segments:48,atmo:null,rim:[.75,.8,.9]}},et=new WeakMap;function st(e){let t=Math.floor(Math.abs(e))*2654435761+12345>>>0||1;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}function Xo(e,t,a){const c=Qt[t],p=st(a*977+31),n={},x=new J({vertexShader:jo,fragmentShader:No+c.body+Fo,defines:n,uniforms:{uFace:{value:0},uSize:{value:c.bake},uSeed:{value:new k(p()*60-30,p()*60-30,p()*60-30)},uSeedF:{value:Math.abs(Math.floor(a))%1e3},uPass:{value:0}},depthTest:!1,depthWrite:!1}),S=new Gt(2,2),o=new Vt(S,x);o.frustumCulled=!1;const i=new Ut;i.add(o);const y=new So(-1,1,1,-1,0,1),R=e.getRenderTarget(),r=e.xr.enabled,v=e.autoClear;e.xr.enabled=!1,e.autoClear=!0;const f=s=>{const d=new Kt(c.bake,{generateMipmaps:!0,minFilter:Ht,magFilter:Ie,depthBuffer:!1,stencilBuffer:!1});x.uniforms.uPass.value=s;for(let b=0;b<6;b++)d.texture.generateMipmaps=b===5,x.uniforms.uFace.value=b,e.setRenderTarget(d,b),e.render(i,y);return d},u={albedo:f(0),normal:c.normal?f(1):null,clouds:c.clouds?f(2):null};return e.setRenderTarget(R),e.xr.enabled=r,e.autoClear=v,x.dispose(),S.dispose(),u}function Zo(e){var t,a,c;(t=et.get(e.gl))==null||t.delete(e.key),e.set.albedo.dispose(),(a=e.set.normal)==null||a.dispose(),(c=e.set.clouds)==null||c.dispose()}function Xt(e,t){e.timer&&clearTimeout(e.timer),e.timer=setTimeout(()=>{e.timer=null,e.refs<=0&&Zo(e)},t)}function Jo(e,t,a){let c=et.get(e);c||(c=new Map,et.set(e,c));const p=`${t}:${a}`;let n=c.get(p);return n||(n={set:Xo(e,t,a),refs:0,timer:null,key:p,gl:e},c.set(p,n),Xt(n,5e3)),n}function ea(e){e.refs++,e.timer&&(clearTimeout(e.timer),e.timer=null)}function ta(e){e.refs--,e.refs<=0&&Xt(e,1500)}const te=(e,t,a)=>{const c=Math.min(1,Math.max(0,(a-e)/(t-e)));return c*c*(3-2*c)};function oa(e,t){const c=new Uint8Array(8192),p=st(t*131+7),n=1024,x=new Float32Array(n);for(let v=0;v<n;v++)x[v]=p();const S=v=>{const f=Math.floor(v),u=v-f,s=x[(f%n+n)%n],d=x[((f+1)%n+n)%n];return s+(d-s)*u*u*(3-2*u)},o=(v,f,u,s)=>te(f-s,f+s,v)*(1-te(u-s,u+s,v)),i=(v,f,u)=>Math.exp(-(((v-f)/u)**2)),y=e==="saturn"?1.11:1.6,R=e==="saturn"?2.34:2.06;for(let v=0;v<2048;v++){const f=y+(R-y)*(v+.5)/2048;let u=0,s;if(e==="saturn"){const d=S(f*55),b=S(f*260+50),z=S(f*1100+100),B=.82+.18*z,N=.035*o(f,1.11,1.236,.01)*(.5+.5*b),Y=o(f,1.239,1.527,.003)*(.1+.08*d+.1*b+.16*te(.72,.85,b))*B,D=o(f,1.527,1.951,.002)*(.58+.32*te(1.56,1.74,f)+.08*d)*(.84+.16*b)*B,_=o(f,1.951,2.027,.002)*(.03+.05*b+.12*i(f,1.99,.004)),C=o(f,2.027,2.269,.002)*(.5+.12*d+.06*b)*(.85+.15*z)*(1-o(f,2.2115,2.2165,8e-4))*(1-o(f,2.2635,2.2655,4e-4))*(1-.25*te(2.2,2.265,f)),j=.55*i(f,2.326,.0028);u=N+Y+D+_+C+j;const P=[.5,.45,.39],q=[.86+.06*d,.74+.06*d,.54+.06*b],I=[.78,.7,.58],W=te(1.5,1.56,f),$=te(1.95,2.03,f);s=[0,1,2].map(V=>{const ee=P[V]+(q[V]-P[V])*W;return ee+(I[V]-ee)*$})}else{const d=[[1.637,.0035,.35],[1.652,.0035,.35],[1.666,.0035,.38],[1.75,.005,.42],[1.786,.005,.42],[1.834,.0035,.3],[1.863,.0045,.42],[1.9,.0055,.48],[2,.016,.8]];u=.012*o(f,1.62,2.03,.01);for(const[b,z,B]of d)u+=.6*B*i(f,b,z);s=[.36,.38,.41]}u=Math.min(1,Math.max(0,u)),c[v*4+0]=Math.round(255*Math.pow(s[0],1.1)),c[v*4+1]=Math.round(255*Math.pow(s[1],1.1)),c[v*4+2]=Math.round(255*Math.pow(s[2],1.1)),c[v*4+3]=Math.round(255*u)}const r=new wo(c,2048,1,bo);return r.generateMipmaps=!0,r.minFilter=Ht,r.magFilter=Ie,r.wrapS=Mt,r.wrapT=Mt,r.needsUpdate=!0,{tex:r,inner:y,outer:R}}const Zt=new k,Fe=new De,aa=new k(1,0,.45).normalize();function Jt(e,t){typeof e=="function"?e(t):e&&(e.current=t)}const At=l.forwardRef(function({kind:t,radius:a,sunRef:c,highlightRef:p,dimRef:n,seed:x,spin:S=.1,tilt:o,position:i},y){const R=ue(_=>_.gl),r=Qt[t],v=x??r.seed,f=o??r.tilt,u=l.useMemo(()=>Jo(R,t,v),[R,t,v]);l.useEffect(()=>(ea(u),()=>ta(u)),[u]);const s=l.useMemo(()=>r.ring?oa(r.ring,v):null,[r.ring,v]),d=l.useMemo(()=>{const _={uSunPos:{value:new k},uCenter:{value:new k},uPlanetR:{value:1},uDim:{value:1},uHighlight:{value:0},uSunI:{value:r.sunI},uRingNormal:{value:new k(0,1,0)}},C={};r.normal&&(C.HAS_NORMAL=""),r.gas&&(C.GAS=""),t==="earth"&&(C.EARTH=""),s&&(C.RING_SHADOW="");const j=r.atmo,P={..._,uAlbedo:{value:u.set.albedo.texture},uNormalMap:{value:u.set.normal?u.set.normal.texture:null},uClouds:{value:u.set.clouds?u.set.clouds.texture:null},uCloudRot:{value:new at(1,0)},uNormalMat:{value:new Wt},uRimColor:{value:new k(...j?j.color:r.rim??[.8,.8,.8])},uHaze:{value:j?j.haze:0},uLS:{value:r.ls},uLimb:{value:r.limb},uDrift:{value:0},uRingTex:{value:s?s.tex:null},uRingInner:{value:s?s.inner:0},uRingOuter:{value:s?s.outer:1}},q=new J({vertexShader:Go,fragmentShader:Ho,uniforms:P,defines:C}),I=new Ee(1,r.segments,Math.round(r.segments*.75));let W=null,$=null;j&&(W=new J({vertexShader:Vo,fragmentShader:Uo,uniforms:{..._,uAtmScale:{value:j.scale},uColor:{value:new k(...j.color)},uTwilight:{value:new k(...j.twilight)},uIntensity:{value:j.intensity},uFalloff:{value:j.falloff}},transparent:!0,depthWrite:!1,blending:de}),$=new Ee(1,48,32));let V=null,ee=null;return s&&(V=new J({vertexShader:Yo,fragmentShader:$o,uniforms:{..._,uRingTex:{value:s.tex},uRingInner:{value:s.inner},uRingOuter:{value:s.outer}},transparent:!0,depthWrite:!1,side:xo}),ee=new go(s.inner,s.outer,192,1)),{shared:_,surface:q,sphere:I,atmo:W,atmoGeo:$,ringMat:V,ringGeo:ee}},[t,r,u,s]);l.useEffect(()=>()=>{var _,C,j,P;d.surface.dispose(),d.sphere.dispose(),(_=d.atmo)==null||_.dispose(),(C=d.atmoGeo)==null||C.dispose(),(j=d.ringMat)==null||j.dispose(),(P=d.ringGeo)==null||P.dispose()},[d]),l.useEffect(()=>()=>s==null?void 0:s.tex.dispose(),[s]);const b=l.useRef(null),z=l.useRef(null),B=l.useRef(null),N=l.useRef(null);l.useLayoutEffect(()=>{const _=b.current;if(!_)return;const C=d.shared,j=d.surface.uniforms.uNormalMat.value,P=W=>{const $=W.matrixWorld;C.uCenter.value.setFromMatrixPosition($),C.uPlanetR.value=Zt.setFromMatrixColumn($,0).length()*_.scale.x/(W.scale.x||1),C.uSunPos.value.copy(c.current);const V=_.parent;V&&C.uRingNormal.value.setFromMatrixColumn(V.matrixWorld,1).normalize()};_.onBeforeRender=()=>{P(_),j.setFromMatrix4(_.matrixWorld)};const q=B.current;q&&(q.onBeforeRender=()=>P(q));const I=N.current;return I&&(I.onBeforeRender=()=>P(I)),()=>{_.onBeforeRender=()=>{},q&&(q.onBeforeRender=()=>{}),I&&(I.onBeforeRender=()=>{})}},[d,c]),l.useLayoutEffect(()=>{var _;(_=z.current)==null||_.quaternion.setFromAxisAngle(aa,f)},[f]),ke((_,C)=>{const j=b.current;if(!j)return;const P=Math.min(C,.1);j.rotation.y+=S*P;const q=_.clock.elapsedTime,I=d.shared;I.uHighlight.value=xe.clamp((p==null?void 0:p.current)??0,0,1),I.uDim.value=xe.clamp((n==null?void 0:n.current)??1,0,1);const W=d.surface.uniforms;if(r.gas&&(W.uDrift.value=.22*Math.sin(q*.035)),t==="earth"){const $=q*.012;W.uCloudRot.value.set(Math.cos($),Math.sin($))}});const Y=l.useCallback(_=>Jt(y,_),[y]),D=r.atmo;return m.jsxs("group",{ref:Y,position:i,children:[m.jsxs("group",{ref:z,children:[m.jsx("mesh",{ref:b,geometry:d.sphere,material:d.surface,scale:a}),d.ringGeo&&d.ringMat&&m.jsx("mesh",{ref:N,geometry:d.ringGeo,material:d.ringMat,scale:a,rotation:[-Math.PI/2,0,0]})]}),d.atmoGeo&&d.atmo&&D&&m.jsx("mesh",{ref:B,geometry:d.atmoGeo,material:d.atmo,scale:a*D.scale})]})});function eo(e,t){const a=document.createElement("canvas");a.width=a.height=e;const c=a.getContext("2d");c&&t(c,e);const p=new Yt(a);return p.colorSpace=$t,p.needsUpdate=!0,p}function Ke(e,t,a){return eo(e,(c,p)=>{const n=c.createImageData(p,p),x=p/2;for(let S=0;S<p;S++)for(let o=0;o<p;o++){const i=Math.hypot(o+.5-x,S+.5-x)/x,y=i>=1?0:Math.max(0,a(i)),R=(S*p+o)*4,r=Math.random()-.5;n.data[R]=Math.min(255,Math.max(0,y*t[0]*255+r)),n.data[R+1]=Math.min(255,Math.max(0,y*t[1]*255+r)),n.data[R+2]=Math.min(255,Math.max(0,y*t[2]*255+r)),n.data[R+3]=255}c.putImageData(n,0,0)})}function Ct(e,t,a,c,p){return eo(e,(n,x)=>{const S=st(t),o=x/2;n.fillStyle="#000",n.fillRect(0,0,x,x),n.globalCompositeOperation="lighter";for(let y=0;y<a;y++){const R=S()*Math.PI*2,r=o*p*(.2+.8*Math.pow(S(),2.6)),v=.004+.012*S(),f=.025+.09*Math.pow(S(),2),u=S(),s=Math.round(200+40*u),d=Math.round(130+80*u);for(let b=0;b<3;b++){const z=v*(1+b*2.2),B=f/(1+b*2.5),N=n.createRadialGradient(o,o,o*c,o,o,r);N.addColorStop(0,`rgba(255,${s},${d},${B})`),N.addColorStop(.25,`rgba(255,${s},${d},${B*.5})`),N.addColorStop(1,`rgba(255,${s},${d},0)`),n.fillStyle=N,n.beginPath(),n.moveTo(o,o),n.lineTo(o+Math.cos(R-z)*r,o+Math.sin(R-z)*r),n.lineTo(o+Math.cos(R+z)*r,o+Math.sin(R+z)*r),n.closePath(),n.fill()}}n.globalCompositeOperation="destination-in";const i=n.createRadialGradient(o,o,0,o,o,o);i.addColorStop(0,"rgba(0,0,0,1)"),i.addColorStop(.8,"rgba(0,0,0,1)"),i.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=i,n.fillRect(0,0,x,x),n.globalCompositeOperation="destination-over",n.fillStyle="#000",n.fillRect(0,0,x,x)})}const X={glow:5,corona:13,halo:46,rays1:22,rays2:16,coronaPlane:3.2};function na(){const e=new J({vertexShader:zt,fragmentShader:Ko,uniforms:{uTime:{value:0},uBright:{value:1},uViewToObj:{value:new Wt}},transparent:!0,depthWrite:!0,toneMapped:!1}),t=new J({vertexShader:zt,fragmentShader:Qo,uniforms:{uTime:{value:0},uI:{value:1},uScale:{value:X.coronaPlane}},transparent:!0,depthWrite:!1,blending:de,toneMapped:!1}),a=new Gt(2,2),c=u=>2/u,p=c(X.glow),n=Ke(256,[1,.7,.4],u=>{const s=u/p;return(s<1?1:.62*Math.exp(-(s-1)*4)+.38*Math.exp(-(s-1)*1.3))*(1-te(.7,1,u))}),x=c(X.corona),S=Ke(256,[1,.56,.24],u=>{const s=u/x;return s<1?0:(.7*Math.exp(-(s-1)*1.1)+.3/(s*s))*(1-te(.55,1,u))*te(1,1.06,s)}),o=c(X.halo),i=Ke(256,[1,.5,.2],u=>{const s=Math.max(u/o,1);return 1/(1+Math.pow(s/2.4,2))*(1-te(.3,1,u))}),y=Ct(1024,11,110,c(X.rays1)*1.05,1),R=Ct(1024,23,70,c(X.rays2)*1.05,.85),r=u=>new yo(new Mo({map:u,blending:de,transparent:!0,depthWrite:!1,toneMapped:!1})),v=[{sprite:r(i),size:X.halo,opacity:.2,spinRate:0,phase:0,grow:.5},{sprite:r(S),size:X.corona,opacity:.46,spinRate:0,phase:1.3,grow:.35},{sprite:r(y),size:X.rays1,opacity:.3,spinRate:.006,phase:2.1,grow:.6},{sprite:r(R),size:X.rays2,opacity:.26,spinRate:-.009,phase:4.2,grow:.6},{sprite:r(n),size:X.glow,opacity:.62,spinRate:0,phase:3.3,grow:.25}];v.forEach((u,s)=>{u.sprite.renderOrder=s+1});const f=[n,S,i,y,R];return{sunMat:e,coronaMat:t,plane:a,layers:v,dispose(){e.dispose(),t.dispose(),a.dispose(),v.forEach(u=>u.sprite.material.dispose()),f.forEach(u=>u.dispose())}}}const Qe=new k,qe=new k,ze=new k,Tt=new De,kt=new De,Xe=new De,_t=new ho,ra=new k(0,1,0),sa=l.forwardRef(function({radius:t,position:a,intensityRef:c},p){const n=l.useMemo(()=>na(),[]);l.useEffect(()=>()=>n.dispose(),[n]);const x=l.useRef(null),S=l.useRef(null),o=l.useRef(null),i=l.useRef(null);ke(({camera:R,clock:r},v)=>{const f=x.current,u=S.current,s=o.current,d=i.current;if(!f||!u||!s||!d)return;const b=r.elapsedTime,z=Math.min(v,.1),B=xe.clamp((c==null?void 0:c.current)??1,0,1),N=B*B*(3-2*B);f.getWorldPosition(Qe);const Y=Zt.setFromMatrixColumn(f.matrixWorld,0).length()||1;R.getWorldPosition(ze),qe.copy(ze).sub(Qe);const D=Math.max(qe.length(),.001);qe.multiplyScalar(1/D);const _=t*Y;f.getWorldQuaternion(Tt),R.getWorldQuaternion(kt),Fe.copy(Tt).invert().multiply(kt),u.quaternion.copy(Fe),d.quaternion.copy(Fe);const C=Math.min(_/D,.95);u.scale.setScalar(t/Math.sqrt(1-C*C)),Xe.setFromAxisAngle(ra,b*.02).invert(),Xe.multiply(Fe),_t.makeRotationFromQuaternion(Xe),n.sunMat.uniforms.uViewToObj.value.setFromMatrix4(_t);const j=Math.min(_*1.05,D*.5);ze.copy(Qe).addScaledVector(qe,j),f.worldToLocal(ze),s.position.copy(ze),s.scale.setScalar((D-j)/D),n.sunMat.uniforms.uTime.value=b,n.sunMat.uniforms.uBright.value=.12+.88*N,n.coronaMat.uniforms.uTime.value=b,n.coronaMat.uniforms.uI.value=N,d.scale.setScalar(t*X.coronaPlane);for(const P of n.layers){const q=1+.04*Math.sin(b*1.3+P.phase)+.025*Math.sin(b*2.9+P.phase*1.7)+.015*Math.sin(b*6.1+P.phase*.6),I=P.sprite.material;I.opacity=P.opacity*N*q,I.rotation+=P.spinRate*z;const W=t*P.size*(1-P.grow+P.grow*N)*(1+(q-1)*.6);P.sprite.scale.set(W,W,1),P.sprite.visible=I.opacity>.002}});const y=l.useCallback(R=>{x.current=R,Jt(p,R)},[p]);return m.jsxs("group",{ref:y,position:a,children:[m.jsx("mesh",{ref:S,geometry:n.plane,material:n.sunMat,renderOrder:0}),m.jsxs("group",{ref:o,children:[m.jsx("mesh",{ref:i,geometry:n.plane,material:n.coronaMat,renderOrder:1}),n.layers.map((R,r)=>m.jsx("primitive",{object:R.sprite},r))]})]})}),ca={core:"The core",product:"Product",erp:"Odoo & integrations",stack:"Stack"},Pt={core:"#fcd34d",product:"#fdba74",erp:"#5eead4",stack:"#c7d2fe"},Ae=e=>{var t;return(t=Bo.find(a=>a.title===e))==null?void 0:t.link},ia=e=>new URL(e).hostname.replace("www.",""),O=[{id:"nemei",label:"Nemei",cat:"product",kind:"earth",desc:"AI fitness and nutrition platform: workouts, macros, food recognition.",link:Ae("Nemei App"),radius:2.9,orbit:.26,phase:.6,uses:["python","ml","postgres","stripe","llm"],tilt:.41},{id:"ep",label:"EP Sportwear",cat:"product",kind:"mars",desc:"E-commerce for seamless activewear. Live and selling.",link:Ae("EP Sportwear"),radius:2.4,orbit:.37,phase:2.7,uses:[],tilt:.44},{id:"reader",label:"Reader",cat:"product",kind:"jupiter",desc:"Reading app where the AI assistant lives inside the text.",link:Ae("Reader"),radius:4.6,orbit:.5,phase:4.5,uses:["llm"],tilt:.05},{id:"odoo",label:"Odoo ERP",cat:"erp",kind:"saturn",desc:"Custom Odoo modules for billing, accounting workflows, API integrations and treasury.",radius:4,orbit:.63,phase:1.2,uses:["python","postgres","owl"],tilt:.47},{id:"radar",label:"Immoweb Radar",cat:"product",kind:"uranus",desc:"PWA that filters new Belgian listings and computes real costs.",link:Ae("Immoweb Radar"),radius:3.1,orbit:.77,phase:3.6,uses:[],tilt:1.7},{id:"piano",label:"Piano Trainer",cat:"product",kind:"neptune",desc:"Learn to read music with daily practice built around your level.",link:Ae("Piano Trainer"),radius:3.1,orbit:.9,phase:5.5,uses:[],tilt:.49}],Z=[{id:"billing",label:"Usage-based billing",desc:"Turns metered usage records into orders and invoices with tariff, cap and VAT rules.",radius:.85,distance:9,speed:.46,phase:.3},{id:"api",label:"API integrations",desc:"JSON-2 API endpoints, a rejected-record replay queue and legacy flat-file order imports.",radius:.7,distance:11,speed:.36,phase:2},{id:"forecast",label:"Cash-flow forecasting",desc:"Treasury forecast engine with OWL/Chart.js dashboards, payment-term schedules and alerts.",radius:.8,distance:13,speed:.29,phase:3.7},{id:"approval",label:"Vendor bill approval",desc:"Blocks vendor bill payment until lines match the PO or routed approvals are done.",radius:.6,distance:15,speed:.23,phase:5.2}],me=[{id:"python",label:"Python",desc:"FastAPI backends, Odoo modules and ML pipelines.",land:[-.84,-.2],port:[-.8,-.08]},{id:"ml",label:"scikit-learn",desc:"Random Forest models for personalised workout generation.",land:[-.68,-.47],port:[-.5,-.2]},{id:"stripe",label:"Stripe",desc:"Subscriptions, recurring billing and webhook-driven events.",land:[-.86,-.74],port:[-.8,-.52]},{id:"postgres",label:"PostgreSQL",desc:"Schema design and query optimisation for products and ERP.",land:[.84,-.2],port:[.8,-.08]},{id:"llm",label:"LLM APIs",desc:"Claude and Gemini running inside production features.",land:[.68,-.47],port:[.5,-.2]},{id:"owl",label:"OWL · QWeb",desc:"Odoo frontend components, PDF reports and templates.",land:[.86,-.74],port:[.8,-.52]}],Bt=[["python","ml"],["ml","stripe"],["python","stripe"],["postgres","llm"],["llm","owl"],["postgres","owl"]],Le=e=>me.findIndex(t=>t.id===e),re=[{type:"sun"},...O.map((e,t)=>({type:"planet",i:t})),...Z.map((e,t)=>({type:"moon",i:t})),...me.map((e,t)=>({type:"star",i:t}))],Me=e=>1+e,jt=O.findIndex(e=>e.id==="odoo"),tt={current:!1},he=-75,Nt=-95,Ze=128,Ft="button, a, input, textarea, nav";function Je(e){if(e.type==="sun")return{cat:"core",label:"React · Next.js · FastAPI",desc:"The full-stack core every product orbits around.",lines:[{title:"Orbiting",items:O.map(a=>a.label)}]};if(e.type==="planet"){const a=O[e.i],c=a.uses.map(n=>me[Le(n)].label),p=a.id==="odoo"?Z.map(n=>n.label):[];return{cat:a.cat,label:a.label,desc:a.desc,link:a.link,lines:[{title:"Moons",items:p},{title:"Built with",items:c}].filter(n=>n.items.length>0)}}if(e.type==="moon"){const a=Z[e.i];return{cat:"erp",label:a.label,desc:a.desc,lines:[{title:"Orbits",items:["Odoo ERP"]}]}}const t=me[e.i];return{cat:"stack",label:t.label,desc:t.desc,lines:[{title:"Used in",items:O.filter(a=>a.uses.includes(t.id)).map(a=>a.label)}].filter(a=>a.items.length>0)}}function qt(e,t=128){const a=document.createElement("canvas");a.width=a.height=t,e(a.getContext("2d"),t);const c=new Yt(a);return c.colorSpace=$t,c}const le=e=>1-Math.pow(1-Math.min(Math.max(e,0),1),3),la=()=>{const{camera:e,size:t}=ue(),[a,c]=l.useState(-1),p=l.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]),n=l.useRef(new k(0,20,he)),x=l.useRef(new k(0,28,he+55)),S=l.useRef(p?1:0),o=l.useMemo(()=>O.map(()=>({highlight:{current:0},dim:{current:1}})),[]),i=l.useMemo(()=>Z.map(()=>({highlight:{current:0},dim:{current:1}})),[]),y=l.useRef(null),R=l.useRef([]),r=l.useRef([]),v=l.useRef([]),f=l.useRef([]),u=l.useRef([]),s=l.useRef([]),d=l.useRef(-1),b=l.useRef(0),z=l.useRef(1),B=l.useRef(-1),N=l.useRef(0),Y=l.useRef(0),D=l.useRef(0),_=l.useRef(-2),C=l.useRef({x:0,y:0,active:!1}),j=l.useRef(O.map(()=>new k)),P=l.useRef(Z.map(()=>new k)),q=l.useRef(me.map(()=>new k)),I=l.useMemo(()=>new Ro,[]),W=l.useMemo(()=>new at,[]),$=l.useMemo(()=>qt((h,g)=>{const w=h.createRadialGradient(g/2,g/2,0,g/2,g/2,g/2);w.addColorStop(0,"rgba(255,255,255,1)"),w.addColorStop(.18,"rgba(255,255,255,0.55)"),w.addColorStop(.45,"rgba(255,255,255,0.12)"),w.addColorStop(1,"rgba(255,255,255,0)"),h.fillStyle=w,h.fillRect(0,0,g,g)}),[]),V=l.useMemo(()=>qt((h,g)=>{const w=g/2;for(const[M,F]of[[g,3],[3,g]]){const G=h.createRadialGradient(w,w,0,w,w,w);G.addColorStop(0,"rgba(255,255,255,0.9)"),G.addColorStop(1,"rgba(255,255,255,0)"),h.fillStyle=G,h.fillRect(w-M/2,w-F/2,M,F)}},256),[]),ee=l.useMemo(()=>O.map(()=>{const h=new Se,g=new U(new Float32Array(Ze*3),3);g.setUsage(zo),h.setAttribute("position",g);const w=new St({color:"#c7d2fe",transparent:!0,opacity:0,depthWrite:!1}),M=new Ao(h,w);return M.frustumCulled=!1,M}),[]),ye=l.useMemo(()=>{const h=new Se;h.setAttribute("position",new U(new Float32Array(Bt.length*6),3));const g=new St({color:"#c7d2fe",transparent:!0,opacity:0,depthWrite:!1}),w=new Co(h,g);return w.frustumCulled=!1,w},[]),it=8,se=l.useMemo(()=>{const h=new uo;h.setPositions(new Float32Array(it*6));const g=new fo({color:14739455,linewidth:1.6,transparent:!0,opacity:.85,depthWrite:!1}),w=new mo(h,g);return w.frustumCulled=!1,w},[]);l.useEffect(()=>{se.material.resolution.set(t.width,t.height)},[se,t]),l.useEffect(()=>()=>{$.dispose(),V.dispose(),ee.forEach(h=>{h.geometry.dispose(),h.material.dispose()}),ye.geometry.dispose(),ye.material.dispose(),se.geometry.dispose(),se.material.dispose()},[$,V,ee,ye,se]);const lt=(h,g)=>{W.set(h/window.innerWidth*2-1,-(g/window.innerHeight)*2+1),I.setFromCamera(W,e);const w=u.current.filter(Boolean),M=I.intersectObjects(w,!1)[0];return M?M.object.userData.pick:-1};l.useEffect(()=>{const h=M=>{const F=M.target;C.current.active=!(F!=null&&F.closest(Ft)),C.current.x=M.clientX,C.current.y=M.clientY,Y.current=performance.now()},g=()=>{C.current.active=!1},w=M=>{var oe;if((oe=M.target)!=null&&oe.closest(Ft))return;const F=lt(M.clientX,M.clientY);if(F<0)return;Y.current=performance.now();const G=Je(re[F]).link;G?window.open(G,"_blank","noopener,noreferrer"):(N.current=performance.now()+3500,B.current=F,c(F))};return window.addEventListener("pointermove",h),document.documentElement.addEventListener("pointerleave",g),window.addEventListener("click",w),()=>{window.removeEventListener("pointermove",h),document.documentElement.removeEventListener("pointerleave",g),window.removeEventListener("click",w),document.body.style.cursor="",tt.current=!1}},[]);const ut=l.useMemo(()=>re.map(h=>{if(h.type==="sun")return O.map((w,M)=>Me(M));if(h.type==="planet"){const w=O[h.i],M=w.uses.map(G=>1+O.length+Z.length+Le(G)),F=w.id==="odoo"?Z.map((G,oe)=>1+O.length+oe):[];return[...M,...F]}if(h.type==="moon")return[Me(jt),...Z.map((w,M)=>1+O.length+M)];const g=me[h.i].id;return O.flatMap((w,M)=>w.uses.includes(g)?[Me(M)]:[])}),[]),ve=l.useMemo(()=>new k,[]),We=(h,g)=>{const w=re[h];return w.type==="sun"?g.copy(n.current):w.type==="planet"?g.copy(j.current[w.i]):w.type==="moon"?g.copy(P.current[w.i]):g.copy(q.current[w.i])};ke(({clock:h},g)=>{var xt;const w=h.getElapsedTime();d.current<0&&(d.current=w);const M=p?100:w-d.current,F=e,G=Math.tan(xe.degToRad(F.fov/2)),oe=F.aspect<.85,dt=performance.now();if(dt>N.current){const A=C.current.active?lt(C.current.x,C.current.y):-1;A!==B.current&&(B.current=A,c(A),document.body.style.cursor=A>=0&&Je(re[A]).link?"pointer":"")}const fe=B.current;tt.current=fe>=0;let ft=-1;fe<0&&!p&&M>5&&dt-Y.current>5e3&&(ft=Me(Math.floor((M-5)/3.6)%O.length));const E=fe>=0?fe:ft,Ge=fe>=0?.38:.72,we=A=>E>=0&&(A===E||ut[E].includes(A)),so=fe>=0?.1:1;z.current+=(so-z.current)*(1-Math.exp(-g*4)),p||(b.current+=g*z.current);const mt=(F.position.z-he)*G,vt=mt*F.aspect;n.current.set(0,mt*(oe?.36:.4),he),(xt=y.current)==null||xt.position.copy(n.current),x.current.set(n.current.x,n.current.y+8,he+55),S.current=le(M/1.6);const Be=(A,T,L,H=.12)=>(L.current+=(T-L.current)*H,A);O.forEach((A,T)=>{const L=le((M-.7-T*.2)/1.8),H=A.orbit*vt*(oe?1.08:.95)*L,K=H*(oe?.85:.36),ae=Math.min(H*.45,28),Q=.26*Math.pow(.26/A.orbit,1.5),ne=A.phase+b.current*Q,ie=j.current[T];ie.set(n.current.x+H*Math.cos(ne),n.current.y-K*Math.sin(ne),he+ae*Math.sin(ne));const be=R.current[T];be&&(be.position.copy(ie),be.scale.setScalar(Math.max(L,.001)));const je=Me(T),gt=E===je,Ye=we(je);Be(je,gt?fe>=0?.6:.25:Ye?.2:0,o[T].highlight),Be(je,E<0||Ye?1:Ge,o[T].dim);const yt=ee[T].geometry.getAttribute("position");for(let Ne=0;Ne<Ze;Ne++){const $e=Ne/Ze*Math.PI*2;yt.setXYZ(Ne,n.current.x+H*Math.cos($e),n.current.y-K*Math.sin($e),he+ae*Math.sin($e))}yt.needsUpdate=!0;const wt=ee[T].material,lo=E<0?.16:gt||re[E].type==="sun"?.55:Ye?.3:.06;wt.opacity+=(lo*L-wt.opacity)*.12});const He=j.current[jt],Ve=Math.min(1,Math.max(.45,vt/94));Z.forEach((A,T)=>{const L=A.phase+b.current*A.speed,H=P.current[T],K=le((M-2.2-T*.25)/1.2);H.set(He.x+Math.cos(L)*A.distance*Ve*K,He.y+Math.sin(L)*A.distance*Ve*.28*K,He.z+Math.sin(L)*A.distance*Ve*.7*K);const ae=r.current[T];ae&&(ae.position.copy(H),ae.scale.setScalar(Math.max(K,.001)));const Q=1+O.length+T;Be(Q,E===Q?.6:we(Q)?.3:0,i[T].highlight),Be(Q,E<0||we(Q)?1:Ge,i[T].dim)});const pt=(F.position.z-Nt)*G,co=pt*F.aspect;me.forEach((A,T)=>{var ie,be;const L=oe?A.port:A.land,H=q.current[T];H.set(L[0]*co*.94,L[1]*pt*.94,Nt),(ie=v.current[T])==null||ie.position.copy(H);const K=1+O.length+Z.length+T,ae=le((M-1.4-T*.12)/1),Q=p?1:.85+.15*Math.sin(w*2.3+T*1.9),ne=E===K?1.6:we(K)?1.35:E>=0?.75:1;(be=f.current[T])==null||be.scale.setScalar(2.4*Q*ne*ae+.001)});const Ue=ye.geometry.getAttribute("position");Bt.forEach(([A,T],L)=>{const H=q.current[Le(A)],K=q.current[Le(T)];Ue.setXYZ(L*2,H.x,H.y,H.z),Ue.setXYZ(L*2+1,K.x,K.y,K.z)}),Ue.needsUpdate=!0;const ht=ye.material;ht.opacity+=((E>=0?.12:.22)*le((M-1.8)/1.5)-ht.opacity)*.1,E!==_.current&&(_.current=E,D.current=0),D.current=Math.min(1,D.current+g*2.2);const io=le(D.current),pe=se.geometry.attributes.instanceStart.data;let ce=0;if(E>=0&&re[E].type!=="sun"){const A=We(E,new k);for(const T of ut[E]){if(ce>=it)break;re[T].type==="moon"&&re[E].type!=="moon"||(We(T,ve),ve.lerp(A,1-io),pe.array[ce*6]=A.x,pe.array[ce*6+1]=A.y,pe.array[ce*6+2]=A.z,pe.array[ce*6+3]=ve.x,pe.array[ce*6+4]=ve.y,pe.array[ce*6+5]=ve.z,ce++)}}pe.needsUpdate=!0,se.geometry.instanceCount=ce,se.material.opacity=fe>=0?.9:.5,re.forEach((A,T)=>{const L=s.current[T];if(!L)return;const H=A.type==="planet"?le((M-1.2-A.i*.2)/1.2):A.type==="star"?le((M-1.6-A.i*.12)/1):A.type==="sun"?le((M-.8)/1):1,K=E<0||we(T)?1:Ge*.7;L.style.opacity=String(H*K);const ae=A.type==="moon"&&E!==T||oe&&A.type==="star"&&E!==T&&!we(T);L.style.visibility=ae?"hidden":"visible",We(T,ve).project(F);const Q=(ve.x+1)/2*t.width,ne=L.offsetWidth/2;let ie=0;Q-ne<8?ie=8-(Q-ne):Q+ne>t.width-8&&(ie=t.width-8-(Q+ne)),L.style.transform=`translate(${Math.round(ie)}px, ${L.dataset.offset}px)`})});const ro="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/55 px-2.5 py-0.5 text-[10px] md:text-xs font-medium text-white backdrop-blur-md",_e=h=>g=>{u.current[h]=g,g&&(g.userData.pick=h)},Pe=(h,g,w="center")=>{const M=Je(re[h]),F=w==="right"?"right-0":w==="left"?"left-0":"left-1/2 -translate-x-1/2";return m.jsx(vo,{center:!0,zIndexRange:a===h?[30,30]:[0,0],style:{pointerEvents:"none"},children:m.jsxs("div",{ref:G=>s.current[h]=G,className:"relative select-none","data-offset":g,style:{transform:`translateY(${g}px)`,opacity:0},children:[m.jsxs("div",{className:ro,children:[m.jsx("span",{className:"mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle",style:{background:Pt[M.cat]}}),M.label,M.link?" ↗":""]}),a===h&&m.jsxs("div",{className:`absolute top-full mt-2 w-60 rounded-2xl border border-white/15 bg-slate-950/75 p-3.5 text-left text-xs leading-snug text-white/90 shadow-2xl backdrop-blur-xl ${F}`,children:[m.jsxs("div",{className:"mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60",children:[m.jsx("span",{className:"h-1.5 w-1.5 rounded-full",style:{background:Pt[M.cat]}}),ca[M.cat]]}),m.jsx("div",{className:"text-sm font-semibold text-white",children:M.label}),m.jsx("p",{className:"mt-1",children:M.desc}),M.lines.map(G=>m.jsxs("p",{className:"mt-2 text-[11px] text-white/60",children:[m.jsxs("span",{className:"font-semibold text-white/75",children:[G.title,":"]})," ",G.items.join(" · ")]},G.title)),M.link&&m.jsxs("span",{className:"mt-2 block font-semibold text-white",children:["Visit ",ia(M.link)," ↗"]})]})]})})};return m.jsxs("group",{children:[m.jsxs("group",{ref:y,children:[m.jsx(sa,{radius:5.8,intensityRef:S}),m.jsxs("mesh",{ref:_e(0),children:[m.jsx("sphereGeometry",{args:[7.5,12,12]}),m.jsx("meshBasicMaterial",{visible:!1})]}),Pe(0,64)]}),ee.map((h,g)=>m.jsx("primitive",{object:h},`orbit-${g}`)),O.map((h,g)=>{const w=Me(g);return m.jsxs("group",{ref:M=>R.current[g]=M,children:[m.jsx(At,{kind:h.kind,radius:h.radius,sunRef:x,highlightRef:o[g].highlight,dimRef:o[g].dim,seed:g*7.3+1,tilt:h.tilt}),m.jsxs("mesh",{ref:_e(w),children:[m.jsx("sphereGeometry",{args:[Math.max(h.radius*(h.kind==="saturn"?2:1.6),3),12,12]}),m.jsx("meshBasicMaterial",{visible:!1})]}),Pe(w,Math.round(h.radius*7+14))]},h.id)}),Z.map((h,g)=>{const w=1+O.length+g;return m.jsxs("group",{ref:M=>r.current[g]=M,children:[m.jsx(At,{kind:"moon",radius:h.radius,sunRef:x,highlightRef:i[g].highlight,dimRef:i[g].dim,seed:40+g*3.1}),m.jsxs("mesh",{ref:_e(w),children:[m.jsx("sphereGeometry",{args:[Math.max(h.radius*2.5,1.8),10,10]}),m.jsx("meshBasicMaterial",{visible:!1})]}),Pe(w,Math.round(h.radius*7+12))]},h.id)}),m.jsx("primitive",{object:ye}),m.jsx("primitive",{object:se}),me.map((h,g)=>{const w=1+O.length+Z.length+g,M=h.land[0]>0;return m.jsxs("group",{ref:F=>v.current[g]=F,children:[m.jsx("sprite",{ref:F=>f.current[g]=F,children:m.jsx("spriteMaterial",{map:$,color:"#e0e7ff",transparent:!0,depthWrite:!1,blending:de})}),m.jsx("sprite",{scale:9,children:m.jsx("spriteMaterial",{map:V,color:"#c7d2fe",transparent:!0,opacity:.55,depthWrite:!1,blending:de})}),m.jsxs("mesh",{ref:_e(w),children:[m.jsx("sphereGeometry",{args:[2.6,10,10]}),m.jsx("meshBasicMaterial",{visible:!1})]}),Pe(w,22,M?"right":"left")]},h.id)})]})},ua=180,da=.86,Lt={color:"#ffffff",anchorX:"center",anchorY:"middle",fontWeight:"bold",outlineWidth:"6%",outlineBlur:"28%",outlineColor:"#1b2433",outlineOpacity:.55,renderOrder:1,"material-toneMapped":!1},fa=({position:e=[0,10,-120]})=>{const t=ue(x=>x.camera),a=ue(x=>x.size.width/x.size.height),p=2*(t.position.z-e[2])*Math.tan(xe.degToRad(t.fov/2))*a,n=Math.min(1,p*da/ua);return m.jsxs("group",{position:e,scale:n,children:[m.jsx(bt,{position:[0,5,0],fontSize:18,...Lt,children:"Fullstack Developer"}),m.jsx(bt,{position:[0,-12,0],fontSize:12,...Lt,children:"Polizzotto Emanuele"})]})},ma=3e3,va=150,Et=2600,pa=[5,0,1,2,3,4],Ce=560,ha=10,Te=new k(0,15,-85).normalize(),to=new k(1,0,0),xa=new k().crossVectors(to,Te).normalize();function ge(e,t,a=new k){return a.copy(Te).addScaledVector(to,e).addScaledVector(xa,t).normalize()}const oo=ge(-1.25,-.7),ga=ge(.3,.95),Re=new k().crossVectors(oo,ga).normalize(),ao=oo.clone(),ya=new k().crossVectors(Re,ao).normalize(),Oe=ge(-1.9,-1.15);Oe.addScaledVector(Re,-Oe.dot(Re)).normalize();const wa=ge(1.05,.5),ba=ge(.95,-.78),Ma=ge(-.95,-.85);function ct(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let a=t;return a=Math.imul(a^a>>>15,a|1),a^=a+Math.imul(a^a>>>7,a|61),((a^a>>>14)>>>0)/4294967296}}function Sa(e){let t=0;for(;t===0;)t=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*e())}function no(e,t){const a=e()*2-1,c=e()*Math.PI*2,p=Math.sqrt(1-a*a);return t.set(p*Math.cos(c),p*Math.sin(c),a)}const It=[{c:[.62,.71,1],w:.06},{c:[.74,.81,1],w:.14},{c:[.87,.9,1],w:.22},{c:[1,.98,.96],w:.22},{c:[1,.93,.83],w:.17},{c:[1,.83,.64],w:.12},{c:[1,.7,.47],w:.07}];function ot(e){let t=e();for(const a of It){if(t<a.w)return a.c;t-=a.w}return It[3].c}const Ra=`
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
`,za=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Aa=`
uniform vec3 uBandN;
uniform vec3 uBulge;
uniform vec3 uArtA;
uniform vec3 uArtB;
uniform vec3 uArtC;
varying vec3 vPos;
${Ra}
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
`,Ca=`
varying vec3 vDir;
varying vec3 vView;
void main() {
  vDir = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`,Ta=`
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
`,ka=`
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
`,_a=`
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
`,Pa=`
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
`,Ba=`
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
`,ja=`
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
`,Na=`
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
`,Fa=`
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
`,qa=`
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
`;function Ot(e){const t=ct(e.seed),a=new Float32Array(e.count*3),c=new Float32Array(e.count*3),p=new Float32Array(e.count),n=new Float32Array(e.count*4),x=new k;for(let o=0;o<e.count;o++){const i=t()<e.bandFrac;let y=e.ext*.5;if(i){let d=0;for(let Y=0;Y<6;Y++){d=t()*Math.PI*2;const D=.55+.25*Math.sin(d*3+1.3)+.2*Math.sin(d*7+4.1);if(t()<D)break}const b=Math.cos(d),z=Math.sin(d);x.set(0,0,0).addScaledVector(ao,b).addScaledVector(ya,z);const B=Math.exp((x.dot(Oe)-1)/.18),N=Sa(t)*e.bandSigma*(1+1.2*B);x.multiplyScalar(Math.cos(N)).addScaledVector(Re,Math.sin(N)).normalize(),y=e.ext}else no(t,x);const R=e.rMin*Math.pow(e.rMax/e.rMin,t());y*=Math.min(1,Math.max(0,(R-300)/600)),a[o*3]=x.x*R,a[o*3+1]=x.y*R,a[o*3+2]=x.z*R;const r=Math.pow(t(),e.brightPow),v=350/R;p[o]=(e.sizeMin+(e.sizeMax-e.sizeMin)*r)*Math.min(1.2,Math.max(.85,Math.pow(v,.15)));const f=(e.iMin+(e.iMax-e.iMin)*r)*Math.min(1.3,Math.max(.6,Math.pow(v,.3))),u=ot(t),s=.75+.25*r;c[o*3]=(1+(u[0]-1)*s)*f,c[o*3+1]=(1+(u[1]-1)*s)*f,c[o*3+2]=(1+(u[2]-1)*s)*f,n[o*4]=t()*Math.PI*2,n[o*4+1]=.5+t()*1.8,n[o*4+2]=t()<e.twinkleFrac?.12+t()*.28:.03,n[o*4+3]=y}const S=new Se;return S.setAttribute("position",new U(a,3)),S.setAttribute("aColor",new U(c,3)),S.setAttribute("aSize",new U(p,1)),S.setAttribute("aTw",new U(n,4)),S}function La(e){const t=ct(e),a=[],c=[[-.9,.55,64,1],[.64,.62,48,.85],[.98,-.3,58,.95],[-.62,-.58,44,.8],[.2,-.66,30,.6],[-1.02,-.12,34,.7],[1.02,.42,30,.6],[-.3,.7,28,.55],[.42,.34,22,.45],[-.5,.3,22,.45]];for(const[v,f,u,s]of c)a.push({d:ge(v,f),r:260+t()*1100,size:u,c:ot(t),i:s});for(let v=0;v<14;v++){const f=no(t,new k);if(f.dot(Te)>.45){v--;continue}a.push({d:f,r:300+t()*1500,size:20+t()*26,c:ot(t),i:.5+t()*.4})}const p=a.length,n=new Float32Array(p*12),x=new Float32Array(p*8),S=new Float32Array(p*4),o=new Float32Array(p*12),i=new Float32Array(p*4),y=[],R=[-1,-1,1,-1,-1,1,1,1];a.forEach((v,f)=>{const u=v.r,s=t()*100;for(let b=0;b<4;b++){const z=f*4+b;n[z*3]=v.d.x*u,n[z*3+1]=v.d.y*u,n[z*3+2]=v.d.z*u,x[z*2]=R[b*2],x[z*2+1]=R[b*2+1],S[z]=v.size,o[z*3]=v.c[0]*v.i,o[z*3+1]=v.c[1]*v.i,o[z*3+2]=v.c[2]*v.i,i[z]=s}const d=f*4;y.push(d,d+1,d+2,d+2,d+1,d+3)});const r=new Se;return r.setAttribute("position",new U(n,3)),r.setAttribute("aCorner",new U(x,2)),r.setAttribute("aSize",new U(S,1)),r.setAttribute("aColor",new U(o,3)),r.setAttribute("aPhase",new U(i,1)),r.setIndex(y),r}function Ea(e){const t=ct(e),a=new Float32Array(Ce*3),c=new Float32Array(Ce*3),p=new Float32Array(Ce*3),n=new Float32Array(Ce*4),x=Te.y/-Te.z;for(let o=0;o<Ce;o++){const i=3+67*Math.pow(t(),1.15);a[o*3]=(t()*2-1)*(i*1.25+9),a[o*3+1]=i*x+(t()*2-1)*(i*.9+7),a[o*3+2]=ha-i,c[o*3]=t(),c[o*3+1]=t(),c[o*3+2]=t(),p[o*3]=.16+(t()*2-1)*.1,p[o*3+1]=.05+(t()*2-1)*.08,p[o*3+2]=(t()*2-1)*.05,n[o*4]=.05+Math.pow(t(),2.5)*.17,n[o*4+1]=.15+Math.pow(t(),2)*.45,n[o*4+2]=t()<.3?.5+t()*.5:t()*.3,n[o*4+3]=3+i*.35}const S=new Se;return S.setAttribute("position",new U(a,3)),S.setAttribute("aPhase",new U(c,3)),S.setAttribute("aVel",new U(p,3)),S.setAttribute("aDust",new U(n,4)),S}function Ia(){const e=new Se;return e.setAttribute("position",new U(new Float32Array(12),3)),e.setAttribute("aQuad",new U(new Float32Array([0,-1,0,1,1,-1,1,1]),2)),e.setIndex([0,2,1,1,2,3]),e}const Oa=131848,Da=({reducedMotion:e=!1})=>{const t=ue(r=>r.gl),a=ue(r=>r.scene),c=ue(r=>r.size),p=ue(r=>r.viewport.dpr),n=ue(r=>r.get),x=l.useRef(null),S=l.useRef(null),o=l.useMemo(()=>({active:!1,timer:2.5+Math.random()*3,t:0,dur:1,len:100,start:new k,vel:new k,right:new k,up:new k,fwd:new k,tmp:new k}),[]),i=l.useMemo(()=>({uTime:{value:0},uTwinkle:{value:e?0:1},uDpr:{value:1},uRes:{value:new at(1,1)},uNeb:{value:null},uFade:{value:0},uDrift:{value:e?0:1},uScale:{value:500}}),[]),y=l.useMemo(()=>{const r=new Ee(ma,48,24),v=new J({vertexShader:Ca,fragmentShader:Ta,uniforms:{uNeb:i.uNeb,uFade:i.uFade},side:Rt,depthWrite:!1,depthTest:!1,toneMapped:!1}),f=new J({vertexShader:ka,fragmentShader:_a,uniforms:{uTime:i.uTime,uTwinkle:i.uTwinkle,uDpr:i.uDpr,uFade:i.uFade,uNeb:i.uNeb},transparent:!0,depthWrite:!1,blending:de,toneMapped:!1}),u=Ot({count:9500,rMin:va,rMax:Et,seed:11,bandFrac:.15,bandSigma:.1,sizeMin:.6,sizeMax:1.7,iMin:.14,iMax:.95,brightPow:3.2,ext:.9,twinkleFrac:.3}),s=Ot({count:8e3,rMin:450,rMax:Et,seed:23,bandFrac:1,bandSigma:.065,sizeMin:.5,sizeMax:1.1,iMin:.1,iMax:.55,brightPow:3.5,ext:1,twinkleFrac:.1}),d=La(77),b=new J({vertexShader:Pa,fragmentShader:Ba,uniforms:{uTime:i.uTime,uTwinkle:i.uTwinkle,uRes:i.uRes},transparent:!0,depthWrite:!1,blending:de,toneMapped:!1}),z=Ea(91),B=new J({vertexShader:Fa,fragmentShader:qa,uniforms:{uTime:i.uTime,uDrift:i.uDrift,uDpr:i.uDpr,uScale:i.uScale},transparent:!0,depthWrite:!1,blending:de,toneMapped:!1}),N=Ia(),Y=new J({vertexShader:ja,fragmentShader:Na,uniforms:{uHead:{value:new k},uTail:{value:new k},uRes:i.uRes,uAlpha:{value:0}},transparent:!0,depthWrite:!1,blending:de,toneMapped:!1});return{skyGeo:r,skyMat:v,starMat:f,field:u,band:s,brightGeo:d,brightMat:b,dustGeo:z,dustMat:B,meteorGeo:N,meteorMat:Y}},[i]),R=l.useRef(null);return l.useLayoutEffect(()=>{const r=n(),v=Math.max(r.size.height,r.size.width*.6)*r.viewport.dpr,f=Math.min(r.size.width,r.size.height)<600,u=Math.ceil(v*1.3/256)*256,s=Math.min(Math.max(u,768),f?1024:1536,t.capabilities.maxCubemapSize),d=new Kt(s,{type:To,generateMipmaps:!1,minFilter:Ie,magFilter:Ie}),b=new Ut,z=new Ee(1,32,16),B=new J({vertexShader:za,fragmentShader:Aa,uniforms:{uBandN:{value:Re},uBulge:{value:Oe},uArtA:{value:wa},uArtB:{value:ba},uArtC:{value:Ma}},side:Rt,depthTest:!1,depthWrite:!1,blending:ko,toneMapped:!1});b.add(new Vt(z,B));const N=new _o(.1,10,d);return N.coordinateSystem=t.coordinateSystem,N.updateCoordinateSystem(),N.updateMatrixWorld(!0),R.current={rt:d,scene:b,cam:N,geo:z,mat:B,face:0},i.uFade.value=0,()=>{z.dispose(),B.dispose(),d.dispose(),i.uNeb.value=null,i.uFade.value=0,R.current=null}},[t,i,n]),l.useEffect(()=>{i.uDpr.value=p,i.uRes.value.set(c.width,c.height)},[p,c,i]),l.useLayoutEffect(()=>{i.uTwinkle.value=e?0:1,i.uDrift.value=e?0:1,S.current&&(e||!o.active)&&(S.current.visible=!1)},[e,i,o]),l.useEffect(()=>{if(a.background)return;const r=new Po(Oa);return a.background=r,()=>{a.background===r&&(a.background=null)}},[a]),l.useEffect(()=>()=>{y.skyGeo.dispose(),y.skyMat.dispose(),y.starMat.dispose(),y.field.dispose(),y.band.dispose(),y.dustGeo.dispose(),y.dustMat.dispose(),y.brightGeo.dispose(),y.brightMat.dispose(),y.meteorGeo.dispose(),y.meteorMat.dispose()},[y]),ke((r,v)=>{const f=Math.min(v,.1),u=r.clock.elapsedTime,s=R.current;if(s&&s.face<6){const C=pa[s.face],j=t.getRenderTarget(),P=t.xr.enabled;t.xr.enabled=!1,t.setRenderTarget(s.rt,C),t.render(s.scene,s.cam.children[C]),t.setRenderTarget(j),t.xr.enabled=P,s.face++,s.face===6&&(i.uNeb.value=s.rt.texture,s.geo.dispose(),s.mat.dispose())}else s&&i.uFade.value<1&&(i.uFade.value=e?1:Math.min(1,i.uFade.value+f/1.6));const d=r.camera;d.isPerspectiveCamera&&(i.uScale.value=.5*r.size.height/Math.tan(d.fov*(Math.PI/360))),e||(i.uTime.value=u,x.current&&x.current.quaternion.setFromAxisAngle(Re,.03*Math.sin(u*.026)));const b=S.current;if(!b)return;if(e){b.visible=!1;return}const z=y.meteorMat.uniforms;if(!o.active){if(o.timer-=f,o.timer>0)return;const C=r.camera;o.right.setFromMatrixColumn(C.matrixWorld,0),o.up.setFromMatrixColumn(C.matrixWorld,1),o.fwd.setFromMatrixColumn(C.matrixWorld,2).negate();const j=c.width/Math.max(c.height,1),P=420,q=(Math.random()*2-1)*.7*j*.77,I=.3+Math.random()*.42;o.tmp.copy(o.fwd).addScaledVector(o.right,q).addScaledVector(o.up,I).normalize(),o.start.copy(C.position).addScaledVector(o.tmp,P);const W=.25+Math.random()*.5,$=q>0?-1:1,V=P*(.55+Math.random()*.35);o.vel.set(0,0,0).addScaledVector(o.right,Math.cos(W)*$*V).addScaledVector(o.up,-Math.sin(W)*V),o.dur=.55+Math.random()*.45,o.len=P*(.16+Math.random()*.1),o.t=0,o.active=!0,b.visible=!0}o.t+=f;const B=o.t/o.dur;if(B>=1){o.active=!1,o.timer=5+Math.random()*5,b.visible=!1,z.uAlpha.value=0;return}const N=z.uHead.value,Y=z.uTail.value;N.copy(o.start).addScaledVector(o.vel,o.t);const D=o.vel.length(),_=Math.min(o.len,D*o.t);Y.copy(o.vel).multiplyScalar(-_/D).add(N),z.uAlpha.value=xe.smoothstep(B,0,.12)*(1-xe.smoothstep(B,.55,1))}),m.jsxs("group",{children:[m.jsxs("group",{ref:x,children:[m.jsx("mesh",{geometry:y.skyGeo,material:y.skyMat,renderOrder:-1e3,frustumCulled:!1}),m.jsx("points",{geometry:y.band,material:y.starMat,renderOrder:-990,frustumCulled:!1}),m.jsx("points",{geometry:y.field,material:y.starMat,renderOrder:-989,frustumCulled:!1}),m.jsx("mesh",{geometry:y.brightGeo,material:y.brightMat,renderOrder:-987,frustumCulled:!1})]}),m.jsx("points",{geometry:y.dustGeo,material:y.dustMat,renderOrder:-985,frustumCulled:!1}),m.jsx("mesh",{ref:S,geometry:y.meteorGeo,material:y.meteorMat,renderOrder:-986,frustumCulled:!1})]})},Dt=[0,0,-75];function Wa(){const e=l.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]),t=l.useRef({x:0,y:0});return l.useEffect(()=>{const a=c=>{t.current.x=c.clientX/window.innerWidth*2-1,t.current.y=-(c.clientY/window.innerHeight)*2+1};return document.addEventListener("pointermove",a),()=>{document.removeEventListener("pointermove",a)}},[]),ke(({camera:a,clock:c},p)=>{if(tt.current){a.lookAt(...Dt);return}const n=c.getElapsedTime(),x=e?0:1,S=t.current.x*4*x+Math.sin(n*.07)*2*x,o=t.current.y*2.5*x+Math.sin(n*.05+1)*1.2*x,i=1-Math.exp(-p*2.5);a.position.x+=(S-a.position.x)*i,a.position.y+=(o-a.position.y)*i,a.lookAt(...Dt)}),m.jsxs(m.Fragment,{children:[m.jsx(Da,{reducedMotion:e}),m.jsx(la,{}),m.jsx(fa,{position:[0,-36,-120]})]})}const $a=()=>m.jsx(po,{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:-1,opacity:1,background:"#02030a"},dpr:[1,1.5],camera:{position:[0,0,10],fov:75,far:5e3},children:m.jsx(Wa,{})});export{$a as default};
