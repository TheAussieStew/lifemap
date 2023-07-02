import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Message, parseMessage } from './Message';
import React from 'react';

export const MessageExtension = Node.create({
    name: 'message',
    group: 'block',
    content: 'inline*',
    parseHTML() {
        return [
            {
                tag: 'div[data-type="message"]',
            },
        ];
    },
    addAttributes() {
        // Return an object with attribute configuration
        return {
            initials: {
                default: '??',
            },
            text: {
                default: "Enter text"
            }
        }
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'message' }), 0];
    },
    addNodeView() {
        return ReactNodeViewRenderer((props: NodeViewProps) => {
            const { node } = props;
            const message = node.textContent;

            return <NodeViewWrapper>
                <Message message={message} self={false} />
            </NodeViewWrapper>
        });
    },
    addInputRules() {
        return [
            nodeInputRule({
                find: /^[A-Z]{2}: .+\n$/,
                type: this.type,
                getAttributes: (match) => {
                    console.log('initial match:', match)
                    const [fullMatch, initials, text] = match;
                    // TODO: Why aren't these attributes there
                    return {
                        initials: initials,
                        text: text
                    }
                },
            }),
        ];
    },
});
