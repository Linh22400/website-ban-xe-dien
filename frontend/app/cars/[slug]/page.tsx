"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getCarBySlug, getPromotions, Car } from "@/lib/api";
import CarConfigurator from "@/components/sections/CarConfigurator";
import RelatedProducts from "@/components/product/RelatedProducts";
import { generateProductSchema } from "@/lib/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

export default function CarDetailPage({ params }: Props) {
    const [car, setCar] = useState<Car | null>(null);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState<string>("");

    useEffect(() => {
        params.then(p => {
            setSlug(p.slug);
            Promise.all([getCarBySlug(p.slug), getPromotions()])
                .then(([carData, promotionsData]) => {
                    if (!carData) {
                        notFound();
                        return;
                    }

                    console.log('Car data:', { id: carData.id, documentId: carData.documentId, name: carData.name });
                    setCar(carData);

                    // Calculate discount for this car
                    let discount = 0;
                    console.log('Checking promotions:', promotionsData.length);
                    promotionsData.forEach(promo => {
                        console.log('Promo:', {
                            title: promo.title,
                            isActive: promo.isActive,
                            discountPercent: promo.discountPercent,
                            carModelsCount: promo.car_models?.length
                        });
                        if (promo.isActive && promo.discountPercent && promo.car_models) {
                            promo.car_models.forEach((promoCar: any) => {
                                console.log('Comparing:', {
                                    promoCarId: promoCar.id,
                                    promoCarDocId: promoCar.documentId,
                                    carId: carData.id,
                                    carDocId: carData.documentId
                                });
                                if (String(promoCar.id) === String(carData.id) ||
                                    (promoCar.documentId && promoCar.documentId === carData.documentId)) {
                                    console.log('✅ MATCH FOUND! Discount:', promo.discountPercent);
                                    discount = promo.discountPercent!;
                                }
                            });
                        }
                    });
                    console.log('Final discount:', discount);
                    setDiscountPercent(discount);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        });
    }, [params]);

    if (loading) {
        return (
            <main className="min-h-screen bg-background pb-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </main>
        );
    }

    if (!car) {
        notFound();
        return null;
    }

    const productSchema = generateProductSchema({
        name: car.name,
        description: car.description,
        price: discountPercent > 0 ? car.price * (1 - discountPercent / 100) : car.price,
        image: car.thumbnail,
        brand: car.brand,
        url: `https://xedienviet.com/cars/${car.slug}`,
    });

    return (
        <main className="min-h-screen bg-background pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            {/* Main Configurator Section */}
            <CarConfigurator car={car} discountPercent={discountPercent} />

            <div className="container mx-auto px-6 space-y-20 mt-12">
                {/* Related Products Section */}
                <section>
                    <RelatedProducts currentSlug={car.slug} type={car.type} />
                </section>
            </div>
        </main>
    );
}
