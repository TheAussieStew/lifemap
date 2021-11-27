import React from 'react'
import { useEditor, EditorContent, Content } from '@tiptap/react'
import lowlight from 'lowlight'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { BubbleExtension } from "../view/BubbleExtension";
import { action } from 'mobx'

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
      CustomStarterKit,
      BubbleExtension,
    ],
    content: props.content,
    onUpdate: action(({editor}) => {
      // send the content to an API here
      const json = editor.getJSON()
      if (json) {
      console.log("changed, json:", json)
      // const text = json.content[0].content[0].text;
      // if (props.modShen) props.modShen(text)
      }
    })
  })

  return (
    <EditorContent editor={editor} />
  )
}