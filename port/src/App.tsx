import Home from "./pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/aboutMe";
import Projects from "./pages/projects";

function App() {
  return (
    <>
      <Router basename="/portfolio">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
