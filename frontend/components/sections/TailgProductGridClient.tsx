'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { useTheme, ThemeText } from '@/components/common/ThemeText';
import { TailgOfficialBadge } from '@/components/ui/TailgBadge';
import ProductCard from '@/components/product/ProductCard';
import { getCars, getPromotions, type Car, type Promotion } from '@/lib/api';

interface TailgProductGridClientProps {
    initialProducts?: Car[];
    initialPromotions?: Promotion[];
    initialDiscountMap?: Record<string, number>;
}

export default function TailgProductGridClient({ 
    initialProducts = [],
    initialPromotions = [],
    initialDiscountMap = {}
}: TailgProductGridClientProps) {
    const isDark = useTheme();
    const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'promo'>('new');
    const [products, setProducts] = useState<Car[]>(initialProducts);
    const [loading, setLoading] = useState(!initialProducts.length);
    const [promotedCarIds, setPromotedCarIds] = useState<Set<string>>(new Set());
    const [discountMap, setDiscountMap] = useState<Record<string, number>>(initialDiscountMap);
    const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);

    const tabs = [
        { id: 'new' as const, label: 'Mới Nhất', icon: Sparkles },
        { id: 'bestseller' as const, label: 'Bán Chạy', icon: TrendingUp },
        { id: 'promo' as const, label: 'Khuyến Mãi', icon: Clock }
    ];

    // Initialize promoted car IDs from initial data
    useEffect(() => {
        if (initialPromotions.length > 0 && !promotedCarIds.size) {
            const promoCarIds = new Set<string>();
            initialPromotions.forEach(promo => {
                if (promo.isActive && promo.car_models) {
                    promo.car_models.forEach((car: any) => {
                        const carId = car.id?.toString() || car.documentId;
                        if (carId) promoCarIds.add(carId);
                    });
                }
            });
            setPromotedCarIds(promoCarIds);
        }
    }, [initialPromotions, promotedCarIds.size]);

    useEffect(() => {
        fetchTailgProducts();
    }, [activeTab]);

    const fetchTailgProducts = async () => {
        setLoading(true);
        try {
            // Fetch TAILG products based on active tab
            const params: any = {
                brand: 'TAILG',
                pageSize: activeTab === 'promo' ? 50 : 8 // Get more for promo filtering
            };

            if (activeTab === 'new') {
                params.sort = 'createdAt:desc';
            } else if (activeTab === 'bestseller') {
                params.sort = 'sold:desc';
            }

            const data = await getCars(params);
            
            // Fetch fresh promotions data (or use cached)
            let freshPromotions = promotions;
            if (promotions.length === 0) {
                freshPromotions = await getPromotions();
                setPromotions(freshPromotions);
            }
            
            // Build discount map
            const promoCarIds = new Set<string>();
            const discounts: Record<string, number> = {};
            
            freshPromotions.forEach(promo => {
                if (promo.isActive && promo.car_models && promo.discountPercent) {
                    promo.car_models.forEach((car: any) => {
                        const carId = car.id?.toString() || car.documentId;
                        if (carId) {
                            promoCarIds.add(carId);
                            const currentDiscount = discounts[carId] || 0;
                            discounts[carId] = Math.max(currentDiscount, promo.discountPercent || 0);
                        }
                    });
                }
            });
            
            setPromotedCarIds(promoCarIds);
            setDiscountMap(discounts);
            
            // For promo tab, filter only cars with active promotions
            if (activeTab === 'promo') {
                const filteredData = data.filter(car => 
                    promoCarIds.has(car.id.toString()) || promoCarIds.has(car.documentId || '')
                );
                setProducts(filteredData.slice(0, 8));
            } else {
                setProducts(data || []);
            }
        } catch (error) {
            console.error('Error fetching TAILG products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 relative overflow-hidden">
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
                <div className="text-center mb-12">
                    {/* Badge Row */}
                    <div className="inline-flex items-center gap-3 mb-6">
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
                <div className="flex justify-center mb-8">
                    <div
                        className="inline-flex p-1.5 rounded-xl gap-2 backdrop-blur-md border"
                        style={{
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2
                                    ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                                        : 'hover:bg-white/10'
                                    }
                                `}
                                style={{
                                    color: activeTab === tab.id
                                        ? '#000000'
                                        : (isDark ? '#9ca3af' : '#6b7280')
                                }}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[3/4] rounded-2xl animate-pulse"
                                style={{
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                                }}
                            />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {products.map((car) => {
                            const discount = discountMap[car.id.toString()] || discountMap[car.documentId || ''] || 0;
                            return (
                                <ProductCard 
                                    key={car.id} 
                                    car={car} 
                                    discountPercent={discount}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <ThemeText className="text-lg opacity-60">
                            Không tìm thấy sản phẩm TAILG
                        </ThemeText>
                    </div>
                )}

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/cars?brand=TAILG"
                        className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border-2 font-bold transition-all hover:scale-105 hover:shadow-lg group"
                        style={{
                            borderColor: isDark ? '#FFD700' : '#B8860B',
                            color: isDark ? '#FFD700' : '#B8860B'
                        }}
                    >
                        <span>Xem Tất Cả TAILG</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
