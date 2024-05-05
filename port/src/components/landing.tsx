// import { TextGenerateEffect } from "./effect";
import { MdArrowOutward } from "react-icons/md";
import Sound from "./sound";
import ButtonWork from "./button-work";
import { useNavigate } from "react-router-dom";
import Video from "./background-video";

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
  const Navigate = useNavigate();

  return (
    <>
      <div className="h-screen-[-200px] ">
        <Video />
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
          <Sound className="" />
        </div>
      </div>
    </>
  );
}

export default Landing;
