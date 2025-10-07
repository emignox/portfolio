import fresh from "/fresh1.png";
import resto from "/restoo.png";
import poke from "/poke-api.png";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { SiPython, SiTailwindcss } from "react-icons/si";
import whisper from "/whisper.png";
import { FaNodeJs } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";
import { ReactElement } from "react";
import Codex from "/codex.png";
import Weibo from "/weibo.png";
import Coach from "/coach.png";
import { SiRedux } from "react-icons/si";
import afitpilot from "/afitpilot.png";
import { GiJesterHat } from "react-icons/gi";
import akwanza from "/akwanza.png";
import NoteBook from "/E-note.png";
import Nemei from "/nemei_app.png";

export interface Project {
  img: string;
  title: string;
  link: string;
  description: {
    tech: ReactElement[];
    hooks: string[];
    info: string;
  };
}

export const projects: Project[] = [
  {
    img: Nemei,
    title: "Nemei App",
    link: "https://nemei.app/landingPage",
    description: {
      tech: [
        <FaReact />,
        <IoLogoJavascript />,
        <SiTailwindcss />,
        <SiPython />,
      ],
      hooks: [" useState,", " UseEffect,", " useNavigate", "others..."],
      info: "Personalized fitness app combining AI-generated workouts from certified trainers with comprehensive nutrition tracking. Features include automatic macro calculations, exercise video demonstrations, and a flexible calorie-based approach. Professional-grade fitness tools requiring minimal user effort.",
    },
  },
  {
    img: NoteBook,
    title: "Notebook E-Note",
    link: "https://notes-nine-sigma.vercel.app/",
    description: {
      tech: [<FaReact />, <IoLogoJavascript />, <SiTailwindcss />, <SiRedux />],
      hooks: [" useState,", " UseEffect,", " useNavigate", "others..."],
      info: "A full-stack app built with NX/Nest.js/MikroORM/GraphQL/Apollo Server for the backend, and NX/Vite/React.ts for the frontend. This project was created to improve my full-stack skills by using new technologies such as Nest.js, MikroORM, and GraphQL to make the backend structure more precise. I also used GraphQL Context and Subscriptions for real-time updates in the app, handled on the frontend side.",
    },
  },
  {
    img: Coach,
    title: "My coaching website",
    link: "https://front-ten-fawn.vercel.app",
    description: {
      tech: [<FaReact />, <IoLogoJavascript />, <SiTailwindcss />, <SiRedux />],
      hooks: [" useState,", " UseEffect,", " useNavigate", "others..."],
      info: "My personal website, created for me in the future in case I decide to launch myself as a sports coach, is still a work in progress. The most complex part was creating my backend in Node.js and using Redux in this project to give clients the ability to create appointments. Nodemailer is still to be implemented to confirm the appointments.",
    },
  },
  {
    img: akwanza,
    title: "Intern Project akwanza",
    link: "https://www.akwanza.com",
    description: {
      tech: [
        <FaReact />,
        <IoLogoJavascript />,
        <SiTailwindcss />,
        <SiRedux />,
        <GiJesterHat />,
      ],
      hooks: [" useState,", " UseEffect,", " useNavigate", "others..."],
      info: "(password:Akwanza) ,Akwnza is a project created to raise awareness about the effects of poaching in Africa and support an organization called BigLife, which is dedicated to the conservation of wildlife in Africa. Animations were created by me, and the project's structure and design were developed in Figma, entirely conceived by me and another intern.",
    },
  },
  {
    img: afitpilot,
    title: "Walter Project afitpilot",
    link: "https://www.afitpilot.com",
    description: {
      tech: [
        <FaReact />,
        <IoLogoJavascript />,
        <SiTailwindcss />,
        <SiRedux />,
        <GiJesterHat />,
      ],
      hooks: [" useState,", " UseEffect,", " useNavigate", "others..."],
      info: "In my internship... A website created by third parties, but I continued and corrected some errors in the frontend. I also tested some APIs with Jest to ensure correct functionality and collaborated with my colleagues for deployment on more efficient hosting platforms.",
    },
  },

  {
    img: Weibo,
    title: "Weibo",
    link: "https://weibo-nine.vercel.app",
    description: {
      tech: [<FaReact />, <IoLogoJavascript />, <SiTailwindcss />],
      hooks: [" useState,", " UseEffect,", " useNavigate", "others..."],
      info: "Weibo invites you to an interactive 3D experience, powered by React Three.js and Three Fiber. Each click or hover interaction engages the user with dynamically responsive objects. Created from Blender and seamlessly integrated into the web, Weibo is an ongoing project with a slow loading time due to hosting constraints, yet worth the wait. It's far from completion and requires further development.",
    },
  },
  {
    img: Codex,
    title: "Codex",
    link: "https://codex-two-sage.vercel.app",
    description: {
      tech: [<FaReact />, <IoLogoJavascript />, <SiTailwindcss />],
      hooks: [" useState,", " UseEffect,", " useNavigate", "others..."],
      info: " Codex invites you to a tranquil 3D oasis, sculpted with React Three.js and Three Fiber. As my first complete project, Codex is a finished virtual environment that provides a relaxing escape. This project marks my debut in implementing 3D objects created in Blender and integrated into the web with the assistance of Three.js. 😃",
    },
  },
  {
    img: whisper,
    title: "Whisper",
    link: "https://whisper-two-omega.vercel.app",
    description: {
      tech: [
        <FaReact />,
        <IoLogoJavascript />,
        <SiTailwindcss />,
        <FaNodeJs />,
        <SiMongodb />,
      ],
      hooks: [" useState,", " UseEffect(fetch),", " useNavigate"],
      info: "Using Node.js for the backend. it doesn't have all functionallity  because the project is still in progress. This is my first full-stack project included in my portfolio to strengthen my understanding of backend-to-frontend interaction. 😃",
    },
  },
  {
    img: fresh,
    title: "Fresh Shop",
    link: "https://emignox.github.io/fresh/",
    description: {
      tech: [<FaReact />, <IoLogoJavascript />, <SiTailwindcss />],
      hooks: ["useState,", " UseEffect,", " useRef,", " UseContext"],
      info: "Project created in react  using different hooks,  mapping arrays. for descriptions and images, use of context to keep updated cart data in different components ",
    },
  },
  {
    img: resto,
    title: "Restaurant Page",
    link: "https://emignox.github.io/react-restaurant-/",
    description: {
      tech: [<FaReact />, <IoLogoJavascript />, <SiTailwindcss />],
      hooks: [" useState,", " UseEffect"],
      info: "Buisiness idea for a restaurant landing page, in the process of completion. This project aims to provide an intuitive and user-friendly interface for potential customers to learn more about the restaurant and its offerings.",
    },
  },
  {
    img: poke,
    title: "Poke Api Project",
    link: "https://emignox.github.io/api-project/",
    description: {
      tech: [<FaReact />, <IoLogoJavascript />, <SiTailwindcss />],
      hooks: [" useState,", " UseEffect(fetch),", " useNavigate"],
      info: "Fetching data from the Poke API, experimenting with different styles and data presentations. This project showcases the ability to work with external APIs and present data in a user-friendly format.",
    },
  },
];
