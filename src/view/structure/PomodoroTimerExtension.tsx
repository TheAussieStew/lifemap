import React, { useState } from 'react'
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer, wrappingInputRule } from '@tiptap/react'
import { Node } from '@tiptap/react'
import { PomodoroTimer } from './PomodoroTimer';

const timePassageInputRegex = /^-->$/;

// Same as Pomodoro type but uses strings instead of Dates
export type AttrPomodoro = {
    start: string,
    startStatus: "realised" | "unrealised"
    end: string,
    endStatus: "realised" | "unrealised",
    completionType: "natural" | "manual" | "incomplete";
}

// Used in addAttributes
const mockAttrPomodoros: AttrPomodoro[] = [
    {
        start: "2024-02-15T05:50:51.000Z",
        startStatus: "realised",
        end: "2024-02-15T06:15:51.000Z",
        endStatus: "realised",
        completionType: "natural"
    },
    {
        start: "2024-02-14T05:50:51.000Z",
        startStatus: "unrealised",
        end: "2024-02-14T06:15:51.000Z",
        endStatus: "unrealised",
        completionType: "incomplete"
    },
    {
        start: "2024-02-13T05:50:51.000Z",
        startStatus: "realised",
        end: "2024-02-13T06:15:51.000Z",
        endStatus: "unrealised",
        completionType: "incomplete"
    },
    {
        start: "2024-02-12T05:50:51.000Z",
        startStatus: "unrealised",
        end: "2024-02-12T06:15:51.000Z",
        endStatus: "realised",
        completionType: "manual"
    },
];

export const PomodoroTimerExtension = Node.create({
    name: 'pomodoroTimer',
    group: 'block',
    content: "block*",
    atom: true,
    addAttributes() {
        return {
            pomodoroDuration: {
                default: "25"
            },
            pomodoroBreakDuration: {
                default: "5"
            },
            pomodoros: {
                default: []
            }
        }
    },
    parseHTML() {
        return [
            {
                tag: 'pomodoroTimer[id]',
                getAttrs: (element: HTMLElement | string) => {
                    return {
                        pomodoroDuration: (element as HTMLElement).getAttribute('pomodoro-duration'),
                        pomodoroBreakDuration: (element as HTMLElement).getAttribute('pomodoro-break-duration'),
                    }
                },
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return ['pomodoroTimer', HTMLAttributes]
    },
    addInputRules() {
        return [
            wrappingInputRule({
                find: timePassageInputRegex,
                type: this.type,
            }),
        ];
    },
    addNodeView() {
        return ReactNodeViewRenderer((props: NodeViewProps) => {

            const handlePomodoroDurationChange = (duration: string) => {
                props.updateAttributes({ pomodoroDuration: duration });
            }

            const handlePomodoroBreakDurationChange = (duration: string) => {
                props.updateAttributes({ pomodoroBreakDuration: duration });
            }

            const updatePomodoros = (pomodoros: AttrPomodoro[]) => {
                props.updateAttributes({ pomodoros: pomodoros });
            }

            const handleDelete = () => {
                const { state, dispatch } = props.editor.view;
                const { tr } = state;
                const pos = props.getPos();

                const resolvedPos = state.doc.resolve(pos)
                const node = resolvedPos.nodeAfter

                if (node && node.type.name === 'pomodoroTimer') {
                    // Delete the PomodoroTimer node
                    const transaction = tr.delete(pos, pos + node.nodeSize)
                    dispatch(transaction)
                }
            }

            return (
                <NodeViewWrapper>
                    <PomodoroTimer 
                        attrsPomodoroDuration={props.node.attrs.pomodoroDuration}
                        attrsPomodoroBreakDuration={props.node.attrs.pomodoroBreakDuration}
                        handlePomodoroDurationChange={handlePomodoroDurationChange}
                        handlePomodoroBreakDurationChange={handlePomodoroBreakDurationChange}
                        updateAttrsPomodoros={updatePomodoros} 
                        attrsPomodoros={props.node.attrs.pomodoros}                    
                        handleDelete={handleDelete}
                    />
                </NodeViewWrapper>
            );
        });
    },
})
