"use client";

import { Car } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";

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

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling past 500px
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAddToCart = () => {
        // Get current color's images
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
            slug: car.slug
        });

        // Navigate to cart
        router.push("/cart");
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
                            <h3 className="text-lg font-bold text-white">{car.name}</h3>
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

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 md:flex-none px-8 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors text-center"
                            >
                                Thêm Vào Giỏ
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
