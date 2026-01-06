import { getCarsBySlugs } from "@/lib/api";
import ComparisonTable from "@/components/compare/ComparisonTable";
import ComparisonSearch from "@/components/compare/ComparisonSearch";
import CompareUrlSync from "@/components/compare/CompareUrlSync";
import TCOComparison from "@/components/compare/TCOComparison";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        cars?: string;
    }>
}

export default async function ComparePage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const carSlugs = Array.from(
        new Set(resolvedSearchParams.cars?.split(",").map((s) => s.trim()).filter(Boolean) || [])
    ).slice(0, 3);

    const carsRaw = await getCarsBySlugs(carSlugs);
    const cars = carSlugs.length
        ? [...carsRaw].sort((a, b) => carSlugs.indexOf(a.slug) - carSlugs.indexOf(b.slug))
        : carsRaw;

    return (
        <main className="min-h-screen bg-background pb-20">
            <CompareUrlSync />
            {/* Header */}
            <div className="bg-secondary/30 border-b border-white/5 py-12 mb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        So Sánh Xe
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                        <span>/</span>
                        <span className="text-foreground">So Sánh</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <p className="text-muted-foreground">
                        Đang so sánh <span className="text-foreground font-semibold">{cars.length}</span> / 3 xe
                    </p>
                    <ComparisonSearch />
                </div>

                <div className="bg-card/30 border border-white/5 rounded-3xl overflow-hidden mb-12">
                    <ComparisonTable cars={cars} />
                </div>

                {/* TCO Comparison Section */}
                {cars.length >= 2 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
                            So Sánh Chi Phí Tổng Thể (TCO)
                        </h2>
                        <p className="text-muted-foreground text-center mb-8">
                            Phân tích chi phí sử dụng dài hạn để đưa ra quyết định thông minh
                        </p>
                        <TCOComparison cars={cars} />
                    </div>
                )}
            </div>
        </main>
    );
}
