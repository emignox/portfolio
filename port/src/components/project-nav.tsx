import { useState } from "react";
import { projects, Project } from "./project-data";
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
      <h1
        className={`fixed top-1/4 right-0 z-10 text-xl  cursor-pointer text-white  bg-custom-black backdrop-filter-[blur(10px)] border px-2 py-2 font-thin   rounded-lg transition-all duration-400 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
        onMouseEnter={() => setIsMenuOpen(true)}
      >
        My works
      </h1>
      <div
        className={`fixed top-1/4 right-0 z-10 max-h-[50vh]   p-5 transition-all duration-400 transform rounded-s-xl border overflow-y-auto bg-custom-black backdrop-filter-[blur(10px)] shadow-2xl flex items-start justify-end ${isMenuOpen ? "-translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"} `}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div
          className={`p-5 transition-all h-full duration-400 transform flex flex-col  justify-end w-full overflow-y-auto ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-center justify-between w-full h-full ">
            <h1 className="py-5 text-2xl text-center text-white font-bolder">
              Check my Projects
            </h1>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="relative font-thin text-white bottom-10"
            >
              close <IoCloseSharp className="inline" />{" "}
            </button>
          </div>

          <ul className="flex flex-col items-start justify-center w-full h-auto font-bold text-white gap-y-5">
            {projects.map((project, index) => (
              <li
                key={index}
                className="flex items-center w-full text-lg border-b border-[#444] group list-items  font-light"
                onClick={() => handleMenu(project)}
              >
                {project.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidebarProjects;
