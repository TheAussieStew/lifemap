import React from 'react'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight'
import js from 'highlight.js/lib/languages/javascript'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { EditorContent, Extensions, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { GroupExtension } from '../structure/GroupTipTapExtension'
import { MathExtension } from './MathTipTapExtension'
import './styles.scss'
import { QiC, QiC_2, QiT, SectionLens } from '../../core/Model'
import { IndexeddbPersistence } from 'y-indexeddb'
import { TiptapTransformer } from '@hocuspocus/transformer'

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

  let ydoc = new Y.Doc()
  new IndexeddbPersistence("000000", ydoc)
  let qi = new QiC()
  let qi2 = new QiC_2()
  new IndexeddbPersistence("000000", qi2.information)
  const prosemirrorJSON = TiptapTransformer.fromYdoc(qi2.information)
  console.debug("prosemirrorJSON from within RichText", prosemirrorJSON)

  let extensions: Extensions = [
    // Add official extensions
    // @ts-ignore
    StarterKit.configure({
      history: false
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
    // Add our custom extensions below
    GroupExtension,
    MathExtension,
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
      props.onChange(editor.getJSON())
      // console.debug("JSON Output", editor.getJSON())
      // console.debug("HTML Output", editor.getHTML())
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
