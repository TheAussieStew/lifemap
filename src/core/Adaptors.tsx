import Rand from "rand-seed";
import { ShenT, QiT } from "./LifeGraphModel";

type ReactForceGraph = {
  nodes: ReactForceGraphNode[];
  links: ReactForceGraphLink[];
};
type ReactForceGraphNode = { id: string; group: number };
type ReactForceGraphLink = {
  source: ReactForceGraphNode["id"];
  target: ReactForceGraphNode["id"];
  value: 1;
  curvature: 0.6;
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
      label: q1.meaning as string,
    };
    console.log("ns", node.label)
    nodes.push(node);
    for (let sibling of q1.siblings) {
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
  s.siblings.map((q2: QiT) => {
    recurse(q2, 0, seen, nodes, links);
  });
  return { nodes: nodes, edges: links };
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
    const node: ReactForceGraphNode = { id: q1.id.toString(), group: group };
    nodes.push(node);
    for (let sibling of q1.siblings) {
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
  s.siblings.map((q2: QiT) => {
    recurse(q2, 0, seen, nodes, links);
  });
  return { nodes: nodes, links: links };
};
