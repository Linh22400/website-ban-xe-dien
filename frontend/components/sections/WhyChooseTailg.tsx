'use client';

import { Shield, DollarSign, Clock, Headphones, Award, TrendingUp } from 'lucide-react';
import { useTheme, ThemeText } from '@/components/common/ThemeText';

export default function WhyChooseTailg() {
    const isDark = useTheme();

    const reasons = [
        {
            icon: Award,
            title: 'Đại Lý Chính Hãng',
            description: 'Ủy quyền độc quyền chính thức từ TAILG, đảm bảo sản phẩm 100% chính hãng',
            color: 'from-yellow-400 to-yellow-600'
        },
        {
            icon: DollarSign,
            title: 'Giá Tốt Nhất',
            description: 'Cam kết giá cạnh tranh nhất thị trường với nhiều chương trình ưu đãi đặc biệt',
            color: 'from-green-400 to-green-600'
        },
        {
            icon: Shield,
            title: 'Bảo Hành Ưu Đãi',
            description: 'Chính sách bảo hành mở rộng dành riêng cho khách hàng TAILG',
            color: 'from-blue-400 to-blue-600'
        },
        {
            icon: Headphones,
            title: 'Hỗ Trợ 24/7',
            description: 'Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng mọi lúc mọi nơi',
            color: 'from-emerald-400 to-emerald-600'
        },
        {
            icon: TrendingUp,
            title: 'Ưu Đãi Độc Quyền',
            description: 'Các gói combo, quà tặng và khuyến mãi chỉ có tại đại lý ủy quyền',
            color: 'from-pink-400 to-pink-600'
        },
        {
            icon: Clock,
            title: 'Giao Hàng Nhanh',
            description: 'Miễn phí vận chuyển toàn quốc, giao hàng nhanh chóng trong 24-48h',
            color: 'from-orange-400 to-orange-600'
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: isDark
                        ? 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1), transparent 70%)'
                        : 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05), transparent 70%)'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border"
                        style={{
                            backgroundColor: isDark ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 215, 0, 0.05)',
                            borderColor: isDark ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.2)'
                        }}
                    >
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold" style={{ color: isDark ? '#FFD700' : '#B8860B' }}>
                            Tại Sao Chọn TAILG
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            Cam Kết Của Chúng Tôi
                        </span>
                    </h2>

                    <ThemeText className="text-lg max-w-2xl mx-auto opacity-90">
                        Là đại lý ủy quyền độc quyền TAILG, chúng tôi mang đến trải nghiệm mua sắm tốt nhất
                    </ThemeText>
                </div>

                {/* Reasons Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="relative p-6 rounded-2xl border overflow-hidden shadow-sm"
                            style={{
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div>
                                {/* Icon */}
                                <div
                                    className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${reason.color} shadow-sm`}
                                >
                                    <reason.icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-2" style={{ color: isDark ? '#FFD700' : '#B8860B' }}>
                                    {reason.title}
                                </h3>

                                <ThemeText className="text-sm opacity-80 leading-relaxed">
                                    {reason.description}
                                </ThemeText>
                            </div>

                            {/* Bottom accent line */}
                            <div
                                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${reason.color}`}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <ThemeText className="text-sm opacity-60">
                        ⭐ Hơn <span className="font-bold text-yellow-500">10,000+</span> khách hàng tin tưởng lựa chọn TAILG
                    </ThemeText>
                </div>
            </div>
        </section>
    );
}
