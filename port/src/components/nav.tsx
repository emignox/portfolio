import { IoMenu } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/realLogo.svg";
import { IoCloseSharp } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";

interface NavProps {
  className: string;
}

function Nav({ className }: NavProps) {
  const [menu, setMenu] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const { pathname } = useLocation();

  const classList = (path: string) =>
    `flex items-center mx-1 md:mx-0 justify-start my-3 cursor-pointer group px-4 py-1.5 rounded-full transition duration-300 hover:bg-white/10 ${
      pathname === path
        ? "bg-white/15 opacity-100"
        : "opacity-70 hover:opacity-100"
    }`;
  const classIcon =
    "ml-1 hidden md:block transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1";
  const classiconMenu =
    "p-2 m-3 text-4xl text-white transition border rounded-full border-white/70 bg-black/35 backdrop-blur-md hover:bg-white hover:text-black";

  const handleMenu = () => {
    if (menu) {
      setIsFadingOut(true);
    } else {
      setMenu(true);
    }
  };

  // chiude il menu a ogni cambio pagina, con Esc o toccando fuori (touch)
  useEffect(() => {
    setMenu(false);
    setIsFadingOut(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFadingOut(true);
    };
    const onOutside = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-nav]")) setIsFadingOut(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onOutside);
    };
  }, [menu]);

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
        className={`flex  justify-between  items-center   bg-transparent ${className}`}
      >
        <img
          className="w-1/5 pl-3 md:w-20 md:h-20"
          src={logo}
          alt="Emanuele Polizzotto logo"
        />

        <button
          data-nav
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          className="md:fixed md:right-1"
          onClick={handleMenu}
        >
          {menu ? (
            <IoCloseSharp className={classiconMenu} />
          ) : (
            <IoMenu className={classiconMenu} />
          )}
        </button>
      </div>
      {menu && (
        <>
          <div
            data-nav
            onPointerLeave={(e) => {
              // solo mouse: su touch il pointerleave scatta al rilascio del dito
              if (e.pointerType === "mouse" && !isFadingOut) setIsFadingOut(true);
            }}
            className={`absolute left-0 right-0 mx-3 md:mx-0 md:left-auto md:fixed md:right-2 flex-col md:w-auto bg-black/50 backdrop-blur-xl border border-white/20 shadow-2xl h-auto flex px-4 py-2 justify-center items-center z-30 rounded-3xl ${
              menu ? (isFadingOut ? "fade-out" : "fade") : ""
            }`}
          >
            <ul className="flex flex-row items-center justify-start text-lg font-semibold text-white md:row md:flex-row md:justify-center md:items-start ">
              {[
                { path: "/", label: "Home" },
                { path: "/about", label: "About" },
                { path: "/scroll", label: "Projects" },
              ].map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    aria-current={pathname === path ? "page" : undefined}
                    className={classList(path)}
                  >
                    {label}
                    <MdArrowOutward className={classIcon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

export default Nav;
