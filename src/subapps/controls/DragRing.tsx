import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@tiptap/core';

type DragRingProps = {
    editor: Editor;
};

export const DragRing: React.FC<DragRingProps> = ({ editor }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleStyle: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: 'transparent',
        cursor: 'grab',
        pointerEvents: 'auto',
    };

    const handleVariants = {
        initial: { borderColor: 'rgba(128, 128, 128, 0.0)' },
        whileHover: { borderColor: 'rgba(128, 128, 128, 0.3)' },
    };

    const onMouseEnter = () => {
        setIsHovered(true);
    };

    const onMouseLeave = () => {
        setIsHovered(false);
    };

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.style.cursor = 'grabbing';
    };

    const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.style.cursor = 'grab';
    };

    return (
        <motion.div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '10px', // Matches Group.tsx borderRadius
                overflow: 'hidden',    // Ensures handles respect borderRadius
                pointerEvents: 'none', // Allow interactions with underlying content
            }}
        >
            {/* Top Drag Handle */}
            <motion.div
                data-drag-handle="top"
                style={{
                    ...handleStyle,
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '15px', // 1.5 times the original 10px
                    borderTop: '15px solid rgba(128, 128, 128, 0.5)', // 1.5 times the original 10px
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                }}
                variants={handleVariants}
                animate={isHovered ? 'whileHover' : 'initial'}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                contentEditable={false}
                aria-label="Top drag handle"
            />

            {/* Right Drag Handle */}
            <motion.div
                data-drag-handle="right"
                style={{
                    ...handleStyle,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '15px', // 1.5 times the original 10px
                    borderRight: '15px solid rgba(128, 128, 128, 0.5)', // 1.5 times the original 10px
                    borderTop: 'none',
                    borderBottom: 'none',
                    borderLeft: 'none',
                }}
                variants={handleVariants}
                animate={isHovered ? 'whileHover' : 'initial'}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                contentEditable={false}
                aria-label="Right drag handle"
            />

            {/* Bottom Drag Handle */}
            <motion.div
                data-drag-handle="bottom"
                style={{
                    ...handleStyle,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '15px', // 1.5 times the original 10px
                    borderBottom: '15px solid rgba(128, 128, 128, 0.5)', // 1.5 times the original 10px
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                }}
                variants={handleVariants}
                animate={isHovered ? 'whileHover' : 'initial'}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                contentEditable={false}
                aria-label="Bottom drag handle"
            />

            {/* Left Drag Handle */}
            <motion.div
                data-drag-handle="left"
                style={{
                    ...handleStyle,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '15px', // 1.5 times the original 10px
                    borderLeft: '15px solid rgba(128, 128, 128, 0.5)', // 1.5 times the original 10px
                    borderTop: 'none',
                    borderBottom: 'none',
                    borderRight: 'none',
                }}
                variants={handleVariants}
                animate={isHovered ? 'whileHover' : 'initial'}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                contentEditable={false}
                aria-label="Left drag handle"
            />
        </motion.div>
    );
};