// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { action, makeAutoObservable, observable } from "mobx";
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
export type EmotiveState = QiT;
type Time = TimePoint | TimeDuration | TimeSpan;
type TimePoint = DateTime; // Date time is really a "duration" from the original 1970 start time, can we omit? Or maybe just have a more recent beginning, like when you start using the app?
type TimeDuration = Duration; // should support negative durations e.g. start using app in 2020, refer to 1000AD = minus 1000 years, then minus specific time. don't need to store everything in a super large time format
type TimeSpan = TimePoint & TimeDuration & TimePoint;
type Vapour = QiT;
type Liquid = QiT;
type Acrylic = QiT;
type Glass = QiT;
type Paper = QiT;
type Wood = QiT;
type Metal = QiT;
type Location = number;
type Imagery = "Image" | "Video" | "Thumbnail"; // image includes gif
type Person = { name: string };
type Group = QiT;
type Arbitrary = QiT;
type Void = "Undefined"; // sorta like any possibility, no meaning

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
export type Matchness = Many | Over | Exact | Part | None;
// match is kind of like a filter, it should just return the result 
type Many = Matchness[];
type Over = any;
type Exact = any;;
type Part = any;
type None = undefined;
export type PatternMatch = (toCheck: QiT, patternToMatch: any) => Matchness; // match not a single pattern, but many, unlike haskell how bout ref vs val
export const CompleteMatch: PatternMatch = (toCheck: QiT, patternToMatch: any) => {
  return toCheck === patternToMatch;
}; // match not a single pattern, but many, unlike haskell how bout ref vs val
export const AlwaysMatch: PatternMatch = (toCheck: QiT, patternToMatch: any) => true;
export const IsElemMatch: PatternMatch = (toCheck: QiT, patternToMatch: any) => {
  // need to partially match a search on qi.id = 0
  // and then transform this qi, by qi.meaning = "ground"
  // and create more siblings, qi.siblings.push("pebbles")
  // this means when the quest function continues, it will actually add these
  // new created siblings to the exploring q
  return true;
}; 

export type Transform = (n: QiT) => QiT;
export const IdentityTransform = (n: QiT) => n;

export type Map2D<KeyT, ValueT> = Map<KeyT, Map<KeyT, ValueT>>;
export type JournalT = Map2D<QiT, JournalEntry>;
export type JournalEntry = { timesSeen: number; dist: number; next: QiT };
export type Journal = {
  createJournal: () => JournalT;
  set: (
    j: JournalT
  ) => (
    outerKey: QiT
  ) => (
    innerKey: QiT
  ) => (timesSeen?: number, dist?: number, next?: QiT) => JournalT;
  get: (j: JournalT) => (outerKey: QiT) => (innerKey: QiT) => JournalEntry;
};
export const JournalCorrect: Journal = {
  createJournal: () => {
    return new Map<QiT, Map<QiT, JournalEntry>>();
  },
  set: (j: JournalT) => (outerKey: QiT) => (innerKey: QiT) => (
    timesSeen?: number,
    dist?: number,
    next?: QiT
  ) => {
    if (j.has(outerKey) && j.has(innerKey)) {
      let journalEntry = j.get(outerKey)!.get(innerKey)!;
      if (timesSeen) journalEntry.timesSeen = timesSeen; // you can simplify this using a for loop, somehow...
      if (dist) journalEntry.dist = dist;
      if (next) journalEntry.next = next;
      let innerMap = j.get(innerKey)!;
      innerMap.set(innerKey, journalEntry);
      j.set(outerKey, innerMap);
    }
    return j;
  },
  get: (j: JournalT) => (outerKey: QiT) => (innerKey: QiT) =>
    j.get(outerKey)!.get(innerKey)!,
};

