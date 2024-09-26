import { Node, NodeViewWrapper, ReactNodeViewRenderer, wrappingInputRule } from '@tiptap/react';
import { ThreeDGraph } from './ThreeDGraph';

export const threeDGraphInputRegex = /OOO/;

export const ThreeDGraphExtension = Node.create({
  name: 'three-d-graph',
  group: 'block',
  content: 'block',
  inline: false,
  selectable: false,
  draggable: true,
  atom: true,

  parseHTML() {
    return [
      {
        tag: 'three-d-graph',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['three-d-graph', HTMLAttributes, 0];
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: threeDGraphInputRegex,
        type: this.type,
      })
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(() => (
      <NodeViewWrapper>
        <ThreeDGraph />
      </NodeViewWrapper>
    ));
  },
});