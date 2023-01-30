import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import MathView, { MathViewRef } from "react-math-view"

export const Math = (props: {equation: string}) => {
    const ref = React.useRef<MathViewRef>(null)
    const toggleKeyboard = useCallback(
        () => ref.current?.executeCommand("toggleVirtualKeyboard"),
        [ref]
    )

    return (
        <MathView
            style={{
                fontSize: 25,
                fontFamily: "SF Pro",
                display: "inline-block",
            }}
            value={props.equation}
            ref={ref}
        />
    )
}