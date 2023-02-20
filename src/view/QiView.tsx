import React from "react";
import { RichText } from "../core/RichText";
import { Bubble } from "./Bubble";

// This view is the equivalent of a single window in the app and design
export const QiView = (props: { qi: Qi }) => {
  let qi: QiT =
    typeof props.qi === "string" ? (QiOpsCorrect.createQi() as QiT) : props.qi;

  const lens = qi.view

  return (
    <div>
      {() => {
        switch (lens) {
          case "Bubble": {
            return <Bubble q={qi} />;
          }
          case "Tabbed": {
            return <></>;
          }
          default: {
            return <></>;
          }
        }
      }}
    </div>
  );
};