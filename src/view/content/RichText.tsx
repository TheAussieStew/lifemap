import React from 'react'
import { EditorContent, Extensions, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Collaboration from '@tiptap/extension-collaboration'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import js from 'highlight.js/lib/languages/javascript'
import * as Y from 'yjs'
import { QiC, QiT, SectionLens } from '../../core/Model'
import { lowlight } from 'lowlight'
import { GroupExtension } from '../structure/GroupTipTapExtension'
import { MathExtension } from './MathTipTapExtension'
import { Indent } from '../../utils/Indent'
import './styles.scss'
import { IndexeddbPersistence } from 'y-indexeddb'

lowlight.registerLanguage('js', js)

export const RichText = (props: { qi?: QiT, text: string | Y.Doc, lenses: [SectionLens], onChange: (change: string | JSONContent) => void }) => {
  let content = props.text
  switch (props.lenses[0]) {
    case "code":
      // content = `<pre><code class="language-javascript">${props.text}</pre></code>`

      break;
    case "text":
      // Do nothing

      break;
    default:
      break;
  }

  let extensions: Extensions = [
    // Add official extensions
    // @ts-ignore
    StarterKit.configure({
      history: false
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    // Add our custom extensions below
    GroupExtension,
    MathExtension,
    Indent
  ]

  // if (typeof props.text !== "string") {
    extensions.push(
      Collaboration.configure({
        document: props.qi!.information,
      }),
    )
  // }

  const editor = useEditor({
    extensions: extensions,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      // props.onChange(editor.getJSON())
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
  return (<RichText qi={new QiC()} text={content} lenses={["code"]} onChange={() => {
  }} />)
}

export default RichText
