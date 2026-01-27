'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { ReactNode } from "react";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Send, ArrowRight, Sparkles } from "lucide-react";
import { PageHeading, ThemeText, ThemeInput, useTheme } from "@/components/common/ThemeText";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const isDark = useTheme();

    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");
    const [newsletterHp, setNewsletterHp] = useState("");

    // Helper component for theme-aware cards
    const ThemeCard = ({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) => (
        <div className={`${isDark ? 'bg-white/5' : 'bg-gray-100/80'
            } ${hover ? (isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200/80') : ''} ${className}`}>
            {children}
        </div>
    );

    return (
        <footer className="bg-gradient-to-b from-card via-card to-secondary border-t border-white/10">
            {/* Main Footer Content - Enhanced Design */}
            <div className="container mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-2">
                    {/* Left Column: Content & Partners */}
                    <div className="lg:col-span-9 grid grid-cols-1 lg:grid-cols-9 gap-6">
                        {/* Brand Column - Separated to allow right side to flow naturally */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Brand with logo */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                                        <Image
                                            src="/logo(Ducduy).jpg"
                                            alt="Xe Điện Đức Duy Logo"
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary tracking-tight">
                                        Xe Điện Đức Duy
                                    </h3>
                                </div>
                                <ThemeText className="text-sm leading-relaxed opacity-90">
                                    Cung cấp xe điện chính hãng từ các thương hiệu hàng đầu. Chất lượng - Uy tín - Giá tốt.
                                </ThemeText>
                            </div>

                            {/* Newsletter Form - Premium Design */}
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                                    <ThemeText className="text-xs font-bold uppercase tracking-wider">
                                        Nhận tin khuyến mãi
                                    </ThemeText>
                                </div>
                                <form
                                    className="relative group"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const email = newsletterEmail.trim();
                                        if (!email || !email.includes("@")) {
                                            setNewsletterStatus("error");
                                            return;
                                        }

                                        try {
                                            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/newsletter/subscribe`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ email, source: 'footer', website: newsletterHp }),
                                            });

                                            if (!res.ok) {
                                                setNewsletterStatus("error");
                                                return;
                                            }

                                            setNewsletterStatus("success");
                                            setNewsletterEmail("");
                                        } catch {
                                            setNewsletterStatus("error");
                                        }
                                    }}
                                >
                                    {/* Honeypot chống bot (ẩn với người dùng) */}
                                    <input
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={newsletterHp}
                                        onChange={(e) => setNewsletterHp(e.target.value)}
                                        className="hidden"
                                        aria-hidden="true"
                                    />
                                    <ThemeInput
                                        type="email"
                                        aria-label="Email đăng ký nhận tin"
                                        placeholder="Nhập email..."
                                        value={newsletterEmail}
                                        onChange={(e) => {
                                            setNewsletterEmail(e.target.value);
                                            if (newsletterStatus !== "idle") setNewsletterStatus("idle");
                                        }}
                                        className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                                        style={{
                                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        aria-label="Đăng ký nhận tin"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-primary to-accent text-black rounded-lg hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-transform duration-300"
                                        style={{ willChange: 'transform' }}
                                    >
                                        <Send className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                </form>

                                {newsletterStatus === "success" && (
                                    <p className="mt-2 text-xs text-primary">Cảm ơn bạn! Chúng tôi sẽ gửi tin khi có ưu đãi.</p>
                                )}
                                {newsletterStatus === "error" && (
                                    <p className="mt-2 text-xs text-red-500">Email chưa hợp lệ. Vui lòng kiểm tra lại.</p>
                                )}
                            </div>

                            {/* Copyright & Security - Moved here */}
                            <div className="pt-2 flex flex-col gap-3">
                                <ThemeText className="text-xs opacity-80">
                                    © {currentYear} Xe Điện Đức Duy. Bảo lưu mọi quyền.
                                </ThemeText>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">
                                        Giao dịch an toàn & bảo mật
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Wrapper: Lists & Partners */}
                        <div className="lg:col-span-6 flex flex-col gap-4">
                            {/* Lists Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                            { href: "/accessories", label: "Phụ Kiện" },
                                            { href: "/promotions", label: "Khuyến Mãi", badge: true },
                                            { href: "/compare", label: "So Sánh" }
                                        ].map(({ href, label, badge }) => (
                                            <li key={href}>
                                                <Link
                                                    href={href}
                                                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                                                >
                                                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" aria-hidden="true" />
                                                    <span className="group-hover:translate-x-1 transition-transform truncate">{label}</span>
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
                                            { href: "/warranty", label: "Bảo Hành" },
                                            { href: "/return-policy", label: "Đổi Trả" },
                                            { href: "/privacy-policy", label: "Bảo Mật" },
                                            { href: "/contact", label: "Liên Hệ" },
                                            { href: "/blog", label: "Tin Tức" }
                                        ].map(({ href, label }) => (
                                            <li key={href}>
                                                <Link
                                                    href={href}
                                                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
                                                >
                                                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" aria-hidden="true" />
                                                    <span className="group-hover:translate-x-1 transition-transform truncate">{label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Column 4: Contact - Streamlined */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-5 bg-primary rounded-full"></div>
                                        <ThemeText className="font-bold text-sm uppercase tracking-wider">
                                            Liên Hệ
                                        </ThemeText>
                                    </div>
                                    <ul className="space-y-3">
                                        {[
                                            {
                                                icon: Phone,
                                                label: "Hotline",
                                                value: "094 342 4787",
                                                href: "tel:+84943424787",
                                                color: "text-green-700 dark:text-green-500"
                                            },
                                            {
                                                icon: Mail,
                                                label: "Email",
                                                value: "camauducduy@gmail.com",
                                                href: "mailto:camauducduy@gmail.com",
                                                color: "text-blue-700 dark:text-blue-500"
                                            },
                                            {
                                                icon: MapPin,
                                                label: "Showroom 1",
                                                value: "118 Nguyễn Tất Thành, P.8",
                                                href: "https://www.google.com/maps/place/Xe+%C4%91i%E1%BB%87n+%C4%90%E1%BB%A9c+Duy/@9.1712704,105.1472884,118m/data=!3m1!1e3!4m15!1m8!3m7!1s0x31a149749d85c00d:0x3359aed74213d052!2zMTE4IE5ndXnhu4VuIFThuqV0IFRow6BuaCwgUGjGsOG7nW5nIDgsIEPDoCBNYXUsIFZp4buHdCBOYW0!3b1!8m2!3d9.1709002!4d105.1473161!16s%2Fg%2F11pf7gdlky!3m5!1s0x31a1497214982efb:0xb3c3839cf1a4324b!8m2!3d9.1709183!4d105.1472452!16s%2Fg%2F11g047y2mj?hl=vi-VN&entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D",
                                                color: "text-red-700 dark:text-red-500"
                                            },
                                            {
                                                icon: MapPin,
                                                label: "Showroom 2",
                                                value: "276B Ngô Quyền, P.1",
                                                href: "https://www.google.com/maps/place/Xe+%C4%90i%E1%BB%87n+%C4%90%E1%BB%A9c+Duy+2/@9.185065,105.1362258,860m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31a1491080941477:0x2ade5623d3aaa3c1!8m2!3d9.185065!4d105.1388007!16s%2Fg%2F11xtlhqtzg?hl=vi-VN&entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D",
                                                color: "text-purple-700 dark:text-purple-500"
                                            },
                                            {
                                                icon: Clock,
                                                label: "Giờ Làm Việc",
                                                value: "8:00 - 20:00",
                                                color: "text-orange-700 dark:text-orange-500"
                                            }
                                        ].map(({ icon: Icon, value, href, color }) => (
                                            <li key={value} className="flex items-start gap-3">
                                                <div className={`mt-0.5 ${color}`}>
                                                    <Icon className="w-4 h-4" aria-hidden="true" />
                                                </div>
                                                <div className="flex-1 text-sm overflow-hidden">
                                                    {href ? (
                                                        <a href={href} className="text-muted-foreground hover:text-primary transition-colors block truncate" title={value}>
                                                            {value}
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted-foreground block truncate" title={value}>
                                                            {value}
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Partners & Payment - Moved here */}
                            <div className="mt-0">
                                <div className="flex flex-col md:flex-row items-start justify-start gap-8">
                                    {/* Social Links */}
                                    <div className="flex flex-col items-center md:items-start gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Kết nối với chúng tôi
                                        </span>
                                        <div className="flex gap-2">
                                            {[
                                                { icon: Facebook, href: "https://facebook.com", color: "hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-500", label: "Facebook" },
                                                { icon: Instagram, href: "https://instagram.com", color: "hover:bg-pink-500/10 hover:border-pink-500 hover:text-pink-500", label: "Instagram" },
                                                { icon: Youtube, href: "https://youtube.com", color: "hover:bg-red-500/10 hover:border-red-500 hover:text-red-500", label: "Youtube" }
                                            ].map(({ icon: Icon, href, color, label }) => (
                                                <a
                                                    key={href}
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={label}
                                                    className={`w-8 h-8 border rounded-lg flex items-center justify-center text-muted-foreground transition-all hover:scale-105 ${color}`}
                                                    style={{
                                                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                                                    }}
                                                >
                                                    <Icon className="w-4 h-4" aria-hidden="true" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="flex flex-col items-center md:items-start gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Chấp nhận thanh toán
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {['VISA', 'MasterCard', 'MoMo', 'ZaloPay', 'Tiền Mặt'].map((method) => (
                                                <span key={method} className="text-[10px] font-medium border border-white/10 bg-white/5 px-2 py-1 rounded text-muted-foreground cursor-default">
                                                    {method}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shipping Partners */}
                                    <div className="flex flex-col items-center md:items-start gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Đối tác vận chuyển
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {['Grab', 'GHTK', 'Viettel Post', 'Ahamove'].map((method) => (
                                                <span key={method} className="text-[10px] font-medium border border-white/10 bg-white/5 px-2 py-1 rounded text-muted-foreground cursor-default">
                                                    {method}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Official Dealer - Compact */}
                                    <div className="flex flex-col items-center md:items-start gap-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Fanpage
                                        </span>
                                        <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-lg">
                                            <span className="font-black text-sm text-primary tracking-widest">TAILG</span>
                                            <span className="text-[10px] text-primary/80">Official Store</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 5: Maps - New */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                            <ThemeText className="font-bold text-sm uppercase tracking-wider">
                                Bản Đồ
                            </ThemeText>
                        </div>
                        <div className="space-y-3">
                            <div className="rounded-lg overflow-hidden border border-white/10 h-32 relative group">
                                <iframe
                                    src="https://maps.google.com/maps?q=9.1709183,105.1472452&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    title="Map 118 Nguyễn Tất Thành"
                                    className="transition-all duration-500"
                                ></iframe>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-white text-center backdrop-blur-sm">
                                    118 Nguyễn Tất Thành
                                </div>
                            </div>
                            <div className="rounded-lg overflow-hidden border border-white/10 h-32 relative group">
                                <iframe
                                    src="https://maps.google.com/maps?q=9.185065,105.1388007&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    title="Map 276B Ngô Quyền"
                                    className="transition-all duration-500"
                                ></iframe>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-white text-center backdrop-blur-sm">
                                    276B Ngô Quyền
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </footer>
    );
}