export type QiT = {
  shen: ShenT;
  readonly id: number; // how about no id? it's generated automatically when inserted into the graph?
  meaning: Semantic;
  quality: QiZhi;
  siblings: QiT[];
};
type Qi = {
  createQi: (shen: ShenT) => QiT;
  changeQi: (q: QiT, meaning: Semantic) => QiT;
  siblings: (q: QiT) => QiT[];
  createSibling: (q: QiT) => {q1: QiT, sibling: QiT};
  journey: (
    start: QiT,
    patterns: PatternMatch[],
    transforms: Transform[],
  ) => {bag: QiT, journal: JournalT} // number of patterns determine no traversals
  // n patts == n transforms data invariant -> e.g. pattern = true or transform == pass, or continue or do nothing, or identity fn
};
export const QiCorrect: Qi = {
  createQi: (shen: ShenT) => {
    return makeAutoObservable({
      shen: shen,
      id: Date.now(),
      meaning: "",
      quality: 0,
      siblings: [],
    });
  },
  changeQi: action((q: QiT, meaning: Semantic) => {
    q.meaning = meaning;
    return q;
  }),
  siblings: (q: QiT) => q.siblings,
  // journey seems to check limitlessly, it doesn't look at no. patts
  createSibling: action((q: QiT) => {
    let sibling = QiCorrect.createQi(q.shen);
    q.siblings.push(sibling);
    return {q1: q, sibling: sibling};
  }),
  journey: (
    start: QiT,
    patterns: PatternMatch[], // problem: no limit on distance
    transforms: Transform[],
  ) => {
    let {q1, sibling} = QiCorrect.createSibling(start);
    let bag = sibling;
    let journal = JournalCorrect.createJournal();
    let exploring: QiT[] = [start]; // need O(1) unshifts or pops
    let explored = new Set<QiT>(); // need O(1) membership checking
    let previous = start;
    for (let current of exploring) {
      // finished step, you're at a new place
      JournalCorrect.set(journal)(previous)(current)(undefined, 1, undefined);
      // pattern matching, transformation and gathering from current node
      bag.siblings.push(current);
      explored.add(current);
      // queue up new places you want to explore
      for (let sibling of current.siblings) {
        if (!explored.has(sibling)) exploring.push(sibling);
      }
      previous = current; // step forward
    }
    return {bag: bag, journal: journal};
  },
};
// maybe add recursive implementation, or a "focal" to emphasise continual updating

export type ShenT = AdjacencyList;
type AdjacencyList = Omit<QiT, "shen">;
// type OtherImplementation = unknown;
export type Shen = {
  createShen: () => ShenT;
  createQi: (s: ShenT) => { q: QiT; s1: ShenT }; // can you create during quest, how>?
  createSibling: (s: ShenT, q: QiT) => { q1: QiT, sibling: QiT; s1: ShenT };
  createRelation: (
    s: ShenT,
    q1: QiT,
    q2: QiT
  ) => { relation: QiT; s1: ShenT };
  quest: (
    s: ShenT,
    patterns: PatternMatch[],
    transforms: Transform[],
  ) => { s1: ShenT, bag: QiT, journal: JournalT }; // or could not return Graph and just mutate?
  // delete? but what about the edges? and what about the consistency of the temporal graph? maybe could mark as deleted?
  // pick or lens? add a new node that selects other nodes?
  beginQuest: (s: ShenT) => {s1: ShenT, bag: QiT}
};
export const GraphCorrect: Shen = {
  createShen: () => {
    let s: AdjacencyList = {
      id: 0,
      meaning: "Undefined",
      quality: 0,
      siblings: [],
    };
    return makeAutoObservable(s);
  },
  createQi: (s: ShenT) => {
    let q: QiT;
    q = QiCorrect.createQi(s);
    s.siblings.push(q);
    return { q: q, s1: s };
  },
  createSibling: (s: ShenT, q: QiT) => {
    let tuple: { q: QiT; s1: ShenT } = GraphCorrect.createQi(s);
    let sibling = tuple.q;
    q.siblings.push(sibling);
    sibling.siblings.push(q);
    return { q1: q, sibling: sibling, s1: tuple.s1 };
  },
  createRelation: (s: ShenT, q1: QiT, q2: QiT) => {
    let tuple: { q: QiT; s1: ShenT } = GraphCorrect.createQi(s);
    let relation = tuple.q;
    q1.siblings.push(relation);
    relation.siblings.push(q1);
    relation.siblings.push(q2);
    q2.siblings.push(relation);
    return { relation: relation, s1: tuple.s1 };
  },
  // analogy is kind of like, king arthur sending all of his knights out to find the holy grail
  // maybe shen is organised in a very optimised fashion, like a b-tree for "quests"
  quest: (
    // does not mutate, just chooses things from environment, transforms, and then places in bag
    // maybe need to somehow get distance from somewhere? origin?
    // quest needs to somehow not cycle, but also link to cycles???
    s: ShenT,
    patterns: PatternMatch[], // not sure if this is one patt per node, or all patterns, etc
    transforms: Transform[], // same as above, also not sure about correspondence between transforms and patts
  ) => {
    let haul = QiCorrect.journey(s.siblings[0], patterns, transforms);
    return { s1: s, bag: haul.bag, journal: haul.journal };
  },
  beginQuest: (s: ShenT) => {
    let patterns: PatternMatch[] = [];
    let transforms: Transform[] = [];
    let depth = 10;
    for (let i = depth; i > 0; i--) {
      patterns.push(AlwaysMatch);
      transforms.push(IdentityTransform);
    }
    return GraphCorrect.quest(s, patterns, transforms);
  }
  // if it affects qi, how do you distinguish betwen query qi and something like emotionalstate qi?
};
// const ShenFast: Shen = {};
type ShenChecker = (sCorrect: Shen, sFast: Shen) => boolean;
const ShenCheckerCorrect: ShenChecker = (sCorrect: Shen, sFast: Shen) => true;

