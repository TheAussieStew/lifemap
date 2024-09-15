import { motion } from 'framer-motion'
import { Quanta } from '../../core/Quanta';
import { QuantaId } from '../../core/Model';
import React, { useMemo } from 'react'
import { absoluteWhite } from '../Theme';

export type GroupLenses = "verticalArray";

const textures = [
    'url("https://www.transparenttextures.com/patterns/groovepaper.png")',
    'url("https://www.transparenttextures.com/patterns/beige-paper.png")',
    'url("https://www.transparenttextures.com/patterns/paper.png")',
];

function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export const Group = (props: { children: any, lens: GroupLenses, quantaId?: QuantaId }) => {
    const backgroundTexture = useMemo(() => {
        if (!props.quantaId) {
            return textures[Math.floor(Math.random() * textures.length)];
        }
        const index = Math.abs(hashCode(props.quantaId)) % textures.length;
        return textures[index];
    }, [props.quantaId]);

    // TODO: Exit animation doesn't work
    // TODO: Fix stretchy border: https://github.com/framer/motion/issues/1249
    return (
        <motion.div
            key="group"
            layoutId={props.quantaId}
            className="group"
            initial={{
                opacity: 0,
            }}
            animate={{ opacity: 1 }}
            exit={{
                opacity: 0,
            }}
            transition={{
                type: "ease",
                duration: 0.4,
                delay: Math.random() / 2
            }}
            style={{
                position: "relative",
                backgroundColor: absoluteWhite,
                backgroundImage: backgroundTexture,
                minHeight: 20,
                overflow: "hidden",
                // width: "fit-content",
                borderRadius: `10px`,
                // border: `2px solid var(--Light_Grey, #dddddd)`,
                boxShadow: `0px 0.6021873017743928px 2.0474368260329356px -1px rgba(0, 0, 0, 0.29), 0px 2.288533303243457px 7.781013231027754px -2px rgba(0, 0, 0, 0.27711), 0px 10px 34px -3px rgba(0, 0, 0, 0.2)`,
                padding: `35px`,
                margin: `10px 0px 10px 0px`,
            }}
        >
            <motion.div data-drag-handle
                onMouseLeave={(event) => {
                    event.currentTarget.style.cursor = "grab";
                }}
                onMouseDown={(event) => {
                    event.currentTarget.style.cursor = "grabbing";
                }}
                onMouseUp={(event) => {
                    event.currentTarget.style.cursor = "grab";
                }}
                style={{ position: "absolute", right: -5, top: 10, display: "flex", flexDirection: "column", cursor: "grab", fontSize: "24px", color: "grey" }}
                contentEditable="false"
                suppressContentEditableWarning={true}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}>
                ⠿
            </motion.div>
            {props.children}
        </motion.div>
    )
}

export const GroupExample = () => {
    return (
        <Group lens={"verticalArray"} quantaId={"000001"}>
            <Quanta quantaId={'000001'} userId={''} />
        </Group>
    )
}