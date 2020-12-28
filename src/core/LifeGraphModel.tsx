// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { DateTime, Interval, Duration } from "luxon";

// Maybe refactor to use types?
export enum Cardinal {
  Left,
  Right,
  Up,
  Down,
  In,
  Out,
}

export enum Trust {
  信心 = 250,
  Trust = 250,
  Acceptance = 200,
  Distrust = 170,
  Suspicion = 170,
  Doubt = 125,
  Negativity = 125,
  Worry = 125,
  Fear = 100,
  Anxiety = 80,
  Paranoia = 50,
}

enum Openness {
  Openness = 350,
  Optimism = 275,
  Confidence = 275,
  Funny = 250,
  Arrogance = 175,
  Stubbornness = 160,
  Controlling = 120,
  Insecurity = 120,
  Isolation = 100,
  Sadness = 75,
  Regret = 75,
  Despair = 50,
  Hopeless = 50,
  Shame = 40,
}

enum Love {
  Love = 500,
  Compassion = 450,
  Hate = 400,
  Prejudiced = 175,
  Judgmental = 175,
  Pride = 175,
  Anger = 175,
  Apathy = 50,
  Indifference = 50,
}

enum Gratitude {
  Gratitude = 600,
  Resentment = 120,
}

enum Peace {
  Reverence = 800,
  Eusebeia = 800,
  Peace = 700,
  Disrespect = 120,
}

// Transformations - something changing
// Clearly needs work
type Transformation = () => {};
type Recurring = (qi: Qi, graph: Graph) => { graph: Graph };
// type Pulsation = (qiQuality: QiZhi, qiField: QiField) => QiField;

// Relation - how to differentiate
// Maybe model using GADT

type Semantic =
  | EmotionalState
  | Image
  | Person
  | Language
  | Location
  | Temporal
  | Symbolic; //3D object? video? gif?
type Language = string;
type Location = unknown;
export type Relation = Temporal | EmotionalState | Layout | Unordered; // might take other things from semantic eg. verbs
type Unordered = "Unordered";
type Temporal = Past | Present | Future | TimePoint | TimeSpan;
type Past = unknown; // have magnittude?
type Present = unknown;
type Future = unknown;
type Symbolic = Emoji | Thumbnails;
type Emoji = string;
type Thumbnails = string;
type Layout = Ratio | Direction;
type Image = string;
type Person = string;

type EmotionalState = Peace | Gratitude | Love | Openness | Trust;
type QiZhi = Colour & Brightness & Dispersion;
type Colour = number;
type Brightness = number;
type Dispersion = number;
type Ratio = number;
type Direction = Cardinal.Left | Cardinal.Right | Cardinal.Up | Cardinal.Down;

// Time related
type Time = TimePoint | TimeDuration | TimeSpan;
type TimePoint = DateTime;
type TimeDuration = Duration;
type TimeSpan = TimePoint & TimeDuration & TimePoint;

// Graph Model and Operations
// TODO: should we implement state history here?
export type Graph = {
  nodes: Qi[];
  links: QiLink[];
  pickedNodes: Qi[];
  pickedLinks: QiLink[];
};

export type SearchInfo = {
  rootDist: number;
  status: "Unseen" | "ToSee" | "Seen";
  pred: Qi | null;
};

export type FieldOfView = All | Degree | RelatedContent; // this related content is the same as the "group type"
type All = 10000000;
type Degree = number;
type RelatedContent = unknown;

type GraphOperations = {
  createQi: (graph: Graph, meaning: Semantic) => Graph;
  queryQi: (graph: Graph, id: number | string) => Qi;
  createLink: (graph: Graph, from: Qi, to: Qi) => Graph;
  queryQiLink: (graph: Graph, id: number) => QiLink;
  createNeighbour: (graph: Graph, from: Qi, meaning: Semantic) => Graph;
  changeQi: (graph: Graph, meaning: Semantic, qi: Qi) => Graph;
  changeQiLink: (
    graph: Graph,
    tong: QiZhi,
    relation: Relation,
    qiLink: QiLink
  ) => Graph;
  delete: (graph: Graph, q: Q) => Graph;
  pick: (graph: Graph, q: Q) => Graph;
  popPicks: (graph: Graph, q: Q, nOfPicks: number) => Q[];
  adjacent: (g: Graph, qi: Qi) => Qi[];
  bfs: (graph: Graph, q: Q, degree: Degree) => Map<Qi, SearchInfo>;
  parse: (file: Object) => Graph;
};

