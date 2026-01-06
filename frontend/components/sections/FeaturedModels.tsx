"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFeaturedCars, getPromotions, Car } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedModels() {
    const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [carDiscounts, setCarDiscounts] = useState<Record<string, number>>({});

    useEffect(() => {
        Promise.all([getFeaturedCars(), getPromotions()])
            .then(([cars, promotions]) => {
                setFeaturedCars(cars);

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
                setCarDiscounts(discounts);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-20 px-6 bg-background">
                <div className="container mx-auto text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-white/10 w-1/3 mx-auto rounded"></div>
                        <div className="h-4 bg-white/10 w-1/2 mx-auto rounded"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-[400px] bg-white/10 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // If no featured cars, don't render the section
    if (featuredCars.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-6 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-foreground">
                        Sản Phẩm Nổi Bật
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Khám phá các mẫu xe đạp điện và xe máy điện phổ biến nhất, thiết kế hiện đại và bền vững.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {featuredCars.map((car) => {
                        const discount = carDiscounts[car.id] || 0;

                        return (
                            <ProductCard
                                key={`featured-${car.id}-${car.slug}`}
                                car={car}
                                discountPercent={discount}
                            />
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/cars"
                        className="inline-block px-8 py-4 border border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        Xem Tất Cả Sản Phẩm
                    </Link>
                </div>
            </div>
        </section>
    );
}
