import { Button } from "@material-ui/core";
import { get } from "http";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useRef, useContext, memo } from "react";
import ReactFlow, { Handle } from "react-flow-renderer";
import { ForceGraph2D } from "react-force-graph";
import { findBy } from "shades";
import { ShenToReactForceGraphCorrect, ShenToTiptapGraphCorrect } from "../core/Adaptors";
import { QiT, ShenT, ExampleShen, GraphCorrect, QiCorrect } from "../core/LifeGraphModel";
import { Tiptap } from "../core/Tiptap";
import { GraphContext } from "../Main";

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