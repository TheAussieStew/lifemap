import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

const ydoc = new Y.Doc()

// Store the Y document in the browser
new IndexeddbPersistence('example-document', ydoc)

const Editor = () => {
  const editor = useEditor({
    extensions: [
      // @ts-ignore
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
    ],
  })

  return (
    <EditorContent editor={editor} />
  )
}

export default Editor