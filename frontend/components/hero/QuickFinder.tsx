"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, Battery, Gauge, Tag } from "lucide-react";

export default function QuickFinder() {
    const router = useRouter();
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [range, setRange] = useState("");
    const [speed, setSpeed] = useState("");

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
        <div className="w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-center shadow-2xl relative overflow-hidden group">
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700" />

            <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Search className="w-6 h-6 text-primary" />
                    Tìm Xe Nhanh
                </h3>
                <p className="text-gray-400 text-sm">Chọn chiếc xe phù hợp với nhu cầu của bạn</p>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
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

            <form onSubmit={handleSearch} className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Loại Xe
                        </label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="" className="bg-gray-900">Tất cả</option>
                            <option value="bicycle" className="bg-gray-900">Xe Đạp Điện</option>
                            <option value="motorcycle" className="bg-gray-900">Xe Máy Điện</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> Thương Hiệu
                        </label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        >
                            <option value="" className="bg-gray-900">Tất cả</option>
                            <option value="VinFast" className="bg-gray-900">VinFast</option>
                            <option value="Yadea" className="bg-gray-900">Yadea</option>
                            <option value="Pega" className="bg-gray-900">Pega</option>
                            <option value="Dibao" className="bg-gray-900">Dibao</option>
                            <option value="Dat Bike" className="bg-gray-900">Dat Bike</option>
                            <option value="Giant" className="bg-gray-900">Giant</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">Mức Giá</label>
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    >
                        <option value="" className="bg-gray-900">Tất cả mức giá</option>
                        <option value="low" className="bg-gray-900">Dưới 10 triệu</option>
                        <option value="mid" className="bg-gray-900">10 - 20 triệu</option>
                        <option value="high" className="bg-gray-900">Trên 20 triệu</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                            <Battery className="w-3 h-3" /> Quãng Đường
                        </label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                        >
                            <option value="" className="bg-gray-900">Tùy chọn</option>
                            <option value="short" className="bg-gray-900">&lt; 50km</option>
                            <option value="medium" className="bg-gray-900">50 - 80km</option>
                            <option value="long" className="bg-gray-900">&gt; 80km</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                            <Gauge className="w-3 h-3" /> Tốc Độ
                        </label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                            value={speed}
                            onChange={(e) => setSpeed(e.target.value)}
                        >
                            <option value="" className="bg-gray-900">Tùy chọn</option>
                            <option value="slow" className="bg-gray-900">&lt; 40km/h</option>
                            <option value="medium" className="bg-gray-900">40 - 60km/h</option>
                            <option value="fast" className="bg-gray-900">&gt; 60km/h</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-white transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 mt-2 flex items-center justify-center gap-2"
                >
                    <Search className="w-5 h-5" />
                    Tìm Kiếm Ngay
                </button>
            </form>
        </div>
    );
}
