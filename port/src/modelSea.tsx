import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Environment } from "@react-three/drei";
import { MathUtils, Vector3 } from "three";
import Model from "./components/model3D";

const getTimePreset = (): "dawn" | "sunset" | "forest" => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return "dawn";
  } else if (hour >= 12 && hour < 21) {
    return "sunset";
  } else {
    return "forest";
  }
};

// Camera di base per ogni rotta (guarda sempre verso +X, sul mare)
const CAMERA_BASE: Record<string, [number, number, number]> = {
  "/about": [0, 85, 48],
  "/scroll": [0, 12, 100],
};
const DEFAULT_BASE: [number, number, number] = [0, 15, 50];
const MIN_CAMERA_Y = 4; // mai sotto il livello dell'acqua

const getBase = (path: string) => CAMERA_BASE[path] ?? DEFAULT_BASE;

// Camera: transizione morbida tra le rotte + leggero parallax del mouse
// + lenta oscillazione laterale (sostituisce OrbitControls/CameraSetup che
// si combattevano a vicenda e portavano la camera sotto l'acqua).
const CameraRig = ({ path }: { path: string }) => {
  const camera = useThree((s) => s.camera);
  const base = useRef(new Vector3(...getBase(path)));
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const look = useRef(new Vector3(500, 0, 0));
  const first = useRef(true);

  useEffect(() => {
    base.current.set(...getBase(path));
  }, [path]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }, delta) => {
    if (first.current) {
      camera.position.copy(base.current);
      first.current = false;
    }
    const k = 1 - Math.exp(-delta * 3); // lerp indipendente dal framerate
    smooth.current.x = MathUtils.lerp(smooth.current.x, mouse.current.x, k);
    smooth.current.y = MathUtils.lerp(smooth.current.y, mouse.current.y, k);

    const sway = Math.sin(clock.elapsedTime * 0.2) * 12;
    const tx = base.current.x + sway + smooth.current.x * 8;
    const ty = Math.max(MIN_CAMERA_Y, base.current.y + smooth.current.y * 4);
    camera.position.x = MathUtils.lerp(camera.position.x, tx, k);
    camera.position.y = MathUtils.lerp(camera.position.y, ty, k);
    camera.position.z = MathUtils.lerp(camera.position.z, base.current.z, k);

    look.current.set(500 + smooth.current.x * 10, smooth.current.y * 10, 0);
    camera.lookAt(look.current);
  });

  return null;
};

// Se l'HDR dell'environment (CDN esterno) non carica, la scena resta comunque visibile
class SafeBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("ModelSea: environment non disponibile", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function ModelSea() {
  const { pathname } = useLocation();

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: getBase(pathname), fov: 75, near: 1, far: 1000 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <ambientLight intensity={1} />
        <CameraRig path={pathname} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <SafeBoundary>
          <Suspense fallback={null}>
            <Environment preset={getTimePreset()} />
          </Suspense>
        </SafeBoundary>
      </Canvas>
      {/* Velo scuro leggero: mantiene leggibile il testo bianco del 2D sopra il mare chiaro */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(6,10,28,0.45), rgba(6,10,28,0.3))",
        }}
      />
    </>
  );
}
export default ModelSea;
