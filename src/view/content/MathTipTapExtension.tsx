import React from "react";
import { Node, mergeAttributes, JSONContent } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Math } from "./Math";

export const tildeInputRegex = /->$/

export const MathExtension = Node.create({
  name: "math",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "math",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["math", mergeAttributes(HTMLAttributes)];
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
          <Math equationString={"1 + 1"} lenses={["natural", "numeric"]} onChange={function (change: string | JSONContent): void {
            //
          } }/>
        </NodeViewWrapper>
      );
    });
  },
});