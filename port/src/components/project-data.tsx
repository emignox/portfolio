import fresh from "/fresh1.png";
import resto from "/restoo.png";
import poke from "/poke-api.png";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import whisper from "/whisper.png";
import { FaNodeJs } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";
import { ReactElement } from "react";

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
    img: whisper,
    title: "whisper",
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
