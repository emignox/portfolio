// import { TextGenerateEffect } from "./effect";
import Nav from "./nav";
import { MdArrowOutward } from "react-icons/md";
import Sound from "./sound";
import ButtonWork from "./button-work";
import { useState, useEffect } from "react";
const words = () => {
  return (
    <h1 className="font-black text-4xl  lg:text-6xl    text-white fade h-1/4  ">
      Frontend developer
    </h1>
  );
};
const name = () => {
  return (
    <h1 className="font-bold text-2xl  lg:text-5xl    text-white  fade h-1/4 ">
      Polizzotto Emanuele.
    </h1>
  );
};

export function Landing() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 4 secondi

    return () => clearTimeout(timer); // Pulisce il timer quando il componente si smonta
  }, []);
  return (
    <>
      {isLoading && <div className="loading-overlay">Caricamento...</div>}
      <div className="h-screen">
        <iframe
          src="https://player.vimeo.com/video/917839580?h=3b27fc15d7&background=1&autoplay=1&muted=1"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            filter: "brightness(0.8)",
          }}
          allow="autoplay; fullscreen"
        ></iframe>
        <Nav className="" />
        <ButtonWork />
        <div className="  flex justify-center items-center flex-col space-y-10   my-52 ">
          {words()}
          {name()}

          <button className="button flex items-center justify-center ">
            See my projects <MdArrowOutward className=" mx-1 " />{" "}
          </button>
          <div className=" w-10 h-10  absolute bottom-10 m-2 left-0">
            <Sound className="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
