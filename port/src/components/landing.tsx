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
          <p className="px-6 text-center text-xs text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.45)]">
            <span className="hidden [@media(hover:hover)]:inline">
              Hover a planet · click to visit it
            </span>
            <span className="[@media(hover:hover)]:hidden">
              Tap a planet to visit it
            </span>
          </p>
          <Sound className="" />
        </div>
      </div>
    </>
  );
}

export default Landing;
