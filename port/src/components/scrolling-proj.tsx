import React, { useEffect, useState, FC, useRef } from "react";
import fresh1 from "/fresh1.png";
import Sound from "./sound";
import Nav from "./nav";
import resto from "/restoo.png";
import Logo from "./logo-fresh";
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

    const animateScroll = () => {
      handleScroll();
      window.requestAnimationFrame(animateScroll);
    };

    window.requestAnimationFrame(animateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div id="content">
        <Nav className="" />
        <Sound className="" />
        <div id="viewport">
          <Frame type="image" z={zVals[0]}>
            <img
              style={{ filter: "brightness(0.8)" }}
              src={resto}
              alt="placeholder"
            />
            <button className=" button">
              {" "}
              <a href="https://emignox.github.io/react-restaurant-/">
                {" "}
                visit the website
              </a>
            </button>
          </Frame>

          <Frame type="text" z={zVals[1]}>
            <h1>Restaurant Business idea </h1>
          </Frame>
          <Frame type="image" z={zVals[2]}>
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
          <Frame type="text" z={zVals[3]}>
            <h1>
              <Logo className="w-96" />
            </h1>
            <p></p>
          </Frame>
          <Frame type="box" z={zVals[4]}>
            <h1>Projects</h1>
          </Frame>
        </div>
      </div>
    </>
  );
};

export default Scroll3D;
