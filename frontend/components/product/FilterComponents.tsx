'use client';

import { useState, useEffect, ReactNode } from 'react';

export const FilterHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
            className={`text-sm font-bold mb-3 flex items-center gap-2 ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </h3>
    );
};

export const FilterOptionLabel = ({
    children,
    isActive = false,
    className = ""
}: {
    children: ReactNode;
    isActive?: boolean;
    className?: string;
}) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const getColor = () => {
        if (isActive) {
            return isDark ? '#ffffff' : '#111827';
        }
        return '#9ca3af'; // gray-400 for inactive
    };

    return (
        <span
            className={`text-sm transition-colors ${isActive ? 'font-medium' : ''} ${className}`}
            style={{ color: getColor() }}
        >
            {children}
        </span>
    );
};

export const QuickSuggestionTitle = ({ children }: { children: ReactNode }) => {
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
        <div
            className="text-sm font-semibold"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </div>
    );
};
