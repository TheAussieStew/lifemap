'use client'

import './styles.scss'
import React from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { EditorContent, Extensions, JSONContent, Editor, useEditor, Content, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import FontFamily from '@tiptap/extension-font-family'
import Focus from '@tiptap/extension-focus'
import TextStyle from '@tiptap/extension-text-style'
import Gapcursor from '@tiptap/extension-gapcursor'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import Collaboration, { isChangeOrigin } from '@tiptap/extension-collaboration'
import CollaborationHistory, { CollabHistoryVersion } from '@tiptap-pro/extension-collaboration-history'
import { watchPreviewContent } from '@tiptap-pro/extension-collaboration-history'
import Details from '@tiptap-pro/extension-details'
import DetailsSummary from '@tiptap-pro/extension-details-summary'
import DetailsContent from '@tiptap-pro/extension-details-content'
import UniqueID from '@tiptap-pro/extension-unique-id'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import js from 'highlight.js/lib/languages/javascript'
import { throttle } from 'lodash'
import { QuantaClass, QuantaType, TextSectionLens, RichTextT } from '../../core/Model'
import { lowlight } from 'lowlight'
import { GroupExtension } from '../../subapps/logos/GroupTipTapExtension'
import { MathExtension } from '../../subapps/natural-scientific-calculator/MathTipTapExtension'
import { Indent } from '../../utils/Indent'
import TextAlign from '@tiptap/extension-text-align'
import { DocumentFlowMenu, FlowMenu } from '../../subapps/controls/FlowMenu'
import { observer } from 'mobx-react-lite'
import { QuantaStoreContext } from '../../backend/QuantaStore'
import { FontSize } from '../../subapps/logos/FontSizeTipTapExtension'
import { mentionSuggestionOptions } from '../../subapps/content/TagTipTapExtension'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import { FadeIn } from '../../subapps/logos/FadeInExtension'
import { CustomMention } from '../../subapps/content/Mention'
import { CustomLink } from '../../subapps/logos/Link'
import { QuoteExtension } from '../../subapps/logos/QuoteTipTapExtension'
import { SophiaAI } from '../../agents/Sophia'
import { LocationExtension } from '../../subapps/atlas/LocationTipTapExtension'
import { CommentExtension } from '../../subapps/chronos/CommentTipTapExtension'
import { PortalExtension } from '../../subapps/logos/PortalExtension'
import { backup, generateUniqueID, renderDate } from '../../utils/utils'
import { issue123DocumentState } from '../../../bugs/issue-123'
import { ExperimentalPortalExtension } from '../../subapps/logos/ExperimentalPortalExtension'
import { WarningExtension } from '../../subapps/logos/WarningTipTapExtension'
import { driver } from 'driver.js'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

lowlight.registerLanguage('js', js)

export type textInformationType =  "string" | "jsonContent" | "yDoc" | "invalid";


export const officialExtensions = (quantaId: string) => {return [
  // Add official extensions
  BubbleMenu.configure({
    pluginKey: `bubbleMenu${quantaId}`,
    updateDelay: 100,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Color.configure({
    types: ['textStyle'],
  }),
  Details.configure({
    persist: true,
    HTMLAttributes: {
      class: 'details',
    },
  }),
  DetailsContent,
  DetailsSummary,
  FontFamily.configure({
    types: ['textStyle'],
  }),
  Focus.configure({
    className: 'attention-highlight',
    mode: 'shallowest',
  }),
  FontSize,
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Image,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: true,
    showOnlyWhenEditable: false,
    // Use different placeholders depending on the node type:
    placeholder: ({ node }) => {
      // TODO: This doesn't work because the group renders quanta, which is a paragraph
      if (node.type.name === "paragraph") {
        return 'Write something...'
      } else {
        return ''
      }
    },
  }),
  Gapcursor,
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
    gapcursor: false,
  }),
  Table.configure({
    resizable: true,
    cellMinWidth: 300
  }),
  TableRow,
  TableHeader,
  TableCell,
  TaskItem.configure({
    nested: true,
  }),
  TaskList,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
  Underline,
  UniqueID.configure({
    // TODO: Add more nodes
    types: ['paragraph', 'mention', 'group'],
    filterTransaction: transaction => !isChangeOrigin(transaction),
    generateID: generateUniqueID,
    attributeName: 'quantaId',
  }),
] as Extensions}

export const customExtensions: Extensions = [
  CommentExtension,
  CustomLink.configure({
    openOnClick: true,
  }),
  CustomMention.configure(
    {
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: mentionSuggestionOptions,
    }
  ),
  FadeIn,
  GroupExtension,
  Indent,
  LocationExtension,
  MathExtension,
  PortalExtension,
  ExperimentalPortalExtension,
  QuoteExtension,
  WarningExtension,
]

export const agents: Extensions = [
  SophiaAI,
  // Finesse,
]

// This TransclusionEditor merely needs to display a copy of the node being synced in the main editor
// Therefore it needs no syncing capabilities.
// If editing is enabled on the transcluded node, then edits should be propagated back to the main editor for syncing
export const TransclusionEditor = (information: RichTextT, isQuanta: boolean, readOnly?: boolean) => {
  const { quanta, provider } = React.useContext(QuantaStoreContext)

  const informationType = isQuanta ? "yDoc" : typeof information === "string" ? "string" : typeof information === "object" ? "object" : "invalid"

  let generatedOfficialExtensions = officialExtensions(quanta.id)

  const editor = useEditor({
    extensions: [...generatedOfficialExtensions, ...customExtensions, ...agents],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    content: (informationType === "yDoc") ? null : information,
    onUpdate: ({ editor }) => {

    }
  })

  return editor
}

