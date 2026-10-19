import{r as g,u as Be,j as b,b as ke,L as Da,d as qa,e as Wa,H as Va,T as eo,C as Ha}from"./r3f-4eBKJgSG.js";import{c as S,H as Yo,d as Ge,m as ae,K as lt,Q as pe,D as Xo,X as Ga,J as Zo,Y as Ua,s as ie,Z as mt,r as $a,_ as Qo,f as Jo,$ as ea,G as ut,a0 as to,a1 as Ka,M as dt,S as ta,O as Ya,a2 as oa,a3 as aa,a4 as na,R as Xa,a5 as Te,a6 as G,a7 as Za,a8 as oo,a9 as Qa,aa as Ja,ab as ao,U as en,ac as tn,ad as on,y as an,I as sa,F as no,z as Fe,ae as so,af as nn,ag as sn,ah as rn,ai as cn,p as ra,aj as ln,ak as un,al as ro}from"./three-Qkfp9Fq2.js";import{p as dn,s as me,b as se,c as Ot,w as Qe,a as co}from"./index-CYUaxvfD.js";const jt=`
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
`,Dt=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,fn="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",vn=`
uniform float uFace;
uniform float uSize;
uniform vec3 uSeed;
uniform float uSeedF;
uniform int uPass;
${jt}
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
`,mn=`
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
`,pn=`
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
`,hn=`
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
`,xn=`
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
`,gn=`
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
`,yn=`
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
`,wn=`
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
`,bn=`
vec4 bakeAlbedo(vec3 d) {
  float n = fbm(vec3(d.x * 2.0, d.y * 14.0, d.z * 2.0) + uSeed, 4);
  float y = d.y + n * 0.02;
  vec3 col = mix(vec3(0.52, 0.78, 0.84), vec3(0.6, 0.83, 0.87), 0.5 + 0.5 * sin(y * 9.0));
  col *= 0.985 + 0.03 * n;
  col = mix(col, vec3(0.68, 0.88, 0.9), smoothstep(0.55, 0.9, -y) * 0.6);
  col = mix(col, vec3(0.64, 0.86, 0.89), smoothstep(0.65, 0.95, y) * 0.4);
  return vec4(col, 0.0);
}
`,Mn=`
varying vec3 vObj;
varying vec3 vWorld;
void main() {
  vObj = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,Sn=`
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
  ${Dt}
}
`,An=`
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,zn=`
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
  ${Dt}
}
`,Rn=`
varying vec3 vWorld;
varying vec2 vLocal;
void main() {
  vLocal = position.xy;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,Cn=`
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
  ${Dt}
}
`,kn=`
uniform float uTime;
uniform float uBright;
uniform mat3 uViewToObj;
varying vec2 vUv;
${jt}
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
`,io=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Tn=`
uniform float uTime;
uniform float uI;
uniform float uScale;
varying vec2 vUv;
${jt}
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
`,ca={earth:{body:pn,bake:512,normal:!0,clouds:!0,gas:!1,ls:0,limb:0,sunI:1.45,tilt:.41,seed:3,ring:null,segments:64,atmo:{color:[.2,.45,1],twilight:[.45,.16,.06],scale:1.05,falloff:3.4,intensity:.5,haze:.2}},mars:{body:hn,bake:512,normal:!0,clouds:!1,gas:!1,ls:.35,limb:0,sunI:1.4,tilt:.44,seed:5,ring:null,segments:64,atmo:{color:[1,.6,.4],twilight:[.7,.45,.4],scale:1.025,falloff:4,intensity:.4,haze:.18}},jupiter:{body:gn,bake:512,normal:!1,clouds:!1,gas:!0,ls:0,limb:.6,sunI:1.25,tilt:.05,seed:2,ring:null,segments:64,atmo:{color:[1,.86,.62],twilight:[.9,.55,.3],scale:1.025,falloff:4.5,intensity:.3,haze:.15}},saturn:{body:yn,bake:512,normal:!1,clouds:!1,gas:!0,ls:0,limb:.55,sunI:1.25,tilt:.47,seed:4,ring:"saturn",segments:64,atmo:{color:[1,.88,.62],twilight:[.9,.6,.32],scale:1.025,falloff:4.5,intensity:.28,haze:.15}},uranus:{body:bn,bake:256,normal:!1,clouds:!1,gas:!0,ls:0,limb:.6,sunI:1,tilt:1.71,seed:6,ring:"uranus",segments:64,atmo:{color:[.5,.9,1],twilight:[.4,.7,.9],scale:1.035,falloff:4,intensity:.45,haze:.25}},neptune:{body:wn,bake:256,normal:!1,clouds:!1,gas:!0,ls:0,limb:.55,sunI:1.3,tilt:.49,seed:7,ring:null,segments:64,atmo:{color:[.3,.62,1],twilight:[.3,.45,.9],scale:1.035,falloff:4,intensity:.5,haze:.25}},moon:{body:xn,bake:256,normal:!0,clouds:!1,gas:!1,ls:.85,limb:0,sunI:1.5,tilt:.1,seed:1,ring:null,segments:48,atmo:null,rim:[.75,.8,.9]}},_t=new WeakMap;function qt(e){let o=Math.floor(Math.abs(e))*2654435761+12345>>>0||1;return()=>(o=Math.imul(o,1664525)+1013904223>>>0,o/4294967296)}function Pn(e,o,t){const n=ca[o],c=qt(t*977+31),s={},i=new ae({vertexShader:fn,fragmentShader:vn+n.body+mn,defines:s,uniforms:{uFace:{value:0},uSize:{value:n.bake},uSeed:{value:new S(c()*60-30,c()*60-30,c()*60-30)},uSeedF:{value:Math.abs(Math.floor(t))%1e3},uPass:{value:0}},depthTest:!1,depthWrite:!1}),l=new Zo(2,2),a=new dt(l,i);a.frustumCulled=!1;const r=new ta;r.add(a);const f=new Ya(-1,1,1,-1,0,1),d=e.getRenderTarget(),u=e.xr.enabled,h=e.autoClear;e.xr.enabled=!1,e.autoClear=!0;const v=m=>{const p=new na(n.bake,{generateMipmaps:!0,minFilter:ea,magFilter:ut,depthBuffer:!1,stencilBuffer:!1});i.uniforms.uPass.value=m;for(let y=0;y<6;y++)p.texture.generateMipmaps=y===5,i.uniforms.uFace.value=y,e.setRenderTarget(p,y),e.render(r,f);return p},x={albedo:v(0),normal:n.normal?v(1):null,clouds:n.clouds?v(2):null};return e.setRenderTarget(d),e.xr.enabled=u,e.autoClear=h,i.dispose(),l.dispose(),x}function _n(e){var o,t,n;(o=_t.get(e.gl))==null||o.delete(e.key),e.set.albedo.dispose(),(t=e.set.normal)==null||t.dispose(),(n=e.set.clouds)==null||n.dispose()}function ia(e,o){e.timer&&clearTimeout(e.timer),e.timer=setTimeout(()=>{e.timer=null,e.refs<=0&&_n(e)},o)}function Fn(e,o,t){let n=_t.get(e);n||(n=new Map,_t.set(e,n));const c=`${o}:${t}`;let s=n.get(c);return s||(s={set:Pn(e,o,t),refs:0,timer:null,key:c,gl:e},n.set(c,s),ia(s,5e3)),s}function In(e){e.refs++,e.timer&&(clearTimeout(e.timer),e.timer=null)}function Bn(e){e.refs--,e.refs<=0&&ia(e,1500)}const ge=(e,o,t)=>{const n=Math.min(1,Math.max(0,(t-e)/(o-e)));return n*n*(3-2*n)};function Nn(e,o){const n=new Uint8Array(8192),c=qt(o*131+7),s=1024,i=new Float32Array(s);for(let h=0;h<s;h++)i[h]=c();const l=h=>{const v=Math.floor(h),x=h-v,m=i[(v%s+s)%s],p=i[((v+1)%s+s)%s];return m+(p-m)*x*x*(3-2*x)},a=(h,v,x,m)=>ge(v-m,v+m,h)*(1-ge(x-m,x+m,h)),r=(h,v,x)=>Math.exp(-(((h-v)/x)**2)),f=e==="saturn"?1.11:1.6,d=e==="saturn"?2.34:2.06;for(let h=0;h<2048;h++){const v=f+(d-f)*(h+.5)/2048;let x=0,m;if(e==="saturn"){const p=l(v*55),y=l(v*260+50),w=l(v*1100+100),C=.82+.18*w,P=.035*a(v,1.11,1.236,.01)*(.5+.5*y),H=a(v,1.239,1.527,.003)*(.1+.08*p+.1*y+.16*ge(.72,.85,y))*C,j=a(v,1.527,1.951,.002)*(.58+.32*ge(1.56,1.74,v)+.08*p)*(.84+.16*y)*C,F=a(v,1.951,2.027,.002)*(.03+.05*y+.12*r(v,1.99,.004)),B=a(v,2.027,2.269,.002)*(.5+.12*p+.06*y)*(.85+.15*w)*(1-a(v,2.2115,2.2165,8e-4))*(1-a(v,2.2635,2.2655,4e-4))*(1-.25*ge(2.2,2.265,v)),O=.55*r(v,2.326,.0028);x=P+H+j+F+B+O;const _=[.5,.45,.39],W=[.86+.06*p,.74+.06*p,.54+.06*y],U=[.78,.7,.58],D=ge(1.5,1.56,v),z=ge(1.95,2.03,v);m=[0,1,2].map(R=>{const L=_[R]+(W[R]-_[R])*D;return L+(U[R]-L)*z})}else{const p=[[1.637,.0035,.35],[1.652,.0035,.35],[1.666,.0035,.38],[1.75,.005,.42],[1.786,.005,.42],[1.834,.0035,.3],[1.863,.0045,.42],[1.9,.0055,.48],[2,.016,.8]];x=.012*a(v,1.62,2.03,.01);for(const[y,w,C]of p)x+=.6*C*r(v,y,w);m=[.36,.38,.41]}x=Math.min(1,Math.max(0,x)),n[h*4+0]=Math.round(255*Math.pow(m[0],1.1)),n[h*4+1]=Math.round(255*Math.pow(m[1],1.1)),n[h*4+2]=Math.round(255*Math.pow(m[2],1.1)),n[h*4+3]=Math.round(255*x)}const u=new Qo(n,2048,1,Jo);return u.generateMipmaps=!0,u.minFilter=ea,u.magFilter=ut,u.wrapS=to,u.wrapT=to,u.needsUpdate=!0,{tex:u,inner:f,outer:d}}const la=new S,nt=new mt,Ln=new S(1,0,.45).normalize();function ua(e,o){typeof e=="function"?e(o):e&&(e.current=o)}const lo=g.forwardRef(function({kind:o,radius:t,sunRef:n,highlightRef:c,dimRef:s,seed:i,spin:l=.1,tilt:a,position:r},f){const d=ke(F=>F.gl),u=ca[o],h=i??u.seed,v=a??u.tilt,x=g.useMemo(()=>Fn(d,o,h),[d,o,h]);g.useEffect(()=>(In(x),()=>Bn(x)),[x]);const m=g.useMemo(()=>u.ring?Nn(u.ring,h):null,[u.ring,h]),p=g.useMemo(()=>{const F={uSunPos:{value:new S},uCenter:{value:new S},uPlanetR:{value:1},uDim:{value:1},uHighlight:{value:0},uSunI:{value:u.sunI},uRingNormal:{value:new S(0,1,0)}},B={};u.normal&&(B.HAS_NORMAL=""),u.gas&&(B.GAS=""),o==="earth"&&(B.EARTH=""),m&&(B.RING_SHADOW="");const O=u.atmo,_={...F,uAlbedo:{value:x.set.albedo.texture},uNormalMap:{value:x.set.normal?x.set.normal.texture:null},uClouds:{value:x.set.clouds?x.set.clouds.texture:null},uCloudRot:{value:new Ge(1,0)},uNormalMat:{value:new Yo},uRimColor:{value:new S(...O?O.color:u.rim??[.8,.8,.8])},uHaze:{value:O?O.haze:0},uLS:{value:u.ls},uLimb:{value:u.limb},uDrift:{value:0},uRingTex:{value:m?m.tex:null},uRingInner:{value:m?m.inner:0},uRingOuter:{value:m?m.outer:1}},W=new ae({vertexShader:Mn,fragmentShader:Sn,uniforms:_,defines:B}),U=new lt(1,u.segments,Math.round(u.segments*.75));let D=null,z=null;O&&(D=new ae({vertexShader:An,fragmentShader:zn,uniforms:{...F,uAtmScale:{value:O.scale},uColor:{value:new S(...O.color)},uTwilight:{value:new S(...O.twilight)},uIntensity:{value:O.intensity},uFalloff:{value:O.falloff}},transparent:!0,depthWrite:!1,blending:pe}),z=new lt(1,48,32));let R=null,L=null;return m&&(R=new ae({vertexShader:Rn,fragmentShader:Cn,uniforms:{...F,uRingTex:{value:m.tex},uRingInner:{value:m.inner},uRingOuter:{value:m.outer}},transparent:!0,depthWrite:!1,side:Xo}),L=new Ga(m.inner,m.outer,192,1)),{shared:F,surface:W,sphere:U,atmo:D,atmoGeo:z,ringMat:R,ringGeo:L}},[o,u,x,m]);g.useEffect(()=>()=>{var F,B,O,_;p.surface.dispose(),p.sphere.dispose(),(F=p.atmo)==null||F.dispose(),(B=p.atmoGeo)==null||B.dispose(),(O=p.ringMat)==null||O.dispose(),(_=p.ringGeo)==null||_.dispose()},[p]),g.useEffect(()=>()=>m==null?void 0:m.tex.dispose(),[m]);const y=g.useRef(null),w=g.useRef(null),C=g.useRef(null),P=g.useRef(null);g.useLayoutEffect(()=>{const F=y.current;if(!F)return;const B=p.shared,O=p.surface.uniforms.uNormalMat.value,_=D=>{const z=D.matrixWorld;B.uCenter.value.setFromMatrixPosition(z),B.uPlanetR.value=la.setFromMatrixColumn(z,0).length()*F.scale.x/(D.scale.x||1),B.uSunPos.value.copy(n.current);const R=F.parent;R&&B.uRingNormal.value.setFromMatrixColumn(R.matrixWorld,1).normalize()};F.onBeforeRender=()=>{_(F),O.setFromMatrix4(F.matrixWorld)};const W=C.current;W&&(W.onBeforeRender=()=>_(W));const U=P.current;return U&&(U.onBeforeRender=()=>_(U)),()=>{F.onBeforeRender=()=>{},W&&(W.onBeforeRender=()=>{}),U&&(U.onBeforeRender=()=>{})}},[p,n]),g.useLayoutEffect(()=>{var F;(F=w.current)==null||F.quaternion.setFromAxisAngle(Ln,v)},[v]),Be((F,B)=>{const O=y.current;if(!O)return;const _=Math.min(B,.1);O.rotation.y+=l*_;const W=F.clock.elapsedTime,U=p.shared;U.uHighlight.value=ie.clamp((c==null?void 0:c.current)??0,0,1),U.uDim.value=ie.clamp((s==null?void 0:s.current)??1,0,1);const D=p.surface.uniforms;if(u.gas&&(D.uDrift.value=.22*Math.sin(W*.035)),o==="earth"){const z=W*.012;D.uCloudRot.value.set(Math.cos(z),Math.sin(z))}});const H=g.useCallback(F=>ua(f,F),[f]),j=u.atmo;return b.jsxs("group",{ref:H,position:r,children:[b.jsxs("group",{ref:w,children:[b.jsx("mesh",{ref:y,geometry:p.sphere,material:p.surface,scale:t}),p.ringGeo&&p.ringMat&&b.jsx("mesh",{ref:P,geometry:p.ringGeo,material:p.ringMat,scale:t,rotation:[-Math.PI/2,0,0]})]}),p.atmoGeo&&p.atmo&&j&&b.jsx("mesh",{ref:C,geometry:p.atmoGeo,material:p.atmo,scale:t*j.scale})]})});function da(e,o){const t=document.createElement("canvas");t.width=t.height=e;const n=t.getContext("2d");n&&o(n,e);const c=new oa(t);return c.colorSpace=aa,c.needsUpdate=!0,c}function St(e,o,t){return da(e,(n,c)=>{const s=n.createImageData(c,c),i=c/2;for(let l=0;l<c;l++)for(let a=0;a<c;a++){const r=Math.hypot(a+.5-i,l+.5-i)/i,f=r>=1?0:Math.max(0,t(r)),d=(l*c+a)*4,u=Math.random()-.5;s.data[d]=Math.min(255,Math.max(0,f*o[0]*255+u)),s.data[d+1]=Math.min(255,Math.max(0,f*o[1]*255+u)),s.data[d+2]=Math.min(255,Math.max(0,f*o[2]*255+u)),s.data[d+3]=255}n.putImageData(s,0,0)})}function uo(e,o,t,n,c){return da(e,(s,i)=>{const l=qt(o),a=i/2;s.fillStyle="#000",s.fillRect(0,0,i,i),s.globalCompositeOperation="lighter";for(let f=0;f<t;f++){const d=l()*Math.PI*2,u=a*c*(.2+.8*Math.pow(l(),2.6)),h=.004+.012*l(),v=.025+.09*Math.pow(l(),2),x=l(),m=Math.round(200+40*x),p=Math.round(130+80*x);for(let y=0;y<3;y++){const w=h*(1+y*2.2),C=v/(1+y*2.5),P=s.createRadialGradient(a,a,a*n,a,a,u);P.addColorStop(0,`rgba(255,${m},${p},${C})`),P.addColorStop(.25,`rgba(255,${m},${p},${C*.5})`),P.addColorStop(1,`rgba(255,${m},${p},0)`),s.fillStyle=P,s.beginPath(),s.moveTo(a,a),s.lineTo(a+Math.cos(d-w)*u,a+Math.sin(d-w)*u),s.lineTo(a+Math.cos(d+w)*u,a+Math.sin(d+w)*u),s.closePath(),s.fill()}}s.globalCompositeOperation="destination-in";const r=s.createRadialGradient(a,a,0,a,a,a);r.addColorStop(0,"rgba(0,0,0,1)"),r.addColorStop(.8,"rgba(0,0,0,1)"),r.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=r,s.fillRect(0,0,i,i),s.globalCompositeOperation="destination-over",s.fillStyle="#000",s.fillRect(0,0,i,i)})}const fe={glow:5,corona:13,halo:46,rays1:22,rays2:16,coronaPlane:3.2};function En(){const e=new ae({vertexShader:io,fragmentShader:kn,uniforms:{uTime:{value:0},uBright:{value:1},uViewToObj:{value:new Yo}},transparent:!0,depthWrite:!0,toneMapped:!1}),o=new ae({vertexShader:io,fragmentShader:Tn,uniforms:{uTime:{value:0},uI:{value:1},uScale:{value:fe.coronaPlane}},transparent:!0,depthWrite:!1,blending:pe,toneMapped:!1}),t=new Zo(2,2),n=x=>2/x,c=n(fe.glow),s=St(256,[1,.7,.4],x=>{const m=x/c;return(m<1?1:.62*Math.exp(-(m-1)*4)+.38*Math.exp(-(m-1)*1.3))*(1-ge(.7,1,x))}),i=n(fe.corona),l=St(256,[1,.56,.24],x=>{const m=x/i;return m<1?0:(.7*Math.exp(-(m-1)*1.1)+.3/(m*m))*(1-ge(.55,1,x))*ge(1,1.06,m)}),a=n(fe.halo),r=St(256,[1,.5,.2],x=>{const m=Math.max(x/a,1);return 1/(1+Math.pow(m/2.4,2))*(1-ge(.3,1,x))}),f=uo(1024,11,110,n(fe.rays1)*1.05,1),d=uo(1024,23,70,n(fe.rays2)*1.05,.85),u=x=>new Ua(new Ka({map:x,blending:pe,transparent:!0,depthWrite:!1,toneMapped:!1})),h=[{sprite:u(r),size:fe.halo,opacity:.2,spinRate:0,phase:0,grow:.5},{sprite:u(l),size:fe.corona,opacity:.46,spinRate:0,phase:1.3,grow:.35},{sprite:u(f),size:fe.rays1,opacity:.3,spinRate:.006,phase:2.1,grow:.6},{sprite:u(d),size:fe.rays2,opacity:.26,spinRate:-.009,phase:4.2,grow:.6},{sprite:u(s),size:fe.glow,opacity:.62,spinRate:0,phase:3.3,grow:.25}];h.forEach((x,m)=>{x.sprite.renderOrder=m+1});const v=[s,l,r,f,d];return{sunMat:e,coronaMat:o,plane:t,layers:h,dispose(){e.dispose(),o.dispose(),t.dispose(),h.forEach(x=>x.sprite.material.dispose()),v.forEach(x=>x.dispose())}}}const At=new S,st=new S,$e=new S,fo=new mt,vo=new mt,zt=new mt,mo=new $a,On=new S(0,1,0),jn=g.forwardRef(function({radius:o,position:t,intensityRef:n},c){const s=g.useMemo(()=>En(),[]);g.useEffect(()=>()=>s.dispose(),[s]);const i=g.useRef(null),l=g.useRef(null),a=g.useRef(null),r=g.useRef(null);Be(({camera:d,clock:u},h)=>{const v=i.current,x=l.current,m=a.current,p=r.current;if(!v||!x||!m||!p)return;const y=u.elapsedTime,w=Math.min(h,.1),C=ie.clamp((n==null?void 0:n.current)??1,0,1),P=C*C*(3-2*C);v.getWorldPosition(At);const H=la.setFromMatrixColumn(v.matrixWorld,0).length()||1;d.getWorldPosition($e),st.copy($e).sub(At);const j=Math.max(st.length(),.001);st.multiplyScalar(1/j);const F=o*H;v.getWorldQuaternion(fo),d.getWorldQuaternion(vo),nt.copy(fo).invert().multiply(vo),x.quaternion.copy(nt),p.quaternion.copy(nt);const B=Math.min(F/j,.95);x.scale.setScalar(o/Math.sqrt(1-B*B)),zt.setFromAxisAngle(On,y*.02).invert(),zt.multiply(nt),mo.makeRotationFromQuaternion(zt),s.sunMat.uniforms.uViewToObj.value.setFromMatrix4(mo);const O=Math.min(F*1.05,j*.5);$e.copy(At).addScaledVector(st,O),v.worldToLocal($e),m.position.copy($e),m.scale.setScalar((j-O)/j),s.sunMat.uniforms.uTime.value=y,s.sunMat.uniforms.uBright.value=.12+.88*P,s.coronaMat.uniforms.uTime.value=y,s.coronaMat.uniforms.uI.value=P,p.scale.setScalar(o*fe.coronaPlane);for(const _ of s.layers){const W=1+.04*Math.sin(y*1.3+_.phase)+.025*Math.sin(y*2.9+_.phase*1.7)+.015*Math.sin(y*6.1+_.phase*.6),U=_.sprite.material;U.opacity=_.opacity*P*W,U.rotation+=_.spinRate*w;const D=o*_.size*(1-_.grow+_.grow*P)*(1+(W-1)*.6);_.sprite.scale.set(D,D,1),_.sprite.visible=U.opacity>.002}});const f=g.useCallback(d=>{i.current=d,ua(c,d)},[c]);return b.jsxs("group",{ref:f,position:t,children:[b.jsx("mesh",{ref:l,geometry:s.plane,material:s.sunMat,renderOrder:0}),b.jsxs("group",{ref:a,children:[b.jsx("mesh",{ref:r,geometry:s.plane,material:s.coronaMat,renderOrder:1}),s.layers.map((d,u)=>b.jsx("primitive",{object:d.sprite},u))]})]})}),Dn={core:"The core",product:"Product",erp:"Odoo & integrations",stack:"Stack"},po={core:"#fcd34d",product:"#fdba74",erp:"#5eead4",stack:"#c7d2fe"},Ke=e=>{var o;return(o=dn.find(t=>t.title===e))==null?void 0:o.link},$=[{id:"nemei",label:"Nemei",cat:"product",kind:"earth",desc:"AI fitness and nutrition platform: workouts, macros, food recognition.",link:Ke("Nemei App"),radius:2.9,orbit:.26,phase:.6,uses:["python","ml","postgres","stripe","llm"],tilt:.41},{id:"ep",label:"EP Sportwear",cat:"product",kind:"mars",desc:"E-commerce for seamless activewear. Live and selling.",link:Ke("EP Sportwear"),radius:2.4,orbit:.37,phase:2.7,uses:[],tilt:.44},{id:"reader",label:"Reader",cat:"product",kind:"jupiter",desc:"Reading app where the AI assistant lives inside the text.",link:Ke("Reader"),radius:4.6,orbit:.5,phase:4.5,uses:["llm"],tilt:.05},{id:"odoo",label:"Odoo ERP",cat:"erp",kind:"saturn",desc:"Custom Odoo modules for billing, accounting workflows, API integrations and treasury.",radius:4,orbit:.63,phase:1.2,uses:["python","postgres","owl"],tilt:.47},{id:"radar",label:"Immoweb Radar",cat:"product",kind:"uranus",desc:"PWA that filters new Belgian listings and computes real costs.",link:Ke("Immoweb Radar"),radius:3.1,orbit:.77,phase:3.6,uses:[],tilt:1.7},{id:"piano",label:"Piano Trainer",cat:"product",kind:"neptune",desc:"Learn to read music with daily practice built around your level.",link:Ke("Piano Trainer"),radius:3.1,orbit:.9,phase:5.5,uses:[],tilt:.49}],ve=[{id:"billing",label:"Usage-based billing",desc:"Turns metered usage records into orders and invoices with tariff, cap and VAT rules.",radius:.85,distance:9,speed:.46,phase:.3},{id:"api",label:"API integrations",desc:"JSON-2 API endpoints, a rejected-record replay queue and legacy flat-file order imports.",radius:.7,distance:11,speed:.36,phase:2},{id:"forecast",label:"Cash-flow forecasting",desc:"Treasury forecast engine with OWL/Chart.js dashboards, payment-term schedules and alerts.",radius:.8,distance:13,speed:.29,phase:3.7},{id:"approval",label:"Vendor bill approval",desc:"Blocks vendor bill payment until lines match the PO or routed approvals are done.",radius:.6,distance:15,speed:.23,phase:5.2}],Ie=[{id:"python",label:"Python",desc:"FastAPI backends, Odoo modules and ML pipelines.",land:[-.84,-.2],port:[-.8,-.08]},{id:"ml",label:"scikit-learn",desc:"Random Forest models for personalised workout generation.",land:[-.68,-.47],port:[-.5,-.2]},{id:"stripe",label:"Stripe",desc:"Subscriptions, recurring billing and webhook-driven events.",land:[-.86,-.74],port:[-.8,-.52]},{id:"postgres",label:"PostgreSQL",desc:"Schema design and query optimisation for products and ERP.",land:[.84,-.2],port:[.8,-.08]},{id:"llm",label:"LLM APIs",desc:"Claude and Gemini running inside production features.",land:[.68,-.47],port:[.5,-.2]},{id:"owl",label:"OWL · QWeb",desc:"Odoo frontend components, PDF reports and templates.",land:[.86,-.74],port:[.8,-.52]}],ho=[["python","ml"],["ml","stripe"],["python","stripe"],["postgres","llm"],["llm","owl"],["postgres","owl"]],it=e=>Ie.findIndex(o=>o.id===e),be=[{type:"sun"},...$.map((e,o)=>({type:"planet",i:o})),...ve.map((e,o)=>({type:"moon",i:o})),...Ie.map((e,o)=>({type:"star",i:o}))],qe=e=>1+e,xo=$.findIndex(e=>e.id==="odoo"),Ft={current:!1},It=new Map,fa=new S(0,28,-20),go=10,qn=75,_e=-75,yo=-95,Rt=128,wo="button, a, input, textarea, nav";function bo(e){if(e.type==="sun")return{cat:"core",label:"React · Next.js · FastAPI",desc:"The full-stack core every product orbits around.",lines:[{title:"Orbiting",items:$.map(t=>t.label)}]};if(e.type==="planet"){const t=$[e.i],n=t.uses.map(s=>Ie[it(s)].label),c=t.id==="odoo"?ve.map(s=>s.label):[];return{cat:t.cat,label:t.label,desc:t.desc,link:t.link,lines:[{title:"Moons",items:c},{title:"Built with",items:n}].filter(s=>s.items.length>0)}}if(e.type==="moon"){const t=ve[e.i];return{cat:"erp",label:t.label,desc:t.desc,lines:[{title:"Orbits",items:["Odoo ERP"]}]}}const o=Ie[e.i];return{cat:"stack",label:o.label,desc:o.desc,lines:[{title:"Used in",items:$.filter(t=>t.uses.includes(o.id)).map(t=>t.label)}].filter(t=>t.items.length>0)}}function Mo(e,o=128){const t=document.createElement("canvas");t.width=t.height=o,e(t.getContext("2d"),o);const n=new oa(t);return n.colorSpace=aa,n}const Me=e=>1-Math.pow(1-Math.min(Math.max(e,0),1),3),Wn=({mode:e="home"})=>{const o=g.useRef(e);o.current=e;const{camera:t,size:n}=ke(),[c,s]=g.useState(-1),i=g.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]),l=g.useRef(new S(0,20,_e)),a=g.useRef(new S(0,28,_e+55)),r=g.useRef(i?1:0),f=g.useMemo(()=>$.map(()=>({highlight:{current:0},dim:{current:1}})),[]),d=g.useMemo(()=>ve.map(()=>({highlight:{current:0},dim:{current:1}})),[]),u=g.useRef(null),h=g.useRef([]),v=g.useRef([]),x=g.useRef([]),m=g.useRef([]),p=g.useRef([]),y=g.useRef([]),w=g.useRef(-1),C=g.useRef(0),P=g.useRef(1),H=g.useRef(-1),j=g.useRef(0),F=g.useRef(0),B=g.useRef(0),O=g.useRef(-2),_=g.useRef({x:0,y:0,active:!1}),W=g.useRef($.map(()=>new S)),U=g.useRef(ve.map(()=>new S)),D=g.useRef(Ie.map(()=>new S)),z=g.useMemo(()=>new Xa,[]),R=g.useMemo(()=>new Ge,[]);g.useEffect(()=>($.forEach((M,A)=>It.set(M.id,{pos:W.current[A],radius:M.radius,ringed:M.kind==="saturn"})),()=>$.forEach(M=>It.delete(M.id))),[]);const L=g.useMemo(()=>Mo((M,A)=>{const k=M.createRadialGradient(A/2,A/2,0,A/2,A/2,A/2);k.addColorStop(0,"rgba(255,255,255,1)"),k.addColorStop(.18,"rgba(255,255,255,0.55)"),k.addColorStop(.45,"rgba(255,255,255,0.12)"),k.addColorStop(1,"rgba(255,255,255,0)"),M.fillStyle=k,M.fillRect(0,0,A,A)}),[]),V=g.useMemo(()=>Mo((M,A)=>{const k=A/2;for(const[T,X]of[[A,3],[3,A]]){const J=M.createRadialGradient(k,k,0,k,k,k);J.addColorStop(0,"rgba(255,255,255,0.9)"),J.addColorStop(1,"rgba(255,255,255,0)"),M.fillStyle=J,M.fillRect(k-T/2,k-X/2,T,X)}},256),[]),I=g.useMemo(()=>$.map(()=>{const M=new Te,A=new G(new Float32Array(Rt*3),3);A.setUsage(Za),M.setAttribute("position",A);const k=new oo({color:"#c7d2fe",transparent:!0,opacity:0,depthWrite:!1}),T=new Qa(M,k);return T.frustumCulled=!1,T}),[]),q=g.useMemo(()=>{const M=new Te;M.setAttribute("position",new G(new Float32Array(ho.length*6),3));const A=new oo({color:"#c7d2fe",transparent:!0,opacity:0,depthWrite:!1}),k=new Ja(M,A);return k.frustumCulled=!1,k},[]),K=8,ee=g.useMemo(()=>{const M=new Da;M.setPositions(new Float32Array(K*6));const A=new qa({color:14739455,linewidth:1.6,transparent:!0,opacity:.85,depthWrite:!1}),k=new Wa(M,A);return k.frustumCulled=!1,k},[]);g.useEffect(()=>{ee.material.resolution.set(n.width,n.height)},[ee,n]),g.useEffect(()=>()=>{L.dispose(),V.dispose(),I.forEach(M=>{M.geometry.dispose(),M.material.dispose()}),q.geometry.dispose(),q.material.dispose(),ee.geometry.dispose(),ee.material.dispose()},[L,V,I,q,ee]);const ye=(M,A)=>{R.set(M/window.innerWidth*2-1,-(A/window.innerHeight)*2+1),z.setFromCamera(R,t);const k=p.current.filter(Boolean),T=z.intersectObjects(k,!1)[0];return T?T.object.userData.pick:-1};g.useEffect(()=>{const M=T=>{const X=T.target;_.current.active=!(X!=null&&X.closest(wo)),_.current.x=T.clientX,_.current.y=T.clientY,F.current=performance.now()},A=()=>{_.current.active=!1},k=T=>{var de;if((de=T.target)!=null&&de.closest(wo))return;const X=ye(T.clientX,T.clientY);if(X<0)return;F.current=performance.now();const J=be[X];J.type==="planet"&&$[J.i].link?window.location.hash=`#/scroll?p=${$[J.i].id}`:(j.current=performance.now()+3500,H.current=X,s(X))};return window.addEventListener("pointermove",M),document.documentElement.addEventListener("pointerleave",A),window.addEventListener("click",k),()=>{window.removeEventListener("pointermove",M),document.documentElement.removeEventListener("pointerleave",A),window.removeEventListener("click",k),document.body.style.cursor="",Ft.current=!1}},[]);const Y=g.useMemo(()=>be.map(M=>{if(M.type==="sun")return $.map((k,T)=>qe(T));if(M.type==="planet"){const k=$[M.i],T=k.uses.map(J=>1+$.length+ve.length+it(J)),X=k.id==="odoo"?ve.map((J,de)=>1+$.length+de):[];return[...T,...X]}if(M.type==="moon")return[qe(xo),...ve.map((k,T)=>1+$.length+T)];const A=Ie[M.i].id;return $.flatMap((k,T)=>k.uses.includes(A)?[qe(T)]:[])}),[]),te=g.useMemo(()=>new S,[]),le=(M,A)=>{const k=be[M];return k.type==="sun"?A.copy(l.current):k.type==="planet"?A.copy(W.current[k.i]):k.type==="moon"?A.copy(U.current[k.i]):A.copy(D.current[k.i])};Be(({clock:M},A)=>{var Xt;const k=M.getElapsedTime();w.current<0&&(w.current=k);const T=i?100:k-w.current,X=t,J=Math.tan(ie.degToRad(qn/2)),de=o.current==="home",Ne=X.aspect<.85,Gt=performance.now();if(Gt>j.current){const N=de&&_.current.active?ye(_.current.x,_.current.y):-1;N!==H.current&&(H.current=N,s(N),document.body.style.cursor=N>=0&&bo(be[N]).link?"pointer":"")}const Pe=H.current;Ft.current=de&&Pe>=0;let Ut=-1;de&&Pe<0&&!i&&T>5&&Gt-F.current>5e3&&(Ut=qe(Math.floor((T-5)/3.6)%$.length));const Q=Pe>=0?Pe:Ut,pt=Pe>=0?.38:.72,je=N=>Q>=0&&(N===Q||Y[Q].includes(N)),La=Pe>=0?.1:de?1:.35;P.current+=(La-P.current)*(1-Math.exp(-A*4)),i||(C.current+=A*P.current);const $t=(go-_e)*J,ht=$t*X.aspect;l.current.set(0,$t*(Ne?.36:.4),_e),(Xt=u.current)==null||Xt.position.copy(l.current),a.current.set(l.current.x,l.current.y+8,_e+55),fa.copy(a.current),me.x=l.current.x,me.y=l.current.y,me.z=l.current.z;const xt=.435*ht*(Ne?1.08:.95);se.cx=l.current.x,se.cy=l.current.y,se.cz=_e,se.a=xt,se.b=xt*(Ne?.85:.36),se.d=Math.min(xt*.45,28),se.appear=Me((T-1.6)/2),r.current=Me(T/1.6);const tt=(N,E,Z,oe=.12)=>(Z.current+=(E-Z.current)*oe,N);$.forEach((N,E)=>{const Z=Me((T-.7-E*.2)/1.8),oe=N.orbit*ht*(Ne?1.08:.95)*Z,ne=oe*(Ne?.85:.36),xe=Math.min(oe*.45,28),ce=.26*Math.pow(.26/N.orbit,1.5),we=N.phase+C.current*ce,ze=W.current[E];ze.set(l.current.x+oe*Math.cos(we),l.current.y-ne*Math.sin(we),_e+xe*Math.sin(we));const De=h.current[E];De&&(De.position.copy(ze),De.scale.setScalar(Math.max(Z,.001)));const ot=qe(E),Zt=Q===ot,bt=je(ot);tt(ot,Zt?Pe>=0?.6:.25:bt?.2:0,f[E].highlight),tt(ot,Q<0||bt?1:pt,f[E].dim);const Qt=I[E].geometry.getAttribute("position");for(let at=0;at<Rt;at++){const Mt=at/Rt*Math.PI*2;Qt.setXYZ(at,l.current.x+oe*Math.cos(Mt),l.current.y-ne*Math.sin(Mt),_e+xe*Math.sin(Mt))}Qt.needsUpdate=!0;const Jt=I[E].material,ja=de?Q<0?.16:Zt||be[Q].type==="sun"?.55:bt?.3:.06:.07;Jt.opacity+=(ja*Z-Jt.opacity)*.12});const gt=W.current[xo],yt=Math.min(1,Math.max(.45,ht/94));ve.forEach((N,E)=>{const Z=N.phase+C.current*N.speed,oe=U.current[E],ne=Me((T-2.2-E*.25)/1.2);oe.set(gt.x+Math.cos(Z)*N.distance*yt*ne,gt.y+Math.sin(Z)*N.distance*yt*.28*ne,gt.z+Math.sin(Z)*N.distance*yt*.7*ne);const xe=v.current[E];xe&&(xe.position.copy(oe),xe.scale.setScalar(Math.max(ne,.001)));const ce=1+$.length+E;tt(ce,Q===ce?.6:je(ce)?.3:0,d[E].highlight),tt(ce,Q<0||je(ce)?1:pt,d[E].dim)});const Kt=(go-yo)*J,Ea=Kt*X.aspect;Ie.forEach((N,E)=>{var ze,De;const Z=Ne?N.port:N.land,oe=D.current[E];oe.set(Z[0]*Ea*.94,Z[1]*Kt*.94,yo),(ze=x.current[E])==null||ze.position.copy(oe);const ne=1+$.length+ve.length+E,xe=Me((T-1.4-E*.12)/1),ce=i?1:.85+.15*Math.sin(k*2.3+E*1.9),we=Q===ne?1.6:je(ne)?1.35:Q>=0?.75:1;(De=m.current[E])==null||De.scale.setScalar(2.4*ce*we*xe*(de?1:0)+.001)});const wt=q.geometry.getAttribute("position");ho.forEach(([N,E],Z)=>{const oe=D.current[it(N)],ne=D.current[it(E)];wt.setXYZ(Z*2,oe.x,oe.y,oe.z),wt.setXYZ(Z*2+1,ne.x,ne.y,ne.z)}),wt.needsUpdate=!0;const Yt=q.material;Yt.opacity+=((de?Q>=0?.12:.22:0)*Me((T-1.8)/1.5)-Yt.opacity)*.1,Q!==O.current&&(O.current=Q,B.current=0),B.current=Math.min(1,B.current+A*2.2);const Oa=Me(B.current),Le=ee.geometry.attributes.instanceStart.data;let Ae=0;if(Q>=0&&be[Q].type!=="sun"){const N=le(Q,new S);for(const E of Y[Q]){if(Ae>=K)break;be[E].type==="moon"&&be[Q].type!=="moon"||(le(E,te),te.lerp(N,1-Oa),Le.array[Ae*6]=N.x,Le.array[Ae*6+1]=N.y,Le.array[Ae*6+2]=N.z,Le.array[Ae*6+3]=te.x,Le.array[Ae*6+4]=te.y,Le.array[Ae*6+5]=te.z,Ae++)}}Le.needsUpdate=!0,ee.geometry.instanceCount=Ae,ee.material.opacity=Pe>=0?.9:.5,be.forEach((N,E)=>{const Z=y.current[E];if(!Z)return;const oe=N.type==="planet"?Me((T-1.2-N.i*.2)/1.2):N.type==="star"?Me((T-1.6-N.i*.12)/1):N.type==="sun"?Me((T-.8)/1):1,ne=Q<0||je(E)?1:pt*.7;Z.style.opacity=String(oe*ne);const xe=!de||N.type==="moon"&&Q!==E||Ne&&N.type==="star"&&Q!==E&&!je(E);if(Z.style.visibility=xe?"hidden":"visible",xe)return;le(E,te).project(X);const ce=(te.x+1)/2*n.width,we=Z.offsetWidth/2;let ze=0;ce-we<8?ze=8-(ce-we):ce+we>n.width-8&&(ze=n.width-8-(ce+we)),Z.style.transform=`translate(${Math.round(ze)}px, ${Z.dataset.offset}px)`})});const ue="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/55 px-2.5 py-0.5 text-[10px] md:text-xs font-medium text-white backdrop-blur-md",re=M=>A=>{p.current[M]=A,A&&(A.userData.pick=M)},he=(M,A,k="center")=>{const T=bo(be[M]),X=k==="right"?"right-0":k==="left"?"left-0":"left-1/2 -translate-x-1/2";return b.jsx(Va,{center:!0,zIndexRange:c===M?[30,30]:[0,0],style:{pointerEvents:"none"},children:b.jsxs("div",{ref:J=>y.current[M]=J,className:"relative select-none","data-offset":A,style:{transform:`translateY(${A}px)`,opacity:0},children:[b.jsxs("div",{className:ue,children:[b.jsx("span",{className:"mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle",style:{background:po[T.cat]}}),T.label,T.link?" ↗":""]}),c===M&&b.jsxs("div",{className:`absolute top-full mt-2 w-60 rounded-2xl border border-white/15 bg-slate-950/75 p-3.5 text-left text-xs leading-snug text-white/90 shadow-2xl backdrop-blur-xl ${X}`,children:[b.jsxs("div",{className:"mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60",children:[b.jsx("span",{className:"h-1.5 w-1.5 rounded-full",style:{background:po[T.cat]}}),Dn[T.cat]]}),b.jsx("div",{className:"text-sm font-semibold text-white",children:T.label}),b.jsx("p",{className:"mt-1",children:T.desc}),T.lines.map(J=>b.jsxs("p",{className:"mt-2 text-[11px] text-white/60",children:[b.jsxs("span",{className:"font-semibold text-white/75",children:[J.title,":"]})," ",J.items.join(" · ")]},J.title)),T.link&&b.jsx("span",{className:"mt-2 block font-semibold text-white",children:"Click to fly there ↗"})]})]})})};return b.jsxs("group",{children:[b.jsxs("group",{ref:u,children:[b.jsx(jn,{radius:5.8,intensityRef:r}),b.jsxs("mesh",{ref:re(0),children:[b.jsx("sphereGeometry",{args:[7.5,12,12]}),b.jsx("meshBasicMaterial",{visible:!1})]}),he(0,64)]}),I.map((M,A)=>b.jsx("primitive",{object:M},`orbit-${A}`)),$.map((M,A)=>{const k=qe(A);return b.jsxs("group",{ref:T=>h.current[A]=T,children:[b.jsx(lo,{kind:M.kind,radius:M.radius,sunRef:a,highlightRef:f[A].highlight,dimRef:f[A].dim,seed:A*7.3+1,tilt:M.tilt}),b.jsxs("mesh",{ref:re(k),children:[b.jsx("sphereGeometry",{args:[Math.max(M.radius*(M.kind==="saturn"?2:1.6),3),12,12]}),b.jsx("meshBasicMaterial",{visible:!1})]}),he(k,Math.round(M.radius*7+14))]},M.id)}),ve.map((M,A)=>{const k=1+$.length+A;return b.jsxs("group",{ref:T=>v.current[A]=T,children:[b.jsx(lo,{kind:"moon",radius:M.radius,sunRef:a,highlightRef:d[A].highlight,dimRef:d[A].dim,seed:40+A*3.1}),b.jsxs("mesh",{ref:re(k),children:[b.jsx("sphereGeometry",{args:[Math.max(M.radius*2.5,1.8),10,10]}),b.jsx("meshBasicMaterial",{visible:!1})]}),he(k,Math.round(M.radius*7+12))]},M.id)}),b.jsx("primitive",{object:q}),b.jsx("primitive",{object:ee}),Ie.map((M,A)=>{const k=1+$.length+ve.length+A,T=M.land[0]>0;return b.jsxs("group",{ref:X=>x.current[A]=X,children:[b.jsx("sprite",{ref:X=>m.current[A]=X,children:b.jsx("spriteMaterial",{map:L,color:"#e0e7ff",transparent:!0,depthWrite:!1,blending:pe})}),b.jsx("sprite",{scale:9,children:b.jsx("spriteMaterial",{map:V,color:"#c7d2fe",transparent:!0,opacity:.55,depthWrite:!1,blending:pe})}),b.jsxs("mesh",{ref:re(k),children:[b.jsx("sphereGeometry",{args:[2.6,10,10]}),b.jsx("meshBasicMaterial",{visible:!1})]}),he(k,22,T?"right":"left")]},M.id)})]})},Vn=180,Hn=.86,So={color:"#ffffff",anchorX:"center",anchorY:"middle",fontWeight:"bold",outlineWidth:"6%",outlineBlur:"28%",outlineColor:"#1b2433",outlineOpacity:.55,renderOrder:1,"material-toneMapped":!1},Gn=({position:e=[0,10,-120]})=>{const o=ke(i=>i.camera),t=ke(i=>i.size.width/i.size.height),c=2*(o.position.z-e[2])*Math.tan(ie.degToRad(o.fov/2))*t,s=Math.min(1,c*Hn/Vn);return b.jsxs("group",{position:e,scale:s,children:[b.jsx(eo,{position:[0,5,0],fontSize:18,...So,children:"Fullstack Developer"}),b.jsx(eo,{position:[0,-12,0],fontSize:12,...So,children:"Polizzotto Emanuele"})]})},Un=3e3,$n=150,Ao=2600,Kn=[5,0,1,2,3,4],Ye=560,Yn=10,et=new S(0,15,-85).normalize(),va=new S(1,0,0),Xn=new S().crossVectors(va,et).normalize();function Oe(e,o,t=new S){return t.copy(et).addScaledVector(va,e).addScaledVector(Xn,o).normalize()}const ma=Oe(-1.25,-.7),Zn=Oe(.3,.95),Ue=new S().crossVectors(ma,Zn).normalize(),pa=ma.clone(),Qn=new S().crossVectors(Ue,pa).normalize(),ft=Oe(-1.9,-1.15);ft.addScaledVector(Ue,-ft.dot(Ue)).normalize();const Jn=Oe(1.05,.5),es=Oe(.95,-.78),ts=Oe(-.95,-.85);function Wt(e){let o=e>>>0;return()=>{o=o+1831565813>>>0;let t=o;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function os(e){let o=0;for(;o===0;)o=e();return Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*e())}function ha(e,o){const t=e()*2-1,n=e()*Math.PI*2,c=Math.sqrt(1-t*t);return o.set(c*Math.cos(n),c*Math.sin(n),t)}const zo=[{c:[.62,.71,1],w:.06},{c:[.74,.81,1],w:.14},{c:[.87,.9,1],w:.22},{c:[1,.98,.96],w:.22},{c:[1,.93,.83],w:.17},{c:[1,.83,.64],w:.12},{c:[1,.7,.47],w:.07}];function Bt(e){let o=e();for(const t of zo){if(o<t.w)return t.c;o-=t.w}return zo[3].c}const as=`
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
`,ns=`
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ss=`
uniform vec3 uBandN;
uniform vec3 uBulge;
uniform vec3 uArtA;
uniform vec3 uArtB;
uniform vec3 uArtC;
varying vec3 vPos;
${as}
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
`,rs=`
varying vec3 vDir;
varying vec3 vView;
void main() {
  vDir = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`,cs=`
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
`,is=`
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
`,ls=`
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
`,us=`
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
`,ds=`
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
`,fs=`
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
`,vs=`
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
`,ms=`
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
`,ps=`
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
`;function Ro(e){const o=Wt(e.seed),t=new Float32Array(e.count*3),n=new Float32Array(e.count*3),c=new Float32Array(e.count),s=new Float32Array(e.count*4),i=new S;for(let a=0;a<e.count;a++){const r=o()<e.bandFrac;let f=e.ext*.5;if(r){let p=0;for(let H=0;H<6;H++){p=o()*Math.PI*2;const j=.55+.25*Math.sin(p*3+1.3)+.2*Math.sin(p*7+4.1);if(o()<j)break}const y=Math.cos(p),w=Math.sin(p);i.set(0,0,0).addScaledVector(pa,y).addScaledVector(Qn,w);const C=Math.exp((i.dot(ft)-1)/.18),P=os(o)*e.bandSigma*(1+1.2*C);i.multiplyScalar(Math.cos(P)).addScaledVector(Ue,Math.sin(P)).normalize(),f=e.ext}else ha(o,i);const d=e.rMin*Math.pow(e.rMax/e.rMin,o());f*=Math.min(1,Math.max(0,(d-300)/600)),t[a*3]=i.x*d,t[a*3+1]=i.y*d,t[a*3+2]=i.z*d;const u=Math.pow(o(),e.brightPow),h=350/d;c[a]=(e.sizeMin+(e.sizeMax-e.sizeMin)*u)*Math.min(1.2,Math.max(.85,Math.pow(h,.15)));const v=(e.iMin+(e.iMax-e.iMin)*u)*Math.min(1.3,Math.max(.6,Math.pow(h,.3))),x=Bt(o),m=.75+.25*u;n[a*3]=(1+(x[0]-1)*m)*v,n[a*3+1]=(1+(x[1]-1)*m)*v,n[a*3+2]=(1+(x[2]-1)*m)*v,s[a*4]=o()*Math.PI*2,s[a*4+1]=.5+o()*1.8,s[a*4+2]=o()<e.twinkleFrac?.12+o()*.28:.03,s[a*4+3]=f}const l=new Te;return l.setAttribute("position",new G(t,3)),l.setAttribute("aColor",new G(n,3)),l.setAttribute("aSize",new G(c,1)),l.setAttribute("aTw",new G(s,4)),l}function hs(e){const o=Wt(e),t=[],n=[[-.9,.55,64,1],[.64,.62,48,.85],[.98,-.3,58,.95],[-.62,-.58,44,.8],[.2,-.66,30,.6],[-1.02,-.12,34,.7],[1.02,.42,30,.6],[-.3,.7,28,.55],[.42,.34,22,.45],[-.5,.3,22,.45]];for(const[h,v,x,m]of n)t.push({d:Oe(h,v),r:260+o()*1100,size:x,c:Bt(o),i:m});for(let h=0;h<14;h++){const v=ha(o,new S);if(v.dot(et)>.45){h--;continue}t.push({d:v,r:300+o()*1500,size:20+o()*26,c:Bt(o),i:.5+o()*.4})}const c=t.length,s=new Float32Array(c*12),i=new Float32Array(c*8),l=new Float32Array(c*4),a=new Float32Array(c*12),r=new Float32Array(c*4),f=[],d=[-1,-1,1,-1,-1,1,1,1];t.forEach((h,v)=>{const x=h.r,m=o()*100;for(let y=0;y<4;y++){const w=v*4+y;s[w*3]=h.d.x*x,s[w*3+1]=h.d.y*x,s[w*3+2]=h.d.z*x,i[w*2]=d[y*2],i[w*2+1]=d[y*2+1],l[w]=h.size,a[w*3]=h.c[0]*h.i,a[w*3+1]=h.c[1]*h.i,a[w*3+2]=h.c[2]*h.i,r[w]=m}const p=v*4;f.push(p,p+1,p+2,p+2,p+1,p+3)});const u=new Te;return u.setAttribute("position",new G(s,3)),u.setAttribute("aCorner",new G(i,2)),u.setAttribute("aSize",new G(l,1)),u.setAttribute("aColor",new G(a,3)),u.setAttribute("aPhase",new G(r,1)),u.setIndex(f),u}function xs(e){const o=Wt(e),t=new Float32Array(Ye*3),n=new Float32Array(Ye*3),c=new Float32Array(Ye*3),s=new Float32Array(Ye*4),i=et.y/-et.z;for(let a=0;a<Ye;a++){const r=3+67*Math.pow(o(),1.15);t[a*3]=(o()*2-1)*(r*1.25+9),t[a*3+1]=r*i+(o()*2-1)*(r*.9+7),t[a*3+2]=Yn-r,n[a*3]=o(),n[a*3+1]=o(),n[a*3+2]=o(),c[a*3]=.16+(o()*2-1)*.1,c[a*3+1]=.05+(o()*2-1)*.08,c[a*3+2]=(o()*2-1)*.05,s[a*4]=.05+Math.pow(o(),2.5)*.17,s[a*4+1]=.15+Math.pow(o(),2)*.45,s[a*4+2]=o()<.3?.5+o()*.5:o()*.3,s[a*4+3]=3+r*.35}const l=new Te;return l.setAttribute("position",new G(t,3)),l.setAttribute("aPhase",new G(n,3)),l.setAttribute("aVel",new G(c,3)),l.setAttribute("aDust",new G(s,4)),l}function gs(){const e=new Te;return e.setAttribute("position",new G(new Float32Array(12),3)),e.setAttribute("aQuad",new G(new Float32Array([0,-1,0,1,1,-1,1,1]),2)),e.setIndex([0,2,1,1,2,3]),e}const ys=131848,ws=({reducedMotion:e=!1})=>{const o=ke(u=>u.gl),t=ke(u=>u.scene),n=ke(u=>u.size),c=ke(u=>u.viewport.dpr),s=ke(u=>u.get),i=g.useRef(null),l=g.useRef(null),a=g.useMemo(()=>({active:!1,timer:2.5+Math.random()*3,t:0,dur:1,len:100,start:new S,vel:new S,right:new S,up:new S,fwd:new S,tmp:new S}),[]),r=g.useMemo(()=>({uTime:{value:0},uTwinkle:{value:e?0:1},uDpr:{value:1},uRes:{value:new Ge(1,1)},uNeb:{value:null},uFade:{value:0},uDrift:{value:e?0:1},uScale:{value:500}}),[]),f=g.useMemo(()=>{const u=new lt(Un,48,24),h=new ae({vertexShader:rs,fragmentShader:cs,uniforms:{uNeb:r.uNeb,uFade:r.uFade},side:ao,depthWrite:!1,depthTest:!1,toneMapped:!1}),v=new ae({vertexShader:is,fragmentShader:ls,uniforms:{uTime:r.uTime,uTwinkle:r.uTwinkle,uDpr:r.uDpr,uFade:r.uFade,uNeb:r.uNeb},transparent:!0,depthWrite:!1,blending:pe,toneMapped:!1}),x=Ro({count:9500,rMin:$n,rMax:Ao,seed:11,bandFrac:.15,bandSigma:.1,sizeMin:.6,sizeMax:1.7,iMin:.14,iMax:.95,brightPow:3.2,ext:.9,twinkleFrac:.3}),m=Ro({count:8e3,rMin:450,rMax:Ao,seed:23,bandFrac:1,bandSigma:.065,sizeMin:.5,sizeMax:1.1,iMin:.1,iMax:.55,brightPow:3.5,ext:1,twinkleFrac:.1}),p=hs(77),y=new ae({vertexShader:us,fragmentShader:ds,uniforms:{uTime:r.uTime,uTwinkle:r.uTwinkle,uRes:r.uRes},transparent:!0,depthWrite:!1,blending:pe,toneMapped:!1}),w=xs(91),C=new ae({vertexShader:ms,fragmentShader:ps,uniforms:{uTime:r.uTime,uDrift:r.uDrift,uDpr:r.uDpr,uScale:r.uScale},transparent:!0,depthWrite:!1,blending:pe,toneMapped:!1}),P=gs(),H=new ae({vertexShader:fs,fragmentShader:vs,uniforms:{uHead:{value:new S},uTail:{value:new S},uRes:r.uRes,uAlpha:{value:0}},transparent:!0,depthWrite:!1,blending:pe,toneMapped:!1});return{skyGeo:u,skyMat:h,starMat:v,field:x,band:m,brightGeo:p,brightMat:y,dustGeo:w,dustMat:C,meteorGeo:P,meteorMat:H}},[r]),d=g.useRef(null);return g.useLayoutEffect(()=>{const u=s(),h=Math.max(u.size.height,u.size.width*.6)*u.viewport.dpr,v=Math.min(u.size.width,u.size.height)<600,x=Math.ceil(h*1.3/256)*256,m=Math.min(Math.max(x,768),v?1024:1536,o.capabilities.maxCubemapSize),p=new na(m,{type:en,generateMipmaps:!1,minFilter:ut,magFilter:ut}),y=new ta,w=new lt(1,32,16),C=new ae({vertexShader:ns,fragmentShader:ss,uniforms:{uBandN:{value:Ue},uBulge:{value:ft},uArtA:{value:Jn},uArtB:{value:es},uArtC:{value:ts}},side:ao,depthTest:!1,depthWrite:!1,blending:tn,toneMapped:!1});y.add(new dt(w,C));const P=new on(.1,10,p);return P.coordinateSystem=o.coordinateSystem,P.updateCoordinateSystem(),P.updateMatrixWorld(!0),d.current={rt:p,scene:y,cam:P,geo:w,mat:C,face:0},r.uFade.value=0,()=>{w.dispose(),C.dispose(),p.dispose(),r.uNeb.value=null,r.uFade.value=0,d.current=null}},[o,r,s]),g.useEffect(()=>{r.uDpr.value=c,r.uRes.value.set(n.width,n.height)},[c,n,r]),g.useLayoutEffect(()=>{r.uTwinkle.value=e?0:1,r.uDrift.value=e?0:1,l.current&&(e||!a.active)&&(l.current.visible=!1)},[e,r,a]),g.useEffect(()=>{if(t.background)return;const u=new an(ys);return t.background=u,()=>{t.background===u&&(t.background=null)}},[t]),g.useEffect(()=>()=>{f.skyGeo.dispose(),f.skyMat.dispose(),f.starMat.dispose(),f.field.dispose(),f.band.dispose(),f.dustGeo.dispose(),f.dustMat.dispose(),f.brightGeo.dispose(),f.brightMat.dispose(),f.meteorGeo.dispose(),f.meteorMat.dispose()},[f]),Be((u,h)=>{const v=Math.min(h,.1),x=u.clock.elapsedTime,m=d.current;if(m&&m.face<6){const B=Kn[m.face],O=o.getRenderTarget(),_=o.xr.enabled;o.xr.enabled=!1,o.setRenderTarget(m.rt,B),o.render(m.scene,m.cam.children[B]),o.setRenderTarget(O),o.xr.enabled=_,m.face++,m.face===6&&(r.uNeb.value=m.rt.texture,m.geo.dispose(),m.mat.dispose())}else m&&r.uFade.value<1&&(r.uFade.value=e?1:Math.min(1,r.uFade.value+v/1.6));const p=u.camera;p.isPerspectiveCamera&&(r.uScale.value=.5*u.size.height/Math.tan(p.fov*(Math.PI/360))),e||(r.uTime.value=x,i.current&&i.current.quaternion.setFromAxisAngle(Ue,.03*Math.sin(x*.026)));const y=l.current;if(!y)return;if(e){y.visible=!1;return}const w=f.meteorMat.uniforms;if(!a.active){if(a.timer-=v,a.timer>0)return;const B=u.camera;a.right.setFromMatrixColumn(B.matrixWorld,0),a.up.setFromMatrixColumn(B.matrixWorld,1),a.fwd.setFromMatrixColumn(B.matrixWorld,2).negate();const O=n.width/Math.max(n.height,1),_=420,W=(Math.random()*2-1)*.7*O*.77,U=.3+Math.random()*.42;a.tmp.copy(a.fwd).addScaledVector(a.right,W).addScaledVector(a.up,U).normalize(),a.start.copy(B.position).addScaledVector(a.tmp,_);const D=.25+Math.random()*.5,z=W>0?-1:1,R=_*(.55+Math.random()*.35);a.vel.set(0,0,0).addScaledVector(a.right,Math.cos(D)*z*R).addScaledVector(a.up,-Math.sin(D)*R),a.dur=.55+Math.random()*.45,a.len=_*(.16+Math.random()*.1),a.t=0,a.active=!0,y.visible=!0}a.t+=v;const C=a.t/a.dur;if(C>=1){a.active=!1,a.timer=5+Math.random()*5,y.visible=!1,w.uAlpha.value=0;return}const P=w.uHead.value,H=w.uTail.value;P.copy(a.start).addScaledVector(a.vel,a.t);const j=a.vel.length(),F=Math.min(a.len,j*a.t);H.copy(a.vel).multiplyScalar(-F/j).add(P),w.uAlpha.value=ie.smoothstep(C,0,.12)*(1-ie.smoothstep(C,.55,1))}),b.jsxs("group",{children:[b.jsxs("group",{ref:i,children:[b.jsx("mesh",{geometry:f.skyGeo,material:f.skyMat,renderOrder:-1e3,frustumCulled:!1}),b.jsx("points",{geometry:f.band,material:f.starMat,renderOrder:-990,frustumCulled:!1}),b.jsx("points",{geometry:f.field,material:f.starMat,renderOrder:-989,frustumCulled:!1}),b.jsx("mesh",{geometry:f.brightGeo,material:f.brightMat,renderOrder:-987,frustumCulled:!1})]}),b.jsx("points",{geometry:f.dustGeo,material:f.dustMat,renderOrder:-985,frustumCulled:!1}),b.jsx("mesh",{ref:l,geometry:f.meteorGeo,material:f.meteorMat,renderOrder:-986,frustumCulled:!1})]})},Xe=850,xa=.4,ga=72,ya=40,wa=1.35,ba=xa-ya*wa,Ma=ga-ba,Co=Ma*10,bs=`
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

const float Z_NEAR = ${xa.toFixed(3)};
const float Z_FAR = ${ga.toFixed(3)};
const float Z_MIN = ${ba.toFixed(3)};
const float RANGE = ${Ma.toFixed(3)};
const float L_VAR = ${wa.toFixed(3)};

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
`,Ms=`
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
`,Ss=`
varying vec2 vP;
void main() {
  vP = position.xy;
  // at the far end of the depth range: it lights up empty space, never a planet
  gl_Position = vec4(position.xy, 0.99999, 1.0);
}
`,As=`
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
`;function zs(e){let o=e>>>0;return()=>{o=o+1831565813>>>0;let t=o;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const ko=()=>{},Rs=({intensityRef:e})=>{const o=g.useRef(null),t=g.useRef({travel:0,time:0}),{streakGeo:n,streakMat:c,tunnelGeo:s,tunnelMat:i}=g.useMemo(()=>{const l=zs(6221122),a=new sa;a.setAttribute("position",new no([0,-1,0,1,-1,0,0,1,0,1,1,0],3)),a.setIndex([0,1,2,2,1,3]);const r=new Float32Array(Xe*4),f=new Float32Array(Xe*4);for(let v=0;v<Xe;v++){r[v*4]=l()*Math.PI*2,r[v*4+1]=4.2+24*Math.pow(l(),1.35),r[v*4+2]=l(),r[v*4+3]=.8+.1*Math.floor(l()*5);const x=l();let m,p,y;x<.5?[m,p,y]=[.78,.88,1]:x<.7?[m,p,y]=[.96,.97,1]:x<.92?[m,p,y]=[.42,.66,1]:[m,p,y]=[1,.76,.5];const w=.55+.6*Math.pow(l(),1.6);f[v*4]=m*w,f[v*4+1]=p*w,f[v*4+2]=y*w,f[v*4+3]=.6+.8*Math.pow(l(),2)}a.setAttribute("aSeed",new Fe(r,4)),a.setAttribute("aColor",new Fe(f,4)),a.instanceCount=Xe;const d=new ae({vertexShader:bs,fragmentShader:Ms,uniforms:{uTravel:{value:0},uI:{value:0},uLen:{value:1},uRes:{value:new Ge(1,1)},uDpr:{value:1}},transparent:!0,depthTest:!0,depthWrite:!1,blending:pe,toneMapped:!1}),u=new Te;u.setAttribute("position",new no([-1,-1,0,3,-1,0,-1,3,0],3));const h=new ae({vertexShader:Ss,fragmentShader:As,uniforms:{uI:{value:0},uTravel:{value:0},uTime:{value:0},uAspect:{value:1},uCenter:{value:new Ge(0,0)}},transparent:!0,depthTest:!0,depthWrite:!1,blending:cn,blendEquation:rn,blendSrc:so,blendDst:sn,blendSrcAlpha:nn,blendDstAlpha:so,toneMapped:!1});return{streakGeo:a,streakMat:d,tunnelGeo:u,tunnelMat:h}},[]);return g.useEffect(()=>()=>{n.dispose(),c.dispose(),s.dispose(),i.dispose()},[n,c,s,i]),Be((l,a)=>{const r=o.current;if(!r)return;const f=e.current,d=f>0?f<1?f:1:0;if(d<.002){r.visible&&(r.visible=!1);return}r.visible=!0;const u=t.current,h=a<.05?a:.05;u.travel+=h*(3+120*d*d),u.travel>Co&&(u.travel-=Co),u.time+=h;const v=l.viewport.dpr,x=l.size.width*v,m=l.size.height*v,p=c.uniforms;p.uTravel.value=u.travel,p.uI.value=d,p.uLen.value=.25+(ya-.25)*Math.pow(d,2.1),p.uRes.value.set(x,m),p.uDpr.value=v;const y=i.uniforms;y.uI.value=d,y.uTravel.value=u.travel,y.uTime.value=u.time,y.uAspect.value=x/m;const w=Math.round(Xe*Math.min(1,Math.max(.62,.45+.4*(x/m))));n.instanceCount!==w&&(n.instanceCount=w);const C=l.camera.projectionMatrix.elements;y.uCenter.value.set(-C[8],-C[9])}),b.jsxs("group",{ref:o,visible:!1,children:[b.jsx("mesh",{geometry:s,material:i,frustumCulled:!1,renderOrder:9998,raycast:ko}),b.jsx("mesh",{geometry:n,material:c,frustumCulled:!1,renderOrder:9999,raycast:ko})]})},Ct=2400,To=44,kt=1800,Po=30,_o=2600,Fo=520,Vt=8,Sa=6,Cs=.12,ks=new S(0,8,55),Ts=1.45,Ps=1.1,Tt=52,Ce=1024;function Aa(e){let o=e>>>0;return()=>{o=o+1831565813>>>0;let t=o;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Je(e){const o=Math.max(e(),1e-9);return Math.sqrt(-2*Math.log(o))*Math.cos(2*Math.PI*e())}function _s(e){const o=new Uint8Array(256);for(let i=0;i<256;i++)o[i]=i;for(let i=255;i>0;i--){const l=Math.floor(e()*(i+1)),a=o[i];o[i]=o[l],o[l]=a}const t=new Uint8Array(512);for(let i=0;i<512;i++)t[i]=o[i&255];const n=(i,l,a,r)=>{const f=i&15,d=f<8?l:a,u=f<4?a:f===12||f===14?l:r;return(f&1?-d:d)+(f&2?-u:u)},c=i=>i*i*i*(i*(i*6-15)+10),s=(i,l,a)=>i+(l-i)*a;return(i,l,a)=>{const r=Math.floor(i),f=Math.floor(l),d=Math.floor(a),u=r&255,h=f&255,v=d&255;i-=r,l-=f,a-=d;const x=c(i),m=c(l),p=c(a),y=t[u]+h,w=t[y]+v,C=t[y+1]+v,P=t[u+1]+h,H=t[P]+v,j=t[P+1]+v;return s(s(s(n(t[w],i,l,a),n(t[H],i-1,l,a),x),s(n(t[C],i,l-1,a),n(t[j],i-1,l-1,a),x),m),s(s(n(t[w+1],i,l,a-1),n(t[H+1],i-1,l,a-1),x),s(n(t[C+1],i,l-1,a-1),n(t[j+1],i-1,l-1,a-1),x),m),p)}}function Pt(e,o,t,n,c){let s=0,i=.5;for(let l=0;l<c;l++){s+=i*e(o,t,n);const a=.8*t+.6*n,r=-.8*o+.36*t-.48*n,f=-.6*o-.48*t+.64*n;o=a*2.03,t=r*2.03,n=f*2.03,i*=.5}return s}function Fs(e,o,t){const n=Math.max(t-Math.abs(e-o),0)/t;return Math.min(e,o)-n*n*t*.25}function Is(e){const o=(1+Math.sqrt(5))/2,t=[-1,o,0,1,o,0,-1,-o,0,1,-o,0,0,-1,o,0,1,o,0,-1,-o,0,1,-o,o,0,-1,o,0,1,-o,0,-1,-o,0,1];for(let c=0;c<t.length;c+=3){const s=Math.hypot(t[c],t[c+1],t[c+2]);t[c]/=s,t[c+1]/=s,t[c+2]/=s}let n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];for(let c=0;c<e;c++){const s=new Map,i=(a,r)=>{const f=a<r?a*100003+r:r*100003+a,d=s.get(f);if(d!==void 0)return d;const u=t[a*3]+t[r*3],h=t[a*3+1]+t[r*3+1],v=t[a*3+2]+t[r*3+2],x=Math.hypot(u,h,v);t.push(u/x,h/x,v/x);const m=t.length/3-1;return s.set(f,m),m},l=[];for(let a=0;a<n.length;a+=3){const r=n[a],f=n[a+1],d=n[a+2],u=i(r,f),h=i(f,d),v=i(d,r);l.push(r,u,v,f,h,u,d,v,h,u,h,v)}n=l}for(let c=0;c<n.length;c+=3){const s=n[c]*3,i=n[c+1]*3,l=n[c+2]*3,a=t[i]-t[s],r=t[i+1]-t[s+1],f=t[i+2]-t[s+2],d=t[l]-t[s],u=t[l+1]-t[s+1],h=t[l+2]-t[s+2],v=r*h-f*u,x=f*d-a*h,m=a*u-r*d;if(v*t[s]+x*t[s+1]+m*t[s+2]<0){const p=n[c+1];n[c+1]=n[c+2],n[c+2]=p}}return{pos:new Float32Array(t),index:new Uint16Array(n)}}function Io(e,o,t,n){const{pos:c,index:s}=Is(e),i=c.length/3,l=Math.ceil(i/Ce),a=new Float32Array(Ce*l*2*o*4),r=new Float32Array(i*3),f=new Float32Array(i*3),d=new Float32Array(i*3),u=new Float32Array(i);let h=0;for(let m=0;m<s.length;m+=3){const p=s[m]*3,y=s[m+1]*3;h+=Math.hypot(c[p]-c[y],c[p+1]-c[y+1],c[p+2]-c[y+2])}h/=s.length/3;for(let m=0;m<o;m++){const p=Aa(t*7919+m*104729+17),y=_s(p),w=[p()*50,p()*50,p()*50],C=n?16+Math.floor(p()*14):2+Math.floor(p()*3),P=[];for(let z=0;z<C;z++){const R=p()*2-1,L=p()*Math.PI*2,V=Math.sqrt(1-R*R),I=n?.08+.42*Math.pow(p(),2.4):.3+.4*p(),q=n?.55+.35*p():.35+.25*p(),K=p()<.22?.6+.4*p():0;P.push(V*Math.cos(L),V*Math.sin(L),R,I,q,K)}const H=n?p()<.5?1+Math.floor(p()*2):0:3+Math.floor(p()*3),j=[];for(let z=0;z<H;z++){const R=p()*2-1,L=p()*Math.PI*2,V=Math.sqrt(1-R*R);j.push(V*Math.cos(L),V*Math.sin(L),R,n?.74+.14*p():.55+.3*p())}const F=n&&m%3===2?.2+.08*p():0,B=F>0?1.4:1,O=n?.25:.26,_=n?.035:.05;let W=0;for(let z=0;z<i;z++){const R=c[z*3],L=c[z*3+1],V=c[z*3+2];let I=1+O*Pt(y,R*1.1+w[0],L*1.1+w[1],V*1.1+w[2],3),q=1;for(let Y=0;Y<P.length;Y+=6){const te=R*P[Y]+L*P[Y+1]+V*P[Y+2],le=P[Y+3];if(te<Math.cos(Math.min(1.7*le,Math.PI)))continue;const ue=Math.acos(Math.min(1,te))/le;let re=ue<1?Math.max(ue*ue-1,-.6):0;re+=.24*Math.exp(-(((ue-1)/.22)**2)),I+=re*le*P[Y+4],P[Y+5]>0&&(q+=.12*P[Y+5]*(1-Math.min(1,Math.max(0,(ue-.6)/.6))))}const K=I;for(let Y=0;Y<j.length;Y+=4){const te=R*j[Y]+L*j[Y+1]+V*j[Y+2];te>.05&&(I=Fs(I,j[Y+3]/te,n?.1:.05))}const ee=Math.min(1,(K-I)*12),ye=1-Math.abs(y(R*3.1+w[1],L*3.1+w[2],V*3.1+w[0]));I+=_*Pt(y,R*4.7+w[2],L*4.7+w[0],V*4.7+w[1],3)+_*(.8+.9*ee)*(ye*ye-.5),F>0&&(I*=1-F*Math.exp(-((R/.36)**2))),I=Math.max(I,.35),q*=.9+.2*(.5+.5*Pt(y,R*1.7+w[1],L*1.7+w[2],V*1.7+w[0],2)),u[z]=q,r[z*3]=R*I*B,r[z*3+1]=L*I,r[z*3+2]=V*I,W+=I}const U=i/W/Math.cbrt(B);for(let z=0;z<i*3;z++)r[z]*=U;f.fill(0),d.fill(0);const D=new Float32Array(i);for(let z=0;z<s.length;z+=3){const R=s[z],L=s[z+1],V=s[z+2],I=R*3,q=L*3,K=V*3,ee=r[q]-r[I],ye=r[q+1]-r[I+1],Y=r[q+2]-r[I+2],te=r[K]-r[I],le=r[K+1]-r[I+1],ue=r[K+2]-r[I+2],re=ye*ue-Y*le,he=Y*te-ee*ue,M=ee*le-ye*te;for(const A of[I,q,K])f[A]+=re,f[A+1]+=he,f[A+2]+=M;d[I]+=r[q]+r[K],d[I+1]+=r[q+1]+r[K+1],d[I+2]+=r[q+2]+r[K+2],d[q]+=r[I]+r[K],d[q+1]+=r[I+1]+r[K+1],d[q+2]+=r[I+2]+r[K+2],d[K]+=r[I]+r[q],d[K+1]+=r[I+1]+r[q+1],d[K+2]+=r[I+2]+r[q+2],D[R]+=2,D[L]+=2,D[V]+=2}for(let z=0;z<i;z++){const R=z*3,L=Math.hypot(f[R],f[R+1],f[R+2])||1,V=f[R]/L,I=f[R+1]/L,q=f[R+2]/L,K=d[R]/D[z]-r[R],ee=d[R+1]/D[z]-r[R+1],ye=d[R+2]/D[z]-r[R+2],Y=(K*V+ee*I+ye*q)/h,te=Math.min(1.06,Math.max(.5,1-(n?2.2:1.2)*Y)),le=z%Ce,ue=Math.floor(z/Ce),re=((m*2*l+ue)*Ce+le)*4,he=(((m*2+1)*l+ue)*Ce+le)*4;a[re]=r[R],a[re+1]=r[R+1],a[re+2]=r[R+2],a[re+3]=te,a[he]=V,a[he+1]=I,a[he+2]=q,a[he+3]=u[z]}}const v=new Qo(a,Ce,l*2*o,Jo,un);v.minFilter=ro,v.magFilter=ro,v.generateMipmaps=!1,v.needsUpdate=!0;const x=new sa;return x.setIndex(new G(s,1)),x.setAttribute("position",new G(c,3)),{geometry:x,texture:v,rows:l}}const za=`
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
`,Bs=`
${za}
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
  ivec2 t0 = ivec2(vi % ${Ce}, set * ROWS + vi / ${Ce});
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
`,Ns=`
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
`,Ls=`
uniform vec3 uLightPos;
uniform float uSunI;
varying vec3 vWorld;
varying vec3 vNrm;
varying vec3 vObj;
varying vec3 vAlb;
varying vec2 vAux;
varying float vSize;
${Ns}
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
`,Es=`
${za}
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
`,Os=`
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
`;function js(e,o,t){for(;;){const n=1+Je(e)*o;if(Math.abs(n-1)>t)continue;const c=Math.exp(-(((n-.957)/.005)**2))+Math.exp(-(((n-1.034)/.005)**2));if(!(e()<c*.85))return n}}function vt(e,o,t,n){const c=js(e,o,t);return{th:e()*Math.PI*2,r:c,omega:Cs*Math.pow(c,-1.5),ecc:e()*.022,inc:Je(e)*n,node:e()*Math.PI*2,peri:e()*Math.PI*2}}function Ds(e,o){const t=e();let n;t<.6?n=[.3,.29,.28]:t<.9?n=[.41,.37,.32]:n=[.39,.39,.385];const c=.88+.24*e(),s=(e()-.5)*.04;o[0]=(n[0]*c+s)**2,o[1]=(n[1]*c)**2,o[2]=(n[2]*c-s)**2}function qs(e,o){const t=e()*2-1,n=e()*Math.PI*2,c=Math.sqrt(1-t*t);o[0]=c*Math.cos(n),o[1]=c*Math.sin(n),o[2]=t}function Bo(e){return{orbit:new Float32Array(e*4),incl:new Float32Array(e*4),spin:new Float32Array(e*4),body:new Float32Array(e*4),stretch:new Float32Array(e*3),color:new Float32Array(e*3),count:0}}function Ht(e,o,t,n,c,s,i,l){const a=e.count++,r=[0,0,0];e.orbit.set([o.th,o.r,o.omega,o.ecc],a*4),e.incl.set([o.inc,o.node,o.peri,l()*Math.PI*2],a*4),qs(l,r),e.spin.set([r[0],r[1],r[2],s*(l()<.5?-1:1)],a*4),e.body.set([t,n,l(),i?1:0],a*4);const f=Math.cbrt(c[0]*c[1]*c[2]);e.stretch.set([c[0]/f,c[1]/f,c[2]/f],a*3),Ds(l,r),e.color.set(r,a*3)}const Ra=.034,Ca=.085,ka=.011,Ta=e=>[1+.6*e(),.65+.35*e(),.55+.4*e()];function No(e,o,t,n,c){for(let s=0;s<o;s++){const i=vt(n,Ra,Ca,ka);c.push(i);const l=t?.15+.3*Math.pow(n(),1.8):s<4?[.6,.5,.44,.38][s]:.14+.24*Math.pow(n(),2.4);Ht(e,i,l,Math.floor(n()*Sa),[1+.45*n(),.78+.22*n(),.68+.27*n()],.06+.3*n(),t,n)}}function Lo(e,o,t,n,c,s){let i=0;for(let l=0;i<o;l=(l+1)%t.length){const a=t[l],r=n(l),f=3+Math.floor(s()*6);for(let d=0;d<f&&i<o;d++,i++){const u=c?.03+.11*Math.pow(s(),1.6):.025+.08*Math.pow(s(),2);let h=0,v=0,x=0;for(let p=0;p<8&&(h=Je(s)*1.6,v=Je(s)*.5,x=Je(s)*.35,!(Math.hypot(h,v,x)>(r+u)*1.9+.15));p++);const m={...a,th:a.th+h/(Tt*a.r*.75),r:a.r+v/Tt,inc:a.inc+x/Tt};Ht(e,m,u,Math.floor(s()*Vt),Ta(s),.25+1.1*s(),c,s)}}}function Eo(e,o,t,n){for(let c=0;c<o;c++){const s=vt(n,Ra,Ca,ka),i=t?.03+.15*Math.pow(n(),2.2):.02+.11*Math.pow(n(),3.5);Ht(e,s,i,Math.floor(n()*Vt),Ta(n),.3+1.3*n(),t,n)}}function Ws(){const e=Aa(20260419),o=Bo(Ct+kt),t=Bo(To+Po),n=[];No(t,To,!1,e,n);const c=Math.floor(Ct*.22);Lo(o,c,n,h=>t.body[h*4],!1,e),Eo(o,Ct-c,!1,e),No(t,Po,!0,e,n);const s=Math.floor(kt*.35);Lo(o,s,n,h=>t.body[h*4],!0,e),Eo(o,kt-s,!0,e);const i=o.count+t.count+_o+Fo,l=new Float32Array(i*4),a=new Float32Array(i*4),r=new Float32Array(i*4),f=new Float32Array(i*3);let d=0;for(const h of[t,o])for(let v=0;v<h.count;v++,d++){l.set(h.orbit.subarray(v*4,v*4+4),d*4),a.set(h.incl.subarray(v*4,v*4+4),d*4);const x=e()<.12?.5+e():0;r.set([h.body[v*4],h.body[v*4+3]>.5?3:0,e()*Math.PI*2,x],d*4),f.set(h.color.subarray(v*3,v*3+3),d*3)}for(let h=0;h<_o;h++,d++){const v=vt(e,.045,.12,.016);l.set([v.th,v.r,v.omega,v.ecc],d*4),a.set([v.inc,v.node,v.peri,0],d*4);const x=e()<.15?.5+e():0;r.set([.004+.008*e(),1,e()*Math.PI*2,x],d*4);const m=.5+.35*e();f.set([.95*m,.86*m,.74*m],d*3)}for(let h=0;h<Fo;h++,d++){const v=vt(e,.04,.11,.014);l.set([v.th,v.r,v.omega,v.ecc],d*4),a.set([v.inc,v.node,v.peri,0],d*4),r.set([.022+.03*e(),2,0,0],d*4);const x=.02*(.6+.8*e());f.set([.95*x,.84*x,.7*x],d*3)}const u=new Te;return u.setAttribute("position",new G(new Float32Array(i*3),3)),u.setAttribute("aOrbit",new G(l,4)),u.setAttribute("aIncl",new G(a,4)),u.setAttribute("aPt",new G(r,4)),u.setAttribute("aColor",new G(f,3)),{pebbles:o,boulders:t,pointsGeo:u}}function Oo(e,o){e.setAttribute("aOrbit",new Fe(o.orbit,4)),e.setAttribute("aIncl",new Fe(o.incl,4)),e.setAttribute("aSpin",new Fe(o.spin,4)),e.setAttribute("aBody",new Fe(o.body,4)),e.setAttribute("aStretch",new Fe(o.stretch,3)),e.setAttribute("aColor",new Fe(o.color,3)),e.instanceCount=o.count}function Vs(){const{pebbles:e,boulders:o,pointsGeo:t}=Ws(),n={uBeltC:{value:new ra},uBeltABD:{value:new S},uTime:{value:0},uLightPos:{value:new S},uSunPos:{value:new S},uPxScale:{value:800},uMinPx:{value:Ps},uSunI:{value:Ts}},c=Io(3,Vt,3,!1),s=Io(4,Sa,11,!0);Oo(c.geometry,e),Oo(s.geometry,o);const i=u=>new ae({uniforms:{...n,uShape:{value:u.texture}},vertexShader:Bs,fragmentShader:Ls,defines:{ROWS:u.rows}}),l=new dt(c.geometry,i(c)),a=new dt(s.geometry,i(s));l.frustumCulled=!1,a.frustumCulled=!1;const r=new ae({uniforms:n,vertexShader:Es,fragmentShader:Os,transparent:!0,depthWrite:!1,blending:pe}),f=new ln(t,r);return f.frustumCulled=!1,{uniforms:n,pebbleMesh:l,boulderMesh:a,points:f,dispose:()=>{for(const u of[l,a])u.geometry.dispose(),u.material.dispose();c.texture.dispose(),s.texture.dispose(),t.dispose(),r.dispose()}}}const jo=new Ge,Hs=()=>{const e=g.useMemo(()=>{var c;return typeof window<"u"&&!!((c=window.matchMedia)!=null&&c.call(window,"(prefers-reduced-motion: reduce)").matches)},[]),o=g.useMemo(()=>Vs(),[]);g.useEffect(()=>()=>o.dispose(),[o]);const t=g.useRef(null),n=g.useRef({tau:0,rate:1});return Be(({camera:c,gl:s},i)=>{const l=t.current;if(!l)return;const a=Math.min(Math.max(se.appear,0),1),r=a>.002&&se.a>.01;if(l.visible=r,!r)return;const f=o.uniforms;f.uBeltC.value.set(se.cx,se.cy,se.cz,a),f.uBeltABD.value.set(se.a,se.b,se.d),f.uSunPos.value.set(me.x,me.y,me.z),f.uLightPos.value.set(me.x,me.y,me.z).add(ks);const d=n.current;if(!e){const h=Math.min(i,.1),v=Ot.current==="home"?1:.35;d.rate+=(v-d.rate)*(1-Math.exp(-h*4)),d.tau+=h*d.rate}f.uTime.value=d.tau;const u=c;s.getDrawingBufferSize(jo),f.uPxScale.value=.5*jo.y*u.projectionMatrix.elements[5]}),b.jsxs("group",{ref:t,visible:!1,children:[b.jsx("primitive",{object:o.boulderMesh}),b.jsx("primitive",{object:o.pebbleMesh}),b.jsx("primitive",{object:o.points})]})},Gs=6,Do=20,Us=35,qo=6.2,$s=8.8,Ks=2.5,Ys=120,rt=64,Wo=72,Pa=10,Nt=Math.tan(ie.degToRad(75/2)),Xs=.15,Zs=.86,Vo=.07,Qs=62,Js=34,_a=.42,Fa=(e,o)=>o*Qs*(.4+.6*e),Ia=(e,o)=>o*Js*(.45+.55*e),Ho=_a.toFixed(4),er=`
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
  return uNuc + (uAnti * s + uBend * (s * s * ${Ho})) * uDustLen;
}
vec3 dustTangent(float s) {
  return normalize(uAnti + uBend * (2.0 * s * ${Ho}));
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
`,tr=`
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
`;function or(){const e=4+2*(rt+1)*2+Wo*4,o=new Float32Array(e*4),t=new Float32Array(e*4),n=[];let c=0;const s=(a,r)=>{const f=c;for(const[d,u]of[[-1,-1],[1,-1],[-1,1],[1,1]])o.set([a,d,u,0],c*4),r&&t.set(r,c*4),c++;n.push(f,f+1,f+2,f+2,f+1,f+3)},i=a=>{const r=c;for(let f=0;f<=rt;f++){const d=Math.pow(f/rt,1.25);o.set([a,d,-1,0],c*4),o.set([a,d,1,0],(c+1)*4),c+=2}for(let f=0;f<rt;f++){const d=r+f*2;n.push(d,d+2,d+1,d+1,d+2,d+3)}};i(2),i(1),s(0,null);for(let a=0;a<Wo;a++)s(3,[Math.random(),Math.random(),Math.random(),Math.random()]);const l=new Te;return l.setAttribute("position",new G(new Float32Array(e*3),3)),l.setAttribute("aData",new G(o,4)),l.setAttribute("aRand",new G(t,4)),l.setIndex(n),l}const Re=new S,Lt=new S,Se=new S,Ve=new S,ct=new S,Go=new S,He=new S,We=(e,o,t,n)=>n.copy(t).addScaledVector(e.P,e.a*(e.e-Math.cosh(o))).addScaledVector(e.Q,e.bq*Math.sinh(o)),Ba=(e,o,t)=>t.copy(e.P).multiplyScalar(-e.a*Math.sinh(o)).addScaledVector(e.Q,e.bq*Math.cosh(o)).normalize();function ar(e,o){let t=Math.asinh(o/e);for(let n=0;n<8;n++){const c=e*Math.sinh(t)-t-o;t-=c/(e*Math.cosh(t)-1)}return t}function Na(e,o,t,n){Se.copy(o).sub(n);const c=Math.max(Se.length(),.001);return Se.multiplyScalar(1/c),Ve.copy(t).addScaledVector(Se,-t.dot(Se)).negate(),Ve.lengthSq()<1e-8?Ve.set(0,-1,0).addScaledVector(Se,Se.y).normalize():Ve.normalize(),Math.min(1,e.q/c)}const Ze={x:0,y:0,d:0};function Ee(e,o){Ze.d=Pa-e.z;const t=Math.max(Ze.d,.001);return Ze.x=e.x/t/(Nt*o),Ze.y=e.y/t/Nt,Ze}function Uo(e,o){const t=Ee(e,o);return t.d<5||Math.abs(t.x)>1.1}function nr(e,o,t,n,c){const s=Na(e,o,t,n),i=Fa(s,e.sc),l=Ia(s,e.sc);ct.copy(o).addScaledVector(Se,i);let a=Ee(ct,c);if(a.d<20||a.y<Vo)return!1;for(const r of[.5,1])if(ct.copy(o).addScaledVector(Se,r*l).addScaledVector(Ve,r*r*_a*l),a=Ee(ct,c),a.d<20||a.y<Vo)return!1;return!0}function sr(e,o,t){const n=(Pa-o.z)*Nt*t;e.sc=ie.clamp(n/94,.5,1.15),He.copy(o);const c=Ee(He,t),s=c.x,i=c.y,l=5+Math.max(0,t-1.5)*4;for(let a=0;a<Ys;a++){const r=e.dir;e.q=e.sc*(20+14*Math.random()),e.e=2.2+(l-2.2)*Math.random(),e.P.set((Math.random()-.5)*1.1,1,-.95+1.3*Math.random()).normalize(),e.Q.set(r,0,0).addScaledVector(e.P,-r*e.P.x).normalize(),Go.crossVectors(e.P,e.Q);const f=(Math.random()-.5)*1;e.Q.multiplyScalar(Math.cos(f)).addScaledVector(Go,Math.sin(f)).normalize(),e.a=e.q/(e.e-1),e.bq=e.a*Math.sqrt(e.e*e.e-1);let d=0,u=0,h=0;for(let y=1;y<=150&&h<2;y++){const w=y*.04;!u&&Uo(We(e,w,o,Re),t)&&(u=w,h++),!d&&Uo(We(e,-w,o,Re),t)&&(d=-w,h++)}if(h<2)continue;const v=Ee(We(e,d,o,Re),t).x,x=Ee(We(e,u,o,Re),t).x;if(Math.abs(v)<1||Math.abs(x)<1||Math.sign(v)===Math.sign(x))continue;let m=!0;const p=90;for(let y=0;y<=p&&m;y++){const w=d+(u-d)*y/p;We(e,w,o,Re);const C=Ee(Re,t);Math.abs(C.x)>1.12||(C.y<Xs||C.y>Zs||Re.z<-135||Re.z>-42||Math.hypot((C.x-s)*t,C.y-i)<.16?m=!1:nr(e,Re,Ba(e,w,Lt),o,t)||(m=!1))}if(m)return e.Ms=e.e*Math.sinh(d)-d,e.Me=e.e*Math.sinh(u)-u,e.dur=qo+($s-qo)*Math.random(),!0}return!1}const rr=()=>{const e=g.useRef(null),o=g.useMemo(()=>{const n=or(),c=new ae({vertexShader:er,fragmentShader:tr,uniforms:{uNuc:{value:new S},uAnti:{value:new S(1,0,0)},uBend:{value:new S(0,-1,0)},uIonLen:{value:1},uDustLen:{value:1},uComa:{value:1},uScale:{value:1},uTime:{value:0},uPx:{value:500},uDpr:{value:1},uAlpha:{value:0},uBright:{value:1},uSeed:{value:new ra}},transparent:!0,depthWrite:!1,depthTest:!0,side:Xo,blending:pe,toneMapped:!1});return{geometry:n,material:c}},[]);g.useEffect(()=>()=>{o.geometry.dispose(),o.material.dispose()},[o]);const t=g.useMemo(()=>({active:!1,timer:Gs+Math.random(),homeFor:0,t:0,clock:0,kill:1,orbit:{P:new S,Q:new S,q:1,e:2,a:1,bq:1,Ms:0,Me:0,dur:7,sc:1,dir:Math.random()<.5?1:-1}}),[]);return Be((n,c)=>{const s=e.current;if(!s)return;const i=Math.min(c,.1),l=Ot.current==="home";if(t.homeFor=l?t.homeFor+i:0,He.set(me.x,me.y,me.z),!t.active){if(s.visible=!1,t.timer-=i,t.timer>0)return;if(t.homeFor<Ks){t.timer=1;return}const m=n.size.width/Math.max(n.size.height,1);if(!sr(t.orbit,He,m)){t.timer=4;return}t.active=!0,t.t=0,t.kill=1,t.timer=Do+(Us-Do)*Math.random(),t.orbit.dir=-t.orbit.dir,o.material.uniforms.uSeed.value.set(Math.random(),Math.random(),Math.random(),Math.random())}t.t+=i,t.timer-=i,t.clock+=i,l||(t.kill=Math.max(0,t.kill-i*2));const a=t.orbit,r=t.t/a.dur;if(r>=1||t.kill<=0){t.active=!1,s.visible=!1,t.timer<8&&(t.timer=8+Math.random()*6);return}const f=ar(a.e,a.Ms+(a.Me-a.Ms)*r),d=o.material.uniforms,u=d.uNuc.value;We(a,f,He,u),Ba(a,f,Lt);const h=Na(a,u,Lt,He);d.uAnti.value.copy(Se),d.uBend.value.copy(Ve),d.uIonLen.value=Fa(h,a.sc),d.uDustLen.value=Ia(h,a.sc),d.uComa.value=a.sc*(1.1+1.2*h),d.uScale.value=a.sc,d.uBright.value=.35+.65*Math.pow(h,1.5),d.uAlpha.value=ie.smoothstep(r,0,.1)*(1-ie.smoothstep(r,.9,1))*t.kill,d.uTime.value=t.clock;const v=n.camera,x=n.viewport.dpr;d.uDpr.value=x,d.uPx.value=.5*n.size.height*x/Math.tan(ie.degToRad((v.fov||75)/2)),s.visible=!0}),b.jsx("mesh",{ref:e,geometry:o.geometry,material:o.material,frustumCulled:!1,visible:!1,renderOrder:6})},cr=()=>g.useMemo(()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,[])?null:b.jsx(rr,{}),$o=new S(0,0,-75),ir=new S(58,46,2),lr=new S(0,12,-75),ur=new S(-34,30,18),Ko=new S(-.78,.22,-1).normalize(),Et=75,dr=e=>e==="/"?"home":e==="/scroll"?"projects":"about";function fr({mode:e}){const o=g.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]),t=g.useRef({x:0,y:0}),n=g.useRef($o.clone()),c=g.useMemo(()=>new S,[]),s=g.useMemo(()=>new S,[]),i=g.useMemo(()=>new S(0,0,10),[]),l=g.useMemo(()=>new S,[]),a=g.useMemo(()=>new S,[]),r=g.useMemo(()=>new S,[]),f=g.useMemo(()=>new S,[]),d=g.useMemo(()=>new S(0,1,0),[]),u=g.useMemo(()=>new S,[]),h=g.useMemo(()=>new S,[]),v=g.useRef({x:0,y:0,active:!1}),x=g.useRef(!1);return g.useEffect(()=>{const m=p=>{t.current.x=p.clientX/window.innerWidth*2-1,t.current.y=-(p.clientY/window.innerHeight)*2+1};return window.addEventListener("pointermove",m),()=>window.removeEventListener("pointermove",m)},[]),Be(({camera:m,clock:p,size:y},w)=>{const C=m,P=p.getElapsedTime();Ot.current=e,x.current||(x.current=!0,o||(C.position.set(0,10,420),i.copy(C.position)));const H=o?0:1,j=t.current.x*H,F=t.current.y*H,B=C.aspect<.85;if(e==="home")Ft.current?c.copy(C.position):c.set(j*4+Math.sin(P*.07)*2*H,F*2.5+Math.sin(P*.05+1)*1.2*H,10),s.copy($o);else if(e==="about"){const R=Math.max(1,document.documentElement.scrollHeight-window.innerHeight),L=Math.min(1,Math.max(0,window.scrollY/R));c.copy(ur).addScaledVector(Ko,L*150),c.x+=j*3,c.y+=F*2,s.copy(c).addScaledVector(Ko,100)}else{const R=co.current?It.get(co.current):void 0;if(R){const L=R.radius*(R.ringed?2.3:1),V=R.pos;u.copy(fa).sub(V).normalize(),h.crossVectors(d,u).normalize(),l.copy(u).multiplyScalar(.64).addScaledVector(h,.77).normalize(),r.crossVectors(d,l).normalize(),r.dot(u)<0&&l.copy(u).multiplyScalar(.64).addScaledVector(h,-.77).normalize(),l.y+=.12,l.normalize();const I=Math.tan(ie.degToRad(Et/2)),q=B?.34:.42,K=B?.7:.3,ee=Math.max(2*L/(q*2*I),2*L/(K*2*I*C.aspect));c.copy(V).addScaledVector(l,ee),s.copy(V),a.copy(V).sub(c).normalize(),r.crossVectors(a,d).normalize(),f.crossVectors(r,a).normalize(),c.addScaledVector(r,j*L*.25).addScaledVector(f,F*L*.2)}else c.copy(ir),c.x+=j*3,c.y+=F*2,s.copy(lr)}const O=e==="projects"?B?{x:0,y:.3}:{x:.26,y:0}:{x:0,y:0},_=o?1:1-Math.exp(-w*2);v.current.x+=(O.x-v.current.x)*_,v.current.y+=(O.y-v.current.y)*_;const W=o?1:1-Math.exp(-w*1.5);C.position.lerp(c,W),n.current.lerp(s,o?1:1-Math.exp(-w*2.2)),C.lookAt(n.current);const U=w>0?C.position.distanceTo(i)/w:0;i.copy(C.position);const D=o?0:ie.clamp((U-18)/110,0,1);Qe.current+=(D-Qe.current)*(1-Math.exp(-w*(D>Qe.current?6:2.5))),C.fov=Et+Qe.current*14;const z=v.current;Math.abs(z.x)+Math.abs(z.y)>5e-4?(C.setViewOffset(y.width,y.height,z.x*y.width,z.y*y.height,y.width,y.height),z.active=!0):z.active?(C.clearViewOffset(),z.active=!1):C.updateProjectionMatrix()}),null}const gr=({route:e})=>{const o=dr(e),t=g.useMemo(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,[]);return b.jsxs(Ha,{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:-1,background:"#02030a"},dpr:[1,1.5],camera:{position:[0,0,10],fov:Et,far:5e3},children:[b.jsx(fr,{mode:o}),b.jsx(ws,{reducedMotion:t}),b.jsx(Wn,{mode:o}),b.jsx(Hs,{}),b.jsx(cr,{}),o==="home"&&b.jsx(Gn,{position:[0,-36,-120]}),b.jsx(Rs,{intensityRef:Qe})]})};export{gr as default};
