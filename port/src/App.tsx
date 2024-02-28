import Home from "./pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/aboutMe";

function App() {
  return (
    <>
      <Router basename="/portfolio">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
