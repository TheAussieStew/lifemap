import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Handle } from 'react-flow-renderer';
import ReactDOM from 'react-dom';
import G6, { Graph } from '@antv/g6';
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { parse, stringify } from "flatted";
import { Vector2 } from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import SpriteText from 'three-spritetext';
import { Card } from "@material-ui/core";
import { observer, useObserver } from "mobx-react-lite";
import { action } from "mobx";
import { GraphContext } from "../Main";
import { ShenToG6GraphCorrect, ShenToReactForceGraphCorrect, ShenToTiptapGraphCorrect } from "../core/Adaptors";
import { get, findBy } from "shades";
import { Controlled as CodeMirror } from "react-codemirror2";
import 'codemirror/theme/material.css';
import { motion } from "framer-motion";
import { AlwaysMatch, Journal, JournalT, QiCorrect, QiT, ShenT } from "../core/LifeGraphModel";
import { Tiptap } from "../core/Tiptap";
import { NodeObject } from "react-force-graph-3d";
import ReactFlow from "react-flow-renderer";
require('codemirror/mode/javascript/javascript');



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
export const LoggingCorrect = observer(() => {
  const shen = useContext(GraphContext); 
  const [value, setValue] = React.useState<ShenT>(shen);
  return (
    <CodeMirror
    //TODO: Figure out how to manage circular data structures, on edit too
      value={stringify(value, null, 4)}
      options={{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: false
      }}
      onBeforeChange={(editor, data, value) => {
      }}
      onChange={(editor, data, value) => {}}
    />
  );
});

export type Text = (text: string) => JSX.Element[];
//@ts-ignore
export const TextCorrect = (inputText: string) => {
  const [value, setValue] = useState(inputText);
  return (
    <div>

    </div>
  );
};

export const TextAnimated = (inputText: string) => {
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
export const Graph2DReactForce = observer(() => {
  const fgRef = useRef<any | undefined>(undefined);
  const shen = useContext(GraphContext);
  let graphData = ShenToReactForceGraphCorrect(shen);
  return (
    <div style={{ width: 300 }}>
      <ForceGraph2D
        ref={fgRef}
        width={400}
        height={400}
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const nodeText = get(
            "siblings",
            findBy((q: QiT) => q.id === node.id),
            "meaning"
          )(shen);
          const label = nodeText as string;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          // @ts-ignore
          ctx.fillStyle = node.color;
          // @ts-ignore
          ctx.fillText(label as string, node.x, node.y);
        }}
      />
    </div>
  );
});
export const Graph2DTipTap = observer(() => {
  const ref = React.useRef(null);
  let graph: Graph | null = null;
  const shen = useContext(GraphContext);
  let graphData = ShenToTiptapGraphCorrect(shen);

  const ColorSelectorNode = memo((props: { data: { id: string } }) => {
    return (
      <>
        <Handle
          type="source"
          // @ts-ignore
          position="left"
          style={{ background: "#555" }}
          onConnect={(params) => console.log("handle onConnect", params)}
        />
        <div style={{ padding: 15 }}>
          <Tiptap
            content={
              get(
                "siblings",
                findBy((q: QiT) => q.id === props.data.id as unknown as number),
                "meaning"
              )(shen) as string
            }
          />
        </div>
        <Handle
          // @ts-ignore
          position="right"
          id="a"
          style={{ background: "#555" }}
        />
      </>
    );
  });
  const nodeTypes = {
    selectorNode: ColorSelectorNode,
  };

  return <ReactFlow nodeTypes={nodeTypes} elements={graphData.elements} />;
});
//@ts-ignore
export const Graph3DCorrect = observer(() => {
  const fgRef = useRef<any | undefined>(undefined);
  const [bloomInitialised, initialiseBloom] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<any>(undefined)
  const [selectedCoords, setSelectedCoord] = useState<{ x: number; y: number }>(
    { x: 0, y: 0 }
  );
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
  const [open, setOpen] = React.useState<boolean>(false);
  const toggleOpen = () => {
    setOpen(!open);
  }
  return (
    <div style={{ width: 300 }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeResolution={7}
        width={500}
        height={500}
        linkCurvature="curvature"
        nodeAutoColorBy="group"
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={2}
        linkWidth={0.5}
        onNodeClick={(node, event) => {
          toggleOpen();
          console.log("nd", node);
          console.log("co", fgRef.current.graph2ScreenCoords(node.x, node.y));
          setSelectedNode(node);
          setSelectedCoord({
            x: fgRef.current.graph2ScreenCoords(node.x, node.y).x,
            y: fgRef.current.graph2ScreenCoords(node.x, node.y).y,
          });
          console.log("ev", event);
          console.log("se", selectedCoords);
        }}
        nodeThreeObject={(node) => {
          const nodeText = get(
            "siblings",
            findBy((q: QiT) => q.id === node.id),
            "meaning"
          )(shen);
          const sprite = new SpriteText(nodeText as string);
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

      <motion.div
        animate={open ? "opened" : "closed"}
        style={{
          position: "absolute",
          zIndex: 1,
          marginTop: -500,
          backgroundColor: "transparent",
        }}
        variants={{
          opened: {
            opacity: 1,
            x: selectedCoords.x,
            y: selectedCoords.y,
            backgroundColor: "white",
          },
          closed: {
            opacity: 0,
            display: "hidden",
          },
        }}
      >
        <Tiptap
          content={
            get(
              "siblings",
              findBy((q: QiT) => q.id === selectedNode!.id),
              "meaning"
            )(shen) as string
          }
        />
      </motion.div>
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