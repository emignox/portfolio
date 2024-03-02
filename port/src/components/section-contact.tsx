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
      <section className="h-screen flex flex-col   pt-5 justify-between">
        <h1 className="text-white text-start text-5xl lg:text-8xl font-bold mx-4">
          Let's Work together
        </h1>
        <div className="   flex flex-col  space-y-32 my-12  w-full  items-start justify-start   p-5">
          <h2 className="text-white text-3xl font-bold opacity-90">
            Send me a message
          </h2>
          <form
            className="flex flex-col items-start justify-start w-full"
            onSubmit={handleSubmit}
          >
            <label className="text-white w-full h-32">
              <textarea
                ref={messageRef}
                placeholder="Your message here"
                name="message"
                className="text-3xl focus:outline-none rounded p-1 w-full placeholder-white placeholder-opacity-80 bg-transparent border-none"
              ></textarea>
            </label>
            <button
              type="submit"
              className="bg-white text-black w-32 text-xl rounded-3xl p-2 mt-2 hover:text-white hover:bg-transparent border transition duration-500 ease-in-out"
            >
              send <MdArrowOutward className="inline" />
            </button>
          </form>
          <Cv text="Download my Resume" />
        </div>
        <div className="flex flex-col h-1/2 justify-start items-start my-12  pb-32 lg:flex lg:flex-row lg:pb-0">
          <h1 className="text-white mx-12 text-xl lg:text-3xl">
            Or reach me through here:
          </h1>

          {links.map((link, index) => (
            <ul className="" key={index}>
              <a href={link.url}>
                <li className="text-white mx-12 text-3xl border-b cursor-pointer">
                  {link.name}
                  <MdArrowOutward className="inline" />
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
