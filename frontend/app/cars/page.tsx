import { getCars, getPromotions } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import ProductSort from "@/components/product/ProductSort";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        type?: string;
        brand?: string;
        minPrice?: string;
        maxPrice?: string;
        minRange?: string;
        maxRange?: string;
        minSpeed?: string;
        maxSpeed?: string;
        sort?: string;
        page?: string;
    }>
}

export default async function CarsPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const pageSize = 12;

    // Fetch cars and promotions in parallel
    const [cars, promotions] = await Promise.all([
        getCars({
            type: resolvedSearchParams.type,
            brand: resolvedSearchParams.brand,
            minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
            maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
            minRange: resolvedSearchParams.minRange ? Number(resolvedSearchParams.minRange) : undefined,
            maxRange: resolvedSearchParams.maxRange ? Number(resolvedSearchParams.maxRange) : undefined,
            minSpeed: resolvedSearchParams.minSpeed ? Number(resolvedSearchParams.minSpeed) : undefined,
            maxSpeed: resolvedSearchParams.maxSpeed ? Number(resolvedSearchParams.maxSpeed) : undefined,
            sort: resolvedSearchParams.sort,
            page,
            pageSize
        }),
        getPromotions()
    ]);

    // Create a map of car ID -> discount percent
    const discounts: Record<string, number> = {};
    promotions.forEach(promo => {
        if (promo.isActive && promo.discountPercent && promo.car_models) {
            promo.car_models.forEach((car: any) => {
                discounts[car.id] = promo.discountPercent!;
                if (car.documentId) discounts[car.documentId] = promo.discountPercent!;
            });
        }
    });

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
                    {/* Sidebar Filter (Desktop) */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-24 bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6 lg:hidden">
                                <h2 className="text-xl font-bold">Bộ Lọc</h2>
                                {/* Mobile Filter Toggle could go here */}
                            </div>
                            <ProductFilter />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-card/30 p-4 rounded-xl border border-white/5">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị <span className="text-white font-bold">{cars.length}</span> sản phẩm
                            </div>
                            <ProductSort />
                        </div>

                        {/* Product Grid */}
                        {cars.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cars.map((car) => (
                                    <ProductCard
                                        key={car.id}
                                        car={car}
                                        discountPercent={discounts[car.id] || 0}
                                    />
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

                        {/* Pagination (Simple Next/Prev for now) */}
                        <div className="mt-12 flex justify-center gap-4">
                            {page > 1 && (
                                <Link
                                    href={{
                                        query: { ...resolvedSearchParams, page: page - 1 }
                                    }}
                                    className="px-6 py-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"
                                >
                                    ← Trang Trước
                                </Link>
                            )}
                            {cars.length === pageSize && (
                                <Link
                                    href={{
                                        query: { ...resolvedSearchParams, page: page + 1 }
                                    }}
                                    className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-all"
                                >
                                    Trang Sau →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
