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
      }, 600); // 1000ms is the duration of the fade out animation

      return () => clearTimeout(timeoutId);
    }
  }, [isFadingOut]);

  return (
    <>
      <div className="flex justify-between  items-center  bg-transparent  ">
        <img className="w-1/5 lg:w-20   lg:h-20" src={logo} alt="" />

        {className}

        <button className="" onClick={handleMenu}>
          {menu ? (
            <IoCloseSharp className="text-white text-5xl m-3 border-2 rounded-full p-2" />
          ) : (
            <GiHamburgerMenu className="text-white text-5xl m-3 border-2 rounded-full p-2" />
          )}
        </button>
      </div>
      {menu && (
        <div
          className={`absolute right-0 bg-gray-900 h-auto flex justify-center items-center rounded-xl w-52 mx-5 ${
            menu ? (isFadingOut ? "fade-out" : "fade") : ""
          }`}
        >
          <ul className="text-white text-xl font-black flex flex-col  justify-center items-center">
            <li
              onClick={() => navigate("/home")}
              className="opacity-80 lg:opacity-75 lg:hover:opacity-100 lg:transition lg:duration-300 mx-3 my-5  flex"
            >
              <MdArrowOutward className=" " /> Home
            </li>
            <li
              onClick={() => navigate("/about")}
              className="opacity-80 lg:opacity-75 lg:hover:opacity-100 lg:transition lg:duration-300 mx-3 my-5  flex"
            >
              <MdArrowOutward className=" " /> About Me
            </li>
            <li
              onClick={() => navigate("./")}
              className="opacity-80 lg:opacity-75 lg:hover:opacity-100 lg:transition lg:duration-300  my-5 flex"
            >
              <MdArrowOutward /> Projects
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Nav;
