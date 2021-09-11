// Enforce ES6 arrow syntax. Enforce return arguments in fn defs
// TODO: prettier, eslint
import { action, makeAutoObservable, observable } from "mobx";
import { DateTime, Interval, Duration } from "luxon";

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
type Symbolic = Emoji | UnicodeSymbol | Language;
type Emoji = string;
type UnicodeSymbol = string;
type Language = string; // char or word, but not code
type Code = "Code"; // later this will represent an ast (so no need to parse text!)
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

// Non-tangible, ethereal
export type QiZhi = Colour & Brightness & Dispersion;
type Colour = number;
type Brightness = number;
type Dispersion = number;

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
};

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
};
// const ShenFast: Shen = {};
type ShenChecker = (sCorrect: Shen, sFast: Shen) => boolean;
const ShenCheckerCorrect: ShenChecker = (sCorrect: Shen, sFast: Shen) => true;

