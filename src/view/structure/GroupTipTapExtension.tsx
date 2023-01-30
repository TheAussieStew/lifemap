import React from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";
import Editor from "../../core/Editor";

export const tildeInputRegex = /~>$/

export const GroupExtension = Node.create({
  name: "groupExtension",
  group: "inline",
  inline: true,
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
          <Group>
            <Editor/>
          </Group>
        </NodeViewWrapper>
      );
    });
  },
});