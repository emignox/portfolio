// import { TextGenerateEffect } from "./effect";
import Nav from "./nav";
import space from "/sea5.mp4";
import { MdArrowOutward } from "react-icons/md";
import Sound from "./sound";
import ButtonWork from "./button-work";
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
  return (
    <>
      <div className="h-screen">
        <video
          autoPlay
          loop
          muted
          style={{
            filter: "brightness(70%)",
            position: "absolute",
            width: "100vw", // viewport width
            height: "100vh", // viewport height
            objectFit: "cover",

            zIndex: "-1",
          }}
          src={space}
        />
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
