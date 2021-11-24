import ColorHash from "color-hash";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { action, isObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import React from "react";
import {
  QiT,
  ShenT,
  ExampleShen,
  RelationToRelation,
  QiCorrect,
  Time,
  RichText,
  GraphCorrect,
} from "../core/LifeGraphModel";
import { ShenContext, Store } from "../core/Store";
import { Tiptap } from "../core/Tiptap";
import { RefinedConnector } from "./components/Connector";
import { PortalFree } from "./Portal";
import { QiZhi, QiZhiWrapper } from "./QiZhi";

export const Bubble = observer(
  (props: { q: QiT | ShenT; hideDetail?: boolean }) => {
    const colour = new ColorHash({ lightness: 0.9 }).hex(props.q.id.toString());
    let shen = React.useContext(ShenContext);
    let tick = useLocalObservable(() => ({
      tick: true,
    }));

    return (
      <PortalFree
        id={props.q.id.toString()}
        hideDetail={props.hideDetail}
        backgroundColor={colour}
        update={action(() => {
          tick.tick ? (tick.tick = false) : (tick.tick = true);
          console.log("updating");
        })}
      >
        <motion.div
          id={props.q.id.toString()}
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
                modShen={action((text: string) => {
                  let currentQ = props.q;
                  // Get the q from the store that matches the q in the props
                  for (const storeQ of shen.relations.keys()) {
                    if (storeQ.id === props.q.id) currentQ = storeQ;
                  }
                  console.log("isob q", isObservable(currentQ));
                  console.log("isob shen", isObservable(shen));
                  QiCorrect.changeQi(currentQ as QiT, {
                    concept: { richText: text, type: "RichText" },
                    type: "Concept",
                  });
                })}
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
              {Array.from(props.q.relations.entries()).map(
                (keyValue, index) => (
                  <motion.div
                    id={keyValue[0].id.toString()}
                    layout
                    key={keyValue[0].id}
                    style={{ display: "flex", gap: 20 }}
                  >
                    <>
                      {keyValue[1].map((rtr: RelationToRelation) => (
                        <>
                          <RefinedConnector
                            elementAId={props.q.id.toString()}
                            elementBId={rtr.id.toString()}
                            tick={tick.tick}
                          />
                          <Bubble q={rtr} hideDetail={true} />
                          <RefinedConnector
                            elementAId={rtr.id.toString()}
                            elementBId={keyValue[0].id.toString()}
                            tick={tick.tick}
                          />
                        </>
                      ))}
                    </>
                    <Bubble q={keyValue[0]} hideDetail={true} />
                  </motion.div>
                )
              )}
              <motion.div
                layout
                onClick={(e: any) => {
                  e.stopPropagation();
                  if (props.q.type === "Shen") {
                    GraphCorrect.createRelation(props.q);
                  } else {
                    QiCorrect.createRelation(props.q);
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
                  (relation: QiT, index) => (
                    <div key={index}>
                      {(props.q as QiT).causalRelations.get(relation) + " "}
                      {relation.type === "Qi" ? (
                        <Bubble q={relation} hideDetail={true} />
                      ) : (
                        // relation.time.toString().substring(0, 18) + "..."
                        <></>
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
  }
);

export const BubbleExample = () => {
  return (
    <Store>
      <Bubble q={React.useContext(ShenContext)} />
    </Store>
  );
};

// Make it so that in relations wrap, and out relations are contained
// While causal relations are left and right, next to, spatially
export const AlphaBubble = observer(
  (props: { q: QiT | ShenT; hideDetail?: boolean }) => {
    const colour = new ColorHash({ lightness: 0.9 }).hex(props.q.id.toString());
    let shen = React.useContext(ShenContext);
    let tick = useLocalObservable(() => ({
      tick: true,
    }));

    const updateXarrow = useXarrow()

    let connections: any[] = []

    return (
      <div style={{
        display: "inline-block"
      }}>
        {connections}
        {/* {props.q.type === "Qi" && (
          <motion.div layout id="causalRelations">
            <motion.div layout style={{ display: "grid" }}>
              {Array.from(props.q.causalRelations.keys()).map(
                (relation: QiT, index) => (
                  <div key={index}>
                    {relation.type === "Qi" ? (
                      <AlphaBubble q={relation} hideDetail={true} />
                    ) : (
                      relation.time.toString().substring(0, 10) + "..."
                    )}
                    {"-"}
                    {(props.q as QiT).causalRelations.get(relation) + " "}
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        )} */}
        <QiZhiWrapper energy={props.q.energy}>
          <PortalFree
            id={props.q.id.toString()}
            hideDetail={props.hideDetail}
            backgroundColor={colour}
            update={action(() => {
              tick.tick ? (tick.tick = false) : (tick.tick = true);
              console.log("updating");
              updateXarrow()
            })}
          >
            <motion.div
              id={props.q.id.toString()}
              layout
              style={{
                display: "grid",
                placeItems: "center",
              }}
            >
              <motion.div
                layout
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <motion.div
                  layout
                  onClick={(e: any) => {
                    e.stopPropagation();
                  }}
                  style={{ margin: `-16px 0 -16px 0` }}
                >
                  <Tiptap
                    modShen={action((text: string) => {
                      let currentQ = props.q;
                      // Get the q from the store that matches the q in the props
                      for (const storeQ of shen.relations.keys()) {
                        if (storeQ.id === props.q.id) currentQ = storeQ;
                      }
                      console.log("isob q", isObservable(currentQ));
                      console.log("isob shen", isObservable(shen));
                      QiCorrect.changeQi(currentQ as QiT, {
                        concept: { richText: text, type: "RichText" },
                        type: "Concept",
                      });
                    })}
                    content={
                      (props.q.information.concept as RichText)
                        .richText as string
                    }
                  />
                </motion.div>
              </motion.div>
              <motion.div
                layout
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {/* <motion.div
                  layout
                  style={{ display: "grid", placeItems: "center" }}
                >
                  {Array.from(props.q.relations.entries()).map(
                    (keyValue, index) => (
                      <motion.div layout style={{ display: "flex", gap: 20 }}>
                        <>
                          {keyValue[1].map((rtr: RelationToRelation) => (
                            <>
                              <AlphaBubble q={rtr} hideDetail={true} />
                                <Xarrow
                                color={"#676767"}
                                  strokeWidth={2}
                                  headSize={4}
                                  start={rtr.id.toString()}
                                  end={keyValue[0].id.toString()} //can be react ref
                                />
                            </>
                          ))}
                        </>
                        <AlphaBubble q={keyValue[0]} hideDetail={true} />
                      </motion.div>
                    )
                  )}
                </motion.div> */}
              </motion.div>
            </motion.div>
          </PortalFree>
        </QiZhiWrapper>
      </div>
    );
  }
);

export const AlphaBubbleExample = () => {
  return (
    <Store>
      <AlphaBubble q={React.useContext(ShenContext)} />
    </Store>
  );
};

