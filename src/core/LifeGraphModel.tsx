// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { Card } from "@material-ui/core";
import { DateTime, Interval, Duration } from "luxon";
import * as React from "react";

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

// View
type ViewModel = {
  portal: Portal;
};
type ViewOperations = {
  parsePortal: (p: Portal) => React.ReactNode;
  createPortal: (ls: LensStack, graph: Graph) => Portal;
  changePortal: (p: Portal, something: any) => Portal;
  createLensStack: (l: Lens) => LensStack;
  changeLensStack: (ls: LensStack, l: Lens) => LensStack;
  createLens: (l: Lens) => Lens;
};

// still need this?
type Portal = (Portal | View)[];

type View = {
  lenses: LensStack; // how do you write functions which are composable? yes, after composing they should be the same type
  focus: Qi; // where is the centrepoint of the view?
  graph: Graph; // what is the whole picture?
};
export class ViewObj implements View {
  lenses: LensStack; 
  focus: Qi; 
  graph: Graph; 

  constructor(lenses: LensStack, focus: Qi, graph: Graph) {
    this.lenses = lenses;
    this.focus = focus;
    this.graph = graph;
  }
}

type ViewTransformation = (v: View) => React.Component;

// maybe could define lensstack like a list in haskell e.g. l : [] or just l
// would eliminate lens + lenstack difference
// Do need a Lens + View separation, lens is view, view has graph, which is the model
type LensStack = {
  lenses: Lens[]; // what are the different lenses that compose this view?
  fov: FieldOfView; // how much can I perceive from a centre?
  // is aperture neccesary? same as field of view, just describes dof - could look nice
};
export class LensStackObj implements LensStack {
  lenses: Lens[] = [];
  fov: FieldOfView;

  constructor(fov: number) {
    this.fov = fov;
  }
}
// or maybe React.Comp to React.Comp
type LensStackTransformation = (g: Graph) => React.CSSProperties;
// maybe this format is better than having both a type and implementation
export const LensStackOperations = {
  addLens: (ls: LensStack, l: Lens) => {
    // TODO: check for lens compat here
    const newLs = ls.lenses.push(l);
    return newLs;
  },
  changeFov: (ls: LensStack, fov: FieldOfView) => {
    const newLs = ls.fov = fov;
    return newLs;
  }
}

export type FieldOfView = All | Degree | RelatedContent; // this related content is the same as the "group type"
type All = 10000000;
type Degree = number;
type RelatedContent = unknown;

// Lens - different ways of viewing information - material
// This has evolved to be more about "styling"
type Lens =
  | Clear
  | Language
  | Heading
  | Symbolic // e.g. Emojis
  | RoseTinted
  | QiField
  | NonSymbolic; // e.g. Pictures? also, don't represent these as qi, for now
type Clear = {type: "Clear"};
type Language = {type: "Language"}; // Maybe not needed, implicit
type Heading = {type: "Heading"}
type Symbolic = Emoji | Thumbnails;
type Emoji = {type: "Emoji"};
type Thumbnails = {type: "Thumbnails"};
type RoseTinted = {type: "RoseTinted"};
type QiField = Colour & Brightness & Size;
type Colour = string;
type Brightness = number;
type Size = number;
type NonSymbolic = {type: "NonSymbolic"};

// Transformations - something changing
type Transformation = () => {};
type Recurring = (qi: Qi, graph: Graph) => { graph: Graph };
type Pulsation = (qiQuality: QiZhi, qiField: QiField) => QiField;

// Structure - configurations of information
type Structure =
  | Code // 1.5D
  | List // 1.5D but 1D on phones
  | Masonry // 2D
  | GraphStructure // 2D or 3D
  | Table // 2D
  | SpaceTime // 2D or 3D?
  | Calendar
  | Embed; 
type Code = unknown;
type List = ListNumber | ListPoints | ListChecks; // should be collapsable
type ListNumber = (centre: Qi, g: Graph, fov: FieldOfView) => JSX.Element;
export type ListPoints = (t: Tree) => JSX.Element;
type ListChecks = unknown;
type Masonry = unknown; // either evenly sized or unevenly sized grid that's packed together
type GraphStructure = Graph2D | Graph3D;
type Graph2D = unknown;
type Graph3D = unknown;
type Table = unknown;
type Kanban = Table;
type SpaceTime = unknown; // what is this? same/diff to timeline?
type Calendar = unknown; // what is this even
type Embed = unknown;

// Ordering - how to differentiate and evaluate
// Maybe model using GADT
export type Order = PartialOrder | Unordered;
type PartialOrder = {
  from: OrderRelation;
  to: OrderRelation;
  comparator: Comparator;
};
type Unordered = undefined;
type Comparator = (from: OrderRelation, to: OrderRelation) => number;

type OrderRelation = QiZhi | EmotionalState | Time | Ratio | Direction;
type EmotionalState = Peace | Gratitude | Love | Openness | Trust;
type QiZhi = number;
type Ratio = number;
type Direction = Cardinal.Left | Cardinal.Right | Cardinal.Up | Cardinal.Down;

// Time related
type Time = TimePoint | TimeDuration | TimeSpan;
type TimePoint = DateTime;
type TimeDuration = Duration;
type TimeSpan = Interval;

// Information - just information of qi
type Information = Time | number | string | Image | EmotionalState | Person;
type Image = string;
type Person = string;

export type Tree = {
  qi: Qi,
  rootDist: number;
  children: Tree[];
}
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
  // how does this work?
  JSXify: (t: Tree, acc: any) => {
    let divElems = [];
    for (let miniTree of t.children) {
      divElems.push(TreeOps.JSXify(miniTree, acc));
    }
    let elem = <Card style={{}}>
      <Card style={{textAlign: "left", marginLeft: t.rootDist * 15}}>
        {"• " + t.qi.information}
      </Card>
      {divElems}
    </Card>;
    return elem;
  }
};

