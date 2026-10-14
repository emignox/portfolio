import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import { useRef, useEffect } from "react";
import Moon from "./moon2";
import GenerateClouds from "./clouds";
import FloatingRocket from "./FloatingRocket";
import Text3DFullstack from "./Text3DFullstack";

const getTimePreset = () => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 16) {
    return {
      sunPosition: [1, 0.05, 0],
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
    };
  } else if (hour >= 16 && hour < 21) {
    return {
      sunPosition: [5, 0.01, -0.1],
      turbidity: 32,
      rayleigh: 30,
      mieCoefficient: 0.01,
      mieDirectionalG: 0.8,
    };
  } else {
    return {
      sunPosition: [0, -1, -1],
      turbidity: 10,
      rayleigh: 0.5,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
    };
  }
};

const isNight = () => {
  const hour = new Date().getHours();
  return hour >= 21 || hour < 6;
};

function Scene() {
  const night = isNight();

  const { sunPosition, turbidity, rayleigh, mieCoefficient, mieDirectionalG } =
    getTimePreset();

  // Parallasse leggero della camera col mouse (target in coordinate normalizzate)
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

  useFrame(({ camera }) => {
    camera.position.x += (pointer.current.x * 0.5 - camera.position.x) * 0.08;
    camera.position.y += (pointer.current.y * 0.5 - camera.position.y) * 0.08;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <Sky
        sunPosition={sunPosition as [number, number, number]}
        azimuth={0.25}
        inclination={0.6}
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={mieCoefficient}
        mieDirectionalG={mieDirectionalG}
      />
      <ambientLight intensity={night ? 1 : 1.9} />

      {/* Razzo che fluttua nel cielo, a riposo sopra il titolo */}
      <FloatingRocket position={[0, 10, -60]} scale={2.2} restHeight={0.48} />

      {/* Testo 3D "Fullstack Developer" - più distante del razzo */}
      <Text3DFullstack position={[0, 10, -120]} />

      {night && (
        <>
          <Stars
            radius={300}
            depth={50}
            count={500}
            factor={20}
            saturation={1}
            fade
          />
          <Moon />
        </>
      )}
      <GenerateClouds count={20} />
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
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 75, far: 5000 }}
    >
      <Scene />
    </Canvas>
  );
};

export default HomeComponent3D;
