import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Handle } from 'react-flow-renderer';
import G6, { Graph } from '@antv/g6';
import { ForceGraph2D } from "react-force-graph";
import { stringify } from "flatted";
import { observer, useObserver } from "mobx-react-lite";
import { action } from "mobx";
import { GraphContext } from "../Main";
import { ShenToReactForceGraphCorrect, ShenToTiptapGraphCorrect } from "../core/Adaptors";
import { mod, get, findBy } from "shades";
import { motion } from "framer-motion";
import { GraphCorrect, QiCorrect, QiT, Concept, ShenT, Shen, ExampleShen, LinkQi} from "../core/LifeGraphModel";
import { Tiptap } from "../core/Tiptap";
import ReactFlow from "react-flow-renderer";
import { Button } from "@material-ui/core";
import { PortalFree } from "./Portal";
import ColorHash from 'color-hash'


// Optic - viewing Qi in a certain way
export type Optic =
  | Logging
  | Bubble
  | GraphOptic // 2D or 3D
export type Logging = (props: { q: QiT | ShenT }) => JSX.Element;
// @ts-ignore
export const LoggingCorrect: Logging = (props: {q: QiT | ShenT}) => {
  //TODO: Figure out how to manage circular data structures, on edit too
  return (
    <>
      <Tiptap
        content={`<pre><code class="language-javascript">${stringify(
          props.q,
          null,
          4
        )}</code></pre>`}
      />
    </>
  );
};
const ExampleLogging = () => <LoggingCorrect q={ExampleShen()} />;

export type Bubble = (q: QiT | ShenT) => JSX.Element[];
export const Bubble = (props: { q: QiT | ShenT; hideDetail?: boolean }) => {
  const colour = new ColorHash({ lightness: 0.9 }).hex(props.q.id.toString());
  return (
    <PortalFree hideDetail={props.hideDetail} backgroundColor={colour}>
      <motion.div
        layout
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {props.q.hasOwnProperty("shen") && (
          <motion.div
            style={{ display: "flex", justifyContent: "space-between" }}
            layout
          >
            {"神: "}
            <Bubble
              // @ts-ignore
              q={props.q.shen}
              hideDetail={true}
            />
          </motion.div>
        )}
        <motion.div
          layout
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <motion.div layout>{"id: "} </motion.div>
          <motion.div layout>{props.q.id}</motion.div>
        </motion.div>
        <motion.div
          layout
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {"information: "}
          {/* TODO: Make Tiptap Onclick, not activate parent... */}
          <motion.div layout style={{ margin: `-16px 0 -16px 0` }}>
            <Tiptap content={props.q.information as string} />
          </motion.div>
        </motion.div>
        <motion.div
          layout
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {"relations: "}
          <motion.div layout>
            {props.q.relations.map((relation, index) => (
              <Bubble q={relation} hideDetail={true} />
            ))}
          </motion.div>
        </motion.div>
        <motion.div layout>{"energy: " + props.q.energy}</motion.div>
        <motion.div layout>
          {"temporal: " + props.q.temporal!.toString()}
        </motion.div>
        <motion.div layout>{"orderings: incomplete"}</motion.div>
        {/* {props.q.orderings} */}
      </motion.div>
    </PortalFree>
  );
};
export const BubbleExample = () => {
  return (
    <>
      <Bubble q={ExampleShen()} />
    </>
  );
};

type GraphOptic = Graph2D | Graph3D;
type Graph2D = (props: { q: QiT | ShenT }) => JSX.Element;
type Graph3D = (props: { q: QiT | ShenT }) => JSX.Element;
export const Graph2DReactForce: Graph2D = (props: { q: QiT | ShenT }) => {
  const fgRef = useRef<any | undefined>(undefined);
  let graphData = ShenToReactForceGraphCorrect(props.q);
  return (
    <div style={{ width: 300 }}>
      <ForceGraph2D
        ref={fgRef}
        width={400}
        height={400}
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx, globalScale) => {
          // const nodeText = get(
          //   "relations",
          //   findBy((linkQi: LinkQi<QiZhi>) => q.id === node.id),
          //   "meaning"
          // )(props.q);
          // const label = nodeText as string;
          // const fontSize = 12 / globalScale;
          // ctx.font = `${fontSize}px Sans-Serif`;
          // const textWidth = ctx.measureText(label).width;
          // const bckgDimensions = [textWidth, fontSize].map(
          //   (n) => n + fontSize * 0.2
          // ); // some padding
          // ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          // ctx.textAlign = "center";
          // ctx.textBaseline = "middle";
          // // @ts-ignore
          // ctx.fillStyle = node.color;
          // // @ts-ignore
          // ctx.fillText(label as string, node.x, node.y);
        }}
      />
    </div>
  );
};
const Graph2DExample = () => <Graph2DReactForce q={ExampleShen()}/>

export const Graph2DTipTap = observer(() => {
  const ref = React.useRef(null);
  let graph: Graph | null = null;
  const shen = useContext(GraphContext);

  const addNeighbour = (nodeId: string) => {
    var qi = get(
      "siblings",
      findBy((q: QiT) => q.id === (nodeId as unknown as number))
    )(shen)
    const {q1: q1, sibling: neighbour, s1: shen2} = GraphCorrect.createSibling(shen, qi);
    // TODO: Probably problem is that shen is not updated. Current node approach is to only 
    // add sibling to the node, not the shen as well
    // Figure out how to update shen with new one that is returned...
    QiCorrect.changeQi(neighbour, "hello neighbour");
  };

  const Node = memo((props: { data: { id: string } }) => {
    return (
      <>
        <Handle
          type="source"
          // @ts-ignore
          position="left"
          style={{ background: "#555" }}
          onConnect={(params) => console.log("handle onConnect", params)}
        />
        <div style={{ padding: 15, display: "grid", placeItems: "center" }}>
          {console.log(
            "TTNode",
            get(
              "siblings",
              findBy((q: QiT) => (q.id === (props.data.id as unknown as number))),
              "meaning"
            )(shen) as string,
            props.data.id,
            props.data.id as unknown as number,
            get(
              "siblings",
              findBy((q: QiT) => q.id === props.data.id as unknown as number),
            )(shen)
          )}
          <Tiptap
            content={
              get(
                "siblings",
                findBy(
                  (q: QiT) => q.id === (props.data.id as unknown as number)
                ),
                "meaning"
              )(shen) as string
            }
            modShen={action((text: string) => {
              const qi = get(
                "siblings",
                findBy(
                  (q: QiT) => q.id === (props.data.id as unknown as number)
                )
              )(shen);
              QiCorrect.changeQi(qi, text);
              console.log("s", shen);
            })}
          />
          <Button
            onClick={() => {
              addNeighbour(props.data.id);
            }}
          >
            +
          </Button>
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
    selectorNode: Node,
  };

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      elements={ShenToTiptapGraphCorrect(shen).elements}
    />
  );
});