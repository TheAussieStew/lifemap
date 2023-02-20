import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";
import RichText from "../../core/RichText";
import { generateUniqueID } from "../../utils/utils";

export const tildeInputRegex = /~>$/

export const CalculationExtension = Node.create({
  name: "calculationExtension",
  // Can only contain a math and portal
  // TODO: See if I can make this constraint more rigid
  content: "(math | portal)+",
  // TODO: Clarify whether this is allowed
  group: "(block & structure)",
  inline: false,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "calculation-extension",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["calculation-extension", mergeAttributes(HTMLAttributes)];
  },
  draggable: true,
  addAttributes() {
    return {
      guid: {
        default: 0,
      },
    }
  },
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
          <Calculation/>
        </NodeViewWrapper>
      );
    });
  },
});