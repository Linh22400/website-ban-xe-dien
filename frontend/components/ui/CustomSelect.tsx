"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

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
                className="w-full bg-white/5 backdrop-blur-sm border-2 border-gray-700/50 hover:border-gray-600 focus:border-primary focus:bg-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none transition-all duration-300 cursor-pointer hover:bg-white/10 shadow-lg flex items-center justify-between"
            >
                <span className="flex items-center gap-2">
                    {icon}
                    {selectedOption?.label || placeholder || "Chọn..."}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown List with Animation - HIGH Z-INDEX */}
            <div
                className={`absolute z-[9999] w-full mt-2 rounded-xl overflow-hidden transition-all duration-300 origin-top ${isOpen
                        ? 'opacity-100 scale-y-100 translate-y-0'
                        : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                    }`}
            >
                <div className="bg-black/70 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${value === option.value
                                    ? 'bg-primary text-black'
                                    : 'text-white hover:bg-white/10'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
