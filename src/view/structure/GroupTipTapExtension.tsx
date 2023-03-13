import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";
import RichText from "../content/RichText";
import { generateUniqueID } from "../../utils/utils";

export const tildeInputRegex = /~>$/

export const GroupExtension = Node.create({
  name: "groupExtension",
  group: "(block & structure)",
  inline: false,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "group-extension",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["group-extension", mergeAttributes(HTMLAttributes)];
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
          <Group lens={"verticalArray"}>
            {/* <RichText roomName={"000000"} /> */}
          </Group>
        </NodeViewWrapper>
      );
    });
  },
});