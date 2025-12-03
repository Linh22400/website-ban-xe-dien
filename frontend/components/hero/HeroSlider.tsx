"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroSlides, HeroSlide } from "@/lib/api";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";

const STATIC_SLIDES = [
    {
        id: 1,
        title: "VinFast Klara S",
        subtitle: "Công Nghệ Tiên Phong",
        desc: "Thiết kế Ý, công nghệ Châu Âu. Trải nghiệm lái xe thông minh chưa từng có.",
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
        color: "from-primary to-blue-600",
        link: "/cars/vin-fast-klara-s"
    },
    {
        id: 2,
        title: "Yadea G5",
        subtitle: "Thiết Kế Tương Lai",
        desc: "Phong cách tối giản, màn hình LCD 7 inch, định vị GPS chính xác.",
        image: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=1200",
        color: "from-purple-500 to-pink-600",
        link: "/cars"
    },
    {
        id: 3,
        title: "Pega New Tech",
        subtitle: "Sức Mạnh Vượt Trội",
        desc: "Tốc độ tối đa 60km/h, quãng đường 90km/lần sạc. Bứt phá mọi giới hạn.",
        image: "https://images.unsplash.com/photo-1620802051782-48f874814d0a?auto=format&fit=crop&q=80&w=1200",
        color: "from-orange-500 to-red-600",
        link: "/cars"
    }
];

export default function HeroSlider() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHeroSlides()
            .then(data => {
                if (data.length > 0) setSlides(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setSlides(prevSlides => {
                const total = prevSlides.length > 0 ? prevSlides.length : STATIC_SLIDES.length;
                if (total > 0 && !loading) {
                    setCurrentSlide((prev) => (prev + 1) % total);
                }
                return prevSlides;
            });
        }, 6000); // Slower interval for better readability
        return () => clearInterval(timer);
    }, [loading]);

    const displaySlides = slides.length > 0 ? slides : STATIC_SLIDES;

    if (loading && slides.length === 0) {
        return (
            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-card/30 animate-pulse flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[600px] lg:h-[700px] rounded-3xl overflow-hidden group border border-white/10 shadow-2xl">
            {displaySlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image */}
                    <Image
                        src={slide.image}
                        alt={slide.title || "Hero Banner"}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />

                    {/* Gradient Overlay - Enhanced for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center p-8 md:p-16 lg:p-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="max-w-2xl space-y-8 transform translate-y-8 opacity-0 transition-all duration-700 delay-100"
                            style={{ opacity: index === currentSlide ? 1 : 0, transform: index === currentSlide ? 'translateY(0)' : 'translateY(2rem)' }}>

                            {/* USP / Subtitle */}
                            {slide.subtitle && (
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r ${slide.color || 'from-primary to-blue-600'} text-white text-sm font-bold shadow-lg shadow-primary/20 backdrop-blur-sm`}>
                                        <Zap className="w-4 h-4 fill-current" />
                                        {slide.subtitle}
                                    </span>
                                </div>
                            )}

                            {/* Title */}
                            {slide.title && (
                                <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                                    {slide.title}
                                </h2>
                            )}

                            {/* Description */}
                            {slide.desc && (
                                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl border-l-4 border-primary/50 pl-6">
                                    {slide.desc}
                                </p>
                            )}

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                {slide.link && (
                                    <Link
                                        href={slide.link}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-bold text-lg rounded-xl hover:bg-white transition-all hover:scale-105 shadow-lg shadow-primary/25"
                                    >
                                        Xem Xe Ngay
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                                <Link
                                    href="/lai-thu"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                                >
                                    Đăng Ký Lái Thử
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-8 left-8 md:left-24 flex gap-3 z-20">
                {displaySlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? "w-12 bg-primary" : "w-3 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)}
                    className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % displaySlides.length)}
                    className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

