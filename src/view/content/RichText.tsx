import React from 'react'
import { EditorContent, Extensions, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import Collaboration, { isChangeOrigin } from '@tiptap/extension-collaboration'
import UniqueID from '@tiptap-pro/extension-unique-id'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import js from 'highlight.js/lib/languages/javascript'
import { QiC, QiT, TextSectionLens, RichTextT } from '../../core/Model'
import { lowlight } from 'lowlight'
import { GroupExtension } from '../structure/GroupTipTapExtension'
import { MathExtension } from './MathTipTapExtension'
import { Indent } from '../../utils/Indent'
import TextAlign from '@tiptap/extension-text-align'
import { FlowMenu } from '../structure/FlowMenu'
import './styles.scss'
import { Doc } from 'yjs'
import { observer } from 'mobx-react-lite'
import { QiStoreContext } from '../../backend/QiStore'
import { FontSize } from './FontSizeTipTapExtension'
import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

lowlight.registerLanguage('js', js)

export const CustomisedEditor = (information: RichTextT) => {
  let qi = React.useContext(QiStoreContext)

  const isYDoc = typeof information !== "string";
  const customExtensions: Extensions = [
    // Add official extensions
    // @ts-ignore
    StarterKit.configure({
      // Here undefined is the equivalent of true
      // TODO: Problem, it looks like when setting this to false
      // collaboration history doesn't take over...
      // history: isYDoc ? false : undefined
      history: false,
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Heading.configure({
      levels: [1, 2, 3, 4],
    }),
    TextStyle,
    Underline,
    FontSize,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    FontFamily.configure({
      types: ['textStyle'],
    }),
    UniqueID.configure({
      types: ['group', 'paragraph'],
      filterTransaction: transaction => !isChangeOrigin(transaction),
      attributeName: 'qiId',
    }),
    // Add our custom extensions below
    GroupExtension,
    MathExtension,
    Indent
  ]

  if (isYDoc) {
    customExtensions.push(
      Collaboration.configure({
        document: qi.information,
        field: 'default',
      }),
    )
  }

  return useEditor({
    extensions: customExtensions,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    content: isYDoc ? null : information,
    onUpdate: ({ editor }) => {
      console.log("JSON Output", editor.getJSON())
      console.log("HTML Output", editor.getHTML())
      console.log("editor getText", editor.getText())
    }
  })
}

export const RichText = observer((props: { qi?: QiT, text: RichTextT, lenses: [TextSectionLens], onChange: (change: string | JSONContent) => void }) => {

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

  let editor = CustomisedEditor(props.text)

  if (process.env.NODE_ENV === 'development') {
    if (editor) {
      // console.debug(editor.schema)
    }
  }

  return (
    <>
      <FlowMenu editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
})

export const RichTextCodeExample = () => {
  const content = `
  <p>
    That’s a boring paragraph followed by a fenced code block:
  </p>
  <p>
    Some more text is right here
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
  <math>
   1 + 1 = 2
  </math>
  <math-live>
   1 + 1 = 2
  </math-live>
`
  return (<RichText qi={new QiC()} text={content} lenses={["code"]} onChange={() => {
  }} />)
}

export default RichText
