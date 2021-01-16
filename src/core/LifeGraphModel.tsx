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
type Math = "Math"
type Material = Vapour | Liquid | Acrylic | Glass | Paper | Wood | Metal; // why can't I do "= Qi"
export type EmotiveState = GraphNode;
type Time = TimePoint | TimeDuration | TimeSpan;
type TimePoint = DateTime; // Date time is really a "duration" from the original 1970 start time, can we omit? Or maybe just have a more recent beginning, like when you start using the app?
type TimeDuration = Duration; // should support negative durations e.g. start using app in 2020, refer to 1000AD = minus 1000 years, then minus specific time. don't need to store everything in a super large time format
type TimeSpan = TimePoint & TimeDuration & TimePoint;
type Vapour = GraphNode;
type Liquid = GraphNode;
type Acrylic = GraphNode;
type Glass = GraphNode;
type Paper = GraphNode;
type Wood = GraphNode;
type Metal = GraphNode;
type Location = number; 
type Imagery = "Image" | "Video" | "Thumbnail"; // image includes gif
type Person = {name: string};
type Group = GraphNode; 
type Arbitrary = GraphNode;
type Void = undefined; // sorta like any possibility, no meaning
type Transform = (n: GraphNode) => GraphNode;

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
type Pattern = (n: GraphNode) => boolean; // match not a single pattern, but many, unlike haskell how bout ref vs val
// can do switch fall through like computation, could do or style haskell pattern matching - these both check sequentially though
// or somehow some simultaneous parallell computation.

type GraphNode = {
  readonly id: number; // how about no id? it's generated automatically when inserted into the graph?
  meaning: Semantic;
  quality: QiZhi;
  siblings: GraphNode[]; // this is implicitly a relation, but doesn't have to be
};
type GraphNodeTransforms = {
  createGraphNode: (id: number) => GraphNode;
  siblings: (node: GraphNode) => GraphNode[]; 
  walk: (node: GraphNode, patterns: Pattern[], transforms: Transform[], bag: GraphNode) => {bag: GraphNode}; // number of patterns determine no traversals 
  // n patts == n transforms data invariant -> e.g. pattern = true or transform == pass, or continue or do nothing, or identity fn
  // containingGraph: (node: GraphNode) => Graph; // Really important, it links this to the containing graph structure // do i really need this?
}
export const GraphNodeCorrect: GraphNodeTransforms = {
  createGraphNode: (id: number) => {
    return { id: id, meaning: undefined, quality: 0, siblings: [] };
  },
  siblings: (node: GraphNode) => node.siblings,
  // bag has to be empty initially
  walk: (node: GraphNode, patterns: Pattern[], transforms: Transform[], bag: GraphNode) => { // walk is a quest but from one node, quest is from all nodes, simutaneously
    // this doesn't handle cycles
    if (patterns[bag.siblings.length](node) === true) {
      let transformedNode = transforms[bag.siblings.length](node);
      bag.siblings.push(transformedNode);
      for (let sibling of node.siblings) {
        GraphNodeCorrect.walk(sibling, patterns, transforms, bag);
      }
    } else {
      bag.siblings.push(node);
    }
    return {bag: bag};
  } 
};

type Graph = AdjacencyList | EdgeList | Matrix;
type AdjacencyList = {hypernodes: GraphNode[]};
type EdgeList = {hypernodes: GraphNode[], edges: GraphNode[]};
type Matrix = {hypernodes: GraphNode[], matrix: GraphNode[][]};
type GraphOps = {
  createGraph: () => Graph;
  createNode: (g: Graph) => {n: GraphNode, g1: Graph}; // can you create during quest, how>?
  createSibling: (g: Graph, n: GraphNode) => {sibling: GraphNode, g1: Graph};
  createRelation: (g: Graph, n1: GraphNode, n2: GraphNode) => {relation: GraphNode, g1: Graph};
  quest: (g: Graph, patterns: Pattern[], transforms: Transform[], bag: GraphNode) => {g1: Graph, bag: GraphNode}; // or could not return Graph and just mutate?
  // delete? but what about the edges? and what about the consistency of the temporal graph? maybe could mark as deleted?
  // pick or lens? add a new node that selects other nodes?
}
const GraphCorrect: GraphOps = {
  createGraph: () => {
    let g: AdjacencyList = {hypernodes: []};
    return g; 
  },
  createNode: (g: Graph) => {
    let n: GraphNode;
    n = GraphNodeCorrect.createGraphNode(g.hypernodes.length);
    g.hypernodes.push(n);
    return {n: n, g1: g}
  },
  createSibling: (g: Graph, n: GraphNode) => {
    let tuple: {n: GraphNode, g1: Graph} = GraphCorrect.createNode(g);
    let sibling = tuple.n;
    n.siblings.push(sibling);
    sibling.siblings.push(n);
    return {sibling: sibling, g1: tuple.g1};
  },
  createRelation: (g: Graph, n1: GraphNode, n2: GraphNode) => {
    let tuple: {n: GraphNode, g1: Graph} = GraphCorrect.createNode(g);
    let relation = tuple.n;
    n1.siblings.push(relation);
    relation.siblings.push(n1);
    relation.siblings.push(n2);
    n2.siblings.push(relation);
    return { relation: relation, g1: tuple.g1 };
  },
  quest: (g: Graph, patterns: Pattern[], transforms: Transform[], bag: GraphNode) => {
    for (let node of g.hypernodes) {
      let new
      bag.siblings.push(GraphNodeCorrect.walk(node, patterns, transforms, ))
    }
    if (patterns[bag.siblings.length](node) === true) {
      let transformedNode = transforms[bag.siblings.length](node);
      bag.siblings.push(transformedNode);
      for (let sibling of node.siblings) {
        GraphNodeCorrect.walk(sibling, patterns, transforms, bag);
      }
    } else {
      bag.siblings.push(node);
    }
    return {bag: bag};

    return {g1: Graph, bag: GraphNode};
  },
  // if it affects qi, how do you distinguish betwen query qi and something like emotionalstate qi?
  // need to avoid cycles...could definitely integrate that using conditions
}
const GraphFast: GraphOps = {};
const GraphChecker: (graphCorrect: GraphOps, graphFast: GraphOps) => boolean;