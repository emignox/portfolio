import {
  SiJavascript,
  SiReact,
  SiPython,
  SiCss3,
  SiTailwindcss,
  SiBootstrap,
} from "react-icons/si";

const skills = [
  { icon: <SiBootstrap className="text-white" />, name: "Bootstrap" },
  { icon: <SiJavascript className="text-white " />, name: "JS" },
  { icon: <SiReact className="text-white" />, name: "React" },
  { icon: <SiPython className="text-white" />, name: "Python" },
  { icon: <SiCss3 className="text-white" />, name: "Css" },
  { icon: <SiTailwindcss className="text-white" />, name: "Tailwind" },
];

function Skills() {
  return (
    <>
      <h1 className=" text-white text-3xl lg:text-5xl text-center my-32 font-black">
        Skills
      </h1>
      <ul className="grid grid-cols-3 justify-items-center gap-5  mx-2  lg:mx-72">
        {skills.map((skill, index) => (
          <div key={index} className=" flex flex-col ">
            <li
              className="text-5xl border border-white rounded-2xl w-20 h-20 flex justify-center items-center my-5 "
              key={index}
            >
              {skill.icon}
            </li>
            <li className=" text-white text-xl font-black tetxt center flex  flex-col justify-center items-center">
              {skill.name}
            </li>
          </div>
        ))}
      </ul>
    </>
  );
}

export default Skills;
