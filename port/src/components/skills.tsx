import {
  SiJavascript,
  SiReact,
  SiPython,
  SiCss3,
  SiTailwindcss,
  SiBootstrap,
  //@ts-ignore
  SiOdoo,
  SiNestjs,
  SiGraphql,
  SiTensorflow,
  SiNodedotjs,
  SiApollographql,
} from "react-icons/si";

const skills = [
  { icon: <SiBootstrap className="text-white" />, name: "Bootstrap" },
  { icon: <SiJavascript className="text-white " />, name: "JS" },
  { icon: <SiReact className="text-white" />, name: "React" },
  { icon: <SiPython className="text-white" />, name: "Python" },
  { icon: <SiCss3 className="text-white" />, name: "Css" },
  { icon: <SiTailwindcss className="text-white" />, name: "Tailwind" },
  { icon: <SiOdoo className="text-white" />, name: "Odoo" },
  { icon: <SiNestjs className="text-white" />, name: "NestJS" },
  { icon: <SiGraphql className="text-white" />, name: "GraphQl" },
  { icon: <SiTensorflow className="text-white" />, name: "Tensorflow" },
  { icon: <SiNodedotjs className="text-white" />, name: "NodeJS" },
  { icon: <SiApollographql className="text-white" />, name: "Apollo" },
];

function Skills() {
  return (
    <>
      <h1 className="my-32 text-3xl font-black text-center text-white lg:text-5xl">
        Skills
      </h1>
      <ul className="grid grid-cols-3 gap-5 mx-2 justify-items-center lg:mx-72">
        {skills.map((skill, index) => (
          <div key={index} className="flex flex-col ">
            <li
              className="flex items-center justify-center w-20 h-20 my-5 text-5xl border border-white rounded-2xl "
              key={index}
            >
              {skill.icon}
            </li>
            <li className="flex flex-col items-center justify-center text-xl font-black text-white tetxt center">
              {skill.name}
            </li>
          </div>
        ))}
      </ul>
    </>
  );
}

export default Skills;
