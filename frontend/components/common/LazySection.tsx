"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface LazySectionProps {
    children: React.ReactNode;
    threshold?: number;
    delay?: number;
    className?: string;
}

export default function LazySection({
    children,
    threshold = 0.1,
    delay = 0,
    className = ""
}: LazySectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        amount: threshold,
        margin: "0px 0px 1200px 0px" // Pre-load 1200px ahead
    });
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isInView) {
            // Small delay to allow main thread to breathe and prioritize LCP paint
            const timeout = setTimeout(() => {
                setShouldRender(true);
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [isInView]);

    return (
        <section ref={ref} className={className}>
            {shouldRender ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} // Reduced y-offset for less "jumpy" feel
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // smooth cubic-bezier
                >
                    {children}
                </motion.div>
            ) : (
                // Keep the layout stable with a placeholder height based on content expectations
                // This is a generic placeholder, specific height should be handled by parent/className if needed
                <div className="w-full h-24 opacity-0" aria-hidden="true" />
            )}
        </section>
    );
}
