import ColorHash from "color-hash";
import { motion } from "framer-motion";
import React from "react";
import { QiT, ShenT, ExampleShen } from "../core/LifeGraphModel";
import { Tiptap } from "../core/Tiptap";
import { PortalFree } from "./Portal";
import { is } from 'typescript-is';

export const Bubble = (props: { q: QiT | ShenT; hideDetail?: boolean }) => {
  const colour = new ColorHash({ lightness: 0.9 }).hex(props.q.id.toString());
  console.log(is<string>("Hi"))

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