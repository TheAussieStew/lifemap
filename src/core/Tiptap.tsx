import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

const Tiptap: React.FC<{content: string}> = ({content}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
  })

  return (
    <EditorContent editor={editor} />
  )
}

export default Tiptap