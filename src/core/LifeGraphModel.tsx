// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { GraphicEq } from "@material-ui/icons";
import { DateTime, Interval, Duration } from "luxon";
import * as React from "react";

namespace LifeGraphModel {
  enum Cardinal {
    Left,
    Right,
    Up,
    Down,
    In,
    Out,
  }
  enum Trust {
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
    Hate = 250,
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
    Peace = 700,
    Disrespect = 120,
  }

  // View
  type ViewModel = {
    portals: [Portal];
  };
  type ViewOperations = {
    parsePortal: (p: Portal) => React.ReactNode;
    createPortal: (ls: LensStack, qi: [Qi]) => Portal;
    changePortal: (p: Portal, something: any) => Portal;
    createLensStack: () => LensStack;
    changeLensStack: (ls: LensStack, l: Lens) => LensStack;
    createLens: (l: Lens) => Lens;
  };

  type Portal = {
    children: [Portal | (LensStack & [Qi])];
  };

  type LensStack = {
    lenses: [Lens];
  };

  // Lens - different ways of viewing information - material
  type Lens =
    | Clear
    | Language
    | List
    | Code
    | GraphLens
    | Symbolic
    | RoseTinted
    | QiField
    | NonSymbolic; // don't represent these as qi, for now
  type Clear = unknown;
  type Language = unknown;
  type List = ListNumber | ListBullets;
  type ListNumber = unknown;
  type ListBullets = unknown;
  type Code = unknown;
  type GraphLens = Graph2D | Graph3D;
  type Graph2D = unknown;
  type Graph3D = unknown;
  type Symbolic = Emoji | Thumbnails;
  type Emoji = unknown;
  type Thumbnails = unknown;
  type RoseTinted = boolean;
  type QiField = Colour & Brightness & Size;
  type Luminance = QiField;
  type Colour = string;
  type Brightness = number;
  type Size = number;
  type NonSymbolic = boolean;

  // Transformations - something changing
  type Transformation = () => {};
  type Recurring = (qi: Qi, graph: Graph) => { graph: Graph };
  type Pulsation = (qiQuality: QiZhi, qiField: QiField) => QiField;

  // Information - just information
  type Information = Time | number | string | Image;
  type Image = string;

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

  type OrderRelation = QiZhi | EmotionalState | Time | Ratio | number | Binary;
  type EmotionalState = Peace | Gratitude | Love | Openness | Trust;
  type QiZhi = number;
  type Ratio = number;
  type Binary = Cardinal.Left | Cardinal.Right;

  // Time related
  type Time = TimePoint | TimeDuration | TimeSpan;
  type TimePoint = DateTime;
  type TimeDuration = Duration;
  type TimeSpan = Interval;

  // Graph Model and Operations
  type Graph = {
    nodes: Qi[];
    links: QiLink[];
    pickedNodes: Qi[];
    pickedLinks: QiLink[];
  }

  type GraphOperations = {
    createQi: (graph: Graph, info: Information) => Graph;
    createLink: (graph: Graph, from: Qi, to: Qi) => Graph;
    createNeighbour: (graph: Graph, from: Qi, info: Information) => Graph;
    changeQi: (graph: Graph, info: Information, qi: Qi) => Graph;
    changeQiLink: (graph: Graph, tong: QiZhi, order: Order, qiLink: QiLink) => Graph;
    queryQi: (graph: Graph, id: number) => Qi;
    queryQiLink: (graph: Graph, id: number) => QiLink;
    delete: (graph: Graph, q: Q) => Graph;
    pick: (graph: Graph, q: Q) => Graph;
    popPicks: (graph: Graph, q: Q, nOfPicks: number) => Q[];
    neighbours: (graph: Graph, q: Q, degree: number) => Qi[];
  };

  class GraphImp implements Graph {
    nodes: Qi[] = []
    links: QiLink[] = [];
    pickedNodes: Qi[] = [];
    pickedLinks: QiLink[] = [];
  }

  const GraphOpsImp: GraphOperations = {
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
      //TODO
      const neighbours: Qi[] = [];
      return neighbours;
    },
  };
  type Invariant = (something: unknown) => Boolean;
  // TODO: Invariants +  Refinement relations

  // Qi Definitions

  type Q = Qi | QiLink;
  type Qi = {
    readonly id: number; // number lookup is faster than string
    // Information
    information: Information;
    mutability?: boolean;
    transformable?: boolean;
    qiQuality?: QiZhi; // composed of all connected relations
    relation?: EmotionalState; // how do you relate to this single qi
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
  };

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

    constructor(id: number, from: Qi, to: Qi){
      this.id = id;
      this.from = from;
      this.to = to;
      this.tong = 0;
      // this.ordering = 1;
    }
  }
}

export { LifeGraphModel as lgm };
