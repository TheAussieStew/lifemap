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
  SearchInfo,
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

// Put the stuff that takes viewmodels and renders it to JSX/React.Components here
export type Tree = {
  qi: Qi;
  rootDist: number;
  children: Tree[];
};
export class TreeObj implements Tree {
  qi: Qi;
  rootDist: number;
  children: Tree[];

  constructor(qi: Qi) {
    this.qi = qi;
    this.rootDist = 0;
    this.children = [];
  }
}

export const TreeOps = {
  addChild: (t: Tree, qi: Qi) => {
    let miniTree = new TreeObj(qi);
    miniTree.rootDist = t.rootDist + 1;
    t.children.push(miniTree); // push because we're filling tree left to right
    return t;
  },
  parseGraph: (g: Graph, root: Qi) => {
    // bfs returns all pairs shortest paths for unweighted graph
    const maxDegree = g.nodes.length;
    let info = GraphOps.bfs(g, root, maxDegree);
    const treeise = (
      info: Map<Qi, SearchInfo>,
      parent: Qi,
      rootDist: number
    ) => {
      let t = new TreeObj(parent);
      t.rootDist = rootDist;
      info.forEach((searchInfo: SearchInfo, qi: Qi) => {
        if (searchInfo.pred === parent) {
          t.children.push(treeise(info, qi, t.rootDist + 1));
        }
      });
      return t;
    };
    return treeise(info, root, 0);
  },
  preOrderTraversal: (t: Tree, fn: (t: Tree) => any, acc: any) => {
    fn(t);
    for (let miniTree of t.children) {
      TreeOps.preOrderTraversal(miniTree, fn, acc);
    }
    return acc;
  },
  postOrderTraversal: (t: Tree, fn: (t: Tree) => any, acc: any) => {
    for (let miniTree of t.children) {
      TreeOps.preOrderTraversal(miniTree, fn, acc);
    }
    fn(t);
    return acc;
  },
};
