import Sound from "./sound";
import { useState, useEffect, type CSSProperties } from "react";
import Button from "./button-work";
import Reason from "./reason";
import Skills from "./skills";
import Sentence from "./sentence";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import SelectedWork from "./selected-work";
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
  useEffect(() => {
    // Imposta l'overflow del body a hidden quando il componente viene montato
    document.body.style.height = "auto";

    return () => {
      // Reimposta l'overflow del body a quello che era prima quando il componente viene smontato
      document.body.style.overflow = "";
    };
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
  const { ref: ref5, inView: inView5 } = useInView({
    triggerOnce: false,
  });

  return (
    <>
      {/* sopra un cielo stellato fitto il testo lungo vuole un filo di contrasto in piu' */}
      <div
        className="page-scrim"
        style={{ "--scrim-tint": 0.2 } as CSSProperties}
      />
      <div className="min-h-screen">
        <Button />
        <div className="flex flex-col items-center justify-center h-3/5 ">
          <div className="mt-6 text-4xl font-bold text-white lg:text-8xl fade-in-out h-1/4 ">
            {currentWord}
          </div>
          <Sound className="flex items-center justify-center w-12 h-12 text-white border-2 rounded-full bg-black/30 backdrop-blur-md" />
        </div>
        <motion.div
          ref={ref1}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView1 ? 1 : 0 }}
          className="flex items-start w-full "
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
          ref={ref5}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView5 ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <SelectedWork />
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
