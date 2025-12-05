import { useState } from "react";
import { projects, Project } from "./project-data";
import Nav_projects from "./project-nav";
import Sound from "./sound";

function Projects() {
  const [currentProject, setCurrentProject] = useState(projects[0]);
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

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    window.open(link, "_blank");
  };

  return (
    <>
      <Nav_projects onProjectClick={handleProjectClick} />
      <div
        className={`flex flex-col items-center justify-center ${
          isVisible ? "fade-in" : "fade-project"
        } min-h-screen lg:min-h-[85vh]`}
      >
        {projects.map((project, index) => (
          <div key={index} onClick={() => handleProjectClick(project)}>
            {project === currentProject && (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-y-8 lg:px-32 w-full py-10"
              >
                {/* Title with gradient */}
                <h2 className="text-3xl font-black text-center bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent md:text-6xl drop-shadow-lg">
                  {project.title}
                </h2>

                {/* Image with hover effect - zoom out */}
                <div className="relative w-full px-3 overflow-hidden cursor-pointer group lg:w-4/6 ">
                  <img
                    className="w-full transition-all duration-500 transform  brightness-90 group-hover:brightness-100"
                    src={project.img}
                    alt={project.title}
                    onClick={(e) => handleLinkClick(e, project.link)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t  via-transparent to-transparent group-hover:opacity-100" />
                </div>

                {/* Description with better visibility */}
                <div className="flex flex-col items-center w-full gap-y-6">
                  <div className="w-full md:w-3/5 px-6 py-4 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 shadow-xl">
                    <p className="text-lg leading-relaxed text-white font-light">
                      {project.description.info}
                    </p>
                  </div>

                  {/* Button with glow effect */}
                  <div className="relative group inline-block">
                    <div className="absolute  bg-gradient-to-r  from-black to-white rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block px-10 py-3 font-medium text-white transition-all duration-300 border border-white/30 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-white/10 hover:scale-105"
                    >
                      Project →
                    </a>
                  </div>
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

export default Projects;
