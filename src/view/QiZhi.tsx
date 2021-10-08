import { motion } from "framer-motion";

const QiZhi = () => {
  return (
    <motion.div
      initial={{
        boxShadow: `0px 0px 10px 20px #0ff`,
      }}
      animate={{
        boxShadow: `0px 0px 30px 20px #FFFF80`,
      }}
      transition={{
        repeat: Infinity,
        duration: 4,
        repeatType: "reverse",
        repeatDelay: 1,
      }}
      style={{
        width: 100,
        height: 100,
      }}
    />
  );
}