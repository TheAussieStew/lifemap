import React, { useEffect, useRef } from 'react'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { EditorContent, Extensions, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import GapCursor from '@tiptap/extension-gapcursor'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import FontFamily from '@tiptap/extension-font-family'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import Collaboration, { isChangeOrigin } from '@tiptap/extension-collaboration'
import Mention from '@tiptap/extension-mention'
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
import { mentionSuggestionOptions } from './TagTipTapExtension'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import { CalculationExtension } from './CalculationTipTapExtension'
import { FadeIn } from './FadeInExtension'
import { MessageExtension } from './MessageExtension'
import { generatePrompt } from '../../utils/utils'
import { TextSelection } from '@tiptap/pm/state'
import { SophiaAI } from '../../agents/Sophia'

const { Configuration, OpenAIApi } = require("openai");

lowlight.registerLanguage('js', js)

const configuration = new Configuration({
  apiKey: "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",
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);


let timeout: ReturnType<typeof setTimeout>;
let ignoreUpdate = false;


export const CustomisedEditor = (information: RichTextT) => {
  let qi = React.useContext(QiStoreContext)
  console.log("qiId", qi.id)

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
      // Disable provided extensions so they don't load twice
      heading: false,
      codeBlock: false,
    }),
    FadeIn,
    MessageExtension,
    GapCursor,
    Link.configure({
      openOnClick: true,
    }),
    BubbleMenu.configure({
      pluginKey: `bubbleMenu${qi.id}`,
      updateDelay: 100,
    }),
    Image,
    CodeBlockLowlight.configure({
      lowlight,
    }),
    Color.configure({
      types: ['textStyle'],
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Mention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: mentionSuggestionOptions,
    }),
    Heading.configure({
      levels: [1, 2, 3, 4],
    }),
    TextStyle,
    Underline,
    UniqueID.configure({
      attributeName: 'qid',
      types: ['group'],
      filterTransaction: transaction => !isChangeOrigin(transaction),
    }),
    FontSize,
    Highlight,
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
    CalculationExtension,
    Indent,
    // Add agents
    SophiaAI
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
    onUpdate: ({ editor, transaction }) => {
      // Check if the update should be ignored
      if (ignoreUpdate) {
        // Reset the flag
        ignoreUpdate = false;
        // Ignore the update
        return;
      }

      // console.log("JSON Output", editor.getJSON())
      const html = editor.getHTML()
      console.log("HTML Output", html)
      // console.log("editor getText", editor.getText())

      // If only the cursor moved, then don't need a response
      if (transaction.docChanged === false && transaction.steps.length === 0) {
        // Ignore the update
        return;
      }

      clearTimeout(timeout);

      // timeout = setTimeout(() => {
      //   const text = editor.getText();
      //   // Set the flag to ignore the next update
      //   ignoreUpdate = true;

      //   openai.createChatCompletion({
      //     model: "gpt-3.5-turbo",
      //     messages: [{ role: "user", content: generatePrompt(text) }],
      //   }).then((response: any) => {
      //     const text = response.data.choices[0].message.content
      //     console.log("text", text)
      //     // @ts-ignore
      //     editor.chain().insertContent({
      //       type: 'message',
      //       content: [
      //         {
      //           type: 'paragraph',
      //           content: [
      //             {
      //               type: 'text',
      //               text
      //             }
      //           ]
      //         }
      //       ]
      //     })
      //       .run();
      //   });

      // }, 5000);
    }
  })
}

export const RichText = observer((props: { qi?: QiT, text: RichTextT, lenses: [TextSectionLens], onChange?: (change: string | JSONContent) => void }) => {
  let content = props.text

  switch (props.lenses[0]) {
    case "code":
      // TODO: Reactivate code lens
      // content = `<pre><code class="language-javascript">${props.text}</code></pre>`

      break;
    case "text":
      // Do nothing

      break;
    default:
      break;
  }

  let editor = CustomisedEditor(content)

  if (process.env.NODE_ENV === 'development') {
    if (editor) {
      // console.debug(editor.schema)
    }
  }

  return (
    <div key={props.qi?.id}>
      <div key={`bubbleMenu${props.qi?.id}`}>
        <FlowMenu editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
})

export const RichTextCodeExample = () => {
  const content = `
  <p>
    That’s a boring paragraph followed by a fenced code block:
  </p>
  <span data-type="mention" data-id="🧱 blocked"></span><span data-type="mention" data-id="⭐️ important"></span>
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
  <group>
  <math lensDisplay="natural" lensevaluation="identity">
    \\frac{1}{2
  </math>
  </group>
  <group>
  <div>
  <math>
  10 + 30
  </math>
  </div>
  <div>
  <math>
  40
  </math>
  </div>
  </group>
`
  return (<RichText qi={new QiC()} text={content} lenses={["code"]} onChange={() => {
  }} />)
}

export const AITutorExample = () => {
  const content = `
  <p>
    Please type your message here...
  </p>
`
  return (<RichText qi={new QiC()} text={content} lenses={["code"]} onChange={() => {
  }} />)
}

export default RichText
