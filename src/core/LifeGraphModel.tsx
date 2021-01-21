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

// Semantic = Relation = Meaning = Tangible
// Maybe model using GADT
export type Semantic =
  | Language
  | Symbolic //3D object? video? gif?
  | Location
  | Material
  | Imagery
  | Person
  | Time
  | Group
  | EmotiveState
  | Void
  | Transform;
type Symbolic = Emoji | UnicodeSymbol | Language;
type Emoji = string;
type UnicodeSymbol = string;
type Language = string; // char or word, but not code
type Code = "Code"; // later this will represent an ast (so no need to parse text!)
type Math = "Math";
type Material = Vapour | Liquid | Acrylic | Glass | Paper | Wood | Metal; // why can't I do "= Qi"
export type EmotiveState = Qi;
type Time = TimePoint | TimeDuration | TimeSpan;
type TimePoint = DateTime; // Date time is really a "duration" from the original 1970 start time, can we omit? Or maybe just have a more recent beginning, like when you start using the app?
type TimeDuration = Duration; // should support negative durations e.g. start using app in 2020, refer to 1000AD = minus 1000 years, then minus specific time. don't need to store everything in a super large time format
type TimeSpan = TimePoint & TimeDuration & TimePoint;
type Vapour = Qi;
type Liquid = Qi;
type Acrylic = Qi;
type Glass = Qi;
type Paper = Qi;
type Wood = Qi;
type Metal = Qi;
type Location = number;
type Imagery = "Image" | "Video" | "Thumbnail"; // image includes gif
type Person = { name: string };
type Group = Qi;
type Arbitrary = Qi;
type Void = undefined; // sorta like any possibility, no meaning
type Transform = (n: Qi) => Qi;

type Layout = Ratio | Direction; // need to add this to semantic after proper consideration of natural ui
type Ratio = number;
type Direction = Cardinal.Left | Cardinal.Right | Cardinal.Up | Cardinal.Down;
// maybe a type for logical relations, like greater than or AND or XOR etc

// Non-tangible, ethereal
export type QiZhi = Colour & Brightness & Dispersion;
type Colour = number;
type Brightness = number;
type Dispersion = number;

// matching is very simple. just imitate the json structure exactly, with everything as values.
type Pattern = (pattern: Qi) => boolean; // match not a single pattern, but many, unlike haskell how bout ref vs val
// can do switch fall through like computation, could do or style haskell pattern matching - these both check sequentially though
// or somehow some simultaneous parallell computation.

export type Qi = {
  readonly id: number; // how about no id? it's generated automatically when inserted into the graph?
  meaning: Semantic;
  quality: QiZhi;
  siblings: Qi[]; // this is implicitly a relation, but doesn't have to be
};
type QiTransforms = {
  createQi: (id: number) => Qi;
  siblings: (node: Qi) => Qi[];
  journey: (
    qi: Qi,
    patterns: Pattern[],
    transforms: Transform[],
    conversions: Conversion[],
    bag: Qi
  ) => { bag: Qi }; // number of patterns determine no traversals
  // n patts == n transforms data invariant -> e.g. pattern = true or transform == pass, or continue or do nothing, or identity fn
  // containingGraph: (node: GraphNode) => Graph; // Really important, it links this to the containing graph structure // do i really need this?
};
export const QiCorrect: QiTransforms = {
  createQi: (id: number) => {
    return { id: id, meaning: undefined, quality: 0, siblings: [] };
  },
  siblings: (q: Qi) => q.siblings,
  // bag has to be empty initially
  // analogy: a single person setting out on a journey by themselves
  // maybe can write this so that quest is a group of these, run concurrently
  journey: (
    qi: Qi,
    patterns: Pattern[],
    transforms: Transform[],
    conversions: Conversion[],
    bag: Qi
  ) => {
    let exploring = new Set<Qi>();
    let explored = new Set<Qi>();
    const transfer = (
      elem: Qi,
      prev: Set<Qi>,
      curr: Set<Qi>
    ) => {
      prev.delete(elem);
      curr.add(elem);
    };
    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    let current = qi;
    exploring.add(current);
    while (exploring.size >= 0) {
      let index = 0;
      let randomQiIndex = randomInt(0, exploring.size);
      for (let popped of exploring.values()) {
        if (index == randomQiIndex) {
          current = popped;
          break;
        }
        index += 1;
      }
      if (patterns[bag.siblings.length](current) == true) {
        const transformedNode = transforms[bag.siblings.length](current);
        const convertedNode = conversions[bag.siblings.length](transformedNode);
        bag.siblings.unshift(transformedNode);
      }
      for (let sibling of current.siblings) {
        exploring.add(sibling);
      }
      transfer(current, exploring, explored);
    }
    return { bag: bag };
  },
};

