'use client';

import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Send, ArrowRight, Sparkles } from "lucide-react";
import { PageHeading, ThemeText, ThemeInput, useTheme } from "@/components/common/ThemeText";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const isDark = useTheme();

    // Helper component for theme-aware cards
    const ThemeCard = ({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
        <div className={`${isDark ? 'bg-white/5' : 'bg-gray-100/80'
            } ${hover ? (isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200/80') : ''} ${className}`}>
            {children}
        </div>
    );

    return (
        <footer className="bg-gradient-to-b from-card via-card to-secondary border-t border-white/10">
            {/* Main Footer Content - Enhanced Design */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Column 1: Brand & Newsletter - Enhanced */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Brand with gradient */}
                        <div>
                            <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary mb-3 tracking-tight">
                                XE ĐIỆN XANH
                            </h3>
                            <ThemeText className="text-sm leading-relaxed opacity-90">
                                Cung cấp xe điện chính hãng từ các thương hiệu hàng đầu. Chất lượng - Uy tín - Giá tốt.
                            </ThemeText>
                        </div>

                        {/* Newsletter Form - Premium Design */}
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <ThemeText className="text-xs font-bold uppercase tracking-wider">
                                    Nhận tin khuyến mãi
                                </ThemeText>
                            </div>
                            <form className="relative group">
                                <ThemeInput
                                    type="email"
                                    placeholder="Nhập email của bạn..."
                                    className="w-full px-4 py-3 pr-12 text-sm border-2 rounded-xl focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-500"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-primary to-accent text-black rounded-lg hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>

                        {/* Social Links - Enhanced */}
                        <div>
                            <ThemeText className="text-xs font-semibold mb-3 uppercase tracking-wider">
                                Kết nối với chúng tôi
                            </ThemeText>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, href: "https://facebook.com", color: "hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-500" },
                                    { icon: Instagram, href: "https://instagram.com", color: "hover:bg-pink-500/10 hover:border-pink-500 hover:text-pink-500" },
                                    { icon: Youtube, href: "https://youtube.com", color: "hover:bg-red-500/10 hover:border-red-500 hover:text-red-500" }
                                ].map(({ icon: Icon, href, color }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center text-muted-foreground transition-all transform hover:scale-110 hover:shadow-lg ${color}`}
                                        style={{
                                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links - Enhanced */}
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                            <ThemeText className="font-black text-sm uppercase tracking-wider">
                                Sản Phẩm & Dịch Vụ
                            </ThemeText>
                        </div>
                        <ul className="space-y-3 text-sm">
                            {[
                                { href: "/cars?type=motorcycle", label: "Xe Máy Điện" },
                                { href: "/cars?type=bicycle", label: "Xe Đạp Điện" },
                                { href: "/accessories", label: "Phụ Kiện & Đồ Bảo Hộ" },
                                { href: "/promotions", label: "Khuyến Mãi Hot", badge: true },
                                { href: "/compare", label: "So Sánh Sản Phẩm" }
                            ].map(({ href, label, badge }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                                        {badge && (
                                            <span className="px-2 py-0.5 bg-gradient-to-r from-primary to-accent text-black text-[10px] font-bold rounded-full">
                                                HOT
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Support & Policies - Enhanced */}
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-full"></div>
                            <ThemeText className="font-black text-sm uppercase tracking-wider">
                                Hỗ Trợ & Chính Sách
                            </ThemeText>
                        </div>
                        <ul className="space-y-3 text-sm">
                            {[
                                { href: "/tracking", label: "Tra Cứu Đơn Hàng" },
                                { href: "/warranty", label: "Chính Sách Bảo Hành" },
                                { href: "/return-policy", label: "Chính Sách Đổi Trả" },
                                { href: "/privacy-policy", label: "Chính Sách Bảo Mật" },
                                { href: "/contact", label: "Liên Hệ & Hỗ Trợ" },
                                { href: "/blog", label: "Blog & Tin Tức" }
                            ].map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact - Premium Card */}
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                            <ThemeText className="font-black text-sm uppercase tracking-wider">
                                Liên Hệ
                            </ThemeText>
                        </div>
                        <div className="space-y-4">
                            {[
                                {
                                    icon: Phone,
                                    label: "Hotline",
                                    value: "1900 XXXX",
                                    href: "tel:1900xxxx",
                                    color: "text-green-500"
                                },
                                {
                                    icon: Mail,
                                    label: "Email",
                                    value: "support@xedienviet.com",
                                    href: "mailto:support@xedienviet.com",
                                    color: "text-blue-500"
                                },
                                {
                                    icon: MapPin,
                                    label: "Địa Chỉ",
                                    value: "123 Đường ABC, Q1, TP.HCM",
                                    color: "text-red-500"
                                },
                                {
                                    icon: Clock,
                                    label: "Giờ Làm Việc",
                                    value: "T2-CN: 8:00 - 18:00",
                                    color: "text-orange-500"
                                }
                            ].map(({ icon: Icon, label, value, href, color }) => (
                                <div
                                    key={label}
                                    className="group flex items-start gap-3 p-3 rounded-xl border hover:border-primary/30 transition-all"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                                    }}
                                >
                                    <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}
                                        style={{
                                            backgroundImage: isDark
                                                ? 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
                                                : 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.04))'
                                        }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                                            {label}
                                        </div>
                                        {href ? (
                                            <a href={href} className="text-sm font-medium text-foreground hover:text-primary transition-colors break-words">
                                                {value}
                                            </a>
                                        ) : (
                                            <ThemeText className="text-sm font-medium break-words">
                                                {value}
                                            </ThemeText>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Partners & Payment - Premium Design */}
                <div className="border-t border-white/10 pt-10 space-y-6">
                    {/* Payment & Shipping - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                                <ThemeText className="text-xs font-bold uppercase tracking-wider">
                                    Thanh toán
                                </ThemeText>
                                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['VISA', 'MasterCard', 'MoMo', 'ZaloPay', 'Ngân Hàng', 'Tiền Mặt'].map((method) => (
                                    <span
                                        key={method}
                                        className="px-4 py-2 border hover:border-primary/50 rounded-lg text-xs font-bold text-foreground hover:scale-105 hover:shadow-lg transition-all cursor-default"
                                        style={{
                                            backgroundImage: isDark
                                                ? 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))'
                                                : 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        {method}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="w-8 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                                <ThemeText className="text-xs font-bold uppercase tracking-wider">
                                    Vận chuyển
                                </ThemeText>
                                <div className="w-8 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['Giao Hàng Nhanh', 'Grab Express', 'GHTK', 'Viettel Post'].map((shipping) => (
                                    <span
                                        key={shipping}
                                        className="px-4 py-2 border hover:border-accent/50 rounded-lg text-xs font-bold text-foreground hover:scale-105 hover:shadow-lg transition-all cursor-default"
                                        style={{
                                            backgroundImage: isDark
                                                ? 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))'
                                                : 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        {shipping}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Brand Partners - Premium Showcase */}
                    <div className="text-center pt-6 border-t border-white/5">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                            <div>
                                <ThemeText className="text-xs font-black uppercase tracking-wider mb-1">
                                    Thương hiệu chính hãng
                                </ThemeText>
                                <p className="text-[10px] text-muted-foreground">Đại lý ủy quyền chính thức</p>
                            </div>
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['VinFast', 'Yadea', 'Giant', 'Pega', 'Dibao', 'Dat Bike'].map((brand) => (
                                <div
                                    key={brand}
                                    className="group relative px-6 py-3 border hover:border-primary/50 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl cursor-default"
                                    style={{
                                        backgroundImage: isDark
                                            ? 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
                                            : 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.03))',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative text-sm font-black text-foreground tracking-wide">
                                        {brand}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Premium */}
            <div className="border-t border-white/10 bg-gradient-to-r from-secondary via-card to-secondary backdrop-blur-sm">
                <div className="container mx-auto px-6 py-5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <ThemeText className="text-xs opacity-80">
                            © {currentYear} Xe Điện Xanh. Bảo lưu mọi quyền.
                        </ThemeText>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                Giao dịch an toàn & bảo mật
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
