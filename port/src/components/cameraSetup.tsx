import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const CameraSetup: React.FC = () => {
  const location = useLocation();
  const { camera } = useThree();
  const targetPosition = useRef<Vector3>(new Vector3(0, 15.245, 50));
  const currentPosition = useRef<Vector3>(camera.position.clone());

useEffect(() => {
  // Update the target position based on the route
  const newPosition: [number, number, number] = location.pathname === '/scroll'
    ? [0, 15.245, 150] 
    : [0, 15.245, 50];

  const otherPosition: [number, number, number] = location.pathname === '/about' 
    ? [0, 200.245, 50] 
    : [0, 15.245, 50];

  // Choose the appropriate position based on the route
  const finalPosition = location.pathname === '/about' ? otherPosition : newPosition;

  targetPosition.current.set(...finalPosition);
  currentPosition.current.copy(camera.position);
}, [location.pathname, camera.position]);

  useFrame(() => {
    const lerpFactor = 0.05; // Adjust this value to control the speed of the transition

    camera.position.lerp(targetPosition.current, lerpFactor);
    camera.lookAt(500, 0, 0); // Optional: make the camera look at the origin (or any other point)

    currentPosition.current.copy(camera.position);
  });

  return null;
};

export default CameraSetup;
