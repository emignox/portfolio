import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MdArrowOutward } from "react-icons/md";
import { projects, Project } from "./project-data";
import Nav_projects from "./project-nav";
import Sound from "./sound";

// miniatura + anteprima video: il video compare in dissolvenza solo quando è pronto a partire
function ProjectMedia({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(false), [project]);

  return (
    <>
      <img
        src={project.img}
        alt={project.title}
        className="w-full h-full object-cover object-top transition-all duration-1000 group-hover/img:scale-110 group-hover/img:rotate-1 filter group-hover/img:brightness-110"
        loading="lazy"
      />
      {project.video && !reduceMotion && (
        <video
          key={project.video}
          src={project.video}
          poster={project.img}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden
          onCanPlay={() => setReady(true)}
          onError={() => setReady(false)}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}

function Projects() {
  const [currentProject, setCurrentProject] = useState(projects[0]);
  const [isVisible, setIsVisible] = useState(true);

  // ultimo progetto richiesto: frecce premute in fila partono da qui, non dal progetto ancora in dissolvenza
  const targetRef = useRef(projects[0]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleProjectClick = (project: Project) => {
    targetRef.current = project;
    setIsVisible(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentProject(project);
      setIsVisible(true);
    }, 300);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCardClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const currentIndex = projects.indexOf(currentProject);
  const goTo = (offset: number) =>
    handleProjectClick(
      projects[
        (projects.indexOf(targetRef.current) + offset + projects.length) %
          projects.length
      ]
    );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "ArrowLeft") goTo(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // inclinazione 3D della miniatura col mouse: niente stato React, si scrive solo lo style
  const tiltRef = useRef<HTMLDivElement>(null);
  const handleTilt = (e: React.MouseEvent) => {
    const el = tiltRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  };
  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  const featured = projects.filter((p) => p.featured);
  const hostname = (link: string) => new URL(link).hostname.replace("www.", "");

  return (
    <>
      <div className="page-scrim" />
      <Nav_projects
        onProjectClick={handleProjectClick}
        current={currentProject}
      />

      <div className="relative lg:min-h-[85vh] py-8 md:py-20 px-4 md:pl-28 md:pr-8 lg:pl-32 lg:pr-12 overflow-hidden flex items-center justify-center">
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
              <div className="grid lg:grid-cols-[1.25fr_1fr] gap-6 lg:gap-10 p-5 sm:p-8 lg:p-10">

                {/* Left Side - Image */}
                <div
                  ref={tiltRef}
                  onMouseMove={handleTilt}
                  onMouseLeave={resetTilt}
                  className="relative self-center overflow-hidden rounded-2xl group/img will-change-transform transition-transform duration-200 ease-out"
                >
                  {/* Animated Border - Monochrome */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-white to-gray-400 opacity-0 group-hover/img:opacity-30 transition-opacity duration-500" style={{ padding: '2px' }} />

                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <ProjectMedia project={currentProject} />

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
                <div className="flex flex-col justify-center space-y-6 lg:space-y-8">

                  <div className="flex items-center justify-between text-sm tracking-wider text-gray-300">
                    <span className="uppercase">
                      {String(currentIndex + 1).padStart(2, "0")} /{" "}
                      {String(projects.length).padStart(2, "0")}
                    </span>
                    {currentProject.featured && (
                      <span className="px-3 py-1 text-xs font-semibold text-white uppercase border rounded-full border-white/40 bg-white/10">
                        Featured · Live
                      </span>
                    )}
                  </div>

                  {/* Title with Gradient - Monochrome */}
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                    {currentProject.title}
                  </h2>

                  {currentProject.tag && (
                    <p className="-mt-3 text-sm tracking-[0.2em] text-gray-300 uppercase">
                      {currentProject.tag}
                    </p>
                  )}

                  {/* Technologies Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2 text-3xl">
                      {currentProject.description.tech.map((Tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-gray-300 transition-all duration-300 hover:text-white hover:scale-125 hover:-rotate-12 cursor-pointer p-2 rounded-lg hover:bg-white/10"
                          style={{ transitionDelay: `${techIndex * 50}ms` }}
                        >
                          {Tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                      About This Project
                    </h3>
                    <p className="text-gray-100 text-base lg:text-lg leading-relaxed">
                      {currentProject.description.info}
                    </p>
                  </div>

                  {/* CTA Button - Monochrome */}
                  <div className="pt-2">
                    <a
                      href={currentProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/30 text-white font-semibold transition-all duration-500 hover:scale-105 hover:border-white/50 hover:shadow-lg hover:shadow-white/30 hover:bg-white/20 group/btn"
                    >
                      <span className="tracking-wider">
                        VISIT {hostname(currentProject.link).toUpperCase()}
                      </span>
                      <MdArrowOutward className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </a>
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

        <Sound className="flex items-center justify-center w-12 h-12 text-white border-2 rounded-full bg-black/30 backdrop-blur-md" />
      </div>

      <div className="px-4 pb-28 text-white md:pl-28 md:pr-8 lg:pl-32 lg:pr-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-4 mb-10 md:mb-12 -mt-2">
            <button
              onClick={() => goTo(-1)}
              aria-label="Previous project"
              className="px-5 py-2 transition border rounded-full border-white/40 bg-black/30 backdrop-blur-md hover:bg-white/15"
            >
              ← Prev
            </button>
            <button
              onClick={() => goTo(1)}
              aria-label="Next project"
              className="px-5 py-2 transition border rounded-full border-white/40 bg-black/30 backdrop-blur-md hover:bg-white/15"
            >
              Next →
            </button>
          </div>

          <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
            Live projects
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <li key={project.link}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 transition border group rounded-2xl border-white/25 bg-black/25 backdrop-blur-md hover:border-white/50 hover:bg-white/10"
                >
                  <span>
                    <span className="block text-lg font-semibold">
                      {project.title}
                    </span>
                    <span className="text-sm text-gray-300">
                      {hostname(project.link)}
                    </span>
                  </span>
                  <MdArrowOutward className="text-2xl transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Projects;
