import { motion, useScroll, useVelocity } from "framer-motion"
import { ExampleTypeTag, TypeTag } from "../content/Tag"
import React from "react"
import './styles.scss'
import { clickElement } from "../../utils/utils"

export const FlowSwitch = (props: { children: React.ReactElement[] }) => {
    const flowSwitchContainerRef = React.useRef(null)
    const [realTimeSelected, setRealTimeSelected] = React.useState(0)
    const [releaseSelected, setReleaseSelected] = React.useState(0)
    const [hasBeenChanged, setHasBeenChanged] = React.useState(false)

    const tickSound = new Audio("/tick.mp3")

    let timer: NodeJS.Timeout | null = null

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
                        // TODO: This is mean to click the currently selected element, think of a better way.
                        // Basically, find the currently selected element, and invoke its onClick
                        // clickElement(flowSwitchContainerRef)
                        console.log("updated")
                    }, 150);
                }
            }

            style={{
                scrollSnapType: `y mandatory`,
                boxSizing: "border-box",
                flexShrink: 0,
                width: "fit-content",
                height: 40,
                display: "flex",
                flexDirection: "column",
                // TODO: check the safe keyword works on other browsers
                justifyContent: "center safe",
                alignItems: "center",
                padding: "5px 10px 5px 10px",
                msOverflowStyle: "none",
                scrollbarColor: "transparent transparent",
                boxShadow: "0px 0.6021873017743928px 3.010936508871964px -0.9166666666666666px rgba(0, 0, 0, 0.14), 0px 2.288533303243457px 11.442666516217285px -1.8333333333333333px rgba(0, 0, 0, 0.13178), 0px 10px 50px -2.75px rgba(0, 0, 0, 0.1125)",
                backgroundColor: "rgba(194,194,194,0.1)",
                position: "relative",
                alignContent: "start",
                flexWrap: "nowrap",
                gap: 2,
                borderRadius: 5,
                border: "1px solid #BBBBBB"
            }}>
            {
                props.children.map((child, index) => {
                    return (<motion.div
                        initial={{ opacity: 0.2, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        style={{
                            scrollSnapAlign: "none",
                        }}
                        viewport={{ root: flowSwitchContainerRef, margin: "-12px 0px -12px 0px" }}
                        onViewportEnter={(entry) => {
                            // The activation box is a thin line in the middle of the flow switch
                            // and activates when a child element enters this thin line.
                            if (hasBeenChanged) {
                                tickSound.play()
                            }
                            setHasBeenChanged(true)
                        }}
                        key={index}
                    >
                        {child}
                    </motion.div>)
                }
                )
            }
        </motion.div>
    )
}