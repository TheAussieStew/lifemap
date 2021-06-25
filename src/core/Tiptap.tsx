import React from 'react'
import { useEditor, EditorContent, Content } from '@tiptap/react'
import lowlight from 'lowlight'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'


const CustomStarterKit = StarterKit.extend({
  addKeyboardShortcuts() {
    return {
      // ↓ your new keyboard shortcut
      "Shift-Enter": () => this.editor.commands.toggleBulletList(),
      "Mod-a": () => {
        console.log("pressed");
        return true;
      },
    };
  },
});

export const Tiptap = (props: {content: Content, modShen?: (text: string) => void}) => {
  const editor = useEditor({
    extensions: [
      CodeBlockLowlight.configure({
        lowlight,
      }),
      CustomStarterKit,
    ],
    content: props.content,
    onUpdate: ({editor}) => {
      const json = editor.getJSON()
      console.log("sd", json)
      console.log("sd", json.content[0].content[0].text)
      const text = json.content[0].content[0].text;
      if (props.modShen) props.modShen(text)
      // send the content to an API here
    }
  })

  return (
    <EditorContent editor={editor} />
  )
}