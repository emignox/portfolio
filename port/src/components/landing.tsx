"use client";
import { TextGenerateEffect } from "./effect";
import Nav from "./nav";
// import space from "/sea5.mp4";
import { MdArrowOutward } from "react-icons/md";
import Sound from "./sound";
import ButtonWork from "./button-work";

const words = " Frontend developer";
const name = " Polizzotto emanuele.";

export function Landing() {
  return (
    <>
      <div className="h-screen">
        {/* <video
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
          // src={space}
        /> */}
        <Nav className="" />

        <ButtonWork />
        <div className="  flex justify-center items-center flex-col   my-52 ">
          <TextGenerateEffect
            words={words}
            className="font-black text-4xl  lg:text-7xl "
          />
          <TextGenerateEffect
            words={name}
            className="font-bold text-3xl my-12  lg:text-5xl "
            delay={1}
          />
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
