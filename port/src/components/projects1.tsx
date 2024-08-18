import { useState } from "react";
import { projects, Project } from "./project-data";
import Nav_projects from "./project-nav";
import Sound from "./sound";function Projects() {
  const [currentProject, setCurrentProject] = useState(projects[0]); // Set default project
  const [isVisible, setIsVisible] = useState(false);

  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
    setIsVisible(false);
    handleVisible();
  };

  const handleVisible = () => {
    setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  };

  return (
    <>
            <Nav_projects onProjectClick={handleProjectClick} />

      <div
        className={`flex flex-col items-center justify-center ${isVisible ? "" : "fade-project"}   lg:h-[85vh] pb-10 md:pb-0`}
      >
        {projects.map((project, index) => (
          <div key={index} onClick={() => handleProjectClick(project)}>
            {project === currentProject && (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-y-6 lg:justify-center lg:items-center lg:px-32 "
              >
                <h2 className="md:text-5xl font-black text-center text-2xl text-white">
                  {project.title}
                </h2>
                <img
                  className={`w-full px-3 cursor-pointer rounded-3xl lg:w-4/6 brightness-90 `}
                  src={project.img}
                  alt={project.title}
                  onClick={() => window.open(project.link, "_blank")}
                  loading="lazy"
                />
                <div className="flex flex-col items-center gap-y-5">
                  <p className="w-4/5 text-xl font-thin text-white text-start ">
                    {project.description.info}
                  </p>
                  <button>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-2 font-thin text-white transition-all duration-300 border border-white rounded-lg hover:bg-white hover:text-black"
                    >
                      See project
                    </a>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <Sound className="" />
      </div>
    </>
  );
}
export default Projects