import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/realLogo.svg";
import { IoCloseSharp } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";

interface NavProps {
  className: string;
}

function Nav({ className }: NavProps) {
  const [menu, setMenu] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const navigate = useNavigate();

  const classList =
    "flex items-center mx-2 md:mx-0 justify-start my-5 cursor-pointer group opacity-80 lg:opacity-75 lg:hover:opacity-100 lg:transition lg:duration-300";
  const classIcon =
    "ml-3 hidden md:block transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1";
  const classiconMenu =
    "p-2 m-3 text-5xl text-white border-2 border-white rounded-full";

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
        <img className="w-1/5 pl-5 lg:w-24 lg:h-24" src={logo} alt="" />

        <button className="" onClick={handleMenu}>
          {menu ? (
            <IoCloseSharp className={classiconMenu} />
          ) : (
            <GiHamburgerMenu className={classiconMenu} />
          )}
        </button>
      </div>
      {menu && (
        <div
          onPointerLeave={handleMenu}
          className={`absolute w-[100%] md:absolute  md:right-0    md:w-[10%]   bg-black bg-opacity-30  backdrop-blur-lg h-auto flex p-5 justify-center items-center  z-30   rounded-2xl ${
            menu ? (isFadingOut ? "fade-out" : "fade") : ""
          }`}
        >
          <ul className="flex flex-row items-start justify-start text-xl font-black text-white md:flex md:flex-col md:justify-center md:items-start ">
            <li
              onClick={() => {
                navigate("/");
              }}
              className={`${classList}`}
            >
              Home
              <MdArrowOutward className={classIcon} />
            </li>
            <li onClick={() => navigate("/about")} className={`${classList}`}>
              About
              <MdArrowOutward className={classIcon} />
            </li>
            <li onClick={() => navigate("/scroll")} className={`${classList}`}>
              Projects
              <MdArrowOutward className={classIcon} />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Nav;
