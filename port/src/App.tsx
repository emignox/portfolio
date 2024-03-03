import Home from "./pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/aboutMe";
import Scroll from "./pages/projects";

function App() {
  return (
    <>
      <Router basename="/portfolio">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/scroll" element={<Scroll />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
