import { action, makeAutoObservable, observable } from "mobx";
import { DateTime, Interval, Duration } from "luxon";

export type Concept =
  | string
  | Time
  | Emotion
  | Void
type Time = TimePoint | TimeDuration | TimeField;
type TimePoint = DateTime; 
type TimeDuration = Duration;
type TimeField = Interval;
type Emotion = { emotionName: string };
type Void = "Undefined";

type Order = Before | During | After;
type Before = "->"
type During = "o"
type After = "<-"

export type QiZhi = Colour & Brightness & Dispersion; // maybe make this into something that represents 通 more accurately
type Colour = number;
type Brightness = number;
type Dispersion = number;

export type QiT = {
  shen: ShenT | undefined;
  readonly id: number;
  information: Concept;
  relations: QiT[];
  energy: QiZhi;
  temporal: Time;
  orderings: (Order & QiT)[];
};
type Qi = {
  createQi: (shen: ShenT) => QiT;
  changeQi: (q: QiT, meaning: Concept) => QiT;
  siblings: (q: QiT) => QiT[];
  createSibling: (q: QiT) => {q1: QiT, sibling: QiT};
};
export const QiCorrect: Qi = {
  createQi: (shen: ShenT) => {
    return makeAutoObservable({
      shen: shen,
      id: Date.now(),
      information: "",
      relations: [],
      energy: 0,
      temporal: DateTime.local(),
      orderings: []
    });
  },
  changeQi: action((q: QiT, meaning: Concept) => {
    q.information = meaning;
    return q;
  }),
  siblings: (q: QiT) => q.relations,
  // journey seems to check limitlessly, it doesn't look at no. patts
  createSibling: action((q: QiT) => {
    let sibling = QiCorrect.createQi(q.shen);
    q.relations.push(sibling);
    return {q1: q, sibling: sibling};
  }),
};

export type ShenT = QiT
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
    let s: ShenT = {
      shen: undefined,
      id: 0,
      information: "Undefined",
      energy: 0,
      relations: [],
      temporal: DateTime.local(),
      orderings: []
    };
    return makeAutoObservable(s);
  },
  createQi: (s: ShenT) => {
    let q: QiT;
    q = QiCorrect.createQi(s);
    s.relations.push(q);
    return { q: q, s1: s };
  },
  createSibling: (s: ShenT, q: QiT) => {
    let tuple: { q: QiT; s1: ShenT } = GraphCorrect.createQi(s);
    let sibling = tuple.q;
    q.relations.push(sibling);
    sibling.relations.push(q);
    return { q1: q, sibling: sibling, s1: tuple.s1 };
  },
  createRelation: (s: ShenT, q1: QiT, q2: QiT) => {
    let tuple: { q: QiT; s1: ShenT } = GraphCorrect.createQi(s);
    let relation = tuple.q;
    q1.relations.push(relation);
    relation.relations.push(q1);
    relation.relations.push(q2);
    q2.relations.push(relation);
    return { relation: relation, s1: tuple.s1 };
  },
};
// const ShenFast: Shen = {};
type ShenChecker = (sCorrect: Shen, sFast: Shen) => boolean;
const ShenCheckerCorrect: ShenChecker = (sCorrect: Shen, sFast: Shen) => true;

