import { useState } from "react";
import { projects, Project } from "./project-data";
import Nav_projects from "./project-nav";
import Video from "./background-video";

function Projects() {
  const [currentProject, setCurrentProject] = useState(projects[0]); // Set default project

  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
  };

  return (
    <>
      <Video />
      <h1 className="pb-10 text-2xl font-black text-center text-white lg:pb-0">
        MY PROJECTS
      </h1>

      <div className="flex flex-col items-center justify-center  lg:h-[85vh]">
        <Nav_projects onProjectClick={handleProjectClick} />

        {projects.map((project, index) => (
          <div key={index} onClick={() => handleProjectClick(project)}>
            {project === currentProject && (
              <div className="flex flex-col items-center justify-center gap-y-6 lg:flex lg:flex-row lg:justify-center lg:items-center lg:px-32 ">
                <img
                  className="w-full px-3 rounded-3xl lg:w-2/5"
                  src={project.img}
                  alt={project.title}
                />
                <div className="flex flex-col items-center gap-y-5">
                  <h2 className="text-3xl font-black text-center text-white">
                    {project.title}
                  </h2>
                  <p className="w-3/4 text-2xl text-justify text-white ">
                    {project.description.info}
                  </p>
                  <button>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-2 text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white hover:text-black"
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
