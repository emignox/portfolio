import { MdArrowOutward } from "react-icons/md";
import { projects } from "./project-data";

const hostname = (link: string) => new URL(link).hostname.replace("www.", "");

function SelectedWork() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="px-4 mx-auto max-w-5xl">
      <h2 className="mt-32 mb-3 text-3xl font-bold text-center text-white lg:text-5xl">
        Selected work
      </h2>
      <p className="mb-12 text-center text-white/70">
        Live products I designed and built.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {featured.map((project) => (
          <li key={project.link}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden transition duration-300 border group rounded-2xl border-white/20 bg-black/25 backdrop-blur-md hover:-translate-y-1 hover:border-white/50"
            >
              <div className="overflow-hidden aspect-[16/9]">
                <img
                  src={project.img}
                  alt={project.title}
                  loading="lazy"
                  className="object-cover object-top w-full h-full transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/70">
                    {project.tag} · {hostname(project.link)}
                  </p>
                </div>
                <MdArrowOutward className="text-2xl text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SelectedWork;
