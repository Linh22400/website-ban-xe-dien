'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Bike, TrendingUp, Sparkles, Clock, Shield, DollarSign, Headphones, Award } from 'lucide-react';
import { useTheme, ThemeText } from '@/components/common/ThemeText';
import { TailgOfficialBadge } from '@/components/ui/TailgBadge';
import ProductCard from '@/components/product/ProductCard';
import type { Car, Promotion } from '@/lib/api';

interface TailgProductGridClientProps {
    initialMotorcycles?: Car[];
    initialBicycles?: Car[];
    initialBestSellers?: Car[];
    initialNewArrivals?: Car[];
    initialPromotionCars?: Car[];
    initialPromotions?: Promotion[];
    initialDiscountMap?: Record<string, number>;
}

export default function TailgProductGridClient({
    initialMotorcycles = [],
    initialBicycles = [],
    initialBestSellers = [],
    initialNewArrivals = [],
    initialPromotionCars = [],
    initialPromotions = [],
    initialDiscountMap = {}
}: TailgProductGridClientProps) {
    const isDark = useTheme();
    const [activeTab, setActiveTab] = useState<'motorcycle' | 'bicycle' | 'promotion' | 'bestseller' | 'new'>('motorcycle');
    const [products, setProducts] = useState<Car[]>(initialMotorcycles);
    const [loading, setLoading] = useState(false);
    const [discountMap, setDiscountMap] = useState<Record<string, number>>(initialDiscountMap);

    const tabs = [
        { id: 'promotion' as const, label: 'Khuyến Mãi', icon: Sparkles },
        { id: 'bestseller' as const, label: 'Bán Chạy', icon: TrendingUp },
        { id: 'new' as const, label: 'Mới Ra Mắt', icon: Clock },
        { id: 'motorcycle' as const, label: 'Xe Máy Điện', icon: Zap },
        { id: 'bicycle' as const, label: 'Xe Đạp Điện', icon: Bike }
    ];

    useEffect(() => {
        if (activeTab === 'motorcycle') {
            setProducts(initialMotorcycles);
        } else if (activeTab === 'bicycle') {
            setProducts(initialBicycles);
        } else if (activeTab === 'bestseller') {
            setProducts(initialBestSellers);
        } else if (activeTab === 'new') {
            setProducts(initialNewArrivals);
        } else if (activeTab === 'promotion') {
            // Need to transform promotion cars to match Car interface if they are partial
            // Or just assume they are close enough for ProductCard
            setProducts(initialPromotionCars);
        }
    }, [activeTab, initialMotorcycles, initialBicycles, initialBestSellers, initialNewArrivals, initialPromotionCars]);

    const reasons = [
        {
            icon: Award,
            title: 'Đại Lý Chính Hãng',
            description: 'Sản phẩm 100% chính hãng',
            color: 'from-yellow-500 to-yellow-700'
        },
        {
            icon: DollarSign,
            title: 'Giá Tốt Nhất',
            description: 'Cam kết giá cạnh tranh nhất',
            color: 'from-green-500 to-green-700'
        },
        {
            icon: Shield,
            title: 'Bảo Hành Ưu Đãi',
            description: 'Chính sách bảo hành mở rộng',
            color: 'from-blue-500 to-blue-700'
        },
        {
            icon: Headphones,
            title: 'Hỗ Trợ 24/7',
            description: 'Tư vấn chuyên nghiệp mọi lúc',
            color: 'from-emerald-500 to-emerald-700'
        },
        {
            icon: TrendingUp,
            title: 'Ưu Đãi Độc Quyền',
            description: 'Quà tặng và khuyến mãi riêng',
            color: 'from-pink-500 to-pink-700'
        },
        {
            icon: Clock,
            title: 'Giao Hàng Nhanh',
            description: 'Vận chuyển toàn quốc 24-48h',
            color: 'from-orange-500 to-orange-700'
        }
    ];

    // Ensure we have data even if server fetch failed (client-side fallback could be added here if needed,
    // but typically server fetch handles it or returns empty).
    // If we wanted to fetch on client when props are empty, we could add that logic.
    // For now, assuming server fetch works or returns empty.

    return (
        <section className="py-4 relative overflow-hidden">
            {/* Background decoration */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: isDark
                        ? 'linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.05), transparent)'
                        : 'linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.03), transparent)'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header - Enhanced with Exclusive Dealer Badge */}
                <div className="text-center mb-4">
                    {/* Badge Row */}
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                        <TailgOfficialBadge />
                        <div
                            className="px-4 py-1.5 rounded-full border font-bold text-xs"
                            style={{
                                backgroundColor: isDark ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 215, 0, 0.05)',
                                borderColor: isDark ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.2)',
                                color: isDark ? '#FFD700' : '#B8860B'
                            }}
                        >
                            🏆 ĐẠI LÝ ỦY QUYỀN ĐỘC QUYỀN
                        </div>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                    </div>

                    {/* Main Title */}
                    <h2 className="text-4xl md:text-5xl font-black mb-3">
                        <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            Bộ Sưu Tập TAILG Chính Hãng
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <ThemeText className="text-base max-w-2xl mx-auto opacity-90 mb-2">
                        Ủy quyền chính thức từ TAILG - Khám phá đa dạng mẫu xe điện
                    </ThemeText>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1.5 opacity-70">
                            <span>✨</span>
                            <ThemeText>Giá tốt nhất</ThemeText>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-70">
                            <span>🛡️</span>
                            <ThemeText>Bảo hành ưu đãi</ThemeText>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-70">
                            <span>🎁</span>
                            <ThemeText>Quà tặng độc quyền</ThemeText>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-start md:justify-center mb-8 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    <div
                        className="inline-flex p-1.5 rounded-xl gap-2 backdrop-blur-md border min-w-max"
                        role="tablist"
                        aria-label="Lọc sản phẩm theo danh mục"
                        style={{
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`panel-${tab.id}`}
                                id={`tab-${tab.id}`}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-4 md:px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                                        : (isDark ? 'hover:bg-white/10' : 'hover:bg-black/5')
                                    }
                                `}
                                style={{
                                    color: activeTab === tab.id
                                        ? '#000000'
                                        : (isDark ? '#9ca3af' : '#6b7280')
                                }}
                            >
                                <tab.icon className="w-4 h-4" aria-hidden="true" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div
                        role="tabpanel"
                        id={`panel-${activeTab}`}
                        aria-labelledby={`tab-${activeTab}`}
                        aria-busy="true"
                        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-4 sm:pb-0 scrollbar-hide"
                    >
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[70vw] sm:w-auto snap-center aspect-[3/4] rounded-2xl animate-pulse"
                                style={{
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                                }}
                            />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div
                        role="tabpanel"
                        id={`panel-${activeTab}`}
                        aria-labelledby={`tab-${activeTab}`}
                        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-4 sm:pb-0 scrollbar-hide"
                    >
                        {products.map((car, index) => {
                            const discount = discountMap[car.id.toString()] || discountMap[car.documentId || ''] || 0;
                            return (
                                <div key={car.id} className="flex-shrink-0 w-[70vw] sm:w-auto snap-center">
                                    <ProductCard
                                        car={car}
                                        discountPercent={discount}
                                        priority={index < 4} // Eager load first 4 images (desktop row)
                                        sizes="(max-width: 640px) 70vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        role="tabpanel"
                        id={`panel-${activeTab}`}
                        aria-labelledby={`tab-${activeTab}`}
                        className="text-center py-12"
                    >
                        <ThemeText className="text-lg opacity-60">
                            Đang cập nhật sản phẩm {tabs.find(t => t.id === activeTab)?.label}
                        </ThemeText>
                    </div>
                )}

                {/* View All Button */}
                <div className="text-center mt-12 mb-12">
                    <Link
                        href={
                            activeTab === 'promotion' ? '/promotions' :
                            activeTab === 'bestseller' ? '/cars?brand=TAILG&sort=sold:desc' :
                            activeTab === 'new' ? '/cars?brand=TAILG&sort=createdAt:desc' :
                            `/cars?brand=TAILG&type=${activeTab}`
                        }
                        className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border-2 font-bold transition-all hover:scale-105 hover:shadow-lg group"
                        aria-label={`Xem tất cả ${tabs.find(t => t.id === activeTab)?.label}`}
                        style={{
                            borderColor: isDark ? '#FFD700' : '#B8860B',
                            color: isDark ? '#FFD700' : '#B8860B'
                        }}
                    >
                        <span>Xem Tất Cả {tabs.find(t => t.id === activeTab)?.label}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                </div>

                {/* Commitments Section (Integrated) */}
                <div className="pt-8 border-t border-dashed"
                    style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {reasons.map((reason, index) => (
                            <div key={index} className="text-center group">
                                <div className={`w-12 h-12 mx-auto rounded-xl mb-3 flex items-center justify-center bg-gradient-to-br ${reason.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <reason.icon className="w-6 h-6 text-white" aria-hidden="true" />
                                </div>
                                <h3 className="font-bold text-sm mb-1" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                                    {reason.title}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {reason.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
