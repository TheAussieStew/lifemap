import React, { useState } from 'react'
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer, wrappingInputRule } from '@tiptap/react'
import { Node } from '@tiptap/react'
import { borderRadius } from '../Theme'
import ThreeDText from './ThreeDText'

const threeDTextInputRegex = /333/

export const ThreeDTextExtension = Node.create({
    name: 'threeDText',
    group: 'block',
    content: 'block*',
    atom: true,
    addAttributes() {
        return {
            text: {
                default: 'Default text',
            },
        }
    },
    parseHTML() {
        return [
            {
                tag: 'threeDText',
                getAttrs: (element: HTMLElement | string) => {
                    return {
                        text: (element as HTMLElement).getAttribute('text'),
                    }
                },
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return ['threeDText', HTMLAttributes]
    },
    addInputRules() {
        return [
            wrappingInputRule({
                find: threeDTextInputRegex,
                type: this.type,
            }),
        ]
    },
    addNodeView() {
        return ReactNodeViewRenderer((props: NodeViewProps) => {
            const [text, setText] = useState(props.node.attrs.text)

            const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                setText(event.target.value)
                props.updateAttributes({ text: event.target.value })
            }

            return (
                <NodeViewWrapper>
                    <input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        style={{
                            border: '1.5px solid #34343430',
                            borderRadius: 5,
                            outline: 'none',
                            backgroundColor: 'transparent',
                            width: '80px',
                            position: 'absolute',
                        }}
                    />
                    <ThreeDText text={props.node.attrs.text} />
                </NodeViewWrapper>
            )
        })
    },
})