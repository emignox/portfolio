import Cv from "./cv-button";
import { MdArrowOutward } from "react-icons/md";
import { useRef } from "react";

const links = [
  {
    name: "Nemei",
    url: "https://nemei.app",
  },
  {
    name: "EP Sportwear",
    url: "https://epsportwear.com",
  },
  {
    name: "Github",
    url: "https://github.com/emignox",
  },
  {
    name: "Linkedin",
    url: "https://www.linkedin.com/in/emanuele-polizzotto-37ba961a2/",
  },
  {
    name: "Email",
    url: "mailto:emanuele971@icloud.com", // Sostituisci con il tuo indirizzo email
  },
];
function Contact() {
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const message = messageRef.current?.value;
    if (message) {
      window.location.href = `mailto:emanuele971@icloud.com?body=${encodeURIComponent(
        message
      )}`;
    }
  };
  return (
    <section className="flex flex-col justify-between min-h-screen px-5 py-16 mx-auto max-w-5xl lg:px-0">
      <div>
        <p className="mb-4 text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.25em] text-white/60 uppercase">
          Contact
        </p>
        <h2 className="text-5xl font-bold leading-tight text-white lg:text-8xl">
          Let's work
          <br />
          <span className="text-white/60">together</span>
        </h2>
      </div>

      <div className="flex flex-col items-start w-full my-16 gap-8">
        <form
          className="flex flex-col items-start w-full gap-4"
          onSubmit={handleSubmit}
        >
          <label htmlFor="message" className="text-xl font-semibold text-white/90">
            Send me a message
          </label>
          <textarea
            id="message"
            ref={messageRef}
            rows={3}
            placeholder="Tell me about your project…"
            name="message"
            className="w-full p-4 text-xl text-white transition placeholder-white/40 border rounded-2xl border-white/20 bg-white/5 backdrop-blur-sm focus:border-white/60 focus:outline-none"
          ></textarea>
          <button
            type="submit"
            className="flex items-center justify-center px-8 py-3 text-lg font-semibold text-black transition duration-500 ease-in-out bg-white border border-white group rounded-full hover:text-white hover:bg-transparent"
          >
            Send
            <MdArrowOutward className="mx-3 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </form>
        <div>
          <Cv text="Download my Resume" />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.25em] text-white/60 uppercase">
          Or reach me through here
        </h3>
        <ul className="flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                {...(link.url.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex items-center px-5 py-2.5 text-lg text-white transition border rounded-full group border-white/25 bg-white/5 hover:border-white/60 hover:bg-white/10"
              >
                {link.name}
                <MdArrowOutward className="ml-2 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Contact;
