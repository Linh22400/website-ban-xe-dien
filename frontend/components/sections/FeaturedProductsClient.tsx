"use client";

import Link from "next/link";
import { Car } from "@/lib/api";
import ProductCard from "../product/ProductCard";
import { ArrowRight, Sparkles, Star } from "lucide-react";

interface FeaturedProductsClientProps {
    initialCars: Car[];
    initialDiscounts: Record<string, number>;
}

export default function FeaturedProductsClient({
    initialCars,
    initialDiscounts
}: FeaturedProductsClientProps) {
    if (initialCars.length === 0) return null;

    return (
        <section className="py-4 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-4 gap-6">
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">Bộ Sưu Tập Mới</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Sản Phẩm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Nổi Bật</span>
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                            Những mẫu xe điện được yêu thích nhất với thiết kế thời thượng và hiệu năng vượt trội.
                        </p>
                    </div>

                    <Link
                        href="/cars"
                        className="group flex items-center gap-3 px-6 py-3 rounded-full border border-primary/20 hover:border-primary/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-primary/5"
                    >
                        <span className="font-semibold text-sm">Xem tất cả</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:mx-0 md:px-0 no-scrollbar">
                    {initialCars.slice(0, 4).map((car, index) => {
                        const discountPercent = initialDiscounts[car.id] || initialDiscounts[car.documentId || ''] || 0;
                        return (
                            <div 
                                key={car.id} 
                                className="group/card min-w-[280px] md:min-w-0 snap-center"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                <ProductCard
                                    car={car}
                                    discountPercent={discountPercent}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
