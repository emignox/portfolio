import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SolarSystem, { cameraHold, planetRegistry, systemLight } from "../components/SolarSystem";
import Text3DFullstack from "../components/Text3DFullstack";
import { SpaceBackdrop } from "./SpaceBackdrop";
import { WarpStreaks } from "./WarpStreaks";
import { AsteroidBelt } from "./AsteroidBelt";
import { Comet } from "./Comet";
import { spaceFocus, warp, currentMode, SpaceMode } from "./director";

// Un unico universo per tutto il sito: cambiare pagina = volare nello spazio.

const HOME_LOOK = new THREE.Vector3(0, 0, -75);
const OVERVIEW_POS = new THREE.Vector3(58, 46, 2);
const OVERVIEW_LOOK = new THREE.Vector3(0, 12, -75);
// About: in alto a sinistra del sistema, si guarda verso lo spazio profondo
const ABOUT_POS = new THREE.Vector3(-34, 30, 18);
const ABOUT_DIR = new THREE.Vector3(-0.78, 0.22, -1).normalize();
const BASE_FOV = 75;

const modeOf = (route: string): SpaceMode =>
  route === "/" ? "home" : route === "/scroll" ? "projects" : "about";

function Director({ mode }: { mode: SpaceMode }) {
  const reduceMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const pointer = useRef({ x: 0, y: 0 });
  const look = useRef(HOME_LOOK.clone());
  const wantPos = useMemo(() => new THREE.Vector3(), []);
  const wantLook = useMemo(() => new THREE.Vector3(), []);
  const lastPos = useMemo(() => new THREE.Vector3(0, 0, 10), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(), []);
  const WORLD_UP = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const lightDir = useMemo(() => new THREE.Vector3(), []);
  const side = useMemo(() => new THREE.Vector3(), []);
  // spostamento dell'immagine (frazione di schermo): il pianeta resta sull'asse della camera,
  // quindi tondo, ma appare a sinistra (desktop) o in alto (mobile)
  const viewOff = useRef({ x: 0, y: 0, active: false });
  const entered = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, clock, size }, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const t = clock.getElapsedTime();
    currentMode.current = mode;

    // entrata: si arriva dallo spazio profondo in iperspazio e si frena davanti al sistema
    if (!entered.current) {
      entered.current = true;
      if (!reduceMotion) {
        cam.position.set(0, 10, 420);
        lastPos.copy(cam.position);
      }
    }
    const sway = reduceMotion ? 0 : 1;
    const px = pointer.current.x * sway;
    const py = pointer.current.y * sway;
    const portrait = cam.aspect < 0.85;

    if (mode === "home") {
      // vista d'insieme che segue il mouse e deriva piano; ferma mentre si indica un pianeta
      if (cameraHold.current) {
        wantPos.copy(cam.position);
      } else {
        wantPos.set(
          px * 4 + Math.sin(t * 0.07) * 2 * sway,
          py * 2.5 + Math.sin(t * 0.05 + 1) * 1.2 * sway,
          10
        );
      }
      wantLook.copy(HOME_LOOK);
    } else if (mode === "about") {
      // scorrendo la pagina si avanza nello spazio profondo
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const s = Math.min(1, Math.max(0, window.scrollY / max));
      wantPos.copy(ABOUT_POS).addScaledVector(ABOUT_DIR, s * 150);
      wantPos.x += px * 3;
      wantPos.y += py * 2;
      wantLook.copy(wantPos).addScaledVector(ABOUT_DIR, 100);
    } else {
      const focus = spaceFocus.current ? planetRegistry.get(spaceFocus.current) : undefined;
      if (focus) {
        // accanto al pianeta, dal lato illuminato, guardandolo dritto (resta tondo)
        const r = focus.radius * (focus.ringed ? 2.3 : 1);
        const p = focus.pos;
        // direzione della luce e una laterale: la camera sta a ~50 gradi dalla luce, cosi'
        // si vede il terminatore; la luce arriva dal lato della scheda (destra / basso)
        lightDir.copy(systemLight).sub(p).normalize();
        side.crossVectors(WORLD_UP, lightDir).normalize();
        tmp.copy(lightDir).multiplyScalar(0.64).addScaledVector(side, 0.77).normalize();
        // destra dello schermo vista da quella posizione: f x up = up x tmp
        right.crossVectors(WORLD_UP, tmp).normalize();
        if (right.dot(lightDir) < 0) {
          tmp.copy(lightDir).multiplyScalar(0.64).addScaledVector(side, -0.77).normalize();
        }
        tmp.y += 0.12;
        tmp.normalize();
        const tan = Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2));
        // desktop: diametro <= 42% dell'altezza e 30% della larghezza; mobile: 34% / 70%
        const maxH = portrait ? 0.34 : 0.42;
        const maxW = portrait ? 0.7 : 0.3;
        const dist = Math.max((2 * r) / (maxH * 2 * tan), (2 * r) / (maxW * 2 * tan * cam.aspect));
        wantPos.copy(p).addScaledVector(tmp, dist);
        wantLook.copy(p);
        fwd.copy(p).sub(wantPos).normalize();
        right.crossVectors(fwd, WORLD_UP).normalize();
        up.crossVectors(right, fwd).normalize();
        wantPos.addScaledVector(right, px * r * 0.25).addScaledVector(up, py * r * 0.2);
      } else {
        wantPos.copy(OVERVIEW_POS);
        wantPos.x += px * 3;
        wantPos.y += py * 2;
        wantLook.copy(OVERVIEW_LOOK);
      }
    }

    const offTarget =
      mode === "projects" ? (portrait ? { x: 0, y: 0.3 } : { x: 0.26, y: 0 }) : { x: 0, y: 0 };
    const ko = reduceMotion ? 1 : 1 - Math.exp(-delta * 2);
    viewOff.current.x += (offTarget.x - viewOff.current.x) * ko;
    viewOff.current.y += (offTarget.y - viewOff.current.y) * ko;

    // volo morbido verso la posizione voluta
    const k = reduceMotion ? 1 : 1 - Math.exp(-delta * 1.5);
    cam.position.lerp(wantPos, k);
    look.current.lerp(wantLook, reduceMotion ? 1 : 1 - Math.exp(-delta * 2.2));
    cam.lookAt(look.current);

    // iperspazio in base alla velocita' del volo
    const speed = delta > 0 ? cam.position.distanceTo(lastPos) / delta : 0;
    lastPos.copy(cam.position);
    const target = reduceMotion ? 0 : THREE.MathUtils.clamp((speed - 18) / 110, 0, 1);
    warp.current += (target - warp.current) * (1 - Math.exp(-delta * (target > warp.current ? 6 : 2.5)));
    cam.fov = BASE_FOV + warp.current * 14;
    const vo = viewOff.current;
    if (Math.abs(vo.x) + Math.abs(vo.y) > 0.0005) {
      cam.setViewOffset(size.width, size.height, vo.x * size.width, vo.y * size.height, size.width, size.height);
      vo.active = true;
    } else if (vo.active) {
      cam.clearViewOffset();
      vo.active = false;
    } else {
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

const Universe: React.FC<{ route: string }> = ({ route }) => {
  const mode = modeOf(route);
  const reduceMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        background: "#02030a",
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: BASE_FOV, far: 5000 }}
    >
      <Director mode={mode} />
      <SpaceBackdrop reducedMotion={reduceMotion} />
      <SolarSystem mode={mode} />
      <AsteroidBelt />
      <Comet />
      {mode === "home" && <Text3DFullstack position={[0, -36, -120]} />}
      <WarpStreaks intensityRef={warp} />
    </Canvas>
  );
};

export default Universe;
