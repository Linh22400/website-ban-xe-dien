import CarsPageClient from "../CarsPageClient";
import { getCarsWithMeta, getPromotions } from "@/lib/api";

export const revalidate = 300; // Cache 5 phút cho trang danh sách sản phẩm

interface CarsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getFirst(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  // SSR/ISR: Fetch dữ liệu ở server để tăng SEO + tốc độ tải.
  // UI tương tác (drawer/filter) vẫn nằm ở client component.

  // Await searchParams (Next.js 16 requirement)
  const params = await searchParams;

  const page = Number(getFirst(params?.page)) || 1;
  const pageSize = 12;

  const type = getFirst(params?.type);
  const brand = getFirst(params?.brand);
  const minPrice = getFirst(params?.minPrice);
  const maxPrice = getFirst(params?.maxPrice);
  const minRange = getFirst(params?.minRange);
  const maxRange = getFirst(params?.maxRange);
  const minSpeed = getFirst(params?.minSpeed);
  const maxSpeed = getFirst(params?.maxSpeed);
  const sort = getFirst(params?.sort);
  const search = getFirst(params?.search);

  const [carsResult, promotions] = await Promise.all([
    getCarsWithMeta({
      type,
      brand,
      search,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRange: minRange ? Number(minRange) : undefined,
      maxRange: maxRange ? Number(maxRange) : undefined,
      minSpeed: minSpeed ? Number(minSpeed) : undefined,
      maxSpeed: maxSpeed ? Number(maxSpeed) : undefined,
      sort,
      page,
      pageSize,
    }),
    getPromotions(),
  ]);

  // Tạo map discount theo car ID/documentId (để tương thích Strapi v4/v5).
  const discountMap: Record<string, number> = {};
  promotions.forEach((promo: any) => {
    if (promo.isActive && promo.discountPercent && promo.car_models) {
      promo.car_models.forEach((car: any) => {
        discountMap[car.id] = promo.discountPercent!;
        if (car.documentId) discountMap[car.documentId] = promo.discountPercent!;
      });
    }
  });

  // Dùng query string để CarsPageClient biết dữ liệu SSR nào đang tương ứng, tránh fetch lại ngay.
  const initialQueryString = new URLSearchParams(
    Object.entries(params || {}).flatMap(([key, value]) => {
      if (value === undefined) return [];
      if (Array.isArray(value)) return value.map((v) => [key, v] as [string, string]);
      return [[key, value] as [string, string]];
    })
  ).toString();

  return (
    <CarsPageClient
      initialCars={carsResult.cars}
      initialDiscounts={discountMap}
      initialQueryString={initialQueryString}
      initialPage={page}
      pageSize={pageSize}
      initialPagination={carsResult.pagination}
    />
  );
}
