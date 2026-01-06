"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter } from "lucide-react";

import type { Car, PaginationMeta } from "@/lib/api";
import { getCarsWithMeta, getPromotions } from "@/lib/api";

import ProductCard from "@/components/product/ProductCard";
import ProductFilter from "@/components/product/ProductFilter";
import ProductSort from "@/components/product/ProductSort";
import ActiveFilters from "@/components/product/ActiveFilters";
import FilterDrawer from "@/components/product/FilterDrawer";
import Pagination from "@/components/product/Pagination";
import { PageTitle, BreadcrumbText, ResultCount, EmptyStateTitle } from "@/components/cars/CarsPageComponents";

interface CarsPageClientProps {
  initialCars: Car[];
  initialDiscounts: Record<string, number>;
  initialQueryString: string;
  initialPage: number;
  pageSize: number;
  initialPagination?: PaginationMeta;
}

export default function CarsPageClient({
  initialCars,
  initialDiscounts,
  initialQueryString,
  initialPage,
  pageSize,
  initialPagination,
}: CarsPageClientProps) {
  const searchParams = useSearchParams();

  // Lưu ý: Trang đã được SSR/ISR sẵn dữ liệu từ server.
  // Client chỉ fetch lại khi người dùng thay đổi bộ lọc/sort/pagination trên URL.
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [discounts, setDiscounts] = useState<Record<string, number>>(initialDiscounts);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const page = Number(searchParams.get("page")) || initialPage;

  const currentQueryString = useMemo(() => searchParams.toString(), [searchParams]);

  // Đếm số lượng filter đang bật để hiển thị trên nút mobile.
  const activeFilterCount = (): number => {
    let count = 0;
    if (searchParams.get("search")) count++;
    if (searchParams.get("type")) count++;
    if (searchParams.get("brand")) count++;
    if (searchParams.get("priceRange") || searchParams.get("minPrice") || searchParams.get("maxPrice")) count++;
    if (searchParams.get("range") || searchParams.get("minRange") || searchParams.get("maxRange")) count++;
    if (searchParams.get("speed") || searchParams.get("minSpeed") || searchParams.get("maxSpeed")) count++;
    return count;
  };

  // Ưu tiên dùng meta.pagination.pageCount từ Strapi để phân trang chính xác.
  // Fallback: nếu chưa có meta thì tạm tính heuristic.
  const hasMorePages = cars.length === pageSize;
  const totalPages = pagination?.pageCount ?? (hasMorePages ? page + 1 : page);

  useEffect(() => {
    // Nếu query hiện tại trùng với dữ liệu SSR/ISR vừa nhận từ server thì không cần fetch.
    // Trường hợp người dùng đổi filter/sort/page (URL đổi) thì client fetch để UI mượt,
    // và/hoặc chờ server render lại tuỳ cách navigation của các component filter.
    if (currentQueryString === initialQueryString) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [carsResult, promotions] = await Promise.all([
          getCarsWithMeta({
            search: searchParams.get("search") || undefined,
            type: searchParams.get("type") || undefined,
            brand: searchParams.get("brand") || undefined,
            minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
            maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
            minRange: searchParams.get("minRange") ? Number(searchParams.get("minRange")) : undefined,
            maxRange: searchParams.get("maxRange") ? Number(searchParams.get("maxRange")) : undefined,
            minSpeed: searchParams.get("minSpeed") ? Number(searchParams.get("minSpeed")) : undefined,
            maxSpeed: searchParams.get("maxSpeed") ? Number(searchParams.get("maxSpeed")) : undefined,
            sort: searchParams.get("sort") || undefined,
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

        setCars(carsResult.cars);
        setPagination(carsResult.pagination);
        setDiscounts(discountMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentQueryString, initialQueryString, page, pageSize, searchParams]);

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      {/* Header */}
      <div className="bg-secondary/30 border-b border-white/5 py-12 mb-8">
        <div className="container mx-auto px-6">
          <PageTitle>Danh Sách Sản Phẩm</PageTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <BreadcrumbText>Sản Phẩm</BreadcrumbText>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter (Desktop Only) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card/80 border border-white/5 rounded-2xl p-6">
              <ProductFilter />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button + Active Filters */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilterDrawer(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-card/50 border border-white/10 rounded-xl hover:border-primary/50 transition-all"
              >
                <Filter className="w-5 h-5" />
                <span className="font-semibold">Bộ Lọc {activeFilterCount() > 0 && `(${activeFilterCount()})`}</span>
              </button>
            </div>

            {/* Active Filters */}
            <ActiveFilters />

            {/* Toolbar - Sticky on Mobile */}
            <div className="sticky top-20 lg:top-0 z-30 bg-background/95 lg:bg-transparent mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 lg:p-4 bg-card/30 rounded-xl border border-white/5">
                <div className="text-sm text-muted-foreground">
                  Hiển thị <ResultCount>{cars.length}</ResultCount> sản phẩm
                </div>
                <ProductSort />
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-card/30 rounded-2xl aspect-[4/3] mb-4"></div>
                    <div className="h-4 bg-card/30 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-card/30 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car, index) => (
                  <div
                    key={`${car.id}-${currentQueryString}`}
                    className="animate-fadeInUp opacity-0"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <ProductCard car={car} discountPercent={discounts[car.id] || 0} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/30 rounded-2xl border border-white/5">
                <div className="text-4xl mb-4">🔍</div>
                <EmptyStateTitle>Không tìm thấy sản phẩm</EmptyStateTitle>
                <p className="text-muted-foreground">Vui lòng thử lại với bộ lọc khác.</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} searchParams={Object.fromEntries(searchParams.entries())} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        activeFilterCount={activeFilterCount()}
      />
    </main>
  );
}
