import React from "react";
import { skills } from "./Data";

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
      <div
        className="lg:w-2/4 lg:flex lg:flex-col lg:ml-36  lg:justify-start mx-auto justify-center shadow-xl  lg:shadow-none "
        style={{ color: "#582042" }}
      >
        <h1 className="lg:text-6xl lg:text-start  lg:my-10 m-6 text-2xl font-black">
          Skills
        </h1>
        <div className="bg-white mx-3 rounded-2xl py-6 lg:shadow-none lg:bg-transparent">
          {skills.map((skill, index) => {
            const style = {
              width: `${skill.value}%`,
              backgroundColor: colors[index % colors.length],
              animation: `increase-width-${index} 3s forwards`,
            };
            const styleSheet = document.styleSheets[0];
            const keyframes = `@keyframes increase-width-${index} { from { width: 0%; } to { width: ${skill.value}%; } }`;
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

            return (
              <div key={index} className=" mx-auto">
                <h2 className="text-xl lg:text-3xl my-1 pl-2 font-semibold">
                  <span className="text-base">{skill.value}%</span>{" "}
                  {skill.title}
                </h2>
                <div className="w-3/4 mx-2 border border-black h-4 bg-white rounded-full">
                  <div style={style} className="h-full rounded-full"></div>
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
