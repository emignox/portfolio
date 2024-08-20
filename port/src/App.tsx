
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/aboutMe';
import Scroll from './pages/projects';
import Nav from './components/nav';

import HomeComponent3D from './components/homeComponente3D';
import ModelSea from './modelSea';


function App() {
  const location = useLocation();

  return (
    <>
      <Nav className='' />
      
      {location.pathname === '/' ? (
        <HomeComponent3D />
      ) : (
        <ModelSea />
      )}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/scroll" element={<Scroll />} />
      </Routes>
    </>
  );
}

export default App;
