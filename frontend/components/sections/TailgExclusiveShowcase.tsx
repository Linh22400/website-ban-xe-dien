'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Shield, Gift, Truck, ArrowRight } from 'lucide-react';
import { useTheme, ThemeText } from '@/components/common/ThemeText';
import { TailgExclusiveBadge } from '@/components/ui/TailgBadge';

export default function TailgExclusiveShowcase() {
    const isDark = useTheme();
    const [currentImage, setCurrentImage] = useState(0);

    // Featured TAILG products (you can fetch from API later)
    const featuredProducts = [
        {
            name: 'TAILG M3 Pro',
            image: '/images/placeholder-motorcycle.svg', // Placeholder
            price: '15.990.000đ',
            features: ['Chạy 80km', 'Tốc độ 50km/h', 'Sạc nhanh 4h']
        }
    ];

    const benefits = [
        {
            icon: Sparkles,
            title: 'Ưu Đãi Độc Quyền',
            description: 'Giảm giá đặc biệt cho khách hàng'
        },
        {
            icon: Shield,
            title: 'Bảo Hành Chính Hãng',
            description: 'Cam kết bảo hành toàn diện'
        },
        {
            icon: Truck,
            title: 'Giao Hàng Miễn Phí',
            description: 'Free ship toàn quốc'
        },
        {
            icon: Gift,
            title: 'Quà Tặng Đặc Biệt',
            description: 'Phụ kiện cao cấp kèm theo'
        }
    ];

    return (
        <section className="py-16 relative overflow-hidden">
            {/* Background gradient */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: isDark
                        ? 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1), transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 229, 255, 0.1), transparent 50%)'
                        : 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.08), transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 229, 255, 0.08), transparent 50%)'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header with Badge */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                            <TailgExclusiveBadge />
                            <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            TAILG - Thương Hiệu Độc Quyền
                        </h2>

                        <ThemeText className="text-lg max-w-2xl mx-auto opacity-90">
                            Chúng tôi tự hào là đại lý ủy quyền chính hãng TAILG tại Việt Nam
                        </ThemeText>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Left: Product Showcase */}
                        <div
                            className="relative rounded-3xl p-8 backdrop-blur-xl border shadow-2xl overflow-hidden group"
                            style={{
                                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                                borderColor: isDark ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                                boxShadow: isDark
                                    ? '0 25px 50px -12px rgba(255, 215, 0, 0.2)'
                                    : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            {/* Animated gradient overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.1), transparent 70%)'
                                }}
                            />

                            <div className="relative z-10">
                                {/* Product Image Placeholder */}
                                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                                    <div className="text-center">
                                        <ThemeText className="text-6xl mb-2">🏍️</ThemeText>
                                        <ThemeText className="text-sm opacity-60">TAILG Featured Product</ThemeText>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                        TAILG M3 Pro
                                    </h3>
                                    <p className="text-3xl font-black mb-4" style={{ color: isDark ? '#FFD700' : '#B8860B' }}>
                                        15.990.000đ
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                                        {['Chạy 80km', 'Tốc độ 50km/h', 'Sạc nhanh 4h'].map((feature, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full border"
                                                style={{
                                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                                    borderColor: isDark ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                                                    color: isDark ? '#FFD700' : '#B8860B'
                                                }}
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Benefits Grid */}
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-md border transition-all hover:scale-[1.02] cursor-pointer"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05))'
                                        }}
                                    >
                                        <benefit.icon className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1" style={{ color: isDark ? '#FFD700' : '#B8860B' }}>
                                            {benefit.title}
                                        </h4>
                                        <ThemeText className="text-sm opacity-80">
                                            {benefit.description}
                                        </ThemeText>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-12">
                        <Link
                            href="/cars?brand=TAILG"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-black rounded-xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all"
                        >
                            <span className="text-lg">Khám Phá Bộ Sưu Tập TAILG</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
