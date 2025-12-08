// import { TextGenerateEffect } from "./effect";
import Sound from "./sound";
import ButtonWork from "./button-work";
import Button from "./cv-button";

export function Landing() {
  // const Navigate = useNavigate();

  return (
    <>
      <div className="h-screen-[-200px] ">
        <ButtonWork />
        <div className="flex flex-col items-center space-y-10 mt-[70vh]">
          <Button text="Download my resume" />
          <Sound className="" />
        </div>
      </div>
    </>
  );
}

export default Landing;
