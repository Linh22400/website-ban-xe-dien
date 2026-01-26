"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHeroSlides, getPromotions } from "@/lib/api";
import { SlideType } from "@/lib/hero-data";
import { resolveBannerLink } from "@/lib/banner-link-resolver";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Clock, ShieldCheck } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { useTheme } from "@/components/common/ThemeText";
import { motion, AnimatePresence } from "framer-motion";

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

    // Ensure all slides have slideType property
    // If loading is true (fetching client side) or slides is empty, use STATIC_SLIDES
    // But if we have initialSlides, use those.
    const displaySlides: SlideType[] = slides.length > 0
        ? slides
        : (loading ? STATIC_SLIDES.map(s => ({ ...s, slideType: 'hero' as const })) : STATIC_SLIDES.map(s => ({ ...s, slideType: 'hero' as const })));

    // Manual navigation handler
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000);
    };

    // Auto-advance logic driven by animation completion
    const handleAutoNext = () => {
        setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    };

    if (displaySlides.length === 0) return null;

    const currentSlideData = displaySlides[currentSlide];

    // Resolve link for global click
    let globalLink = currentSlideData.link;
    try {
        if (currentSlideData.link) {
            const parsed = JSON.parse(currentSlideData.link);
            if (parsed.type && parsed.target) {
                globalLink = resolveBannerLink(parsed);
            }
        }
    } catch {
        globalLink = currentSlideData.link;
    }

    return (
        <div
            className="relative w-full h-[500px] md:h-auto md:aspect-[21/9] lg:h-[600px] rounded-[2rem] overflow-hidden group border border-white/10 shadow-2xl bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Global Link Overlay for Mobile/Touch - z-10 ensures it sits below navigation buttons (z-30) but above background (z-0) */}
            {globalLink && (
                <Link 
                    href={globalLink}
                    className="absolute inset-0 z-10 cursor-pointer"
                    aria-label={`Go to ${currentSlideData.title}`}
                />
            )}

            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 z-0 bg-neutral-900"
                >
                    {/* Background Color/Gradient Fallback */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.color || 'from-neutral-800 to-black'}`} />

                    {/* Main Image - Resized to Contain (Sharp & Full) */}
                    <div className="absolute inset-0 z-10">
                        <Image
                            src={currentSlideData.image}
                            alt={currentSlideData.title || "Hero Banner"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            quality={85}
                            className="object-contain object-center"
                            priority={currentSlide === 0}
                        />
                    </div>

                    {/* Gradient Overlay - Adjusted for visibility */}
                    <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/90 via-black/50 via-40% to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Bottom Gradient for controls visibility */}
                    <div className="absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
            </AnimatePresence>

            {/* Content Content */}
            <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
                <div className="container mx-auto px-6 md:px-12 h-full flex items-center">
                    <div className="max-w-xl md:max-w-xl lg:max-w-[45%] space-y-6 pt-10 md:pt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={currentSlide}
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {/* Badge */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg shadow-black/20"
                                >
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${currentSlideData.slideType === 'promotion' ? 'bg-red-500' : 'bg-primary'}`} />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        {currentSlideData.slideType === 'promotion' ? 'Khuyến Mãi Hot' : (currentSlideData.subtitle || 'Tiêu Điểm')}
                                    </span>
                                </motion.div>

                                {/* Title */}
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
                                    {currentSlideData.title}
                                </h2>

                                {/* Description */}
                                <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed max-w-lg line-clamp-3 drop-shadow-md font-medium text-shadow">
                                    {currentSlideData.slideType === 'hero' 
                                        ? currentSlideData.desc 
                                        : (currentSlideData.description || 'Cơ hội sở hữu xe điện với mức giá ưu đãi nhất trong năm.')}
                                </p>

                                {/* Buttons */}
                                <div className="flex flex-wrap gap-4">
                                    {currentSlideData.link && (() => {
                                         let finalLink = currentSlideData.link;
                                         try {
                                             const parsed = JSON.parse(currentSlideData.link);
                                             if (parsed.type && parsed.target) {
                                                 finalLink = resolveBannerLink(parsed);
                                             }
                                         } catch {
                                             finalLink = currentSlideData.link;
                                         }

                                         return (
                                            <Link
                                                href={finalLink}
                                                className="group relative px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/30 flex items-center gap-3 overflow-hidden pointer-events-auto"
                                            >
                                                <span className="relative z-10">Khám Phá Ngay</span>
                                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                            </Link>
                                         );
                                    })()}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons - Visible on hover or touch */}
            <div className="absolute inset-y-0 left-4 z-30 flex items-center transition-opacity duration-300 pointer-events-none">
                <button 
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-4 z-30 flex items-center transition-opacity duration-300 pointer-events-none">
                <button 
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Promotion Overlay (if applicable) - Repositioned to not block text or main image subject */}
            {currentSlideData.slideType === 'promotion' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-2 right-2 md:top-6 md:right-6 z-30 block opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 scale-[0.65] md:scale-100 origin-top-right pointer-events-none md:pointer-events-auto"
                >
                    <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-4 md:p-5 rounded-2xl shadow-2xl max-w-[280px]">
                        {currentSlideData.discountTag ? (
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                                    <Zap className="w-5 h-5 text-white fill-current" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-300 uppercase font-bold tracking-wider">Ưu đãi độc quyền</div>
                                    <div className="text-sm font-black text-white line-clamp-1">{currentSlideData.discountTag}</div>
                                </div>
                            </div>
                        ) : null}

                        {currentSlideData.expiryDate ? (
                             <div className="space-y-1">
                                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Kết thúc trong
                                </div>
                                <CountdownTimer expiryDate={currentSlideData.expiryDate} />
                             </div>
                        ) : null}
                    </div>
                </motion.div>
            )}

            {/* Progress Bar & Indicators */}
            <div className="absolute bottom-6 left-0 right-0 z-30">
                <div className="container mx-auto px-8 md:px-12">
                    <div className="flex items-center justify-between">
                        {/* Dots */}
                        <div className="flex items-center gap-3">
                            {displaySlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`group relative h-2 rounded-full transition-all duration-500 ${
                                        index === currentSlide ? 'w-12 bg-primary' : 'w-2 bg-white/30 hover:bg-white/60'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                >
                                    {index === currentSlide && !isPaused && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/30 rounded-full"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 6, ease: "linear", repeat: 0 }}
                                            onAnimationComplete={handleAutoNext}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Slide Counter */}
                        <div className="text-white/60 text-sm font-mono hidden md:block bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                            <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
                            <span className="mx-1">/</span>
                            <span>{String(displaySlides.length).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
