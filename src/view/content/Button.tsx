import { motion } from "framer-motion"
import React from "react"

export const Button = (props: { text: string, onClick: () => {}, className?: string | undefined }) => {
    // Do something

    return (
        <motion.div
            onClick={props.onClick}
            style={
                {
                    borderRadius: `5px`,
                    border: `1px solid #BBBBBB`,
                    display: "grid",
                    placeItems: `center`,
                    width: "100%"
                }
            }
        >
            {props.text}
        </motion.div>

    )
}