"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCars, Car } from "@/lib/api";
import Image from "next/image";
import ProductBadge from "@/components/common/ProductBadge";

export default function ComparisonSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length > 1) {
                setLoading(true);
                try {
                    const cars = await getCars({ pageSize: 100 });
                    const filtered = cars.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
                    setResults(filtered.slice(0, 5));
                } catch {
                    setResults([]);
                    setErrorMessage("Không thể tải danh sách xe. Vui lòng thử lại.");
                    setTimeout(() => setErrorMessage(null), 2500);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const addCar = (slug: string) => {
        const currentSlugs = searchParams.get("cars")?.split(",") || [];
        if (currentSlugs.includes(slug)) {
            setIsOpen(false);
            return;
        }

        if (currentSlugs.length >= 3) {
            setErrorMessage("Chỉ có thể so sánh tối đa 3 xe.");
            setTimeout(() => setErrorMessage(null), 2500);
            return;
        }

        const newSlugs = [...currentSlugs, slug];
        const params = new URLSearchParams(searchParams.toString());
        params.set("cars", newSlugs.join(","));
        router.push(`/compare?${params.toString()}`);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-card border border-white/10 rounded-full text-foreground hover:border-primary transition-colors"
            >
                <span className="text-xl">➕</span>
                <span className="font-bold text-foreground">Thêm Xe So Sánh</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-4 w-full md:w-[400px] bg-card border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                    <input
                        type="text"
                        placeholder="Tìm tên xe..."
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {errorMessage && (
                            <div className="text-sm text-red-500 px-2">
                                {errorMessage}
                            </div>
                        )}
                        {loading ? (
                            <div className="text-center text-muted-foreground py-4">Đang tìm...</div>
                        ) : results.length > 0 ? (
                            results.map((car) => (
                                <button
                                    key={car.id}
                                    onClick={() => addCar(car.slug)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors text-left"
                                >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-900 shrink-0">
                                        <Image src={car.thumbnail} alt={car.name} fill sizes="48px" className="object-cover object-center" />
                                        <div className="absolute top-0.5 left-0.5">
                                            <ProductBadge product={car} size="sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{car.name}</div>
                                        <div className="text-xs text-primary">{car.price.toLocaleString('vi-VN')}₫</div>
                                    </div>
                                </button>
                            ))
                        ) : searchTerm.length > 1 ? (
                            <div className="text-center text-muted-foreground py-4">Không tìm thấy xe nào.</div>
                        ) : (
                            <div className="text-center text-muted-foreground py-4 text-sm">Nhập tên xe để tìm kiếm</div>
                        )}
                    </div>
                </div>
            )}

            {isOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 w-full h-full cursor-default"
                    aria-label="Đóng tìm kiếm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