export class GraphObj implements Graph {
  nodes: Qi[] = [];
  links: QiLink[] = [];
  pickedNodes: Qi[] = [];
  pickedLinks: QiLink[] = [];
}

export const GraphOps: GraphOperations = {
  createQi: (graph: Graph, info: Semantic) => {
    const id = graph.nodes.length;
    const qi = new QiObj(id, info);
    graph.nodes.push(qi);
    return graph;
  },
  queryQi: (graph: Graph, id: number | string) => {
    const index = graph.nodes.findIndex((elem) =>
      typeof id === "number" ? elem.id === id : elem.meaning === id
    );
    if (index === -1) {
      return new QiObj(-1, "nothing"); //TODO: A better way of handling?
    } else {
      return graph.nodes[index];
    }
  },
  createLink: (graph: Graph, from: Qi, to: Qi) => {
    const id = graph.links.length;
    const qiLink = new QiLinkImp(id, from, to);
    graph.links.push(qiLink);
    return graph;
  },
  queryQiLink: (graph: Graph, id: number) => {
    const index = graph.links.findIndex((elem) => elem.id === id);
    if (index === -1) {
      const nothing = new QiObj(-1, "nothing"); //TODO: A better way of handling?
      return new QiLinkImp(-1, nothing, nothing); //TODO: A better way of handling?
    } else {
      return graph.links[id];
    }
  },
  createNeighbour: (graph: Graph, from: Qi, info: Semantic) => {
    const qiId = graph.nodes.length;
    const to = new QiObj(qiId, info);
    graph.nodes.push(to);
    const qiLinkId = graph.links.length;
    const qiLink = new QiLinkImp(qiLinkId, from, to);
    graph.links.push(qiLink);
    return graph;
  },
  changeQi: (graph: Graph, info: Semantic, qi: Qi) => {
    const index = graph.nodes.findIndex((elem) => elem === qi);
    if (index === -1) {
      return graph;
    } else {
      const newQi = new QiObj(index, info);
      const newGraph: Graph = {
        nodes: [
          ...graph.nodes.slice(0, index),
          newQi,
          ...graph.nodes.slice(index + 1),
        ],
        links: graph.links,
        pickedNodes: graph.pickedNodes,
        pickedLinks: graph.pickedLinks,
      };
      return newGraph;
    }
  },
  changeQiLink: (
    graph: Graph,
    tong: QiZhi,
    relation: Relation,
    qiLink: QiLink
  ) => {
    const index = graph.links.findIndex((elem) => elem === qiLink);
    if (index === -1) {
      // need a better way to deal with bad cases
      return graph;
    } else {
      let newQiLink = new QiLinkImp(index, qiLink.from, qiLink.to);
      newQiLink.tong = tong;
      newQiLink.relation = relation;
      const newGraph: Graph = {
        nodes: graph.nodes,
        links: [
          ...graph.links.slice(0, index),
          newQiLink,
          ...graph.links.slice(index + 1),
        ],
        pickedNodes: graph.pickedNodes,
        pickedLinks: graph.pickedLinks,
      };
      return newGraph;
    }
  },
  delete: (graph: Graph, q: Q) => {
    if ((q as QiObj).meaning !== undefined) {
      const index = graph.nodes.findIndex((elem) => elem === (q as Qi));
      if (index === -1) {
        return graph;
      } else {
        const newGraph: Graph = {
          nodes: [
            ...graph.nodes.slice(0, index),
            ...graph.nodes.slice(index + 1),
          ],
          links: graph.links,
          pickedNodes: graph.pickedNodes,
          pickedLinks: graph.pickedLinks,
        };
        return newGraph;
      }
    } else {
      const index = graph.nodes.findIndex((elem) => elem === (q as Qi));
      if (index === -1) {
        return graph;
      } else {
        const newGraph: Graph = {
          nodes: graph.nodes,
          links: [
            ...graph.links.slice(0, index),
            ...graph.links.slice(index + 1),
          ],
          pickedNodes: graph.pickedNodes,
          pickedLinks: graph.pickedLinks,
        };
        return newGraph;
      }
    }
  },
  pick: (graph: Graph, q: Q) => {
    if ((q as QiObj).meaning !== undefined) {
      graph.pickedNodes.push(q as QiObj);
      return graph;
    } else {
      graph.pickedLinks.push(q as QiLinkImp);
      return graph;
    }
  },
  popPicks: (graph: Graph, q: Q, nOfPicks: number) => {
    if ((q as QiObj).meaning !== undefined) {
      const length = graph.pickedNodes.length;
      const poppedPicks: Qi[] = [];
      for (var i = length - 1; i >= 0 && nOfPicks !== 0; i-- && nOfPicks--) {
        poppedPicks.push(graph.pickedNodes[i]);
      }
      return poppedPicks;
    } else {
      const length = graph.pickedLinks.length;
      const poppedPicks: QiLink[] = [];
      for (var i = length - 1; i >= 0 && nOfPicks !== 0; i-- && nOfPicks--) {
        poppedPicks.push(graph.pickedLinks[i]);
      }
      return poppedPicks;
    }
  },
  adjacent: (g: Graph, qi: Qi) => {
    const adjLinks: QiLink[] = g.links.filter((ql: QiLink) => ql.from === qi);
    const adjQi: Qi[] = adjLinks.map((ql: QiLink) => ql.to);
    return adjQi;
  },
  bfs: (g: Graph, q: Q, degree: Degree) => {
    // BFS based off CLRS page 595
    let info = new Map<Qi, SearchInfo>();
    if ((q as QiObj).meaning !== undefined) {
      for (let qi of g.nodes) {
        const inital: SearchInfo = {
          rootDist: g.nodes.length,
          status: "Unseen",
          pred: null,
        };
        info.set(qi, inital);
      }
      const source = q as Qi;
      info.get(source)!.rootDist = 0;
      info.get(source)!.status = "ToSee";
      info.get(source)!.pred = null;
      let queue: Qi[] = [];
      queue.push(source);
      console.log(info);
      while (queue.length !== 0) {
        let currQi = queue.shift()!;
        if (info.get(currQi)!.rootDist >= degree) break;
        const currentAdjacentQi: Qi[] = GraphOps.adjacent(g, currQi);
        for (let adjQi of currentAdjacentQi) {
          if (info.get(adjQi)!.status === "Unseen") {
            info.get(adjQi)!.status = "ToSee";
            info.get(adjQi)!.rootDist = info.get(currQi)!.rootDist + 1;
            info.get(adjQi)!.pred = currQi;
            queue.push(adjQi);
          }
        }
        info.get(currQi)!.status = "Seen";
      }
    } else {
      // TODO: Some other day when needed
    }
    return info;
  },
  // TODO: use this to load my own data to display in the graph views...
  parse: (file: Object) => {
    type Node = {
      id: string;
      group: number;
    };
    type Link = {
      source: string;
      target: string;
      value: number;
      curvature: number;
    };
    type VastGraph = {
      nodes: Node[];
      links: Link[];
    };
    let g = new GraphObj();
    for (let node of (file as VastGraph).nodes) {
      GraphOps.createQi(g, node.id);
    }
    for (let link of (file as VastGraph).links) {
      let from = GraphOps.queryQi(g, link.source);
      let to = GraphOps.queryQi(g, link.target);
      GraphOps.createLink(g, from, to);
    }
    return g;
  },
};
type Invariant = (something: unknown) => Boolean;
// TODO: Invariants +  Refinement relations

