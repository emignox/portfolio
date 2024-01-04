import React from "react";
import skills from "./skill";

const SkillsComponent: React.FC = () => {
  const colors = [
    "#E5881B",
    "#8B9EFF",
    "#6E6A9F",
    "#F3FC8F",
    "#429DC3",
    "pink",
  ];

  return (
    <>
      <div className="  lg:w-2/4 lg:flex lg:flex-col mx-auto    justify-center">
        <h1 className="lg:text-6xl text-center lg:my-10 m-6 text-2xl">
          Skills
        </h1>
        <div className="  bg-white mx-3 rounded-2xl py-6  lg:shadow-none lg:bg-transparent ">
          {skills.map((skill, index) => {
            const style = {
              width: `${skill.value}%`,
              backgroundColor: colors[index % colors.length],
              transition: "width 2s",
            };

            return (
              <div key={index} className="">
                <span></span>
                <h2 className="  text-xl lg:text-3xl my-1 pl-2">
                  {skill.title}
                </h2>
                <div className="w-3/4 mx-2 border border-black h-4 bg-gray-200  rounded-full">
                  <div style={style} className="h-full  rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SkillsComponent;
