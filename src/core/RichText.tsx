import React from 'react'
import { useEditor, EditorContent, Content, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { GroupExtension } from "../view/GroupExtension";
import { action, comparer } from 'mobx'
import { motion } from 'framer-motion'
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

// This component will first load in the default text
// Then will load in the text referred to by the qiID
export const RichText = (props: {
  defaultContent: string | Content;
  quantaId?: string;
  editable?: boolean;
}) => {
  // First, load content
  let content: Content = "Empty";
  if (props.quantaId) {
    console.log("quantaId", props.quantaId);
    // TODO: Maybe use a converter, but Content has possible type null which DocumentData can't be
    const docRef = doc(db, "contents", props.quantaId);
    getDoc(docRef).then((doc) => {
      // If Firestore reference exists, then set the document as the content
      if (doc.exists()) {
        content = doc.data() as Content;
        if (editor && !comparer.structural(editor.getJSON(), content)) {
          editor.commands.setContent(content);
        }
      } else {
        // Otherwise, create a new doc
        const content = {
          type: "doc",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ type: "text", text: "Empty text" }],
            },
          ],
        };
        setDoc(docRef, content, { merge: true });
      }
      // Then change editor content
      // if (content && editor) editor.commands.setContent(content)
    });
  } else if (typeof props.defaultContent === "string") {
    content = props.defaultContent
  } else {
    content = props.defaultContent;
  }

  // Then, initialise editor
  let editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      if (props.quantaId) {
        const contentJSON = editor.getJSON();
        const docRef = doc(db, "contents", props.quantaId);
        if (contentJSON) {
          setDoc(docRef, editor.getJSON(), { merge: true });
        }
        console.log("Saved JSON to Firestore");
      }
    },
    editable: props.editable ? true : false,
  });

  return (
    <>
      {props.editable && <MenuBar editor={editor} />}
      {!props.editable && typeof props.defaultContent === "string" ? (
        <div
          style={{
            fontFamily: "Josefin Sans",
          }}
        >
          {props.defaultContent}
        </div>
      ) : (
        <div style={{ marginTop: -18, marginBottom: -15 }}>
          {editor && <EditorContent editor={editor} />}
        </div>
      )}
    </>
  );
};

const ExampleRichText = () => {
  const content = "To be or not to be is the question"
  return <RichText defaultContent={content} editable={true} />;
};

