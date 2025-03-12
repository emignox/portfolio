// import { TextGenerateEffect } from "./effect";
import Sound from "./sound";
import ButtonWork from "./button-work";
import Button from "./cv-button";

const words = () => {
  return (
    <h1 className="text-4xl font-black text-white lg:text-6xl fade h-1/4 ">
      Fullstack Developer
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
        <ButtonWork />
        <div className="flex flex-col items-center justify-center space-y-10 my-52">
          {words()}
          {name()}
          <Button text="Download my resume" />
          <Sound className="" />
        </div>
      </div>
    </>
  );
}

export default Landing;
