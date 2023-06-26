import { Node, NodeViewRendererProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Paragraph } from '@tiptap/extension-paragraph'
import React from 'react'

export const FadeInParagraph = Paragraph.extend({
  addNodeView() {
    return ReactNodeViewRenderer(FadeInParagraphView)
  },
})

const FadeInParagraphView: React.FC<NodeViewRendererProps> = ({ node }) => {
  const chars = node.textContent.split('')
  console.log("rendered")

  return (
    <NodeViewWrapper>
      <p>
        {chars.map((char, index) => (
          <span
            key={index}
            style={{
              animation: `fadeIn 0.6s linear ${0.1}s forwards`,
            }}
          >
            {char}
          </span>
        ))}
      </p>
    </NodeViewWrapper>
  )
}