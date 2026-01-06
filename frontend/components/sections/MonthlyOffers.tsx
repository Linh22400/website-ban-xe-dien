"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getPromotions, Promotion } from "@/lib/api";

export default function MonthlyOffers() {
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        getPromotions()
            .then(data => {
                if (data.length > 0) {
                    // Sort to prioritize TAILG promotions
                    const sortedPromotions = data.sort((a, b) => {
                        const aTailg = a.title?.toLowerCase().includes('tailg') ? 1 : 0;
                        const bTailg = b.title?.toLowerCase().includes('tailg') ? 1 : 0;
                        return bTailg - aTailg;
                    });
                    setPromotion(sortedPromotions[0]); // Get highest priority promotion
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!promotion?.expiryDate) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(promotion.expiryDate!).getTime();
            const distance = expiry - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [promotion]);

    // Loading skeleton
    if (loading) {
        return (
            <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2 space-y-6">
                            <div className="h-10 w-32 bg-gray-700/20 rounded-full animate-pulse" />
                            <div className="h-12 w-full bg-gray-700/20 rounded animate-pulse" />
                            <div className="h-6 w-3/4 bg-gray-700/20 rounded animate-pulse" />
                            <div className="flex gap-4">
                                <div className="h-12 w-32 bg-gray-700/20 rounded-full animate-pulse" />
                                <div className="h-12 w-32 bg-gray-700/20 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <div className="aspect-[4/3] bg-gray-700/20 rounded-3xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!promotion) return null;

    return (
        <section className="py-20 px-6 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Text Content */}
                    <div className="md:w-1/2 space-y-6">
                        {promotion.discountTag && (
                            <div className="inline-block px-4 py-2 bg-red-500 text-white font-bold rounded-full">
                                {promotion.discountTag}
                            </div>
                        )}
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            {promotion.title}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            {promotion.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={promotion.link}
                                className="px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors shadow-lg hover:shadow-primary/50 text-center"
                            >
                                Xem Chi Tiết
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 border border-border text-foreground font-bold rounded-full hover:bg-muted transition-colors text-center"
                            >
                                Liên Hệ Tư Vấn
                            </Link>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 relative">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                            <Image
                                src={promotion.image}
                                alt={promotion.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                style={{ willChange: 'transform' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                quality={100}
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Countdown Timer */}
                            {promotion.expiryDate && (
                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                    <div>
                                        <div className="text-sm text-gray-300 mb-1">Thời gian còn lại</div>
                                        <div className="flex gap-2 text-center">
                                            <div className="bg-white/10 rounded-lg p-2 min-w-[40px]">
                                                <div className="text-xl font-bold text-foreground">{String(timeLeft.days).padStart(2, '0')}</div>
                                                <div className="text-[10px] text-gray-400">Ngày</div>
                                            </div>
                                            <div className="bg-white/10 rounded-lg p-2 min-w-[40px]">
                                                <div className="text-xl font-bold text-foreground">{String(timeLeft.hours).padStart(2, '0')}</div>
                                                <div className="text-[10px] text-gray-400">Giờ</div>
                                            </div>
                                            <div className="bg-white/10 rounded-lg p-2 min-w-[40px]">
                                                <div className="text-xl font-bold text-foreground">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                                <div className="text-[10px] text-gray-400">Phút</div>
                                            </div>
                                            <div className="bg-white/10 rounded-lg p-2 min-w-[40px]">
                                                <div className="text-xl font-bold text-foreground">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                                <div className="text-[10px] text-gray-400">Giây</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Floating Badge */}
                        {timeLeft.days <= 3 && timeLeft.days > 0 && (
                            <div className="absolute -top-6 -right-6 bg-yellow-400 text-black font-bold w-24 h-24 rounded-full flex items-center justify-center rotate-12 shadow-lg">
                                <div className="text-center leading-tight">
                                    <div className="text-xs">CHỈ CÒN</div>
                                    <div className="text-2xl">{timeLeft.days}</div>
                                    <div className="text-xs">NGÀY</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
