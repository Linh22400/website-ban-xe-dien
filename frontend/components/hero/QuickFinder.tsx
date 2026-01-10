"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, Battery, Gauge, Tag, Sparkles, TrendingUp, GraduationCap, Wallet, Banknote } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import { useTheme, ThemeText } from "@/components/common/ThemeText";
import { getCars } from "@/lib/api";

export default function QuickFinder() {
    const router = useRouter();
    const isDark = useTheme();
    const [type, setType] = useState("");
    const [brand, setBrand] = useState("TAILG");
    const [price, setPrice] = useState("");
    const [range, setRange] = useState("");
    const [speed, setSpeed] = useState("");

    // Options data
    const typeOptions = [
        { value: "", label: "Tất cả loại" },
        { value: "bicycle", label: "Xe Đạp Điện" },
        { value: "motorcycle", label: "Xe Máy Điện" },
    ];

    const [availableBrands, setAvailableBrands] = useState<string[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                // Lightweight sampling: enough to build a brand list for the selector.
                const cars = await getCars({ pageSize: 60, sort: 'createdAt:desc' });
                if (cancelled) return;
                const brandSet = new Set(
                    (cars || [])
                        .map((c: any) => (c?.brand ? String(c.brand).trim() : ''))
                        .filter(Boolean)
                );
                setAvailableBrands(Array.from(brandSet));
            } catch {
                // Silent: selector will still work with default options.
                if (!cancelled) setAvailableBrands([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const brandOptions = useMemo(() => {
        const normalized = Array.from(
            new Set(
                availableBrands
                    .map((b) => b.trim())
                    .filter(Boolean)
            )
        );

        // Prefer TAILG first if present.
        normalized.sort((a, b) => a.localeCompare(b, 'vi'));
        const tailgIndex = normalized.findIndex((b) => b.toLowerCase() === 'tailg');
        if (tailgIndex > 0) {
            const [tailg] = normalized.splice(tailgIndex, 1);
            normalized.unshift(tailg);
        }

        const options = [{ value: "", label: "Tất cả thương hiệu" }];
        for (const b of normalized) {
            options.push({
                value: b,
                label: b.toLowerCase() === 'tailg' ? 'TAILG (đại lý ủy quyền)' : b,
            });
        }
        // Fallback: if API has no data yet, still show TAILG.
        if (options.length === 1) {
            options.push({ value: 'TAILG', label: 'TAILG (đại lý ủy quyền)' });
        }
        return options;
    }, [availableBrands]);

    const priceOptions = [
        { value: "", label: "Tất cả mức giá" },
        { value: "low", label: "Dưới 10 triệu" },
        { value: "mid", label: "10 - 20 triệu" },
        { value: "high", label: "Trên 20 triệu" },
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
        if (brand) params.append("brand", brand);
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
        <div
            className="w-full border rounded-3xl relative"
            style={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.85)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
            }}
        >
            <div className="relative z-10 p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg shadow-primary/20">
                        <Search className="w-7 h-7 text-white" />
                    </div>
                    <ThemeText className="text-3xl font-black mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Tìm Xe Nhanh
                    </ThemeText>
                    <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Chọn chiếc xe phù hợp với nhu cầu của bạn
                    </p>
                </div>

                {/* Quick Tags - Prominent */}
                <div className="mb-8">
                    <p className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        <Sparkles className="w-3.5 h-3.5" />
                        GỢI Ý PHỔ BIẾN
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => applyQuickTag("bestseller")}
                            className="group/tag bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded-xl p-4 transition-all"
                        >
                            <TrendingUp className="w-5 h-5 text-orange-400 mb-2 mx-auto" />
                            <p className="text-xs font-bold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Bán Chạy</p>
                        </button>
                        <button
                            onClick={() => applyQuickTag("student")}
                            className="group/tag bg-gradient-to-br from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl p-4 transition-all"
                        >
                            <GraduationCap className="w-5 h-5 text-blue-400 mb-2 mx-auto" />
                            <p className="text-xs font-bold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Học Sinh</p>
                        </button>
                        <button
                            onClick={() => applyQuickTag("cheap")}
                            className="group/tag bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/30 hover:border-green-500/50 rounded-xl p-4 transition-all"
                        >
                            <Wallet className="w-5 h-5 text-green-400 mb-2 mx-auto" />
                            <p className="text-xs font-bold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Dưới 15tr</p>
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div
                            className="w-full border-t"
                            style={{ borderColor: isDark ? 'rgb(31, 41, 55)' : 'rgb(209, 213, 219)' }}
                        />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 font-medium text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>HOẶC TÌM KIẾM CHI TIẾT</span>
                    </div>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-5">
                    {/* Row 1: Type & Brand */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                                <Zap className="w-3.5 h-3.5 text-primary" />
                                Loại Xe
                            </label>
                            <CustomSelect
                                value={type}
                                onChange={setType}
                                options={typeOptions}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                                <Tag className="w-3.5 h-3.5 text-primary" />
                                Thương Hiệu
                            </label>
                            <CustomSelect
                                value={brand}
                                onChange={setBrand}
                                options={brandOptions}
                            />
                        </div>
                    </div>

                    {/* Row 2: Price (Full width) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                            <Banknote className="w-3.5 h-3.5 text-primary" />
                            Mức Giá
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
                            <label className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                                <Battery className="w-3.5 h-3.5 text-primary" />
                                Quãng Đường
                            </label>
                            <CustomSelect
                                value={range}
                                onChange={setRange}
                                options={rangeOptions}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                                <Gauge className="w-3.5 h-3.5 text-primary" />
                                Tốc Độ
                            </label>
                            <CustomSelect
                                value={speed}
                                onChange={setSpeed}
                                options={speedOptions}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary via-primary to-accent text-black font-black py-4 rounded-xl transition-colors hover:brightness-105 mt-6 flex items-center justify-center gap-2.5 text-base"
                    >
                        <Search className="w-5 h-5" />
                        <span>Tìm Kiếm Ngay</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
