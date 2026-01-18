import { notFound } from "next/navigation";
import { getCarBySlug, getPromotions, Car } from "@/lib/api";
import CarConfigurator from "@/components/sections/CarConfigurator";
import { generateProductSchema } from "@/lib/seo";

export const revalidate = 300; // Cache 5 phút cho trang chi tiết sản phẩm

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function CarDetailPage({ params }: Props) {
    const resolvedParams = await params;
    // SSR/ISR: lấy dữ liệu xe + khuyến mãi ở server để SEO tốt hơn và tải nhanh hơn.
    const [car, promotionsData] = await Promise.all([
        getCarBySlug(resolvedParams.slug),
        getPromotions(),
    ]);

    if (!car) {
        notFound();
    }

    // Tính discount cho xe hiện tại.
    let discountPercent = 0;
    promotionsData.forEach((promo) => {
        if (promo.isActive && promo.discountPercent && promo.car_models) {
            promo.car_models.forEach((promoCar: any) => {
                if (String(promoCar.id) === String(car.id) || (promoCar.documentId && promoCar.documentId === car.documentId)) {
                    discountPercent = promo.discountPercent!;
                }
            });
        }
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xedienviet.com';

    const productSchema = generateProductSchema({
        name: car.name,
        description: car.description,
        price: discountPercent > 0 ? car.price * (1 - discountPercent / 100) : car.price,
        image: car.thumbnail,
        brand: car.brand,
        url: `${baseUrl}/cars/${car.slug}`,
    });

    return (
        <main className="min-h-screen bg-background pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            {/* Main Configurator Section */}
            <CarConfigurator car={car} discountPercent={discountPercent} />
        </main>
    );
}
