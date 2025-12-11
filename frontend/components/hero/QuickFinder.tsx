"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, Battery, Gauge, Tag, Sparkles, TrendingUp, GraduationCap, Wallet } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

export default function QuickFinder() {
    const router = useRouter();
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [range, setRange] = useState("");
    const [speed, setSpeed] = useState("");

    // Options data
    const typeOptions = [
        { value: "", label: "Tất cả loại" },
        { value: "bicycle", label: "🚲 Xe Đạp Điện" },
        { value: "motorcycle", label: "🏍️ Xe Máy Điện" },
    ];

    const brandOptions = [
        { value: "", label: "Tất cả hãng" },
        { value: "VinFast", label: "VinFast" },
        { value: "Yadea", label: "Yadea" },
        { value: "Pega", label: "Pega" },
        { value: "Dibao", label: "Dibao" },
        { value: "Dat Bike", label: "Dat Bike" },
        { value: "Giant", label: "Giant" },
    ];

    const priceOptions = [
        { value: "", label: "Tất cả mức giá" },
        { value: "low", label: "💵 Dưới 10 triệu" },
        { value: "mid", label: "💰 10 - 20 triệu" },
        { value: "high", label: "💎 Trên 20 triệu" },
    ];

    const rangeOptions = [
        { value: "", label: "Tùy chọn" },
        { value: "short", label: "< 50km" },
        { value: "medium", label: "50 - 80km" },
        { value: "long", label: "> 80km" },
    ];

    const speedOptions = [
        { value: "", label: "Tùy chọn" },
        { value: "slow", label: "< 40km/h" },
        { value: "medium", label: "40 - 60km/h" },
        { value: "fast", label: "> 60km/h" },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        if (brand) params.append("brand", brand);

        // Handle Range
        if (range) {
            switch (range) {
                case "short":
                    params.append("maxRange", "50");
                    params.append("range", "0-50");
                    break;
                case "medium":
                    params.append("minRange", "50");
                    params.append("maxRange", "80");
                    params.append("range", "50-80");
                    break;
                case "long":
                    params.append("minRange", "80");
                    params.append("range", "80-500");
                    break;
            }
        }

        // Handle Speed
        if (speed) {
            switch (speed) {
                case "slow":
                    params.append("maxSpeed", "40");
                    params.append("speed", "0-40");
                    break;
                case "medium":
                    params.append("minSpeed", "40");
                    params.append("maxSpeed", "60");
                    params.append("speed", "40-60");
                    break;
                case "fast":
                    params.append("minSpeed", "60");
                    params.append("speed", "60-200");
                    break;
            }
        }

        if (price) {
            switch (price) {
                case "low":
                    params.append("maxPrice", "10000000");
                    params.append("priceRange", "0-10000000");
                    break;
                case "mid":
                    params.append("minPrice", "10000000");
                    params.append("maxPrice", "20000000");
                    params.append("priceRange", "10000000-20000000");
                    break;
                case "high":
                    params.append("minPrice", "20000000");
                    params.append("priceRange", "20000000-100000000");
                    break;
            }
        }

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
        <div className="w-full bg-black/60 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl shadow-black/40 relative group">
            {/* Semi-transparent overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80" />



            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg shadow-primary/20">
                        <Search className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Tìm Xe Nhanh
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Chọn chiếc xe phù hợp với nhu cầu của bạn
                    </p>
                </div>

                {/* Quick Tags - Prominent */}
                <div className="mb-8">
                    <p className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        GỢI Ý PHỔ BIẾN
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => applyQuickTag("bestseller")}
                            className="group/tag bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded-xl p-4 transition-all hover:scale-105"
                        >
                            <TrendingUp className="w-5 h-5 text-orange-400 mb-2 mx-auto" />
                            <p className="text-xs font-bold text-white">Bán Chạy</p>
                        </button>
                        <button
                            onClick={() => applyQuickTag("student")}
                            className="group/tag bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl p-4 transition-all hover:scale-105"
                        >
                            <GraduationCap className="w-5 h-5 text-blue-400 mb-2 mx-auto" />
                            <p className="text-xs font-bold text-white">Học Sinh</p>
                        </button>
                        <button
                            onClick={() => applyQuickTag("cheap")}
                            className="group/tag bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/30 hover:border-green-500/50 rounded-xl p-4 transition-all hover:scale-105"
                        >
                            <Wallet className="w-5 h-5 text-green-400 mb-2 mx-auto" />
                            <p className="text-xs font-bold text-white">Dưới 15tr</p>
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 text-gray-500 font-medium">HOẶC TÌM KIẾM CHI TIẾT</span>
                    </div>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-5">
                    {/* Row 1: Type & Brand */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                Loại Xe
                            </label>
                            <CustomSelect
                                value={type}
                                onChange={setType}
                                options={typeOptions}
                                icon={<Zap className="w-3.5 h-3.5 text-primary" />}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                                <Tag className="w-3.5 h-3.5 text-primary" />
                                Thương Hiệu
                            </label>
                            <CustomSelect
                                value={brand}
                                onChange={setBrand}
                                options={brandOptions}
                                icon={<Tag className="w-3.5 h-3.5 text-primary" />}
                            />
                        </div>
                    </div>

                    {/* Row 2: Price (Full width) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                            💰 Mức Giá
                        </label>
                        <CustomSelect
                            value={price}
                            onChange={setPrice}
                            options={priceOptions}
                        />
                    </div>

                    {/* Row 3: Range & Speed */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                                <Battery className="w-3.5 h-3.5 text-primary" />
                                Quãng Đường
                            </label>
                            <CustomSelect
                                value={range}
                                onChange={setRange}
                                options={rangeOptions}
                                icon={<Battery className="w-3.5 h-3.5 text-primary" />}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-wide">
                                <Gauge className="w-3.5 h-3.5 text-primary" />
                                Tốc Độ
                            </label>
                            <CustomSelect
                                value={speed}
                                onChange={setSpeed}
                                options={speedOptions}
                                icon={<Gauge className="w-3.5 h-3.5 text-primary" />}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary via-primary to-accent text-black font-black py-4 rounded-xl hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-2.5 text-base"
                    >
                        <Search className="w-5 h-5" />
                        <span>Tìm Kiếm Ngay</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
