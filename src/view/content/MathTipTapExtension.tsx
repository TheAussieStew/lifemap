import React from "react";
import { Node, mergeAttributes, InputRule, wrappingInputRule, markInputRule, Mark } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule, NodeViewContent } from "@tiptap/react";
import { DOMAttributes } from "react";
import { MathfieldElementAttributes } from 'mathlive'
import { Math } from './Math';
import { MathsLoupeC } from "../../core/Model";

export const regexMathsDollars: RegExp = /\$([^\$]*)\$/gi;
export const inlineRegexMathsDollars: RegExp = /\$(.+)\$/; //new RegExp("\$(.+)\$", "i");
export const REGEX_BLOCK_MATH_DOLLARS:RegExp = /\$\$\s+$/; //new RegExp("\$\$\s+$", "i");


export const blockInputRegex = /^\s*~\s$/

export const MathExtension = Mark.create({
  name: "math",
  group: "(block | inline)",
  content: "text*",
  code: true,
  inline: true,
  selectable: false,
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
        find: inlineRegexMathsDollars,
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
          <math-field>
            <NodeViewContent />
          </math-field>
        </NodeViewWrapper>
      );
    });
  },
});

// (props.matchedContent) => return (<math-live>props.matchedContent<math-live>)