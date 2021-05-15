import React from "react";
import { ShenT, GraphCorrect } from "./core/LifeGraphModel";
import { GraphTest } from "./utils/Testing";
import { TreeCorrect, Graph3DCorrect } from "./view/View";

export const GraphContext = React.createContext<ShenT>(GraphCorrect.createShen());

const Main = () => {
  const shen = GraphCorrect.createShen();
  shen.meaning = "The Void";
  let { q, s1 } = GraphCorrect.createQi(shen);
  q.meaning = "Hello universe!";
  return (
    <GraphContext.Provider value={shen}>
      <div
        style={{
          display: "grid",
          gridAutoColumns: `repeat(auto-fill(250px, 1fr))`,
        }}
      >
        <Graph3DCorrect />
        <Graph3DCorrect />
      </div>
    </GraphContext.Provider>
  );
};

export default Main;
