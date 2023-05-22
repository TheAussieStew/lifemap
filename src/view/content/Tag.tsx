import { motion } from "framer-motion"
import React from "react"

export const Tag = (props: { children: any }) => {

    return (
        <motion.div
            style={
                {
                    boxSizing: "border-box",
                    width: "fit-content",
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "3px 10px 3px 10px",
                    boxShadow:
                      "0px 0.6021873017743928px 3.010936508871964px -0.9166666666666666px rgba(0, 0, 0, 0.14), 0px 2.288533303243457px 11.442666516217285px -1.8333333333333333px rgba(0, 0, 0, 0.13178), 0px 10px 50px -2.75px rgba(0, 0, 0, 0.1125)",
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                    alignContent: "center",
                    flexWrap: "nowrap",
                    gap: "5px",
                    borderRadius: "5px",
                    border: "1px solid #BBBBBB"
                  }
            }
        >
            {props.children}
        </motion.div>

    )
}

export const TypeTag = (props: { icon?: string, label: string }) => {
    return (
        <Tag>
            {props.icon && <span>
                {props.icon}
            </span>}
            <span>
                {props.label}
            </span>
        </Tag>
    )
}

export const ExampleTypeTag = () => {
    return (
        <TypeTag icon="🏘️" label="Type"/>
    )
}