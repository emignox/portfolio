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
  SiNextdotjs,
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
  { icon: <SiNextdotjs className="text-white" />, name: "Next.js" },
  { icon: <SiNodedotjs className="text-white" />, name: "NodeJS" },
  { icon: <SiApollographql className="text-white" />, name: "Apollo" },
];

function Skills() {
  return (
    <section className="px-4 mx-auto max-w-4xl">
      <h2 className="mt-32 mb-12 text-3xl font-bold text-center text-white lg:text-5xl">
        Skills
      </h2>
      <ul className="flex flex-wrap justify-center gap-3 md:gap-5">
        {skills.map((skill) => (
          <li
            key={skill.name}
            className="flex flex-col items-center justify-center w-[30%] gap-3 p-4 text-4xl sm:w-36 transition duration-300 border cursor-default group rounded-2xl border-white/15 bg-white/5 backdrop-blur-sm hover:-translate-y-1 hover:border-white/50 hover:bg-white/10 md:p-6"
          >
            <span className="transition-transform duration-300 group-hover:scale-110">
              {skill.icon}
            </span>
            <span className="text-sm font-medium text-white/80 md:text-base">
              {skill.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
