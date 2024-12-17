import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { TemporalEstimate } from './TemporalEstimate';

export interface TemporalEstimateOptions {
    HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        temporalEstimate: {
            setTemporalEstimate: (options: { estimatedDuration: number }) => ReturnType,
        }
    }
}

export const TemporalEstimateExtension = Node.create<TemporalEstimateOptions>({
    name: 'temporalEstimate',

    group: 'inline',

    inline: true,

    atom: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    addAttributes() {
        return {
            estimatedDuration: {
                default: 25,
                parseHTML: element => parseInt(element.getAttribute('data-estimated-duration') || '25', 10),
                renderHTML: attributes => ({
                    'data-estimated-duration': attributes.estimatedDuration,
                }),
            },
            timeBlocks: {
                default: [],
                parseHTML: element => JSON.parse(element.getAttribute('data-time-blocks') || '[]'),
                renderHTML: attributes => ({
                    'data-time-blocks': JSON.stringify(attributes.timeBlocks),
                }),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="temporal-estimate"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'temporal-estimate' }), 0]
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: /\[->]/,
                type: this.type,
                getAttributes: () => ({ estimatedDuration: 25 }), // Default to 25 minutes
            }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer((props: NodeViewProps) => {
            const handleEstimatedDurationChange = (duration: number) => {
                props.updateAttributes({ estimatedDuration: duration });
            };

            const handleTimeBlocksChange = (timeBlocks: any[]) => {
                props.updateAttributes({ timeBlocks: timeBlocks });
            };

            const handleDelete = () => {
                const { state, dispatch } = props.editor.view;
                const { tr } = state;
                const pos = props.getPos();

                if (typeof pos === 'number') {
                    const resolvedPos = state.doc.resolve(pos);
                    const node = resolvedPos.nodeAfter;

                    if (node && node.type.name === 'temporalEstimate') {
                        const transaction = tr.delete(pos, pos + node.nodeSize);
                        dispatch(transaction);
                    }
                }
            };

            return (
                <NodeViewWrapper>
                    <TemporalEstimate
                        estimatedDuration={props.node.attrs.estimatedDuration}
                        timeBlocks={props.node.attrs.timeBlocks}
                        // @ts-ignore
                        handleEstimatedDurationChange={handleEstimatedDurationChange}
                        handleTimeBlocksChange={handleTimeBlocksChange}
                        handleDelete={handleDelete}
                    />
                </NodeViewWrapper>
            );
        });
    },
})