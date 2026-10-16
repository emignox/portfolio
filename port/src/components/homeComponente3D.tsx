import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import SolarSystem, { cameraHold } from "./SolarSystem";
import Text3DFullstack from "./Text3DFullstack";
import { SpaceBackdrop } from "../space/SpaceBackdrop";

// Punto guardato dalla camera: il centro del sistema solare
const TARGET: [number, number, number] = [0, 0, -75];

function Scene() {
  const reduceMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Camera che segue il mouse e deriva piano: la profondita' dello spazio si sente
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener("pointermove", handlePointerMove);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useFrame(({ camera, clock }, delta) => {
    // mentre si indica un pianeta la camera resta ferma
    if (cameraHold.current) {
      camera.lookAt(...TARGET);
      return;
    }
    const t = clock.getElapsedTime();
    const drift = reduceMotion ? 0 : 1;
    const tx = pointer.current.x * 4 * drift + Math.sin(t * 0.07) * 2 * drift;
    const ty = pointer.current.y * 2.5 * drift + Math.sin(t * 0.05 + 1) * 1.2 * drift;
    const k = 1 - Math.exp(-delta * 2.5);
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.lookAt(...TARGET);
  });

  return (
    <>
      <SpaceBackdrop reducedMotion={reduceMotion} />

      {/* Il mio lavoro come sistema solare: stack, prodotti, Odoo, costellazioni */}
      <SolarSystem />

      {/* Titolo sotto il sistema solare */}
      <Text3DFullstack position={[0, -36, -120]} />
    </>
  );
}

const HomeComponent3D: React.FC = () => {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        opacity: 1,
        background: "#02030a",
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 75, far: 5000 }}
    >
      <Scene />
    </Canvas>
  );
};

export default HomeComponent3D;
