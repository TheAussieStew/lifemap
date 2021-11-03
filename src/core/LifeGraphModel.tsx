import { action, makeAutoObservable, observable } from "mobx";
import { DateTime, Interval, Duration } from "luxon";
import { Content } from "@tiptap/react";
import React from "react";

// https://github.com/gvergnaud/ts-pattern
/** Acts as a type discriminator */
export type Type<T extends string> = {type: T}

export type Concept = { concept: RichText | Time | EmotionName | Void } & Type<"Concept">;
export type RichText = { richText: Content } & Type<"RichText">;
export type Time = { time: TimePoint | TimeDuration | TimeField } & Type<"Time">;
export type TimePoint = DateTime; 
export type TimeDuration = Duration;
export type TimeField = Interval;
// TODO: Probably need to buff out Time from a concept, into a fully fledged QiT, 
// that all link with each other and have causal consistency

export type EmotionName = {emotionName: string} & Type<"EmotionName">
export type Void = "Undefined"

export type RelationToRelation = QiT

type CausalRelationToRelation = Precedes | During | After;
// Refer to Casual Structure wikipedia
// Omit strictly precedes vs chronogically procedes for now
export type Precedes = "<";
export type During = "o"
export type After = ">"

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

// Could use composition of types, similar to Type<>, e.g replace information: Concept
export type QiT = {
  shen: ShenT;
  readonly id: number; 
  information: Concept;
  relations: Map<QiT, RelationToRelation[]>; // q [ror] qTo
  energy: QiZhi; // aggregation of relations qizhi
  causalRelations: Map<QiT | Time, CausalRelationToRelation[]>;
} & Type<"Qi">;
type Qi = {
  createQi: (shen?: ShenT) => QiT | ShenT;
  changeQi: (q: QiT, meaning: Concept) => QiT;
  createRelation: (q: QiT, qz?: QiZhi) => { q1: QiT; sibling: QiT };
  createCausalRelation: (q: QiT, c: CausalRelationToRelation, qTo: QiT) => { q1: QiT };
};
export const QiCorrect: Qi = {
  createQi: action((shen?: ShenT) => {
    if (shen) {
      // TODO: need to create qi on shen too
      return observable({
        type: "Qi",
        shen: shen!,
        id: Date.now() + Math.random(),
        information: {concept: {richText: "....", type: "RichText"}, type: "Concept"},
        relations: new Map<QiT, RelationToRelation[]>(),
        energy: QiZhi(),
        causalRelations: new Map<QiT | Time, CausalRelationToRelation[]>().set(
          {time: DateTime.local(), type: "Time"},
          [">"]
        ),
      }) as QiT;
    } else {
      return observable({
        type: "Shen",
        id: Date.now() + Math.random(),
        information: {concept: {richText: "....", type: "RichText"}, type: "Concept"},
        relations: new Map<QiT, RelationToRelation[]>(),
        energy: QiZhi(),
      }) as ShenT;
    }
  }),
  changeQi: action((q: QiT, meaning: Concept) => {
    q.information = meaning;
    return q;
  }),
  createRelation: action((q: QiT, qz?: QiZhi) => {
    let relation = QiCorrect.createQi(q.shen) as QiT;
    let rtr = QiCorrect.createQi(q.shen) as QiT;
    q.relations.set(relation, [rtr])
    return {q1: q, sibling: relation};
  }),
  createCausalRelation: action((q: QiT, c: CausalRelationToRelation, qTo: QiT) => { 
    q.causalRelations.set(qTo, [c])
    return { q1: q };
  })
};

export type ShenT = Omit<QiT, "type" | "shen" | "causalRelations"> & Type<"Shen">
export type Shen = {
  createShen: () => ShenT;
  createRelation: (s: ShenT, ) => { q: QiT; s1: ShenT };
};
export const GraphCorrect: Shen = {
  createShen: () => observable(QiCorrect.createQi() as ShenT),
  createRelation: action((s: ShenT) => {
    let q: QiT = QiCorrect.createQi(s) as QiT;
    s!.relations.set(q, []);
    return { q: q, s1: s };
  }),
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
  let result = QiCorrect.createRelation(tuple.q)
  QiCorrect.createCausalRelation(tuple.q, "<", result.q1);
  return shen;
}


