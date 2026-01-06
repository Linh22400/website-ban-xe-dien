"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, Category } from "@/lib/api";

export default function CategoryExplorer() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Color presets - predefined gradients that work with Tailwind
    const COLOR_PRESETS: Record<string, string> = {
        'blue-cyan': 'bg-gradient-to-r from-blue-700 to-cyan-500',
        'green-emerald': 'bg-gradient-to-r from-green-600 to-emerald-400',
        'green-light': 'bg-gradient-to-r from-green-500 to-green-400',
        'purple-pink': 'bg-gradient-to-r from-purple-700 to-pink-500',
        'violet-indigo': 'bg-gradient-to-r from-violet-600 to-indigo-600',
        'orange-yellow': 'bg-gradient-to-r from-orange-500 to-yellow-400',
        'red-orange': 'bg-gradient-to-r from-red-600 to-orange-500',
        'pink-rose': 'bg-gradient-to-r from-pink-500 to-rose-400',
        'teal-cyan': 'bg-gradient-to-r from-teal-500 to-cyan-400',
        'indigo-purple': 'bg-gradient-to-r from-indigo-600 to-purple-600',
        'amber-orange': 'bg-gradient-to-r from-amber-500 to-orange-500',
        'lime-green': 'bg-gradient-to-r from-lime-500 to-green-500',
        'sky-blue': 'bg-gradient-to-r from-sky-500 to-blue-600',
    };

    // Helper to parse color format and return appropriate styling
    const getColorStyle = (colorString: string | undefined) => {
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

    if (loading) {
        return <div className="w-full py-16 px-4 md:px-8 bg-background min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
    }

    if (categories.length === 0) return null;

    return (
        <section className="w-full py-16 px-4 md:px-8 bg-background">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Khám Phá Danh Mục
                        </h2>
                        <p className="text-gray-400">
                            Tìm kiếm dòng xe phù hợp với phong cách của bạn
                        </p>
                    </div>
                    <Link
                        href="/cars"
                        className="flex items-center gap-2 font-medium transition-colors group"
                        style={{
                            color: '#00b8d4'
                        }}
                        onMouseEnter={(e) => {
                            const isDark = document.documentElement.classList.contains('dark');
                            e.currentTarget.style.color = isDark ? '#ffffff' : '#374151';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#00b8d4';
                        }}
                    >
                        Xem tất cả sản phẩm
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                        const colorStyle = getColorStyle(cat.color);
                        return (
                            <Link
                                key={cat.id}
                                href={cat.link}
                                className={`group relative h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-xl ${cat.colSpan}`}
                            >
                                {/* Background Image */}
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    style={{ willChange: 'transform' }}
                                />

                                {/* Gradient Overlay - Theme aware */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent dark:from-black/90 dark:via-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-foreground dark:text-white mb-3 shadow-lg ${colorStyle.className}`}
                                            style={colorStyle.style}
                                        >
                                            {cat.subtitle}
                                        </span>
                                        <h3 className="text-foreground dark:text-white text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {cat.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            Khám phá ngay <ArrowRight className="w-4 h-4" />
                                        </div>
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
