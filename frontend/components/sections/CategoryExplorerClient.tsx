"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/api";

interface CategoryExplorerClientProps {
    categories: Category[];
}

export default function CategoryExplorerClient({ categories }: CategoryExplorerClientProps) {
    // Color presets - matching product tag colors - Darkened for Accessibility (WCAG AA)
    const COLOR_PRESETS: Record<string, string> = {
        // Motorcycle - Green (TAILG)
        'motorcycle': 'bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800',
        'blue-cyan': 'bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800',
        'green-emerald': 'bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800',

        // Bicycle - Red (Đức Duy)
        'bicycle': 'bg-gradient-to-r from-red-700 via-rose-600 to-pink-700',
        'green-light': 'bg-gradient-to-r from-red-700 via-rose-600 to-pink-700',
        'red-orange': 'bg-gradient-to-r from-red-700 via-rose-600 to-pink-700',

        // Accessories - Blue
        'accessories': 'bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-700',
        'purple-pink': 'bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-700',
        'violet-indigo': 'bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-700',

        // Fallbacks
        'orange-yellow': 'bg-gradient-to-r from-orange-600 to-yellow-600',
        'pink-rose': 'bg-gradient-to-r from-pink-600 to-rose-600',
        'teal-cyan': 'bg-gradient-to-r from-teal-600 to-cyan-600',
        'indigo-purple': 'bg-gradient-to-r from-indigo-700 to-purple-700',
        'amber-orange': 'bg-gradient-to-r from-amber-600 to-orange-600',
        'lime-green': 'bg-gradient-to-r from-lime-600 to-green-600',
        'sky-blue': 'bg-gradient-to-r from-sky-600 to-blue-700',
    };

    // Helper to get hover color class based on category
    const getHoverColorClass = (title?: string, subtitle?: string) => {
        const titleText = `${title || ''} ${subtitle || ''}`.toLowerCase();

        if (titleText.includes('máy điện') || titleText.includes('motorcycle')) {
            return 'group-hover:text-emerald-400';
        }
        if (titleText.includes('đạp điện') || titleText.includes('bicycle')) {
            return 'group-hover:text-rose-400';
        }
        if (titleText.includes('phụ kiện') || titleText.includes('accessories') || titleText.includes('accessory')) {
            return 'group-hover:text-cyan-400';
        }

        return 'group-hover:text-primary'; // fallback
    };

    // Helper to parse color format and return appropriate styling
    const getColorStyle = (colorString: string | undefined, categoryTitle?: string, categorySubtitle?: string) => {
        // Auto-detect category type from title or subtitle first
        const titleText = `${categoryTitle || ''} ${categorySubtitle || ''}`.toLowerCase();

        if (titleText.includes('máy điện') || titleText.includes('motorcycle')) {
            return {
                className: COLOR_PRESETS['motorcycle'],
                style: {}
            };
        }
        if (titleText.includes('đạp điện') || titleText.includes('bicycle')) {
            return {
                className: COLOR_PRESETS['bicycle'],
                style: {}
            };
        }
        if (titleText.includes('phụ kiện') || titleText.includes('accessories') || titleText.includes('accessory')) {
            return {
                className: COLOR_PRESETS['accessories'],
                style: {}
            };
        }

        if (!colorString) {
            return {
                className: COLOR_PRESETS['blue-cyan'],
                style: {}
            };
        }

        // Check if it's a preset key
        if (COLOR_PRESETS[colorString]) {
            return {
                className: COLOR_PRESETS[colorString],
                style: {}
            };
        }

        // Check if it's hex color format (e.g., "#FF5733, #FFC300")
        if (colorString.includes('#')) {
            const colors = colorString.split(',').map(c => c.trim());
            if (colors.length === 2) {
                return {
                    className: '',
                    style: {
                        background: `linear-gradient(to right, ${colors[0]}, ${colors[1]})`
                    }
                };
            }
        }

        // Check if it already includes gradient direction (full Tailwind format)
        if (colorString.includes('bg-gradient-to-')) {
            return {
                className: colorString,
                style: {}
            };
        }

        // Otherwise, treat as shorthand Tailwind classes (add bg-gradient-to-r)
        return {
            className: `bg-gradient-to-r ${colorString}`,
            style: {}
        };
    };

    if (categories.length === 0) return null;

    // Bento Grid Logic: Determine span for each item based on total count
    // 3 items: 1-1-1
    // 4 items: 2-1-1 (first item spans 2 cols) or 1-1-1-1
    // Let's stick to a clean grid but with distinct visual hierarchy
    
    return (
        <section className="w-full py-4 px-4 md:px-8 relative overflow-hidden">
             {/* Decorative Background Blur */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
                            <span className="text-primary font-bold uppercase tracking-wider text-xs">Danh Mục Sản Phẩm</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                            Khám Phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Bộ Sưu Tập</span>
                        </h2>
                    </div>
                    <Link
                        href="/cars"
                        className="group flex items-center gap-3 px-6 py-3 rounded-full border border-primary/20 hover:border-primary/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-primary/5"
                        aria-label="Xem tất cả danh mục"
                    >
                        <span className="font-semibold text-sm">Xem tất cả</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                <div className="flex md:grid md:grid-cols-12 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:min-h-[500px] no-scrollbar">
                    {categories.map((cat, index) => {
                        const colorStyle = getColorStyle(cat.color, cat.title, cat.subtitle);
                        
                        // Layout Logic for up to 3-4 items
                        // If 3 items: Item 0 (Motorcycle) takes 6 cols. Item 1 (Bicycle) takes 3. Item 2 (Acc) takes 3.
                        // Or Item 0 (6 cols), Item 1 (6 cols) stacked?
                        // Let's try: Item 0 (8 cols, full height), Item 1 & 2 (4 cols, half height stacked)
                        
                        let gridClass = "md:col-span-4"; // Default
                        if (categories.length >= 3) {
                            if (index === 0) gridClass = "md:col-span-6 md:row-span-2"; // Big Left
                            else gridClass = "md:col-span-3 md:row-span-2"; // Tall Right
                        }
                        
                        // Specialized layout for specific categories
                        const isMain = cat.title.toLowerCase().includes('máy điện');
                        const isSecondary = cat.title.toLowerCase().includes('đạp điện');
                        
                        if (isMain) gridClass = "md:col-span-6 md:row-span-2";
                        else if (isSecondary) gridClass = "md:col-span-3 md:row-span-2";
                        else gridClass = "md:col-span-3 md:row-span-2";

                        return (
                            <Link
                                key={cat.id}
                                href={cat.link}
                                className={`
                                    group relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl
                                    ${gridClass} min-h-[300px] md:min-h-full
                                    min-w-[85vw] md:min-w-0 snap-center shrink-0
                                `}
                            >
                                {/* Background Image with Zoom Effect */}
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Floating Content Box */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 transform translate-y-4 transition-all duration-500 group-hover:translate-y-0 group-hover:bg-white/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-lg text-xs font-bold text-white mb-2 ${colorStyle.className}`}
                                                style={colorStyle.style}
                                            >
                                                {cat.subtitle}
                                            </span>
                                            <ArrowRight className="text-white w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </div>
                                        
                                        <h3 className="text-white text-2xl md:text-3xl font-black leading-tight mb-2">
                                            {cat.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm line-clamp-2 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-300 delay-100">
                                            Khám phá các dòng {cat.title.toLowerCase()} mới nhất với công nghệ hiện đại.
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
