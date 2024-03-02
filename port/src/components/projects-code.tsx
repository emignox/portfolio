import { useEffect, useState } from "react";
import fresh1 from "/fresh1.png";
import FreshLogo from "./logo-fresh";
import { SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";

function ProjectsCode() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="  flex flex-col  items-center">
        <div
          style={{
            transform: `translateY(${scrollPosition * 0.5}px)`,
            transition: "transform 0.4s ease-out",
          }}
          className="  "
        >
          <div className=" flex flex-col justify-center items-center w-full">
            <h1 className=" text-white w-1/2 font-black lg:text-8xl text-center flex  flex-col justify-center items-center">
              Shop{" "}
            </h1>
            <FreshLogo className="   lg:h-44 my-5 " />
          </div>
        </div>
      </div>
      <div className="flex  relative">
        <img
          className="   "
          src={fresh1}
          alt=""
          style={{ filter: "brightness(0.5)" }}
        />
        <div className="absolute bg-black h-full w-1/2 top-0 left-0 transform flex flex-col items-center justify-between ">
          <p className="text-gray-200 mx-auto text-center w-4/5 font-bold lg:text-8xl lg:w-4/5 my-5">
            Tech
          </p>
          <ul className="flex items-center justify-between text-5xl lg:text-8xl ">
            <li>
              <SiTailwindcss className=" text-gray-200 mx-5" />
            </li>
            <li>
              <SiReact className="text-gray-200 mx-5" />
            </li>
            <li>
              <SiTypescript className="text-gray-200 mx-5" />
            </li>
          </ul>
          <button className="button text-6xl font-black text-white flex justify-center items-center text-center mx-auto lg:my-10 my-12">
            <a target="_blank" href="https://emignox.github.io/fresh/">
              Take a look{" "}
            </a>{" "}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProjectsCode;
