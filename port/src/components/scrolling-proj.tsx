import React, { useEffect, useState, FC, useRef } from "react";
import fresh1 from "/fresh1.png";
import resto from "/restoo.png";
import Logo from "./logo-fresh";
import donut from "/donut.png";
import { useNavigate } from "react-router-dom";
interface FrameProps {
  type: string;
  z: number;
  children: React.ReactNode;
}

const Frame: FC<FrameProps> = ({ type, children, z }) => {
  const style = {
    transform: `translateZ(${z}px)`,
    display: z > 0 ? "none" : "block",
    opacity: z < 200 ? 1 : 1 - Math.round(((z - 200) / (300 - 200)) * 10) / 10,
  };

  return (
    <div className={`frame ${type}`} style={style}>
      {children}
    </div>
  );
};
const Scroll3D: FC = () => {
  const scrollPos = useRef(0);
  const [zVals, setZVals] = useState<number[]>(
    Array(10)
      .fill(0)
      .map((_, i) => (10 - i) * -1000)
  );

  useEffect(() => {
    const handleScroll = () => {
      const top = window.pageYOffset;
      const delta = scrollPos.current - top;
      scrollPos.current = top;

      setZVals((zVals) => zVals.map((z) => z + delta * -1.5));
    };

    window.addEventListener("scroll", handleScroll);

    const animateScroll = () => {
      handleScroll();
      window.requestAnimationFrame(animateScroll);
    };

    window.requestAnimationFrame(animateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const Navigate = useNavigate();

  return (
    <>
      <div className="h-screen">
        <video
          className="fixed top-0 left-0 w-full h-screen z-[-10] m-0 p-0 border-none object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://stockema.s3.eu-north-1.amazonaws.com/fire.mp4
            "
            type="video/mp4"
          />
          Il tuo browser non supporta il tag video.
        </video>
      </div>
      <div id="content">
        <div id="viewport">
          <Frame type="text" z={zVals[0]}>
            <button
              onClick={() => Navigate("/")}
              className="  h-32 text-9xl  button"
            >
              Come back home{" "}
            </button>
          </Frame>
          <Frame type="image" z={zVals[1]}>
            <img
              style={{ filter: "brightness(0.8)" }}
              src={resto}
              alt="placeholder"
            />
            <button className=" button ">
              {" "}
              <a href="https://emignox.github.io/react-restaurant-/">
                {" "}
                visit the website
              </a>
            </button>
          </Frame>

          <Frame type="text" z={zVals[2]}>
            <div className="flex ">
              {" "}
              <h1 className="  text-indigo-950 blocks  ">
                F
                <span>
                  <img className="  w-32  inline" src={donut} alt="" />
                </span>
                DO
                <br />{" "}
                <span className="text-white"> Restaurant business idea</span>
              </h1>
            </div>
          </Frame>
          <Frame type="image" z={zVals[3]}>
            <img
              style={{ filter: "brightness(0.8)" }}
              src={fresh1}
              alt="placeholder"
            />
            <button className=" button">
              {" "}
              <a href="https://emignox.github.io/fresh/"> visit the website</a>
            </button>
          </Frame>
          <Frame type="text" z={zVals[4]}>
            <Logo className="h-52 lg:h-full" />
            <p></p>
          </Frame>
          <Frame type="box" z={zVals[5]}>
            <h1>Projects</h1>
          </Frame>
        </div>
      </div>
    </>
  );
};

export default Scroll3D;
