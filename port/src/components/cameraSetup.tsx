import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

const CameraSetup: React.FC = () => {
  const location = useLocation();
  const { camera } = useThree();
  const targetPosition = useRef<Vector3>(new Vector3(0, 15.245, 50));
  const currentPosition = useRef<Vector3>(camera.position.clone());
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

useEffect(() => {
  // Update the target position based on the route
  const newPosition: [number, number, number] = location.pathname === '/scroll'
    ? [0, 15.245, 150]
    : [0, 15.245, 50];

  const otherPosition: [number, number, number] = location.pathname === '/about'
    ? [0, 70.245, 50]
    : [0, 15.245, 50];

  // Choose the appropriate position based on the route
  const finalPosition = location.pathname === '/about' ? otherPosition : newPosition;

  targetPosition.current.set(...finalPosition);
  currentPosition.current.copy(camera.position);
}, [location.pathname, camera.position]);

// Aggiungi listener per il movimento del mouse
useEffect(() => {
  const handleMouseMove = (event: MouseEvent) => {
    const { clientX: x, clientY: y } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Normalizza le coordinate del mouse tra -1 e 1
    const ndcX = (x / width) * 2 - 1;
    const ndcY = -(y / height) * 2 + 1;

    // Salva l'offset del mouse (movimento ridotto)
    setMouseOffset({ x: ndcX * 3, y: ndcY * 3 });
  };

  document.addEventListener("mousemove", handleMouseMove);
  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
  };
}, []);

  useFrame(() => {
    const lerpFactor = 0.05; // Adjust this value to control the speed of the transition

    // Applica il lerp alla posizione target
    camera.position.lerp(targetPosition.current, lerpFactor);

    // Aggiungi l'offset del mouse alla posizione della camera
    camera.position.x += mouseOffset.x;
    camera.position.y += mouseOffset.y;

    // Guarda verso il punto target con l'offset del mouse
    camera.lookAt(500 + mouseOffset.x * 10, mouseOffset.y * 10, 0);

    currentPosition.current.copy(camera.position);
  });

  return null;
};

export default CameraSetup;
