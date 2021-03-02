import React, { useContext, useEffect, useRef, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { ForceGraph3D, ForceGraphMethods$2 } from "react-force-graph";
import { Vector2 } from "three";
import { Frame, Stack } from "framer";
import { useMotionValue } from "framer-motion";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import SpriteText from 'three-spritetext';
import { Card } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { AlwaysMatch, Journal, JournalT, QiCorrect, QiT, ShenT } from "../core/LifeGraphModel";
import { observer, useObserver } from "mobx-react-lite";
import { action } from "mobx";
import { GraphContext } from "../utils/Testing";
import { ShenToReactForceGraphCorrect } from "../core/Adaptors";
import { map } from "shades";
import { useHotkeys } from "react-hotkeys-hook";

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
  const recurse = (
    q1: QiT | ShenT,
    divs: JSX.Element[],
    depth: number,
    seen: Set<any>
  ) => {
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
          {"{" + propertyName + ":" + q1[propertyName]}
        </Card>
      );
    }
  };
  recurse(q, loggingDivs, 0, seen);
  return loggingDivs;
});

export type Text = (text: string) => JSX.Element[];
//@ts-ignore
export const TextCorrect = (inputText: string) => {
  const [value, setValue] = useState(inputText);
  return <ReactQuill theme="bubble" value={value} onChange={setValue} />;
};
export const TextAnimated = (inputText: string) => {
  let decorator = "•";
  let [text, setText] = useState<string>(decorator + " " + inputText);
  let [x, setX] = useState<number>(0);
  let frames: JSX.Element[] = [];
  for (let i = 0; i < text.length; i++) {
    frames.push(
      <Frame
        width={13}
        height={19}
        radius={3}
        opacity={0.9}
        backgroundColor="#EFEFEF"
        drag={true}
        dragConstraints={{ left: -1, right: 1, top: 0, bottom: 0 }}
        dragElastic={0.05}
        whileHover={{ scale: 0.9, backgroundColor: "#DDDDDD" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1.0 }}
        transition={{ delay: i * 0.01 }}
      >
        {text.charAt(i)}
      </Frame>
    );
  }
  let position = useMotionValue(0);
  let cursor = (
    <Frame
      width={2.5}
      //@ts-ignore
      x={position}
      height={19}
      radius={3}
      opacity={0.8}
      backgroundColor="#000000"
      drag={true}
      dragConstraints={{ left: -100, right: 110, top: 0, bottom: 0 }}
      dragElastic={0.05}
      whileHover={{ scale: 0.9, backgroundColor: "#DDDDDD" }}
      initial={{ scale: 0 }}
      animate={{ scale: 1.0 }}
    >
    </Frame>
  );
  useHotkeys("l", () => {
    console.log("x pos", position);
    position.set(position.get() + 10);
  });
  useHotkeys("h", () => {
    console.log("x pos", position);
    position.set(position.get() - 10);
  });
  frames.push(cursor);
  return (
    <Stack
      direction="horizontal"
      gap={0.5}
      drag={true}
      dragConstraints={{ left: -1, right: 1, top: 0, bottom: 0 }}
      style={{
        alignItems: "flex-start",
        alignContent: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        height: "fit-content",
      }}
    >
      {frames}
    </Stack>
  );
};

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
    divs.push(TextCorrect(q1.meaning.toString()));
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