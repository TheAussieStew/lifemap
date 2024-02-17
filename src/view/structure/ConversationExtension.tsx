import React from "react";
import { Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Group } from "./Group";

export const ellipsisQuote = /^'\.\.\.'$/

export const ConversationExtension = Node.create({
  name: "conversation",
  group: "block",
  // TODO: Technically this should only accept message nodes, but when I change it to message nodes a schema error occurs
  content: "block*",
  // TODO: Doesn't handle inline groups
  inline: false,
  selectable: true,
  draggable: true,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "conversation",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["conversation", HTMLAttributes, 0];
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: ellipsisQuote,
        type: this.type,
      }),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer((props: NodeViewProps) => {
      return (
        <NodeViewWrapper>
          <Group lens={"verticalArray"} quantaId={props.node.attrs.qid}>
            <div style={{ fontFamily: "EB Garamond", fontSize: 30 }}>
              Group Chat
              <br/> 
              <br/> 
            </div>
            <NodeViewContent/>
          </Group>
        </NodeViewWrapper>
      );
    });
  },
});