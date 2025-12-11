"use client";

import HeroSlider from "../hero/HeroSlider";
import QuickFinder from "../hero/QuickFinder";

export default function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-background pt-24 pb-12 md:pt-32 md:pb-20">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-6 md:gap-8 h-full">
                    {/* Left: Slider (8 cols) */}
                    <div className="lg:col-span-8 w-full">
                        <HeroSlider />
                    </div>

                    {/* Right: Quick Finder (4 cols) */}
                    <div className="lg:col-span-4 w-full h-full">
                        <QuickFinder />
                    </div>
                </div>

                {/* Trust Indicators (Bottom Bar) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                    {[
                        { icon: "🚀", title: "Giao Hàng Hỏa Tốc", desc: "Nội thành trong 2h" },
                        { icon: "🛡️", title: "Bảo Hành Chính Hãng", desc: "Lên đến 3 năm" },
                        { icon: "💳", title: "Trả Góp 0%", desc: "Thủ tục đơn giản" },
                        { icon: "🔧", title: "Bảo Dưỡng Tận Nơi", desc: "Đội ngũ chuyên nghiệp" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card/30 border border-border backdrop-blur-sm hover:bg-card/50 transition-colors">
                            <div className="text-3xl">{item.icon}</div>
                            <div>
                                <div className="font-bold text-foreground text-sm md:text-base">{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
