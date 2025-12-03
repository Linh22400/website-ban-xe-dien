"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAccessories, Accessory } from "@/lib/api";
import { ArrowRight, Battery, Wrench, Plug, ShieldAlert } from "lucide-react";

export default function FeaturedAccessories() {
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAccessories()
            .then(data => {
                // Get first 4 accessories
                setAccessories(data.slice(0, 4));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading || accessories.length === 0) return null;

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

    return (
        <section className="py-20 px-6 bg-background">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Phụ Kiện & Pin
                        </h2>
                        <p className="text-muted-foreground">
                            Bộ sạc, pin dự phòng và phụ kiện chính hãng
                        </p>
                    </div>
                    <Link
                        href="/accessories"
                        className="group flex items-center gap-2 text-primary hover:text-white transition-colors"
                    >
                        <span className="font-semibold">Xem tất cả</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {accessories.map((accessory) => (
                        <Link
                            key={accessory.id}
                            href={`/accessories/${accessory.slug}`}
                            className="group bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                        >
                            {/* Image */}
                            <div className="relative aspect-square bg-white/5">
                                <Image
                                    src={accessory.image}
                                    alt={accessory.name}
                                    fill
                                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-primary/90 backdrop-blur-sm text-black text-xs font-semibold rounded-full">
                                    {getCategoryIcon(accessory.category)}
                                    <span>{getCategoryLabel(accessory.category)}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {accessory.name}
                                </h3>

                                {accessory.description && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {accessory.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="text-xl font-bold text-primary">
                                        {formatPrice(accessory.price)}
                                    </div>
                                    <div className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                                        Xem chi tiết →
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
