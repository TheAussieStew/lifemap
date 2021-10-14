import ColorHash from "color-hash";
import { motion } from "framer-motion";
import React from "react";
import { QiT, ShenT, ExampleShen, RelationToRelation, QiCorrect } from "../core/LifeGraphModel";
import { Tiptap } from "../core/Tiptap";
import { PortalFree } from "./Portal";
import { QiZhi } from "./QiZhi";

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
          {/* TODO: Make Tiptap save to store */}
          {/* TODO: Create a proper store, outside of component*/}
          <motion.div layout style={{ margin: `-16px 0 -16px 0` }}>
            <Tiptap
              modShen={(text: string) => {
                props.q.information = text;
              }}
              content={props.q.information as string}
            />
          </motion.div>
        </motion.div>
        <motion.div
          layout
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {"relations: "}
          <motion.div layout style={{ display: "grid" }}>
            {Array.from(props.q.relations.entries()).map((value, index) => (
              <>
                {value[1].map((rtr: RelationToRelation) => {
                  <Bubble q={rtr} hideDetail={true} />;
                })}
                <Bubble q={value[0]} hideDetail={true} />
              </>
            ))}
          </motion.div>
        </motion.div>
        <motion.div layout style={{display: "flex", alignItems:"center", gap: 20}}>
          {"energy: " + props.q.energy}
          <QiZhi energy={props.q.energy}/>
          </motion.div>
        <motion.div layout>
          {Object.keys(props.q).slice(-1)[0] + ":"}
          {/* <motion.div layout>
            {Array.from(props.q.causalRelations.keys()).map((relation: QiT, index) => (
              <Bubble q={relation} hideDetail={true} />
            ))}
          </motion.div> */}
        </motion.div>
      </motion.div>
    </PortalFree>
  );
};
export const BubbleExample = () => {
  const shen = ExampleShen()
  return (
    <>
      <Bubble q={shen} />
    </>
  );
};