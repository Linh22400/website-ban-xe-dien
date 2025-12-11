'use client';

import { useState, useEffect, ReactNode } from 'react';

// Shared hook for theme detection (exported for reuse)
export const useTheme = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return isDark;
};

// Headings
export const PageHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const isDark = useTheme();
    return <h1 className={`text-4xl md:text-5xl font-bold ${className}`} style={{ color: isDark ? '#ffffff' : '#111827' }}>{children}</h1>;
};

export const SubHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const isDark = useTheme();
    return <h2 className={`text-2xl md:text-3xl font-bold ${className}`} style={{ color: isDark ? '#ffffff' : '#111827' }}>{children}</h2>;
};

export const SectionHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const isDark = useTheme();
    return <h3 className={`text-xl font-bold ${className}`} style={{ color: isDark ? '#ffffff' : '#111827' }}>{children}</h3>;
};

// Form elements
export const FormLabel = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const isDark = useTheme();
    return <label className={`block text-sm font-bold mb-2 ${className}`} style={{ color: isDark ? '#ffffff' : '#111827' }}>{children}</label>;
};

// Form elements with full theme support (text, borders, placeholders)
export const ThemeInput = ({ className = "", hasError = false, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string; hasError?: boolean }) => {
    const isDark = useTheme();
    return (
        <input
            className={className}
            style={{
                color: isDark ? '#ffffff' : '#111827',
                borderColor: hasError ? '#ef4444' : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'),
                // Placeholder handled via ::placeholder pseudo-element
            }}
            {...props}
        />
    );
};

export const ThemeTextarea = ({ className = "", hasError = false, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string; hasError?: boolean }) => {
    const isDark = useTheme();
    return (
        <textarea
            className={className}
            style={{
                color: isDark ? '#ffffff' : '#111827',
                borderColor: hasError ? '#ef4444' : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'),
            }}
            {...props}
        />
    );
};

export const ThemeSelect = ({ className = "", hasError = false, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string; hasError?: boolean }) => {
    const isDark = useTheme();
    return (
        <select
            className={className}
            style={{
                color: isDark ? '#ffffff' : '#111827',
                borderColor: hasError ? '#ef4444' : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#d1d5db'),
            }}
            {...props}
        >
            {children}
        </select>
    );
};

// Text elements
export const ThemeText = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const isDark = useTheme();
    return <span className={className} style={{ color: isDark ? '#ffffff' : '#111827' }}>{children}</span>;
};

export const ThemeDiv = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const isDark = useTheme();
    return <div className={className} style={{ color: isDark ? '#ffffff' : '#111827' }}>{children}</div>;
};

// Links & Buttons
export const ThemeLink = ({ children, href, className = "" }: { children: ReactNode; href: string; className?: string }) => {
    const isDark = useTheme();
    return <a href={href} className={className} style={{ color: isDark ? '#ffffff' : '#111827' }}>{children}</a>;
};

export const ThemeButton = ({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; className?: string }) => {
    const isDark = useTheme();
    return <button className={className} style={{ color: isDark ? '#ffffff' : '#111827' }} {...props}>{children}</button>;
};

// Button with theme-aware hover states (for tabs, toggles, etc)
export const ThemeHoverButton = ({
    children,
    className = "",
    isActive = false,
    activeClassName = "bg-primary text-black shadow-lg",
    inactiveClassName = "text-muted-foreground",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    className?: string;
    isActive?: boolean;
    activeClassName?: string;
    inactiveClassName?: string;
}) => {
    const isDark = useTheme();

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isActive) {
            e.currentTarget.style.color = isDark ? '#ffffff' : '#111827';
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isActive) {
            e.currentTarget.style.color = '#6b7280'; // muted-foreground
        }
    };

    return (
        <button
            className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
            style={!isActive ? { color: isDark ? undefined : '#6b7280' } : undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </button>
    );
};
