import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo1.png";
import { IoCloseSharp } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";

interface NavProps {
  className: string;
}

function Nav({ className }: NavProps) {
  const [menu, setMenu] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const navigate = useNavigate();

  const handleMenu = () => {
    if (menu) {
      setIsFadingOut(true);
    } else {
      setMenu(true);
    }
  };

  useEffect(() => {
    if (isFadingOut) {
      const timeoutId = setTimeout(() => {
        setMenu(false);
        setIsFadingOut(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [isFadingOut]);

  return (
    <>
      <div
        className={`flex justify-between  items-center   bg-transparent ${className}`}
      >
        <img className="w-1/5 lg:w-20 lg:h-20" src={logo} alt="" />

        <button className="" onClick={handleMenu}>
          {menu ? (
            <IoCloseSharp className="p-2 m-3 text-5xl text-white border-2  border-white rounded-full" />
          ) : (
            <GiHamburgerMenu className="p-2 m-3 text-5xl text-white border-white border-2 rounded-full" />
          )}
        </button>
      </div>
      {menu && (
        <div
          onPointerLeave={handleMenu}
          className={`absolute right-0   bg-black h-auto flex p-5 justify-start items-center  z-30 rounded-xl w-52  ${
            menu ? (isFadingOut ? "fade-out" : "fade") : ""
          }`}
        >
          <ul className="flex flex-col items-start justify-start text-xl font-black text-white ">
            <li
              onClick={() => navigate("/")}
              className="flex items-center justify-start my-5 group opacity-80 lg:opacity-75 lg:hover:opacity-100 lg:transition lg:duration-300"
            >
              Home
              <MdArrowOutward className="ml-3 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </li>
            <li
              onClick={() => navigate("/about")}
              className="flex items-center justify-start my-5 text-justify cursor-pointer group opacity-80 lg:opacity-75 lg:hover:opacity-100 lg:transition lg:duration-300"
            >
              AboutMe
              <MdArrowOutward className="ml-3 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </li>
            <li
              onClick={() => navigate("/scroll")}
              className="flex items-center justify-start my-5 cursor-pointer group opacity-80 lg:opacity-75 lg:hover:opacity-100 lg:transition lg:duration-300"
            >
              Projects
              <MdArrowOutward className="ml-3 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Nav;
