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
  content: "text*",
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
      nodeInputRule({
        find: REGEX_INLINE_MATH_DOLLARS,
        type: this.type,
      }),
      nodeInputRule({
        find: REGEX_BLOCK_MATH_DOLLARS,
        type: this.type,
      }),
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
          <>
            <div
              style={{ display: "flex", gap: 5, height: "fit-content" }}>
              <Tag>
                Math
              </Tag>
              <FlowSwitch isLens>
                <motion.div onClick={() => props.updateAttributes({ lensDisplay: 'natural' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    Natural
                  </span>
                </motion.div>
                <motion.div onClick={() => props.updateAttributes({ lensDisplay: 'latex' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    Latex
                  </span>
                </motion.div>
                <motion.div onClick={() => props.updateAttributes({ lensDisplay: 'linear' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    Linear
                  </span>
                </motion.div>
                <motion.div onClick={() => props.updateAttributes({ lensDisplay: 'mathjson' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    MathJSON
                  </span>
                </motion.div>
              </FlowSwitch>
              <FlowSwitch isLens>
                <motion.div onClick={() => props.updateAttributes({ lensEvaluation: 'identity' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    Identity
                  </span>
                </motion.div>
                <motion.div onClick={() => props.updateAttributes({ lensEvaluation: 'simplify' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    Simplify
                  </span>
                </motion.div>
                <motion.div onClick={() => props.updateAttributes({ lensEvaluation: 'evaluate' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    Evaluate
                  </span>
                </motion.div>
                <motion.div onClick={() => props.updateAttributes({ lensEvaluation: 'numeric' })}>
                  <span style={{ fontFamily: 'Inter' }}>
                    Numeric
                  </span>
                </motion.div>
              </FlowSwitch>
            </div>
            <Math equationString={props.node.textContent} loupe={getMathsLoupeFromAttributes(props.node.attrs)} onChange={function (change: string | JSONContent): void {
              throw new Error("Function not implemented.");
            }} >

              <NodeViewContent/>
            </Math>
          </>
        </NodeViewWrapper>
      );
    });
  },
});

// (props.matchedContent) => return (<math-live>props.matchedContent<math-live>)