"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { getCars, getAccessories, type Car, type Accessory } from "@/lib/api";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NotificationBell from "@/components/common/NotificationBell";
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
    ArrowRight
} from "lucide-react";

interface NavbarItem {
    href: string;
    label: string;
    image?: string;
    price?: string;
    badge?: string;
    desc?: string;
    isViewAll?: boolean;
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [showMobileProducts, setShowMobileProducts] = useState(false);
    
    // State for dynamic data
    const [motorcycles, setMotorcycles] = useState<NavbarItem[]>([]);
    const [bicycles, setBicycles] = useState<NavbarItem[]>([]);
    const [accessories, setAccessories] = useState<NavbarItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const lastScrollYRef = useRef(0);
    const tickingRef = useRef(false);

    const { isAuthenticated, user, logout } = useAuth();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();

    // Fetch products data
    useEffect(() => {
        const fetchNavbarData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch motorcycles, bicycles, and accessories in parallel
                const [motorcyclesData, bicyclesData, accessoriesData] = await Promise.all([
                    getCars({ type: 'motorcycle', pageSize: 4, sort: 'isFeatured:desc,createdAt:desc' }),
                    getCars({ type: 'bicycle', pageSize: 4, sort: 'isFeatured:desc,createdAt:desc' }),
                    getAccessories()
                ]);

                // Transform motorcycles data
                const motorcycleItems: NavbarItem[] = motorcyclesData.map((car) => ({
                    href: `/cars/${car.slug}`,
                    label: car.name,
                    image: car.thumbnail || '/images/placeholder-product.jpg',
                    price: `${car.price.toLocaleString('vi-VN')}\u20ab`,
                    badge: car.isFeatured ? 'HOT' : undefined,
                    desc: `${car.range}km - ${car.topSpeed}km/h`
                }));
                motorcycleItems.push({ 
                    href: '/cars?type=motorcycle', 
                    label: 'Xem t\u1ea5t c\u1ea3 xe m\u00e1y \u0111i\u1ec7n', 
                    isViewAll: true 
                });

                // Transform bicycles data
                const bicycleItems: NavbarItem[] = bicyclesData.map((car) => ({
                    href: `/cars/${car.slug}`,
                    label: car.name,
                    image: car.thumbnail || '/images/placeholder-product.jpg',
                    price: `${car.price.toLocaleString('vi-VN')}\u20ab`,
                    badge: car.isFeatured ? 'HOT' : undefined,
                    desc: `${car.range}km - ${car.topSpeed}km/h`
                }));
                bicycleItems.push({ 
                    href: '/cars?type=bicycle', 
                    label: 'Xem t\u1ea5t c\u1ea3 xe \u0111\u1ea1p \u0111i\u1ec7n', 
                    isViewAll: true 
                });

                // Transform accessories data - take top 4 (prioritize featured)
                const sortedAccessories = accessoriesData
                    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
                    .slice(0, 4);
                    
                const accessoryItems: NavbarItem[] = sortedAccessories.map((acc) => {
                    const categoryLabels: Record<string, string> = {
                        'battery': 'Pin & S\u1ea1c',
                        'charger': 'S\u1ea1c',
                        'helmet': 'M\u0169 B\u1ea3o Hi\u1ec3m',
                        'other': 'Ph\u1ee5 ki\u1ec7n kh\u00e1c'
                    };
                    
                    return {
                        href: `/accessories#${acc.slug}`,
                        label: acc.name,
                        image: acc.image || '/images/placeholder-accessory.jpg',
                        price: acc.price > 0 ? `${acc.price.toLocaleString('vi-VN')}\u20ab` : 'Li\u00ean h\u1ec7',
                        desc: categoryLabels[acc.category] || acc.category,
                        badge: acc.isFeatured ? 'HOT' : undefined
                    };
                });
                
                // If less than 4, add some category links
                if (accessoryItems.length < 4) {
                    const categories = [
                        { href: '/accessories?category=battery', label: 'Pin & S\u1ea1c', desc: 'Pin lithium ch\u00ednh h\u00e3ng', image: '/images/placeholder-accessory.jpg', price: 'T\u1eeb 1.200.000\u20ab' },
                        { href: '/accessories?category=helmet', label: 'M\u0169 B\u1ea3o Hi\u1ec3m', desc: 'Ch\u1ea5t l\u01b0\u1ee3ng cao', image: '/images/placeholder-accessory.jpg', price: 'T\u1eeb 350.000\u20ab' },
                        { href: '/accessories?category=other', label: 'Ph\u1ee5 ki\u1ec7n kh\u00e1c', desc: 'Ph\u1ee5 ki\u1ec7n \u0111a d\u1ea1ng', image: '/images/placeholder-accessory.jpg', price: 'Li\u00ean h\u1ec7' }
                    ];
                    
                    categories.slice(0, 4 - accessoryItems.length).forEach(cat => {
                        accessoryItems.push(cat);
                    });
                }
                
                accessoryItems.push({ 
                    href: '/accessories', 
                    label: 'Xem t\u1ea5t c\u1ea3 ph\u1ee5 ki\u1ec7n', 
                    isViewAll: true 
                });

                setMotorcycles(motorcycleItems);
                setBicycles(bicycleItems);
                setAccessories(accessoryItems);
            } catch (error) {
                console.error('Error fetching navbar data:', error);
                // Set fallback data on error
                setMotorcycles([{ href: '/cars?type=motorcycle', label: 'Xem t\u1ea5t c\u1ea3 xe m\u00e1y \u0111i\u1ec7n', isViewAll: true }]);
                setBicycles([{ href: '/cars?type=bicycle', label: 'Xem t\u1ea5t c\u1ea3 xe \u0111\u1ea1p \u0111i\u1ec7n', isViewAll: true }]);
                setAccessories([{ href: '/accessories', label: 'Xem t\u1ea5t c\u1ea3 ph\u1ee5 ki\u1ec7n', isViewAll: true }]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNavbarData();
    }, []);

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;

            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                const nextIsScrolled = currentScrollY > 10;
                setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled));

                // Hide navbar on scroll down, show on scroll up
                const nextIsVisible = !(currentScrollY > lastScrollYRef.current && currentScrollY > 100);
                setIsVisible((prev) => (prev === nextIsVisible ? prev : nextIsVisible));

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

    const submitSearch = () => {
        const q = searchQuery.trim();
        if (!q) return;
        setShowSearch(false);
        setIsOpen(false);
        router.push(`/cars?search=${encodeURIComponent(q)}`);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-background/95 border-b border-white/10 shadow-lg ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
            style={{ willChange: 'transform' }}
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
                            <div className="text-[10px] -mt-1 text-muted-foreground">
                                Chính Hãng - Uy Tín
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                            Trang Chủ
                        </Link>

                        {/* Motorcycles Dropdown */}
                        <div className="relative group">
                            <Link
                                href="/cars?type=motorcycle"
                                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors py-2"
                            >
                                Xe Máy Điện
                                <ChevronDown className="w-4 h-4" />
                            </Link>
                            <div className="absolute top-full left-0 pt-2 w-[520px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                                <div className="bg-white dark:bg-card/98 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                    {/* Grid Products */}
                                    <div className="grid grid-cols-2 gap-1 p-2">
                                        {motorcycles.filter(item => !item.isViewAll).map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20 hover:shadow-md"
                                            >
                                                {/* Image */}
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
                                                    <Image
                                                        src={item.image || '/images/placeholder-product.jpg'}
                                                        alt={item.label}
                                                        fill
                                                        className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                    />
                                                    {item.badge && (
                                                        <div className={`absolute top-1 left-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            item.badge === 'HOT' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                                        }`}>
                                                            {item.badge}
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
                                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors py-2"
                            >
                                Xe Đạp Điện
                                <ChevronDown className="w-4 h-4" />
                            </Link>
                            <div className="absolute top-full left-0 pt-2 w-[520px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
                                <div className="bg-white dark:bg-card/98 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                                    {/* Grid Products */}
                                    <div className="grid grid-cols-2 gap-1 p-2">
                                        {bicycles.filter(item => !item.isViewAll).map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20 hover:shadow-md"
                                            >
                                                {/* Image */}
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
                                                    <Image
                                                        src={item.image || '/images/placeholder-product.jpg'}
                                                        alt={item.label}
                                                        fill
                                                        className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                    />
                                                    {item.badge && (
                                                        <div className={`absolute top-1 left-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            item.badge === 'HOT' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                                        }`}>
                                                            {item.badge}
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
                                        href="/cars?type=bicycle"
                                        className="flex items-center justify-center gap-2 py-3 border-t border-gray-200 dark:border-white/10 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 text-primary font-bold text-sm transition-all group/btn"
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
                                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors py-2"
                            >
                                Phụ Kiện
                                <ChevronDown className="w-4 h-4" />
                            </Link>
                            <div className="absolute top-full left-0 pt-2 w-[520px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
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
                                                        src={item.image || '/images/placeholder-accessory.jpg'}
                                                        alt={item.label}
                                                        fill
                                                        className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                    />
                                                    {item.badge && (
                                                        <div className={`absolute top-1 left-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            item.badge === 'HOT' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                                                        }`}>
                                                            {item.badge}
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
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-foreground text-xs font-bold rounded-full flex items-center justify-center px-1">
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
                            aria-label="Shopping Cart"
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
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                                    <User className="w-4 h-4" />
                                    {user?.username}
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card/95 border-2 border-gray-200 dark:border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
                                    <Link
                                        href="/account"
                                        className="block px-4 py-3 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-primary transition-colors rounded-t-xl"
                                    >
                                        Tài Khoản
                                    </Link>
                                    <Link
                                            href="/account/orders"
                                        className="block px-4 py-3 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        Đơn Hàng
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-primary/10 hover:text-primary transition-colors rounded-b-xl"
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
                                    className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-shadow text-sm"
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

                {/* Search Bar Dropdown */}
                <div className={`overflow-hidden transition-all duration-300 ${showSearch ? "max-h-24 py-4 border-t border-white/5" : "max-h-0"
                    }`}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm xe điện, phụ kiện..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                            autoFocus={showSearch}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    submitSearch();
                                }
                            }}
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
                                className="text-foreground font-semibold hover:text-primary transition-colors"
                            >
                                Trang Chủ
                            </Link>

                            {/* Mobile Products */}
                            <div className="space-y-4">
                                {/* Motorcycles */}
                                <div>
                                    <Link
                                        href="/cars?type=motorcycle"
                                        onClick={() => setIsOpen(false)}
                                        className="text-foreground font-semibold flex items-center justify-between w-full mb-2"
                                    >
                                        <span>Xe Máy Điện</span>
                                    </Link>
                                    <div className="pl-4 flex flex-col gap-2">
                                        {motorcycles.filter(m => !m.isViewAll).map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Bicycles */}
                                <div>
                                    <Link
                                        href="/cars?type=bicycle"
                                        onClick={() => setIsOpen(false)}
                                        className="text-foreground font-semibold flex items-center justify-between w-full mb-2"
                                    >
                                        <span>Xe Đạp Điện</span>
                                    </Link>
                                    <div className="pl-4 flex flex-col gap-2">
                                        {bicycles.filter(b => !b.isViewAll).map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Accessories */}
                                <div>
                                    <Link
                                        href="/accessories"
                                        onClick={() => setIsOpen(false)}
                                        className="text-foreground font-semibold flex items-center justify-between w-full mb-2"
                                    >
                                        <span>Phụ Kiện</span>
                                    </Link>
                                    <div className="pl-4 flex flex-col gap-2">
                                        {accessories.filter(a => !a.isViewAll).map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
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
                                        className="text-foreground font-bold"
                                    >
                                        <User className="w-4 h-4 inline mr-2" />
                                        {user?.username}
                                    </Link>
                                    <Link
                                        href="/account/orders"
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
                                        className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg transition-shadow text-center"
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
