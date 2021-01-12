// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { DateTime, Interval, Duration } from "luxon";
import shades from "shades";

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
  | Void;
type Symbolic = Emoji | UnicodeSymbol | Language;
type Emoji = string;
type UnicodeSymbol = string;
type Language = string; // char or word, but not code
type Code = "Code"; // later this will represent an ast (so no need to parse text!)
type Math = "Math"
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
type Person = {name: string};
type Group = Qi; 
type Arbitrary = Qi;
type Void = undefined; // sorta like any possibility, no meaning

type Layout = Ratio | Direction; // need to add this to semantic after proper consideration of natural ui
type Ratio = number;
type Direction = Cardinal.Left | Cardinal.Right | Cardinal.Up | Cardinal.Down;
// how to handle multiple semantics, so an image of a person!

// Non-tangible, ethereal
export type QiZhi = Colour & Brightness & Dispersion;
type Colour = number;
type Brightness = number;
type Dispersion = number;

type Transform = (q: Qi) => Qi;
type Pattern = (q: Qi) => Transform; // match not a single pattern, but many, unlike haskell

// Graph Model and Operations
// TODO: should we implement state history here?
// is there a way we can emulate the data constructor and syntax of haskell?
// so in haskell, it works like this
// first, the typings of the init, and the operations of the entity
// then, data invariants, it's like additional static type checking
// later, an abstract, slow but correct implementation of the typings
// after that, a concrete, faster implementation
// after that, some kind of equality checker between the results of the transforms of the concrete and abstract
// I don't really get the quickcheck example.

// should there even be a separate link? not just a specific node, with say, at least 2 nodes??
type GraphLink = {
  n1: GraphNode;
  n2: GraphNode;
  info: any; //e.g Semantic
}
type GraphLinkOps = {
  createGraphLink: (id: number, n1: GraphNode, n2: GraphNode) => GraphLink; // what about floating relations? e.g. just love, not between two particular things
  adjacent: (l: GraphLink) => {n1: GraphNode, n2: GraphNode};
}
const GraphLinkCorrect: GraphLinkOps = {
  createGraphLink: (id: number, n1: GraphNode, n2: GraphNode) => {
    return {
      n1: n1,
      n2: n2,
      info: undefined, //e.g Semantic
    };
  },
  adjacent: (l: GraphLink) => {
    return { n1: l.n1, n2: l.n2 };
  },
};

// graph is same as GraphNode? nope
type GraphNode = {
  readonly id: number; // how about no id? it's generated automatically when inserted into the graph?
  meaning: Semantic;
  quality: QiZhi;
  links: GraphLink[];
  siblings: GraphNode[];
};
type GraphNodeOps = {
  createGraphNode: (id: number) => GraphNode;
  siblings: (node: GraphNode) => GraphNode[];
  numOfSiblings: (node: GraphNode) => number;
  siblingLinks: (node: GraphNode) => GraphLink[];
  numOfSiblingLinks: (node: GraphNode) => number;
  // set: (node: GraphNode, field: unknown) => GraphNode; // how do you make this, some field of the GraphNode?
  // getId: (node: GraphNode) => number;
  // getV: (node: GraphNode) => unknown;
  // getReference: (node: GraphNode) => unknown; // how get ref in js? wait why do I need reference?
  // containingGraph: (node: GraphNode) => Graph; // Really important, it links this to the containing graph structure // do i really need this?
}
export const GraphNodeCorrect: GraphNodeOps = {
  createGraphNode: (id: number) => {
    return { id: id, meaning: undefined, quality: 0, links: [], siblings: []};
  },
  siblings: (node: GraphNode) => node.siblings,
  numOfSiblings: (node: GraphNode) => GraphNodeCorrect.siblings(node).length,
  siblingLinks: (node: GraphNode) => node.links,
  numOfSiblingLinks: (node: GraphNode) => GraphNodeCorrect.siblingLinks(node).length,
};

