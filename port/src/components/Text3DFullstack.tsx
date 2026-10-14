import React from "react";
import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Text3DFullstackProps {
  position?: [number, number, number];
}

// Larghezza (in unita' di scena) di "Fullstack Developer" a scala 1
const TITLE_WIDTH = 180;
// Quota di larghezza schermo che il titolo puo' occupare al massimo
const MAX_SCREEN_SHARE = 0.86;

const textProps = {
  color: "#ffffff",
  anchorX: "center",
  anchorY: "middle",
  fontWeight: "bold",
  // Alone scuro morbido: il bianco resta leggibile anche sulle nuvole chiare
  outlineWidth: "6%",
  outlineBlur: "28%",
  outlineColor: "#1b2433",
  outlineOpacity: 0.55,
  // Sempre dopo le nuvole (che sono trasparenti) cosi' non lo schiariscono
  renderOrder: 1,
  "material-toneMapped": false,
} as const;

const Text3DFullstack: React.FC<Text3DFullstackProps> = ({
  position = [0, 10, -120],
}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);

  // Su schermi stretti (mobile) il testo veniva tagliato: lo riscaliamo
  // in modo che la larghezza resti dentro il viewport.
  const distance = camera.position.z - position[2];
  const visibleWidth =
    2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
  const scale = Math.min(1, (visibleWidth * MAX_SCREEN_SHARE) / TITLE_WIDTH);

  return (
    <group position={position} scale={scale}>
      {/* Testo "Fullstack Developer" */}
      <Text position={[0, 5, 0]} fontSize={18} {...textProps}>
        Fullstack Developer
      </Text>

      {/* Testo "Polizzotto Emanuele" */}
      <Text position={[0, -12, 0]} fontSize={12} {...textProps}>
        Polizzotto Emanuele
      </Text>
    </group>
  );
};

export default Text3DFullstack;
