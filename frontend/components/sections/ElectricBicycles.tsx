"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, getCars, getPromotions } from "@/lib/api";
import ProductCard from "../product/ProductCard";
import { ArrowRight } from "lucide-react";

export default function ElectricBicycles() {
    const [bicycles, setBicycles] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [discounts, setDiscounts] = useState<Record<string, number>>({});

    useEffect(() => {
        Promise.all([getCars({ type: 'bicycle', pageSize: 4 }), getPromotions()])
            .then(([carsData, promotionsData]) => {
                setBicycles(carsData);

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

    if (loading || bicycles.length === 0) return null;

    return (
        <section className="py-20 px-6 bg-secondary/20">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-foreground">
                            Xe Đạp Điện
                        </h2>
                        <p className="text-muted-foreground">
                            Thân thiện môi trường, tiện lợi mọi lúc
                        </p>
                    </div>
                    <Link
                        href="/cars?type=bicycle"
                        className="group flex items-center gap-2 font-semibold transition-colors"
                        style={{
                            color: '#00b8d4'
                        }}
                        onMouseEnter={(e) => {
                            const isDark = document.documentElement.classList.contains('dark');
                            e.currentTarget.style.color = isDark ? '#ffffff' : '#374151';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#00b8d4';
                        }}
                    >
                        Xem tất cả
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bicycles.map((car) => {
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
