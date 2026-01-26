"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/common/ThemeText";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    icon?: React.ReactNode;
}

export default function CustomSelect({ value, onChange, options, placeholder, icon }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isDark = useTheme();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Select Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border-2 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-colors duration-300 cursor-pointer shadow-lg flex items-center justify-between"
                style={{
                    willChange: 'border-color',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderColor: isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(0, 0, 0, 0.15)',
                    color: isDark ? '#ffffff' : '#111827'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.borderColor = isDark ? 'rgb(75, 85, 99)' : 'rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(0, 0, 0, 0.15)';
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#10B981';
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                }}
            >
                <span className="flex items-center gap-2 flex-1 min-w-0">
                    {icon}
                    <span className="truncate">
                        {selectedOption?.label || placeholder || "Chọn..."}
                    </span>
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown List with Animation - Optimized */}
            <div
                className={`absolute z-[9999] w-full mt-2 rounded-xl overflow-hidden transition-all duration-200 origin-top ${isOpen
                        ? 'opacity-100 scale-y-100 translate-y-0'
                        : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
                    }`}
                style={{
                    willChange: isOpen ? 'opacity, transform' : 'auto'
                }}
            >
                <div
                    className="bg-card border rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
                    style={{
                        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                        borderColor: isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(0, 0, 0, 0.2)',
                        boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                        willChange: 'scroll-position'
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors duration-200`}
                            style={{
                                backgroundColor: value === option.value
                                    ? '#10B981'
                                    : (isDark ? 'transparent' : 'transparent'),
                                color: value === option.value
                                    ? '#ffffff'
                                    : (isDark ? '#ffffff' : '#111827')
                            }}
                            onMouseEnter={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (value !== option.value) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
