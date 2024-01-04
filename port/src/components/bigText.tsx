import { Fragment } from "react";
import "./text.css";
import Foto from "./img";
import LittleText from "./littleText";

function text() {
  return (
    <Fragment>
      <div className="shadow-xl lg:shadow-none bg-white mx-3 h-auto rounded-2xl border-gray-300 py-3 lg:bg-transparent">
        <h1 className="  lg:text-center fade-in-from-left text-6xl text-center mt-10 lg:text-9xl lg:mt-20  font-black">
          FRONT-END DEVELOPER
        </h1>
        <div className="lg:flex">
          <div className="   flex justify-center mt-10  lg:justify-center  ">
            {" "}
            <Foto />
          </div>
          <div className="  fade-in-from-left  flex  justify-center text-center mt-12 ">
            <LittleText />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default text;
