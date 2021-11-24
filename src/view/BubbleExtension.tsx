import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React from "react";
import { QiCorrect } from "../core/LifeGraphModel";
import { AlphaBubble, AlphaBubbleExample } from "./Bubble";

export const BubbleExtension = Node.create({
  name: "bubbleExtension",

  group: "block",

  atom: true,

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

  renderHTML({ HTMLAttributes }) {
    return ["bubble-extension", mergeAttributes(HTMLAttributes)];
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
