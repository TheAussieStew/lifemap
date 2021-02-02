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
