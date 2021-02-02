import React, { useContext, useEffect, useRef, useState } from "react";
import { ForceGraph3D, ForceGraphMethods$2 } from "react-force-graph";
import { Vector2 } from "three";
import Rand from 'rand-seed';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import SpriteText from 'three-spritetext';
import { Card } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { AlwaysMatch, Journal, JournalT, QiCorrect, QiT, ShenT } from "../core/LifeGraphModel";
import { observer, useObserver } from "mobx-react-lite";
import { action } from "mobx";
import { GraphContext } from "../utils/Testing";
import { ShenToReactForceGraphCorrect } from "../core/Adaptors";

// Lens Grid - how different lenses are arranged
type LensGrid = unknown;

// Loupe - switching between different lenses
type Loupe = { lenses: Lens[]; selectedLens: Lens };

// Lens - a composition of all optical elements
type Lens = Distortion[] & Filter[] & Optic;

// Distortion - visualise saliency (font styling) and entropy
type Distortion = unknown;

// Filter - an overlay of information
type Filter = Clear | Censored | RoseTinted | QiField;
type Clear = { type: "Clear" };
type Censored = { type: "Censored" };
type RoseTinted = { type: "RoseTinted" };
type QiField = { type: "QiField" };

// Optic - viewing information as a certain structure
// it should be like: JSX[GraphNode] a wrapper around graph node, leave for future
export type completeOptic = Tree;
export type Optic = (q: QiT | ShenT) => JSX.Element[];
  // | Logging
  // | Tree // 1.5D but 1D on phones
  // | Code // 1.5D
  // | Masonry // 2D
  // | GraphOptic // 2D or 3D
  // | Table // 2D
  // | SpaceTime // 2D or 3D or even 4D?
  // | LightCone
  // | Calendar
  // | Embed;
type Code = unknown;
export type Logging = (q: QiT | ShenT) => JSX.Element[];
// @ts-ignore
export const LoggingCorrect: Logging = observer((q: QiT | ShenT) => {
  let loggingDivs: JSX.Element[] = [];
  let seen = new Set<any>();
  const recurse = (q1: QiT | ShenT, divs: JSX.Element[], depth: number, seen: Set<any>) => {
    const propertyNames = Object.keys(q1);
    for (let propertyName of propertyNames) {
      divs.push(
        <Card
          style={{
            marginLeft: 10 + depth * 15,
            marginRight: 10,
            marginBottom: -9,
            marginTop: 10,
          }}
        >
          {/* @ts-ignore */}
          {"{" + propertyName + ":" + q1[propertyName] }
        </Card>
      );
    }
  }
  recurse(q, loggingDivs, 0, seen);
  return loggingDivs;
})

export type Text = (text: string) => JSX.Element[];
//@ts-ignore
export const TextCorrect = observer((s: string) => {
  let [text, setText] = useState<string>(s);
  let elems = (
    <Stack/>
  ) 
});

export type Tree = (q: QiT | ShenT) => JSX.Element[];
// Had to sacrifice the functional, no use of side effects
// nature of this component...can figure out another way 
// to return this in future
//@ts-ignore
export const TreeCorrect = observer((
) => {
  const shen = useContext(GraphContext); 
  let decorator = "•";
  const divs: JSX.Element[] = [];
  let seen = new Set<QiT>();
  const onEnterPress = (q: QiT) => action((ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === "Enter") {
      console.log("Enter Pressed");
      QiCorrect.createSibling(q);
      ev.preventDefault();
    }
  });
  const onTextChange = (q: QiT) =>
    action(
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        QiCorrect.changeQi(q, event.target.value);
      }
    );
  const recurse = (
    divs: JSX.Element[],
    q1: QiT,
    depth: number,
    seen: Set<QiT>
  ) => {
    divs.push(
      <Card
        style={{
          marginLeft: 10 + depth * 15,
          marginRight: 10,
          marginBottom: -9,
          marginTop: 10,
        }}
      >
        {decorator + " "}
        <InputBase
          style={{ marginTop: -3, marginBottom: -3, width: "max-content" }}
          onKeyPress={onEnterPress(q1)}
          onChange={onTextChange(q1)}
          defaultValue={q1.meaning}
          inputProps={{ "aria-label": "naked" }}
        />
      </Card>
    );
    seen.add(q1);
    for (let sibling of q1.siblings) {
      if (!seen.has(sibling)) recurse(divs, sibling, depth + 1, seen);
    }
  };
  shen.siblings.map((q2: QiT) => recurse(divs, q2, 0, seen));
  return divs;
});

type Masonry = unknown; // either evenly sized or unevenly sized grid that's packed together
type GraphOptic = Graph2D | Graph3D;
type Graph2D = unknown;
type Graph3D = Optic;
//@ts-ignore
export const Graph3DCorrect = observer(() => {
  const fgRef = useRef<ForceGraphMethods$2 | undefined>(undefined);
  const [bloomInitialised, initialiseBloom] = useState<boolean>(false);
  useEffect(() => {
    if (null !== fgRef.current && undefined !== fgRef.current) {
      const bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        3,
        0.9,
        0.1
      );
      if (!bloomInitialised)  {
        fgRef.current.postProcessingComposer().addPass(bloomPass);
        initialiseBloom(true);
      }
    }
  });
  const shen = useContext(GraphContext);
  let graphData = ShenToReactForceGraphCorrect(shen);
  return (
    <div style={{ marginTop: 10 }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeResolution={7}
        width={600}
        height={600}
        linkCurvature="curvature"
        nodeAutoColorBy="group"
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={2}
        linkWidth={0.5}
        onNodeClick={() => {}}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.id ? node.id.toString() : "");
          // sprite.color = node.color;
          sprite.textHeight = 2;
          sprite.position.set(0, -8, 0);
          sprite.color = "#000000";
          sprite.strokeWidth = 0.5;
          sprite.strokeColor = "#888888";
          sprite.padding = 1;
          return sprite;
        }}
        nodeThreeObjectExtend={true}
      />
    </div>
  );
});
type Table = unknown;
type Kanban = Table; // Maybe this is the same as lightcone? (done, doing, to do, stuck?)
type SpaceTime = unknown; // what is this? same/diff to timeline? how to implement 4D?
type LightCone = unknown; // evolution of timeline
type Calendar = unknown; // what is this even
type Embed = unknown;
type Math = unknown; // should this be at Qi level?