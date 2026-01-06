"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme, mounted } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { value: 'light' as const, icon: Sun, label: 'Sáng' },
        { value: 'dark' as const, icon: Moon, label: 'Tối' },
        { value: 'system' as const, icon: Monitor, label: 'Hệ thống' },
    ];

    const currentTheme = themes.find(t => t.value === theme) || themes[2];
    const CurrentIcon = currentTheme.icon;

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="relative">
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Monitor className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-full bg-card border border-border hover:border-primary/50 transition-colors duration-300 group"
                aria-label="Toggle theme"
            >
                <CurrentIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />

                {/* Glow effect on hover */}
                {/* Removed blur glow for performance */}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {themes.map((t) => {
                            const Icon = t.icon;
                            const isActive = t.value === theme;

                            return (
                                <button
                                    key={t.value}
                                    onClick={() => {
                                        setTheme(t.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{t.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                                    )}
                                </button>
                            );
                        })}

                        {/* Current resolved theme indicator */}
                        <div className="px-4 py-2 bg-muted/50 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                                Hiện tại: <span className="text-foreground font-medium">
                                    {resolvedTheme === 'dark' ? 'Tối' : 'Sáng'}
                                </span>
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
