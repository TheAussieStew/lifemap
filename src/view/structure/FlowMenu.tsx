import { Editor, isNodeSelection } from "@tiptap/core"
import { BubbleMenu } from "@tiptap/react"
import { RichTextCodeExample, customExtensions } from "../content/RichText"
import { motion } from "framer-motion"
import IconButton from '@mui/joy/IconButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethrough from '@mui/icons-material/FormatStrikethrough';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCentre from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { Tag } from "../content/Tag"
import { black, blue, grey, highlightYellow, purple, red, offWhite, lightBlue, parchment, highlightGreen, teal, green } from "../Theme"
import FormatColorFill from "@mui/icons-material/FormatColorFill"
import { FlowSwitch, Option } from "./FlowSwitch"
import React, { CSSProperties } from "react"
import { MathLens } from "../../core/Model";
import { getSelectedNode, getSelectedNodeType, logCurrentLens } from "../../utils/utils";
import { DocumentAttributes } from "./DocumentAttributesExtension";
import { SalesGuideTemplate } from "../content/SalesGuideTemplate";
import { yellow } from "@mui/material/colors";

export const flowMenuStyle = (allowScroll: boolean = true): React.CSSProperties => {
    return {
        boxSizing: "border-box",
        flexShrink: 0,
        width: "max-content",
        height: "fit-content",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "5px 15px 5px 15px",
        boxShadow:
            "0px 0.6021873017743928px 3.010936508871964px -0.9166666666666666px rgba(0, 0, 0, 0.14), 0px 2.288533303243457px 11.442666516217285px -1.8333333333333333px rgba(0, 0, 0, 0.13178), 0px 10px 50px -2.75px rgba(0, 0, 0, 0.1125)",
        backgroundColor: `rgba(217, 217, 217, 0.20)`,
        backdropFilter: `blur(12px)`,
        overflow: allowScroll ? "scroll" : "visible",
        zIndex: 1,
        alignContent: "center",
        flexWrap: "nowrap",
        gap: "10px",
        borderRadius: "10px",
        border: "1px solid var(--Light_Grey, rgba(221,221,221,0.75))"
    }
}

type Action = (editor: Editor) => boolean

const handleCopyContentAction: Action = (editor: Editor) => {
    // None of these work, all that's needed to to emulate the copy command exactly, 
    // in order to paste nodes or selections
    // // Execute the copy command:
    // document.execCommand('copy');   

    // // Get the currently selected text
    // const selection = editor!.view.state.selection

    // const html = generateHTML(selection.toJSON(), [...officialExtensions("..."), ...customExtensions])

    // // Copy the HTML of the selected node to the clipboard
    // navigator.clipboard.write(html).then(() => {
    //     console.log('Copying to clipboard was successful!');
    //     return true;
    // }, (err) => {
    //     console.error('Could not copy text: ', err);
    //     return false;
    // })

    return false;
}

const handleCopyQuantaIdAction: Action = (editor: Editor) => {
    const selectedNode = getSelectedNode(editor)

    if (selectedNode) {
        const quantaId: string = selectedNode.attrs.quantaId
        const quantaIdWithoutQuotes = JSON.stringify(quantaId).slice(1, -1)
        navigator.clipboard.writeText(quantaIdWithoutQuotes).then(() => {
            console.log('Copying to clipboard was successful!');
            return true
        }, (err) => {
            console.error('Could not copy text: ', err);
            return false
        });
    } else {
        console.error('Attempted to invoke copy quanta id action when a node was not selected. ');
        return false
    }
    return false
}

const handleAddImage = (editor: Editor) => {
    const url = window.prompt('URL')

    if (url) {
        editor.chain().focus().setImage({ src: url }).run()
        return true
    } else {
        return false
    }
}

// For some reason if I hard code a string like "latex", it works, but if I use the variable mathLens it doesn't?
const setDisplayLensLatex = (editor: Editor) => {
    editor!.chain().focus().updateAttributes("math", { lensDisplay: "latex" }).run();
}

const setDisplayLensNatural = (editor: Editor) => {
    editor!.chain().focus().updateAttributes("math", { lensDisplay: "natural" }).run();
}

