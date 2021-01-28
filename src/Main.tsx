import React from "react";
import { ShenT, GraphCorrect } from "./core/LifeGraphModel";
import { GraphTest } from "./utils/Testing";

// const Main = () => {
//   const [graph, setGraph] = React.useState<Graph>(GraphCorrect.createGraph);
//   let result = GraphCorrect.createNode(graph);
//   setGraph(result.g1);
//   let {g1, bag} = GraphCorrect.beginQuest(graph);
//   setGraph(g1);
//   return (
//     <div>
//       NestedList(bag);
//     </div>
//   )
// };

// Visual and interactive testing
const Main = () => {
  // const component = <Testing/>;
  console.log({nested: "lol", sdsd: "sds"})
  return <div>{GraphTest.createGraph()}</div>;
}

export default Main;
