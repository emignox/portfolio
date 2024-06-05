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
        className={`fixed top-1/4 right-0 z-10 text-5xl font-black cursor-pointer text-white bg-gray-900 px-2 py-2   rounded-lg transition-all duration-400 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
        onMouseEnter={() => setIsMenuOpen(true)}
      />
      <div
        className={`fixed top-1/4 right-0 z-10 max-h-[50vh] p-5 transition-all duration-400 transform rounded-s-xl overflow-y-auto  bg-gray-900 shadow-2xl flex items-start justify-end ${isMenuOpen ? "-translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div
          className={`p-5 transition-all h-full duration-400 transform flex flex-col  justify-end w-full overflow-y-auto ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <h1 className="py-5 text-2xl font-black text-center text-white underline">
            Choose a project
          </h1>
          <ul className="flex flex-col items-start justify-center w-full h-auto font-bold text-white gap-y-5">
            {projects.map((project, index) => (
              <li
                key={index}
                className="flex items-center w-full text-lg border-b border-[#444] group list-items"
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
