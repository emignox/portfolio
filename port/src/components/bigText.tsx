import { Fragment } from "react";
import "./text.css";
import Foto from "./img";
import LittleText from "./littleText";
import Button from "./button";

function text() {
  return (
    <Fragment>
      <div className="shadow-xl lg:shadow-none bg-white mx-3 h-auto rounded-2xl border-gray-300 py-3 lg:bg-transparent">
        <h1
          className="  lg:text-center fade-in-from-left text-6xl text-center mt-10 lg:text-9xl   font-black"
          style={{ color: "#582042" }}
        >
          FRONT-END DEVELOPER
        </h1>
        <div className="lg:flex">
          <div
            className="   flex justify-center mt-10  lg:justify-center  "
            style={{ color: "#582042" }}
          >
            {" "}
            <Foto />
          </div>
          <div className="lg:flex lg:flex-col flex flex-col fade-in-from-left md:flex md:flex-col md:justify-center md:items-center md:mx-auto justify-center items-center text-center mt-12 ">
            {" "}
            <LittleText />
            <Button text="Download CV" className="button  lg:my-3" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default text;
