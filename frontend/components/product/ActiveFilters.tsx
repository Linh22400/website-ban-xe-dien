"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

interface FilterChip {
    key: string;
    label: string;
    value: string;
}

export default function ActiveFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse active filters
    const getActiveFilters = (): FilterChip[] => {
        const filters: FilterChip[] = [];

        // Type filter
        const type = searchParams.get("type");
        if (type) {
            const label = type === "bicycle" ? "Xe Đạp Điện" : "Xe Máy Điện";
            filters.push({ key: "type", label, value: type });
        }

        // Brand filter
        const brand = searchParams.get("brand");
        if (brand) {
            filters.push({ key: "brand", label: brand, value: brand });
        }

        // Price range filter
        const priceRange = searchParams.get("priceRange");
        if (priceRange) {
            const labels: Record<string, string> = {
                "0-10000000": "Dưới 10 triệu",
                "10000000-20000000": "10 - 20 triệu",
                "20000000-100000000": "Trên 20 triệu"
            };
            filters.push({
                key: "price",
                label: labels[priceRange] || priceRange,
                value: priceRange
            });
        }

        // Range filter
        const range = searchParams.get("range");
        if (range) {
            const labels: Record<string, string> = {
                "0-50": "Dưới 50 km",
                "50-80": "50 - 80 km",
                "80-500": "Trên 80 km"
            };
            filters.push({
                key: "range",
                label: labels[range] || range,
                value: range
            });
        }

        // Speed filter
        const speed = searchParams.get("speed");
        if (speed) {
            const labels: Record<string, string> = {
                "0-40": "Dưới 40 km/h",
                "40-60": "40 - 60 km/h",
                "60-200": "Trên 60 km/h"
            };
            filters.push({
                key: "speed",
                label: labels[speed] || speed,
                value: speed
            });
        }

        return filters;
    };

    const activeFilters = getActiveFilters();

    const removeFilter = (key: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (key === "price") {
            params.delete("minPrice");
            params.delete("maxPrice");
            params.delete("priceRange");
        } else if (key === "range") {
            params.delete("minRange");
            params.delete("maxRange");
            params.delete("range");
        } else if (key === "speed") {
            params.delete("minSpeed");
            params.delete("maxSpeed");
            params.delete("speed");
        } else {
            params.delete(key);
        }

        params.delete("page"); // Reset to page 1
        router.push(`/cars?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push("/cars");
    };

    if (activeFilters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-card/30 rounded-xl border border-white/5">
            <span className="text-sm text-muted-foreground font-medium">Đang lọc:</span>

            {activeFilters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => removeFilter(filter.key)}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/50 hover:border-primary text-primary hover:text-white rounded-full transition-all text-sm font-medium"
                >
                    <span>{filter.label}</span>
                    <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                </button>
            ))}

            <button
                onClick={clearAllFilters}
                className="px-4 py-1.5 text-sm font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
                Xóa tất cả
            </button>
        </div>
    );
}
