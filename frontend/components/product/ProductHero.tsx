"use client";

import { Car } from "@/lib/api";
import { motion } from "framer-motion";
import ProductGallery from "./ProductGallery";

interface ProductHeroProps {
    car: Car;
    selectedColor: number;
    onColorChange: (index: number) => void;
    discountPercent?: number;
}

export default function ProductHero({ car, selectedColor, onColorChange, discountPercent = 0 }: ProductHeroProps) {
    const finalPrice = discountPercent > 0 ? car.price * (1 - discountPercent / 100) : car.price;
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

                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                                {car.name}
                            </h1>

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
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{car.range}</div>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Km / Lần sạc</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{car.topSpeed}</div>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Km/h Tối đa</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                    {car.acceleration > 0 ? car.acceleration : 'N/A'}
                                </div>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Giây 0-50km/h</div>
                            </div>
                        </motion.div>

                        {/* Price & CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                        >
                            <div>
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

                            <button
                                onClick={() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-primary hover:scale-105 transition-all shadow-lg shadow-white/10"
                            >
                                Đặt Mua Ngay
                            </button>
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
