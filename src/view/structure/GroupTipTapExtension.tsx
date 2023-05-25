import React from "react";
import { Node, wrappingInputRule } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";
import { Qi } from "../../core/Qi";

export const tildeInputRegex = /~>$/
// TODO: Match for brackets with text in between
export const groupInputRegex = /^\s*(\( \))\s$/

export const GroupExtension = Node.create({
  name: "group",
  group: "block",
  content: "block*",
  inline: false,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "group",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["group", HTMLAttributes];
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
    // TODO: props should be typed
    return ReactNodeViewRenderer((props: any) => {
            console.log("qiId", props.node.attrs.qiId)
      return (
        <NodeViewWrapper>
          <Group lens={"verticalArray"}>
            <Qi qiId={props.node.attrs.qiId} userId={""} />
          </Group>
        </NodeViewWrapper>
      );
    });
  },
});