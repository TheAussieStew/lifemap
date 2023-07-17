import React, { useState } from 'react';
import { Node, mergeAttributes, NodeViewProps, wrappingInputRule } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Tag } from "../content/Tag";
import './styles.scss'

interface KeyValuePairAttributes {
  key: string;
  value: string;
}

export const KeyValuePairExtension = Node.create<KeyValuePairAttributes>({
  name: "keyValuePair",
  group: "block",
  content: "block*",
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
  renderHTML({ HTMLAttributes }) {
    return ['keyValuePair', mergeAttributes(HTMLAttributes), 0];
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
      const [key, setKey] = useState(props.node.attrs.key);
      const [value, setValue] = useState(props.node.attrs.value);

      const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKey(event.target.value);
        props.updateAttributes({ key: event.target.value });
      };

      const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        props.updateAttributes({ value: event.target.value });
      };

      return (
        <NodeViewWrapper>
          <Tag>
            <input type="text" value={key} onChange={handleKeyChange} style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', width: `${key.length + 1}ch` }} />
            <Tag>
              <input type="text" value={value} onChange={handleValueChange} style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', width: `${value.length + 1}ch` }} />
            </Tag>
          </Tag>
        </NodeViewWrapper>
      );
    });
  },
});
