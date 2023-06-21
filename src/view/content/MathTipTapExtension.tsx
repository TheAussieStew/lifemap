import React from "react";
import { Node, mergeAttributes, InputRule, wrappingInputRule, markInputRule, Mark } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule, NodeViewContent } from "@tiptap/react";

export const REGEX_BLOCK_MATH_DOLLARS:RegExp = /\$\$\s+$/; //new RegExp("\$\$\s+$", "i");
export const REGEX_INLINE_MATH_DOLLARS:RegExp = /\$(.+)\$/; //new RegExp("\$(.+)\$", "i");


export const MathExtension = Mark.create({
  name: "math",
  group: "(block | inline)",
  content: "text*",
  code: true,
  inline: true,
  selectable: true,
  atom: true,
  draggable: true,
  parseHTML() {
    return [
      {
        tag: "math-field",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["math-field", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addInputRules() {
    return [
      markInputRule({
        find: REGEX_INLINE_MATH_DOLLARS,
        type: this.type,
        getAttributes: ({ groups }) => groups,
      }),
    ]
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer((props: any) => {
      return (
        <NodeViewWrapper>
          {/* TODO: Have a global lens type as a component that wraps content, content will automatically retrieve
          lenses in order to render
          */}
          {/* 
          <Lens>
            <Content loupe={['a','b','c']}>

            </Content>
          </Lens> 
          */}
          <math-field>
            <NodeViewContent />
          </math-field>
        </NodeViewWrapper>
      );
    });
  },
});

// (props.matchedContent) => return (<math-live>props.matchedContent<math-live>)