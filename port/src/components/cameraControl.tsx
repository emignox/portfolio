import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Vector3 } from 'three';
import { useLocation, useNavigate } from 'react-router-dom';

const CameraController: React.FC = () => {
  const cameraRef = useRef< typeof PerspectiveCamera>(null);
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/scroll') {
      setTargetPosition(new Vector3(0, 15, 0));
    } else {
      setTargetPosition(new Vector3(0, 15.245, 50));
    }
  }, [location.pathname]);

  useFrame(() => {
    if (cameraRef.current && targetPosition) {
      const camera = cameraRef.current;
      camera.position.lerp(targetPosition, 0.05);
      camera.lookAt(new Vector3(0, 0, 0));
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 15.245, 50]} />;
};

export default CameraController;