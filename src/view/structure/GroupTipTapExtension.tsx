import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";
import RichText from "../content/RichText";
import { generateUniqueID } from "../../utils/utils";
import { Qi } from "../../core/Qi";

export const tildeInputRegex = /~>$/
export const groupInputRegex = /^\s*(\(\))\s$/

export const GroupExtension = Node.create({
  name: "groupExtension",
  group: "block",
  inline: false,
  selectable: true,
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
        find: groupInputRegex,
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
            {/* <Qi qiId={"000009"} userId={""} /> */}
          </Group>
        </NodeViewWrapper>
      );
    });
  },
});