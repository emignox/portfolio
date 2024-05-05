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
      <div className="flex flex-col items-center">
        <h1 className="text-2xl pb-10 text-white font-black">MY PROJECTS</h1>
        <Nav_projects onProjectClick={handleProjectClick} />

        {projects.map((project, index) => (
          <div key={index} onClick={() => handleProjectClick(project)}>
            {project === currentProject && (
              <div className="flex flex-col items-center justify-center gap-y-6  lg:flex lg:flex-row lg:justify-center lg:items-center lg:mt-32 lg:px-32 ">
                <img
                  className="w-full px-3 rounded-3xl  lg:w-2/5"
                  src={project.img}
                  alt={project.title}
                />
                <div className="flex flex-col items-center gap-y-5">
                  <h2 className="text-center text-white text-3xl font-black">
                    {project.title}
                  </h2>
                  <p className="w-3/4 text-white text-justify text-2xl ">
                    {project.description.info}
                  </p>
                  <button>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white py-2 px-2 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300"
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
