"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, getFeaturedCars, getPromotions } from "@/lib/api";
import ProductCard from "../product/ProductCard";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [discounts, setDiscounts] = useState<Record<string, number>>({});

    useEffect(() => {
        Promise.all([getFeaturedCars(), getPromotions()])
            .then(([carsData, promotionsData]) => {
                setCars(carsData);

                // Create discount map
                const discountMap: Record<string, number> = {};
                promotionsData.forEach(promo => {
                    if (promo.isActive && promo.discountPercent && promo.car_models) {
                        promo.car_models.forEach((car: any) => {
                            discountMap[car.id] = promo.discountPercent!;
                            if (car.documentId) discountMap[car.documentId] = promo.discountPercent!;
                        });
                    }
                });
                setDiscounts(discountMap);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-20 px-6 bg-background">
                <div className="container mx-auto">
                    <div className="h-10 w-64 bg-white/10 rounded-lg mb-12 animate-pulse mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (cars.length === 0) return null;

    return (
        <section className="py-20 px-6 bg-background">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Sản Phẩm Nổi Bật
                        </h2>
                        <p className="text-muted-foreground">
                            Những mẫu xe được yêu thích nhất
                        </p>
                    </div>
                    <Link
                        href="/cars"
                        className="group flex items-center gap-2 text-primary hover:text-white transition-colors"
                    >
                        <span className="font-semibold">Xem tất cả</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cars.slice(0, 4).map((car) => {
                        const discountPercent = discounts[car.id] || discounts[car.documentId || ''] || 0;
                        return (
                            <ProductCard
                                key={car.id}
                                car={car}
                                discountPercent={discountPercent}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
