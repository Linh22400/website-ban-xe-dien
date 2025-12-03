"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "createdAt:desc";

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        router.push(`/cars?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:inline">Sắp xếp theo:</span>
            <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-card border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary cursor-pointer"
            >
                <option value="createdAt:desc">Mới nhất</option>
                <option value="price:asc">Giá: Thấp đến Cao</option>
                <option value="price:desc">Giá: Cao đến Thấp</option>
                <option value="name:asc">Tên: A-Z</option>
            </select>
        </div>
    );
}
