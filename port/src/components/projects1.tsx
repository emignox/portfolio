import { useState, useEffect } from "react";
import Nav from "./nav";
import Sound from "./sound";
import fresh from "/fresh1.png";
import resto from "/restoo.png";
import poke from "/poke-api.png";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";

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
              <div
                className="  h-screen  flex space-y-5 flex-col justify-center  items-center text-center  lg:flex lg:flex-row  lg:justify-center lg:items-center "
                key={index}
              >
                <div className=" flex flex-col justify-center items-center  space-y-5 ">
                  <img
                    className="w-4/5 rounded-xl  lg:w-3/3  shadow-xl shadow-black "
                    src={project.img}
                    alt=""
                  />
                  <button className=" border-2 border-white rounded-xl text-xl text-white hover:text-black hover:bg-white px-2 inline-block w-1/2 lg:w-44 p-1 transition duration-500 ease-in-out mb-6 lg:mb-0">
                    {" "}
                    <a href={project.link}> Visit the website </a>
                  </button>
                </div>
                <div className=" flex flex-col space-y-5 lg:space-y-3 justify-center items-center lg:h-1/2 text-white lg:mx-32 ">
                  <h1 className=" text-center text-3xl font-black text-white  ">
                    {project.title}
                  </h1>
                  <div className="flex flex-col ">
                    <h2 className=" text-center font-bold"> Tech used:</h2>
                    <h1 className="flex text-6xl  justify-between  p-1 rounded-xl space-x-5  items-center mx-auto border-2 border-white ">
                      {project.description.tech}
                    </h1>
                  </div>
                  <h1 className=" font-bold text-center text-xl "> hooks:</h1>
                  <p className=" text-xs font-black text-center lg:w-3/4">
                    {project.description.hooks}
                  </p>
                  <h1 className=" font-bold">Description:</h1>
                  <p className=" text-pretty w-4/5">
                    {project.description.info}
                  </p>
                </div>
              </div>
            </>
          ))}
        </div>
        <div className=" w-10 h-10  fixed bottom-10 m-2 right-3 ">
          <Sound className="border-2 rounded-full text-white h-12 w-12 flex justify-center  items-center " />
        </div>
      </div>
    </>
  );
}
export default Projects;
