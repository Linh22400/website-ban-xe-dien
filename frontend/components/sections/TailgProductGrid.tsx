import { getCars, getPromotions } from '@/lib/api';
import dynamic from 'next/dynamic';

const TailgProductGridClient = dynamic(() => import('./TailgProductGridClient'));

export const revalidate = 180; // 3 minutes

export default async function TailgProductGrid() {
    // Fetch initial data server-side for better SEO and faster initial load
    try {
        // Fetch promotions first to get IDs of discounted cars
        const promotionsData = await getPromotions();

        const discountMap: Record<string, number> = {};
        const promoCarIds = new Set<string>();

        promotionsData.forEach(promo => {
            if (promo.isActive && promo.car_models && promo.discountPercent) {
                promo.car_models.forEach((car: any) => {
                    // Prefer documentId if available (Strapi v5), else id
                    const carId = car.documentId || car.id?.toString();
                    if (carId) {
                        promoCarIds.add(carId);
                        const currentDiscount = discountMap[carId] || 0;
                        discountMap[carId] = Math.max(currentDiscount, promo.discountPercent || 0);
                    }
                });
            }
        });

        // Fetch all product lists in parallel
        // For promotion cars, we fetch full details using the IDs we just collected
        const [motorcyclesData, bicyclesData, bestSellersData, newArrivalsData, promotionCarsData] = await Promise.all([
            getCars({ brand: 'TAILG', type: 'motorcycle', pageSize: 8, sort: 'createdAt:desc' }),
            getCars({ brand: 'TAILG', type: 'bicycle', pageSize: 8, sort: 'createdAt:desc' }),
            getCars({ brand: 'TAILG', pageSize: 8, sort: 'sold:desc' }),
            getCars({ brand: 'TAILG', pageSize: 8, sort: 'createdAt:desc' }),
            promoCarIds.size > 0 ? getCars({ ids: Array.from(promoCarIds) }) : Promise.resolve([])
        ]);

        return (
            <TailgProductGridClient
                initialMotorcycles={motorcyclesData}
                initialBicycles={bicyclesData}
                initialBestSellers={bestSellersData}
                initialNewArrivals={newArrivalsData}
                initialPromotionCars={promotionCarsData}
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