export const MainEditor = (information: RichTextT, isQuanta: boolean, readOnly?: boolean) => {
  const { quanta, provider } = React.useContext(QuantaStoreContext)
  const [contentError, setContentError] = React.useState<Error | null>(null)

  const informationType = isQuanta ? "yDoc" : typeof information === "string" ? "string" : typeof information === "object" ? "object" : "invalid"

  let generatedOfficialExtensions = officialExtensions(quanta.id)

  if (informationType === "yDoc") {
    generatedOfficialExtensions.push(
      Collaboration.configure({
        document: quanta.information,
        field: 'default',
      }),
      CollaborationHistory.configure({
        provider,
      })
    )
  } 


  // @ts-ignore
  const editor = useEditor({
    immediatelyRender: false as const,
    extensions: [...generatedOfficialExtensions, ...customExtensions, ...agents],
    editable: !readOnly, // Only enable when mounted
    enableContentCheck: true, // Enable content validation
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    content: (informationType === "yDoc") ? null : information,
    shouldRerenderOnTransaction: false,
    
    // Add error handling for invalid content
    // @ts-ignore
    onContentError: ({ editor, error, disableCollaboration }) => {
      console.error('Editor content error:', error)
      setContentError(error)
      // If there is an error on this client, isolate the client from others, to prevent
      // it from "infecting" other clients with its invalid content

      // If using collaboration, disable it to prevent syncing invalid content
      if (disableCollaboration && provider) {
        disableCollaboration()
      }

      // Prevent emitting updates
      const emitUpdate = false

      // Disable further user input
      editor.setEditable(false, emitUpdate)
    },
    
    // @ts-ignore
    onSelectionUpdate: ({ editor }: { editor: Editor }) => {
      // Retrieve document attributes using the custom command
      // @ts-ignore - TODO: this actually does work, not sure why it's not recognised
      const documentAttributes = editor.commands.getDocumentAttributes()

      // Attributes for the Document root node are defined in DocumentAttributesExtension.tsx
      if (documentAttributes.selectedFocusLens === "editing") {
        editor.setEditable(true)
      } else if (documentAttributes.selectedFocusLens === "focus") {
        editor.setEditable(true)
        // Highlight the focused node
        const driverObj = driver({
          animate: true,
          disableActiveInteraction: false,
          stageRadius: 15,
          allowClose: true,
        })

        // Document here refers to the HTML document, not the document node of TipTap
        const elements = document.querySelectorAll('.attention-highlight');
        elements.forEach((element) => {
          driverObj.highlight({
            element: element,
          });
        });
      } else if (documentAttributes.selectedFocusLens === "read-only") {
        editor.setEditable(false)
      }
    },
    onCreate: ({ editor }) => {
      // Runs once when editor is initialized
      // @ts-ignore
      const documentAttributes = editor.commands.getDocumentAttributes()
      console.log("Initial Document Attributes", documentAttributes)
    },
    onUpdate: ({ editor }) => {
         // @ts-ignore
      editor.commands.ensureDocumentAttributes()
      
      console.log("JSON Output", editor.getJSON())
      // @ts-ignore
      const documentAttributes = editor.commands.getDocumentAttributes()
      console.log("Document Attributes", documentAttributes)
    },
    onTransaction: ({ editor, transaction }) => {
    },
  })

  return editor
}
// TODO: Maybe merge this RichText and the editor component above, since they have virtually the same props
export const RichText = observer((props: { quanta?: QuantaType, text: RichTextT, lenses: [TextSectionLens], onChange?: (change: string | JSONContent) => void }) => {
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

  let editor = MainEditor(content, true, false)
  // These functions are memoised for performance reasons
  const handleRevert = React.useCallback((version: number, versionData: CollabHistoryVersion) => {
    const versionTitle = versionData ? versionData.name || renderDate(versionData.date) : version

    // @ts-ignore
    editor?.commands.revertToVersion(version, `Revert to ${versionTitle}`, `Unsaved changes before revert to ${versionTitle}`)
  }, [editor])
  // @ts-ignore
  const reversedVersions = React.useMemo(() => editor?.storage.collabHistory.versions.slice().reverse(), [editor?.storage.collabHistory.versions])
  // console.log("reversed versions", reversedVersions)

  // @ts-ignore
  const autoversioningEnabled = editor?.storage.collabHistory.autoVersioning


  // TODO: Change this to proper responsiveness for each screen size
  const maxWidth = 1300

  if (editor) {
    if (process.env.NODE_ENV === 'development') {
      // console.debug(editor.schema)
    }

    return (
      <div key={props.quanta?.id} style={{width: '100%'}}>
        {/* This menu is always fixed at the very top of the document */}
        <div style={{ width: '100%'}}>
          <div key={`bubbleMenu${props.quanta?.id}`}>
            {/* This menu floats above selected text or nodes */}
            <FlowMenu editor={editor as Editor} />
          </div>
          <div>
            <EditorContent editor={editor as Editor} />
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
  
})

export const issue123Example = () => {
  return (
    <RichText 
      text={issue123DocumentState} 
      lenses={["text"]} 
    />
  )
}

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
  return (<RichText quanta={new QuantaClass()} text={content} lenses={["code"]} onChange={() => {
  }} />)
}

export default RichText