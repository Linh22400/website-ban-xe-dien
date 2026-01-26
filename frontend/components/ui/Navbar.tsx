"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { type NavbarData, type NavbarItem } from "@/lib/navbar-data";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NotificationBell from "@/components/common/NotificationBell";
import ProductBadge from "@/components/common/ProductBadge";
import SmartSearchBar from "@/components/ui/SmartSearchBar";
import {
    ShoppingCart,
    Heart,
    Phone,
    Search,
    Menu,
    X,
    User,
    ChevronDown,
    Zap,
    ArrowRight,
    Truck,
    Info,
    MessageCircle,
    Gift,
    ShieldCheck
} from "lucide-react";

export default function Navbar({ initialData }: { initialData?: NavbarData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showSmartSearch, setShowSmartSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [showMobileProducts, setShowMobileProducts] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Use data from props or empty arrays
    const motorcycles = initialData?.motorcycles || [];
    const bicycles = initialData?.bicycles || [];
    const accessories = initialData?.accessories || [];

    const lastScrollYRef = useRef(0);
    const tickingRef = useRef(false);

    const { isAuthenticated, user, logout } = useAuth();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();

    // Global keyboard shortcut for search (Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowSmartSearch(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    // Handle scroll behavior
    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;

            window.requestAnimationFrame(() => {
                const currentScrollY = Math.max(0, window.scrollY); // iOS rubber-band fix

                const nextIsScrolled = currentScrollY > 10;
                setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled));

                // Scroll Direction Logic
                // Hide navbar only if scrolling DOWN and scrolled past 100px
                // Show navbar if scrolling UP or at the top
                const isScrollingDown = currentScrollY > lastScrollYRef.current;
                const scrollDelta = Math.abs(currentScrollY - lastScrollYRef.current);

                // Only trigger hiding if scroll diff is significant (> 5px) to avoid jitter
                if (scrollDelta > 5) {
                    const nextIsVisible = !(isScrollingDown && currentScrollY > 100);
                    setIsVisible((prev) => (prev === nextIsVisible ? prev : nextIsVisible));
                }

                lastScrollYRef.current = currentScrollY;
                tickingRef.current = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pathname = usePathname();
    const router = useRouter();

    // Hide Navbar on Admin pages
    if (pathname?.startsWith('/admin')) return null;

    return (
        <>
            {/* Smart Search Bar Modal */}
            <SmartSearchBar
                isOpen={showSmartSearch}
                onClose={() => setShowSmartSearch(false)}
                isNavbarVisible={isVisible}
                isNavbarScrolled={isScrolled}
                autoFocus
            />

            <nav
                className={`fixed top-0 left-0 right-0 z-[999] transition-transform duration-300 bg-background/95 border-b border-white/10 shadow-lg ${isVisible || isOpen ? "translate-y-0" : "-translate-y-full"}`}
                style={{ willChange: 'transform' }}
            >
                <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">


                    {/* Main Navbar */}
                    <div className="flex flex-col w-full">
                        {/* Top Row: Logo & Actions */}
                        <div className="flex items-center justify-between py-4 w-full">
                            {/* Logo & Tracking */}
                            <div className="flex flex-col items-start">
                                <Link
                                    href="/tracking"
                                    className="flex text-[10px] text-muted-foreground hover:text-primary items-center gap-1 mb-0.5 pl-1 transition-colors"
                                >
                                    <Truck className="w-3 h-3" />
                                    Tra Cứu Đơn Hàng
                                </Link>
                                <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 transform group-hover:scale-105 transition-transform flex-shrink-0">
                                        <Image
                                            src="/logo(Ducduy).jpg"
                                            alt="Xe Điện Đức Duy - Trang chủ"
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                    <div className="hidden sm:block flex-shrink-0">
                                        <div className="text-base sm:text-lg md:text-xl font-black text-[#0D5E3A] dark:text-[#10B981] whitespace-nowrap">
                                            XE ĐIỆN ĐỨC DUY
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] -mt-1 text-[#C81E1E] dark:text-[#EF4444] font-semibold whitespace-nowrap">
                                            Chính Hãng TAILG - Uy Tín
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Promotion Marquee Banner - Modern Slide */}
                            <div className="hidden lg:flex flex-1 mx-6 xl:mx-12 overflow-hidden">
                                <div className="relative flex w-full max-w-2xl mx-auto h-9 bg-secondary/50 backdrop-blur-sm rounded-full items-center overflow-hidden">
                                    <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
                                        {/* Original Set */}
                                        <div className="flex items-center gap-8 px-4">
                                            <span className="text-sm font-medium text-foreground/90">
                                                Xe Điện Đức Duy - Phân phối chính hãng Xe Máy Điện & Xe Đạp Điện TAILG
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                                            <span className="text-sm font-medium text-foreground/90">
                                                Top 1 Đại lý Xe Điện uy tín - Giá tốt nhất thị trường - Trả góp 0%
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                                            <span className="text-sm font-medium text-foreground/90">
                                                Bảo hành chính hãng 3 năm - Cứu hộ 24/7 - Giao hàng toàn quốc
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                                            <span className="text-sm font-medium text-foreground/90">
                                                Đa dạng mẫu mã - Mới nhất 2026 - Cam kết chất lượng 100%
                                            </span>
                                        </div>
                                        {/* Duplicate Set for Seamless Loop */}
                                        <div className="flex items-center gap-8 px-4">
                                            <span className="text-sm font-medium text-foreground/90">
                                                Xe Điện Đức Duy - Phân phối chính hãng Xe Máy Điện & Xe Đạp Điện TAILG
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                                            <span className="text-sm font-medium text-foreground/90">
                                                Top 1 Đại lý Xe Điện uy tín - Giá tốt nhất thị trường - Trả góp 0%
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                                            <span className="text-sm font-medium text-foreground/90">
                                                Bảo hành chính hãng 3 năm - Cứu hộ 24/7 - Giao hàng toàn quốc
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                                            <span className="text-sm font-medium text-foreground/90">
                                                Đa dạng mẫu mã - Mới nhất 2026 - Cam kết chất lượng 100%
                                            </span>
                                        </div>
                                    </div>
                                    {/* Fade Masks */}
                                    <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none"></div>
                                    <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                {/* Smart Search Toggle - Desktop & Mobile */}
                                <button
                                    onClick={() => setShowSmartSearch(true)}
                                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                    aria-label="Tìm kiếm"
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                {/* Wishlist */}
                                <Link
                                    href="/wishlist"
                                    className="hidden md:flex relative p-2 text-muted-foreground hover:text-primary transition-colors group"
                                    aria-label={`Danh sách yêu thích${wishlistCount > 0 ? `, có ${wishlistCount} sản phẩm` : ''}`}
                                >
                                    <Heart className="w-5 h-5 group-hover:fill-primary transition-all" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Theme Toggle */}
                                <ThemeToggle />

                                {/* Notifications */}
                                <NotificationBell />

                                {/* Shopping Cart */}
                                <Link
                                    href="/cart"
                                    className="relative p-2 text-muted-foreground hover:text-primary transition-colors group"
                                    aria-label={`Giỏ hàng${cartCount > 0 ? `, có ${cartCount} sản phẩm` : ''}`}
                                >
                                    <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform"
                                        style={{ willChange: 'transform' }} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center px-1">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Account */}
                                {isAuthenticated ? (
                                    <div className="hidden md:block relative group">
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors">
                                            <User className="w-4 h-4" />
                                            {user?.username}
                                        </button>
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card/95 border-2 border-gray-200 dark:border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
                                            <Link
                                                href="/account"
                                                className="block px-4 py-3 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-emerald-700 dark:hover:text-primary transition-colors rounded-t-xl"
                                            >
                                                Tài Khoản
                                            </Link>
                                            <Link
                                                href="/account/orders"
                                                className="block px-4 py-3 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-emerald-700 dark:hover:text-primary transition-colors"
                                            >
                                                Đơn Hàng
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-emerald-700 dark:hover:text-primary transition-colors rounded-b-xl"
                                            >
                                                Đăng Xuất
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hidden md:flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="px-3 xl:px-4 py-2 text-sm xl:text-base font-semibold text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors whitespace-nowrap"
                                        >
                                            Đăng Nhập
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-4 xl:px-6 py-2 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-shadow text-sm xl:text-base whitespace-nowrap"
                                        >
                                            Đăng Ký
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="lg:hidden p-2 text-foreground"
                                    aria-label="Toggle menu"
                                >
                                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        {/* Bottom Row: Desktop Navigation */}
                        <div className="hidden lg:flex items-center justify-center w-full pb-4">
                            <div className="flex items-center gap-4 xl:gap-6">
                                <Link
                                    href="/"
                                    className="text-sm xl:text-base font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    Trang Chủ
                                </Link>
                                {/* Motorcycles Dropdown */}
                                    <div className="relative group">
                                        <Link
                                            href="/cars?type=motorcycle"
                                            className="flex items-center gap-1 text-sm xl:text-base font-semibold text-muted-foreground group-hover:text-primary transition-colors py-2 whitespace-nowrap"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            Xe Máy Điện
                                            <ChevronDown className="w-4 h-4" />
                                        </Link>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[90vw] max-w-[640px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                                            <div className="bg-white dark:bg-card/98 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                                {/* Grid Products */}
                                            <div className="grid grid-cols-2 gap-2 p-3">
                                                {motorcycles.filter(item => !item.isViewAll).map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20 hover:shadow-md"
                                                    >
                                                        {/* Image */}
                                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
                                                            <Image
                                                                src={item.image || '/images/placeholder-motorcycle.svg'}
                                                                alt={item.label}
                                                                fill
                                                                sizes="100px"
                                                                className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                            />
                                                            {item.product && (
                                                                <div className="absolute top-1 right-1">
                                                                    <ProductBadge product={item.product} size="sm" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors line-clamp-2 mb-1">
                                                                {item.label}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                                                {item.desc}
                                                            </p>
                                                            <div className="flex flex-col gap-1">
                                                                {item.originalPrice && item.discount ? (
                                                                    <>
                                                                        <span className="text-xs text-muted-foreground line-through">{item.originalPrice}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-bold text-primary">{item.price}</span>
                                                                            <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">-{Math.round(item.discount)}%</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-sm font-bold text-primary">{item.price}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            {/* View All Button */}
                                            <Link
                                                href="/cars?type=motorcycle"
                                                className="flex items-center justify-center gap-2 py-3 border-t border-gray-200 dark:border-white/10 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 text-primary font-bold text-sm transition-all group/btn"
                                            >
                                                <span>Xem tất cả xe máy điện</span>
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Bicycles Dropdown */}
                                <div className="relative group">
                                    <Link
                                        href="/cars?type=bicycle"
                                        className="flex items-center gap-1 text-sm xl:text-base font-semibold text-muted-foreground group-hover:text-emerald-700 dark:group-hover:text-primary transition-colors py-2 whitespace-nowrap"
                                    >
                                        Xe Đạp Điện
                                        <ChevronDown className="w-4 h-4" />
                                    </Link>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[90vw] max-w-[640px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                                        <div className="bg-white dark:bg-card/98 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                            {/* Grid Products */}
                                            <div className="grid grid-cols-2 gap-2 p-3">
                                                {bicycles.filter(item => !item.isViewAll).map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20 hover:shadow-md"
                                                    >
                                                        {/* Image */}
                                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
                                                            <Image
                                                                src={item.image || '/images/placeholder-bicycle.svg'}
                                                                alt={item.label}
                                                                fill
                                                                sizes="100px"
                                                                className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                            />
                                                            {item.product && (
                                                                <div className="absolute top-1 right-1">
                                                                    <ProductBadge product={item.product} size="sm" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-sm text-foreground group-hover/item:text-emerald-700 dark:group-hover/item:text-primary transition-colors line-clamp-2 mb-1">
                                                                {item.label}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                                                {item.desc}
                                                            </p>
                                                            <div className="flex flex-col gap-1">
                                                                {item.originalPrice && item.discount ? (
                                                                    <>
                                                                        <span className="text-xs text-muted-foreground line-through">{item.originalPrice}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-bold text-emerald-700 dark:text-primary">{item.price}</span>
                                                                            <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">-{Math.round(item.discount)}%</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-sm font-bold text-emerald-700 dark:text-primary">{item.price}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            {/* View All Button */}
                                            <Link
                                                href="/cars?type=bicycle"
                                                className="flex items-center justify-center gap-2 py-3 border-t border-gray-200 dark:border-white/10 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 text-emerald-700 dark:text-primary font-bold text-sm transition-all group/btn"
                                            >
                                                <span>Xem tất cả xe đạp điện</span>
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Accessories Dropdown */}
                                <div className="relative group">
                                    <Link
                                        href="/accessories"
                                        className="flex items-center gap-1 text-sm xl:text-base font-semibold text-muted-foreground group-hover:text-primary transition-colors py-2 whitespace-nowrap"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        Phụ Kiện
                                        <ChevronDown className="w-4 h-4" />
                                    </Link>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[90vw] max-w-[520px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 ease-out">
                                        <div className="bg-white dark:bg-card/98 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                            {/* Grid Products */}
                                            <div className="grid grid-cols-2 gap-1 p-2">
                                                {accessories.filter(item => !item.isViewAll).map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20 hover:shadow-md"
                                                    >
                                                        {/* Image */}
                                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
                                                            <Image
                                                                src={item.image || '/images/placeholder.svg'}
                                                                alt={item.label}
                                                                fill
                                                                className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                            />
                                                            {item.product && (
                                                                <div className="absolute top-1 left-1">
                                                                    <ProductBadge product={item.product} size="sm" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors line-clamp-2 mb-1">
                                                                {item.label}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                                                {item.desc}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-bold text-primary">{item.price}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            {/* View All Button */}
                                            <Link
                                                href="/accessories"
                                                className="flex items-center justify-center gap-2 py-3 border-t border-gray-200 dark:border-white/10 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 text-primary font-bold text-sm transition-all group/btn"
                                            >
                                                <span>Xem tất cả phụ kiện</span>
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/compare"
                                    className="text-sm xl:text-base font-semibold text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    So Sánh
                                </Link>
                                <Link
                                    href="/blog"
                                    className="text-sm xl:text-base font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    Tin Tức
                                </Link>
                                <Link
                                    href="/promotions"
                                    className="flex items-center gap-2 text-sm xl:text-base font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    <Gift className="w-4 h-4" />
                                    Khuyến Mãi Hot
                                </Link>
                                <Link
                                    href="/about"
                                    className="flex items-center gap-2 text-sm xl:text-base font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    <Info className="w-4 h-4" />
                                    Về Chúng Tôi
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex items-center gap-2 text-sm xl:text-base font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Liên Hệ
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>

            {/* Mobile Menu - Moved OUTSIDE nav to avoid transform context issues */}
            <div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu chính"
                className={`lg:hidden fixed inset-x-0 top-[90px] bottom-0 z-[990] bg-background/98 backdrop-blur-xl border-t border-white/10 overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col p-6 space-y-6 min-h-full pb-20">
                    {/* Main Categories - Rich Accordion Style */}
                    <div className="space-y-2">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between w-full py-3 text-lg font-bold text-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors border-b border-white/10"
                        >
                            <span>Trang Chủ</span>
                        </Link>
                        {/* Motorcycles Config */}
                        <div className="border-b border-white/10 pb-2">
                            <button
                                onClick={() => setMobileExpanded(mobileExpanded === 'motorcycles' ? null : 'motorcycles')}
                                className="flex items-center justify-between w-full py-3 text-lg font-bold text-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors"
                                aria-expanded={mobileExpanded === 'motorcycles'}
                            >
                                <span>Xe Máy Điện</span>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded === 'motorcycles' ? 'rotate-180 text-emerald-700 dark:text-primary' : 'text-muted-foreground'}`} />
                            </button>

                            <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ease-in-out ${mobileExpanded === 'motorcycles' ? 'grid opacity-100 mb-4' : 'hidden opacity-0'}`}>
                                {motorcycles.slice(0, 6).filter(m => !m.isViewAll).map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group relative flex flex-col bg-secondary/30 rounded-xl overflow-hidden border border-white/5 hover:border-emerald-700/50 dark:hover:border-primary/50 transition-all"
                                    >
                                        <div className="relative aspect-[4/3] w-full bg-white p-2">
                                            <Image
                                                src={item.image || '/images/placeholder-motorcycle.svg'}
                                                alt={item.label}
                                                fill
                                                className="object-contain"
                                            />
                                            {item.product?.discount && (
                                                <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">- {item.product.discount}%</div>
                                            )}
                                        </div>
                                        <div className="p-2.5 flex flex-col flex-1">
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold line-clamp-2 mb-1 group-hover:text-emerald-700 dark:group-hover:text-primary transition-colors">{item.label}</h4>
                                                {item.desc && <p className="text-[10px] text-muted-foreground line-clamp-1 mb-1">{item.desc}</p>}
                                            </div>
                                            <div className="mt-1">
                                                <div className="text-sm font-bold text-emerald-700 dark:text-primary">{item.price}</div>
                                                {item.originalPrice && <div className="text-[10px] text-muted-foreground line-through">{item.originalPrice}</div>}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    href="/cars?type=motorcycle"
                                    onClick={() => setIsOpen(false)}
                                    className="col-span-2 flex items-center justify-center gap-2 py-3 mt-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-primary bg-emerald-700/10 dark:bg-primary/10 rounded-lg hover:bg-emerald-700/20 dark:hover:bg-primary/20 transition-colors"
                                >
                                    Xem tất cả Xe Máy Điện <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Bicycles Config */}
                        <div className="border-b border-white/10 pb-2">
                            <button
                                onClick={() => setMobileExpanded(mobileExpanded === 'bicycles' ? null : 'bicycles')}
                                className="flex items-center justify-between w-full py-3 text-lg font-bold text-foreground hover:text-primary transition-colors"
                            >
                                <span>Xe Đạp Điện</span>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded === 'bicycles' ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                            </button>

                            <div className={`grid grid-cols-2 gap-3 transition-all duration-300 ease-in-out ${mobileExpanded === 'bicycles' ? 'grid opacity-100 mb-4' : 'hidden opacity-0'}`}>
                                {bicycles.slice(0, 6).filter(b => !b.isViewAll).map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group relative flex flex-col bg-secondary/30 rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all"
                                    >
                                        <div className="relative aspect-[4/3] w-full bg-white p-2">
                                            <Image
                                                src={item.image || '/images/placeholder-bicycle.svg'}
                                                alt={item.label}
                                                fill
                                                sizes="50vw"
                                                className="object-contain"
                                            />
                                            {item.product?.discount && (
                                                <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">- {item.product.discount}%</div>
                                            )}
                                        </div>
                                        <div className="p-2.5 flex flex-col flex-1">
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold line-clamp-2 mb-1 group-hover:text-primary transition-colors">{item.label}</h4>
                                                {item.desc && <p className="text-[10px] text-muted-foreground line-clamp-1 mb-1">{item.desc}</p>}
                                            </div>
                                            <div className="mt-1">
                                                <div className="text-sm font-bold text-primary">{item.price}</div>
                                                {item.originalPrice && <div className="text-[10px] text-muted-foreground line-through">{item.originalPrice}</div>}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    href="/cars?type=bicycle"
                                    onClick={() => setIsOpen(false)}
                                    className="col-span-2 flex items-center justify-center gap-2 py-3 mt-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Xem tất cả Xe Đạp Điện <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Accessories Config */}
                        <div className="border-b border-white/10 pb-2">
                            <button
                                onClick={() => setMobileExpanded(mobileExpanded === 'accessories' ? null : 'accessories')}
                                className="flex items-center justify-between w-full py-3 text-lg font-bold text-foreground hover:text-primary transition-colors"
                                aria-expanded={mobileExpanded === 'accessories'}
                                aria-controls="mobile-menu-accessories"
                            >
                                <span>Phụ Kiện & Pin</span>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileExpanded === 'accessories' ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                            </button>

                            <div id="mobile-menu-accessories" className={`grid grid-cols-2 gap-3 transition-all duration-300 ease-in-out ${mobileExpanded === 'accessories' ? 'grid opacity-100 mb-4' : 'hidden opacity-0'}`}>
                                {accessories.slice(0, 6).filter(a => !a.isViewAll).map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group relative flex flex-col bg-secondary/30 rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all"
                                    >
                                        <div className="relative aspect-square w-full bg-white p-2">
                                            <Image
                                                src={item.image || (item.label.toLowerCase().includes('pin') ? '/images/placeholder-battery.svg' : item.label.toLowerCase().includes('mũ') ? '/images/placeholder-helmet.svg' : '/images/placeholder.svg')}
                                                alt={item.label}
                                                fill
                                                sizes="50vw"
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="p-2.5 flex flex-col flex-1">
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold line-clamp-2 mb-1 group-hover:text-primary transition-colors">{item.label}</h4>
                                                <p className="text-[10px] text-muted-foreground line-clamp-1 mb-1">{item.desc}</p>
                                            </div>
                                            <div className="mt-1">
                                                <div className="text-sm font-bold text-primary">{item.price}</div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    href="/accessories"
                                    onClick={() => setIsOpen(false)}
                                    className="col-span-2 flex items-center justify-center gap-2 py-3 mt-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    Xem tất cả Phụ Kiện <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Menu Links */}
                    <div className="space-y-3 pt-2">
                        <Link
                            href="/promotions"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
                        >
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Khuyến Mãi Hot
                        </Link>
                        <Link
                            href="/compare"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
                        >
                            <ArrowRight className="w-5 h-5" />
                            So Sánh Xe
                        </Link>
                        <Link
                            href="/blog"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Tin Tức & Sự Kiện
                        </Link>
                        <Link
                            href="/tracking"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
                        >
                            <Search className="w-5 h-5" />
                            Tra Cứu Đơn Hàng
                        </Link>
                        <Link
                            href="/wishlist"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-emerald-700 dark:hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
                        >
                            <Heart className="w-5 h-5 text-red-500" />
                            Yêu Thích <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{wishlistCount}</span>
                        </Link>
                    </div>

                    {/* Account & Actions Footer */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        {isAuthenticated ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground">{user?.username}</div>
                                        <div className="text-xs text-muted-foreground">Thành viên thân thiết</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="text-center py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 font-medium text-sm transition-colors"
                                    >
                                        Tài Khoản
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="text-center py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 font-medium text-sm transition-colors"
                                    >
                                        Đăng Xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center py-3 rounded-xl border-2 border-white/10 font-bold text-foreground hover:bg-white/5 transition-colors"
                                >
                                    Đăng Nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center py-3 rounded-xl bg-primary text-black font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                                >
                                    Đăng Ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
