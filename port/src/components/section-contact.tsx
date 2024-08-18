import Cv from "./cv-button";
import { MdArrowOutward } from "react-icons/md";
import { useRef } from "react";

const links = [
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
    <>
      <section className="flex flex-col justify-between h-screen pt-5">
        <h1 className="mx-4 text-5xl font-bold text-white text-start lg:text-8xl">
          Let's Work together
        </h1>
        <div className="flex flex-col items-start justify-start w-full p-5 my-3 space-y-32 ">
          <h2 className="text-3xl font-bold text-white opacity-90">
            Send me a message
          </h2>
          <form
            className="flex flex-col items-start justify-start w-full"
            onSubmit={handleSubmit}
          >
            <label className="w-full h-32 text-white">
              <textarea
                ref={messageRef}
                placeholder="Your message here"
                name="message"
                className="w-full p-1 text-3xl placeholder-white bg-transparent border-none rounded focus:outline-none placeholder-opacity-80"
              ></textarea>
            </label>
            <button
              type="submit"
              className="flex items-center justify-center w-32 p-2 mt-2 text-xl text-black transition duration-500 ease-in-out bg-white border group rounded-3xl hover:text-white hover:bg-transparent"
            >
              send{" "}
              <MdArrowOutward className="mx-3 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </form>
          <div className="hidden md:block"><Cv text="Download my Resume" />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start  my-12 space-y-3 lg:space-y-0 h-1/2 lg:flex lg:flex-row lg:pb-0">
          <h1 className="mx-12 text-xl text-white lg:text-3xl">
            Or reach me through here:
          </h1>

          {links.map((link, index) => (
            <ul className="" key={index}>
              <a href={link.url}>
                <li className="flex items-center justify-center mx-12 text-3xl text-white border-b cursor-pointer group">
                  {link.name}
                  <MdArrowOutward className="mx-3 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </li>
              </a>
            </ul>
          ))}
        </div>
      </section>
    </>
  );
}

export default Contact;
