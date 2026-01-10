"use client";

import Image from "next/image";
import { useState } from "react";

export default function SmartFeatures() {
    const [activeCard, setActiveCard] = useState<number | null>(null);

    const features = [
        {
            id: 1,
            title: "Công Nghệ TTFAR",
            subtitle: "Vừa Đi Vừa Sạc",
            description: "Hệ thống thu hồi năng lượng khi phanh và xuống dốc, giúp gia tăng quãng đường di chuyển thêm 20%.",
            icon: "⚡",
            image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000",
            colSpan: "lg:col-span-2",
            bgGradient: "from-emerald-600/20 to-green-600/20"
        },
        {
            id: 2,
            title: "Pin Graphene",
            subtitle: "Bền Bỉ Gấp 3 Lần",
            description: "Công nghệ pin Graphene thế hệ mới, tuổi thọ lên đến 1300 lần sạc, chịu nhiệt tốt và an toàn tuyệt đối.",
            icon: "🔋",
            image: "https://images.unsplash.com/photo-1619641237386-2c1c6a635e55?auto=format&fit=crop&q=80&w=1000",
            colSpan: "lg:col-span-1",
            bgGradient: "from-green-600/20 to-emerald-600/20"
        },
        {
            id: 3,
            title: "Kết Nối Thông Minh",
            subtitle: "Một Chạm NFC & App",
            description: "Mở khóa xe bằng thẻ NFC hoặc Smartphone. Định vị GPS thời gian thực và kiểm tra tình trạng xe qua App.",
            icon: "📱",
            image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=1000",
            colSpan: "lg:col-span-1",
            bgGradient: "from-orange-600/20 to-red-600/20"
        },
        {
            id: 4,
            title: "Kháng Nước IP67",
            subtitle: "Lội Nước Thoải Mái",
            description: "Động cơ và linh kiện điện tử được bảo vệ theo chuẩn IP67, vận hành ổn định dưới trời mưa và đường ngập.",
            icon: "💧",
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000",
            colSpan: "lg:col-span-2",
            bgGradient: "from-blue-600/20 to-sky-600/20"
        }
    ];

    return (
        <section className="py-24 px-6 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                        Công Nghệ Đột Phá
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Trải nghiệm những công nghệ tiên tiến nhất trên các dòng xe điện thế hệ mới.
                        Hiệu suất vượt trội, thông minh và bền bỉ.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 ${feature.colSpan}`}
                            onMouseEnter={() => setActiveCard(feature.id)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
                                    style={{ willChange: 'transform' }}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} mix-blend-overlay opacity-50`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative h-full p-8 flex flex-col justify-end min-h-[300px] lg:min-h-[400px]">
                                <div className="mb-auto transform transition-all duration-500 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 mb-6">
                                        {feature.icon}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20">
                                            {feature.subtitle}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed transform transition-all duration-500 translate-y-4 opacity-80 group-hover:translate-y-0 group-hover:opacity-100">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
