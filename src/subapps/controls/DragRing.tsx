import React from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@tiptap/core';

type DragRingProps = {
    editor: Editor;
};

export const DragRing: React.FC<DragRingProps> = ({ editor }) => {
    return (
        <motion.div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '10px',
                cursor: 'grab',
                pointerEvents: 'none', // Allow interactions with underlying content
            }}
        >
            {/* Ring that captures drag events */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '10px solid rgba(128, 128, 128, 0.5)', // Adjust border width as needed
                    borderRadius: '10px',
                    boxSizing: 'border-box',
                    pointerEvents: 'auto', // Enable the ring to capture pointer events
                    transition: 'border-color 0.3s ease',
                }}
                initial={{ borderColor: 'rgba(128, 128, 128, 0.0)' }}
                whileHover={{ borderColor: 'rgba(128, 128, 128, 0.8)' }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.cursor = 'grab';
                }}
                onMouseDown={(event) => {
                    event.currentTarget.style.cursor = 'grabbing';
                }}
                onMouseUp={(event) => {
                    event.currentTarget.style.cursor = 'grab';
                }}
                contentEditable={false}
                aria-label="Drag handle"
            />
        </motion.div>
    );
};