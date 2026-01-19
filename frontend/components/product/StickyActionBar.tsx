"use client";

import { Car } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart } from "lucide-react";

interface StickyActionBarProps {
    car: Car;
    selectedColorName: string;
    selectedColorIndex: number;
    discountPercent?: number;
}

export default function StickyActionBar({ car, selectedColorName, selectedColorIndex, discountPercent = 0 }: StickyActionBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const finalPrice = discountPercent > 0 ? car.price * (1 - discountPercent / 100) : car.price;
    const { addToCart } = useCart();
    const router = useRouter();

    const tickingRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;
            window.requestAnimationFrame(() => {
                // Show bar after scrolling past 500px
                const nextVisible = window.scrollY > 500;
                setIsVisible((prev) => (prev === nextVisible ? prev : nextVisible));
                tickingRef.current = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAddToCart = () => {
        // Get current color's images
        const currentColorImages = car.colors?.[selectedColorIndex]?.images || [];
        const galleryImages = currentColorImages.length > 0
            ? currentColorImages
            : (car.colors?.[selectedColorIndex]?.images || [car.thumbnail]);

        addToCart({
            id: car.documentId || car.id,
            name: car.name,
            price: finalPrice,
            originalPrice: discountPercent > 0 ? car.price : undefined,
            image: galleryImages[0],
            gallery: galleryImages,
            colorName: selectedColorName,
            slug: car.slug,
            type: 'vehicle'
        });

        // Navigate to cart
        router.push("/cart");
    };

    const handleBuyNow = () => {
        const currentColorImages = car.colors?.[selectedColorIndex]?.images || [];
        const galleryImages = currentColorImages.length > 0
            ? currentColorImages
            : (car.colors?.[selectedColorIndex]?.images || [car.thumbnail]);

        addToCart({
            id: car.id,
            name: car.name,
            price: finalPrice,
            originalPrice: discountPercent > 0 ? car.price : undefined,
            image: galleryImages[0],
            gallery: galleryImages,
            colorName: selectedColorName,
            slug: car.slug,
            type: 'vehicle'
        });

        router.push("/checkout");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-white/10 py-4 px-4 shadow-2xl"
                >
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="hidden md:block">
                            <h3 className="text-lg font-bold text-foreground">{car.name}</h3>
                            <p className="text-sm text-muted-foreground">Màu: {selectedColorName}</p>
                        </div>

                        <div className="flex items-center gap-4 ml-auto md:ml-0 w-full md:w-auto">
                            <div className="text-right mr-2 hidden sm:block">
                                <div className="text-xs text-muted-foreground">Tổng cộng</div>
                                <div className={`text-xl font-bold ${discountPercent > 0 ? 'text-red-500' : 'text-primary'}`}>
                                    {finalPrice.toLocaleString('vi-VN')}₫
                                </div>
                                {discountPercent > 0 && (
                                    <div className="text-xs text-gray-500 line-through">
                                        {car.price.toLocaleString('vi-VN')}₫
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 md:flex-none gap-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 px-4 py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/10 transition-colors text-center flex items-center gap-2 justify-center"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Thêm vào giỏ
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 px-4 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors text-center"
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
