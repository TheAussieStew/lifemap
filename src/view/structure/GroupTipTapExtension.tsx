import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";
import RichText from "../content/RichText";
import { generateUniqueID } from "../../utils/utils";
import { Qi } from "../../core/Qi";

export const tildeInputRegex = /~>$/
export const groupInputRegex = /^\s*(\( \))\s$/

export const GroupExtension = Node.create({
  name: "group",
  group: "block",
  inline: false,
  selectable: true,
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
        find: groupInputRegex,
        type: this.type,
        getAttributes: ({ groups }) => groups,
      }),
    ]
  },
  addNodeView() {
    // TODO: props should be typed
    return ReactNodeViewRenderer((props: any) => {
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