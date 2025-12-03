"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [type, setType] = useState(searchParams.get("type") || "");
    const [brand, setBrand] = useState(searchParams.get("brand") || "");
    const [priceRange, setPriceRange] = useState(searchParams.get("priceRange") || "");
    const [range, setRange] = useState(searchParams.get("range") || "");
    const [speed, setSpeed] = useState(searchParams.get("speed") || "");

    useEffect(() => {
        // Sync state with URL params on navigation
        setType(searchParams.get("type") || "");
        setBrand(searchParams.get("brand") || "");
        setPriceRange(searchParams.get("priceRange") || "");
        setRange(searchParams.get("range") || "");
        setSpeed(searchParams.get("speed") || "");
    }, [searchParams]);

    const applyFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset page when filtering
        params.delete("page");

        router.push(`/cars?${params.toString()}`);
    };

    const applyQuickTag = (tag: string) => {
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
        router.push(`/cars?${params.toString()}`);
    };

    return (
        <div className="space-y-8">
            {/* Quick Suggestions */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Gợi ý nhanh</h3>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => applyQuickTag("bestseller")} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white hover:bg-primary hover:text-black hover:border-primary transition-all">
                        🔥 Xe bán chạy
                    </button>
                    <button onClick={() => applyQuickTag("student")} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white hover:bg-primary hover:text-black hover:border-primary transition-all">
                        🎓 Học sinh
                    </button>
                    <button onClick={() => applyQuickTag("cheap")} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white hover:bg-primary hover:text-black hover:border-primary transition-all">
                        💰 Dưới 15tr
                    </button>
                </div>
            </div>

            {/* Type Filter */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Loại Xe</h3>
                <div className="space-y-3">
                    {[
                        { label: "Tất cả", value: "" },
                        { label: "Xe Đạp Điện", value: "bicycle" },
                        { label: "Xe Máy Điện", value: "motorcycle" }
                    ].map((item) => (
                        <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${type === item.value ? "border-primary bg-primary" : "border-gray-600 group-hover:border-primary"}`}>
                                {type === item.value && <div className="w-2 h-2 bg-black rounded-full" />}
                            </div>
                            <input
                                type="radio"
                                name="type"
                                className="hidden"
                                checked={type === item.value}
                                onChange={() => applyFilter("type", item.value)}
                            />
                            <span className={`text-sm ${type === item.value ? "text-white font-medium" : "text-gray-400 group-hover:text-white"}`}>
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brand Filter */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Thương Hiệu</h3>
                <div className="space-y-3">
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
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${brand === item.value ? "border-primary bg-primary" : "border-gray-600 group-hover:border-primary"}`}>
                                {brand === item.value && (
                                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                checked={brand === item.value}
                                onChange={() => applyFilter("brand", brand === item.value ? "" : item.value)}
                                className="hidden"
                            />
                            <span className={`text-sm ${brand === item.value ? "text-white font-medium" : "text-gray-400 group-hover:text-white"}`}>
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Mức Giá</h3>
                <div className="space-y-3">
                    {[
                        { label: "Tất cả", value: "" },
                        { label: "Dưới 10 triệu", value: "0-10000000" },
                        { label: "10 - 20 triệu", value: "10000000-20000000" },
                        { label: "Trên 20 triệu", value: "20000000-100000000" }
                    ].map((item) => (
                        <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${priceRange === item.value ? "border-primary bg-primary" : "border-gray-600 group-hover:border-primary"}`}>
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
                                    router.push(`/cars?${params.toString()}`);
                                }}
                                className="hidden"
                            />
                            <span className={`text-sm ${priceRange === item.value ? "text-white font-medium" : "text-gray-400 group-hover:text-white"}`}>
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Range Filter */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Quãng Đường</h3>
                <div className="space-y-3">
                    {[
                        { label: "Tất cả", value: "" },
                        { label: "Dưới 50 km", value: "0-50" },
                        { label: "50 - 80 km", value: "50-80" },
                        { label: "Trên 80 km", value: "80-500" }
                    ].map((item) => (
                        <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${range === item.value ? "border-primary bg-primary" : "border-gray-600 group-hover:border-primary"}`}>
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
                                    router.push(`/cars?${params.toString()}`);
                                }}
                                className="hidden"
                            />
                            <span className={`text-sm ${range === item.value ? "text-white font-medium" : "text-gray-400 group-hover:text-white"}`}>
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Speed Filter */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Tốc Độ Tối Đa</h3>
                <div className="space-y-3">
                    {[
                        { label: "Tất cả", value: "" },
                        { label: "Dưới 40 km/h", value: "0-40" },
                        { label: "40 - 60 km/h", value: "40-60" },
                        { label: "Trên 60 km/h", value: "60-200" }
                    ].map((item) => (
                        <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${speed === item.value ? "border-primary bg-primary" : "border-gray-600 group-hover:border-primary"}`}>
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
                                    router.push(`/cars?${params.toString()}`);
                                }}
                                className="hidden"
                            />
                            <span className={`text-sm ${speed === item.value ? "text-white font-medium" : "text-gray-400 group-hover:text-white"}`}>
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
