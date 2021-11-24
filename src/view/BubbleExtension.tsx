import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, textblockTypeInputRule } from "@tiptap/react";
import React from "react";
import { QiCorrect } from "../core/LifeGraphModel";
import { AlphaBubble } from "./Bubble";

export const backtickInputRegex = /^```(?<language>[a-z]*)?[\s\n]$/

export const BubbleExtension = Node.create({
  name: "bubbleExtension",

  group: "block",


  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "bubble-extension",
      },
    ];
  },
  draggable: true,

  renderHTML({ HTMLAttributes }) {
    return ["bubble-extension", mergeAttributes(HTMLAttributes)];
  },
  addInputRules() {
    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer((props: any) => {
      return (
        <NodeViewWrapper style={{ borderWidth: 2 }}>
          <AlphaBubble q={QiCorrect.createQi()} hideDetail={true}/>
        </NodeViewWrapper>
      );
    });
  },
});
