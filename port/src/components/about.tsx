import Nav from "./nav";
import Sound from "./sound";
import { useState, useEffect } from "react";
import Button from "./button-work";
import Reason from "./reason";
import Skills from "./skills";
import Sentence from "./sentence";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Contact from "./section-contact";

const words = [
  "welcome",
  "Benvenuto",
  "Bienvenido",
  "Willkommen",
  "Bienvenue",
  "歡迎",
  "ようこそ",
];
let index = 0;

export function About() {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Imposta l'overflow del body a hidden quando il componente viene montato
    document.body.style.height = "auto";

    return () => {
      // Reimposta l'overflow del body a quello che era prima quando il componente viene smontato
      document.body.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 secondi

    return () => clearTimeout(timer); // Pulisce il timer quando il componente si smonta
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      index = index + 1 === words.length ? 0 : index + 1;
      setCurrentWord(words[index]);
    }, 5000); // Cambia parola ogni 2 secondi

    return () => clearInterval(interval); // Pulisce l'intervallo quando il componente si smonta
  }, []);
  //animazione testi
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: false,
  });

  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: false,
  });
  const { ref: ref3, inView: inView3 } = useInView({
    triggerOnce: false,
  });
  const { ref: ref4, inView: inView4 } = useInView({
    triggerOnce: false,
  });

  return (
    <>
      {isLoading && <div className="loading-overlay">Charging...</div>}
      <div className=" h-screen">
        <video
          id="video"
          className="fixed top-0 left-0 w-full h-screen z-[-10] m-0 p-0 border-none object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={{
            filter: "blur(40px) brightness(70%)",
          }}
        >
          <source
            src="https://stockema.s3.eu-north-1.amazonaws.com/production_id_4779866+(1080p).mp4"
            type="video/mp4"
          />
          Il tuo browser non supporta il tag video.
        </video>
        <Nav className="" />
        <Button />
        <div className="  flex justify-center items-center flex-col h-3/5  ">
          <div className="font-black text-4xl  lg:text-8xl    text-white fade-in-out h-1/4   ">
            {currentWord}
          </div>
          <div className=" w-10 h-10  fixed  bottom-10 m-2 right-3 ">
            <Sound className=" border-2 rounded-full text-white h-12 w-12 flex justify-center  items-center   " />
          </div>
        </div>
        <motion.div
          ref={ref1}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView1 ? 1 : 0 }}
          drag="x"
          className="flex  items-start w-full   "
        >
          <Reason />
        </motion.div>
        <motion.div
          ref={ref2}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView2 ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <Skills />
        </motion.div>
        <motion.div
          ref={ref3}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView3 ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <Sentence />
        </motion.div>

        <motion.div
          ref={ref4}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView4 ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <Contact />
        </motion.div>
      </div>
    </>
  );
}

export default About;