type Graph = AdjacencyList | EdgeList | Matrix;
type AdjacencyList = {graphType: "AdjacencyList", hypernodes: GraphNode[]};
type EdgeList = {graphType: "EdgeList", hypernodes: GraphNode[], edges: GraphLink[]};
type Matrix = {graphType: "Matrix", hypernodes: [], matrix: GraphLink[][]};
type GraphOps<T extends GraphNode> = {
  createGraph: (graphType: string) => (Graph | undefined);
  createNode: (g: Graph) => {n: GraphNode, g: Graph}; // gives you back the created GraphNode, so you can add information and stuff
  queryNode: (g: Graph, query: (n: GraphNode) => boolean) => (GraphNode[] | undefined);
  createEdge: (g: Graph, n1: GraphNode, n2: GraphNode) => {e: GraphLink, g: Graph};
  queryEdge: (g: Graph, query: (e: GraphLink) => boolean) => (GraphLink | undefined);
  createSibling: (g: Graph, n: GraphNode, info: any) => {sibling: GraphNode, g: Graph};
  numNodes: (g: Graph) => number;
  numEdges: (g: Graph) => number;
  quest: (g: Graph, bag: Qi, patterns: Pattern[], transforms: Transform[]) => Graph; // or could not return Graph and just mutate?
  // delete? but what about the edges? and what about the consistency of the temporal graph? maybe could mark as deleted?
  // pick or lens? add a new node that selects other nodes?
}
const GraphCorrect: GraphOps<GraphNode> = {
  createGraph: (graphType: string) => {
    if (graphType == "AdjacencyList") {
      return {graphType: graphType, hypernodes: []}
    } else if (graphType == "EdgeList") {
      return {graphType: graphType, hypernodes: [], edges: []}
    } else if (graphType == "Matrix") {
      return {graphType: graphType, hypernodes: [], matrix: [][0]} // syntax for matrix?
    } else {
      return undefined;
    }
  },
  createNode: (g: Graph) => {
    let n: GraphNode;
    switch (g.graphType) {
      case "AdjacencyList":
        n = GraphNodeCorrect.createGraphNode(g.hypernodes.length);
        g.hypernodes.push(n);
        break;
      case "EdgeList":
        n = GraphNodeCorrect.createGraphNode(g.hypernodes.length);
        g.hypernodes.push(n);
        break;
      case "Matrix":
        n = GraphNodeCorrect.createGraphNode(g.matrix.length);
        // Implement matrix when needed
        break;
    }
    return {n: n, g: g}
  },
  // if it affects qi, how do you distinguish betwen query qi and something like emotionalstate qi?
  // how do you implement reducers here? should you? e.g. hypernodes.maxOf("EmotionalState")
  // how to filter by depth? could dynamically generate the args for the .get fn
  // need to avoid cycles...could definitely integrate that using conditions
  // how to add depth information? don't, not here, just generate the tree, you can add depth later.
  // or maybe just add the depth here, cause it saves computational time? premature optimisation
  // queries is also equal to depth of search, since queries can just equal true or use the fn shades.all

  // will now query both nodes and links!
  queryNode: (g: Graph, filters: ((nodeInfo: any) => boolean)[]) => {
    let searchDepth = filters.length;
    // just use and in order to check for seenness
    let seenNodesIds: number[] = [];
    // my own custom traversal implementation
    // so you have a graph, and you have an entry point or points...
    // if you have multiple entry points, they work concurrency
    // e.g to produce shades.get('hypernodes', all, 'siblings', all, 'siblings', all))(g);
    let getFnArgs: any[] = [];
    for (let i = 0; i++; i < searchDepth) {
      getFnArgs.push((i == 0) ? "hypernodes" : "siblings");
      getFnArgs.push(shades.and(filters[i], (nodeInfo: GraphNode) => seenNodesIds.includes(nodeInfo.id)));
    }
    return shades.get(...getFnArgs)(g); // maybe upgrade typescript vscode version? https://stackoverflow.com/questions/45225128/typescript-error-when-using-the-spread-operator
  },
}
const GraphFast: GraphOps<GraphNode> = {};

// Qi Definitions
type Qi = GraphNode & {
  readonly id: number; // might be a hash?
  meaning: Semantic; // relation with itself
  quality: QiZhi; // flow with siblings and itself
  transforms?: Transform[]; // describes how this qi transforms itself and the graph, almost like haskell functions
  relations: Semantic[]; // relations with all siblings
  siblings: Qi[];
};