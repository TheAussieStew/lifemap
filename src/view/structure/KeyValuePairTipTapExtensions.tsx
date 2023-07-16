import React from "react";
import { Node, NodeViewProps, wrappingInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { motion } from "framer-motion";
import { purple } from "../Theme";
import { Tag } from "../content/Tag";

export const doubleSingleQuoteInputRegex = /''([^'']*)''/

export const KeyValuePairExtension = Node.create({
  name: "keyValuePair",
  group: "block",
  content: "block*",
  // TODO: Doesn't handle inline groups
  inline: false,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "keyValuePair",
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      'keyValuePair',
      {
        ...HTMLAttributes,
      },
      0
    ];
  },
  draggable: true,
  addAttributes() {
    return {
      key: {
        default: 'defaultKey',
      },
      value: {
        default: 'defaultValue',
      },
    }
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: /(\w+):"([^"]+)"/g,
        type: this.type,
        getAttributes: (match) => {
          const [fullMatch, key, value] = match;
          console.log("fullMatch", fullMatch)
          console.log("key", key)
          console.log("value", value)
          return {
            key: key,
            value: value
          }
        },
      }),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer((props: NodeViewProps) => {
      return (
        <NodeViewWrapper>
          <motion.div style={{
            backgroundColor: purple, borderRadius: 5, padding: `20px 20px 20px 20px`, color: "#FFFFFF"
          }}>
            <Tag>
              {props.node.attrs.key}
              <Tag>
                {props.node.attrs.value}
              </Tag>
            </Tag>
            <NodeViewContent />
          </motion.div>
        </NodeViewWrapper>
      );
    });
  },
});