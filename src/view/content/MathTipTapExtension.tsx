import React from "react";
import { Node, mergeAttributes, InputRule, wrappingInputRule, markInputRule, Mark, JSONContent, nodeInputRule } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Math } from "../content/Math"
import { MathsLoupeC } from "../../core/Model";
import { NodeViewProps } from '@tiptap/core'
import { getMathsLoupeFromAttributes } from "../../utils/utils";
import { Tag } from "./Tag";
import { FlowSwitch } from "../structure/FlowSwitch";
import { motion } from "framer-motion";

const REGEX_BLOCK_MATH_DOLLARS: RegExp = /\$\$\s+$/; //new RegExp("\$\$\s+$", "i");
const REGEX_INLINE_MATH_DOLLARS: RegExp = /\$(.+)\$/; //new RegExp("\$(.+)\$", "i");

export const MathExtension = Node.create({
  name: "math",
  group: "inline",
  inline: true,
  content: "block*",
  code: true,
  selectable: true,
  atom: true,
  draggable: true,
  parseHTML() {
    return [
      {
        tag: "math",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["math", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addAttributes() {
    // Return an object with attribute configuration
    return {
      lensDisplay: {
        default: 'natural'
      },
      lensEvaluation: {
        default: 'evaluate'
      }
    }
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: REGEX_INLINE_MATH_DOLLARS,
        type: this.type,
      }),
      // wrappingInputRule({
      //   find: REGEX_BLOCK_MATH_DOLLARS,
      //   type: this.type,
      // }),
    ];
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer((props: NodeViewProps) => {
      return (
        <NodeViewWrapper>
            <Math equationString={props.node.textContent} loupe={getMathsLoupeFromAttributes(props.node.attrs)} onChange={function (change: string | JSONContent): void {
              throw new Error("Function not implemented.");
            }} >
              {console.log("nvc", <NodeViewContent/>)}

              <NodeViewContent/>
            </Math>
        </NodeViewWrapper>
      );
    });
  },
});

// (props.matchedContent) => return (<math-live>props.matchedContent<math-live>)