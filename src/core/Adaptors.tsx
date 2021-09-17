import Rand from "rand-seed";
import { ShenT, QiT } from "./LifeGraphModel";
import { ReactFlowProps } from 'react-flow-renderer'

type ReactForceGraph = {
  nodes: ReactForceGraphNode[];
  links: ReactForceGraphLink[];
};
type ReactForceGraphNode = { id: string; group: number; label: string };
type ReactForceGraphLink = {
  source: ReactForceGraphNode["id"];
  target: ReactForceGraphNode["id"];
  value: 1;
  curvature: 0.6;
};
type ShenToReactForceGraph = (s: ShenT) => ReactForceGraph;
export const ShenToReactForceGraphCorrect: ShenToReactForceGraph = (
  s: ShenT
) => {
  let seen = new Set<QiT>();
  let nodes: ReactForceGraphNode[] = [];
  let links: ReactForceGraphLink[] = [];
  const recurse = (
    q1: QiT,
    depth: number,
    seen: Set<QiT>,
    nodes: ReactForceGraphNode[],
    links: ReactForceGraphLink[]
  ) => {
    seen.add(q1);
    const rand = new Rand(q1.id.toString());
    let randomNo = rand.next();
    randomNo = Math.floor(randomNo * 10) + 1;
    let group = depth === 1 ? randomNo : depth;
    const node: ReactForceGraphNode = { id: q1.id.toString(), group: group, label: q1.information as string };
    nodes.push(node);
    for (let sibling of q1.relations) {
      if (!seen.has(sibling)) {
        const link: ReactForceGraphLink = {
          source: q1.id.toString(),
          target: sibling.id.toString(),
          value: 1,
          curvature: 0.6,
        };
        links.push(link);
        recurse(sibling, depth + 1, seen, nodes, links);
      }
    }
  };
  s.relations.map((q2: QiT) => {
    recurse(q2, 0, seen, nodes, links);
  });
  return { nodes: nodes, links: links };
};


type ShenToG6Graph = (s: ShenT) => {
  nodes: G6GraphNode[];
  edges: G6GraphLink[];
};
type G6GraphNode = { id: string; x?: number; y?: number; label?: string };
type G6GraphLink = {
  source: G6GraphNode["id"];
  target: G6GraphNode["id"];
};
export const ShenToG6GraphCorrect: ShenToG6Graph = (s: ShenT) => {
  let seen = new Set<QiT>();
  let nodes: ReactForceGraphNode[] = [];
  let links: ReactForceGraphLink[] = [];
  const recurse = (
    q1: QiT,
    depth: number,
    seen: Set<QiT>,
    nodes: G6GraphNode[],
    links: G6GraphLink[]
  ) => {
    seen.add(q1);
    // TODO: What's this rand
    const rand = new Rand(q1.id.toString());
    let randomNo = rand.next();
    randomNo = Math.floor(randomNo * 10) + 1;
    const node: G6GraphNode = {
      id: q1.id.toString(),
      label: q1.information as string,
    };
    console.log("ns", node.label)
    nodes.push(node);
    for (let sibling of q1.relations) {
      if (!seen.has(sibling)) {
        const link: G6GraphLink = {
          source: q1.id.toString(),
          target: sibling.id.toString(),
        };
        links.push(link);
        recurse(sibling, depth + 1, seen, nodes, links);
      }
    }
  };
  s.relations.map((q2: QiT) => {
    recurse(q2, 0, seen, nodes, links);
  });
  return { nodes: nodes, edges: links };
};

type TiptapGraph = {
  elements: ReactFlowProps["elements"];
};
type TiptapGraphNode = {
  id: string;
  data: { id: TiptapGraphNode["id"] };
  type: "selectorNode";
  position: { x: number; y: number };
  style: any;
};
type TiptapGraphLink = {
  id: string,
  source: TiptapGraphNode["id"],
  target: TiptapGraphNode["id"],
  animated: boolean,
};
type ShenToTiptapGraph = (s: ShenT) => TiptapGraph;
export const ShenToTiptapGraphCorrect: ShenToTiptapGraph = (s: ShenT) => {
  console.log("S2TT", s)
  let seen = new Set<QiT>();
  let elements: (TiptapGraphNode | TiptapGraphLink)[] = [];
  const recurse = (
    q1: QiT,
    depth: number,
    seen: Set<QiT>,
    elements: (TiptapGraphNode | TiptapGraphLink)[],
  ) => {
    seen.add(q1);
    const rand = new Rand(q1.id.toString());
    let randomNo = rand.next();
    randomNo = Math.floor(randomNo * 10) + 1;
    const node: TiptapGraphNode = {
      id: q1.id.toString(),
      data: { id: q1.id.toString() },
      type: "selectorNode",
      position: { x: 250, y: 150 },
      style: { border: "1px solid #222138", borderRadius: 5 },
    };
    elements.push(node);
    for (let sibling of q1.relations) {
      if (!seen.has(sibling)) {
        const link: TiptapGraphLink = {
          id: "e" + q1.id.toString() + "-" + sibling.id.toString(),
          source: q1.id.toString(),
          target: sibling.id.toString(),
          animated: true,
        };
        elements.push(link);
        recurse(sibling, depth + 1, seen, elements);
      }
    }
  };
  s.relations.map((q2: QiT) => {
    recurse(q2, 0, seen, elements);})
    console.log("TT", elements)
  return { elements: elements };
}