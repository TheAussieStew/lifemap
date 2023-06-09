import { motion } from "framer-motion"
import { ExampleTypeTag } from "../content/Tag"
import React from "react"

export const FlowSwitch = (props: {}) => {

    const flowSwitchContainerRef = React.useRef(null)
    const [selected, setSelected] = React.useState(0)

    const tickSound = new Audio("/tick.mp3")
    tickSound.play()

    return (
        <motion.div ref={flowSwitchContainerRef} style={{
            boxSizing: "border-box",
            flexShrink: 0,
            width: "min-content",
            height: 40,
            display: "flex",
            flexDirection: "column",
            // TODO: check the safe keyword works on other browsers
            justifyContent: "center safe",
            padding: "5px 10px 5px 10px",
            boxShadow: "0px 0.6021873017743928px 3.010936508871964px -0.9166666666666666px rgba(0, 0, 0, 0.14), 0px 2.288533303243457px 11.442666516217285px -1.8333333333333333px rgba(0, 0, 0, 0.13178), 0px 10px 50px -2.75px rgba(0, 0, 0, 0.1125)",
            backgroundColor: "rgba(194,194,194,0.1)",
            position: "relative",
            overflow: "auto",
            alignContent: "start",
            flexWrap: "nowrap",
            gap: 4,
            borderRadius: 5,
            border: "1px solid #BBBBBB"
        }}>
            {
                [0, 1, 2, 3].map((item) => {
                    return (<motion.div
                        initial={{ opacity: 0.2, scale: 0.9}}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ root: flowSwitchContainerRef, margin: "-12px 0px -12px 0px" }}
                        onViewportEnter={(entry) => {
                            setSelected(item);
                            tickSound.play()
                            console.log("selected", item)
                        }}
                        key={item}
                    >
                        <ExampleTypeTag />
                    </motion.div>)
                }
                )
            }
        </motion.div>
    )
}