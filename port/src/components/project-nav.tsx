import { useState } from "react";
import { projects, Project } from "./project-data";
import { FaArrowLeft } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

interface SidebarProjectsProps {
  onProjectClick: (project: Project) => void;
}

const SidebarProjects: React.FC<SidebarProjectsProps> = ({
  onProjectClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenu = (project: Project) => {
    onProjectClick(project);
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
  };

  return (
    <>
      <FaArrowLeft
        className={`fixed top-1/4 right-0 z-10 text-3xl font-black cursor-pointer text-white transition-all duration-400 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
        onMouseEnter={() => setIsMenuOpen(true)}
      />
      <div
        className={`fixed top-1/4 right-0 z-10 h-[50vh] p-5 transition-all duration-400 transform  rounded-s-xl bg-black shadow-2xl flex items-start justify-end ${isMenuOpen ? "-translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div
          className={`p-5 transition-all h-full duration-400 transform flex flex-col justify-end w-full ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <ul className="flex flex-col items-start justify-center w-full h-2/4 gap-y-5 text-white font-bold ">
            {projects.map((project, index) => (
              <li
                key={index}
                className=" text-lg w-full flex items-center group  list-items "
                onClick={() => handleMenu(project)}
              >
                {project.title}
              </li>
            ))}
          </ul>
          <div className=" flex w-full h-full justify-end items-end">
            <button onClick={() => setIsMenuOpen(false)} className="text-white">
              close <IoCloseSharp className="inline" />{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarProjects;
