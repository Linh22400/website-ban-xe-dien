'use client';

import { useState, useEffect, ReactNode } from 'react';

export const ProductHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
            className={`text-5xl md:text-7xl font-black tracking-tight leading-tight ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </h1>
    );
};

export const SectionHeading = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
        <h2
            className={`text-3xl md:text-4xl font-bold ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </h2>
    );
};

export const FeatureTitle = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
            className={`text-xl font-bold ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </h3>
    );
};

export const StatValue = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
            className={`text-3xl md:text-4xl font-bold ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </div>
    );
};

export const SpecValue = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
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
            className={`font-semibold ${className}`}
            style={{ color: isDark ? '#ffffff' : '#111827' }}
        >
            {children}
        </div>
    );
};
