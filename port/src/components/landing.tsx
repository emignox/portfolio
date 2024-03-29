// import { TextGenerateEffect } from "./effect";
import Nav from "./nav";
import { MdArrowOutward } from "react-icons/md";
import Sound from "./sound";
import ButtonWork from "./button-work";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const Navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 secondi

    return () => clearTimeout(timer); // Pulisce il timer quando il componente si smonta
  }, []);
  return (
    <>
      {isLoading && <div className="loading-overlay">Charging...</div>}
      <div className="h-screen">
        <video
          id="video"
          className="fixed top-0 left-0 w-full h-screen z-[-10] m-0 p-0 border-none object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{
            filter: "blur(50px) brightness(70%)",
          }}
        >
          <source
            src="https://stockema.s3.eu-north-1.amazonaws.com/production_id_4779866+(1080p).mp4"
            type="video/mp4"
          />
          Il tuo browser non supporta il tag video.
        </video>

        <Nav className="" />
        <ButtonWork />
        <div className="  flex justify-center items-center flex-col space-y-10   my-52 ">
          {words()}
          {name()}

          <button
            onClick={() => Navigate("/scroll")}
            className="button flex items-center justify-center  "
          >
            See my projects <MdArrowOutward className=" mx-1 " />{" "}
          </button>
          <div className=" w-10 h-10  absolute bottom-10 m-2 left-0">
            <Sound className="border-2 rounded-full text-white h-12 w-12 flex justify-center  items-center " />
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
