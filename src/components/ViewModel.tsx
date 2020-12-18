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

export const ListPointsObj: ListPoints = (t: Tree) => {
  // problem: need to use dist from neighbours to calculate indents
  // need a clean way to pass this info
  
  TreeOps.preOrderTraversal(t, fn);
  let list = (
    <ul>
      {g.nodes.map((qi: Qi, index: number) => {
        return <li key={index}>{qi.information}</li>;
      })}
    </ul>
  );
  return list;
};
