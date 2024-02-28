"use client";
import Nav from "./nav";
// import space from "/under-water.mp4";
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

  useEffect(() => {
    const interval = setInterval(() => {
      index = index + 1 === words.length ? 0 : index + 1;
      setCurrentWord(words[index]);
    }, 5000); // Cambia parola ogni 2 secondi

    return () => clearInterval(interval); // Pulisce l'intervallo quando il componente si smonta
  }, []);
  //animazione testi
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
  });

  const { ref: ref2, inView: inView2 } = useInView({
    triggerOnce: true,
  });
  const { ref: ref3, inView: inView3 } = useInView({
    triggerOnce: true,
  });
  const { ref: ref4, inView: inView4 } = useInView({
    triggerOnce: true,
  });

  return (
    <>
      <div className=" h-screen">
        {/* <video
          className=" object-cover"
          autoPlay
          loop
          muted
          style={{
            filter: "brightness(70%)",
            position: "fixed",
            width: "100vw", // viewport width
            height: "100vh", // viewport height

            zIndex: "-1",
          }}
          // src={space}
        /> */}
        <Nav className="" />
        <Button />
        <div className="  flex justify-center items-center flex-col h-3/5  ">
          <div className="font-black text-4xl  lg:text-8xl    text-white fade-in-out h-1/4   ">
            {currentWord}
          </div>
          <div className=" w-10 h-10  fixed  bottom-10 m-2 right-0">
            <Sound className="" />
          </div>
        </div>
        <motion.div
          ref={ref1}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView1 ? 1.5 : 0 }}
          drag="x"
          className="flex  items-start w-full   "
        >
          <Reason />
        </motion.div>
        <motion.div
          ref={ref2}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView2 ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <Skills />
        </motion.div>
        <motion.div
          ref={ref3}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView3 ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <Sentence />
        </motion.div>

        <motion.div
          ref={ref4}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView4 ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <Contact />
        </motion.div>
      </div>
    </>
  );
}

export default About;
