"use client";

import { Car } from "@/lib/api";
import { motion } from "framer-motion";
import ProductGallery from "./ProductGallery";
import { ProductHeading, StatValue } from './ProductTextComponents';
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { BadgeCheck, Phone, ShoppingCart, Truck, CreditCard, FileText, Shield, Award, Users } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import SocialShare from "./SocialShare";
import CustomerSupportContact from "./CustomerSupportContact";
import { useEffect, useMemo, useState } from "react";

interface ProductHeroProps {
    car: Car;
    selectedColor: number;
    onColorChange: (index: number) => void;
    discountPercent?: number;
}

export default function ProductHero({ car, selectedColor, onColorChange, discountPercent = 0 }: ProductHeroProps) {
    // 1. Determine Selected Variant
    const selectedVariant = car.colors?.[selectedColor];

    // 2. Options Logic
    // Group options
    const optionsByGroup = useMemo(() => {
        if (!car.options || car.options.length === 0) return {};
        const groups: Record<string, typeof car.options> = {};
        car.options.forEach(opt => {
            if (!groups[opt.group]) groups[opt.group] = [];
            groups[opt.group].push(opt);
        });
        return groups;
    }, [car.options]);

    // Initialize selected options
    const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});

    useEffect(() => {
        if (!car.options) return;
        const initialSelection: Record<string, any> = {};
        Object.keys(optionsByGroup).forEach(group => {
            // Default to first option
            if (optionsByGroup[group] && optionsByGroup[group].length > 0) {
                initialSelection[group] = optionsByGroup[group][0];
            }
        });
        setSelectedOptions(initialSelection);
    }, [car.options, optionsByGroup]);

    // 3. Price Logic
    // If variant has specific price, use it; otherwise fallback to base car price.
    const basePrice = selectedVariant?.price || car.price;
    // Add options price adjustment
    const optionsPrice = Object.values(selectedOptions).reduce((sum: number, opt: any) => sum + (opt?.priceAdjustment || 0), 0);
    const originalPrice = basePrice + optionsPrice;
    
    const finalPrice = discountPercent > 0 ? originalPrice * (1 - discountPercent / 100) : originalPrice;

    // 4. Stock Logic
    // If variant has specific stock, use it; otherwise fallback to base car stock.
    // Check if stock is a finite number.
    const stockToCheck = (selectedVariant?.stock !== undefined && selectedVariant?.stock !== null) 
        ? selectedVariant.stock 
        : car.stock;
    const inStock = Number.isFinite(stockToCheck) ? stockToCheck > 0 : true;

    const { addToCart } = useCart();
    const router = useRouter();

    // Generate product URL for sharing
    const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : (process.env.NEXT_PUBLIC_SITE_URL || 'https://xedienviet.com');
    const productUrl = `${baseUrl}/cars/${car.slug}`;

    const handleAddToCart = () => {
        if (!inStock) return;
        // Get current color's images
        const currentColorImages = selectedVariant?.images || [];
        const galleryImages = currentColorImages.length > 0
            ? currentColorImages
            : (selectedVariant?.images || [car.thumbnail]);
        
        let colorName = selectedVariant?.name || 'Mặc định';
        
        // Append options to colorName to make it unique in cart
        const optionNames = Object.values(selectedOptions).map((opt: any) => opt.name).join(', ');
        if (optionNames) {
            colorName = `${colorName} (${optionNames})`;
        }

        addToCart({
            id: car.id,
            name: car.name,
            price: finalPrice,
            originalPrice: discountPercent > 0 ? originalPrice : undefined,
            image: galleryImages[0],
            gallery: galleryImages,
            colorName: colorName,
            slug: car.slug
        });

        // Navigate to cart
        router.push("/cart");
    };

    const handleBuyNow = () => {
        if (!inStock) return;
        // Add to cart then redirect to checkout
        const currentColorImages = selectedVariant?.images || [];
        const galleryImages = currentColorImages.length > 0
            ? currentColorImages
            : (selectedVariant?.images || [car.thumbnail]);
        
        let colorName = selectedVariant?.name || 'Mặc định';

        // Append options to colorName to make it unique in cart
        const optionNames = Object.values(selectedOptions).map((opt: any) => opt.name).join(', ');
        if (optionNames) {
            colorName = `${colorName} (${optionNames})`;
        }

        addToCart({
            id: car.id,
            name: car.name,
            price: finalPrice,
            originalPrice: discountPercent > 0 ? originalPrice : undefined,
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
            <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/4" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            label: car.type === 'bicycle' ? 'Xe Đạp Điện' : 'Xe Máy Điện',
                            href: `/cars?type=${car.type}`
                        },
                        {
                            label: car.brand,
                            href: `/cars?brand=${car.brand}`
                        },
                        {
                            label: car.name
                        }
                    ]}
                />

                <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 items-start">
                    {/* Left Content - Product Info */}
                    <div className="space-y-8 order-2 lg:order-1 min-w-0">
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
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                        inStock
                                            ? 'bg-primary/10 border-primary/20 text-primary'
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                                >
                                    {inStock ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>

                            {/* Trust Signals Row */}
                            <div className="flex flex-wrap items-center gap-4 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                                {car.warranty && (
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold text-foreground">
                                            BH {String(typeof car.warranty === 'string' ? car.warranty : (car.warranty?.duration || '12 tháng'))}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-semibold text-foreground">
                                        Chính hãng 100%
                                    </span>
                                </div>
                                {Number.isFinite(car.sold) && (car.sold as number) > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold text-foreground">
                                            Đã bán {car.sold}+ xe
                                        </span>
                                    </div>
                                )}
                            </div>

                            <ProductHeading>
                                {car.name}
                            </ProductHeading>

                            {/* Social Share */}
                            <SocialShare url={productUrl} title={car.name} />

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
                            className="space-y-5"
                        >
                             {/* Product Options */}
                            {Object.keys(optionsByGroup).length > 0 && (
                                <div className="space-y-4 pb-4">
                                    {Object.entries(optionsByGroup).map(([group, options]) => (
                                        <div key={group}>
                                            <h3 className="text-sm font-semibold text-foreground mb-2">{group === 'Battery' ? 'Loại Ắc quy / Pin' : group === 'Version' ? 'Phiên bản' : group}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {options.map((opt: any) => {
                                                    const isSelected = selectedOptions[group]?.name === opt.name;
                                                    return (
                                                        <button
                                                            key={opt.name}
                                                            onClick={() => setSelectedOptions(prev => ({ ...prev, [group]: opt }))}
                                                            className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                                                                isSelected
                                                                    ? 'bg-primary/20 border-primary text-primary font-medium'
                                                                    : 'bg-card/30 border-white/10 text-muted-foreground hover:bg-card/50'
                                                            }`}
                                                        >
                                                            {opt.name}
                                                            {opt.priceAdjustment > 0 && (
                                                                <span className="ml-1 text-xs opacity-80">
                                                                    (+{opt.priceAdjustment.toLocaleString('vi-VN')}₫)
                                                                </span>
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                {discountPercent > 0 && (
                                    <div className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full mb-2">
                                        GIẢM {discountPercent}%
                                    </div>
                                )}
                                <div className="text-sm text-muted-foreground mb-1">Giá bán</div>
                                <div className={`text-4xl font-bold ${discountPercent > 0 ? 'text-red-500' : 'text-primary'}`}>
                                    {finalPrice.toLocaleString('vi-VN')}₫
                                </div>
                                {discountPercent > 0 && (
                                    <div className="text-lg text-gray-500 line-through mt-1">
                                        {originalPrice.toLocaleString('vi-VN')}₫
                                    </div>
                                )}
                                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                    <BadgeCheck className="w-4 h-4 text-primary" />
                                    <span>
                                        {car.brand?.toLowerCase() === 'tailg'
                                            ? 'Đại lý ủy quyền TAILG'
                                            : 'Hỗ trợ đăng ký & bảo hành chính hãng'}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground max-w-xl">
                                    Giá lẻ tham khảo; VAT/đăng ký tính theo quy định tại thời điểm giao xe. Đặt cọc linh hoạt, tư vấn trước khi thanh toán.
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!inStock}
                                    className={`px-5 py-3 bg-transparent border-2 font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2 flex-1 sm:flex-none sm:min-w-[160px] ${
                                        inStock
                                            ? 'border-primary text-primary hover:bg-primary/10'
                                            : 'border-white/10 text-muted-foreground cursor-not-allowed opacity-60'
                                    }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="whitespace-nowrap">Thêm Vào Giỏ</span>
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!inStock}
                                    className={`px-6 py-3 font-bold rounded-full transition-all shadow-lg flex-1 sm:flex-none text-center sm:min-w-[140px] ${
                                        inStock
                                            ? 'bg-primary text-black hover:bg-white hover:scale-105 shadow-primary/20'
                                            : 'bg-card/50 text-muted-foreground border border-white/10 cursor-not-allowed opacity-60 shadow-none'
                                    }`}
                                >
                                    <span className="whitespace-nowrap">Mua Ngay</span>
                                </button>
                            </div>

                            {!inStock && (
                                <button
                                    onClick={() => router.push('/contact')}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                                >
                                    <Phone className="w-4 h-4" />
                                    Liên hệ để đặt trước / hỏi tồn kho
                                </button>
                            )}

                            {/* Commerce info (shipping, installment, registration) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                                <div className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-card/30">
                                    <Truck className="w-5 h-5 text-primary mt-0.5" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-foreground">Giao hàng</div>
                                        <div className="text-xs text-muted-foreground">2-5 ngày</div>
                                        <div className="text-xs text-primary font-semibold mt-0.5">Miễn phí nội thành</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-card/30">
                                    <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-foreground">Trả góp</div>
                                        <div className="text-xs text-muted-foreground">0% lãi suất</div>
                                        <div className="text-xs text-primary font-semibold mt-0.5">Duyệt nhanh 15 phút</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-card/30">
                                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-semibold text-foreground">Thủ tục</div>
                                        <div className="text-xs text-muted-foreground">{car.type === 'motorcycle' ? 'Hỗ trợ đăng ký/ra biển số' : 'Tư vấn đăng ký theo quy định'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Support Contact */}
                            <CustomerSupportContact />
                        </motion.div>
                    </div>

                    {/* Right Content - Gallery */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="order-1 lg:order-2 w-full min-w-0"
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