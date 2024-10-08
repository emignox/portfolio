import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

function Sentence() {
  const { ref, inView } = useInView({
    triggerOnce: false,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 0.8 : 0 }}
      transition={{ duration: 2 }}
      className=" text-center flex items-center justify-center text-white   h-screen "
    >
      <h1 className="w-5/6  font-bold lg:text-5xl lg:w-2/3 text-left text-3xl lg:text-justify  ">
        Much like an artist paints with colors on canvas, a front-end developer
        paints with code on the web, crafting digital experiences that are
        interactive works of art.
      </h1>
    </motion.div>
  );
}
export default Sentence;
