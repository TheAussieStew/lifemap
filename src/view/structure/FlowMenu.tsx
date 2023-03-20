import { Editor } from "@tiptap/core"
import { BubbleMenu } from "@tiptap/react"
import React from "react"
import { RichTextCodeExample } from "../content/RichText"

export const FlowMenu = (props: { editor: Editor | null }) => {
    if (props.editor === null) return null;

    return (
        <div>
            {props.editor && <BubbleMenu editor={props.editor} tippyOptions={{ duration: 100 }}>
                <button
                    // @ts-ignore
                    onClick={() => props.editor.chain().focus().setFontFamily('EB Garamond').run()}
                    className={props.editor.isActive('textStyle', { fontFamily: 'EB Garamond' }) ? 'is-active' : ''}
                >
                    EB Garamond
                </button>
                <button
                    // @ts-ignore
                    onClick={() => props.editor.chain().focus().setFontFamily('Manrope').run()}
                    className={props.editor.isActive('textStyle', { fontFamily: 'Manrope' }) ? 'is-active' : ''}
                >
                    Manrope
                </button>
                <button
                    // @ts-ignore
                    onClick={() => props.editor.chain().focus().setFontFamily('Inter').run()}
                    className={props.editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active' : ''}
                >
                    Inter
                </button>
                <button
                    // @ts-ignore
                    onClick={() => props.editor.chain().focus().toggleBold().run()}
                    className={props.editor.isActive('bold') ? 'is-active' : ''}
                >
                    bold
                </button>
                <button
                    // @ts-ignore
                    onClick={() => props.editor.chain().focus().toggleItalic().run()}
                    className={props.editor.isActive('italic') ? 'is-active' : ''}
                >
                    italic
                </button>
                <button
                    // @ts-ignore
                    onClick={() => props.editor.chain().focus().toggleStrike().run()}
                    className={props.editor.isActive('strike') ? 'is-active' : ''}
                >
                    strike
                </button>
            </BubbleMenu>
            }
        </div>
    )
}

export const FlowMenuExample = () => {
    return (
        <RichTextCodeExample />
    )
}