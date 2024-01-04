import { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import "./nav.css";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Router>
      <nav className="flex flex-col lg:flex-row ">
        <button
          className="lg:hidden p-0 m-0 w-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className="text-4xl  text-white  p-0 m-0 "
            style={{ color: "#582042" }}
          >
            ☰
          </span>
        </button>
        <ul
          className="hidden lg:flex flex-col lg:flex-row   lg:text-white  lg:text-lg "
          style={{ color: "#582042" }}
        >
          <li className=" lg:mx-44 lg:py-4  ">
            <Link to="/">Home</Link>
          </li>
          <li className="lg:mx-64 lg:py-4 ">
            <Link to="/about">About Me</Link>
          </li>
        </ul>
        <div className=" ">
          <ul
            className={`flex flex-row mt-3  text-base lg:hidden transition-all duration-1000 ease-in-out overflow-hidden ${
              isOpen
                ? "opacity-100 max-h-full slide-in-from-left"
                : "opacity-0 max-h-0"
            }`}
            style={{ color: "#582042" }}
          >
            <li className="  mx-20">
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Me</Link>
            </li>
          </ul>
        </div>
      </nav>
    </Router>
  );
}

export default Nav;
