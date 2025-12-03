"use client";

import { useEffect, useState } from "react";
import { Car, getRelatedCars, getPromotions } from "@/lib/api";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
    currentSlug: string;
    type: string;
}

export default function RelatedProducts({ currentSlug, type }: RelatedProductsProps) {
    const [relatedCars, setRelatedCars] = useState<Car[]>([]);
    const [discounts, setDiscounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getRelatedCars(currentSlug, type), getPromotions()])
            .then(([carsData, promotionsData]) => {
                setRelatedCars(carsData);

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
    }, [currentSlug, type]);

    if (loading) return null;
    if (relatedCars.length === 0) return null;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Sản Phẩm Tương Tự</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedCars.map((car) => (
                    <ProductCard
                        key={car.id}
                        car={car}
                        discountPercent={discounts[car.id] || 0}
                    />
                ))}
            </div>
        </div>
    );
}
