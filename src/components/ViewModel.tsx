import { Card } from "@material-ui/core";
import React from "react";
import { useRef } from "react";
import { ForceGraph3D, ForceGraphMethods$2 } from "react-force-graph";
import {
  Qi,
  ListPoints,
  Graph,
  GraphObj,
  GraphOps,
  FieldOfView,
  Tree,
  TreeOps,
} from "../core/LifeGraphModel";

// const fgRef = useRef<ForceGraphMethods$2 | undefined>(undefined);

// const Graph3D:  Graph3D = (
//   <ForceGraph3D
//     ref={fgRef}
//     graphData={graphData}
//     nodeLabel="id"
//     nodeResolution={7}
//     width={600}
//     height={600}
//     linkCurvature="curvature"
//     nodeAutoColorBy="group"
//     linkDirectionalParticles="value"
//     linkDirectionalParticleSpeed={0.005}
//     linkDirectionalParticleWidth={2}
//     linkWidth={0.5}
//     onNodeClick={() => {}}
//     nodeThreeObject={(node) => {
//       const sprite = new SpriteText(node.id ? node.id.toString() : "");
//       // sprite.color = node.color;
//       sprite.textHeight = 2;
//       sprite.position.set(0, -8, 0);
//       sprite.color = "#000000";
//       sprite.strokeWidth = 0.5;
//       sprite.strokeColor = "#888888";
//       sprite.padding = 1;
//       return sprite;
//     }}
//     nodeThreeObjectExtend={true}
//   />
// );

export const ListPointsObj = () => {
  let g = new GraphObj();
  g = GraphOps.createQi(g, "Mother Earth");
  let fromRocks = GraphOps.queryQi(g, 0);
  // note that these links are one directional
  g = GraphOps.createNeighbour(g, fromRocks, "Soil");
  g = GraphOps.createNeighbour(g, fromRocks, "Flowers");
  let fromSoil = GraphOps.queryQi(g, 1);
  g = GraphOps.createNeighbour(g, fromSoil, "Worms");
  g = GraphOps.createNeighbour(g, fromSoil, "Minerals");
  let realT = TreeOps.parseGraph(g, fromRocks);
  return TreeOps.JSXify(realT, {});
  // let list = (
  //   <ul>
  //     {g.nodes.map((qi: Qi, index: number) => {
  //       return <li key={index}>{qi.information}</li>;
  //     })}
  //   </ul>
  // );
  // return list;
};
