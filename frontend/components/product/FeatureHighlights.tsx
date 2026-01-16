"use client";

import { Car } from "@/lib/api";
import { SectionHeading, FeatureTitle } from './ProductTextComponents';
import { Battery, Zap, Shield, Smartphone, Wind, Gauge } from "lucide-react";

interface FeatureHighlightsProps {
    car: Car;
}

export default function FeatureHighlights({ car }: FeatureHighlightsProps) {
    // Helper to map string icon names to components
    const getIcon = (name?: string, className: string = "w-8 h-8") => {
        const props = { className };
        if (!name) return <Zap {...props} className={`${className} text-primary`} />;
        
        switch (name.toLowerCase()) {
            case 'battery': return <Battery {...props} className={`${className} text-primary`} />;
            case 'zap': return <Zap {...props} className={`${className} text-yellow-500`} />;
            case 'shield': return <Shield {...props} className={`${className} text-green-500`} />;
            case 'smartphone': return <Smartphone {...props} className={`${className} text-purple-500`} />;
            case 'wind': return <Wind {...props} className={`${className} text-cyan-500`} />;
            case 'gauge': return <Gauge {...props} className={`${className} text-red-500`} />;
            default: return <Zap {...props} className={`${className} text-primary`} />;
        }
    };

    const defaultFeatures = [
        {
            icon: "battery",
            title: "Pin Lithium Cao Cấp",
            desc: "Công nghệ pin tiên tiến, tuổi thọ cao và sạc nhanh.",
            bg: "bg-blue-500/10"
        },
        {
            icon: "zap",
            title: "Động Cơ Mạnh Mẽ",
            desc: "Vận hành êm ái, tăng tốc mượt mà trên mọi địa hình.",
            bg: "bg-yellow-500/10"
        },
        {
            icon: "shield",
            title: "An Toàn Tuyệt Đối",
            desc: "Phanh đĩa cao cấp, khung xe chắc chắn đạt chuẩn.",
            bg: "bg-green-500/10"
        },
        {
            icon: "smartphone",
            title: "Kết Nối Thông Minh",
            desc: "Điều khiển qua App, định vị GPS và chống trộm.",
            bg: "bg-purple-500/10"
        },
        {
            icon: "wind",
            title: "Kháng Nước IP67",
            desc: "Yên tâm di chuyển dưới trời mưa và đường ngập.",
            bg: "bg-cyan-500/10"
        },
        {
            icon: "gauge",
            title: "Màn Hình LED",
            desc: "Hiển thị sắc nét mọi thông số vận hành.",
            bg: "bg-red-500/10"
        }
    ];

    // Filter out invalid features before using
    const validCarFeatures = (car.features || []).filter(f => f && f.title && f.desc);
    const features = (validCarFeatures.length > 0) ? validCarFeatures : defaultFeatures;

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <SectionHeading className="mb-4">
                        Công Nghệ Vượt Trội
                    </SectionHeading>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Trải nghiệm những công nghệ tiên tiến nhất được tích hợp trên {car.name}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-3 md:p-8 rounded-2xl md:rounded-3xl bg-card/30 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1 group"
                        >
                            <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${feature.bg || 'bg-primary/10'} flex items-center justify-center mb-3 md:mb-6 group-hover:scale-105 transition-transform`}
                                style={{ willChange: 'transform' }}>
                                {getIcon(feature.icon, "w-5 h-5 md:w-8 md:h-8")}
                            </div>
                            <FeatureTitle className="mb-2 md:mb-3 text-sm md:text-xl">
                                {feature.title}
                            </FeatureTitle>
                            <p className="text-muted-foreground leading-relaxed text-xs md:text-base">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
