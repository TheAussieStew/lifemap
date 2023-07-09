import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Message, parseMessage } from './Message';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
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
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'message' }), 0];
    },
    addNodeView() {
        return ReactNodeViewRenderer((props: NodeViewProps) => {
            return <NodeViewWrapper>
                <Message>
                    {props.node.textContent}
                </Message>
            </NodeViewWrapper>
        });
    },
    addInputRules() {
        return [
            // TODO: make the Regex rule, "" which automatically converts to a single chat message
            // Whoever, creates the message will automatically add a avatar assigning the message to them
            nodeInputRule({
                find: /""/g, 
                type: this.type,
            }),
        ];
    },
    addProseMirrorPlugins() {
        return [messageCursorPlugin];
    },
});


const messageCursorPlugin = new Plugin({
    key: new PluginKey('messageCursor'),
    view: () => ({
        update: (view) => {
            const { state } = view;
            const { selection } = state;
            const messageNode = state.doc.nodeAt(selection.from);

            if (messageNode && messageNode.type.name === 'message') {
                // Set the cursor position to the end of the message node
                const endPosition = selection.from + messageNode.nodeSize - 1;
                view.dispatch(
                    state.tr.setSelection(
                        TextSelection.create(state.doc, endPosition)
                    )
                );
            }
        },
    }),
});