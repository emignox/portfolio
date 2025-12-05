import { useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type CloudProps = {
  position: [number, number, number];
  opacity: number;
  color: string;
};

function CloudWithLoop({
  position,
  opacity,
  color,
}: {
  position: [number, number, number];
  opacity: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.z -= 0.5;
      if (ref.current.position.z < -800) {
        ref.current.position.z = 5;
      }
    }
  });

  const scaleX = Math.random() * 15 + 25;
  const scaleY = Math.random() * 10 + 20;
  const scaleZ = Math.random() * 10 + 15;

  return (
    <Cloud
      ref={ref}
      position={position}
      scale={[scaleX, scaleY, scaleZ]}
      speed={0.1}
      opacity={opacity}
      color={color}
    />
  );
}
const isAfternoon = () => {
  const hour = new Date().getHours();
  return hour >= 16 && hour < 21;
};

function GenerateClouds({ count }: { count: number }) {
  const clouds: CloudProps[] = Array.from({ length: count }, () => {
    const pos = [
      Math.random() * 800 - 400,
      Math.random() * 800 - 400,
      Math.random() * 800 - 400,
    ] as [number, number, number];
    return {
      position: pos,
      opacity: Math.random() * 0.5 + 0.1,
      color: isAfternoon() ? "#FBD296" : "#FAEEEE",
    };
  });

  return (
    <>
      {clouds.map((cloud, index) => (
        <CloudWithLoop
          key={index}
          position={cloud.position}
          opacity={cloud.opacity}
          color={cloud.color}
        />
      ))}
    </>
  );
}
export default GenerateClouds;
