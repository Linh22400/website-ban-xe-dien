import { getCars, getPromotions } from "@/lib/api";
import ElectricMotorcyclesClient from "./ElectricMotorcyclesClient";

export const revalidate = 180; // 3 minutes ISR

export default async function ElectricMotorcycles() {
    // Server-side fetch for promotions
    const [carsData, promotionsData] = await Promise.all([
        getCars({ type: 'motorcycle', pageSize: 4 }), 
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
        <ElectricMotorcyclesClient 
            initialMotorcycles={carsData}
            initialDiscounts={discountMap}
        />
    );
}
