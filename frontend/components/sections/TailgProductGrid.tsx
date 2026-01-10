import { getCars, getPromotions } from '@/lib/api';
import TailgProductGridClient from './TailgProductGridClient';

export const revalidate = 180; // 3 minutes

export default async function TailgProductGrid() {
    // Fetch initial data server-side for better SEO and faster initial load
    try {
        const [carsData, promotionsData] = await Promise.all([
            getCars({ brand: 'TAILG', pageSize: 8, sort: 'createdAt:desc' }),
            getPromotions()
        ]);

        // Build initial discount map
        const discountMap: Record<string, number> = {};
        const promoCarIds = new Set<string>();

        promotionsData.forEach(promo => {
            if (promo.isActive && promo.car_models && promo.discountPercent) {
                promo.car_models.forEach((car: any) => {
                    const carId = car.id?.toString() || car.documentId;
                    if (carId) {
                        promoCarIds.add(carId);
                        const currentDiscount = discountMap[carId] || 0;
                        discountMap[carId] = Math.max(currentDiscount, promo.discountPercent || 0);
                    }
                });
            }
        });

        return (
            <TailgProductGridClient
                initialProducts={carsData}
                initialPromotions={promotionsData}
                initialDiscountMap={discountMap}
            />
        );
    } catch (error) {
        console.error('Failed to fetch TAILG products on server:', error);
        // Fallback to client-only mode
        return <TailgProductGridClient />;
    }
}
