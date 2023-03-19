import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Qi } from '../../core/Qi';

export type GroupLenses = "verticalArray";

export const Group = (props: { children: any, lens: GroupLenses }) => {

    // TODO: Exit doesn't work
    // TODO: Fix stretchy border: https://github.com/framer/motion/issues/1249
    return (
        <AnimatePresence>
            <motion.div
                key="group"
                layoutId="group"
                className="group"
                initial={{
                    scale: 0,
                    opacity: 0,
                    originX: 0,
                    originY: 0
                }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                    scale: 0,
                    opacity: 0,
                }}
                transition={{
                    type: "ease",
                    duration: 0.4
                }}
                style={{
                    minHeight: 20,
                    borderRadius: `10px`,
                    border: `2px solid var(--Light_Grey, #dddddd)`,
                    boxShadow: `0px 0.6032302072222955px 0.6032302072222955px -1.25px rgba(0, 0, 0, 0.18), 0px 2.290210571630906px 2.290210571630906px -2.5px rgba(0, 0, 0, 0.15887), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.0625)`,
                    padding: `30px`,
                    // margin: `10px`,
                }}
            >
                {props.children}
            </motion.div>
        </AnimatePresence>
    )
}

export const GroupExample = () => {
    return (
        <Group lens={"verticalArray"}>
            <Qi qiId={'000001'} userId={''} />
        </Group>
    )
}