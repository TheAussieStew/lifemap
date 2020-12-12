// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { GraphicEq } from "@material-ui/icons";
import { DateTime, Interval, Duration } from "luxon";
import * as React from "react";

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

type Portal = (Portal | View)[];

type View = {
  lenses: LensStack; // how do you write functions which are composable? yes, after composing they should be the same type
  focus: Qi; // where is the centrepoint of the view?
  graph: Graph; // what is the whole picture?
};
type ViewTransformation = (
  ls: LensStack
) => (focus: Qi) => (g: Graph) => React.Component;

// probs think about whether lens stack separation is necessary
type LensStack = {
  lenses: Lens[]; // what are the different lenses that compose this view?
  fov: FieldOfView; // how much can I perceive from a centre?
  // is aperture neccesary? same as field of view, just describes dof - could look nice
};
type LensStackTransformation = (g: Graph) => React.CSSProperties;

type FieldOfView = All | Degree | RelatedContent; // this related content is the same as the "group type"
type All = number;
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
type Clear = unknown;
type Language = unknown; // Maybe not needed, implicit
type Heading = (rc: React.Component) => React.Component;
type Symbolic = Emoji | Thumbnails;
type Emoji = unknown;
type Thumbnails = unknown;
type RoseTinted = boolean;
type QiField = Colour & Brightness & Size;
type Luminance = QiField;
type Colour = string;
type Brightness = number;
type Size = number;
type NonSymbolic = unknown;

// Transformations - something changing
type Transformation = () => {};
type Recurring = (qi: Qi, graph: Graph) => { graph: Graph };
type Pulsation = (qiQuality: QiZhi, qiField: QiField) => QiField;

// Structure
type Structure =
  | List
  | GraphStructure
  | Table
  | SpaceTime
  | Grid
  | Calendar
  | Code
  | Embed;
type List = ListNumber | ListPoints | ListChecks; // should be collapsable
type ListNumber = (centre: Qi, g: Graph) => React.Component;
export type ListPoints = (centre: Qi, g: Graph) => JSX.Element;
type ListChecks = unknown;
type GraphStructure = Graph2D | Graph3D;
type Graph2D = unknown;
type Graph3D = unknown;
type Table = Kanban;
type Kanban = unknown;
type SpaceTime = unknown; // what is this??? same/diff to timeline?
type Grid = unknown;
type Calendar = unknown;
type Code = unknown;
type Embed = unknown;

// Ordering - how to differentiate and evaluate
// Maybe model using GADT
type Order = PartialOrder | Unordered;
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

// Graph Model and Operations
// TODO: should we implement state history here?
export type Graph = {
  nodes: Qi[];
  links: QiLink[];
  pickedNodes: Qi[];
  pickedLinks: QiLink[];
};

type GraphOperations = {
  createQi: (graph: Graph, info: Information) => Graph;
  createLink: (graph: Graph, from: Qi, to: Qi) => Graph;
  createNeighbour: (graph: Graph, from: Qi, info: Information) => Graph;
  changeQi: (graph: Graph, info: Information, qi: Qi) => Graph;
  changeQiLink: (
    graph: Graph,
    tong: QiZhi,
    order: Order,
    qiLink: QiLink
  ) => Graph;
  queryQi: (graph: Graph, id: number) => Qi;
  queryQiLink: (graph: Graph, id: number) => QiLink;
  delete: (graph: Graph, q: Q) => Graph;
  pick: (graph: Graph, q: Q) => Graph;
  popPicks: (graph: Graph, q: Q, nOfPicks: number) => Q[];
  // neighbour: (graph: Graph, q: Q) => Qi[];
  neighbours: (graph: Graph, q: Q, degree: number) => Qi[];
};

export class GraphImp implements Graph {
  nodes: Qi[] = [];
  links: QiLink[] = [];
  pickedNodes: Qi[] = [];
  pickedLinks: QiLink[] = [];
}

export const GraphOpsImp: GraphOperations = {
  createQi: (graph: Graph, info: Information) => {
    const id = graph.nodes.length;
    const qi = new QiImp(id, info);
    graph.nodes.push(qi);
    return graph;
  },
  createLink: (graph: Graph, from: Qi, to: Qi) => {
    const id = graph.links.length;
    const qiLink = new QiLinkImp(id, from, to);
    graph.links.push(qiLink);
    return graph;
  },
  createNeighbour: (graph: Graph, from: Qi, info: Information) => {
    const qiId = graph.nodes.length;
    const to = new QiImp(qiId, info);
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
      const newQi = new QiImp(index, info);
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
    if (index === -1) {
      return graph;
    } else {
      const newQiLink = new QiLinkImp(index, qiLink.from, qiLink.to);
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
  queryQi: (graph: Graph, id: number) => {
    const index = graph.nodes.findIndex((elem) => elem.id === id);
    if (index === -1) {
      return new QiImp(-1, "nothing"); //TODO: A better way of handling?
    } else {
      return graph.nodes[id];
    }
  },
  queryQiLink: (graph: Graph, id: number) => {
    const index = graph.links.findIndex((elem) => elem.id === id);
    if (index === -1) {
      const nothing = new QiImp(-1, "nothing"); //TODO: A better way of handling?
      return new QiLinkImp(-1, nothing, nothing); //TODO: A better way of handling?
    } else {
      return graph.links[id];
    }
  },
  delete: (graph: Graph, q: Q) => {
    if ((q as QiImp).information !== undefined) {
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
    if ((q as QiImp).information !== undefined) {
      graph.pickedNodes.push(q as QiImp);
      return graph;
    } else {
      graph.pickedLinks.push(q as QiLinkImp);
      return graph;
    }
  },
  popPicks: (graph: Graph, q: Q, nOfPicks: number) => {
    if ((q as QiImp).information !== undefined) {
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
  neighbours: (graph: Graph, q: Q, degree: number) => {
    // BFS based off CLRS page 595
    let neighbours: Qi[] = [];
    if ((q as QiImp).information !== undefined) {
      let marked: { qi: Qi; done: EmotionalState; dist: number }[] = [];
      marked = graph.nodes.map((qi: Qi) => {
        return { qi: qi, done: Trust.Doubt, dist: Infinity };
      });
      const source = q as Qi;
      let markedQiInfo = marked.find((markedQiInfo) => {
        return markedQiInfo.qi === source;
      });
      markedQiInfo!.dist = 0;
      let toTraverse: Qi[] = [];
      // Start
      toTraverse.push(source);
      while (toTraverse.length !== 0) {
        const currQi = toTraverse.shift();
        let markedQiInfo = marked.find((markedQiInfo) => {
          return markedQiInfo.qi === currQi;
        });
        if (markedQiInfo!.dist > degree) break;
        const currentAdjacentLinks: QiLink[] = graph.links.filter(
          (ql: QiLink) => ql.from === currQi
        );
        const currentAdjacentQi: Qi[] = currentAdjacentLinks.map(
          (ql: QiLink) => {
            return ql.to;
          }
        );
        for (let adjQi of currentAdjacentQi) {
          let markedQiInfo = marked.find((markedQiInfo) => {
            return markedQiInfo.qi === adjQi;
          });
          if (markedQiInfo!.done === Trust.Doubt) {
            markedQiInfo!.done = Trust.Trust;
            markedQiInfo!.dist += 1;
            toTraverse.push(adjQi);
          }
        }
        markedQiInfo = marked.find((markedQiInfo) => {
          return markedQiInfo.qi === currQi;
        });
        markedQiInfo!.done = Peace.Peace;
      }
    } else {
      // TODO: Some other day when needed
    }
    return neighbours;
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

class QiImp implements Qi {
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