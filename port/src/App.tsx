import Home from "./pages/home";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/aboutMe";
import Scroll from "./pages/projects";
import Nav from "./components/nav";

function App() {
  return (
    <>
      <Router>
        <Nav className="" />
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
