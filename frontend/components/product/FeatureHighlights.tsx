"use client";

import { Car } from "@/lib/api";
import { SectionHeading, FeatureTitle } from './ProductTextComponents';
import { Battery, Zap, Shield, Smartphone, Wind, Gauge } from "lucide-react";

interface FeatureHighlightsProps {
    car: Car;
}

export default function FeatureHighlights({ car }: FeatureHighlightsProps) {
    // Helper to map string icon names to components
    const getIcon = (name: string) => {
        const props = { className: "w-8 h-8" };
        switch (name.toLowerCase()) {
            case 'battery': return <Battery {...props} className="w-8 h-8 text-primary" />;
            case 'zap': return <Zap {...props} className="w-8 h-8 text-yellow-500" />;
            case 'shield': return <Shield {...props} className="w-8 h-8 text-green-500" />;
            case 'smartphone': return <Smartphone {...props} className="w-8 h-8 text-purple-500" />;
            case 'wind': return <Wind {...props} className="w-8 h-8 text-cyan-500" />;
            case 'gauge': return <Gauge {...props} className="w-8 h-8 text-red-500" />;
            default: return <Zap {...props} className="w-8 h-8 text-primary" />;
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

    const features = (car.features && car.features.length > 0) ? car.features : defaultFeatures;

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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-3xl bg-card/30 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${feature.bg || 'bg-primary/10'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {getIcon(feature.icon)}
                            </div>
                            <FeatureTitle className="mb-3">
                                {feature.title}
                            </FeatureTitle>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
