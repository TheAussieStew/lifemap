import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Math } from "./Math";

export const tildeInputRegex = /->$/

export const MathExtension = Node.create({
  name: "mathExtension",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "math-extension",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["math-extension", mergeAttributes(HTMLAttributes)];
  },
  draggable: true,
  addInputRules() {
    return [
      nodeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: ({ groups }) => groups,
      }),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer((props: any) => {
      return (
        <NodeViewWrapper>
          <Math equation={"1 + 1"}/>
        </NodeViewWrapper>
      );
    });
  },
});