// Graph Model and Operations
// TODO: should we implement state history here?
export type Graph = {
  nodes: Qi[];
  links: QiLink[];
  pickedNodes: Qi[];
  pickedLinks: QiLink[];
};

type SearchInfo = {
  rootDist: number;
  status: "Unseen" | "ToSee" | "Seen";
  pred: Qi | null;
};

type GraphOperations = {
  createQi: (graph: Graph, info: Information) => Graph;
  queryQi: (graph: Graph, id: number) => Qi;
  createLink: (graph: Graph, from: Qi, to: Qi) => Graph;
  queryQiLink: (graph: Graph, id: number) => QiLink;
  createNeighbour: (graph: Graph, from: Qi, info: Information) => Graph;
  changeQi: (graph: Graph, info: Information, qi: Qi) => Graph;
  changeQiLink: (
    graph: Graph,
    tong: QiZhi,
    order: Order,
    qiLink: QiLink
  ) => Graph;
  delete: (graph: Graph, q: Q) => Graph;
  pick: (graph: Graph, q: Q) => Graph;
  popPicks: (graph: Graph, q: Q, nOfPicks: number) => Q[];
  adjacent: (g: Graph, qi: Qi) => Qi[];
  bfs: (graph: Graph, q: Q, degree: number) => Map<Qi, SearchInfo>;
};

export class GraphObj implements Graph {
  nodes: Qi[] = [];
  links: QiLink[] = [];
  pickedNodes: Qi[] = [];
  pickedLinks: QiLink[] = [];
}

export const GraphOps: GraphOperations = {
  createQi: (graph: Graph, info: Information) => {
    const id = graph.nodes.length;
    const qi = new QiObj(id, info);
    graph.nodes.push(qi);
    return graph;
  },
  queryQi: (graph: Graph, id: number) => {
    const index = graph.nodes.findIndex((elem) => elem.id === id);
    if (index === -1) {
      return new QiObj(-1, "nothing"); //TODO: A better way of handling?
    } else {
      return graph.nodes[id];
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
  createNeighbour: (graph: Graph, from: Qi, info: Information) => {
    const qiId = graph.nodes.length;
    const to = new QiObj(qiId, info);
    graph.nodes.push(to);
    const qiLinkId = graph.links.length;
    const qiLink = new QiLinkImp(qiLinkId, from, to);
    graph.links.push(qiLink);
    return graph;
  },
  changeQi: (graph: Graph, info: Information, qi: Qi) => {
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
  changeQiLink: (graph: Graph, tong: QiZhi, order: Order, qiLink: QiLink) => {
    const index = graph.links.findIndex((elem) => elem === qiLink);
    if (index === -1) { // need a better way to deal with bad cases
      return graph;
    } else {
      let newQiLink = new QiLinkImp(index, qiLink.from, qiLink.to);
      newQiLink.tong = tong;
      newQiLink.ordering = order;
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
    if ((q as QiObj).information !== undefined) {
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
    if ((q as QiObj).information !== undefined) {
      graph.pickedNodes.push(q as QiObj);
      return graph;
    } else {
      graph.pickedLinks.push(q as QiLinkImp);
      return graph;
    }
  },
  popPicks: (graph: Graph, q: Q, nOfPicks: number) => {
    if ((q as QiObj).information !== undefined) {
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
    const adjLinks: QiLink[] = g.links.filter(
      (ql: QiLink) => ql.from === qi
    );
    const adjQi: Qi[] = adjLinks.map((ql: QiLink) => ql.to);
    return adjQi;
  },
  bfs: (g: Graph, q: Q, degree: number) => {
    // BFS based off CLRS page 595
    let info = new Map<Qi, SearchInfo>();
    if ((q as QiObj).information !== undefined) {
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
};
type Invariant = (something: unknown) => Boolean;
// TODO: Invariants +  Refinement relations

// Qi Definitions

type Q = Qi | QiLink;
export type Qi = {
  readonly id: number; // number lookup is faster than string
  // Information
  information: Information;
  mutability?: boolean;
  transformable?: boolean;
  qiQuality?: QiZhi; // composed of all connected relations
  // Energy
  transformations?: Transformation[]; // describes how this qi transforms itself and the graph
  timeHorizon?: QiLink;
};

export class QiObj implements Qi {
  id: number; // number lookup is faster than string
  // Information
  information: Information;
  mutability?: boolean;
  transformable?: boolean;
  qiQuality?: QiZhi; // composed of all connected relations
  relation?: EmotionalState; // how do you relate to this single qi
  // Energy
  transformations?: Transformation[]; // describes how this qi transforms itself and the graph
  timeHorizon?: QiLink;

  constructor(id: number, info: Information) {
    this.id = id;
    this.information = info;
    this.mutability = false;
    this.transformable = false;
    this.qiQuality = 0; // composed of all connected relations
    this.relation = Trust.Acceptance; // how do you relate to this single qi
    this.transformations = []; // describes how this qi transforms itself and the graph
    //this.timeHorizon = {};
  }
}

type QiLink = {
  readonly id: number;
  readonly from: Qi;
  readonly to: Qi;
  tong: QiZhi;
  ordering: Order;
};
class QiLinkImp implements QiLink {
  readonly id: number;
  readonly from: Qi;
  readonly to: Qi;
  tong: QiZhi;
  ordering: Order;

  constructor(id: number, from: Qi, to: Qi) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.tong = 0;
    // this.ordering = 1;
  }
}