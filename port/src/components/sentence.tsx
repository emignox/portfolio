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
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 24 }}
      transition={{ duration: 2 }}
      className="flex items-center justify-center h-screen text-center text-white "
    >
      <h1 className="w-5/6 text-2xl font-semibold leading-snug text-left text-white/90 md:text-4xl lg:w-2/3">
        Full-stack developer working with React, Next.js, Node.js and Python,
        with extensive professional experience in Odoo implementations. I
        deliver fast, reliable web products tailored to business needs.
      </h1>
    </motion.div>
  );
}
export default Sentence;
