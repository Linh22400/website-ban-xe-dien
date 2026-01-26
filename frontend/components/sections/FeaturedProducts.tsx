import { getFeaturedCars, getPromotions } from "@/lib/api";
import dynamic from 'next/dynamic';

const FeaturedProductsClient = dynamic(() => import("./FeaturedProductsClient"));

export const revalidate = 180; // 3 minutes ISR

export default async function FeaturedProducts() {
    // Server-side fetch for promotions
    const [carsData, promotionsData] = await Promise.all([
        getFeaturedCars(), 
        getPromotions()
    ]);

    // Build discount map
    const discountMap: Record<string, number> = {};
    promotionsData.forEach(promo => {
        if (promo.isActive && promo.discountPercent && promo.car_models) {
            promo.car_models.forEach((car: any) => {
                discountMap[car.id] = promo.discountPercent!;
                if (car.documentId) discountMap[car.documentId] = promo.discountPercent!;
            });
        }
    });

    return (
        <FeaturedProductsClient 
            initialCars={carsData}
            initialDiscounts={discountMap}
        />
    );
}
