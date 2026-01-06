'use client';

import { useState, useEffect, ReactNode } from 'react';

export const WishlistHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
        <h1
            className={`text-3xl font-bold mb-4 ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </h1>
    );
};

export const ProductName = ({ children, href, className = "" }: { children: ReactNode; href: string; className?: string }) => {
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
        <a
            href={href}
            className={`text-lg font-bold hover:text-primary transition-colors line-clamp-2 mb-2 block ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </a>
    );
};

export const ViewButton = ({ href, children }: { href: string; children: ReactNode }) => {
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
        <a
            href={href}
            className="px-4 py-3 border-2 border-white/10 font-semibold rounded-full hover:border-primary hover:text-primary transition-colors"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </a>
    );
};
