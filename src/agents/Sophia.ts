import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { Extension } from '@tiptap/core';

export const SophiaAI = Extension.create({
    name: 'myPlugin',
    addProseMirrorPlugins() {
        return [SophiaAIPlugin];
    },
});

const SophiaAIPlugin = new Plugin({
    key: new PluginKey('myPlugin'),
    view: () => ({
        update: (view) => {
            const { state } = view;
            const tr = state.tr;

            // Find all message nodes with a mention tag with the label "needs-reply"
            state.doc.descendants((node, pos) => {
                if (node.type.name === 'message') {
                    let needsReplyMention = false;
                    node.forEach(child => {
                        if (child.type.name === 'mention' && child.attrs.label === 'needs reply') {
                            needsReplyMention = true;
                        }
                    });

                    if (needsReplyMention) {
                        console.log("detected certain mention")
                        // Insert a new message node after the current message node
                        tr.insert(pos + node.nodeSize, state.schema.nodes.message.create())
                    }
                }
            });

            if (tr.docChanged) {
                view.dispatch(tr);
            }
        },
    }),
});
