import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import React from "react";
import { QiCorrect } from "../core/LifeGraphModel";
import { Group } from "./Group";

export const tildeInputRegex = /~>$/

export const GroupExtension = Node.create({
  name: "bubbleExtension",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
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
          <Group q={QiCorrect.createQi()} hideDetail={true} />
        </NodeViewWrapper>
      );
    });
  },
});
