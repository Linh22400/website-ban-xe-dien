"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Car, getFeaturedCars, getPromotions } from "@/lib/api";
import { ArrowRight, Battery, Gauge, Zap } from "lucide-react";

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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return (
            <section className="py-20 px-6 bg-black/20">
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
        <section className="py-24 px-6 bg-background relative">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Sản Phẩm Nổi Bật
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Những mẫu xe được yêu thích nhất năm 2025
                        </p>
                    </div>
                    <Link
                        href="/cars"
                        className="group flex items-center gap-2 text-primary font-bold hover:text-white transition-colors"
                    >
                        Xem Tất Cả
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cars.slice(0, 4).map((car) => {
                        const discountPercent = discounts[car.id] || 0;
                        const finalPrice = discountPercent > 0 ? car.price * (1 - discountPercent / 100) : car.price;

                        return (
                            <Link
                                href={`/cars/${car.slug}`}
                                key={car.id}
                                className="group relative bg-card/30 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 w-full overflow-hidden bg-white/5">
                                    <Image
                                        src={car.thumbnail}
                                        alt={car.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Discount Badge */}
                                    {discountPercent > 0 && (
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                                                -{discountPercent}%
                                            </span>
                                        </div>
                                    )}

                                    {/* Quick Specs Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-between text-xs font-medium text-white/90">
                                        <div className="flex items-center gap-1">
                                            <Battery className="w-3 h-3 text-primary" />
                                            {car.range}km
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Gauge className="w-3 h-3 text-primary" />
                                            {car.topSpeed}km/h
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{car.brand}</div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{car.name}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <div className={`text-lg font-bold ${discountPercent > 0 ? 'text-red-500' : 'text-white'}`}>
                                                {formatPrice(finalPrice)}
                                            </div>
                                            {discountPercent > 0 && (
                                                <div className="text-xs text-gray-500 line-through">
                                                    {formatPrice(car.price)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