// Qi Definitions

type Q = Qi | QiLink;
export type Qi = {
  readonly id: number;
  meaning: Semantic;
  tong: QiZhi;
  transformations: Transformation[]; // describes how this qi transforms itself and the graph
};

type Qi2 = {
  readonly id: number;
  meaning: Semantic; // meaning of information
  tong: QiZhi; // flow with siblings and itself
  relations: Relation[]; // relations with all siblings
  siblings: Qi2[];
  transformations?: Transformation[]; // describes how this qi transforms itself and the graph, almost like haskell functions
};

export class QiObj implements Qi {
  id: number; // number lookup is faster than string
  // Semantic
  meaning: Semantic;
  tong: QiZhi;
  // Energy
  transformations: Transformation[]; // describes how this qi transforms itself and the graph

  constructor(id: number, meaning: Semantic) {
    this.id = id;
    this.meaning = meaning;
    this.tong = 0;
    this.transformations = [];
  }
}

type QiLink = {
  readonly id: number;
  readonly from: Qi;
  readonly to: Qi;
  tong: QiZhi;
  relation: Relation;
};

class QiLinkImp implements QiLink {
  readonly id: number;
  readonly from: Qi;
  readonly to: Qi;
  tong: QiZhi;
  relation: Relation;

  constructor(id: number, from: Qi, to: Qi) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.tong = 0;
    this.relation = "Unordered";
  }
}
