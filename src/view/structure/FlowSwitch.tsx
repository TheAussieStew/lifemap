import { motion } from "framer-motion"
import React from "react"
import './styles.scss'

export const FlowSwitch = (props: { children: React.ReactElement[], value: string, onChange?: (selectedIndex: number) => void, isLens?: boolean }) => {
    const flowSwitchContainerRef = React.useRef<HTMLDivElement>(null)
    const [realTimeSelected, setRealTimeSelected] = React.useState<number>(0)
    const [releaseSelected, setReleaseSelected] = React.useState<number>(0)
    const [hasBeenChanged, setHasBeenChanged] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const tickSound = new Audio("/tick.mp3");
    let timer: NodeJS.Timeout | null = null;
    const refs = props.children.map(() => React.createRef<HTMLDivElement>());

    React.useEffect(() => {
        // Scroll to the element with the key === props.value
        const index = props.children.findIndex(child => (child.props.value === props.value))

        console.log("index", index)
        if (index !== -1 && refs[index].current) {
            console.log("scrolling to", refs[index].current)
            // Find the element
            refs[index].current?.scrollIntoView({ behavior: 'smooth' });

            // Scroll to the element
            const container = flowSwitchContainerRef.current;
            const element = refs[index].current;

            if (container && element) {
                const containerRect = container.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();

                const scrollTop = elementRect.top - containerRect.top - (containerRect.height / 2) + (elementRect.height / 2);

                container.scrollTo({
                    top: scrollTop,
                    left: 0,
                    behavior: 'smooth'
                });
            }

        }

    }, [props.value, refs])

    const switchElements = props.children.map((child, index) => {
        return (<motion.div
            // @ts-ignore
            ref={refs[index]}
            initial={{ opacity: 0.2, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            onClick={() => {
                if (typeof child.props.onClick === 'function') {
                    child.props.onClick()
                }
            }
            }
            style={{
                // TODO: Change this eventually
                scrollSnapAlign: "none",
                width: "fit-content"
            }}
            viewport={{ root: flowSwitchContainerRef, margin: "-12px 0px -12px 0px" }}
            onViewportEnter={(entry) => {
                // The activation box is a thin line in the middle of the flow switch
                // and activates when a child element enters this thin line.
                if (hasBeenChanged) {
                    // TODO: Find a way to play sound even when the page hasn't been interacted with
                    tickSound.play().catch(function (error) {
                        console.log("Chrome cannot play sound without user interaction first")
                    });
                } else {
                    setHasBeenChanged(true)
                }
                setSelectedIndex(index)
            }}
            key={index}
        >
            {child}
        </motion.div>)
    }
    )

    // Eventually use this scrollend event instead of a scroll timeout when more browsers support it
    // React.useEffect(() => {
    //     const node = flowSwitchContainerRef.current;
    //     if (node) {
    //       node.addEventListener('scrollend', handleScrollEnded);
    //     }
    
    //     return () => {
    //       if (node) {
    //         node.removeEventListener('scrollend', handleScrollEnded);
    //       }
    //     };
    //   }, []);

    return (
        <motion.div className="flow-menu"
            ref={flowSwitchContainerRef}
            onScroll={
                // TODO: In future, see if this can be replaced by onScrollEnd
                () => {
                    if (timer !== null) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        setReleaseSelected(realTimeSelected)
                        if (props.onChange) {
                            props.onChange(releaseSelected);
                        }
                        // TODO: This is mean to click the currently selected element, think of a better way.
                        // Basically, find the currently selected element, and invoke its onClick
                        switchElements[selectedIndex].props.onClick()
                    }, 550);
                }
            }

            style={{
                scrollSnapType: `y mandatory`,
                boxSizing: "border-box",
                flexShrink: 0,
                width: "fit-content",
                maxWidth: 500,
                height: 37,
                display: "flex",
                flexDirection: "column",
                // TODO: check the safe keyword works on other browsers
                justifyContent: "center safe",
                alignItems: "center",
                color: props.isLens ? "#333333": "#222222",
                padding: "5px 10px 5px 10px",
                msOverflowStyle: "none",
                overflow: "auto",
                scrollbarColor: "transparent transparent",
                boxShadow: "0px 0.6021873017743928px 3.010936508871964px -0.9166666666666666px rgba(0, 0, 0, 0.14), 0px 2.288533303243457px 11.442666516217285px -1.8333333333333333px rgba(0, 0, 0, 0.13178), 0px 10px 50px -2.75px rgba(0, 0, 0, 0.1125)",
                backgroundColor: props.isLens ? "rgba(217, 217, 217, 0.22)" : "rgba(250, 250, 250, 0.95)",
                backdropFilter: props.isLens ? `blur(3px)` : ``,
                position: "relative",
                alignContent: "start",
                flexWrap: "nowrap",
                gap: 3,
                borderRadius: 5,
                border: "1px solid #BBBBBB"
            }}>
            {switchElements}
        </motion.div>
    )
}

export const Option = (props: { value: string, onClick?: () => void, children: React.ReactElement }) => {
    return (
        <>
            {props.children}
        </>
    )
}

export const FlowSwitchExample = () => {
    const [selectedValue, setSelectedValue] = React.useState<string>("Inter")

    return (
        <FlowSwitch value={selectedValue} isLens>
            <Option value={"EB Garamond"}>
                <motion.div onClick={() => { }}>
                    <span style={{ fontFamily: 'EB Garamond' }}>
                        EB Garamond
                    </span>
                </motion.div>
            </Option>
            <Option value={"Inter"}>
                <motion.div onClick={() => { }}>
                    <span style={{ fontFamily: 'Inter' }}>
                        Inter
                    </span>
                </motion.div>
            </Option>
            <Option value={"Arial"}>
                <span style={{ fontFamily: 'Arial' }}>
                    Arial
                </span>
            </Option>
        </FlowSwitch>
    )
}