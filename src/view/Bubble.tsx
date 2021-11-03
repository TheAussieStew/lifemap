import ColorHash from "color-hash";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import React from "react";
import { QiT, ShenT, ExampleShen, RelationToRelation, QiCorrect, Time, RichText, GraphCorrect } from "../core/LifeGraphModel";
import { ShenContext, Store } from "../core/Store";
import { Tiptap } from "../core/Tiptap";
import { PortalFree } from "./Portal";
import { QiZhi } from "./QiZhi";

export const Bubble = observer((props: { q: QiT | ShenT; hideDetail?: boolean }) => {
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
        {props.q.type === "Qi" && (
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
          <motion.div
            layout
            onClick={(e: any) => {
              e.stopPropagation();
            }}
            style={{ margin: `-16px 0 -16px 0` }}
          >
            <Tiptap
              modShen={(text: string) => {
                (props.q.information.concept as RichText).richText = text;
              }}
              content={
                (props.q.information.concept as RichText).richText as string
              }
            />
          </motion.div>
        </motion.div>
        <motion.div
          layout
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {"relations: "}
          <motion.div layout style={{ display: "grid" }}>
            {Array.from(props.q.relations.entries()).map((keyValue, index) => (
              <motion.div layout key={keyValue[0].id}>
                <>
                  {keyValue[1].map((rtr: RelationToRelation) => (
                    <Bubble q={rtr} hideDetail={true} />
                  ))}
                  →
                </>
                <Bubble q={keyValue[0]} hideDetail={true} />
              </motion.div>
            ))}
            <motion.div
              onClick={(e: any) => {
                e.stopPropagation();
                if (props.q.type === "Shen") {
                  GraphCorrect.createRelation(props.q);
                  console.log("new shen relation created");
                } else {
                  QiCorrect.createRelation(props.q);
                  console.log("new qi relation created");
                }
              }}
              whileTap={{ scale: 0.8 }}
              style={{
                borderRadius: "50%",
                height: 20,
                width: 20,
                display: "grid",
                placeItems: "center",
                border: `2px solid #777777`,
              }}
            >
              +
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          layout
          style={{ display: "flex", alignItems: "center", gap: 20 }}
        >
          {"energy: " + props.q.energy}
          <QiZhi energy={props.q.energy} />
        </motion.div>
        {props.q.type === "Qi" && (
          <motion.div layout id="causalRelations">
            {"causalRelations: "}
            <motion.div layout style={{ display: "grid" }}>
              {Array.from(props.q.causalRelations.keys()).map(
                (relation: QiT | Time, index) => (
                  <div>
                    {(props.q as QiT).causalRelations.get(relation) + " "}
                    {relation.type === "Qi" ? (
                      <Bubble q={relation} hideDetail={true} />
                    ) : (
                      relation.time.toString().substring(0, 18) + "..."
                    )}
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </PortalFree>
  );
});

export const BubbleExample = () => {
  return (
    <Store>
      <Bubble q={React.useContext(ShenContext)} />
    </Store>
  );
};
