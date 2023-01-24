import { motion } from "framer-motion";
import { action, isObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import React from "react";
import {
  QiT,
  ShenT,
  QiCorrect,
  RichText,
} from "../core/LifeGraphModel";
import { ShenContext, Store } from "../core/Store";
import { Tiptap } from "../core/Tiptap";
import { PortalFree } from "./Portal";

export const Group = observer(
  (props: { q: QiT | ShenT; hideDetail?: boolean }) => {
    let shen = React.useContext(ShenContext);
    let tick = useLocalObservable(() => ({
      tick: true,
    }));

    return (
      <motion.div layout style={{
        display: "inline-block"
      }}>
          <PortalFree
            id={props.q.id.toString()}
            hideDetail={props.hideDetail}
            update={action(() => {
              tick.tick ? (tick.tick = false) : (tick.tick = true);
              console.log("updating");
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
                  style={{ margin: `0 0 0 0` }}
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
            </motion.div>
          </PortalFree>
      </motion.div>
    );
  }
);

export const AlphaBubbleExample = () => {
  return (
    <Store>
      <Group q={React.useContext(ShenContext)} />
    </Store>
  );
};

