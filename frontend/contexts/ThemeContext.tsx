"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system'); // Default to system to avoid flash
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);
    const debug = process.env.NODE_ENV !== 'production';

    // Initialize theme from localStorage
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as Theme;
        if (debug) console.log('Stored theme:', stored);
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
            setThemeState(stored);
        }
    }, []);

    // Apply theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (debug) console.log('Current theme state:', theme);

        let effectiveTheme: 'light' | 'dark';

        if (theme === 'system') {
            // Detect system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            effectiveTheme = systemPrefersDark ? 'dark' : 'light';
            if (debug) console.log('System preference:', effectiveTheme);
        } else {
            effectiveTheme = theme;
        }

        if (debug) console.log('Applying theme:', effectiveTheme);

        // Apply theme class
        root.classList.remove('light', 'dark');
        root.classList.add(effectiveTheme);

        if (debug) console.log('HTML classes:', root.className);

        setResolvedTheme(effectiveTheme);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const newTheme = mediaQuery.matches ? 'dark' : 'light';
                root.classList.remove('light', 'dark');
                root.classList.add(newTheme);
                setResolvedTheme(newTheme);
                if (debug) console.log('System theme changed to:', newTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
