import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingRocketProps {
  position?: [number, number, number];
  scale?: number;
  // Altezza a riposo, come frazione della meta' dello schermo (0 = centro, 1 = bordo alto)
  restHeight?: number;
}

const FloatingRocket: React.FC<FloatingRocketProps> = ({
  position = [0, 30, -100],
  scale = 1,
  restHeight = 0.45,
}) => {
  const rocketRef = useRef<THREE.Group>(null);
  // Il mouse sta in un ref: aggiornare uno state a ogni mousemove faceva
  // ri-renderizzare tutto il razzo (decine di mesh) per niente.
  const mouse = useRef({ x: 0, y: 0 });
  const cursorWorldPos = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Listener per il movimento del mouse (o del dito su touch)
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      // Normalizza le coordinate tra -1 e 1
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Animazione di fluttuazione e inseguimento del mouse
  useFrame(({ clock, camera }) => {
    const rocket = rocketRef.current;
    if (!rocket) return;

    const time = clock.getElapsedTime();
    const { x: mx, y: my } = mouse.current;
    const cam = camera as THREE.PerspectiveCamera;

    // Dimensioni visibili sul piano del razzo: l'altezza a riposo e il
    // raggio d'azione orizzontale seguono lo schermo (desktop e mobile)
    const halfH =
      (cam.position.z - position[2]) *
      Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const halfW = halfH * cam.aspect;

    // A riposo il razzo sta sopra il titolo e con il mouse non lo scavalca
    const baseY = halfH * restHeight + Math.sin(time * 0.5) * halfH * 0.05;
    const targetX = position[0] + mx * Math.min(30, halfW * 0.55);
    const targetY = baseY + my * halfH * 0.1;
    const targetZ = position[2] + mx * 10;

    // Lerp smooth per movimento fluido
    rocket.position.x += (targetX - rocket.position.x) * 0.08;
    rocket.position.y += (targetY - rocket.position.y) * 0.08;
    rocket.position.z += (targetZ - rocket.position.z) * 0.08;

    // Posizione del cursore nello spazio 3D (proiettata a z camera - 80)
    cursorWorldPos.current.set(mx * 100, my * 100, cam.position.z - 80);
    direction.current
      .subVectors(cursorWorldPos.current, rocket.position)
      .normalize();
    const d = direction.current;

    // Yaw (rotazione Y): rotazione orizzontale verso il cursore
    const targetYaw = Math.atan2(d.x, d.z);
    rocket.rotation.y += (targetYaw - rocket.rotation.y) * 0.1;

    // Oscillazione sul roll + inclinazione verso il mouse
    rocket.rotation.z = Math.sin(time * 0.8) * 0.1 + mx * 0.2;
  });

  return (
    <group ref={rocketRef} position={position} scale={scale}>
      {/* Corpo principale del razzo (cilindro) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.85, 4.5, 32]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Banda rossa decorativa superiore */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.81, 0.81, 0.4, 32]} />
        <meshStandardMaterial color="#DC143C" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Banda rossa decorativa inferiore */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.3, 32]} />
        <meshStandardMaterial color="#DC143C" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Punta del razzo (cono) */}
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.8, 1.1, 32]} />
        <meshStandardMaterial
          color="#DC143C"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Finestra/oblò principale */}
      <mesh position={[0, 0.8, 0.81]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial
          color="#1E90FF"
          metalness={0.95}
          roughness={0.05}
          emissive="#1E90FF"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Bordo finestra */}
      <mesh position={[0, 0.8, 0.805]}>
        <torusGeometry args={[0.35, 0.05, 16, 32]} />
        <meshStandardMaterial color="#505050" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rivetti sul corpo (dettagli) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={`rivet-${i}`}
            position={[Math.cos(angle) * 0.81, -0.5, Math.sin(angle) * 0.81]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#303030"
              metalness={0.9}
              roughness={0}
            />
          </mesh>
        );
      })}

      {/* Alette (4 alette simmetriche più realistiche) */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <group key={`fin-${i}`} rotation={[0, angle, 0]}>
            <mesh position={[0, -2.2, 0.85]} castShadow>
              <boxGeometry args={[0.08, 1.8, 1.2]} />
              <meshStandardMaterial
                color="#DC143C"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Bordo aletta */}
            <mesh position={[0, -2.2, 1.45]}>
              <boxGeometry args={[0.09, 1.8, 0.02]} />
              <meshStandardMaterial
                color="#FFFFFF"
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}

      {/* Ugello motore principale */}
      <mesh position={[0, -2.6, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.85, 0.6, 32]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Interno ugello */}
      <mesh position={[0, -2.85, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.3, 32]} />
        <meshStandardMaterial
          color="#FF4500"
          metalness={0.5}
          roughness={0.3}
          emissive="#FF4500"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Fiamma del motore - effetto glow realistico animato */}
      <group position={[0, -3.2, 0]}>
        {/* Core della fiamma (bianco-giallo) */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.4, 1.2, 16]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
        </mesh>

        {/* Fiamma intermedia (giallo) */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.55, 1.8, 16]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.7} />
        </mesh>

        {/* Fiamma esterna (arancione) */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.7, 2.5, 16]} />
          <meshBasicMaterial color="#FF6347" transparent opacity={0.4} />
        </mesh>

        {/* Fiamma esterna più larga (rosso) */}
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.85, 3.2, 16]} />
          <meshBasicMaterial color="#FF4500" transparent opacity={0.2} />
        </mesh>

        {/* Luce della fiamma più intensa */}
        <pointLight color="#FF8C00" intensity={150} distance={40} decay={2} />
        <pointLight color="#FFD700" intensity={80} distance={20} decay={2} />
      </group>

      {/* Sistema di luci per effetto metallico realistico */}
      <pointLight position={[0, 5, 5]} intensity={1000} color="#ffffff" />
      <pointLight position={[3, 0, 3]} intensity={1000} color="#ffffff" />
      <pointLight position={[-3, 0, 3]} intensity={1000} color="#ffffff" />
      <pointLight position={[0, -2, 5]} intensity={1000} color="#ffffff" />
    </group>
  );
};

export default FloatingRocket;
