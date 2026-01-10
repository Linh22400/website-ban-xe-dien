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

    const dotSize = size === 'small' ? 'w-7 h-7' : 'w-9 h-9';
    // Filter out any undefined/null colors before slicing
    const validColors = (colors || []).filter(c => c && c.name);
    const displayColors = validColors.slice(0, maxDisplay);
    const remainingCount = validColors.length - maxDisplay;

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {displayColors.map((color, index) => {
                const isSelected = selectedIndex === index;
                const isHovered = hoveredIndex === index;
                const hexColor = color?.hex || '#cccccc'; // Default gray if hex is missing
                const isWhite = hexColor.toLowerCase() === '#ffffff' || hexColor.toLowerCase() === '#fff';

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
                            className={`${dotSize} rounded-full transition-all duration-200 relative ${isSelected ? 'scale-125' : 'hover:scale-110'
                                }`}
                            style={{
                                backgroundColor: hexColor,
                                boxShadow: isSelected
                                    ? `0 0 0 3px white, 0 0 0 5px ${isWhite ? '#00b8d4' : hexColor}, 0 4px 12px rgba(0,0,0,0.3)`
                                    : isWhite
                                        ? '0 0 0 2px #d0d7de, 0 2px 6px rgba(0,0,0,0.15)'
                                        : '0 0 0 2px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.2)'
                            }}
                            aria-label={`Chọn màu ${color.name}`}
                        >
                            {/* Checkmark for selected */}
                            {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className={`w-4 h-4 drop-shadow-lg ${isWhite ? 'text-gray-800' : 'text-white'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </button>

                        {/* Tooltip on hover */}
                        {isHovered && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 dark:bg-black text-white text-xs font-medium rounded-lg whitespace-nowrap shadow-xl z-10 pointer-events-none">
                                {color.name}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-black rotate-45" />
                            </div>
                        )}
                    </div>
                );
            })}

            {/* "+N more" indicator */}
            {remainingCount > 0 && (
                <div className={`${dotSize} rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center shadow-md`}>
                    <span className="text-xs font-bold text-gray-700 dark:text-white">+{remainingCount}</span>
                </div>
            )}
        </div>
    );
}
