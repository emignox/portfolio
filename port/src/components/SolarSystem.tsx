import React, { useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LineMaterial, LineSegments2, LineSegmentsGeometry } from "three-stdlib";
import { Planet, Sun, PlanetKind } from "../space/planets";
import { projects } from "./project-data";
import { beltShape, sunWorld } from "../space/director";
import type { SpaceMode } from "../space/director";

// Il mio lavoro come sistema solare: il sole e' lo stack, i pianeti sono i prodotti
// (in ordine reale: Terra, Marte, Giove, Saturno, Urano, Nettuno), Odoo e' Saturno
// con le integrazioni come lune, le tecnologie trasversali sono stelle di una costellazione.

type Cat = "core" | "product" | "erp" | "stack";

const CAT_NAME: Record<Cat, string> = {
  core: "The core",
  product: "Product",
  erp: "Odoo & integrations",
  stack: "Stack",
};
const CAT_DOT: Record<Cat, string> = {
  core: "#fcd34d",
  product: "#fdba74",
  erp: "#5eead4",
  stack: "#c7d2fe",
};

const liveLink = (title: string) => projects.find((p) => p.title === title)?.link;

interface PlanetDef {
  id: string;
  label: string;
  cat: "product" | "erp";
  kind: PlanetKind;
  desc: string;
  link?: string;
  radius: number;
  // semiasse dell'orbita come frazione della meta' larghezza visibile
  orbit: number;
  phase: number;
  uses: string[];
  tilt?: number;
}

const PLANETS: PlanetDef[] = [
  {
    id: "nemei",
    label: "Nemei",
    cat: "product",
    kind: "earth",
    desc: "AI fitness and nutrition platform: workouts, macros, food recognition.",
    link: liveLink("Nemei App"),
    radius: 2.9,
    orbit: 0.26,
    phase: 0.6,
    uses: ["python", "ml", "postgres", "stripe", "llm"],
    tilt: 0.41,
  },
  {
    id: "ep",
    label: "EP Sportwear",
    cat: "product",
    kind: "mars",
    desc: "E-commerce for seamless activewear. Live and selling.",
    link: liveLink("EP Sportwear"),
    radius: 2.4,
    orbit: 0.37,
    phase: 2.7,
    uses: [],
    tilt: 0.44,
  },
  {
    id: "reader",
    label: "Reader",
    cat: "product",
    kind: "jupiter",
    desc: "Reading app where the AI assistant lives inside the text.",
    link: liveLink("Reader"),
    radius: 4.6,
    orbit: 0.5,
    phase: 4.5,
    uses: ["llm"],
    tilt: 0.05,
  },
  {
    id: "odoo",
    label: "Odoo ERP",
    cat: "erp",
    kind: "saturn",
    desc: "Custom Odoo modules for billing, accounting workflows, API integrations and treasury.",
    radius: 4.0,
    orbit: 0.63,
    phase: 1.2,
    uses: ["python", "postgres", "owl"],
    tilt: 0.47,
  },
  {
    id: "radar",
    label: "Immoweb Radar",
    cat: "product",
    kind: "uranus",
    desc: "PWA that filters new Belgian listings and computes real costs.",
    link: liveLink("Immoweb Radar"),
    radius: 3.1,
    orbit: 0.77,
    phase: 3.6,
    uses: [],
    tilt: 1.7,
  },
  {
    id: "piano",
    label: "Piano Trainer",
    cat: "product",
    kind: "neptune",
    desc: "Learn to read music with daily practice built around your level.",
    link: liveLink("Piano Trainer"),
    radius: 3.1,
    orbit: 0.9,
    phase: 5.5,
    uses: [],
    tilt: 0.49,
  },
];

// Integrazioni Odoo: lune di Saturno
interface MoonDef {
  id: string;
  label: string;
  desc: string;
  radius: number;
  distance: number;
  speed: number;
  phase: number;
}

