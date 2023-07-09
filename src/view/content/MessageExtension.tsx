import { Node, mergeAttributes, nodeInputRule, wrappingInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Message, parseMessage } from './Message';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import React from 'react';

export const MessageExtension = Node.create({
    name: 'message',
    group: 'block',
    content: 'block*',
    selectable: true,
    parseHTML() {
        return [
            {
                tag: 'message',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['message', mergeAttributes(HTMLAttributes), 0];
    },
    addInputRules() {
        return [
            // TODO: make the Regex rule, "" which automatically converts to a single chat message
            // Whoever, creates the message will automatically add a avatar assigning the message to them
            wrappingInputRule({
                find: /''([^'']*)''/,
                type: this.type,
                getAttributes: (match) => {
                    console.log(match)
                    return {
                        textContent: match[1]
                    };
                }
            }),
        ];
    },
    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const { selection } = editor.state;
                const messageNode = selection.$from.node(1);
                console.log("mn", messageNode)

                if (messageNode && messageNode.type.name === 'message') {
                    // Insert a new mention node at the end of the message node
                    const endPosition = selection.$from.end(2);
                    editor.commands.insertContentAt(endPosition, {
                        type: 'mention',
                        attrs: {
                            id: 'mention-id',
                            label: 'needs reply'
                        }
                    });

                    // Move the cursor to the position after the message node
                    // TODO: This is kinda hacky, see if I can get after the message node without using magic variables like newPos + 2
                    const newPosition = selection.$from.after(2);
                    editor.commands.setTextSelection(newPosition + 2);
                    return true;
                   }


                return false;
            }
        }
    },
    addProseMirrorPlugins() {
        return [messageCursorPlugin];
    },
    addNodeView() {
        return ReactNodeViewRenderer((props: NodeViewProps) => {
            return <NodeViewWrapper>
                <Message>
                    <NodeViewContent/>
                </Message>
            </NodeViewWrapper>
        });
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