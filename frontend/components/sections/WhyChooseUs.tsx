"use client";

import { Leaf, Wallet, Cpu, ShieldCheck } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        {
            title: "Bền Vững",
            desc: "Không khí thải, thân thiện với môi trường, góp phần bảo vệ hành tinh xanh.",
            icon: <Leaf className="w-8 h-8" />,
            color: "text-green-400",
            bg: "bg-green-400/10",
            border: "hover:border-green-400/50"
        },
        {
            title: "Tiết Kiệm",
            desc: "Chi phí vận hành chỉ bằng 1/10 xe xăng. Không tốn tiền thay nhớt, bảo dưỡng ít hơn.",
            icon: <Wallet className="w-8 h-8" />,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            border: "hover:border-yellow-400/50"
        },
        {
            title: "Công Nghệ",
            desc: "Tích hợp GPS, App quản lý thông minh, khóa chống trộm và nhiều tính năng hiện đại.",
            icon: <Cpu className="w-8 h-8" />,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "hover:border-blue-400/50"
        },
        {
            title: "An Tâm",
            desc: "Bảo hành chính hãng lên đến 3 năm. Dịch vụ cứu hộ 24/7 và bảo dưỡng định kỳ miễn phí.",
            icon: <ShieldCheck className="w-8 h-8" />,
            color: "text-red-400",
            bg: "bg-red-400/10",
            border: "hover:border-red-400/50"
        },
    ];

    return (
        <section className="w-full py-24 px-6 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Tại Sao Chọn Xe Điện?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Xu hướng di chuyển của tương lai với những lợi ích vượt trội cho bạn và cộng đồng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className={`group p-8 bg-card/30 backdrop-blur-sm rounded-3xl border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:bg-card/50 ${item.border}`}
                        >
                            <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 ${item.color}`}
                                style={{ willChange: 'transform' }}>
                                {item.icon}
                            </div>
                            <h3 className={`text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors`}>{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
