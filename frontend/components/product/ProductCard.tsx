"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Car } from "@/lib/api";
import { useCompare } from "@/lib/compare-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Heart, ShoppingCart } from "lucide-react";
import ColorPicker from "./ColorPicker";
import ProductBadge from "@/components/common/ProductBadge";
import { getProductBadge, getAllProductBadges } from "@/lib/product-badge";

interface ProductCardProps {
    car: Car;
    discountPercent?: number;
    priority?: boolean;
    sizes?: string;
}

export default function ProductCard({ 
    car, 
    discountPercent = 0, 
    priority = false,
    sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
}: ProductCardProps) {
    const { addCarToCompare, isInCompare, removeCarFromCompare } = useCompare();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [showToast, setShowToast] = useState<string | null>(null);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);

    const isSelected = isInCompare(car.documentId || car.id);
    const inWishlist = isInWishlist(car.documentId || car.id);

    // Filter valid colors
    const validColors = (car.colors || []).filter(c => c && c.name);

    // Get selected color data
    const selectedColor = validColors?.[selectedColorIndex] || validColors?.[0];
    const displayImage = selectedColor?.images?.[0] || car.thumbnail;

    // Price Logic - Use variant price if available
    const originalPrice = selectedColor?.price || car.price;
    const finalPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;

    // Check if product has any badge to display and count them
    const badgeMetrics = {
        ...car,
        discount: discountPercent,
        originalPrice: discountPercent > 0 ? originalPrice / (1 - discountPercent / 100) : undefined
    };
    const badges = getAllProductBadges(badgeMetrics);
    const badgeCount = badges.length;
    const hasBadge = badgeCount > 0;



    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleCompareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isSelected) {
            removeCarFromCompare(car.id);
        } else {
            const ok = addCarToCompare(car);
            if (!ok) {
                setShowToast("Bạn chỉ có thể so sánh tối đa 3 xe.");
                setTimeout(() => setShowToast(null), 2000);
            }
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        // Get images from selected color
        const colorImages = selectedColor?.images || [];
        const gallery = colorImages.length > 0 ? colorImages : [car.thumbnail];

        addToCart({
            id: car.documentId || car.id,
            name: car.name,
            price: finalPrice,
            originalPrice: discountPercent > 0 ? originalPrice : undefined,
            image: gallery[0],
            gallery: gallery,
            colorName: selectedColor?.name || "Mặc định",
            slug: car.slug,
            type: 'vehicle'
        });
        setShowToast("Đã thêm vào giỏ hàng!");
        setTimeout(() => setShowToast(null), 2000);
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (inWishlist) {
            removeFromWishlist(car.id);
            setShowToast("Đã xóa khỏi yêu thích!");
        } else {
            addToWishlist({
                id: car.id,
                name: car.name,
                price: finalPrice,
                image: car.thumbnail,
                slug: car.slug,
                type: 'vehicle'
            });
            setShowToast("Đã thêm vào yêu thích!");
        }
        setTimeout(() => setShowToast(null), 2000);
    };

    return (
        <div className="group block bg-white dark:bg-card rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full shadow-lg">
                    {showToast}
                </div>
            )}

            {/* Image Container */}
            <Link href={`/cars/${car.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
                {displayImage ? (
                    <Image
                        src={displayImage}
                        alt={car.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ willChange: 'transform' }}
                        priority={priority}
                        quality={80} // Optimal balance
                        sizes={sizes}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                        <span className="text-sm text-neutral-400">No Image</span>
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges - Top Left: Type */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {car.type === 'motorcycle' && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/50 border border-white/20 backdrop-blur-sm">
                            Xe Máy Điện
                        </span>
                    )}
                    {car.type === 'bicycle' && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-red-700 via-rose-600 to-pink-700 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/50 border border-white/20 backdrop-blur-sm">
                            Xe Đạp Điện
                        </span>
                    )}
                </div>

                {/* Dynamic Product Badges - Top Right */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none z-10">
                    <ProductBadge
                        product={{
                            ...car,
                            discount: discountPercent,
                            originalPrice: discountPercent > 0 ? car.price / (1 - discountPercent / 100) : undefined
                        }}
                        size="md"
                        showAll={true}
                        className="flex-col items-end gap-1.5"
                    />
                </div>

                {/* Wishlist Button - Dynamic position based on badge presence */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${inWishlist
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
                        : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 shadow-lg backdrop-blur-sm'
                        }`}
                    style={{ 
                        top: hasBadge ? `${12 + (badgeCount * 28) + 8}px` : '12px' 
                    }}
                    title={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                    aria-label={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
            </Link>

            {/* Content */}
            <div className="p-5">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{car.brand}</div>
                <Link href={`/cars/${car.slug}`}>
                    <h3 className={`text-xl font-bold mb-2 transition-all duration-300 line-clamp-1 relative inline-block ${car.type === 'motorcycle' ? 'text-emerald-700 dark:text-emerald-400' :
                        car.type === 'bicycle' ? 'text-rose-700 dark:text-rose-400' :
                            'text-primary'
                        } group-hover:scale-105 group-hover:tracking-wide`}>
                        {car.name}
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${car.type === 'motorcycle' ? 'bg-emerald-500' :
                            car.type === 'bicycle' ? 'bg-rose-500' :
                                'bg-primary'
                            }`}></span>
                    </h3>
                </Link>

                {/* Color Picker */}
                {validColors && validColors.length > 1 && (
                    <div className="mb-3">
                        <ColorPicker
                            colors={validColors}
                            selectedIndex={selectedColorIndex}
                            onSelectColor={setSelectedColorIndex}
                            size="small"
                            maxDisplay={5}
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">
                            Màu: <span className={`font-medium ${car.type === 'motorcycle' ? 'text-emerald-700 dark:text-emerald-400' :
                                car.type === 'bicycle' ? 'text-rose-700 dark:text-rose-400' :
                                    'text-primary'
                                }`}>{selectedColor?.name}</span>
                        </p>
                    </div>
                )}

                <div className="flex items-end justify-between mt-4">
                    <div>
                        <div className={`text-lg font-bold ${discountPercent > 0 ? 'text-red-600 dark:text-red-500' :
                            car.type === 'motorcycle' ? 'text-emerald-700 dark:text-emerald-400' :
                                car.type === 'bicycle' ? 'text-rose-700 dark:text-rose-400' :
                                    'text-primary'
                            }`}>
                            {formatPrice(finalPrice)}
                        </div>
                        {discountPercent > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                                {formatPrice(originalPrice)}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className={`w-9 h-9 rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 shadow-lg ${car.type === 'motorcycle' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/50' :
                                car.type === 'bicycle' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/50' :
                                    'bg-primary hover:bg-accent shadow-primary/50'
                                }`}
                            style={{ willChange: 'transform' }}
                            title="Thêm vào giỏ hàng"
                            aria-label={`Thêm ${car.name} vào giỏ hàng`}
                        >
                            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                        </button>

                        {/* Compare Button */}
                        <button
                            onClick={handleCompareClick}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isSelected
                                ? (car.type === 'motorcycle' ? 'bg-emerald-500 text-white hover:bg-red-500' :
                                    car.type === 'bicycle' ? 'bg-rose-500 text-white hover:bg-red-500' :
                                        'bg-primary text-black hover:bg-red-500 hover:text-white')
                                : 'bg-white/10 hover:bg-white hover:text-black'
                                }`}
                            title={isSelected ? "Bỏ so sánh" : "Thêm vào so sánh"}
                            aria-label={isSelected ? `Bỏ ${car.name} khỏi so sánh` : `Thêm ${car.name} vào so sánh`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </button>

                        {/* View Details Button */}
                        <Link
                            href={`/cars/${car.slug}`}
                            className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-colors ${car.type === 'motorcycle' ? 'group-hover:bg-emerald-500 group-hover:text-white' :
                                car.type === 'bicycle' ? 'group-hover:bg-rose-500 group-hover:text-white' :
                                    'group-hover:bg-primary group-hover:text-black'
                                }`}
                            title="Xem chi tiết"
                            aria-label={`Xem chi tiết ${car.name}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

