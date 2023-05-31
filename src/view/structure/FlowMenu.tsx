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
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import { Tag } from "../content/Tag"
import { black, highlightYellow } from "../Theme"
import FormatColorFill from "@mui/icons-material/FormatColorFill"

export const FlowMenu = (props: { editor: Editor | null }) => {
    const [isFixed, setIsFixed] = React.useState(false);
    const [top, setTop] = React.useState(0);
    const [right, setRight] = React.useState(0);
    const [bottom, setBottom] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const [value, setValue] = React.useState<string>('');


    // Make sure the menu stays within the viewport
    React.useEffect(() => {
        const handleScroll = () => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                if (rect.top < 0) {
                    // The element is about to be hidden at the top of the viewport
                    // Update its position to keep it visible
                    setIsFixed(true);
                    setTop(0);
                    setLeft(rect.left);
                } else if (rect.bottom > viewportHeight) {
                    // The element is about to be hidden at the bottom of the viewport
                    // Update its position to keep it visible
                    setIsFixed(true);
                    setTop(viewportHeight - rect.height);
                    setLeft(rect.left);
                } else if (rect.left < 0) {
                    // The element is about to be hidden on the left side of the viewport
                    // Update its position to keep it visible
                    setIsFixed(true);
                    setTop(rect.top);
                    setLeft(0);
                } else if (rect.right > viewportWidth) {
                    // The element is about to be hidden on the right side of the viewport
                    // Update its position to keep it visible
                    setIsFixed(true);
                    setTop(rect.top);
                    setLeft(viewportWidth - rect.width);
                } else {
                    // The element is still visible
                    // Reset its position
                    setIsFixed(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    React.useEffect(() => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (rect.top < 0) {
                // The element is initially rendered off-screen at the top of the viewport
                // Update its position to keep it visible
                setIsFixed(true);
                setTop(0);
                setLeft(rect.left);
            } else if (rect.bottom > viewportHeight) {
                // The element is initially rendered off-screen at the bottom of the viewport
                // Update its position to keep it visible
                setIsFixed(true);
                setTop(viewportHeight - rect.height);
                setLeft(rect.left);
            } else if (rect.left < 0) {
                // The element is initially rendered off-screen on the left side of the viewport
                // Update its position to keep it visible
                setIsFixed(true);
                setTop(rect.top);
                setLeft(0);
            } else if (rect.right > viewportWidth) {
                // The element is initially rendered off-screen on the right side of the viewport
                // Update its position to keep it visible
                setIsFixed(true);
                setTop(rect.top);
                // TODO: This is kind of hacky, there shouldn't need to be a multiplier
                setLeft(viewportWidth - 1.9 * rect.width);
            } else {
                // The element is initially rendered on-screen
                // Do nothing
            }
        }
    }, []);


    if (props.editor === null) return null;

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
            <motion.div
                ref={elementRef}
                style={{
                    position: isFixed ? "fixed" : "relative",
                    top: isFixed ? 0 : undefined,
                    left: isFixed ? left : undefined,
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
                    alignContent: "center",
                    flexWrap: "nowrap",
                    gap: "10px",
                    borderRadius: "10px",
                    border: "1px solid var(--Light_Grey, rgba(221,221,221,0.75))"
                }}>
                <Select
                    placeholder="Type"
                    startDecorator={<InfoIcon />}
                    sx={{ width: 160 }}
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
                    sx={{ width: 90 }}
                >
                    <Option value="30"
                        onClick={() => props.editor!.chain().focus().setFontSize('30px').run()}
                    >
                       30 
                    </Option>
                    <Option value="24"
                        onClick={() => props.editor!.chain().focus().setFontSize('24px').run()}
                    >
                        24
                    </Option>
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
                <Tag>
                    <IconButton
                        style={{ color: black }}
                        size="sm"
                        // @ts-ignore
                        onClick={() => props.editor!.chain().focus().toggleBold().run()}
                        className={props.editor.isActive('bold') ? 'is-active' : ''}
                        variant="plain">
                        <FormatBoldIcon />
                    </IconButton>
                    <IconButton
                        style={{ color: black }}
                        size="sm"
                        // @ts-ignore
                        onClick={() => props.editor!.chain().focus().toggleItalic().run()}
                        className={props.editor.isActive('italic') ? 'is-active' : ''}
                        variant="plain">
                        <FormatItalicIcon />
                    </IconButton>
                    <IconButton
                        style={{ color: black }}
                        size="sm"
                        // @ts-ignore
                        onClick={() => props.editor!.chain().focus().toggleUnderline().run()}
                        className={props.editor.isActive('underline') ? 'is-active' : ''}
                        variant="plain">
                        <FormatUnderlinedIcon />
                    </IconButton>
                    <IconButton
                        style={{ color: black }}
                        size="sm"
                        // @ts-ignore
                        onClick={() => props.editor!.chain().focus().toggleStrike().run()}
                        className={props.editor.isActive('strike') ? 'is-active' : ''}
                        variant="plain">
                        <FormatStrikethrough />
                    </IconButton>
                </Tag>
                <Tag>
                    <IconButton
                        style={{ color: black }}
                        size="sm"
                        // @ts-ignore
                        onClick={() => props.editor.chain().focus().setColor('#958DF1').run()}
                        className={props.editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
                        variant="plain">
                        <FormatColorTextIcon />
                    </IconButton>
                    <IconButton
                        style={{ color: black }}
                        size="sm"
                        // TODO: Highlight color is controlled by mark style in styles.css and not the color parameter here
                        onClick={() => props.editor!.chain().focus().toggleHighlight({ color: highlightYellow}).run()}
                        className={props.editor!.isActive('highlight', { color: highlightYellow }) ? 'is-active' : ''}
                        variant="plain">
                        <FormatColorFill />
                    </IconButton>
                </Tag>
            </motion.div>
        </BubbleMenu>
    )
}

export const FlowMenuExample = () => {
    return (
        <RichTextCodeExample />
    )
}