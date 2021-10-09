import { motion, useMotionValue } from "framer-motion";
import SimplexNoise from 'simplex-noise';
import React from "react";

type PolarVector = {
  r: number;
  theta: number;
};
const PolarVector = (r: number, theta: number) => {
  return { r: r, theta: theta };
};

const FlowField = () => {
  const detailMultiplier = 1.0;
  const fieldSpacing = Math.round(20 / detailMultiplier);
  const fieldLength = Math.round(25 * detailMultiplier);
  const r = 90; // kind of like velocity
  const tickDetailMultipier = 60;
  let vectorField: PolarVector[][] = [];
  const simplex = new SimplexNoise("lol");
  let vectorFieldArrows: JSX.Element[][] = [];
  for (let x = 0; x < fieldLength; x++) {
    vectorField[x] = [];
    vectorFieldArrows[x] = [];
    for (let y = 0; y < fieldLength; y++) {
      vectorField[x][y] = PolarVector(
        r,
        90 + y / fieldLength * 270
      );
      vectorFieldArrows[x][y] = (
        <motion.div
          style={{
            position: "absolute",
            x: x * fieldSpacing,
            y: y * fieldSpacing,
            rotate: vectorField[x][y].theta,
          }}
          initial={{ translateX: -5 }}
          animate={{ translateX: 0 }}
          transition={{ delay: (x + y) * 0.04 }}
        >
          ↑
        </motion.div>
      );
    }
  }

  const objectX = useMotionValue(45);
  const objectY = useMotionValue(40);
  const move = () => {
    let fieldXLoc = Math.round(objectX.get() / fieldLength);
    let fieldYLoc = Math.round(objectY.get() / fieldLength);
    let currentVector = vectorField[fieldXLoc][fieldYLoc];
    // not sure why 90 - theta but it works lol
    let deltaX =
      currentVector.r * Math.cos((currentVector.theta - 90) * (Math.PI / 180));
    let deltaY =
      currentVector.r * Math.sin((currentVector.theta - 90) * (Math.PI / 180));
    objectX.set(objectX.get() + deltaX / tickDetailMultipier);
    objectY.set(objectY.get() + deltaY / tickDetailMultipier);
    console.log("velocity", objectX.getVelocity(), objectY.getVelocity())
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      move();
    }, 500 / tickDetailMultipier);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        border: "1px solid #222138",
        width: 500,
        height: 500,
        borderRadius: 5,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: 10,
          height: 10,
	  borderRadius: "50%",
          backgroundColor: "purple",
          zIndex: 1,
          x: objectX,
          y: objectY,
        }}
        drag
        dragConstraints={{ left: 0, right: 500, top: 0, bottom: 501 }}
      />
      {vectorFieldArrows}
    </div>
  );
};