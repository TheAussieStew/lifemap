import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'

export const Tiptap: React.FC<{content: string}> = ({content}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    onUpdate({editor}) {
      const json = editor.getJSON()
      // console.log("sd", json)
      // console.log("sd", json.content[0].content[0].text)
      // send the content to an API here
    }
  })

  return (
    <EditorContent editor={editor} />
  )
}