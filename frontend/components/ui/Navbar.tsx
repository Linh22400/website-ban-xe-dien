"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import {
    ShoppingCart,
    Heart,
    Phone,
    Search,
    Menu,
    X,
    User,
    ChevronDown,
    Zap
} from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const { isAuthenticated, user, logout } = useAuth();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();

    // Handle scroll behavior
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Add background when scrolled
                    setIsScrolled(currentScrollY > 10);

                    // Hide navbar on scroll down, show on scroll up
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const productCategories = [
        { href: "/cars?type=motorcycle", label: "Xe Máy Điện" },
        { href: "/cars?type=bicycle", label: "Xe Đạp Điện" },
        { href: "/accessories", label: "Phụ Kiện" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/70 backdrop-blur-xl border-b border-white/10 shadow-lg"
                : "bg-background/60 backdrop-blur-lg border-b border-white/5"
                } ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="container mx-auto px-4">
                {/* Top Bar - Hotline & Quick Links */}
                <div className={`hidden md:flex items-center justify-between py-2 border-b border-white/5 transition-all duration-300 ${isScrolled ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100"
                    }`}>
                    <div className="flex items-center gap-6 text-xs">
                        <a
                            href="tel:1900xxxx"
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="font-semibold">Hotline: 1900 XXXX</span>
                        </a>
                        <Link
                            href="/tracking"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            Tra Cứu Đơn Hàng
                        </Link>
                        <Link
                            href="/promotions"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            Khuyến Mãi Hot 🔥
                        </Link>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Link href="/about" className="hover:text-primary transition-colors">
                            Về Chúng Tôi
                        </Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">
                            Liên Hệ
                        </Link>
                    </div>
                </div>

                {/* Main Navbar */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                            <Zap className="w-6 h-6 text-black" />
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                                XE ĐIỆN XANH
                            </div>
                            <div className="text-[10px] text-muted-foreground -mt-1">
                                Chính Hãng - Uy Tín
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-sm font-semibold text-white hover:text-primary transition-colors"
                        >
                            Trang Chủ
                        </Link>

                        {/* Products Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                                Sản Phẩm
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-card/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                {productCategories.map((cat) => (
                                    <Link
                                        key={cat.href}
                                        href={cat.href}
                                        className="block px-4 py-3 text-sm text-white hover:bg-primary/10 hover:text-primary transition-colors first:rounded-t-xl last:rounded-b-xl"
                                    >
                                        {cat.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/compare"
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                            So Sánh
                        </Link>
                        <Link
                            href="/blog"
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                            Tin Tức
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Toggle */}
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="hidden md:flex relative p-2 text-muted-foreground hover:text-primary transition-colors group"
                            aria-label="Wishlist"
                        >
                            <Heart className="w-5 h-5 group-hover:fill-primary transition-all" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Shopping Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-muted-foreground hover:text-primary transition-colors group"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        {isAuthenticated ? (
                            <div className="hidden md:block relative group">
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:text-primary transition-colors">
                                    <User className="w-4 h-4" />
                                    {user?.username}
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-card/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <Link
                                        href="/account"
                                        className="block px-4 py-3 text-sm text-white hover:bg-primary/10 hover:text-primary transition-colors rounded-t-xl"
                                    >
                                        Tài Khoản
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="block px-4 py-3 text-sm text-white hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        Đơn Hàng
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-primary/10 hover:text-primary transition-colors rounded-b-xl"
                                    >
                                        Đăng Xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Đăng Nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all text-sm"
                                >
                                    Đăng Ký
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 text-white"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Search Bar Dropdown */}
                <div className={`overflow-hidden transition-all duration-300 ${showSearch ? "max-h-24 py-4 border-t border-white/5" : "max-h-0"
                    }`}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm xe điện, phụ kiện..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            autoFocus={showSearch}
                        />
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden border-t border-white/5 py-4">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="text-white font-semibold hover:text-primary transition-colors"
                            >
                                Trang Chủ
                            </Link>

                            {/* Mobile Products */}
                            <div>
                                <div className="text-white font-semibold mb-2">Sản Phẩm</div>
                                <div className="pl-4 flex flex-col gap-2">
                                    {productCategories.map((cat) => (
                                        <Link
                                            key={cat.href}
                                            href={cat.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {cat.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href="/compare"
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                So Sánh
                            </Link>
                            <Link
                                href="/promotions"
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Khuyến Mãi
                            </Link>
                            <Link
                                href="/blog"
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Tin Tức
                            </Link>
                            <Link
                                href="/tracking"
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Tra Cứu Đơn Hàng
                            </Link>

                            {/* Mobile Wishlist */}
                            <Link
                                href="/wishlist"
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                                <Heart className="w-4 h-4" />
                                Yêu Thích {wishlistCount > 0 && `(${wishlistCount})`}
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="text-white font-bold"
                                    >
                                        <User className="w-4 h-4 inline mr-2" />
                                        {user?.username}
                                    </Link>
                                    <Link
                                        href="/orders"
                                        onClick={() => setIsOpen(false)}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Đơn Hàng
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        className="text-left text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Đăng Xuất
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Đăng Nhập
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg transition-all text-center"
                                    >
                                        Đăng Ký
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
