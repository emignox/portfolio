import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Home from './pages/home';
import About from './pages/aboutMe';
import Scroll from './pages/projects';
import Nav from './components/nav';
import logo from '/realLogo.svg';

// l'universo 3D (three + r3f) si carica a parte: la pagina si apre prima
const Universe = lazy(() => import('./space/Universe'));

const SWAP_AFTER_MS = 380;

function Loader() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 flex items-center justify-center bg-[#0b0f1a]"
    >
      <img src={logo} alt="" className="w-20 animate-pulse" />
    </div>
  );
}

function App() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  // `shown` cambia a metà della dissolvenza: la scena si sostituisce quando lo schermo è coperto
  const [shown, setShown] = useState(location);
  const [veilKey, setVeilKey] = useState(0);

  useEffect(() => {
    if (location.pathname === shown.pathname) {
      setShown(location);
      return;
    }
    if (reduceMotion) {
      setShown(location);
      window.scrollTo(0, 0);
      return;
    }
    setVeilKey((k) => k + 1);
    const timeout = setTimeout(() => {
      setShown(location);
      window.scrollTo(0, 0);
    }, SWAP_AFTER_MS);
    return () => clearTimeout(timeout);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Nav className='' />

      {/* un solo universo per tutte le pagine: cambiare pagina e' un volo */}
      <Suspense fallback={<Loader />}>
        <Universe route={location.pathname} />
      </Suspense>

      <Routes location={shown}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/scroll" element={<Scroll />} />
      </Routes>

      {veilKey > 0 && (
        <motion.div
          key={veilKey}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0] }}
          transition={{ duration: 0.95, times: [0, 0.4, 1], ease: 'easeInOut' }}
          className="fixed inset-0 z-[60] pointer-events-none bg-[#0b0f1a]"
        />
      )}
    </>
  );
}

export default App;
