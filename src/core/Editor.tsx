import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { GroupExtension } from '../view/structure/GroupTipTapExtension'
import { generateUniqueID } from '../utils/utils'
import { MathExtension } from '../view/content/MathTipTapExtension'



const Editor = () => {
  const ydoc = new Y.Doc()
  // A unique ID per document
  const yDocumentName = generateUniqueID()
  console.debug(yDocumentName)
  // Store the Y document in the browser
  new IndexeddbPersistence(yDocumentName, ydoc)

  const editor = useEditor({
    extensions: [
      // @ts-ignore
      StarterKit.configure({
        history: false
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      GroupExtension,
      MathExtension
    ],
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

export default Editor