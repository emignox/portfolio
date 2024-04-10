import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollProps {
  children: ReactNode;
}

const Scroll = ({ children }: ScrollProps) => {
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: false,
  });
  return (
    <>
      <motion.div
        ref={ref1}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView1 ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </>
  );
};
export default Scroll;
