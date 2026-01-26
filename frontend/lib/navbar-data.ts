import { getCars, getAccessories, getPromotions, type Car, type Accessory } from "@/lib/api";

export interface NavbarItem {
    href: string;
    label: string;
    image?: string;
    price?: string;
    originalPrice?: string;
    discount?: number;
    desc?: string;
    isViewAll?: boolean;
    product?: any; // Store full product data for dynamic badge calculation
}

export interface NavbarData {
    motorcycles: NavbarItem[];
    bicycles: NavbarItem[];
    accessories: NavbarItem[];
}

export async function getNavbarData(): Promise<NavbarData> {
    try {
        // Fetch motorcycles, bicycles, accessories and promotions in parallel
        // Optimized: Fetch only needed items (top 6) sorted by Featured and Sold count
        // Reduced payload by selecting only necessary fields
        const commonFields = ['name', 'slug', 'price', 'range', 'topSpeed', 'isFeatured', 'sold', 'type', 'brand', 'documentId'];
        const commonPopulate = ['thumbnail'];

        const [motorcyclesData, bicyclesData, accessoriesData, promotionsData] = await Promise.all([
            getCars({ 
                type: 'motorcycle', 
                pageSize: 8, 
                sort: 'isFeatured:desc',
                fields: commonFields,
                populate: commonPopulate
            }), 
            getCars({ 
                type: 'bicycle', 
                pageSize: 8, 
                sort: 'isFeatured:desc',
                fields: commonFields,
                populate: commonPopulate
            }),
            getAccessories(),
            getPromotions()
        ]);

        // Helper function to calculate discount for a car
        const getCarDiscount = (carId: string, carDocumentId: string) => {
            let discount = 0;
            promotionsData.forEach((promo) => {
                if (promo.isActive && promo.discountPercent && promo.car_models) {
                    promo.car_models.forEach((promoCar: any) => {
                        if (String(promoCar.id) === String(carId) || (promoCar.documentId && promoCar.documentId === carDocumentId)) {
                            discount = Math.max(discount, promo.discountPercent || 0);
                        }
                    });
                }
            });
            return discount;
        };

        // Sort function: Prioritize HOT (isFeatured) + high sales, then by sales count
        // This will sort ALL products and take top 4, including non-HOT products if needed
        const sortProducts = (products: Car[]) => {
            return products.sort((a, b) => {
                const aIsFeatured = a.isFeatured ? 1 : 0;
                const bIsFeatured = b.isFeatured ? 1 : 0;
                const aSales = a.sold || 0;
                const bSales = b.sold || 0;

                // Priority 1: Featured products come first
                if (aIsFeatured !== bIsFeatured) {
                    return bIsFeatured - aIsFeatured;
                }

                // Priority 2: Within same featured status, sort by sales count (high to low)
                return bSales - aSales;
            }).slice(0, 4); // Take top 4 after sorting - will include both HOT and regular products
        };

        // Transform motorcycles data
        const sortedMotorcycles = sortProducts(motorcyclesData);
        const motorcycleItems: NavbarItem[] = sortedMotorcycles.map((car) => {
            const discount = getCarDiscount(car.id, car.documentId);
            const finalPrice = discount > 0 ? car.price * (1 - discount / 100) : car.price;
            return {
                href: `/cars/${car.slug}`,
                label: car.name,
                image: car.thumbnail || '/images/placeholder-motorcycle.svg',
                price: `${Math.round(finalPrice).toLocaleString('vi-VN')}\u20ab`,
                originalPrice: discount > 0 ? `${car.price.toLocaleString('vi-VN')}\u20ab` : undefined,
                discount: discount > 0 ? Math.round(discount) : undefined,
                desc: `${car.range}km - ${car.topSpeed}km/h`,
                // Store full product data with discount for dynamic badge
                product: { ...car, discount: discount > 0 ? discount : undefined }
            };
        });
        motorcycleItems.push({
            href: '/cars?type=motorcycle',
            label: 'Xem t\u1ea5t c\u1ea3 xe m\u00e1y \u0111i\u1ec7n',
            isViewAll: true
        });

        // Transform bicycles data
        const sortedBicycles = sortProducts(bicyclesData);
        const bicycleItems: NavbarItem[] = sortedBicycles.map((car) => {
            const discount = getCarDiscount(car.id, car.documentId);
            const finalPrice = discount > 0 ? car.price * (1 - discount / 100) : car.price;
            return {
                href: `/cars/${car.slug}`,
                label: car.name,
                image: car.thumbnail || '/images/placeholder-bicycle.svg',
                price: `${Math.round(finalPrice).toLocaleString('vi-VN')}\u20ab`,
                originalPrice: discount > 0 ? `${car.price.toLocaleString('vi-VN')}\u20ab` : undefined,
                discount: discount > 0 ? Math.round(discount) : undefined,
                desc: `${car.range}km - ${car.topSpeed}km/h`,
                // Store full product data with discount for dynamic badge
                product: { ...car, discount: discount > 0 ? discount : undefined }
            };
        });
        bicycleItems.push({
            href: '/cars?type=bicycle',
            label: 'Xem t\u1ea5t c\u1ea3 xe \u0111\u1ea1p \u0111i\u1ec7n',
            isViewAll: true
        });

        // Transform accessories data - take top 4 (prioritize featured)
        const sortedAccessories = accessoriesData
            .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
            .slice(0, 4);

        const accessoryItems: NavbarItem[] = sortedAccessories.map((acc) => {
            const categoryLabels: Record<string, string> = {
                'battery': 'Pin & S\u1ea1c',
                'charger': 'S\u1ea1c',
                'helmet': 'M\u0169 B\u1ea3o Hi\u1ec3m',
                'other': 'Ph\u1ee5 ki\u1ec7n kh\u00e1c'
            };

            return {
                href: `/accessories#${acc.slug}`,
                label: acc.name,
                image: acc.image || '/images/placeholder.svg',
                price: acc.price > 0 ? `${acc.price.toLocaleString('vi-VN')}\u20ab` : 'Li\u00ean h\u1ec7',
                desc: categoryLabels[acc.category] || acc.category,
                product: acc
            };
        });

        // If less than 4, add some category links
        if (accessoryItems.length < 4) {
            const categories = [
                { href: '/accessories?category=battery', label: 'Pin & Sạc', desc: 'Pin lithium chính hãng', image: '/images/placeholder-battery.svg', price: 'Từ 1.200.000₫' },
                { href: '/accessories?category=helmet', label: 'Mũ Bảo Hiểm', desc: 'Chất lượng cao', image: '/images/placeholder-helmet.svg', price: 'Từ 350.000₫' },
                { href: '/accessories?category=other', label: 'Phụ kiện khác', desc: 'Phụ kiện đa dạng', image: '/images/placeholder.svg', price: 'Liên hệ' }
            ];

            categories.slice(0, 4 - accessoryItems.length).forEach(cat => {
                accessoryItems.push(cat);
            });
        }

        accessoryItems.push({
            href: '/accessories',
            label: 'Xem t\u1ea5t c\u1ea3 ph\u1ee5 ki\u1ec7n',
            isViewAll: true
        });

        return {
            motorcycles: motorcycleItems,
            bicycles: bicycleItems,
            accessories: accessoryItems
        };

    } catch (error) {
        console.error('Error fetching navbar data:', error);
        // Return fallback data
        return {
            motorcycles: [{ href: '/cars?type=motorcycle', label: 'Xem t\u1ea5t c\u1ea3 xe m\u00e1y \u0111i\u1ec7n', isViewAll: true }],
            bicycles: [{ href: '/cars?type=bicycle', label: 'Xem t\u1ea5t c\u1ea3 xe \u0111\u1ea1p \u0111i\u1ec7n', isViewAll: true }],
            accessories: [{ href: '/accessories', label: 'Xem t\u1ea5t c\u1ea3 ph\u1ee5 ki\u1ec7n', isViewAll: true }]
        };
    }
}
