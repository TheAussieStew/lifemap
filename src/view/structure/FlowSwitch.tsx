import { motion } from "framer-motion"
import { ExampleTypeTag } from "../content/Tag"
import React from "react"

export const FlowSwitch = (props: {}) => {
    return (
        <motion.div style={{
            boxSizing: "border-box",
            flexShrink: 0,
            width: "min-content",
            height: 36,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px 10px 5px 10px",
            boxShadow: "0px 0.6021873017743928px 3.010936508871964px -0.9166666666666666px rgba(0, 0, 0, 0.14), 0px 2.288533303243457px 11.442666516217285px -1.8333333333333333px rgba(0, 0, 0, 0.13178), 0px 10px 50px -2.75px rgba(0, 0, 0, 0.1125)",
            backgroundColor: "rgba(194,194,194,0.1)",
            overflow: "auto",
            position: "relative",
            alignContent: "center",
            flexWrap: "nowrap",
            gap: 4,
            borderRadius: 5,
            border: "1px solid #BBBBBB"
        }}>
            <div>
                <ExampleTypeTag />
            </div>
            <div>
                <ExampleTypeTag />
            </div>
            <div>
                <ExampleTypeTag />
            </div>
        </motion.div>
    )
}