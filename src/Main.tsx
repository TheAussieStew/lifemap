import React from "react";
import { ShenT, GraphCorrect } from "./core/LifeGraphModel";
import { TreeCorrect, Graph3DCorrect, Graph2DTipTap, Graph2DReactForce, LoggingCorrect } from "./view/View";

export const GraphContext = React.createContext<ShenT>(GraphCorrect.createShen());

const Main = () => {
  const shen = GraphCorrect.createShen();
  shen.information = "The Void";
  let { q, s1 } = GraphCorrect.createQi(shen);
  q.information = "Hello universe!";
  return (
    <GraphContext.Provider value={shen}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
        }}
      >
        <Graph3DCorrect />
        <Graph2DTipTap />
        <LoggingCorrect />
        {/* <Graph2DReactForce /> */}
      </div>
    </GraphContext.Provider>
  );
};

export default Main;
