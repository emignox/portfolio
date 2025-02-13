 import { Canvas } from "@react-three/fiber";
 import { Suspense } from "react";
 import CameraSetup from './components/cameraSetup';
 import { Environment, OrbitControls } from '@react-three/drei';
 import Model from './components/model3D';
 

 const getTimePreset = (): 'dawn' | 'sunset' | 'forest' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'dawn';
    } else if (hour >= 12 && hour < 21) {
      return 'sunset';
    } else {
      return 'forest';
    }
  };

 function ModelSea (){

    return(
        <> <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <CameraSetup />
          <OrbitControls
            autoRotate 
            autoRotateSpeed={5} 
            minDistance={100} 
            maxDistance={100} />
          <Model />
          <Environment preset={getTimePreset()} />
        </Suspense>
      </Canvas>
      </>
    )
 }
 export default ModelSea;