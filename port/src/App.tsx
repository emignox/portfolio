import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/aboutMe';
import Scroll from './pages/projects';
import Nav from './components/nav';
import Model from './components/model3D';
import { Suspense, useState } from 'react';
import CameraSetup from './components/cameraSetup';


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



function App() {
return(
    <Router>
      <Nav className="" />
      <Canvas
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/scroll" element={<Scroll />} />
      </Routes>
    </Router>
  );
}

export default App;
