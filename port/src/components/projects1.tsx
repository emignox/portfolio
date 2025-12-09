import { useState } from "react";
import { projects, Project } from "./project-data";
import Nav_projects from "./project-nav";
import Sound from "./sound";

function Projects() {
  const [currentProject, setCurrentProject] = useState(projects[0]);
  const [isVisible, setIsVisible] = useState(true);

  const handleProjectClick = (project: Project) => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentProject(project);
      setIsVisible(true);
    }, 300);
  };

  const handleCardClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <>
      <Nav_projects onProjectClick={handleProjectClick} />

      <div className="relative min-h-screen lg:min-h-[85vh] py-20 px-4 lg:px-12 overflow-hidden flex items-center justify-center">
        {/* Animated Background Elements - Monochrome */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        </div>

        {/* Project Display */}
        <div
          className={`relative w-full max-w-6xl transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div
            onClick={() => handleCardClick(currentProject.link)}
            className="group relative cursor-pointer"
          >
            {/* Floating Glow Effect - Monochrome */}
            <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 hover:border-white/40 hover:scale-[1.01] shadow-2xl hover:shadow-white/20">

              {/* Corner Accents - Monochrome */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content Container */}
              <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">

                {/* Left Side - Image */}
                <div className="relative overflow-hidden rounded-2xl group/img">
                  {/* Animated Border - Monochrome */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-white to-gray-400 opacity-0 group-hover/img:opacity-30 transition-opacity duration-500" style={{ padding: '2px' }} />

                  <div className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-2xl">
                    <img
                      src={currentProject.img}
                      alt={currentProject.title}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover/img:scale-110 group-hover/img:rotate-1 filter group-hover/img:brightness-110"
                      loading="lazy"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/img:opacity-30 transition-all duration-500" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover/img:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Click Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-500">
                      <div className="px-8 py-4 bg-black/80 backdrop-blur-md rounded-full border border-white/40 text-white font-semibold text-lg">
                        Click to Visit →
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex flex-col justify-center space-y-8">

                  {/* Title with Gradient - Monochrome */}
                  <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                    {currentProject.title}
                  </h2>

                  {/* Technologies Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-4 text-3xl">
                      {currentProject.description.tech.map((Tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-gray-400 transition-all duration-300 hover:text-white hover:scale-125 hover:-rotate-12 cursor-pointer p-2 rounded-lg hover:bg-white/10"
                          style={{ transitionDelay: `${techIndex * 50}ms` }}
                        >
                          {Tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                      About This Project
                    </h3>
                    <p className="text-gray-200 text-lg leading-relaxed">
                      {currentProject.description.info}
                    </p>
                  </div>

                  {/* CTA Button - Monochrome */}
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/30 text-white font-semibold transition-all duration-500 hover:scale-105 hover:border-white/50 hover:shadow-lg hover:shadow-white/30 hover:bg-white/20 group/btn">
                      <span className="tracking-wider">VISIT PROJECT</span>
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Gradient Line - Monochrome */}
              <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />

              {/* Radial Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 via-transparent to-transparent blur-3xl" />
              </div>

              {/* Particle Effects */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '200ms' }} />
            </div>
          </div>
        </div>

        <Sound className="absolute bottom-10 right-10" />
      </div>
    </>
  );
}

export default Projects;