const MOONS: MoonDef[] = [
  {
    id: "billing",
    label: "Usage-based billing",
    desc: "Turns metered usage records into orders and invoices with tariff, cap and VAT rules.",
    radius: 0.85,
    distance: 9,
    speed: 0.46,
    phase: 0.3,
  },
  {
    id: "api",
    label: "API integrations",
    desc: "JSON-2 API endpoints, a rejected-record replay queue and legacy flat-file order imports.",
    radius: 0.7,
    distance: 11,
    speed: 0.36,
    phase: 2.0,
  },
  {
    id: "forecast",
    label: "Cash-flow forecasting",
    desc: "Treasury forecast engine with OWL/Chart.js dashboards, payment-term schedules and alerts.",
    radius: 0.8,
    distance: 13,
    speed: 0.29,
    phase: 3.7,
  },
  {
    id: "approval",
    label: "Vendor bill approval",
    desc: "Blocks vendor bill payment until lines match the PO or routed approvals are done.",
    radius: 0.6,
    distance: 15,
    speed: 0.23,
    phase: 5.2,
  },
];

// Tecnologie trasversali: stelle in due costellazioni ai lati del titolo
interface StarDef {
  id: string;
  label: string;
  desc: string;
  land: [number, number];
  port: [number, number];
}

const STARS: StarDef[] = [
  {
    id: "python",
    label: "Python",
    desc: "FastAPI backends, Odoo modules and ML pipelines.",
    land: [-0.84, -0.2],
    port: [-0.8, -0.08],
  },
  {
    id: "ml",
    label: "scikit-learn",
    desc: "Random Forest models for personalised workout generation.",
    land: [-0.68, -0.47],
    port: [-0.5, -0.2],
  },
  {
    id: "stripe",
    label: "Stripe",
    desc: "Subscriptions, recurring billing and webhook-driven events.",
    land: [-0.86, -0.74],
    port: [-0.8, -0.52],
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    desc: "Schema design and query optimisation for products and ERP.",
    land: [0.84, -0.2],
    port: [0.8, -0.08],
  },
  {
    id: "llm",
    label: "LLM APIs",
    desc: "Claude and Gemini running inside production features.",
    land: [0.68, -0.47],
    port: [0.5, -0.2],
  },
  {
    id: "owl",
    label: "OWL · QWeb",
    desc: "Odoo frontend components, PDF reports and templates.",
    land: [0.86, -0.74],
    port: [0.8, -0.52],
  },
];

const CONSTELLATION: [string, string][] = [
  ["python", "ml"],
  ["ml", "stripe"],
  ["python", "stripe"],
  ["postgres", "llm"],
  ["llm", "owl"],
  ["postgres", "owl"],
];

const starIndex = (id: string) => STARS.findIndex((s) => s.id === id);

// Tutto cio' che si puo' indicare col mouse, in un unico elenco
type Pick =
  | { type: "sun" }
  | { type: "planet"; i: number }
  | { type: "moon"; i: number }
  | { type: "star"; i: number };

const PICKS: Pick[] = [
  { type: "sun" },
  ...PLANETS.map((_, i) => ({ type: "planet" as const, i })),
  ...MOONS.map((_, i) => ({ type: "moon" as const, i })),
  ...STARS.map((_, i) => ({ type: "star" as const, i })),
];
const pickOfPlanet = (i: number) => 1 + i;
const ODOO = PLANETS.findIndex((p) => p.id === "odoo");

// true mentre il mouse indica qualcosa: la camera si ferma, cosi' il pianeta non scivola via
export const cameraHold = { current: false };

// posizioni vive dei pianeti, lette dal regista della camera per i voli
export const planetRegistry = new Map<string, { pos: THREE.Vector3; radius: number; ringed: boolean }>();
// luce virtuale che illumina i pianeti (la camera si mette dal lato illuminato)
export const systemLight = new THREE.Vector3(0, 28, -20);

// il layout del sistema non dipende dalla camera (che vola): riferimento fisso
const REF_Z = 10;
const REF_FOV = 75;

const SUN_Z = -75;
const STAR_Z = -95;
const ORBIT_POINTS = 128;
const INTERACTIVE = "button, a, input, textarea, nav";

interface Info {
  cat: Cat;
  label: string;
  desc: string;
  link?: string;
  lines: { title: string; items: string[] }[];
}

