import { useEffect, useRef, useState } from "react";
import { projects, Project } from "./project-data";
import { IoCloseSharp } from "react-icons/io5";


interface SidebarProjectsProps {
  onProjectClick: (project: Project) => void;
  current?: Project;
}

// Definire e esportare il componente MenuProjectMobile
/// menu mobile 
export const MenuProjectMobile: React.FC<SidebarProjectsProps> = ({
  onProjectClick,
  current,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);

  // tiene il chip attivo visibile anche quando cambia con Prev/Next o con le frecce
  useEffect(() => {
    const list = listRef.current;
    const item = activeRef.current;
    if (!list || !item) return;
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [current]);

  const handleMenu = (project: Project) => {
    onProjectClick(project);
  };

  return (
    <>
      <ul
        ref={listRef}
        className="relative flex gap-2 items-center overflow-x-auto no-scrollbar md:hidden w-full h-auto font-bold text-white px-3 py-2"
      >
        {projects.map((project, index) => (
          <li
            key={index}
            ref={current === project ? activeRef : undefined}
            className={`px-4 py-2 flex-shrink-0 whitespace-nowrap text-sm border rounded-full list-items font-medium cursor-pointer transition-colors duration-300 ${
              current === project
                ? "bg-white text-black border-white"
                : "bg-black/40 backdrop-blur-md border-white/40 text-white"
            }`}
            onClick={() => handleMenu(project)}
          >
            {project.title}
          </li>
        ))}
      </ul>
    </>
  );
};
// Definire e esportare il componente SidebarProjects
export const SidebarProjects: React.FC<SidebarProjectsProps> = ({
  onProjectClick,
  current,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenu = (project: Project) => {
    onProjectClick(project);
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
  };
// menu big screen 
  return (
    <>
      {/* Utilizzo del componente MenuProjectMobile */}
      <MenuProjectMobile onProjectClick={onProjectClick} current={current} />

      <h1
        className={`fixed top-[170px] left-0 z-10 text-xl hidden md:block cursor-pointer text-white bg-black/40 backdrop-blur-md border border-l-0 border-white/30 px-4 py-2 font-light rounded-r-xl transition-all duration-400 ${
          isMenuOpen ? "opacity-0" : "opacity-100"
        }`}
        onMouseEnter={() => setIsMenuOpen(true)}
        onClick={() => setIsMenuOpen(true)}
      >
        My works
      </h1>
      <div
        className={`fixed top-[170px] left-0 z-10 max-h-[60vh] bg-black/60 p-2 transition-all duration-400 transform rounded-r-xl border border-l-0 border-white/25 overflow-y-auto backdrop-blur-xl shadow-2xl flex items-start justify-end ${
          isMenuOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-0 opacity-0 pointer-events-none"
        }`}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div
          className={`p-5 transition-all h-full duration-400 transform flex flex-col justify-end w-full overflow-y-auto ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
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
                className="flex items-center w-full cursor-pointer text-lg  group  font-light button-border-animate"
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
