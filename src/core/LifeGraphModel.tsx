import { action, makeAutoObservable, observable } from "mobx";
import { DateTime, Interval, Duration } from "luxon";
import { Content } from "@tiptap/react";
import { motion } from "framer-motion";

type Type = { type: string };
export type Concept =
  | RichText
  | Time
  | Emotion
  | Void
type RichText = { concept: Content };
type Time = {
  concept: TimePoint | TimeDuration | TimeField,
};
type TimePoint = DateTime; 
type TimeDuration = Duration;
type TimeField = Interval;

type Emotion = { concept: string };
type Void = { concept: "Undefined" };

type Causal = Precedes | During;
// Refer to Casual Structure wikipedia
// Omit strictly precedes vs chronogically procedes for now
type Precedes = "<"
type During = "o"

export type QiZhi = {
  colour: string;
  dispersion: number;
  halfCycleDuration: number;
  repeatDelay: number;
};
const QiZhi = () => {
  const qiZhi: QiZhi = {
    colour: "#EFEFEF",
    dispersion: 1,
    halfCycleDuration: 1,
    repeatDelay: 1,
  };
  return qiZhi;
};

export type QiT = {
  shen: ShenT;
  readonly id: number;
  information: Concept;
  relations: QiT[];
  linkToRelations: QiT[];
  energy: QiZhi; // aggregation of relations qizhi
  temporal: Time;
  // QiT can be Temporal, or another Information QiT, or both
  // Why separate causal and other relations?
  // Causal has to do with time, other relationships has to do with semantics and emotion (higher more complex centres)
  causalRelations: QiT[];
  linkToCausalRelations: QiT[];
};
type Qi = {
  createQi: (shen: ShenT) => QiT;
  changeQi: (q: QiT, meaning: Concept) => QiT;
  createSibling: (q: QiT, qz: QiZhi) => { q1: QiT; sibling: QiT };
  createCausalRelation: (qA: QiT, c: Causal, qB: QiT) => { q1: QiT; relation: Causal };
};
export const QiCorrect: Qi = {
  createQi: (shen: ShenT) => {
    return {
      shen: shen,
      id: Date.now() + Math.random(),
      information: {type: "Rich Text", concept: ""},
      relations: [],
      linkToRelations: [],
      energy: QiZhi(),
      temporal: DateTime.local(),
      causalRelations: [],
      linkToCausalRelations: [],
    };
  },
  changeQi: action((q: QiT, meaning: Concept) => {
    q.information = meaning;
    return q;
  }),
  createSibling: action((q: QiT, qz: QiZhi) => {
    let sibling = QiCorrect.createQi(q.shen);
    q.relations.push({linkType: qz, linkTo: sibling});
    return {q1: q, sibling: sibling};
  }),
  createCausalRelation: (qA: QiT, c: Causal, qB: QiT) => { 
    qA.causalRelations.push({linkType: c, linkTo: qB})
    return {
      q1: qA,
      relation: c
    }
  }
};

export type ShenT = Omit<QiT, "shen">
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
      id: 0,
      information: "Void",
      energy: 0,
      relations: [],
      temporal: DateTime.local(),
      causalRelations: []
    };
    return s;
  },
  createQi: (s: ShenT) => {
    let q: QiT;
    q = QiCorrect.createQi(s);
    s.relations.push(q);
    return { q: q, s1: s };
  },
  // Maybe get rid of create sibling, no siblings to Shen
  createSibling: (s: ShenT, q: QiT) => {
    let tuple: { q: QiT; s1: ShenT } = GraphCorrect.createQi(s);
    let sibling = tuple.q;
    q.relations.push(sibling);
    sibling.relations.push(q);
    return { q1: q, sibling: sibling, s1: tuple.s1 };
  },
  // Maybe get rid of create relation or create qi, they are the same 
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

export const ExampleShen = () => {
  let shen = GraphCorrect.createShen();
  console.log("1", shen)
  let tuple: { q: QiT; s1: ShenT } = GraphCorrect.createQi(shen);
  console.log("2", tuple.s1)
  console.log("2.5", tuple.q)
  let result = GraphCorrect.createSibling(tuple.s1, tuple.q)
  console.log("3 s1", result.s1)
  console.log("3 q1", result.q1)
  console.log("3 sibling1", result.sibling)
  return shen;
}

