"use client";

import { useEffect, useState } from "react";
import { Car, getCars } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ThemeText } from "@/components/common/ThemeText";

interface RelatedProductsSidebarProps {
    currentProductId: string;
    brand?: string;
    type?: 'bicycle' | 'motorcycle';
    mode?: 'vertical' | 'horizontal';
}

export default function RelatedProductsSidebar({
    currentProductId,
    brand,
    type: productType,
    mode = 'vertical'
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
        if (mode === 'horizontal') return null;
        return (
            <aside className="sticky top-24 w-28 lg:w-36 h-[calc(100vh-120px)] flex-shrink-0 z-30 hidden lg:block">
                <div className="flex items-center justify-center h-full bg-card/10 rounded-2xl border border-white/5">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </aside>
        );
    }

    if (relatedProducts.length === 0) {
        return null;
    }

    // Horizontal Layout (Mobile Bottom)
    if (mode === 'horizontal') {
        return (
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                    <ThemeText className="text-lg font-bold uppercase tracking-wider">Sản phẩm tương tự</ThemeText>
                    <div className="h-0.5 flex-1 bg-primary/30"></div>
                </div>
                
                <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide -mx-4 px-4">
                    {relatedProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/cars/${product.slug}`}
                            className="flex-shrink-0 w-36 sm:w-44 snap-center group"
                        >
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-card/50 border border-white/10 group-hover:border-primary/50 transition-all mb-2">
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    className="object-cover p-2 group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                <ThemeText>{product.name}</ThemeText>
                            </h4>
                            <p className="text-xs font-bold text-primary mt-1">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // Vertical Layout (Desktop Sidebar)
    return (
        <aside className="sticky top-24 w-28 lg:w-36 h-[calc(100vh-120px)] flex-shrink-0 z-30 hidden lg:block">
            {/* Heading */}
            <div className="mb-4 text-center">
                <ThemeText className="text-[10px] lg:text-xs font-bold uppercase tracking-wider">Sản phẩm khác</ThemeText>
                <div className="w-8 h-0.5 bg-primary/50 mx-auto mt-1.5"></div>
            </div>

            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pr-1 lg:pr-2 pb-32">
                {/* Vertical Product List */}
                <div className="space-y-4 lg:space-y-6">
                    {relatedProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/cars/${product.slug}`}
                            className="block group"
                            title={product.name}
                        >
                            {/* Thumbnail Container */}
                            <div className="relative w-24 h-24 lg:w-28 lg:h-28 mx-auto rounded-lg overflow-hidden bg-card/30 border border-white/10 group-hover:border-primary/50 transition-all">
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    style={{ willChange: 'transform' }}
                                    sizes="(max-width: 1024px) 96px, 112px"
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