const setEvaluationLens = (editor: Editor, mathLens: MathLens) => {
    console.log("setting evaluation lens:", mathLens)
    editor!.chain().focus().updateAttributes("math", { lensEvaluation: mathLens }).run();
}

const setMathsLens = (editor: Editor, mathLens: MathLens) => {
    editor!.chain().focus().updateAttributes("math", { lensDisplay: mathLens }).run();

    // Get the current selection
    // Problem seems to be that when I interact with the flow switch, the selection changes to something other than the math node
    // @ts-ignore

 };

const ActionSwitch = (props: { selectedAction: string, editor: Editor }) => {

    return (
        <FlowSwitch value={props.selectedAction} isLens>
            <Option
                value={"Replace page with 'Sales Guide' template"}
                onClick={() => {
                    props.editor.commands.setContent(SalesGuideTemplate);
                }}
            >
                <motion.div>
                    <span>
                        💰 Insert Sales Guide Template
                    </span>
                </motion.div>
            </Option>
            <Option
                value={"Copy quanta id"}
                onClick={() => handleCopyQuantaIdAction(props.editor)}
            >
                <motion.div>
                    <span>
                        🆔 Copy quanta id
                    </span>
                </motion.div>
            </Option>
            <Option
                value={"Insert 2 columns"}
                onClick={() => {
                    props.editor.chain()
                        .focus()
                        // First insert the table
                        .insertTable({ rows: 1, cols: 2, withHeaderRow: false })
                        // Then ensure each cell has a paragraph
                        .insertContent({ type: 'paragraph' })
                        .run()
                }}
            >
                <motion.div>
                    <span style={{}}>
                        🏛️ Insert 2 columns
                    </span>
                </motion.div>
            </Option>
            <Option
                value={"Insert 3 columns"}
                onClick={() => {
                    props.editor.chain()
                        .focus()
                        // First insert the table
                        .insertTable({ rows: 1, cols: 3, withHeaderRow: false })
                        // Then ensure each cell has a paragraph
                        .insertContent({ type: 'paragraph' })
                        .run()
                }}
            >
                <motion.div>
                    <span style={{}}>
                        🏛️ Insert 3 columns
                    </span>
                </motion.div>
            </Option>
            <Option
                value={"Copy content"}
                onClick={() => handleCopyContentAction(props.editor)}
            >
                <motion.div>
                    <span style={{}}>
                        📑 Copy content
                    </span>
                </motion.div>
            </Option>
            <Option
                value={"Add Details"}
                onClick={() => props.editor.commands.setDetails()}
            >
                <motion.div>
                    <span>
                        ▶ Add Details
                    </span>
                </motion.div>
            </Option>
            <Option
                value={"Add image"}
                onClick={() => { handleAddImage(props.editor) }}
            >
                <motion.div>
                    <span>
                        🌁 Add image
                    </span>
                </motion.div>
            </Option>
            <Option
                value={"Add Warning group"}
                // Change this to a proper add warning command inside the extension
                onClick={() => props.editor.commands.insertContent({ type: "warning" })}
            >
                <motion.div>
                    <span>
                        ⚠ Add Warning group
                    </span>
                </motion.div>
            </Option>
        </FlowSwitch>
    )
}

const VersionHistorySwitch = (props: { selectedVersionHistory: string, editor: Editor }) => {
    const versions = props.editor.storage.collabHistory.versions

    return (<FlowSwitch value={props.editor.storage.collabHistory.currentVersion}>
        {versions ? versions.map((version: number) => (
            <>
                <Option
                    value={version.toString()}
                    onClick={() => props.editor.commands.revertToVersion(version)}
                >
                    <>
                        {version.toString()}
                    </>
                </Option>
            </>)) :
            <>
                <Option
                    value={"000000"}
                    onClick={() => { }}
                >
                    <>
                        {"No version history available"}
                    </>
                </Option>
                <Option
                    value={"000000"}
                    onClick={() => { }}
                >
                    <>
                        {"No version history available"}
                    </>
                </Option>
            </>
        }
    </FlowSwitch>)
}

