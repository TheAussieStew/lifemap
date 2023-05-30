import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";
import RichText from "../content/RichText";
import { generateUniqueID } from "../../utils/utils";
import { Calculation } from "./Calculation";
import { MathsLoupeC } from "../../core/Model";

export const tildeInputRegex = /~>$/

export const CalculationExtension = Node.create({
  name: "calculation",
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
        tag: "calculation",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["calculation", mergeAttributes(HTMLAttributes)];
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
          <Calculation equationString={""} loupe={new MathsLoupeC()}/>
        </NodeViewWrapper>
      );
    });
  },
});