import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { GroupExtension } from '../view/structure/GroupTipTapExtension'
import { MathExtension } from '../view/content/MathTipTapExtension'

const RichText = (props: { text: string | Y.Doc }) => {

  const editor = useEditor({
    extensions: [
      // @ts-ignore
      StarterKit.configure({
        history: false
      }),
      // Collaboration.configure({
      //   document: props.text,
      // }),
      GroupExtension,
      MathExtension
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    content: "lel",
    onUpdate: ({ editor }) => {
      console.debug("JSON Output", editor.getJSON())
      console.debug("HTML Output", editor.getHTML())
    },
  })

  if (process.env.NODE_ENV === 'development') {
    if (editor) {
      // console.debug(editor.schema)
    }
  }

  return (
    <EditorContent editor={editor} />
  )
}

export default RichText