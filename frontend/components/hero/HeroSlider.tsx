"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroSlides, getPromotions, HeroSlide, Promotion } from "@/lib/api";
import { resolveBannerLink } from "@/lib/banner-link-resolver";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Clock } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { useTheme } from "@/components/common/ThemeText";

const STATIC_SLIDES = [
    {
        id: 1,
        title: "Tự Do Khám Phá",
        subtitle: "Hành Trình Mới",
        desc: "Khám phá thế giới với dòng xe điện TAILG thế hệ mới. Vận hành êm ái, thân thiện môi trường.",
        image: "/images/hero-1.jpg",
        link: "/cars?brand=TAILG",
        color: "from-emerald-600/90 to-teal-900/90",
        order: 1
    },
    {
        id: 2,
        title: "Công Nghệ Đỉnh Cao",
        subtitle: "Tiên Phong Xu Hướng",
        desc: "Trải nghiệm công nghệ pin thông minh và động cơ hiệu suất cao. Sạc 1 lần, đi cả tuần.",
        image: "/images/hero-2.jpg",
        link: "/technology",
        color: "from-blue-600/90 to-indigo-900/90",
        order: 2
    },
    {
        id: 3,
        title: "Ưu Đãi Đặc Biệt",
        subtitle: "Mùa Hè Sôi Động",
        desc: "Giảm ngay 2.000.000đ khi mua xe máy điện trong tháng này. Tặng kèm mũ bảo hiểm cao cấp.",
        image: "/images/hero-3.jpg",
        link: "/promotions",
        color: "from-rose-600/90 to-red-900/90",
        order: 3
    }
];

type SlideType = (HeroSlide | Promotion) & { slideType: 'hero' | 'promotion' };

interface HeroSliderProps {
    initialSlides?: SlideType[];
}

export default function HeroSlider({ initialSlides = [] }: HeroSliderProps) {
    const isDark = useTheme();
    const [slides, setSlides] = useState<SlideType[]>(initialSlides.length > 0 ? initialSlides : []);
    const [currentSlide, setCurrentSlide] = useState(0);
    // Only load if no initial slides provided
    const [loading, setLoading] = useState(initialSlides.length === 0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        // Only fetch if we didn't receive initial slides
        if (initialSlides.length > 0) return;

        Promise.all([getHeroSlides(), getPromotions()])
            .then(([heroData, promoData]) => {
                // Prioritize TAILG promotions
                const sortedPromos = promoData.sort((a, b) => {
                    const aTailg = a.title?.toLowerCase().includes('tailg') ? 1 : 0;
                    const bTailg = b.title?.toLowerCase().includes('tailg') ? 1 : 0;
                    return bTailg - aTailg;
                }).slice(0, 2); // Max 2 promotion slides

                // Merge slides (60% hero, 40% promo)
                const mergedSlides: SlideType[] = [];
                const heroSlides: SlideType[] = heroData.map(s => ({ ...s, slideType: 'hero' as const }));
                const promoSlides: SlideType[] = sortedPromos.map(s => ({ ...s, slideType: 'promotion' as const }));

                if (heroSlides.length > 0 && promoSlides.length > 0) {
                    // Interleave: hero, hero, promo, hero, promo pattern
                    const totalSlides = heroSlides.length + promoSlides.length;
                    let heroIndex = 0;
                    let promoIndex = 0;

                    for (let i = 0; i < totalSlides; i++) {
                        if (i % 3 === 2 && promoIndex < promoSlides.length) {
                            mergedSlides.push(promoSlides[promoIndex++]);
                        } else if (heroIndex < heroSlides.length) {
                            mergedSlides.push(heroSlides[heroIndex++]);
                        }
                    }
                    setSlides(mergedSlides);
                } else {
                    setSlides([...heroSlides, ...promoSlides]);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [initialSlides.length]);

    // Auto-advance timer (pauses on hover or manual navigation)
    useEffect(() => {
        if (isPaused) return; // Don't auto-advance if paused

        const timer = setInterval(() => {
            setSlides(prevSlides => {
                const total = prevSlides.length > 0 ? prevSlides.length : STATIC_SLIDES.length;
                if (total > 0 && !loading) {
                    setCurrentSlide((prev) => (prev + 1) % total);
                }
                return prevSlides;
            });
        }, 6000);
        return () => clearInterval(timer);
    }, [loading, isPaused]);

    // Manual navigation handler
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsPaused(true); // Pause auto-advance after manual navigation
        // Resume after 10 seconds
        setTimeout(() => setIsPaused(false), 10000);
    };

    // Ensure all slides have slideType property
    // If loading is true (fetching client side) or slides is empty, use STATIC_SLIDES
    // But if we have initialSlides, use those.
    const displaySlides: SlideType[] = slides.length > 0
        ? slides
        : (loading ? STATIC_SLIDES.map(s => ({ ...s, slideType: 'hero' as const })) : STATIC_SLIDES.map(s => ({ ...s, slideType: 'hero' as const })));

    return (
        <div
            className="relative w-full aspect-[16/7] max-h-[85vh] rounded-3xl overflow-hidden group border border-white/10 shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {displaySlides.map((slide, index) => (
                <div
                    key={`${slide.slideType}-${slide.id}`}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    style={{ willChange: 'opacity' }}
                >
                    {/* Click target (no text overlay) */}
                    {slide.link && (() => {
                        // Parse link if it's JSON string (smart banner format)
                        let finalLink = slide.link;
                        try {
                            const parsed = JSON.parse(slide.link);
                            if (parsed.type && parsed.target) {
                                finalLink = resolveBannerLink(parsed);
                            }
                        } catch {
                            // Not JSON, use as-is
                            finalLink = slide.link;
                        }

                        return (
                            <Link
                                href={finalLink}
                                className="absolute inset-0 z-20"
                                aria-label={slide.title ? `Xem chi tiết: ${slide.title}` : 'Xem chi tiết'}
                            >
                                <span className="sr-only">Xem chi tiết</span>
                            </Link>
                        );
                    })()}

                    {/* Background Image (clean, realistic) */}
                    <Image
                        src={slide.image}
                        alt={slide.title || "Hero Banner"}
                        fill
                        sizes="100vw"
                        quality={90}
                        className={`${slide.link ? 'cursor-pointer' : ''} object-contain object-center bg-background`}
                        priority={index === 0}
                    />

                    {/* Promotions: show only essential timing info (small, non-intrusive) */}
                    {slide.slideType === 'promotion' && (
                        <div className="absolute top-5 left-5 z-30 max-w-[320px] rounded-2xl border border-white/15 bg-black/55 p-4">
                            {'discountTag' in slide && slide.discountTag ? (
                                <div className="flex items-center gap-2 text-white text-sm font-bold mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="line-clamp-1">{slide.discountTag}</span>
                                </div>
                            ) : null}

                            {'expiryDate' in slide && slide.expiryDate ? (
                                <div>
                                    <div className="text-xs text-white/80 mb-2">Thời gian còn lại</div>
                                    <CountdownTimer expiryDate={slide.expiryDate} />
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-8 left-8 md:left-24 flex gap-3 z-20">
                {displaySlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${index === currentSlide ? "w-12 bg-primary" : "w-3 bg-white/30 hover:bg-white/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                <button
                    onClick={() => goToSlide((currentSlide - 1 + displaySlides.length) % displaySlides.length)}
                    className="p-3 rounded-full bg-black/50 text-white border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-colors duration-300"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() => goToSlide((currentSlide + 1) % displaySlides.length)}
                    className="p-3 rounded-full bg-black/50 text-white border border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-colors duration-300"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

