import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface TechCubeProps {
  position?: [number, number, number];
  size?: number;
}

const TechCube: React.FC<TechCubeProps> = ({
  position = [0, 100, -200],
  size = 80,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  // Il mouse vive in un ref: uno state farebbe ri-renderizzare tutto il cubo (e tutti i Text) a ogni mousemove
  const mouse = useRef({ x: 0, y: 0 });
  // Su schermi stretti (mobile) il cubo è più piccolo
  const narrow = useThree((s) => s.size.width < s.size.height);

  // Le tecnologie da mostrare sulle 6 facce
  const technologies = [
    "React", // Front (faccia 4)
    "TypeScript", // Back (faccia 5)
    "Odoo", // Right (faccia 0)
    "Python", // Left (faccia 1)
    "Three.js", // Top (faccia 2)
    "PostgreSQL", // Bottom (faccia 3)
  ];

  // Colori per le facce (in ordine: right, left, top, bottom, front, back)
  const faceColors = [
    "#714B67", // Right - Odoo (purple)
    "#FFD43B", // Left - Python (yellow)
    "#000000", // Top - Three.js (black)
    "#336791", // Bottom - PostgreSQL (blue)
    "#61DAFB", // Front - React (cyan)
    "#3178C6", // Back - TypeScript (blue)
  ];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Normalizza le coordinate del mouse tra -1 e 1
      const ndcX = (x / width) * 2 - 1;
      const ndcY = -(y / height) * 2 + 1;

      mouse.current.x = ndcX;
      mouse.current.y = ndcY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Crea particelle orbitanti (ridotte per performance)
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * size * 3,
        (Math.random() - 0.5) * size * 3,
        (Math.random() - 0.5) * size * 3
      ),
      speed: Math.random() * 0.02 + 0.01,
      radius: size * 1.5 + Math.random() * 20,
      angle: Math.random() * Math.PI * 2,
    }));
  }, [size]);

  const particlesRef = useRef<THREE.Points>(null);

  // Array stabile: se cambiasse a ogni render, le particelle verrebbero resettate
  const particlePositions = useMemo(
    () =>
      new Float32Array(
        particles.flatMap((p) => [p.position.x, p.position.y, p.position.z])
      ),
    [particles]
  );

  // Animazione e rotazione seguendo il mouse
  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      const f = Math.min(delta, 0.1) * 60; // indipendente dal framerate
      // Rotazione automatica
      groupRef.current.rotation.x += 0.003 * f;
      groupRef.current.rotation.y += 0.003 * f;

      // Rotazione aggiuntiva seguendo il mouse
      groupRef.current.rotation.y += mouse.current.x * 0.005 * f;
      groupRef.current.rotation.x += mouse.current.y * 0.005 * f;
    }

    // Anima le particelle orbitanti (ottimizzato)
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const time = clock.getElapsedTime();

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.angle += particle.speed * Math.min(delta, 0.1) * 60;

        const idx = i * 3;
        positions[idx] = Math.cos(particle.angle) * particle.radius;
        positions[idx + 1] = Math.sin(time + i) * 10;
        positions[idx + 2] = Math.sin(particle.angle) * particle.radius;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position} scale={narrow ? 0.6 : 1}>
      {/* Gruppo rotante che contiene cubo e testi */}
      <group ref={groupRef}>
        {/* Cubo principale */}
        <mesh>
          <boxGeometry args={[size, size, size]} />
          {/* Materiali diversi per ogni faccia */}
          {faceColors.map((color, index) => (
            <meshStandardMaterial
              key={index}
              attach={`material-${index}`}
              color={color}
              metalness={0.9}
              roughness={0.4}
            />
          ))}
        </mesh>

        {/* Testi sulle facce */}
        {/* Front - React */}
        <group position={[0, 0, size / 2 + 1]}>
          <Text
            position={[0, 5, 0]}
            fontSize={15}
            color="#61DAFB"
            anchorX="center"
            anchorY="middle"
          >
            ⚛️
          </Text>
          <Text
            position={[0, -5, 0]}
            fontSize={8}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.5}
            outlineColor="#61DAFB"
          >
            {technologies[0]}
          </Text>
        </group>

        {/* Back - TypeScript */}
        <group position={[0, 0, -size / 2 - 1]} rotation={[0, Math.PI, 0]}>
          <Text
            position={[0, 5, 0]}
            fontSize={15}
            color="#3178C6"
            anchorX="center"
            anchorY="middle"
          >
            📘
          </Text>
          <Text
            position={[0, -5, 0]}
            fontSize={8}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.5}
            outlineColor="#3178C6"
          >
            {technologies[1]}
          </Text>
        </group>

        {/* Right - Odoo */}
        <group position={[size / 2 + 1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Text
            position={[0, 5, 0]}
            fontSize={15}
            color="#714B67"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            O
          </Text>
          <Text
            position={[0, -5, 0]}
            fontSize={8}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.5}
            outlineColor="#714B67"
          >
            {technologies[2]}
          </Text>
        </group>

        {/* Left - Python */}
        <group position={[-size / 2 - 1, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Text
            position={[0, 5, 0]}
            fontSize={15}
            color="#FFD43B"
            anchorX="center"
            anchorY="middle"
          >
            🐍
          </Text>
          <Text
            position={[0, -5, 0]}
            fontSize={8}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.5}
            outlineColor="#FFD43B"
          >
            {technologies[3]}
          </Text>
        </group>

        {/* Top - Three.js */}
        <group position={[0, size / 2 + 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            position={[0, 5, 0]}
            fontSize={15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            🔺
          </Text>
          <Text
            position={[0, -5, 0]}
            fontSize={8}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.5}
            outlineColor="#888888"
          >
            {technologies[4]}
          </Text>
        </group>

        {/* Bottom - PostgreSQL */}
        <group position={[0, -size / 2 - 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Text
            position={[0, 5, 0]}
            fontSize={15}
            color="#336791"
            anchorX="center"
            anchorY="middle"
          >
            🐘
          </Text>
          <Text
            position={[0, -5, 0]}
            fontSize={8}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.5}
            outlineColor="#336791"
          >
            {technologies[5]}
          </Text>
        </group>

        {/* Luce puntiforme per illuminare il cubo */}
        <pointLight position={[50, 50, 50]} intensity={100} color="#ffffff" />
      </group>

      {/* Particelle orbitanti */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={2} color="#FFFFFF" sizeAttenuation />
      </points>
    </group>
  );
};

export default TechCube;
