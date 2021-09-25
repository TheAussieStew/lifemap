import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Handle } from 'react-flow-renderer';
import G6, { Graph } from '@antv/g6';
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { stringify } from "flatted";
import { Vector2 } from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import SpriteText from 'three-spritetext';
import { observer, useObserver } from "mobx-react-lite";
import { action } from "mobx";
import { GraphContext } from "../Main";
import { ShenToReactForceGraphCorrect, ShenToTiptapGraphCorrect } from "../core/Adaptors";
import { mod, get, findBy } from "shades";
import { motion } from "framer-motion";
import { GraphCorrect, QiCorrect, QiT, Concept, ShenT, Shen} from "../core/LifeGraphModel";
import { Tiptap } from "../core/Tiptap";
import ReactFlow from "react-flow-renderer";
import { Button } from "@material-ui/core";
import { PortalFree } from "./Portal";
import { preview } from "@reactpreview/config";

// Optic - viewing information as a certain structure
// it should be like: JSX[GraphNode] a wrapper around graph node, leave for future
export type completeOptic = Tree;
export type Optic =
  | Logging
  | Bubble
  | Tree // 1.5D but 1D on phones
  | GraphOptic // 2D or 3D
export type Logging = (q: QiT | ShenT) => JSX.Element[];
// @ts-ignore
export const LoggingCorrect = observer(() => {
  const [shen, setShen] = React.useState<ShenT>(useContext(GraphContext));
    //TODO: Figure out how to manage circular data structures, on edit too
  return (
    <>
      <Tiptap
        content={`<pre><code class="language-javascript">${stringify(
          shen,
          null,
          4
        )}</code></pre>`}
      />
    </>
  );
});
export type Bubble = (q: QiT | ShenT) => JSX.Element[];
export const Bubble = (props: {q: QiT | ShenT}) => {
  return (
    <PortalFree>
      <motion.div layout style={{ display: "flex", flexDirection: "column" }}>
        <motion.div layout>
          {props.q.shen && <Bubble q={props.q.shen} />}
        </motion.div>
        <motion.div layout>{"id: " + props.q.id}</motion.div>
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
        <motion.div layout>{"relations: "}</motion.div>
        {props.q.relations.map((relation, index) => {
          <Bubble q={relation} />;
        })}
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
preview(Bubble, {
  example: {
    q: QiCorrect.createQi(GraphCorrect.createShen()),
  },
});
export const BubbleExample = () => {
  return (
    <>
      <Bubble q={QiCorrect.createQi(GraphCorrect.createShen())} />
    </>
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
  const recurse = (
    divs: JSX.Element[],
    q1: QiT,
    depth: number,
    seen: Set<QiT>
  ) => {
    divs.push(TextCorrect(q1.information.toString()));
    seen.add(q1);
    for (let sibling of q1.relations) {
      if (!seen.has(sibling)) recurse(divs, sibling, depth + 1, seen);
    }
  };
  shen.relations.map((q2: QiT) => recurse(divs, q2, 0, seen));
  return divs;
});

type GraphOptic = Graph2D | Graph3D;
type Graph2D = (q: QiT | ShenT) => JSX.Element[];
type Graph3D = (q: QiT | ShenT) => JSX.Element[];
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
            modShen={action((text: string) => {
              const qi = get(
                "siblings",
                findBy(
                  (q: QiT) => q.id === (selectedNode.id as unknown as number)
                )
              )(shen);
              QiCorrect.changeQi(qi, text);
              console.log("s", shen);
            })}
        />
      </motion.div>
    </div>
  );
});