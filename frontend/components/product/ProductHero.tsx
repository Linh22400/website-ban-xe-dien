"use client";

import { Car } from "@/lib/api";
import { motion } from "framer-motion";
import ProductGallery from "./ProductGallery";
import { ProductHeading, StatValue } from './ProductTextComponents';
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface ProductHeroProps {
    car: Car;
    selectedColor: number;
    onColorChange: (index: number) => void;
    discountPercent?: number;
}

export default function ProductHero({ car, selectedColor, onColorChange, discountPercent = 0 }: ProductHeroProps) {
    const finalPrice = discountPercent > 0 ? car.price * (1 - discountPercent / 100) : car.price;
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = () => {
        // Get current color's images
        const currentColorImages = car.colors?.[selectedColor]?.images || [];
        const galleryImages = currentColorImages.length > 0
            ? currentColorImages
            : (car.colors?.[selectedColor]?.images || [car.thumbnail]);
        const colorName = car.colors?.[selectedColor]?.name || 'Mặc định';

        addToCart({
            id: car.id,
            name: car.name,
            price: finalPrice,
            originalPrice: discountPercent > 0 ? car.price : undefined,
            image: galleryImages[0],
            gallery: galleryImages,
            colorName: colorName,
            slug: car.slug
        });

        // Navigate to cart
        router.push("/cart");
    };

    const handleBuyNow = () => {
        // Add to cart then redirect to checkout
        const currentColorImages = car.colors?.[selectedColor]?.images || [];
        const galleryImages = currentColorImages.length > 0
            ? currentColorImages
            : (car.colors?.[selectedColor]?.images || [car.thumbnail]);
        const colorName = car.colors?.[selectedColor]?.name || 'Mặc định';

        addToCart({
            id: car.id,
            name: car.name,
            price: finalPrice,
            originalPrice: discountPercent > 0 ? car.price : undefined,
            image: galleryImages[0],
            gallery: galleryImages,
            colorName: colorName,
            slug: car.slug
        });

        router.push("/checkout");
    };

    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
            <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content - Product Info */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold tracking-wide uppercase">
                                    {car.type === 'bicycle' ? 'Xe Đạp Điện' : 'Xe Máy Điện'}
                                </span>
                                <span className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                                    {car.brand}
                                </span>
                            </div>

                            <ProductHeading>
                                {car.name}
                            </ProductHeading>

                            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                                {car.description}
                            </p>
                        </motion.div>

                        {/* Key Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid grid-cols-3 gap-6 py-8 border-y border-white/10"
                        >
                            <div>
                                <StatValue className="mb-1">{car.range}</StatValue>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Km / Lần sạc</div>
                            </div>
                            <div>
                                <StatValue className="mb-1">{car.topSpeed}</StatValue>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Km/h Tối đa</div>
                            </div>
                            <div>
                                <StatValue className="mb-1">
                                    {car.acceleration > 0 ? car.acceleration : 'N/A'}
                                </StatValue>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Giây 0-50km/h</div>
                            </div>
                        </motion.div>

                        {/* Price & CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col xl:flex-row items-start xl:items-center gap-6"
                        >
                            <div className="flex-shrink-0">
                                {discountPercent > 0 && (
                                    <div className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full mb-2 animate-pulse">
                                        GIẢM {discountPercent}%
                                    </div>
                                )}
                                <div className="text-sm text-muted-foreground mb-1">Giá bán</div>
                                <div className={`text-4xl font-bold ${discountPercent > 0 ? 'text-red-500' : 'text-primary'}`}>
                                    {finalPrice.toLocaleString('vi-VN')}₫
                                </div>
                                {discountPercent > 0 && (
                                    <div className="text-lg text-gray-500 line-through mt-1">
                                        {car.price.toLocaleString('vi-VN')}₫
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                                <button
                                    onClick={handleAddToCart}
                                    className="px-6 py-4 bg-transparent border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/10 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Thêm Vào Giỏ</span>
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    className="px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg shadow-primary/20 flex-1 sm:flex-none text-center min-w-[160px]"
                                >
                                    Mua Ngay
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content - Gallery */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="order-1 lg:order-2"
                    >
                        <ProductGallery
                            car={car}
                            selectedColor={selectedColor}
                            onColorChange={onColorChange}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
