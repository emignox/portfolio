import { useState, useEffect } from "react";
import Nav from "./nav";
import Sound from "./sound";
import fresh from "/fresh1.png";
import resto from "/restoo.png";
import poke from "/poke-api.png";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import Scroll from "./scroll";
import whisper from "/whisper.png";
import { FaNodeJs } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";

function Projects() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 secondi

    return () => clearTimeout(timer); // Pulisce il timer quando il componente si smonta
  }, []);

  const projects = [
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
        info: "Using Node.js for the backend. it doesn't have all functionallity  because the project is still in progress. This is my first full-stack project included in my portfolio to strengthen my understanding of backend-to-frontend interaction.😃",
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
      title: "Resto Landing Page",
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

  return (
    <>
      {" "}
      {isLoading && <div className="loading-overlay">Charging...</div>}
      <div className="h-screen ">
        <video
          id="video"
          className="fixed top-0 left-0 w-full h-screen z-[-10] m-0 p-0 border-none object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{
            filter: "blur(50px) brightness(70%)",
          }}
        >
          <source
            src="https://stockema.s3.eu-north-1.amazonaws.com/production_id_4779866+(1080p).mp4"
            type="video/mp4"
          />
          Il tuo browser non supporta il tag video.
        </video>

        <Nav className="" />
        <div className="">
          {projects.map((project, index) => (
            <>
              <Scroll>
                <div
                  className="flex flex-col items-center justify-center h-screen space-y-5 text-center lg:flex lg:flex-row lg:justify-center lg:items-center"
                  key={index}
                >
                  <div className="flex flex-col items-center justify-center space-y-5 ">
                    <img
                      className="w-4/5 shadow-xl rounded-xl lg:w-3/3 shadow-black "
                      src={project.img}
                      alt=""
                    />
                    <button className="inline-block w-1/2 p-1 px-2 mb-6 text-xl text-white transition duration-500 ease-in-out border-2 border-white rounded-xl hover:text-black hover:bg-white lg:w-44 lg:mb-0">
                      {" "}
                      <a target="_blank" href={project.link}>
                        {" "}
                        Visit the website{" "}
                      </a>
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-5 text-white lg:space-y-3 lg:h-1/2 lg:mx-32">
                    <h1 className="text-3xl font-black text-center text-white ">
                      {project.title}
                    </h1>
                    <div className="flex flex-col ">
                      <h2 className="font-bold text-center "> Tech used:</h2>
                      <h1 className="flex items-center justify-between p-1 mx-auto text-6xl border-2 border-white lg:space-x-5 rounded-xl ">
                        {project.description.tech}
                      </h1>
                    </div>
                    <h1 className="text-xl font-bold text-center "> hooks:</h1>
                    <p className="text-xs font-black text-center lg:w-3/4">
                      {project.description.hooks}
                    </p>
                    <h1 className="font-bold ">Description:</h1>
                    <p className="w-4/5 text-pretty">
                      {project.description.info}
                    </p>
                  </div>
                </div>
              </Scroll>
            </>
          ))}
        </div>
        <div className="fixed w-10 h-10 m-2 bottom-10 right-3">
          <Sound className="flex items-center justify-center w-12 h-12 text-white border-2 rounded-full " />
        </div>
      </div>
    </>
  );
}
export default Projects;
