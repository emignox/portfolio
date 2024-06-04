// import { TextGenerateEffect } from "./effect";
import Sound from "./sound";
import ButtonWork from "./button-work";
import Video from "./background-video";
import Button from "./cv-button";

const words = () => {
  return (
    <h1 className="text-4xl font-black text-white lg:text-6xl fade h-1/4 ">
      Frontend developer
    </h1>
  );
};
const name = () => {
  return (
    <h1 className="text-2xl font-bold text-white lg:text-5xl fade h-1/4 ">
      Polizzotto Emanuele.
    </h1>
  );
};

export function Landing() {
  // const Navigate = useNavigate();

  return (
    <>
      <div className="h-screen-[-200px] ">
        <Video />
        <ButtonWork />
        <div className="flex flex-col items-center justify-center space-y-10 my-52">
          {words()}
          {name()}

          {/* <button
            onClick={() => Navigate("/scroll")}
            className="flex items-center justify-center button "
          >
            See my projects <MdArrowOutward className="mx-1 " />{" "}
          </button> */}
          <Button text="Download my resume" />
          <Sound className="" />
        </div>
      </div>
    </>
  );
}

export default Landing;