type Conversion = (q: Qi) => any;

type Graph = AdjacencyList | EdgeList | Matrix;
type AdjacencyList = { hyperqi: Qi[] };
type EdgeList = { hyperqi: Qi[]; edges: Qi[] };
type Matrix = { hyperqi: Qi[]; matrix: Qi[][] };
type GraphOps = {
  createGraph: () => Graph;
  createNode: (g: Graph) => { q: Qi; g1: Graph }; // can you create during quest, how>?
  createSibling: (g: Graph, q: Qi) => { sibling: Qi; g1: Graph };
  createRelation: (
    g: Graph,
    q1: Qi,
    q2: Qi
  ) => { relation: Qi; g1: Graph };
  quest: (
    g: Graph,
    patterns: Pattern[],
    transforms: Transform[],
    conversions: Conversion[],
    bag: Qi
  ) => { g1: Graph; bag: Qi }; // or could not return Graph and just mutate?
  // delete? but what about the edges? and what about the consistency of the temporal graph? maybe could mark as deleted?
  // pick or lens? add a new node that selects other nodes?
};
const GraphCorrect: GraphOps = {
  createGraph: () => {
    let g: AdjacencyList = { hyperqi: [] };
    return g;
  },
  createNode: (g: Graph) => {
    let q: Qi;
    q = QiCorrect.createQi(g.hyperqi.length);
    g.hyperqi.push(q);
    return { q: q, g1: g };
  },
  createSibling: (g: Graph, q: Qi) => {
    let tuple: { q: Qi; g1: Graph } = GraphCorrect.createNode(g);
    let sibling = tuple.q;
    q.siblings.push(sibling);
    sibling.siblings.push(q);
    return { sibling: sibling, g1: tuple.g1 };
  },
  createRelation: (g: Graph, q1: Qi, q2: Qi) => {
    let tuple: { q: Qi; g1: Graph } = GraphCorrect.createNode(g);
    let relation = tuple.q;
    q1.siblings.push(relation);
    relation.siblings.push(q1);
    relation.siblings.push(q2);
    q2.siblings.push(relation);
    return { relation: relation, g1: tuple.g1 };
  },
  // analogy is kind of like, king arthur sending all of his knights out to find the holy grail
  quest: (
    // does not mutate, just chooses things from environment, transforms, and then places in bag
    // maybe need to somehow get distance from somewhere? origin?
    // quest needs to somehow not cycle, but also link to cycles???
    g: Graph,
    patterns: Pattern[], // not sure if this is one patt per node, or all patterns, etc
    transforms: Transform[], // same as above, also not sure about correspondence between transforms and patts
    conversions: Conversion[],
    bag: Qi
  ) => {
    let exploring = new Set<Qi>();
    let explored = new Set<Qi>();
    const transfer = (
      elem: Qi,
      prev: Set<Qi>,
      curr: Set<Qi>
    ) => {
      prev.delete(elem);
      curr.add(elem);
    };
    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    let current = g.hyperqi[0];
    exploring.add(current);
    while (exploring.size >= 0) {
      let index = 0;
      let randomQiIndex = randomInt(0, exploring.size);
      for (let popped of exploring.values()) {
        if (index == randomQiIndex) {
          current = popped;
          break;
        }
        index += 1;
      }
      if (patterns[bag.siblings.length](current) == true) {
        const transformedNode = transforms[bag.siblings.length](current);
        const convertedNode = conversions[bag.siblings.length](transformedNode);
        bag.siblings.unshift(transformedNode);
      }
      for (let sibling of current.siblings) {
        exploring.add(sibling);
      }
      transfer(current, exploring, explored);
    }
    return { g1: g, bag: bag };
  },
  // if it affects qi, how do you distinguish betwen query qi and something like emotionalstate qi?
};
// const GraphFast: GraphOps = {};
type GraphChecker = (graphCorrect: GraphOps, graphFast: GraphOps) => boolean;
const GraphCheckerCorrect: GraphChecker = (graphCorrect: GraphOps, graphFast: GraphOps) => true;

