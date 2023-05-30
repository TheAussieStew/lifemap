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
        tag: "math-live",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["math-live", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
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
  // Each type should have an extension that is a single react component, the component takes in the loupe and renders
  // So basically
  // MathExtension -> MathView -> n * MathLenses (each of which is its own component)
  // javascript elements or react components, based on child.
  // Need to get the content of the matched selection and pass it into Math too. 
  // Can use NodeView Content for more basic things like code, as opposed to Math
  addNodeView() {
    return ReactNodeViewRenderer((props: any) => {
      return (
        <NodeViewWrapper>
          {/* <Math loupe={new MathsLoupeC()}> */}
            <NodeViewContent />
          {/* </Math> */}
        </NodeViewWrapper>
      );
    });
  },
});

// (props.matchedContent) => return (<math-live>props.matchedContent<math-live>)