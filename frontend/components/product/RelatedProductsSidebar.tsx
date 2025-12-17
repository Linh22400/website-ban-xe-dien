"use client";

import { useEffect, useState } from "react";
import { Car, getCars } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface RelatedProductsSidebarProps {
    currentProductId: string;
    brand?: string;
    type?: 'bicycle' | 'motorcycle';
}

export default function RelatedProductsSidebar({
    currentProductId,
    brand,
    type: productType
}: RelatedProductsSidebarProps) {
    const [relatedProducts, setRelatedProducts] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // Fetch all products
                const allProducts = await getCars();

                // Filter logic:
                // 1. Same brand (priority)
                // 2. Same type
                // 3. Exclude current product
                const filtered = allProducts
                    .filter(p => p.id !== currentProductId)
                    .sort((a, b) => {
                        // Prioritize same brand
                        const aBrand = a.brand === brand ? 1 : 0;
                        const bBrand = b.brand === brand ? 1 : 0;
                        if (aBrand !== bBrand) return bBrand - aBrand;

                        // Then same type
                        const aType = a.type === productType ? 1 : 0;
                        const bType = b.type === productType ? 1 : 0;
                        return bType - aType;
                    })
                    .slice(0, 6); // Max 6 products

                setRelatedProducts(filtered);
            } catch (error) {
                console.error("Failed to fetch related products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentProductId, brand, productType]);

    if (loading) {
        return (
            <aside className="hidden lg:block sticky top-24 w-28 h-[calc(100vh-120px)] flex-shrink-0 z-30">
                <div className="flex items-center justify-center h-full bg-card/10 rounded-2xl border border-white/5">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </aside>
        );
    }

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <aside className="hidden lg:block sticky top-24 w-28 h-[calc(100vh-120px)] flex-shrink-0 z-30">
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-2 pb-32">
                {/* Vertical Product List */}
                <div className="space-y-6">
                    {relatedProducts.map((product, index) => (
                        <Link
                            key={product.id}
                            href={`/cars/${product.slug}`}
                            className="block group"
                            title={product.name}
                        >
                            {/* Thumbnail Container */}
                            <div className="relative w-20 h-20 mx-auto rounded-lg overflow-hidden bg-card/30 border border-white/10 group-hover:border-primary/50 transition-all">
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    sizes="80px"
                                />
                            </div>

                            {/* Product Name - Below Thumbnail */}
                            <div className="mt-2 text-center">
                                <p className="text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight px-0.5">
                                    {product.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