function infoOf(p: Pick): Info {
  if (p.type === "sun")
    return {
      cat: "core",
      label: "React · Next.js · FastAPI",
      desc: "The full-stack core every product orbits around.",
      lines: [{ title: "Orbiting", items: PLANETS.map((pl) => pl.label) }],
    };
  if (p.type === "planet") {
    const pl = PLANETS[p.i];
    const stack = pl.uses.map((id) => STARS[starIndex(id)].label);
    const moons = pl.id === "odoo" ? MOONS.map((m) => m.label) : [];
    return {
      cat: pl.cat,
      label: pl.label,
      desc: pl.desc,
      link: pl.link,
      lines: [
        { title: "Moons", items: moons },
        { title: "Built with", items: stack },
      ].filter((l) => l.items.length > 0),
    };
  }
  if (p.type === "moon") {
    const m = MOONS[p.i];
    return { cat: "erp", label: m.label, desc: m.desc, lines: [{ title: "Orbits", items: ["Odoo ERP"] }] };
  }
  const s = STARS[p.i];
  return {
    cat: "stack",
    label: s.label,
    desc: s.desc,
    lines: [
      { title: "Used in", items: PLANETS.filter((pl) => pl.uses.includes(s.id)).map((pl) => pl.label) },
    ].filter((l) => l.items.length > 0),
  };
}

