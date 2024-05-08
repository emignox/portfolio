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
        className={`fixed top-1/4 right-0 z-10 text-3xl font-black cursor-pointer text-white bg-gray-900 px-2 py-2   rounded-lg transition-all duration-400 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
        onMouseEnter={() => setIsMenuOpen(true)}
      />
      <div
        className={`fixed top-1/4 right-0 z-10 h-[50vh] p-5 transition-all duration-400 transform  rounded-s-xl  bg-gray-900 shadow-2xl flex items-start justify-end ${isMenuOpen ? "-translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div
          className={`p-5 transition-all h-full duration-400 transform flex flex-col justify-end w-full ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <ul className="flex flex-col items-start justify-center w-full font-bold text-white h-2/4 gap-y-5 ">
            {projects.map((project, index) => (
              <li
                key={index}
                className="flex items-center w-full text-lg group list-items"
                onClick={() => handleMenu(project)}
              >
                {project.title}
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-end w-full h-full ">
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
