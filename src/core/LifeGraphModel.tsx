import { action, makeAutoObservable, observable } from "mobx";
import { DateTime, Interval, Duration } from "luxon";
import { Content } from "@tiptap/react";
import { motion } from "framer-motion";

export type Concept =
  | RichText
  | Time
  | EmotionName
  | Void
type RichText = Content 
export type Time = 
  TimePoint | TimeDuration | TimeField

type TimePoint = DateTime; 
type TimeDuration = Duration;
type TimeField = Interval;
// TODO: Probably need to buff out Time from a concept, into a fully fledged QiT, 
// that all link with each other and have causal consistency

type EmotionName = string 
type Void = "Undefined"

export type RelationToRelation = QiT

type CausalRelationToRelation = Precedes | During | After;
// Refer to Casual Structure wikipedia
// Omit strictly precedes vs chronogically procedes for now
type Precedes = "<"
type During = "o"
type After = ">"

export type QiZhi = {
  colour: string;
  dispersion: number;
  halfCycleDuration: number;
  repeatDelay: number;
};
const QiZhi = () => {
  const qiZhi: QiZhi = {
    colour: "#FFFFFF",
    dispersion: 1,
    halfCycleDuration: 1,
    repeatDelay: 1,
  };
  return qiZhi;
};

export type QiT = {
  shen: ShenT;
  readonly id: number; 
  information: Concept; // only this really needs to be type checked, not the Qi type
  relations: Map<QiT, RelationToRelation[]>; // q [ror] qTo
  energy: QiZhi; // aggregation of relations qizhi
  causalRelations: Map<QiT | Time, CausalRelationToRelation[]>;
};
type Qi = {
  createQi: (shen?: ShenT) => QiT | ShenT;
  changeQi: (q: QiT, meaning: Concept) => QiT;
  createRelation: (q: QiT, qz?: QiZhi) => { q1: QiT; sibling: QiT };
  createCausalRelation: (q: QiT, c: CausalRelationToRelation, qTo: QiT) => { q1: QiT };
};
export const QiCorrect: Qi = {
  createQi: (shen?: ShenT) => {
    // TODO: need to create qi on shen too
    return {
      shen: shen,
      id: Date.now() + Math.random(),
      information: ".....",
      relations: new Map<QiT, RelationToRelation[]>(),
      energy: QiZhi(),
      causalRelations: new Map<QiT | Time, CausalRelationToRelation[]>().set(DateTime.local(), ["<"]),
    };
  },
  changeQi: action((q: QiT, meaning: Concept) => {
    q.information = meaning;
    return q;
  }),
  createRelation: action((q: QiT, qz?: QiZhi) => {
    let relation = QiCorrect.createQi(q.shen) as QiT;
    let rtr = QiCorrect.createQi(q.shen) as QiT;
    return {q1: q, sibling: relation};
  }),
  createCausalRelation: (q: QiT, c: CausalRelationToRelation, qTo: QiT) => { 
    q.causalRelations.set(qTo, [c])
    return { q1: q };
  }
};

export type ShenT = Omit<QiT, "shen">
// type OtherImplementation = unknown;
export type Shen = {
  createShen: () => ShenT;
  createRelation: (s: ShenT, ) => { q: QiT; s1: ShenT }; // can you create during quest, how>?
};
export const GraphCorrect: Shen = {
  createShen: () => {
    const {shen, ...rest} = QiCorrect.createQi() as QiT;
    return rest;
  },
  createRelation: (s: ShenT) => {
    let q: QiT = QiCorrect.createQi(s) as QiT;
    s!.relations.set(q, []);
    return { q: q, s1: s };
  },
};
// const ShenFast: Shen = {};
type ShenChecker = (sCorrect: Shen, sFast: Shen) => boolean;
const ShenCheckerCorrect: ShenChecker = (sCorrect: Shen, sFast: Shen) => true;

export const ExampleShen = () => {
  let shen = GraphCorrect.createShen();
  console.log("1", shen)
  let tuple: { q: QiT; s1: ShenT } = GraphCorrect.createRelation(shen);
  console.log("2", tuple.s1)
  console.log("2.5", tuple.q)
  let result = GraphCorrect.createRelation(tuple.s1)
  console.log("3 s1", result.s1)
  console.log("3 sibling1", result.q)
  return shen;
}

