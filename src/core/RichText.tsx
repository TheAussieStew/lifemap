import React from 'react'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { GroupExtension } from '../view/structure/GroupTipTapExtension'
import { MathExtension } from '../view/content/MathTipTapExtension'
import './styles.scss'
import { SectionLens } from './Model'

lowlight.registerLanguage('js', js)

export const RichText = (props: { text: string | Y.Doc, lenses: [SectionLens] }) => {
  let content = props.text
  switch (props.lenses[0]) {
    case "code":
      content = `<pre><code class="language-javascript">${props.text}</pre></code>`

      break;
    case "text":
      // Do nothing

      break;
    default:
      break;
  }

  const editor = useEditor({
    extensions: [
      // Add official extensions
      // @ts-ignore
      StarterKit.configure({
        history: false
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      // Collaboration.configure({
      //   document: props.text,
      // }),
      // Add our custom extensions below
      GroupExtension,
      MathExtension,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    content: content,
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

export const RichTextCodeExample = () => {
  const content = `
  <p>
    That’s a boring paragraph followed by a fenced code block:
  </p>
  <pre><code class="language-javascript">for (var i=1; i <= 20; i++)
  {
    if (i % 15 == 0)
      console.log("FizzBuzz");
    else if (i % 3 == 0)
      console.log("Fizz");
    else if (i % 5 == 0)
      console.log("Buzz");
    else
      console.log(i);
  }</code></pre>
`
  return (<RichText text={content} lenses={["code"]} />)
}

export default RichText
