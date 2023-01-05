import React from 'react'
import { useEditor, EditorContent, Content, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import { BubbleExtension } from "../view/BubbleExtension";
import { action } from 'mobx'
import { motion } from 'framer-motion'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import './styles.scss'

const MenuBar = (props: { editor: Editor | null }) => {
  const editor = props.editor
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu editor={editor}>
      <motion.div
        layout
        animate={{ scale: 1 }}
        style={{ backgroundColor: "#000000" }}
        transition={{ duration: 1 }}
        initial={{ scale: 0.5 }}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          h3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          h4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          h5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          h6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          hard break
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          redo
        </button>
        {/* <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          centre
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          justify
        </button>
        <button onClick={() => editor.chain().focus().unsetTextAlign().run()}>
          set default
        </button>
        <button
          onClick={() => editor.chain().focus().setFontFamily("Cabin").run()}
          className={
            editor.isActive("textStyle", { fontFamily: "Cabin" })
              ? "is-active"
              : ""
          }
        >
          Cabin Font
        </button>
        <button
          onClick={() =>
            editor.chain().focus().setFontFamily("Josefin Sans").run()
          }
          className={
            editor.isActive("textStyle", { fontFamily: "Josefin Sans" })
              ? "is-active"
              : ""
          }
        >
          Josefin Sans Font
        </button>
        <button
          onClick={() => editor.chain().focus().setFontSize("40px").run()}
          className={
            editor.isActive("textStyle", { fontSize: "40px" })
              ? "is-active"
              : ""
          }
        >
          40 Pt
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#70CFF8").run()}
          className={
            editor.isActive("textStyle", { color: "#70CFF8" })
              ? "is-active"
              : ""
          }
        >
          Blue
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#e53935").run()}
          className={
            editor.isActive("textStyle", { color: "#e53935" })
              ? "is-active"
              : ""
          }
        >
          Red
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#FEFFFF").run()}
          className={
            editor.isActive("textStyle", { color: "#FEFFFF" })
              ? "is-active"
              : ""
          }
        >
          White
        </button> */}
      </motion.div>
    </BubbleMenu>
  );
};

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
  // A new Y document
  const ydoc = new Y.Doc()

  const provider = new HocuspocusProvider({
    url: 'ws://127.0.0.1:1234',
    name: 'example-document',
  })

  const editor = useEditor({
    extensions: [
      CustomStarterKit.configure({
        history: false
      }),
      Collaboration.configure({
        document: provider.document
      }),
      BubbleExtension,
    ],
    content: props.content ? props.content : "",
    onUpdate: action(({editor}) => {
      // send the content to an API here
      const json = editor.getJSON()
      const html = editor.getHTML()
      if (json) {
      console.log("changed, json:", json)
      // const text = json.content[0].content[0].text;
      // if (props.modShen) props.modShen(text)
      }
      if (html) {
      console.log("changed, html:", html)
      // const text = json.content[0].content[0].text;
      // if (props.modShen) props.modShen(text)
      }
    })
  })

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}