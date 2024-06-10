import { useState } from "react";
import { projects, Project } from "./project-data";
import Nav_projects from "./project-nav";

function Projects() {
  const [currentProject, setCurrentProject] = useState(projects[0]); // Set default project
  const [isVisible, setIsVisivle] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
    setIsVisivle(false);
    handleVisible();
  };
  const handleVisible = () => {
    setTimeout(() => {
      setIsVisivle(true);
    }, 300);
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center ${isVisible ? "" : "fade-project"}   lg:h-[85vh] pb-10 md:pb-0`}
      >
        <Nav_projects onProjectClick={handleProjectClick} />

        {projects.map((project, index) => (
          <div key={index} onClick={() => handleProjectClick(project)}>
            {project === currentProject && (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-y-6 lg:justify-center lg:items-center lg:px-32 "
              >
                <h2 className="text-3xl font-black text-center text-white">
                  {project.title}
                </h2>
                <>
                  {!isLoaded && (
                    // Questo sarà visualizzato mentre l'immagine si sta caricando
                    <div className="loader"></div>
                  )}
                  <img
                    className="w-full px-3 cursor-pointer rounded-3xl lg:w-4/6 brightness-90"
                    src={project.img}
                    alt={project.title}
                    style={isLoaded ? {} : { display: "none" }} // Nasconde l'immagine finché non è caricata
                    onLoad={() => setIsLoaded(true)} // Imposta isLoaded a true quando l'immagine è caricata
                    onClick={() => window.open(project.link, "_blank")}
                  />
                </>
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
      </div>
    </>
  );
}

export default Projects;
