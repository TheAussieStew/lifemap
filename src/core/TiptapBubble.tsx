// This is an extension
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import React from 'react'
import { AlphaBubble } from '../view/Bubble';
import { ExampleShen, QiCorrect } from './LifeGraphModel';

export const BubbleExtension = Node.create({
  name: "bubbleExtension",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      {
        tag: "bubble-extension",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["bubble-extension", mergeAttributes(HTMLAttributes), 0];
  },
  addNodeView() {
    return ReactNodeViewRenderer(
      <NodeViewWrapper>
        <AlphaBubble q={ExampleShen()}/>
      </NodeViewWrapper>
    );
  },
});