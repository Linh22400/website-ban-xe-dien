"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessories, Accessory } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { ArrowRight, Battery, Wrench, Plug, ShieldAlert, Heart, ShoppingCart } from "lucide-react";
import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";

export default function FeaturedAccessories() {
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState<{ id: number; message: string } | null>(null);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        getAccessories()
            .then(data => {
                // Get first 4 accessories
                setAccessories(data.slice(0, 4));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // ...

    if (loading) return <SectionGridSkeleton count={4} titleWidth="w-48" />;
    if (accessories.length === 0) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'battery':
                return <Battery className="w-5 h-5" />;
            case 'charger':
                return <Plug className="w-5 h-5" />;
            case 'helmet':
                return <ShieldAlert className="w-5 h-5" />;
            default:
                return <Wrench className="w-5 h-5" />;
        }
    };

    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            battery: 'Pin',
            charger: 'Bộ sạc',
            helmet: 'Mũ bảo hiểm',
            other: 'Phụ kiện'
        };
        return labels[category] || 'Phụ kiện';
    };

    const handleAddToCart = (accessory: Accessory, e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            id: accessory.id,
            name: accessory.name,
            price: accessory.price,
            image: accessory.image,
            slug: accessory.slug,
            gallery: [accessory.image], // Single image as gallery
            colorName: "Mặc định" // Accessories don't have color variants
        });
        setToastMessage({ id: accessory.id, message: "Đã thêm vào giỏ hàng!" });
        setTimeout(() => setToastMessage(null), 2000);
    };

    const handleWishlistClick = (accessory: Accessory, e: React.MouseEvent) => {
        e.preventDefault();
        const inWishlist = isInWishlist(accessory.id);
        if (inWishlist) {
            removeFromWishlist(accessory.id);
            setToastMessage({ id: accessory.id, message: "Đã xóa khỏi yêu thích!" });
        } else {
            addToWishlist({
                id: accessory.id,
                name: accessory.name,
                price: accessory.price,
                image: accessory.image,
                slug: accessory.slug,
            });
            setToastMessage({ id: accessory.id, message: "Đã thêm vào yêu thích!" });
        }
        setTimeout(() => setToastMessage(null), 2000);
    };

    return (
        <section className="py-4 relative overflow-hidden bg-background">
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-500">
                                <Plug className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-bold text-cyan-500 uppercase tracking-wider">Tiện Ích & An Toàn</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Phụ Kiện <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Chính Hãng</span>
                        </h2>
                        <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                            Nâng cấp trải nghiệm lái xe với bộ sưu tập phụ kiện chất lượng cao, từ pin dự phòng đến mũ bảo hiểm an toàn.
                        </p>
                    </div>

                    <Link
                        href="/accessories"
                        className="group flex items-center gap-3 px-6 py-3 rounded-full border border-cyan-500/20 hover:border-cyan-500/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-cyan-500/5"
                    >
                        <span className="font-semibold text-sm">Xem tất cả</span>
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pb-8 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    {accessories.map((accessory, index) => {
                        const inWishlist = isInWishlist(accessory.id);
                        const showToast = toastMessage?.id === accessory.id;

                        return (
                            <div
                                key={accessory.id}
                                className="flex-shrink-0 w-[80vw] sm:w-auto snap-center group relative bg-card rounded-3xl border border-border/50 hover:border-cyan-500/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
                                style={{
                                    animationDelay: `${index * 100}ms`
                                }}
                            >
                                {/* Toast Notification */}
                                {showToast && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-cyan-600 text-white text-sm font-bold rounded-full shadow-lg whitespace-nowrap">
                                        {toastMessage?.message}
                                    </div>
                                )}

                                {/* Image Area */}
                                <Link href={`/accessories/${accessory.slug}`} className="block relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <Image
                                        src={accessory.image}
                                        alt={accessory.name}
                                        fill
                                        className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md text-cyan-600 dark:text-cyan-400 text-xs font-bold rounded-full shadow-sm border border-black/5 dark:border-white/10">
                                        {getCategoryIcon(accessory.category)}
                                        <span>{getCategoryLabel(accessory.category)}</span>
                                    </div>

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={(e) => handleWishlistClick(accessory, e)}
                                        className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md ${inWishlist
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
                                            : 'bg-white/90 dark:bg-black/90 text-muted-foreground hover:text-red-500 hover:scale-110'
                                            }`}
                                        title={inWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                                    >
                                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                                    </button>
                                </Link>

                                {/* Info Area */}
                                <div className="p-5">
                                    <Link href={`/accessories/${accessory.slug}`} className="block mb-2">
                                        <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-cyan-500 transition-colors">
                                            {accessory.name}
                                        </h3>
                                    </Link>

                                    {accessory.description && (
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                                            {accessory.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Giá bán</span>
                                            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                                                {formatPrice(accessory.price)}
                                            </span>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={(e) => handleAddToCart(accessory, e)}
                                            className="group/btn relative w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-all hover:w-28 hover:bg-cyan-600 overflow-hidden shadow-lg hover:shadow-cyan-500/25"
                                            title="Thêm vào giỏ hàng"
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center transition-transform group-hover/btn:-translate-x-full">
                                                <ShoppingCart className="w-5 h-5" />
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center translate-x-full group-hover/btn:translate-x-0 transition-transform font-bold text-xs uppercase tracking-wide text-white">
                                                Mua ngay
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