// texture morbide generate su canvas (niente immagini da scaricare)
function canvasTexture(draw: (ctx: CanvasRenderingContext2D, s: number) => void, size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

const SolarSystem: React.FC<{ mode?: SpaceMode }> = ({ mode = "home" }) => {
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const { camera, size } = useThree();
  const [hovered, setHovered] = useState(-1);

  const reduceMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // ---- refs condivisi con i materiali dei pianeti
  const sunRef = useRef(new THREE.Vector3(0, 20, SUN_Z));
  // luce dei pianeti: parte dal sole ma spostata verso la camera, cosi' i pianeti
  // sul lato vicino dell'orbita non si vedono solo dal lato notturno
  const lightRef = useRef(new THREE.Vector3(0, 28, SUN_Z + 55));
  const sunIntensity = useRef(reduceMotion ? 1 : 0);
  const planetFx = useMemo(
    () => PLANETS.map(() => ({ highlight: { current: 0 }, dim: { current: 1 } })),
    []
  );
  const moonFx = useMemo(
    () => MOONS.map(() => ({ highlight: { current: 0 }, dim: { current: 1 } })),
    []
  );

  // ---- oggetti della scena
  const sunGroup = useRef<THREE.Group>(null);
  const planetGroups = useRef<(THREE.Group | null)[]>([]);
  const moonGroups = useRef<(THREE.Group | null)[]>([]);
  const starGroups = useRef<(THREE.Group | null)[]>([]);
  const starSprites = useRef<(THREE.Sprite | null)[]>([]);
  const hits = useRef<(THREE.Mesh | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  // ---- stato dell'animazione
  const start = useRef(-1);
  const tau = useRef(0);
  const rate = useRef(1);
  const hoverRef = useRef(-1);
  const pinUntil = useRef(0);
  const lastActivity = useRef(0);
  const relProgress = useRef(0);
  const lastHot = useRef(-2);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const planetPos = useRef(PLANETS.map(() => new THREE.Vector3()));
  const moonPos = useRef(MOONS.map(() => new THREE.Vector3()));
  const starPos = useRef(STARS.map(() => new THREE.Vector3()));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    PLANETS.forEach((pl, i) =>
      planetRegistry.set(pl.id, {
        pos: planetPos.current[i],
        radius: pl.radius,
        ringed: pl.kind === "saturn",
      })
    );
    return () => PLANETS.forEach((pl) => planetRegistry.delete(pl.id));
  }, []);

  // ---- texture
  const glowTex = useMemo(
    () =>
      canvasTexture((ctx, s) => {
        const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.18, "rgba(255,255,255,0.55)");
        g.addColorStop(0.45, "rgba(255,255,255,0.12)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
      }),
    []
  );
  const spikeTex = useMemo(
    () =>
      canvasTexture((ctx, s) => {
        const c = s / 2;
        for (const [w, h] of [
          [s, 3],
          [3, s],
        ]) {
          const g = ctx.createRadialGradient(c, c, 0, c, c, c);
          g.addColorStop(0, "rgba(255,255,255,0.9)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(c - w / 2, c - h / 2, w, h);
        }
      }, 256),
    []
  );

  // ---- orbite (una linea chiusa per pianeta)
  const orbits = useMemo(
    () =>
      PLANETS.map(() => {
        const g = new THREE.BufferGeometry();
        const a = new THREE.BufferAttribute(new Float32Array(ORBIT_POINTS * 3), 3);
        a.setUsage(THREE.DynamicDrawUsage);
        g.setAttribute("position", a);
        const m = new THREE.LineBasicMaterial({
          color: "#c7d2fe",
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const line = new THREE.LineLoop(g, m);
        line.frustumCulled = false;
        return line;
      }),
    []
  );

  // ---- costellazione (fissa) e linee di relazione (evidenziate, spesse)
  const constellation = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(CONSTELLATION.length * 6), 3)
    );
    const m = new THREE.LineBasicMaterial({
      color: "#c7d2fe",
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const l = new THREE.LineSegments(g, m);
    l.frustumCulled = false;
    return l;
  }, []);

  const MAX_REL = 8;
  const relation = useMemo(() => {
    const g = new LineSegmentsGeometry();
    g.setPositions(new Float32Array(MAX_REL * 6));
    const m = new LineMaterial({
      color: 0xe0e7ff,
      linewidth: 1.6,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const l = new LineSegments2(g, m);
    l.frustumCulled = false;
    return l;
  }, []);

  useEffect(() => {
    relation.material.resolution.set(size.width, size.height);
  }, [relation, size]);

  useEffect(
    () => () => {
      glowTex.dispose();
      spikeTex.dispose();
      orbits.forEach((o) => {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
      constellation.geometry.dispose();
      (constellation.material as THREE.Material).dispose();
      relation.geometry.dispose();
      relation.material.dispose();
    },
    [glowTex, spikeTex, orbits, constellation, relation]
  );

  // ---- puntatore: il canvas sta dietro la pagina, quindi il "picking" e' fatto a mano
  const pick = (clientX: number, clientY: number) => {
    ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const meshes = hits.current.filter(Boolean) as THREE.Mesh[];
    const found = raycaster.intersectObjects(meshes, false)[0];
    return found ? (found.object.userData.pick as number) : -1;
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      pointer.current.active = !target?.closest(INTERACTIVE);
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      lastActivity.current = performance.now();
    };
    const onLeave = () => {
      pointer.current.active = false;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) return;
      const i = pick(e.clientX, e.clientY);
      if (i < 0) return;
      lastActivity.current = performance.now();
      const picked = PICKS[i];
      if (picked.type === "planet" && PLANETS[picked.i].link) {
        // si vola sul pianeta: la pagina Projects si apre su quel progetto
        window.location.hash = `#/scroll?p=${PLANETS[picked.i].id}`;
      } else {
        // su touch la scheda resta aperta qualche secondo
        pinUntil.current = performance.now() + 3500;
        hoverRef.current = i;
        setHovered(i);
      }
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
      document.body.style.cursor = "";
      cameraHold.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // relazioni dell'elemento evidenziato: elenco di indici in PICKS
  const relatedOf = useMemo(
    () =>
      PICKS.map((p): number[] => {
        if (p.type === "sun") return PLANETS.map((_, i) => pickOfPlanet(i));
        if (p.type === "planet") {
          const pl = PLANETS[p.i];
          const stars = pl.uses.map((id) => 1 + PLANETS.length + MOONS.length + starIndex(id));
          const moons = pl.id === "odoo" ? MOONS.map((_, m) => 1 + PLANETS.length + m) : [];
          return [...stars, ...moons];
        }
        if (p.type === "moon") return [pickOfPlanet(ODOO), ...MOONS.map((_, m) => 1 + PLANETS.length + m)];
        const id = STARS[p.i].id;
        return PLANETS.flatMap((pl, i) => (pl.uses.includes(id) ? [pickOfPlanet(i)] : []));
      }),
    []
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  const worldOf = (pi: number, out: THREE.Vector3) => {
    const p = PICKS[pi];
    if (p.type === "sun") return out.copy(sunRef.current);
    if (p.type === "planet") return out.copy(planetPos.current[p.i]);
    if (p.type === "moon") return out.copy(moonPos.current[p.i]);
    return out.copy(starPos.current[p.i]);
  };

  useFrame(({ clock }, delta) => {
    const now = clock.getElapsedTime();
    if (start.current < 0) start.current = now;
    const t = reduceMotion ? 100 : now - start.current;
    const cam = camera as THREE.PerspectiveCamera;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(REF_FOV / 2));
    const home = modeRef.current === "home";
    const portrait = cam.aspect < 0.85;

    // ---- hover (o tour automatico quando nessuno muove il mouse)
    const ms = performance.now();
    if (ms > pinUntil.current) {
      const i = home && pointer.current.active ? pick(pointer.current.x, pointer.current.y) : -1;
      if (i !== hoverRef.current) {
        hoverRef.current = i;
        setHovered(i);
        document.body.style.cursor = i >= 0 && infoOf(PICKS[i]).link ? "pointer" : "";
      }
    }
    const hUser = hoverRef.current;
    cameraHold.current = home && hUser >= 0;
    let hTour = -1;
    if (home && hUser < 0 && !reduceMotion && t > 5 && ms - lastActivity.current > 5000) {
      hTour = pickOfPlanet(Math.floor((t - 5) / 3.6) % PLANETS.length);
    }
    const h = hUser >= 0 ? hUser : hTour;
    const dimLevel = hUser >= 0 ? 0.38 : 0.72;
    const isRelated = (pi: number) => h >= 0 && (pi === h || relatedOf[h].includes(pi));

    // ---- tempo: rallenta quando si indica qualcosa (piu' facile cliccare)
    const wantRate = hUser >= 0 ? 0.1 : home ? 1 : 0.35;
    rate.current += (wantRate - rate.current) * (1 - Math.exp(-delta * 4));
    if (!reduceMotion) tau.current += delta * rate.current;

    // ---- sole
    const distSun = REF_Z - SUN_Z;
    const halfH = distSun * tanHalf;
    const halfW = halfH * cam.aspect;
    sunRef.current.set(0, halfH * (portrait ? 0.36 : 0.4), SUN_Z);
    sunGroup.current?.position.copy(sunRef.current);
    lightRef.current.set(sunRef.current.x, sunRef.current.y + 8, SUN_Z + 55);
    systemLight.copy(lightRef.current);
    sunWorld.x = sunRef.current.x;
    sunWorld.y = sunRef.current.y;
    sunWorld.z = sunRef.current.z;
    // fascia di asteroidi tra l'orbita di Marte e quella di Giove
    const ba = 0.435 * halfW * (portrait ? 1.08 : 0.95);
    beltShape.cx = sunRef.current.x;
    beltShape.cy = sunRef.current.y;
    beltShape.cz = SUN_Z;
    beltShape.a = ba;
    beltShape.b = ba * (portrait ? 0.85 : 0.36);
    beltShape.d = Math.min(ba * 0.45, 28);
    beltShape.appear = easeOut((t - 1.6) / 2);
    sunIntensity.current = easeOut(t / 1.6);

    // ---- pianeti su orbite ellittiche in prospettiva
    const fx = (pi: number, target: number, ref: { current: number }, k = 0.12) => {
      ref.current += (target - ref.current) * k;
      return pi;
    };
    PLANETS.forEach((pl, i) => {
      const appear = easeOut((t - 0.7 - i * 0.2) / 1.8);
      // su mobile le orbite sono quasi circolari: usano l'altezza dello schermo
      const a = pl.orbit * halfW * (portrait ? 1.08 : 0.95) * appear;
      const b = a * (portrait ? 0.85 : 0.36);
      const d = Math.min(a * 0.45, 28);
      const omega = 0.26 * Math.pow(0.26 / pl.orbit, 1.5);
      const th = pl.phase + tau.current * omega;
      const p = planetPos.current[i];
      p.set(sunRef.current.x + a * Math.cos(th), sunRef.current.y - b * Math.sin(th), SUN_Z + d * Math.sin(th));
      const g = planetGroups.current[i];
      if (g) {
        g.position.copy(p);
        g.scale.setScalar(Math.max(appear, 0.001));
      }

      const pi = pickOfPlanet(i);
      const self = h === pi;
      const rel = isRelated(pi);
      fx(pi, self ? (hUser >= 0 ? 0.6 : 0.25) : rel ? 0.2 : 0, planetFx[i].highlight);
      fx(pi, h < 0 || rel ? 1 : dimLevel, planetFx[i].dim);

      // orbita disegnata con la stessa ellisse
      const attr = orbits[i].geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < ORBIT_POINTS; k++) {
        const u = (k / ORBIT_POINTS) * Math.PI * 2;
        attr.setXYZ(
          k,
          sunRef.current.x + a * Math.cos(u),
          sunRef.current.y - b * Math.sin(u),
          SUN_Z + d * Math.sin(u)
        );
      }
      attr.needsUpdate = true;
      const om = orbits[i].material as THREE.LineBasicMaterial;
      const orbitTarget = !home
        ? 0.07
        : h < 0 ? 0.16 : self || PICKS[h].type === "sun" ? 0.55 : rel ? 0.3 : 0.06;
      om.opacity += (orbitTarget * appear - om.opacity) * 0.12;
    });

    // ---- lune di Saturno (integrazioni Odoo)
    const saturn = planetPos.current[ODOO];
    const moonScale = Math.min(1, Math.max(0.45, halfW / 94));
    MOONS.forEach((m, i) => {
      const th = m.phase + tau.current * m.speed;
      const p = moonPos.current[i];
      const appear = easeOut((t - 2.2 - i * 0.25) / 1.2);
      p.set(
        saturn.x + Math.cos(th) * m.distance * moonScale * appear,
        saturn.y + Math.sin(th) * m.distance * moonScale * 0.28 * appear,
        saturn.z + Math.sin(th) * m.distance * moonScale * 0.7 * appear
      );
      const g = moonGroups.current[i];
      if (g) {
        g.position.copy(p);
        g.scale.setScalar(Math.max(appear, 0.001));
      }
      const pi = 1 + PLANETS.length + i;
      fx(pi, h === pi ? 0.6 : isRelated(pi) ? 0.3 : 0, moonFx[i].highlight);
      fx(pi, h < 0 || isRelated(pi) ? 1 : dimLevel, moonFx[i].dim);
    });

    // ---- stelle della costellazione
    const distStar = REF_Z - STAR_Z;
    const sH = distStar * tanHalf;
    const sW = sH * cam.aspect;
    STARS.forEach((s, i) => {
      const lay = portrait ? s.port : s.land;
      const p = starPos.current[i];
      p.set(lay[0] * sW * 0.94, lay[1] * sH * 0.94, STAR_Z);
      starGroups.current[i]?.position.copy(p);
      const pi = 1 + PLANETS.length + MOONS.length + i;
      const appear = easeOut((t - 1.4 - i * 0.12) / 1);
      const twinkle = reduceMotion ? 1 : 0.85 + 0.15 * Math.sin(now * 2.3 + i * 1.9);
      const boost = h === pi ? 1.6 : isRelated(pi) ? 1.35 : h >= 0 ? 0.75 : 1;
      starSprites.current[i]?.scale.setScalar(2.4 * twinkle * boost * appear * (home ? 1 : 0) + 0.001);
    });

    // ---- linee della costellazione
    const cAttr = constellation.geometry.getAttribute("position") as THREE.BufferAttribute;
    CONSTELLATION.forEach(([a, b], e) => {
      const pa = starPos.current[starIndex(a)];
      const pb = starPos.current[starIndex(b)];
      cAttr.setXYZ(e * 2, pa.x, pa.y, pa.z);
      cAttr.setXYZ(e * 2 + 1, pb.x, pb.y, pb.z);
    });
    cAttr.needsUpdate = true;
    const cm = constellation.material as THREE.LineBasicMaterial;
    cm.opacity += ((home ? (h >= 0 ? 0.12 : 0.22) : 0) * easeOut((t - 1.8) / 1.5) - cm.opacity) * 0.1;

    // ---- linee di relazione dell'elemento evidenziato (si disegnano verso l'esterno)
    if (h !== lastHot.current) {
      lastHot.current = h;
      relProgress.current = 0;
    }
    relProgress.current = Math.min(1, relProgress.current + delta * 2.2);
    const pr = easeOut(relProgress.current);
    const relArr = (relation.geometry.attributes.instanceStart as THREE.InterleavedBufferAttribute)
      .data;
    let n = 0;
    if (h >= 0 && PICKS[h].type !== "sun") {
      const from = worldOf(h, new THREE.Vector3());
      for (const r of relatedOf[h]) {
        if (n >= MAX_REL) break;
        // le lune si collegano gia' visivamente a Saturno: linee solo verso stelle e pianeti
        if (PICKS[r].type === "moon" && PICKS[h].type !== "moon") continue;
        worldOf(r, tmp);
        tmp.lerp(from, 1 - pr);
        relArr.array[n * 6] = from.x;
        relArr.array[n * 6 + 1] = from.y;
        relArr.array[n * 6 + 2] = from.z;
        relArr.array[n * 6 + 3] = tmp.x;
        relArr.array[n * 6 + 4] = tmp.y;
        relArr.array[n * 6 + 5] = tmp.z;
        n++;
      }
    }
    relArr.needsUpdate = true;
    relation.geometry.instanceCount = n;
    relation.material.opacity = hUser >= 0 ? 0.9 : 0.5;

    // ---- etichette: dissolvenza, attenuazione, lune visibili solo con Saturno
    PICKS.forEach((p, pi) => {
      const el = labels.current[pi];
      if (!el) return;
      const appear =
        p.type === "planet"
          ? easeOut((t - 1.2 - p.i * 0.2) / 1.2)
          : p.type === "star"
            ? easeOut((t - 1.6 - p.i * 0.12) / 1)
            : p.type === "sun"
              ? easeOut((t - 0.8) / 1)
              : 1;
      const base = h < 0 || isRelated(pi) ? 1 : dimLevel * 0.7;
      el.style.opacity = String(appear * base);
      const hide =
        !home ||
        (p.type === "moon" && h !== pi) ||
        (portrait && p.type === "star" && h !== pi && !isRelated(pi));
      el.style.visibility = hide ? "hidden" : "visible";
      if (hide) return;

      // se l'etichetta uscirebbe dal bordo, la sposto di lato quanto basta
      worldOf(pi, tmp).project(cam);
      const x = ((tmp.x + 1) / 2) * size.width;
      const half = el.offsetWidth / 2;
      let shift = 0;
      if (x - half < 8) shift = 8 - (x - half);
      else if (x + half > size.width - 8) shift = size.width - 8 - (x + half);
      el.style.transform = `translate(${Math.round(shift)}px, ${el.dataset.offset}px)`;
    });
  });

  // ---- render
  const pill =
    "whitespace-nowrap rounded-full border border-white/20 bg-slate-950/55 px-2.5 py-0.5 text-[10px] md:text-xs font-medium text-white backdrop-blur-md";
  const hitRef = (pi: number) => (el: THREE.Mesh | null) => {
    hits.current[pi] = el;
    if (el) el.userData.pick = pi;
  };
  const label = (pi: number, offset: number, align: "center" | "left" | "right" = "center") => {
    const info = infoOf(PICKS[pi]);
    const side =
      align === "right" ? "right-0" : align === "left" ? "left-0" : "left-1/2 -translate-x-1/2";
    return (
      <Html center zIndexRange={hovered === pi ? [30, 30] : [0, 0]} style={{ pointerEvents: "none" }}>
        <div
          ref={(el) => (labels.current[pi] = el)}
          className="relative select-none"
          data-offset={offset}
          style={{ transform: `translateY(${offset}px)`, opacity: 0 }}
        >
          <div className={pill}>
            <span
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
              style={{ background: CAT_DOT[info.cat] }}
            />
            {info.label}
            {info.link ? " ↗" : ""}
          </div>
          {hovered === pi && (
            <div
              className={`absolute top-full mt-2 w-60 rounded-2xl border border-white/15 bg-slate-950/75 p-3.5 text-left text-xs leading-snug text-white/90 shadow-2xl backdrop-blur-xl ${side}`}
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: CAT_DOT[info.cat] }} />
                {CAT_NAME[info.cat]}
              </div>
              <div className="text-sm font-semibold text-white">{info.label}</div>
              <p className="mt-1">{info.desc}</p>
              {info.lines.map((l) => (
                <p key={l.title} className="mt-2 text-[11px] text-white/60">
                  <span className="font-semibold text-white/75">{l.title}:</span> {l.items.join(" · ")}
                </p>
              ))}
              {info.link && (
                <span className="mt-2 block font-semibold text-white">
                  Click to fly there ↗
                </span>
              )}
            </div>
          )}
        </div>
      </Html>
    );
  };

  return (
    <group>
      {/* Sole: lo stack */}
      <group ref={sunGroup}>
        <Sun radius={5.8} intensityRef={sunIntensity} />
        <mesh ref={hitRef(0)}>
          <sphereGeometry args={[7.5, 12, 12]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        {label(0, 64)}
      </group>

      {orbits.map((o, i) => (
        <primitive key={`orbit-${i}`} object={o} />
      ))}

      {PLANETS.map((pl, i) => {
        const pi = pickOfPlanet(i);
        return (
          <group key={pl.id} ref={(el) => (planetGroups.current[i] = el)}>
            <Planet
              kind={pl.kind}
              radius={pl.radius}
              sunRef={lightRef}
              highlightRef={planetFx[i].highlight}
              dimRef={planetFx[i].dim}
              seed={i * 7.3 + 1}
              tilt={pl.tilt}
            />
            <mesh ref={hitRef(pi)}>
              <sphereGeometry args={[Math.max(pl.radius * (pl.kind === "saturn" ? 2 : 1.6), 3), 12, 12]} />
              <meshBasicMaterial visible={false} />
            </mesh>
            {label(pi, Math.round(pl.radius * 7 + 14))}
          </group>
        );
      })}

      {MOONS.map((m, i) => {
        const pi = 1 + PLANETS.length + i;
        return (
          <group key={m.id} ref={(el) => (moonGroups.current[i] = el)}>
            <Planet
              kind="moon"
              radius={m.radius}
              sunRef={lightRef}
              highlightRef={moonFx[i].highlight}
              dimRef={moonFx[i].dim}
              seed={40 + i * 3.1}
            />
            <mesh ref={hitRef(pi)}>
              <sphereGeometry args={[Math.max(m.radius * 2.5, 1.8), 10, 10]} />
              <meshBasicMaterial visible={false} />
            </mesh>
            {label(pi, Math.round(m.radius * 7 + 12))}
          </group>
        );
      })}

      <primitive object={constellation} />
      <primitive object={relation} />

      {STARS.map((s, i) => {
        const pi = 1 + PLANETS.length + MOONS.length + i;
        const right = s.land[0] > 0;
        return (
          <group key={s.id} ref={(el) => (starGroups.current[i] = el)}>
            <sprite ref={(el) => (starSprites.current[i] = el)}>
              <spriteMaterial
                map={glowTex}
                color="#e0e7ff"
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
            <sprite scale={9}>
              <spriteMaterial
                map={spikeTex}
                color="#c7d2fe"
                transparent
                opacity={0.55}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
            <mesh ref={hitRef(pi)}>
              <sphereGeometry args={[2.6, 10, 10]} />
              <meshBasicMaterial visible={false} />
            </mesh>
            {label(pi, 22, right ? "right" : "left")}
          </group>
        );
      })}
    </group>
  );
};

export default SolarSystem;
