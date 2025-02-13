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
      className="flex items-center justify-center h-screen text-center text-white "
    >
      <h1 className="w-5/6 text-3xl font-bold text-left lg:text-5xl lg:w-2/3 lg:text-justify ">
        "Fullstack developer skilled in Tailwind, React, and Node.js, with
        extensive professional experience in Odoo implementations, and
        proficient in Python, ready to deliver innovative, dynamic, and
        efficient web solutions tailored to business needs."
      </h1>
    </motion.div>
  );
}
export default Sentence;
