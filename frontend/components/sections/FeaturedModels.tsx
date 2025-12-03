"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFeaturedCars, getPromotions, Car } from "@/lib/api";

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
                            // Use documentId or id depending on Strapi version, usually id in v4/v5 response
                            // But wait, getFeaturedCars returns Car objects with 'id' as string.
                            // Strapi relation data usually has 'id' (number) or 'documentId'.
                            // Let's assume 'id' matches.
                            // We need to check if the car in the relation matches the featured car.
                            // The relation data might be minimal (id, attributes).
                            // Let's use ID.
                            discounts[car.id] = promo.discountPercent!;
                            // Also try matching by documentId if available
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            <div className="h-[400px] bg-white/10 rounded-2xl"></div>
                            <div className="h-[400px] bg-white/10 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // If no featured cars, don't render the section (or render fallback)
    if (featuredCars.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-6 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Sản Phẩm Nổi Bật
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Khám phá các mẫu xe đạp điện và xe máy điện phổ biến nhất, thiết kế hiện đại và bền vững.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredCars.map((car) => {
                        const discount = carDiscounts[car.id] || 0;
                        const finalPrice = discount > 0 ? car.price * (1 - discount / 100) : car.price;

                        return (
                            <Link
                                key={car.slug}
                                href={`/cars/${car.slug}`}
                                className="group relative h-[400px] rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500"
                            >
                                <Image
                                    src={car.thumbnail}
                                    alt={car.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                {discount > 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                                        -{discount}%
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <p className="text-primary text-sm font-bold mb-2">{car.brand}</p>
                                    <h3 className="text-3xl font-bold text-white mb-4">{car.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            {discount > 0 && (
                                                <span className="text-gray-400 text-sm line-through decoration-red-500 decoration-2">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(car.price)}
                                                </span>
                                            )}
                                            <span className={`font-bold text-xl ${discount > 0 ? 'text-red-500' : 'text-white'}`}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-white font-bold group-hover:text-primary transition-colors">
                                            Khám Phá <span className="ml-2">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/cars"
                        className="inline-block px-8 py-4 border border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-black transition-all"
                    >
                        Xem Tất Cả Sản Phẩm
                    </Link>
                </div>
            </div>
        </section>
    );
}
