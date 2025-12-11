"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
    Bike,
    Zap,
    DollarSign,
    Gauge,
    Battery,
    TrendingUp,
    GraduationCap,
    Wallet,
    ChevronDown,
    Check
} from "lucide-react";
import { FilterHeading, FilterOptionLabel, QuickSuggestionTitle } from './FilterComponents';

interface FilterSection {
    id: string;
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
}

export default function ProductFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [type, setType] = useState(searchParams.get("type") || "");
    const [brand, setBrand] = useState(searchParams.get("brand") || "");
    const [priceRange, setPriceRange] = useState(searchParams.get("priceRange") || "");
    const [range, setRange] = useState(searchParams.get("range") || "");
    const [speed, setSpeed] = useState(searchParams.get("speed") || "");

    // Collapsible sections state
    const [sections, setSections] = useState<FilterSection[]>([
        { id: "type", title: "Loại Xe", icon: <Bike className="w-4 h-4" />, isOpen: true },
        { id: "brand", title: "Thương Hiệu", icon: <Zap className="w-4 h-4" />, isOpen: true },
        { id: "price", title: "Mức Giá", icon: <DollarSign className="w-4 h-4" />, isOpen: true },
        { id: "range", title: "Quãng Đường", icon: <Battery className="w-4 h-4" />, isOpen: false },
        { id: "speed", title: "Tốc Độ", icon: <Gauge className="w-4 h-4" />, isOpen: false },
    ]);

    useEffect(() => {
        setType(searchParams.get("type") || "");
        setBrand(searchParams.get("brand") || "");
        setPriceRange(searchParams.get("priceRange") || "");
        setRange(searchParams.get("range") || "");
        setSpeed(searchParams.get("speed") || "");
    }, [searchParams]);

    const toggleSection = useCallback((id: string) => {
        setSections(prev => prev.map(section =>
            section.id === id ? { ...section, isOpen: !section.isOpen } : section
        ));
    }, []);

    const applyFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/cars?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const applyQuickTag = useCallback((tag: string) => {
        const params = new URLSearchParams();
        if (tag === "student") {
            params.append("minPrice", "20000000");
            params.append("priceRange", "20000000-100000000");
            params.append("type", "bicycle");
        } else if (tag === "bestseller") {
            params.append("sort", "sold:desc");
        } else if (tag === "cheap") {
            params.append("maxPrice", "15000000");
            params.append("priceRange", "0-15000000");
        }
        router.push(`/cars?${params.toString()}`, { scroll: false });
    }, [router]);

    return (
        <div className="space-y-6">
            {/* Quick Suggestions */}
            <div>
                <FilterHeading>
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Gợi ý nhanh
                </FilterHeading>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => applyQuickTag("bestseller")}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/40 text-left transition-all hover:shadow-lg hover:shadow-orange-500/10"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                            <TrendingUp className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <QuickSuggestionTitle>Xe bán chạy</QuickSuggestionTitle>
                            <div className="text-xs text-gray-400">Được nhiều người chọn</div>
                        </div>
                    </button>

                    <button
                        onClick={() => applyQuickTag("student")}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 text-left transition-all hover:shadow-lg hover:shadow-blue-500/10"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                            <GraduationCap className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <QuickSuggestionTitle>Dành cho học sinh</QuickSuggestionTitle>
                            <div className="text-xs text-gray-400">Xe đạp điện giá tốt</div>
                        </div>
                    </button>

                    <button
                        onClick={() => applyQuickTag("cheap")}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 text-left transition-all hover:shadow-lg hover:shadow-green-500/10"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                            <Wallet className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                            <QuickSuggestionTitle>Dưới 15 triệu</QuickSuggestionTitle>
                            <div className="text-xs text-gray-400">Giá phải chăng</div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="h-px bg-white/10"></div>

            {/* Type Filter */}
            <div>
                <button
                    onClick={() => toggleSection("type")}
                    className="w-full flex items-center justify-between mb-3 group"
                >
                    <FilterHeading>
                        {sections.find(s => s.id === "type")?.icon}
                        {sections.find(s => s.id === "type")?.title}
                    </FilterHeading>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sections.find(s => s.id === "type")?.isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${sections.find(s => s.id === "type")?.isOpen
                    ? 'grid-rows-[1fr] opacity-100 mt-3'
                    : 'grid-rows-[0fr] opacity-0'
                    }`}>
                    <div className="overflow-hidden">
                        <div className="space-y-2">
                            {[
                                { label: "Tất cả", value: "" },
                                { label: "Xe Đạp Điện", value: "bicycle" },
                                { label: "Xe Máy Điện", value: "motorcycle" }
                            ].map((item) => (
                                <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${type === item.value
                                        ? "border-primary bg-primary shadow-lg shadow-primary/30"
                                        : "border-gray-600 group-hover:border-primary/50"
                                        }`}>
                                        {type === item.value && <div className="w-2 h-2 bg-black rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="type"
                                        className="hidden"
                                        checked={type === item.value}
                                        onChange={() => applyFilter("type", item.value)}
                                    />
                                    <FilterOptionLabel isActive={type === item.value}>
                                        {item.label}
                                    </FilterOptionLabel>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="h-px bg-white/10"></div>

                {/* Brand Filter */}
                <div>
                    <button
                        onClick={() => toggleSection("brand")}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <FilterHeading>
                            {sections.find(s => s.id === "brand")?.icon}
                            {sections.find(s => s.id === "brand")?.title}
                        </FilterHeading>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sections.find(s => s.id === "brand")?.isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${sections.find(s => s.id === "brand")?.isOpen
                        ? 'grid-rows-[1fr] opacity-100 mt-3'
                        : 'grid-rows-[0fr] opacity-0'
                        }`}>
                        <div className="overflow-hidden">
                            <div className="space-y-2">
                                {[
                                    { label: "Tất cả", value: "" },
                                    { label: "VinFast", value: "VinFast" },
                                    { label: "Yadea", value: "Yadea" },
                                    { label: "Pega", value: "Pega" },
                                    { label: "Dibao", value: "Dibao" },
                                    { label: "Dat Bike", value: "Dat Bike" },
                                    { label: "Giant", value: "Giant" }
                                ].map((item) => (
                                    <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${brand === item.value
                                            ? "border-primary bg-primary shadow-lg shadow-primary/30"
                                            : "border-gray-600 group-hover:border-primary/50"
                                            }`}>
                                            {brand === item.value && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={brand === item.value}
                                            onChange={() => applyFilter("brand", brand === item.value ? "" : item.value)}
                                            className="hidden"
                                        />
                                        <FilterOptionLabel isActive={brand === item.value}>
                                            {item.label}
                                        </FilterOptionLabel>
                                    </label>
                                ))}
                            </div>

                        </div>

                        <div className="h-px bg-white/10"></div>

                        {/* Price Filter */}
                        <div>
                            <button
                                onClick={() => toggleSection("price")}
                                className="w-full flex items-center justify-between mb-3 group"
                            >
                                <FilterHeading>
                                    {sections.find(s => s.id === "price")?.icon}
                                    {sections.find(s => s.id === "price")?.title}
                                </FilterHeading>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sections.find(s => s.id === "price")?.isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`grid transition-all duration-300 ease-in-out ${sections.find(s => s.id === "price")?.isOpen
                                ? 'grid-rows-[1fr] opacity-100 mt-3'
                                : 'grid-rows-[0fr] opacity-0'
                                }`}>
                                <div className="overflow-hidden">
                                    <div className="space-y-2">
                                        {[
                                            { label: "Tất cả", value: "" },
                                            { label: "Dưới 10 triệu", value: "0-10000000" },
                                            { label: "10 - 20 triệu", value: "10000000-20000000" },
                                            { label: "Trên 20 triệu", value: "20000000-100000000" }
                                        ].map((item) => (
                                            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${priceRange === item.value
                                                    ? "border-primary bg-primary shadow-lg shadow-primary/30"
                                                    : "border-gray-600 group-hover:border-primary/50"
                                                    }`}>
                                                    {priceRange === item.value && <div className="w-2 h-2 bg-black rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="price"
                                                    checked={priceRange === item.value}
                                                    onChange={() => {
                                                        const params = new URLSearchParams(searchParams.toString());
                                                        if (item.value) {
                                                            const [min, max] = item.value.split('-');
                                                            params.set("minPrice", min);
                                                            params.set("maxPrice", max);
                                                            params.set("priceRange", item.value);
                                                        } else {
                                                            params.delete("minPrice");
                                                            params.delete("maxPrice");
                                                            params.delete("priceRange");
                                                        }
                                                        params.delete("page");
                                                        router.push(`/cars?${params.toString()}`, { scroll: false });
                                                    }}
                                                    className="hidden"
                                                />
                                                <FilterOptionLabel isActive={priceRange === item.value}>
                                                    {item.label}
                                                </FilterOptionLabel>
                                            </label>
                                        ))}
                                    </div>

                                </div>

                                <div className="h-px bg-white/10"></div>

                                {/* Range Filter */}
                                <div>
                                    <button
                                        onClick={() => toggleSection("range")}
                                        className="w-full flex items-center justify-between mb-3 group"
                                    >
                                        <FilterHeading>
                                            {sections.find(s => s.id === "range")?.icon}
                                            {sections.find(s => s.id === "range")?.title}
                                        </FilterHeading>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sections.find(s => s.id === "range")?.isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`grid transition-all duration-300 ease-in-out ${sections.find(s => s.id === "range")?.isOpen
                                        ? 'grid-rows-[1fr] opacity-100 mt-3'
                                        : 'grid-rows-[0fr] opacity-0'
                                        }`}>
                                        <div className="overflow-hidden">
                                            <div className="space-y-2">
                                                {[
                                                    { label: "Tất cả", value: "" },
                                                    { label: "Dưới 50 km", value: "0-50" },
                                                    { label: "50 - 80 km", value: "50-80" },
                                                    { label: "Trên 80 km", value: "80-500" }
                                                ].map((item) => (
                                                    <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${range === item.value
                                                            ? "border-primary bg-primary shadow-lg shadow-primary/30"
                                                            : "border-gray-600 group-hover:border-primary/50"
                                                            }`}>
                                                            {range === item.value && <div className="w-2 h-2 bg-black rounded-full" />}
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="range"
                                                            checked={range === item.value}
                                                            onChange={() => {
                                                                const params = new URLSearchParams(searchParams.toString());
                                                                if (item.value) {
                                                                    const [min, max] = item.value.split('-');
                                                                    params.set("minRange", min);
                                                                    params.set("maxRange", max);
                                                                    params.set("range", item.value);
                                                                } else {
                                                                    params.delete("minRange");
                                                                    params.delete("maxRange");
                                                                    params.delete("range");
                                                                }
                                                                params.delete("page");
                                                                router.push(`/cars?${params.toString()}`, { scroll: false });
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <FilterOptionLabel isActive={range === item.value}>
                                                            {item.label}
                                                        </FilterOptionLabel>
                                                    </label>
                                                ))}
                                            </div>

                                        </div>

                                        <div className="h-px bg-white/10"></div>

                                        {/* Speed Filter */}
                                        <div>
                                            <button
                                                onClick={() => toggleSection("speed")}
                                                className="w-full flex items-center justify-between mb-3 group"
                                            >
                                                <FilterHeading>
                                                    {sections.find(s => s.id === "speed")?.icon}
                                                    {sections.find(s => s.id === "speed")?.title}
                                                </FilterHeading>
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sections.find(s => s.id === "speed")?.isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div className={`grid transition-all duration-300 ease-in-out ${sections.find(s => s.id === "speed")?.isOpen
                                                ? 'grid-rows-[1fr] opacity-100 mt-3'
                                                : 'grid-rows-[0fr] opacity-0'
                                                }`}>
                                                <div className="overflow-hidden">
                                                    <div className="space-y-2">
                                                        {[
                                                            { label: "Tất cả", value: "" },
                                                            { label: "Dưới 40 km/h", value: "0-40" },
                                                            { label: "40 - 60 km/h", value: "40-60" },
                                                            { label: "Trên 60 km/h", value: "60-200" }
                                                        ].map((item) => (
                                                            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                                                                <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${speed === item.value
                                                                    ? "border-primary bg-primary shadow-lg shadow-primary/30"
                                                                    : "border-gray-600 group-hover:border-primary/50"
                                                                    }`}>
                                                                    {speed === item.value && <div className="w-2 h-2 bg-black rounded-full" />}
                                                                </div>
                                                                <input
                                                                    type="radio"
                                                                    name="speed"
                                                                    checked={speed === item.value}
                                                                    onChange={() => {
                                                                        const params = new URLSearchParams(searchParams.toString());
                                                                        if (item.value) {
                                                                            const [min, max] = item.value.split('-');
                                                                            params.set("minSpeed", min);
                                                                            params.set("maxSpeed", max);
                                                                            params.set("speed", item.value);
                                                                        } else {
                                                                            params.delete("minSpeed");
                                                                            params.delete("maxSpeed");
                                                                            params.delete("speed");
                                                                        }
                                                                        params.delete("page");
                                                                        router.push(`/cars?${params.toString()}`, { scroll: false });
                                                                    }}
                                                                    className="hidden"
                                                                />
                                                                <FilterOptionLabel isActive={speed === item.value}>
                                                                    {item.label}
                                                                </FilterOptionLabel>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
