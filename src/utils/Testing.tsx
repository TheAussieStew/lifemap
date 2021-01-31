import { observer } from "mobx-react-lite";
import React, { createContext, useContext } from "react";
import { Shen, GraphCorrect, ShenT, Journal, JournalEntry, PatternMatch, QiT, Transform, QiCorrect } from "../core/LifeGraphModel";
import { completeOptic, Graph3DCorrect, Logging, Optic, TreeCorrect } from "../view/View";

// I want to test in a stateful manner. 
// I don't want everything to be tested in an isolated manner.
// I do want it to be sequential, so that failure is kind of blocking
// But if it can be bypassed it should! in a way, is kind of concurrent

// code adjacent platform, not no code, neither no code or code
// need a relationship like, type of Graph but weaker...

export const GraphContext = createContext<ShenT>(GraphCorrect.createShen());

export const GraphTest = {
    createGraph: () => {
        const shen = GraphCorrect.createShen(); 
        shen.meaning = "The Void";
        let {q, s1} = GraphCorrect.createQi(shen);
        q.meaning = "Hello universe!";
        return (
          <GraphContext.Provider value={shen}>
            <TreeCorrect/>
            <Graph3DCorrect/>
          </GraphContext.Provider>
        );
    },
    createNode: (g: ShenT) => {
        // const data = GraphCorrect.createQi(g);
        // let journal: Journal = new Map<QiT, JournalEntry>();
        // journal.set(data.g1, {distToPrev: 0});
        // journal.set(data.q, {distToPrev: 1});
        // return [
        //   TreeCorrect(data.g1, journal, "Points"),
        //   TreeCorrect(data.q, journal, "Points"),
        // ];
    },
    createSibling: (g: ShenT, q: QiT) => { 
        const data = GraphCorrect.createSibling(g, q);
        return ([
        ]);
    },
    createRelation: (g: ShenT, q1: QiT, q2: QiT) => {
        const data = GraphCorrect.createRelation(g, q1, q2);
        return ([
        ]);
    },
    quest: (
        g: ShenT,
        patterns: PatternMatch[],
        transforms: Transform[],
    ) => { 
        const data = GraphCorrect.quest(g, patterns, transforms);
        return ([
        ])
    },
    beginQuest: (g: ShenT) => {
        const data = GraphCorrect.beginQuest(g);
        return;
    }
}