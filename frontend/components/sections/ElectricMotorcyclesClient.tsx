"use client";

import Link from "next/link";
import { Car } from "@/lib/api";
import ProductCard from "../product/ProductCard";
import { ArrowRight } from "lucide-react";

interface ElectricMotorcyclesClientProps {
    initialMotorcycles: Car[];
    initialDiscounts: Record<string, number>;
}

export default function ElectricMotorcyclesClient({ 
    initialMotorcycles,
    initialDiscounts 
}: ElectricMotorcyclesClientProps) {
    if (initialMotorcycles.length === 0) return null;

    return (
        <section className="py-20 px-6 bg-background">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-foreground">
                            Xe Máy Điện
                        </h2>
                        <p className="text-muted-foreground">
                            Mạnh mẽ, hiện đại và tiết kiệm
                        </p>
                    </div>
                    <Link
                        href="/cars?type=motorcycle"
                        className="group flex items-center gap-2 font-semibold transition-colors"
                        style={{
                            color: '#00b8d4'
                        }}
                        onMouseEnter={(e) => {
                            const isDark = document.documentElement.classList.contains('dark');
                            e.currentTarget.style.color = isDark ? '#ffffff' : '#374151';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#00b8d4';
                        }}
                    >
                        Xem tất cả
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {initialMotorcycles.map((car) => {
                        const discountPercent = initialDiscounts[car.id] || initialDiscounts[car.documentId || ''] || 0;
                        return (
                            <ProductCard
                                key={car.id}
                                car={car}
                                discountPercent={discountPercent}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
