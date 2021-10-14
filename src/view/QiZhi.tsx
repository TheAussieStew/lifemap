import { motion } from "framer-motion";
import React from 'react';
import { QiZhi } from "../core/LifeGraphModel";

export const QiZhi = (props: {energy: QiZhi}) => {
  return (
    <motion.div
      initial={{
        boxShadow: `0px 0px 10px 20px #EFEFEF`,
      }}
      animate={{
        boxShadow: `0px 0px 30px 20px ${props.energy.colour}`,
      }}
      transition={{
        repeat: Infinity,
        duration: 4,
        repeatType: "reverse",
        repeatDelay: 1,
      }}
      style={{
        borderRadius: "50%",
        margin: `20px 0 20px 0`,
        width: 15,
        height: 15,
      }}
    />
  );
}