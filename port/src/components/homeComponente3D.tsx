import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Sky, Stars, OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import Moon from './moon2';

function CloudWithLoop({ position, opacity, color }: { position: [number, number, number], opacity: number, color: string }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.z -= 2;
      if (ref.current.position.z < -900) {
        ref.current.position.z = 300;
      }
    }
  });

  const scaleRandom = Math.random() * 2 + 40;
  return (
    <Cloud ref={ref} position={position} scale={[scaleRandom, scaleRandom, scaleRandom]} speed={0.1} opacity={opacity} color={color} />
  );
}

const getTimePreset = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 16) {
    return { sunPosition: [1, 0.05, 0], turbidity: 10, rayleigh: 3, mieCoefficient: 0.005, mieDirectionalG: 0.7 };
  } else if (hour >= 16 && hour < 21) {
    return { sunPosition: [-1, 0.01, -0.1], turbidity: 32, rayleigh: 1.3, mieCoefficient: 0.01, mieDirectionalG: 0.8 };
  } else {
    return { sunPosition: [0, -1, -1], turbidity: 10, rayleigh: 0.5, mieCoefficient: 0.005, mieDirectionalG: 0.7 };
  }
};

const isNight = () => {
  const hour = new Date().getHours();
  return hour >= 21 || hour < 6;
};

const isAfternoon = () => { 
  const hour = new Date().getHours();
  return hour >= 16 && hour < 21;
};

function Scene({ cameraRef }: { cameraRef: React.RefObject<THREE.PerspectiveCamera> }) {
  const night = isNight();
  const afternoon = isAfternoon();
  
  const { sunPosition, turbidity, rayleigh, mieCoefficient, mieDirectionalG } = getTimePreset();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cameraRef.current) {
        const { clientX: x, clientY: y } = event;
        const width = window.innerWidth;
        const height = window.innerHeight;

        const ndcX = (x / width) * 2 - 1;
        const ndcY = -(y / height) * 2 + 1;

        cameraRef.current.position.x = ndcX * 0.5;
        cameraRef.current.position.y = ndcY * 0.5;
        cameraRef.current.lookAt(0, 0, 0);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cameraRef]);

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
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
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
      {afternoon ? (
        <>
          <CloudWithLoop position={[900,22, 800]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[-100, -444, 700]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[300, -100, 600]} opacity={0.1} color="#FBD296" />
          <CloudWithLoop position={[-100, 55, 500]} opacity={0.3} color="#FBD296" />
          <CloudWithLoop position={[150, -250, 400]} opacity={0.1} color="#FBD296" />
          <CloudWithLoop position={[-155, 100, 500]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[-300, -44, 300]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[250, -320, 600]} opacity={0.1} color="#FBD296" />
          <CloudWithLoop position={[-420, 155, 200]} opacity={0.3} color="#FBD296" />
          <CloudWithLoop position={[900, 0, 800]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[-100, -44, 700]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[300, -320, 600]} opacity={0.1} color="#FBD296" />
          <CloudWithLoop position={[-100, 55, 500]} opacity={0.3} color="#FBD296" />
          <CloudWithLoop position={[150, -250, 400]} opacity={0.1} color="#FBD296" />
          <CloudWithLoop position={[-155, 500, 500]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[-300, -44, 300]} opacity={0.2} color="#FBD296" />
          <CloudWithLoop position={[250, -32, 600]} opacity={0.1} color="#FBD296" />
          <CloudWithLoop position={[-420, 55, 200]} opacity={0.3} color="#FBD296" />
        </>
      ) : (
        <>
          <CloudWithLoop position={[-150, 220, 800]} opacity={0.2} color="#FAEEEE" />
          <CloudWithLoop position={[322, -440, 700]} opacity={0.2} color="#FAEEEE" />
          <CloudWithLoop position={[250, -320, 600]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[-420, 550, 500]} opacity={0.3} color="#FAEEEE" />
          <CloudWithLoop position={[300, -125, 400]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[220, 540, 300]} opacity={0.4} color="#FAEEEE" />
          <CloudWithLoop position={[-100, 132, 200]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[382, 110, 700]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[751, -110, 600]} opacity={0.2} color="#FAEEEE" />
          <CloudWithLoop position={[-243, 205, 500]} opacity={0.5} color="#FAEEEE" />
          <CloudWithLoop position={[30, -115, 400]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[430, 10, 300]} opacity={0.9} color="#FAEEEE" />
          <CloudWithLoop position={[-150, 0, 800]} opacity={0.2} color="#FAEEEE" />
          <CloudWithLoop position={[82, -44, 700]} opacity={0.2} color="#FAEEEE" />
          <CloudWithLoop position={[235, -132, 600]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[-412, 55, 500]} opacity={0.3} color="#FAEEEE" />
          <CloudWithLoop position={[65, -225, 400]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[222, 150, 300]} opacity={0.4} color="#FAEEEE" />
          <CloudWithLoop position={[-100, 32, 200]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[82, 120, 700]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[320, -110, 600]} opacity={0.2} color="#FAEEEE" />
          <CloudWithLoop position={[-182, 5, 500]} opacity={0.5} color="#FAEEEE" />
          <CloudWithLoop position={[310, -415, 400]} opacity={0.1} color="#FAEEEE" />
          <CloudWithLoop position={[432, 150, 300]} opacity={0.9} color="#FAEEEE" />
        </>
      )}
    </>
  );
}

const HomeComponent3D: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        opacity: 1,
        filter: 'brightness(90%)'
      }}
      camera={{ position: [0, 0, 10], fov: 75 }}
      onCreated={({ camera }) => {
        cameraRef.current = camera as THREE.PerspectiveCamera;
      }}
    >
      <Scene cameraRef={cameraRef} />
    </Canvas>
  );
};

export default HomeComponent3D;
