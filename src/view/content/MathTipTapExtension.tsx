import React from "react";
import { Node, mergeAttributes, JSONContent } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, nodeInputRule } from "@tiptap/react";
import { Math } from "./Math";
import { Qi } from "../../core/Qi";

export const tildeInputRegex = /->$/

export const MathExtension = Node.create({
  name: "math",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "math",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["math", mergeAttributes(HTMLAttributes)];
  },
  draggable: true,
  addInputRules() {
    return [
      nodeInputRule({
        find: tildeInputRegex,
        type: this.type,
        getAttributes: ({ groups }) => groups,
      }),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer((props: any) => {
      return (
        <NodeViewWrapper>
            <Qi qiId={props.node.attrs.qiId} userId={""} />
          <Math equationString={"Enter your equation here"} lenses={["natural", "numeric"]} onChange={function (change: string | JSONContent): void {
            //
          } }/>
        </NodeViewWrapper>
      );
    });
  },
});