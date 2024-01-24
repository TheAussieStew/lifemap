import React, { useState } from 'react'
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer, wrappingInputRule } from '@tiptap/react'
import { Node } from '@tiptap/react'
import { ThreeDText } from './ThreeDText'

const threeThreesRegex = /333/;

export const ThreeDTextExtension = Node.create({
    name: 'threeDtext',
    group: 'block',
    content: "block*",
    selectable: true,
    atom: true,
    addAttributes() {
        return {
            text: {
                default: "Title 1",
            },
        }
    },
    parseHTML() {
        return [
            {
                tag: 'threeD[id]',
                getAttrs: (element: HTMLElement | string) => {
                    return {
                        src: (element as HTMLElement).getAttribute('src'),
                    }
                },
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return ['threeDtext', HTMLAttributes]
    },
    addInputRules() {
        return [
            wrappingInputRule({
                find: threeThreesRegex,
                type: this.type,
            }),
        ];
    },
    addNodeView() {
        return ReactNodeViewRenderer((props: NodeViewProps) => {
            const [text, setText] = useState(props.node.attrs.text);

            const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                setText(event.target.value);
                props.updateAttributes({ text: event.target.value });
            };

            return (
                <NodeViewWrapper>
                    <input type="text" value={text} onChange={handleTextChange} style={{ border: '1.5px solid #34343430', borderRadius: 5, outline: 'none', backgroundColor: 'transparent', width: `80px`, position: "absolute", zIndex: 10 }} />
                    <ThreeDText text={text} />
                </NodeViewWrapper>
            );
        });
    },
})
