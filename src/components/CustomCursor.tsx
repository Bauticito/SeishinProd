import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 200 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('button, a, .card, input, select');
            setIsHovering(!!isInteractive);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, [cursorX, cursorY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
            {/* Main Cursor Dot */}
            <motion.div
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    left: -4,
                    top: -4,
                }}
                className="w-2 h-2 bg-[#E31E24] rounded-full fixed pointer-events-none"
            />

            {/* Outer Glow Ring */}
            <motion.div
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    left: -20,
                    top: -20,
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    borderWidth: isHovering ? '1px' : '2px',
                    opacity: isHovering ? 0.3 : 0.6,
                }}
                className="w-10 h-10 border border-[#E31E24] rounded-full fixed pointer-events-none flex items-center justify-center transition-colors duration-300"
            >
                <motion.div
                    animate={{ scale: isHovering ? 0.8 : 0 }}
                    className="w-1 h-1 bg-[#E31E24] rounded-full"
                />
            </motion.div>

            {/* Trailing Tech Lines (Subtle) */}
            <motion.div
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    left: -30,
                    top: -30,
                }}
                animate={{
                    rotate: isHovering ? 90 : 0,
                    scale: isHovering ? 0.8 : 1,
                    opacity: isHovering ? 0.2 : 0,
                }}
                className="w-15 h-15 border border-dashed border-[#E31E24]/30 rounded-full fixed pointer-events-none"
            />
        </div>
    );
}
