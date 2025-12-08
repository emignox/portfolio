import React from "react";
import { Text } from "@react-three/drei";

interface Text3DFullstackProps {
  position?: [number, number, number];
}

const Text3DFullstack: React.FC<Text3DFullstackProps> = ({
  position = [0, 10, -120],
}) => {
  return (
    <group position={position}>
      {/* Testo "Fullstack Developer" */}
      <Text
        position={[0, 5, 0]}
        fontSize={18}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Fullstack Developer
      </Text>

      {/* Testo "Polizzotto Emanuele" */}
      <Text
        position={[0, -12, 0]}
        fontSize={12}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Polizzotto Emanuele
      </Text>

      {/* Sistema di luci per illuminare il testo */}
      <pointLight position={[0, 0, 50]} intensity={100} color="#ffffff" />
      <pointLight position={[20, 10, 30]} intensity={60} color="#ffffff" />
      <pointLight position={[-20, 10, 30]} intensity={60} color="#ffffff" />
      <pointLight position={[0, -10, 30]} intensity={50} color="#ffffff" />
    </group>
  );
};

export default Text3DFullstack;
