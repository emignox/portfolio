import { useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Texture servita in locale (public/cloud.png) invece che dal CDN githack di drei
const CLOUD_TEXTURE = `${import.meta.env.BASE_URL}cloud.png`;

const SEGMENTS = 20; // default di drei <Cloud />
const SPEED = 30; // unita' al secondo (prima 0.5 per frame, dipendeva dagli fps)
const Z_NEAR = 20; // dietro la camera (z = 10): le nuvole nascono fuori vista
const Z_FAR = -800;
const FADE = 90; // distanza su cui la nuvola cresce/si rimpicciolisce

type CloudProps = {
  position: [number, number, number];
  scale: [number, number, number];
  opacity: number;
  color: string;
};

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

function CloudWithLoop({ position, scale, opacity, color }: CloudProps) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    // delta limitato: dopo un tab in background non facciamo salti enormi
    group.position.z -= SPEED * Math.min(delta, 0.05);
    if (group.position.z < Z_FAR) group.position.z = Z_NEAR;

    // La nuvola appare/scompare scalando, cosi' il ciclo non fa "pop"
    const z = group.position.z;
    const f = Math.min(smooth((Z_NEAR - z) / FADE), smooth((z - Z_FAR) / FADE));
    group.scale.set(scale[0] * f, scale[1] * f, scale[2] * f);
  });

  return (
    <Cloud
      ref={ref}
      position={position}
      scale={scale}
      speed={0.1}
      opacity={opacity}
      color={color}
    />
  );
}

const cloudColor = () => {
  const hour = new Date().getHours();
  if (hour >= 16 && hour < 21) return "#FBD296"; // pomeriggio
  if (hour >= 21 || hour < 6) return "#5F687C"; // notte: nuvole scure, si vedono le stelle
  return "#C3CAD6"; // giorno
};

function GenerateClouds({ count }: { count: number }) {
  // Generate una sola volta: prima ogni re-render cambiava posizione e scala
  const clouds = useMemo<CloudProps[]>(() => {
    const color = cloudColor();
    return Array.from({ length: count }, () => ({
      position: [
        Math.random() * 700 - 350,
        Math.random() * 500 - 250,
        Math.random() * (Z_NEAR - Z_FAR) + Z_FAR,
      ] as [number, number, number],
      scale: [
        Math.random() * 15 + 25,
        Math.random() * 10 + 20,
        Math.random() * 10 + 15,
      ] as [number, number, number],
      opacity: Math.random() * 0.5 + 0.1,
      color,
    }));
  }, [count]);

  // Un solo <Clouds> = un solo draw call (e una sola texture) per tutte le nuvole
  return (
    <Clouds
      texture={CLOUD_TEXTURE}
      limit={count * SEGMENTS}
      frustumCulled={false}
    >
      {clouds.map((cloud, index) => (
        <CloudWithLoop key={index} {...cloud} />
      ))}
    </Clouds>
  );
}
export default GenerateClouds;
