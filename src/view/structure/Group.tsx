import React from 'react'
import { motion } from 'framer-motion'
import { Qi } from '../../core/Qi';

export type GroupLenses = "verticalArray";

export const Group = (props: {children: any, lens: GroupLenses}) => {

    return (
        <motion.div
            layoutId="group"
            className="group"
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
    )
}

export const GroupExample = () => {
    return (
        <Group lens={"verticalArray"}>
            <Qi qiId={'000001'} userId={''} />
        </Group>
    )
}