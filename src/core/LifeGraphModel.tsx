// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { DateTime, Interval, Duration } from "luxon";
import * as React from "react";

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
type Lens = Clear | Language | List | Code | Graph | QiField | Symbolic | NonSymbolic; // don't represent these as qi, for now
type Clear = unknown;
type Language = unknown;
type List = ListNumber | ListBullets;
type ListNumber = unknown;
type ListBullets = unknown;
type Graph = Graph2D | Graph3D;
type Graph2D = unknown;
type Graph3D = unknown;
type Code = unknown;
type QiField = Colour & Brightness & Size;
type Luminance = QiField;
type Colour = string;
type Brightness = number;
type Size = number;
type Symbolic = Emoji | Thumbnails;
type Emoji = unknown;
type Thumbnails = unknown;
type NonSymbolic = boolean;

// Transformations - something changing
type Transformation = () => {};
type Recurring = (qi: Qi, graph: GraphData) => { graph: GraphData };
type Pulsation = (qiQuality: QiZhi, qiField: QiField) => QiField;

// Information - just information
type Information = Time | number | string | Image;
type Image = unknown;

// Ordering - how to differentiate and evaluate
type PartialOrder<OrderMetric> = {
  from: OrderMetric;
  to: OrderMetric;
  comparator: Comparator;
};
type Unordered = undefined;
type Comparator = (from: OrderMetric, to: OrderMetric) => number;

type OrderMetric = QiZhi | EmotionalState | Time | Ratio | number | Tuple;
type EmotionalState = Peace | Gratitude | Love | Openness | Trust;
type QiZhi = number;
type Ratio = number;
type Tuple = Cardinal.Left | Cardinal.Right;

// Time related
type Time = TimePoint | TimeDuration | TimeSpan;
type TimePoint = DateTime;
type TimeDuration = Duration;
type TimeSpan = Interval;

type GraphData = {
  nodes: Qis;
  links: QiLinks;
  pickedNodes: Qis;
  pickedLinks: QiLinks;
};

type Q = Qi | QiLink<OrderMetric>;
type GraphOperations<Q> = {
  create: CreateQi | CreateQiLink<OrderMetric> | CreateNeighbour;
  change: Change<Q>;
  delete: Delete<Q>;
  pick: Pick<Q>;
  unpick: Unpick<Q>;
  neighbours: Neighbours<Q>;
};
type CreateQi = (info: Information) => GraphData;
type CreateQiLink<OrderMetric> = (from: Qi, to: Qi) => GraphData;
type CreateNeighbour = (qi: Qi, info: Information) => GraphData;
type Change<Q> = (something: any, q: Q) => GraphData;
type Delete<Q> = (q: Q) => GraphData;
type Pick<Q> = (q: Q) => GraphData;
type Unpick<Q> = (q: Q) => GraphData;
type Neighbours<Q> = (q: Q, degree: BigInt) => [Qi];

type Qis = {
  [id: number]: Qi;
};
type Nodes = Qis;

type QiLinks = {
  [id: number]: QiLink<OrderMetric>;
};
type NodeLinks = QiLinks;

type Qi = {
  readonly id: number; // number lookup is faster than string
  // Information
  information: Information;
  mutability?: boolean;
  transformable?: boolean;
  qiQuality?: QiZhi; // composed of all connected relations
  relation: EmotionalState; // how do you relate to this single qi
  // Energy
  transformations?: Transformation[]; // describes how this qi transforms itself and the graph
  timeHorizon?: QiLink<TimeSpan>;
};
type Node = Qi;

type QiLink<OrderMetric> = {
  readonly id: number;
  readonly from: Qi;
  readonly to: Qi;
  tong: QiZhi;
  ordering: Unordered | PartialOrder<OrderMetric>;
};
type NodeLink = QiLink<OrderMetric>;
