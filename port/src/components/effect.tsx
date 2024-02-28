"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "./cn";

export const TextGenerateEffect = ({
  words,
  delay = 0.2, // valore di default se non specificato
  className,
}: {
  words: string | { [key: string]: string };
  delay?: number;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray: string[];
  if (typeof words === "string") {
    wordsArray = words.split(" ");
  } else {
    wordsArray = Object.values(words);
  }

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(delay),
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={`dark:text-white text-black opacity-0 ${className}`}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
