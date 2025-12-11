'use client';

import { useState, useEffect } from 'react';

export const BlogSidebarHeading = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <h3
            className="text-lg md:text-xl font-bold mb-4 md:mb-2"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </h3>
    );
};
