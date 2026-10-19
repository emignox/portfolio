import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MdArrowOutward } from "react-icons/md";
import { projects, Project } from "./project-data";
import Nav_projects from "./project-nav";
import Sound from "./sound";
import { useLocation } from "react-router-dom";
import { spaceFocus, PLANET_OF_PROJECT } from "../space/director";

// nome e colore (quello dell'atmosfera) del pianeta di ogni progetto, per il badge nella scheda
const PLANETS: Record<string, { name: string; color: string }> = {
  nemei: { name: "Earth", color: "#3d7bff" },
  ep: { name: "Mars", color: "#ff9966" },
  reader: { name: "Jupiter", color: "#ffdb9e" },
  odoo: { name: "Saturn", color: "#ffe09e" },
  radar: { name: "Uranus", color: "#80e6ff" },
  piano: { name: "Neptune", color: "#4d9eff" },
};

const planetOf = (project: Project) => PLANET_OF_PROJECT[project.title] ?? null;

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
  // arrivando dalla home con un clic su un pianeta (#/scroll?p=nemei) si parte da quel progetto
  const { search } = useLocation();
  const [initial] = useState(() => {
    const planet = new URLSearchParams(search).get("p");
    return projects.find((p) => PLANET_OF_PROJECT[p.title] === planet) ?? projects[0];
  });
  const [currentProject, setCurrentProject] = useState(initial);
  const [isVisible, setIsVisible] = useState(true);

  // ultimo progetto richiesto: frecce premute in fila partono da qui, non dal progetto ancora in dissolvenza
  const targetRef = useRef(initial);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleProjectClick = (project: Project) => {
    targetRef.current = project;
    // la camera parte subito verso il pianeta, mentre la scheda vecchia sta ancora sparendo
    spaceFocus.current = planetOf(project);
    setIsVisible(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentProject(project);
      setIsVisible(true);
    }, 300);
  };

  useEffect(() => {
    spaceFocus.current = planetOf(targetRef.current);
    return () => {
      clearTimeout(timerRef.current);
      spaceFocus.current = null;
    };
  }, []);

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
  const planetId = planetOf(currentProject);
  const planet = planetId ? PLANETS[planetId] : undefined;

  // colonna dei contenuti: da lg in poi sta a destra, la parte sinistra resta libera per il pianeta
  const column =
    "px-4 md:pl-28 md:pr-8 lg:ml-[43vw] lg:pl-6 lg:pr-12 xl:pr-16";
  const track = "w-full max-w-2xl mx-auto lg:max-w-[720px]";

  return (
    <>
      <div className="page-scrim" />

      {/* finestra sul pianeta: sotto lg il pianeta sta in alto, tra il logo e i chip dei progetti */}
      <div aria-hidden className="lg:hidden h-[calc(38vh-80px)]" />

      <Nav_projects
        onProjectClick={handleProjectClick}
        current={currentProject}
      />

      <section
        aria-label="Selected project"
        className={`relative flex flex-col items-center justify-center pt-4 pb-6 md:pt-6 lg:min-h-[calc(100vh-80px)] lg:py-10 ${column}`}
      >
        {/* Project Display */}
        <div
          className={`relative ${track} transition-all duration-500 ease-out ${
            isVisible
              ? "opacity-100 translate-x-0 translate-y-0"
              : "opacity-0 translate-y-8 lg:translate-y-0 lg:translate-x-12"
          }`}
        >
          <div
            onClick={() => handleCardClick(currentProject.link)}
            className="group relative cursor-pointer"
          >
            {/* Floating Glow Effect - Monochrome */}
            <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* Main Card */}
            {/* base scura: il vetro resta leggibile anche davanti al sole o a un pianeta chiaro */}
            <div className="relative bg-[rgba(6,8,18,0.55)] backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 hover:border-white/40 hover:scale-[1.01] shadow-2xl shadow-black/40 hover:shadow-white/20">

              <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.10] via-white/[0.03] to-transparent" />

              {/* Corner Accents - Monochrome */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Media in cima alla scheda */}
              <div
                ref={tiltRef}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className="relative m-3 mb-0 sm:m-4 sm:mb-0 overflow-hidden rounded-2xl group/img will-change-transform transition-transform duration-200 ease-out"
              >
                {/* Animated Border - Monochrome */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-white to-gray-400 opacity-0 group-hover/img:opacity-30 transition-opacity duration-500" style={{ padding: '2px' }} />

                <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[clamp(170px,29vh,300px)] overflow-hidden rounded-2xl">
                  <ProjectMedia project={currentProject} />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/img:opacity-30 transition-all duration-500" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover/img:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Click Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-500">
                    <div className="px-6 py-3 bg-black/80 backdrop-blur-md rounded-full border border-white/40 text-white font-semibold">
                      Click to Visit →
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative flex flex-col gap-4 p-5 sm:p-7 lg:gap-5">

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm tracking-wider text-gray-300">
                  <span className="uppercase tabular-nums">
                    {String(currentIndex + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                  <span className="flex flex-wrap items-center justify-end gap-2">
                    {planet && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white uppercase border rounded-full border-white/25 bg-black/30">
                        <span
                          aria-hidden
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: planet.color,
                            boxShadow: `0 0 10px 2px ${planet.color}`,
                          }}
                        />
                        Planet · {planet.name}
                      </span>
                    )}
                    {currentProject.featured && (
                      <span className="px-3 py-1 text-xs font-semibold text-white uppercase border rounded-full border-white/40 bg-white/10">
                        Featured · Live
                      </span>
                    )}
                  </span>
                </div>

                <div>
                  {/* Title with Gradient - Monochrome */}
                  <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                    {currentProject.title}
                  </h2>

                  {currentProject.tag && (
                    <p className="mt-1 text-sm tracking-[0.2em] text-gray-300 uppercase">
                      {currentProject.tag}
                    </p>
                  )}
                </div>

                <p className="text-gray-100 text-[15px] sm:text-base leading-relaxed">
                  {currentProject.description.info}
                </p>

                {/* Technologies + CTA */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-1 text-2xl">
                    <span className="sr-only">Technologies:</span>
                    {currentProject.description.tech.map((Tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-gray-300 transition-all duration-300 hover:text-white hover:scale-125 hover:-rotate-12 cursor-pointer p-1.5 rounded-lg hover:bg-white/10"
                        style={{ transitionDelay: `${techIndex * 50}ms` }}
                      >
                        {Tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm bg-white/10 backdrop-blur-md rounded-full border border-white/30 text-white font-semibold transition-all duration-500 hover:scale-105 hover:border-white/50 hover:shadow-lg hover:shadow-white/30 hover:bg-white/20 group/btn"
                  >
                    <span className="tracking-wider">
                      VISIT {hostname(currentProject.link).toUpperCase()}
                    </span>
                    <MdArrowOutward className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </a>
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

        {/* Prev / indicatore / Next */}
        <div className={`${track} flex items-center justify-between sm:justify-center gap-3 sm:gap-5 mt-5 text-white`}>
          <button
            onClick={() => goTo(-1)}
            aria-label="Previous project"
            className="flex-shrink-0 px-5 py-2 transition border rounded-full border-white/40 bg-black/45 backdrop-blur-md hover:bg-white/15"
          >
            ← Prev
          </button>
          {/* un punto per progetto (piu' chiaro se ha un pianeta); su mobile ci sono gia' i chip */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-0.5 px-2 border rounded-full border-white/10 bg-black/35 backdrop-blur-md">
            {projects.map((project) => (
              <button
                key={project.link}
                onClick={() => handleProjectClick(project)}
                aria-label={`Show ${project.title}`}
                aria-current={project === currentProject ? "true" : undefined}
                className="flex items-center justify-center h-6 px-[3px] group/dot"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    project === currentProject
                      ? "w-5 bg-white"
                      : `w-1.5 group-hover/dot:bg-white/80 ${
                          planetOf(project) ? "bg-white/55" : "bg-white/25"
                        }`
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => goTo(1)}
            aria-label="Next project"
            className="flex-shrink-0 px-5 py-2 transition border rounded-full border-white/40 bg-black/45 backdrop-blur-md hover:bg-white/15"
          >
            Next →
          </button>
        </div>
      </section>

      <section className={`pt-6 pb-28 text-white lg:pt-2 ${column}`}>
        <div className={track}>
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
            Live projects
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {featured.map((project) => (
              <li key={project.link}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 transition border group rounded-2xl border-white/25 bg-black/40 backdrop-blur-md hover:border-white/50 hover:bg-white/10"
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
      </section>

      <Sound className="flex items-center justify-center w-12 h-12 text-white border-2 rounded-full bg-black/30 backdrop-blur-md" />
    </>
  );
}

export default Projects;
