"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Car } from "@/lib/api";
import { useCompare } from "@/lib/compare-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
    car: Car;
    discountPercent?: number;
}


export default function ProductCard({ car, discountPercent = 0 }: ProductCardProps) {
    const { addCarToCompare, isInCompare, removeCarFromCompare } = useCompare();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [showToast, setShowToast] = useState<string | null>(null);

    const isSelected = isInCompare(car.id);
    const inWishlist = isInWishlist(car.id);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const finalPrice = discountPercent > 0 ? car.price * (1 - discountPercent / 100) : car.price;

    const handleCompareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isSelected) {
            removeCarFromCompare(car.id);
        } else {
            addCarToCompare(car);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            id: car.id,
            name: car.name,
            price: finalPrice,
            image: car.thumbnail,
            slug: car.slug,
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
            });
            setShowToast("Đã thêm vào yêu thích!");
        }
        setTimeout(() => setShowToast(null), 2000);
    };

    return (
        <div className="group block bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full shadow-lg animate-bounce">
                    {showToast}
                </div>
            )}

            {/* Image Container */}
            <Link href={`/cars/${car.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-900">
                <Image
                    src={car.thumbnail}
                    alt={car.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {car.type === 'motorcycle' && (
                        <span className="px-3 py-1 bg-primary/90 text-black text-xs font-bold rounded-full backdrop-blur-sm">
                            Xe Máy Điện
                        </span>
                    )}
                    {car.type === 'bicycle' && (
                        <span className="px-3 py-1 bg-green-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                            Xe Đạp Điện
                        </span>
                    )}
                </div>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                            -{discountPercent}%
                        </span>
                    </div>
                )}

                {/* Wishlist Button - Floating */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-3 right-3 ${discountPercent > 0 ? 'top-14' : 'top-3'} w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${inWishlist
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-black/40 hover:bg-black/60 text-white border border-white/20 shadow-lg'
                        }`}
                    title={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
            </Link>

            {/* Content */}
            <div className="p-5">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{car.brand}</div>
                <Link href={`/cars/${car.slug}`}>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {car.name}
                    </h3>
                </Link>

                <div className="flex items-end justify-between mt-4">
                    <div>
                        <div className={`text-lg font-bold ${discountPercent > 0 ? 'text-red-500' : 'text-primary'}`}>
                            {formatPrice(finalPrice)}
                        </div>
                        {discountPercent > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                                {formatPrice(car.price)}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-9 h-9 rounded-full bg-primary hover:bg-accent text-black flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                            title="Thêm vào giỏ hàng"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </button>

                        {/* Compare Button */}
                        <button
                            onClick={handleCompareClick}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isSelected
                                ? 'bg-primary text-black hover:bg-red-500 hover:text-white'
                                : 'bg-white/10 hover:bg-white hover:text-black'
                                }`}
                            title={isSelected ? "Bỏ so sánh" : "Thêm vào so sánh"}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </button>

                        {/* View Details Button */}
                        <Link
                            href={`/cars/${car.slug}`}
                            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors"
                            title="Xem chi tiết"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

