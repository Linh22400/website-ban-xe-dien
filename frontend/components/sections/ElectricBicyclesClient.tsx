"use client";

import Link from "next/link";
import { Car } from "@/lib/api";
import ProductCard from "../product/ProductCard";
import { ArrowRight, Leaf } from "lucide-react";

interface ElectricBicyclesClientProps {
    initialBicycles: Car[];
    initialDiscounts: Record<string, number>;
}

export default function ElectricBicyclesClient({
    initialBicycles,
    initialDiscounts
}: ElectricBicyclesClientProps) {
    if (initialBicycles.length === 0) return null;

    return (
        <section className="py-4 relative overflow-hidden bg-background">
             {/* Decorative Elements */}
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-500">
                                <Leaf className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-bold text-green-500 uppercase tracking-wider">Thân Thiện Môi Trường</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Xe Đạp Điện <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Thông Minh</span>
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                            Di chuyển nhẹ nhàng, thiết kế nhỏ gọn và tích hợp công nghệ trợ lực tiên tiến.
                        </p>
                    </div>
                    
                    <Link
                        href="/cars?type=bicycle"
                        className="group flex items-center gap-3 px-6 py-3 rounded-full border border-green-500/20 hover:border-green-500/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-green-500/5"
                    >
                        <span className="font-semibold text-sm">Xem tất cả</span>
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:mx-0 md:px-0 no-scrollbar">
                    {initialBicycles.map((car, index) => {
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
