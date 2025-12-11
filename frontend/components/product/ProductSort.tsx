"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductSort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "createdAt:desc";
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        router.push(`/cars?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:inline">Sắp xếp theo:</span>
            <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-card border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary cursor-pointer"
                style={{ color: isDark ? '#ffffff' : '#111827' }}
            >
                <option value="createdAt:desc">Mới nhất</option>
                <option value="price:asc">Giá: Thấp đến Cao</option>
                <option value="price:desc">Giá: Cao đến Thấp</option>
                <option value="name:asc">Tên: A-Z</option>
            </select>
        </div>
    );
}
