"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCars, getPromotions } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import ProductSort from "@/components/product/ProductSort";
import ActiveFilters from "@/components/product/ActiveFilters";
import FilterDrawer from "@/components/product/FilterDrawer";
import Pagination from "@/components/product/Pagination";
import Link from "next/link";
import { Filter } from "lucide-react";
import type { Car } from "@/lib/api";

export default function CarsPage() {
    const searchParams = useSearchParams();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const [discounts, setDiscounts] = useState<Record<string, number>>({});

    const page = Number(searchParams.get("page")) || 1;
    const pageSize = 12;
    // Calculate total pages: if we got full pageSize, there might be more
    // If we got less than pageSize, this is the last page
    const hasMorePages = cars.length === pageSize;
    const totalPages = hasMorePages ? page + 1 : page;

    // Count active filters
    const activeFilterCount = (): number => {
        let count = 0;
        if (searchParams.get("type")) count++;
        if (searchParams.get("brand")) count++;
        if (searchParams.get("priceRange")) count++;
        if (searchParams.get("range")) count++;
        if (searchParams.get("speed")) count++;
        return count;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [carsData, promotions] = await Promise.all([
                    getCars({
                        type: searchParams.get("type") || undefined,
                        brand: searchParams.get("brand") || undefined,
                        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
                        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
                        minRange: searchParams.get("minRange") ? Number(searchParams.get("minRange")) : undefined,
                        maxRange: searchParams.get("maxRange") ? Number(searchParams.get("maxRange")) : undefined,
                        minSpeed: searchParams.get("minSpeed") ? Number(searchParams.get("minSpeed")) : undefined,
                        maxSpeed: searchParams.get("maxSpeed") ? Number(searchParams.get("maxSpeed")) : undefined,
                        sort: searchParams.get("sort") || undefined,
                        page,
                        pageSize
                    }),
                    getPromotions()
                ]);

                // Create discount map
                const discountMap: Record<string, number> = {};
                promotions.forEach((promo: any) => {
                    if (promo.isActive && promo.discountPercent && promo.car_models) {
                        promo.car_models.forEach((car: any) => {
                            discountMap[car.id] = promo.discountPercent!;
                            if (car.documentId) discountMap[car.documentId] = promo.discountPercent!;
                        });
                    }
                });

                setCars(carsData);
                setDiscounts(discountMap);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams, page]);

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            {/* Header */}
            <div className="bg-secondary/30 border-b border-white/5 py-12 mb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Danh Sách Sản Phẩm
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                        <span>/</span>
                        <span className="text-white">Sản Phẩm</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter (Desktop Only) */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <ProductFilter />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Button + Active Filters */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setShowFilterDrawer(true)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-card/50 border border-white/10 rounded-xl hover:border-primary/50 transition-all"
                            >
                                <Filter className="w-5 h-5" />
                                <span className="font-semibold">
                                    Bộ Lọc {activeFilterCount() > 0 && `(${activeFilterCount()})`}
                                </span>
                            </button>
                        </div>

                        {/* Active Filters */}
                        <ActiveFilters />

                        {/* Toolbar - Sticky on Mobile */}
                        <div className="sticky top-20 lg:top-0 z-30 bg-background/95 backdrop-blur-lg lg:bg-transparent lg:backdrop-blur-none mb-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 lg:p-4 bg-card/30 rounded-xl border border-white/5">
                                <div className="text-sm text-muted-foreground">
                                    Hiển thị <span className="text-white font-bold">{cars.length}</span> sản phẩm
                                </div>
                                <ProductSort />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-card/30 rounded-2xl aspect-[4/3] mb-4"></div>
                                        <div className="h-4 bg-card/30 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-card/30 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : cars.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cars.map((car, index) => (
                                    <div
                                        key={`${car.id}-${searchParams.toString()}`}
                                        className="animate-fadeInUp opacity-0"
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                            animationFillMode: 'forwards'
                                        }}
                                    >
                                        <ProductCard
                                            car={car}
                                            discountPercent={discounts[car.id] || 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-card/30 rounded-2xl border border-white/5">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-muted-foreground">
                                    Vui lòng thử lại với bộ lọc khác.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                searchParams={Object.fromEntries(searchParams.entries())}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <FilterDrawer
                isOpen={showFilterDrawer}
                onClose={() => setShowFilterDrawer(false)}
                activeFilterCount={activeFilterCount()}
            />
        </main>
    );
}