export const DocumentFlowMenu = (props: { editor: Editor }) => {
    const [selectedAction, setSelectedAction] = React.useState<string>("Copy quanta id")

    const [selectedFocusLens, setSelectedFocusLens] = React.useState<DocumentAttributes['selectedFocusLens']>("editing")
    const [selectedEventType, setSelectedEventType] = React.useState<DocumentAttributes['selectedEventLens']>("wedding")

    const [irrelevantEventNodesDisplayLens, setIrrelevantEventNodesDisplayLens] = React.useState<DocumentAttributes['irrelevantEventNodesDisplayLens']>("dim")
    const [unimportantNodesDisplayLens, setUnimportantNodesDisplayLens] = React.useState<DocumentAttributes['unimportantNodesDisplayLens']>("hide")

    let documentMenuStyle: CSSProperties = flowMenuStyle(false)
    documentMenuStyle.width = "100%"

    React.useEffect(() => {
        // Add null check for editor
        if (!props.editor) return;

        const document = props.editor.state.doc
        const documentAttributes = document.attrs

        // On document load, initialise state variables from document attributes
        if (documentAttributes.selectedFocusLens) {
            setSelectedFocusLens(documentAttributes.selectedFocusLens)
        }
        if (documentAttributes.selectedEventType) {
            setSelectedEventType(documentAttributes.selectedEventType)
        }
        if (documentAttributes.irrelevantEventNodesDisplayLens) {
            setIrrelevantEventNodesDisplayLens(documentAttributes.irrelevantEventNodesDisplayLens)
        }
        if (documentAttributes.unimportantNodesDisplayLens) {
            setUnimportantNodesDisplayLens(documentAttributes.unimportantNodesDisplayLens)
        }

    }, [props.editor])

    return (
        <motion.div style={documentMenuStyle}>
            <ActionSwitch editor={props.editor} selectedAction={selectedAction} />
            <FlowSwitch value={selectedFocusLens} isLens>
                <Option
                    value={"editing" as DocumentAttributes['selectedFocusLens']}
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ selectedFocusLens: 'editing' as DocumentAttributes['selectedFocusLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            📝 Editing view
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"focus" as DocumentAttributes['selectedFocusLens']}
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ selectedFocusLens: 'focus' as DocumentAttributes['selectedFocusLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            🔍 Focus view
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"read-only" as DocumentAttributes['selectedFocusLens']}
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ selectedFocusLens: 'read-only' as DocumentAttributes['selectedFocusLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            📖️ Read-only view
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
            <FlowSwitch value={selectedEventType} isLens>
                <Option
                    value={"wedding"}
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ selectedEventLens: 'wedding' as DocumentAttributes['selectedEventLens'] }).run();
                        // @ts-ignore
                        console.log('Setting selected event lens to wedding', props.editor.commands.getDocumentAttributes())
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            💍 Wedding
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"corporate"}
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ selectedEventLens: 'corporate' as DocumentAttributes['selectedEventLens'] }).run();
                        // @ts-ignore
                        console.log('Setting selected event lens to corporate', props.editor.commands.getDocumentAttributes())
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            💼 Corporate
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"birthday"}
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ selectedEventLens: 'birthday' as DocumentAttributes['selectedEventLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            🎂 Birthday
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>

            {/* New FlowSwitch for irrelevant event nodes */}
            <FlowSwitch value={irrelevantEventNodesDisplayLens} isLens>
                <Option
                    value="show"
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ irrelevantEventNodesDisplayLens: 'show' as DocumentAttributes['irrelevantEventNodesDisplayLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            👁️ Show all irrelevant event nodes
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value="hide"
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ irrelevantEventNodesDisplayLens: 'hide' as DocumentAttributes['irrelevantEventNodesDisplayLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            🙈 Hide all irrelevant event nodes
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value="dim"
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ irrelevantEventNodesDisplayLens: 'dim' as DocumentAttributes['irrelevantEventNodesDisplayLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            🕶️ Dim all irrelevant event nodes
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>

            {/* New FlowSwitch for unimportant nodes */}
            <FlowSwitch value={unimportantNodesDisplayLens} isLens>
                <Option
                    value="show"
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ unimportantNodesDisplayLens: 'show' as DocumentAttributes['unimportantNodesDisplayLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            👁️ Show unimportant nodes
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value="hide"
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ unimportantNodesDisplayLens: 'hide' as DocumentAttributes['unimportantNodesDisplayLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            🙈 Hide unimportant nodes
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value="dim"
                    onClick={() => {
                        // @ts-ignore
                        props.editor.chain().setDocumentAttribute({ unimportantNodesDisplayLens: 'dim' as DocumentAttributes['unimportantNodesDisplayLens'] }).run();
                    }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            🔅️ Dim all unimportant nodes
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>

        </motion.div>
    )
}

// We assume that the currently selected node is a Group node
const GroupLoupe = (props: { editor: Editor }) => {

    const selectedNode = getSelectedNode(props.editor)
    let backgroundColor = selectedNode.attrs.backgroundColor

    return (
        <div
            style={{ display: "flex", gap: 5, height: "fit-content", alignItems: "center", overflow: "visible" }}>
            <Tag>
                Group
            </Tag>
            {/* Lenses */}
            <FlowSwitch value={backgroundColor} isLens>
                <Option value={"identity"} onClick={() => {
                    props.editor.commands.setLens({ lens: "identity" })
                }}>
                    <motion.div>
                        Identity
                    </motion.div>
                </Option>
                <Option value={"hideUnimportantNodes"} onClick={() => {
                    props.editor.commands.setLens({ lens: "hideUnimportantNodes" })
                }}>
                    <motion.div>
                        Only show important nodes
                    </motion.div>
                </Option>
            </FlowSwitch>
            {/* Actions */}
            <FlowSwitch value={backgroundColor} isLens>
                <Option
                    value={"lightBlue"}
                    onClick={() => {
                        props.editor.commands.setBackgroundColor({ backgroundColor: lightBlue })
                    }}
                >
                    <motion.div>
                        <span style={{ backgroundColor: lightBlue, borderRadius: 3 }}>
                            🎨️ Change background color to light blue
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"purple"}
                    onClick={() => {
                        props.editor.commands.setBackgroundColor({ backgroundColor: purple })
                    }}
                >
                    <motion.div>
                        <span style={{ backgroundColor: purple, borderRadius: 3 }}>
                            🎨️ Change background color to purple
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"parchment"}
                    onClick={() => {
                        props.editor.commands.setBackgroundColor({ backgroundColor: parchment })
                    }}
                >
                    <motion.div>
                        <span style={{ backgroundColor: purple, borderRadius: 3 }}>
                            🎨️ Change background color to parchment
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"blue"}
                    onClick={() => {
                        props.editor.commands.setBackgroundColor({ backgroundColor: blue })
                    }}
                >
                    <motion.div>
                        <span style={{ backgroundColor: blue, borderRadius: 3 }}>
                            🎨️ Change background color to blue
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"Change background color to white"}
                    onClick={() => {
                        props.editor.commands.setBackgroundColor({ backgroundColor: offWhite });
                    }}
                >
                    <motion.div>
                        <span style={{ backgroundColor: offWhite, borderRadius: 3 }}>
                            🎨️ Change background color to white
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
        </div>
    )
}

const MathLoupe = (props: { editor: Editor, selectedDisplayLens: string }) => {
    return (
        <div
            style={{ display: "flex", gap: 5, height: "fit-content", alignItems: "center", overflow: "visible" }}>
            <Tag>
                Math
            </Tag>
            <FlowSwitch value={props.selectedDisplayLens} isLens>
                <Option value="natural" onClick={() => {
                    // selection.focus().updateAttributes("math", { lensDisplay: "latex" }).run()
                    // setMathsLens("latex")
                    setDisplayLensNatural(props.editor)
                }}>
                    <motion.div>
                        <div style={{ fontFamily: 'Inter' }}>
                            Natural
                        </div>
                    </motion.div>
                </Option>
                <Option value="latex" onClick={() => {
                    // selection.focus().updateAttributes("math", { lensDisplay: "latex" }).run()
                    // setMathsLens("latex")
                    setDisplayLensLatex(props.editor)
                }}>
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            Latex
                        </span>
                    </motion.div>
                </Option>
                <Option value="linear" onClick={() => {
                    // selection.focus().updateAttributes("math", { lensDisplay: "latex" }).run()
                    // setMathsLens("latex")
                    setDisplayLensLatex(props.editor)
                }}>
                    <motion.div onClick={() => props.editor!.chain().focus().setFontFamily('Arial').run()}>
                        <span style={{ fontFamily: 'Inter' }}>
                            Linear
                        </span>
                    </motion.div>
                </Option>
                <Option value="mathjson" onClick={() => {
                    // selection.focus().updateAttributes("math", { lensDisplay: "latex" }).run()
                    // setMathsLens("latex")
                    setDisplayLensLatex(props.editor)
                }}>
                    <motion.div onClick={() => props.editor!.chain().focus().setFontFamily('Arial').run()}>
                        <span style={{ fontFamily: 'Inter' }}>
                            MathJSON
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
            <FlowSwitch value={"evaluate"} isLens >
                <Option value="identity" onClick={() => { setEvaluationLens(props.editor, "identity") }} >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            Identity
                        </span>
                    </motion.div>
                </Option>
                <Option value="simplify" onClick={() => { setEvaluationLens(props.editor, "simplify") }} >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            Simplify
                        </span>
                    </motion.div>
                </Option>
                <Option value="evaluate" onClick={() => { setEvaluationLens(props.editor, "evaluate") }} >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            Evaluate
                        </span>
                    </motion.div>
                </Option>
                <Option value="numeric" onClick={() => { setEvaluationLens(props.editor, "numeric") }} >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            Numeric
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
        </div>
    )
}

// Need to add additional state variables that currently have a placeholder using justification
const RichTextLoupe = (props: { editor: Editor, font: string, fontSize: string, justification: string }) => {
    return (
        <div
            style={{ display: "flex", gap: 5, height: "fit-content", overflowX: "scroll", alignItems: "center", overflow: "visible" }}>
            <Tag>
                Rich Text
            </Tag>
            <FlowSwitch value={props.font} isLens>
                <Option value={"EB Garamond"} onClick={() => props.editor!.chain().focus().setFontFamily('EB Garamond').run()}>
                    <motion.div>
                        <span style={{ fontFamily: 'EB Garamond' }}>
                            EB Garamond
                        </span>
                    </motion.div>
                </Option>
                <Option value={"Inter"} onClick={() => props.editor!.chain().focus().setFontFamily('Inter').run()}>
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            Inter
                        </span>
                    </motion.div>
                </Option>
                <Option value={"Arial"} onClick={() => props.editor!.chain().focus().setFontFamily('Arial').run()}>
                    <motion.div>
                        <span style={{ fontFamily: 'Arial' }}>
                            Arial
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
            <FlowSwitch value={`${props.fontSize}px`} isLens>
                <Option
                    value={"36px"}
                    onClick={() => { props.editor!.chain().focus().setFontSize('36px').run() }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            36 px
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"30px"}
                    onClick={() => { props.editor!.chain().focus().setFontSize('30px').run() }}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            30 px
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"24px"}
                    onClick={() => props.editor!.chain().focus().setFontSize('24px').run()}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            24 px
                        </span>
                    </motion.div>
                </Option>
                <Option
                    value={"20px"}
                    onClick={() => props.editor!.chain().focus().setFontSize('20px').run()}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            20 px
                        </span>
                    </motion.div>
                </Option>
                <Option value={"18px"}
                    onClick={() => props.editor!.chain().focus().setFontSize('18px').run()}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            18 px
                        </span>
                    </motion.div>
                </Option>
                <Option value={"16px"}
                    onClick={() => props.editor!.chain().focus().setFontSize('16px').run()}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            16 px
                        </span>
                    </motion.div>
                </Option>
                <Option value={"14px"}
                    onClick={() => props.editor!.chain().focus().setFontSize('14px').run()}
                >
                    <motion.div>
                        <span style={{ fontFamily: 'Inter' }}>
                            14 px
                        </span>
                    </motion.div>
                </Option>
            </FlowSwitch>
            <FlowSwitch value={props.justification} isLens>
                {/* <FlowSwitch value={props.editor.isActive({ textAlign: 'left' }) ? "left" : props.editor.isActive({ textAlign: 'center' }) ? "center" : props.editor.isActive({ textAlign: 'right' }) ? "right" : "justify"} isLens> */}
                <Option value="left"
                    onClick={() => props.editor!.chain().focus().setTextAlign('left').run()}
                >
                    <IconButton
                        size="sm"
                        className={props.editor.isActive('bold') ? 'is-active' : ''}
                        variant={props.editor!.isActive({ textAlign: 'left' }) ? "solid" : "plain"}>
                        <FormatAlignLeft />
                    </IconButton>
                </Option>
                <Option value="center"
                    onClick={() => props.editor!.chain().focus().setTextAlign('center').run()}
                >
                    <IconButton
                        size="sm"
                        className={props.editor.isActive('bold') ? 'is-active' : ''}
                        variant="plain">
                        <FormatAlignCentre />
                    </IconButton>
                </Option>
                <Option value="right"
                    onClick={() => props.editor!.chain().focus().setTextAlign('right').run()}
                >
                    <IconButton
                        size="sm"
                        className={props.editor.isActive('bold') ? 'is-active' : ''}
                        variant="plain">
                        <FormatAlignRight />
                    </IconButton>
                </Option>
                <Option value="justify"
                    onClick={() => props.editor!.chain().focus().setTextAlign('justify').run()}
                >
                    <IconButton
                        size="sm"
                        className={props.editor.isActive('bold') ? 'is-active' : ''}
                        variant="plain">
                        <FormatAlignJustify />
                    </IconButton>
                </Option>
            </FlowSwitch>
            <Tag isLens>
                <IconButton
                    style={{ color: props.editor!.isActive('bold') ? offWhite : black }}
                    size="sm"
                    // @ts-ignore
                    onClick={() => props.editor!.chain().focus().toggleBold().run()}
                    variant={props.editor!.isActive('bold') ? "solid" : "plain"}>
                    <FormatBoldIcon />
                </IconButton>
                <IconButton
                    style={{ color: props.editor!.isActive('italic') ? offWhite : black }}
                    size="sm"
                    // @ts-ignore
                    onClick={() => props.editor!.chain().focus().toggleItalic().run()}
                    variant={props.editor!.isActive('italic') ? "solid" : "plain"}>
                    <FormatItalicIcon />
                </IconButton>
                <IconButton
                    style={{ color: props.editor!.isActive('underline') ? offWhite : black }}
                    size="sm"
                    onClick={() => props.editor!.chain().focus().toggleUnderline().run()}
                    variant={props.editor!.isActive('underline') ? "solid" : "plain"}>
                    <FormatUnderlinedIcon />
                </IconButton>
                <IconButton
                    style={{ color: props.editor!.isActive('strike') ? offWhite : black }}
                    size="sm"
                    // @ts-ignore
                    onClick={() => props.editor!.chain().focus().toggleStrike().run()}
                    variant={props.editor!.isActive('strike') ? "solid" : "plain"}>
                    <FormatStrikethrough />
                </IconButton>
            </Tag>
            <FlowSwitch value={props.justification} isLens>
                <Option value={"blue"} onClick={() => {
                    props.editor.commands.setBackgroundColor({ backgroundColor: blue })
                }}>
                    <motion.div style={{ backgroundColor: blue }}>
                        Blue background
                    </motion.div>
                </Option>
                <Option value={"lightBlue"} onClick={() => {
                    props.editor.commands.setBackgroundColor({ backgroundColor: lightBlue })
                }}>
                    <motion.div style={{ backgroundColor: lightBlue }}>
                        Light blue background
                    </motion.div>
                </Option>
                <Option value={"yellow"} onClick={() => {
                    props.editor.commands.setBackgroundColor({ backgroundColor: highlightYellow })
                }}>
                    <motion.div style={{ backgroundColor: highlightYellow }}>
                        Yellow background
                    </motion.div>
                </Option>
                <Option value={"teal"} onClick={() => {
                    props.editor.commands.setBackgroundColor({ backgroundColor: teal })
                }}>
                    <motion.div style={{ backgroundColor: teal }}>
                        Teal background
                    </motion.div>
                </Option>
                <Option value={"green"} onClick={() => {
                    props.editor.commands.setBackgroundColor({ backgroundColor: green })
                }}>
                    <motion.div style={{ backgroundColor: green }}>
                        Green background
                    </motion.div>
                </Option>
                <Option value={"purple"} onClick={() => {
                    props.editor.commands.setBackgroundColor({ backgroundColor: purple })
                }}>
                    <motion.div style={{ backgroundColor: purple }}>
                        Purple background
                    </motion.div>
                </Option>
                <Option value={"grey"} onClick={() => {
                    props.editor.commands.setBackgroundColor({ backgroundColor: grey })
                }}>
                    <motion.div style={{ backgroundColor: grey }}>
                        Grey background
                    </motion.div>
                </Option>
            </FlowSwitch>
            {/* Need to create a proper state variable for this */}
            <FlowSwitch value={props.justification} isLens>
                <Option
                    value={"#121212"}
                    onClick={() => props.editor.chain().focus().setColor('#121212').run()}
                >
                    <IconButton
                        style={{ color: black }}
                        size="sm"
                        // @ts-ignore
                        className={props.editor.isActive('textStyle', { color: '#121212' }) ? 'is-active' : ''}
                        variant="plain"
                    >
                        <FormatColorTextIcon />
                    </IconButton>
                </Option>
                <Option value={"#958df1"} onClick={() => props.editor.chain().focus().setColor('#958DF1').run()}>
                    <IconButton
                        style={{ color: "#958DF1" }}
                        size="sm"
                        // @ts-ignore
                        className={props.editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
                        variant="plain"
                    >
                        <FormatColorTextIcon />
                    </IconButton>
                </Option>
                <Option value={red} onClick={() => props.editor.chain().focus().setColor(red).run()}>
                    <IconButton
                        style={{ color: red }}
                        size="sm"
                        // @ts-ignore
                        className={props.editor.isActive('textStyle', { color: red }) ? 'is-active' : ''}
                        variant="plain"
                    >
                        <FormatColorTextIcon />
                    </IconButton>
                </Option>
                <Option value={grey} onClick={() => props.editor.chain().focus().setColor(grey).run()}>
                    <IconButton
                        style={{ color: grey }}
                        size="sm"
                        // @ts-ignore
                        className={props.editor.isActive('textStyle', { color: grey }) ? 'is-active' : ''}
                        variant="plain"
                    >
                        <FormatColorTextIcon />
                    </IconButton>
                </Option>
            </FlowSwitch>
            
            {/* Need to create a proper state variable for this */}
            <FlowSwitch value={props.justification} isLens>
                <Option
                    value={highlightYellow}
                    onClick={() => props.editor!.chain().focus().toggleHighlight({ color: highlightYellow }).run()}
                >
                    <IconButton
                        style={{ color: highlightYellow }}
                        size="sm"
                        // TODO: Highlight color is controlled by mark style in styles.css and not the color parameter here
                        className={props.editor!.isActive('highlight', { color: highlightYellow }) ? 'is-active' : ''}
                        variant="plain">
                        <FormatColorFill />
                    </IconButton>
                </Option>
                <Option
                    value={blue}
                    onClick={() => props.editor!.chain().focus().toggleHighlight({ color: blue }).run()}
                >
                    <IconButton
                        style={{ color: blue }}
                        size="sm"
                        // TODO: Highlight color is controlled by mark style in styles.css and not the color parameter here
                        className={props.editor!.isActive('highlight', { color: blue }) ? 'is-active' : ''}
                        variant="plain">
                        <FormatColorFill />
                    </IconButton>
                </Option>
                <Option
                    value={purple}
                    onClick={() => props.editor!.chain().focus().toggleHighlight({ color: purple }).run()}
                >
                    <IconButton
                        style={{ color: purple }}
                        size="sm"
                        // TODO: Highlight color is controlled by mark style in styles.css and not the color parameter here
                        className={props.editor!.isActive('highlight', { color: blue }) ? 'is-active' : ''}
                        variant="plain">
                        <FormatColorFill />
                    </IconButton>
                </Option>
                <Option
                    value={red}
                    onClick={() => props.editor!.chain().focus().toggleHighlight({ color: red }).run()}
                >
                    <IconButton
                        style={{ color: red }}
                        size="sm"
                        // TODO: Highlight color is controlled by mark style in styles.css and not the color parameter here
                        className={props.editor!.isActive('highlight', { color: red }) ? 'is-active' : ''}
                        variant="plain">
                        <FormatColorFill />
                    </IconButton>
                </Option>
            </FlowSwitch>
        </div>
    )
}

// Add new PortalLoupe component
const PortalLoupe = (props: { editor: Editor }) => {
    const selectedNode = getSelectedNode(props.editor)
    let lens = selectedNode.attrs.lens

    return (
        <div
            style={{ display: "flex", gap: 5, height: "fit-content", alignItems: "center", overflow: "visible" }}>
            <Tag>
                Portal
            </Tag>
            {/* Lenses */}
            <FlowSwitch value={lens} isLens>
                <Option value={"identity"} onClick={() => {
                    props.editor.commands.setLens({ lens: "identity" })
                }}>
                    <motion.div>
                        Identity
                    </motion.div>
                </Option>
                <Option value={"hideUnimportantNodes"} onClick={() => {
                    props.editor.commands.setLens({ lens: "hideUnimportantNodes" })
                    logCurrentLens(props.editor)
                }}>
                    <motion.div>
                        Only show important nodes
                    </motion.div>
                </Option>
            </FlowSwitch>
        </div>
    )
}

export const FlowMenu = (props: { editor: Editor }) => {
    const elementRef = React.useRef<HTMLDivElement>(null);

    const [selectedAction, setSelectedAction] = React.useState<string>("Copy quanta id")
    const [selectedVersionHistory, setSelectedVersionHistory] = React.useState<string>("No Version Initialised")
    const [selectedDisplayLens, setSelectedDisplayLens] = React.useState<string>("linear")
    const [selectedEvaluationLens, setSelectedEvaluationLens] = React.useState<string>("evaluate")

    // If I hard code a value for the FlowSwitch associated with the maths lenses, even that doesn't change them
    // TODO: First, make sure that the font lenses are controlled

    const [selectedValue, setSelectedValue] = React.useState<string>("Arial")

    const selection = props.editor!.view.state.selection

    React.useEffect(() => {
        // Typing is wrong, selection does have node field
        // @ts-ignore
        if (selection.node) {
            // @ts-ignore
            const node = selection.node
            const lensDisplay: MathLens = node.attrs.lensDisplay
            const lensEvaluation: MathLens = node.attrs.lensEvaluation

            // Change from default dummy value to the actual lens value embedded in the node
            setSelectedDisplayLens(node.attrs.lensDisplay)
            setSelectedEvaluationLens(node.attrs.lensEvaluation)
        }

    }, [selection])

    // TODO: For some reason the FlowSwitch doesn't work properly when embedded into the BubbleMenu
    // TODO: For now, just use a normal MUI select
    const font = props.editor.getAttributes('textStyle').fontFamily;
    const fontSize = props.editor.getAttributes('textStyle').fontSize
    const justification = props.editor!.getAttributes(props.editor!.state.selection.$anchor.node().type.name).textAlign

    return (
        <BubbleMenu
            editor={props.editor}
            tippyOptions={{
                placement: "top",
            }}>
            <motion.div
                // ref={elementRef}
                style={flowMenuStyle()}
                className="flow-menu"
            >
                <ActionSwitch editor={props.editor} selectedAction={selectedAction} />
                {
                    {
                        'text': <RichTextLoupe editor={props.editor} font={font} fontSize={fontSize} justification={justification} />,
                        'paragraph': <RichTextLoupe editor={props.editor} font={font} fontSize={fontSize} justification={justification} />,
                        'group': <GroupLoupe editor={props.editor} />,
                        'portal': <PortalLoupe editor={props.editor} />,
                        'invalid': <>Uh oh, seems like the current node type is invalid, which means it's unsupported. Developer needs to support this node type.</> 
                    }[getSelectedNodeType(props.editor)]
                }
            </motion.div>
        </BubbleMenu>
    )
}

export const FlowMenuExample = () => {
    return (
        <RichTextCodeExample />
    )
}