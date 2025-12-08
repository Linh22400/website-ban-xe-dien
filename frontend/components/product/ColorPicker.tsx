"use client";

import { useState } from "react";

interface ColorPickerProps {
    colors: { name: string; hex: string; images: string[] }[];
    selectedIndex: number;
    onSelectColor: (index: number) => void;
    size?: 'small' | 'medium';
    maxDisplay?: number;
}

export default function ColorPicker({
    colors,
    selectedIndex,
    onSelectColor,
    size = 'medium',
    maxDisplay = 5
}: ColorPickerProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const dotSize = size === 'small' ? 'w-6 h-6' : 'w-8 h-8';
    const displayColors = colors.slice(0, maxDisplay);
    const remainingCount = colors.length - maxDisplay;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {displayColors.map((color, index) => {
                const isSelected = selectedIndex === index;
                const isHovered = hoveredIndex === index;

                return (
                    <div key={index} className="relative group">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSelectColor(index);
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`${dotSize} rounded-full border-2 transition-all duration-200 ${isSelected
                                    ? 'border-primary ring-2 ring-primary/30 scale-110 shadow-lg shadow-primary/30'
                                    : 'border-white/20 hover:border-primary/50 hover:scale-105'
                                }`}
                            style={{ backgroundColor: color.hex }}
                            aria-label={`Chọn màu ${color.name}`}
                        >
                            {/* Checkmark for selected */}
                            {isSelected && (
                                <svg
                                    className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>

                        {/* Tooltip on hover */}
                        {isHovered && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap backdrop-blur-sm z-10 pointer-events-none">
                                {color.name}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
                            </div>
                        )}
                    </div>
                );
            })}

            {/* "+N more" indicator */}
            {remainingCount > 0 && (
                <div className={`${dotSize} rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">+{remainingCount}</span>
                </div>
            )}
        </div>
    );
}
