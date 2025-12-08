import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingRocketProps {
  position?: [number, number, number];
  scale?: number;
}

const FloatingRocket: React.FC<FloatingRocketProps> = ({
  position = [0, 30, -100],
  scale = 1,
}) => {
  const rocketRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  // Listener per il movimento del mouse
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Normalizza le coordinate del mouse tra -1 e 1
      const ndcX = (x / width) * 2 - 1;
      const ndcY = -(y / height) * 2 + 1;

      setMousePosition({ x: ndcX, y: ndcY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Animazione di fluttuazione e inseguimento del mouse
  useFrame(({ clock, camera }) => {
    if (rocketRef.current) {
      const time = clock.getElapsedTime();

      // Movimento su e giù (fluttuazione base più ampia)
      const baseY = position[1] + Math.sin(time * 0.5) * 12;

      // Movimento seguendo il mouse (60% dell'influenza - raddoppiato)
      const targetX = position[0] + mousePosition.x * 30;
      const targetY = baseY + mousePosition.y * 20;
      const targetZ = position[2] + mousePosition.x * 10; // Aggiunto movimento in profondità

      // Lerp smooth per movimento fluido (aumentato a 0.08 per più reattività)
      rocketRef.current.position.x +=
        (targetX - rocketRef.current.position.x) * 0.08;
      rocketRef.current.position.y +=
        (targetY - rocketRef.current.position.y) * 0.08;
      rocketRef.current.position.z +=
        (targetZ - rocketRef.current.position.z) * 0.08;

      // Calcola la posizione del cursore nello spazio 3D (proiettata sul piano z della camera)
      const cursorWorldPos = new THREE.Vector3(
        mousePosition.x * 100,
        mousePosition.y * 100,
        camera.position.z - 80
      );

      // Crea un vettore dalla posizione del razzo al cursore
      const direction = new THREE.Vector3();
      direction
        .subVectors(cursorWorldPos, rocketRef.current.position)
        .normalize();

      // Calcola gli angoli necessari per puntare verso il cursore
      // Yaw (rotazione Y) - rotazione orizzontale
      targetRotation.current.y = Math.atan2(direction.x, direction.z);

      // Pitch (rotazione X) - rotazione verticale
      const horizontalDistance = Math.sqrt(
        direction.x * direction.x + direction.z * direction.z
      );
      targetRotation.current.x = -Math.atan2(direction.y, horizontalDistance);

      // Applica rotazione smooth con lerp (più reattivo)
      rocketRef.current.rotation.y +=
        (targetRotation.current.y - rocketRef.current.rotation.y) * 0.15;
      rocketRef.current.rotation.x +=
        (targetRotation.current.x - rocketRef.current.rotation.x) * 0.15;

      // Oscillazione più pronunciata sul roll
      rocketRef.current.rotation.z =
        Math.sin(time * 0.8) * 0.1 + mousePosition.x * 0.2;
    }
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
