import { getCarsBySlugs } from "@/lib/api";
import ComparisonTable from "@/components/compare/ComparisonTable";
import ComparisonSearch from "@/components/compare/ComparisonSearch";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        cars?: string;
    }>
}

export default async function ComparePage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const carSlugs = resolvedSearchParams.cars?.split(",").filter(Boolean) || [];

    const cars = await getCarsBySlugs(carSlugs);

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            {/* Header */}
            <div className="bg-secondary/30 border-b border-white/5 py-12 mb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        So Sánh Xe
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                        <span>/</span>
                        <span className="text-white">So Sánh</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <p className="text-muted-foreground">
                        Đang so sánh <span className="text-white font-bold">{cars.length}</span> / 3 xe
                    </p>
                    <ComparisonSearch />
                </div>

                <div className="bg-card/30 border border-white/5 rounded-3xl overflow-hidden">
                    <ComparisonTable cars={cars} />
                </div>
            </div>
        </main>
    );
}
