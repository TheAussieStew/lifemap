'use client'

import React from "react";
import { motion } from 'framer-motion';
import { Quanta } from "../../../src/core/Quanta";
import { offWhite } from "../../../src/view/Theme";

export default function Page({ params }: { params: { slug: string } }) {
    return (
        <>
            {/* Remove for performance reasons */}
            {/* <Minimap /> */}
            <motion.div style={{ padding: `0px 0px 40px 0px`, backgroundColor: offWhite }}>
                <Quanta quantaId={params.slug} userId={'000000'} />
            </motion.div>
        </>
    )
}