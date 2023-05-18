import { Editor } from "@tiptap/core"
import { BubbleMenu } from "@tiptap/react"
import React from "react"
import { RichTextCodeExample } from "../content/RichText"
import { motion } from "framer-motion"
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import Chip from '@mui/joy/Chip';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethrough from '@mui/icons-material/FormatStrikethrough';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCentre from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';

export const FlowMenu = (props: { editor: Editor | null }) => {
    if (props.editor === null) return null;

    const [value, setValue] = React.useState<string>('');


    const handleChange = (
        event: React.MouseEvent<Element> | React.KeyboardEvent<Element> | React.FocusEvent<Element> | null,
        newValue: string | null
    ) => {
        if (newValue) {
            setValue(newValue);
        }
        // Check which font is active in the current selection and update
        // TODO: Technically, this should be checked both on change and when the menu is initalised
        if (props.editor!.isActive('textStyle', { fontFamily: 'EB Garamond' })) {
            setValue("EB Garamond");
        } else if (props.editor!.isActive('textStyle', { fontFamily: 'Inter' })) {
            setValue("Inter")
        } else if (props.editor!.isActive('textStyle', { fontFamily: 'Arial' })) {
            setValue("Arial")
        }
    };

    return (
        <BubbleMenu editor={props.editor} tippyOptions={{ duration: 100 }}>
            <motion.div style={{
                boxSizing: "border-box",
                flexShrink: 0,
                width: "min-content",
                height: "min-content",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "5px 15px 5px 15px",
                boxShadow:
                    "0px 0.6021873017743928px 3.010936508871964px -0.9166666666666666px rgba(0, 0, 0, 0.14), 0px 2.288533303243457px 11.442666516217285px -1.8333333333333333px rgba(0, 0, 0, 0.13178), 0px 10px 50px -2.75px rgba(0, 0, 0, 0.1125)",
                backgroundColor: "#ffffff",
                overflow: "visible",
                zIndex: 1,
                position: "relative",
                alignContent: "center",
                flexWrap: "nowrap",
                gap: "10",
                borderRadius: "10px",
                border: "1px solid var(--Light_Grey, rgba(221,221,221,0.75))"
            }}>
                <Select
                    placeholder="Type"
                    startDecorator={<InfoIcon />}
                    sx={{ width: 140 }}
                    value={value} 
                    onChange={handleChange}
                >
                    <Option value="Rich Text">Rich Text</Option>
                </Select>
                <Select
                    placeholder="Font"
                    sx={{ width: 200 }}
                >
                    <Option value="EB Garamond"
                        onClick={() => props.editor!.chain().focus().setFontFamily('EB Garamond').run()}
                    >
                        EB Garamond
                    </Option>
                    <Option value="Inter"
                        onClick={() => props.editor!.chain().focus().setFontFamily('Inter').run()}
                    >
                        Inter 
                    </Option>
                    <Option value="Arial"
                        onClick={() => props.editor!.chain().focus().setFontFamily('Arial').run()}
                    >
                        Arial 
                    </Option>
                </Select>
                <Select
                    placeholder="Size"
                    sx={{ width: 60 }}
                >
                    <Option value="20"
                        onClick={() => props.editor!.chain().focus().setFontSize('20px').run()}
                    >
                        20
                    </Option>
                    <Option value="16"
                        onClick={() => props.editor!.chain().focus().setFontSize('16px').run()}
                    >
                        16
                    </Option>
                    <Option value="14"
                        onClick={() => props.editor!.chain().focus().setFontSize('14px').run()}
                    >
                        14
                    </Option>
                    <Option value="12"
                        onClick={() => props.editor!.chain().focus().setFontSize('12px').run()}
                    >
                        12
                    </Option>
                    <Option value="10"
                        onClick={() => props.editor!.chain().focus().setFontSize('10px').run()}
                    >
                        10
                    </Option>
                </Select>
                <Select
                    sx={{ width: 60 }}
                >
                    <Option value="align-left">
                        <IconButton
                            // @ts-ignore
                            onClick={() => props.editor!.chain().focus().setTextAlign('left').run()}
                            className={props.editor.isActive('bold') ? 'is-active' : ''}
                            variant="plain">
                            <FormatAlignLeft />
                        </IconButton>
                    </Option>
                    <Option value="align-centre">
                        <IconButton
                            // @ts-ignore
                            onClick={() => props.editor!.chain().focus().setTextAlign('center').run()}
                            className={props.editor.isActive('bold') ? 'is-active' : ''}
                            variant="plain">
                            <FormatAlignCentre />
                        </IconButton>
                    </Option>
                    <Option value="align-right">
                        <IconButton
                            // @ts-ignore
                            onClick={() => props.editor!.chain().focus().setTextAlign('right').run()}
                            className={props.editor.isActive('bold') ? 'is-active' : ''}
                            variant="plain">
                            <FormatAlignRight />
                        </IconButton>
                    </Option>
                    <Option value="align-justify">
                        <IconButton
                            // @ts-ignore
                            onClick={() => props.editor!.chain().focus().setTextAlign('justify').run()}
                            className={props.editor.isActive('bold') ? 'is-active' : ''}
                            variant="plain">
                            <FormatAlignJustify />
                        </IconButton>
                    </Option>
                </Select>
                <IconButton 
                    // @ts-ignore
                    onClick={() => props.editor!.chain().focus().toggleBold().run()}
                    className={props.editor.isActive('bold') ? 'is-active' : ''}
                    variant="plain">
                    <FormatBoldIcon />
                </IconButton>
                <IconButton 
                    // @ts-ignore
                    onClick={() => props.editor!.chain().focus().toggleItalic().run()}
                    className={props.editor.isActive('italic') ? 'is-active' : ''}
                    variant="plain">
                    <FormatItalicIcon />
                </IconButton>
                <IconButton 
                    // @ts-ignore
                    onClick={() => props.editor!.chain().focus().toggleUnderline().run()}
                    className={props.editor.isActive('underline') ? 'is-active' : ''}
                    variant="plain">
                    <FormatUnderlinedIcon />
                </IconButton>
                <IconButton 
                    // @ts-ignore
                    onClick={() => props.editor!.chain().focus().toggleStrike().run()}
                    className={props.editor.isActive('strike') ? 'is-active' : ''}
                    variant="plain">
                    <FormatStrikethrough />
                </IconButton>
            </motion.div>
        </BubbleMenu>
    )
}

export const FlowMenuExample = () => {
    return (
        <RichTextCodeExample />
    )
}