"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { getCars, getAccessories, getPromotions, type Car, type Accessory } from "@/lib/api";
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
    ArrowRight
} from "lucide-react";

interface NavbarItem {
    href: string;
    label: string;
    image?: string;
    price?: string;
    originalPrice?: string;
    discount?: number;
    desc?: string;
    isViewAll?: boolean;
    product?: any; // Store full product data for dynamic badge calculation
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showSmartSearch, setShowSmartSearch] = useState(false);
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

    // Fetch products data
    useEffect(() => {
        const fetchNavbarData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch motorcycles, bicycles, accessories and promotions in parallel
                // Fetch ALL products to ensure we have enough for sorting and display
                const [motorcyclesData, bicyclesData, accessoriesData, promotionsData] = await Promise.all([
                    getCars({ type: 'motorcycle', pageSize: 100 }), // Fetch all to ensure enough products
                    getCars({ type: 'bicycle', pageSize: 100 }), // Fetch all to ensure enough products
                    getAccessories(),
                    getPromotions()
                ]);

                // Helper function to calculate discount for a car
                const getCarDiscount = (carId: string, carDocumentId: string) => {
                    let discount = 0;
                    promotionsData.forEach((promo) => {
                        if (promo.isActive && promo.discountPercent && promo.car_models) {
                            promo.car_models.forEach((promoCar: any) => {
                                if (String(promoCar.id) === String(carId) || (promoCar.documentId && promoCar.documentId === carDocumentId)) {
                                    discount = Math.max(discount, promo.discountPercent || 0);
                                }
                            });
                        }
                    });
                    return discount;
                };

                // Sort function: Prioritize HOT (isFeatured) + high sales, then by sales count
                // This will sort ALL products and take top 4, including non-HOT products if needed
                const sortProducts = (products: Car[]) => {
                    return products.sort((a, b) => {
                        const aIsFeatured = a.isFeatured ? 1 : 0;
                        const bIsFeatured = b.isFeatured ? 1 : 0;
                        const aSales = a.sold || 0;
                        const bSales = b.sold || 0;

                        // Priority 1: Featured products come first
                        if (aIsFeatured !== bIsFeatured) {
                            return bIsFeatured - aIsFeatured;
                        }

                        // Priority 2: Within same featured status, sort by sales count (high to low)
                        return bSales - aSales;
                    }).slice(0, 4); // Take top 4 after sorting - will include both HOT and regular products
                };

                // Transform motorcycles data
                const sortedMotorcycles = sortProducts(motorcyclesData);
                const motorcycleItems: NavbarItem[] = sortedMotorcycles.map((car) => {
                    const discount = getCarDiscount(car.id, car.documentId);
                    const finalPrice = discount > 0 ? car.price * (1 - discount / 100) : car.price;
                    return {
                        href: `/cars/${car.slug}`,
                        label: car.name,
                        image: car.thumbnail || '/images/placeholder-product.jpg',
                        price: `${Math.round(finalPrice).toLocaleString('vi-VN')}\u20ab`,
                        originalPrice: discount > 0 ? `${car.price.toLocaleString('vi-VN')}\u20ab` : undefined,
                        discount: discount > 0 ? Math.round(discount) : undefined,
                        desc: `${car.range}km - ${car.topSpeed}km/h`,
                        // Store full product data with discount for dynamic badge
                        product: { ...car, discount: discount > 0 ? discount : undefined }
                    };
                });
                motorcycleItems.push({ 
                    href: '/cars?type=motorcycle', 
                    label: 'Xem t\u1ea5t c\u1ea3 xe m\u00e1y \u0111i\u1ec7n', 
                    isViewAll: true 
                });

                // Transform bicycles data
                const sortedBicycles = sortProducts(bicyclesData);
                const bicycleItems: NavbarItem[] = sortedBicycles.map((car) => {
                    const discount = getCarDiscount(car.id, car.documentId);
                    const finalPrice = discount > 0 ? car.price * (1 - discount / 100) : car.price;
                    return {
                        href: `/cars/${car.slug}`,
                        label: car.name,
                        image: car.thumbnail || '/images/placeholder-product.jpg',
                        price: `${Math.round(finalPrice).toLocaleString('vi-VN')}\u20ab`,
                        originalPrice: discount > 0 ? `${car.price.toLocaleString('vi-VN')}\u20ab` : undefined,
                        discount: discount > 0 ? Math.round(discount) : undefined,
                        desc: `${car.range}km - ${car.topSpeed}km/h`,
                        // Store full product data with discount for dynamic badge
                        product: { ...car, discount: discount > 0 ? discount : undefined }
                    };
                });
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
                        image: acc.image || 'https://via.placeholder.com/300x200?text=Accessory',
                        price: acc.price > 0 ? `${acc.price.toLocaleString('vi-VN')}\u20ab` : 'Li\u00ean h\u1ec7',
                        desc: categoryLabels[acc.category] || acc.category,
                        product: acc
                    };
                });
                
                // If less than 4, add some category links
                if (accessoryItems.length < 4) {
                    const categories = [
                        { href: '/accessories?category=battery', label: 'Pin & S\u1ea1c', desc: 'Pin lithium ch\u00ednh h\u00e3ng', image: 'https://images.unsplash.com/photo-1609069768451-aa3e54d48f1e?auto=format&fit=crop&q=80&w=400', price: 'T\u1eeb 1.200.000\u20ab' },
                        { href: '/accessories?category=helmet', label: 'M\u0169 B\u1ea3o Hi\u1ec3m', desc: 'Ch\u1ea5t l\u01b0\u1ee3ng cao', image: 'https://images.unsplash.com/photo-1609069768451-aa3e54d48f1e?auto=format&fit=crop&q=80&w=400', price: 'T\u1eeb 350.000\u20ab' },
                        { href: '/accessories?category=other', label: 'Ph\u1ee5 ki\u1ec7n kh\u00e1c', desc: 'Ph\u1ee5 ki\u1ec7n \u0111a d\u1ea1ng', image: 'https://images.unsplash.com/photo-1609069768451-aa3e54d48f1e?auto=format&fit=crop&q=80&w=400', price: 'Li\u00ean h\u1ec7' }
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
                            Khuyến Mãi Hot
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
                        <div className="relative w-12 h-12 transform group-hover:scale-105 transition-transform">
                            <Image
                                src="/logo(Ducduy).jpg"
                                alt="Đức Duy Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-xl font-black text-[#0D5E3A] dark:text-[#10B981]">
                                XE ĐIỆN ĐỨC DUY
                            </div>
                            <div className="text-[10px] -mt-1 text-[#C81E1E] dark:text-[#EF4444] font-semibold">
                                Chính Hãng TAILG - Uy Tín
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
                            <div className="absolute top-full left-0 pt-2 w-[640px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
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
                                                        src={item.image || '/images/placeholder-product.jpg'}
                                                        alt={item.label}
                                                        fill
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
                                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors py-2"
                            >
                                Xe Đạp Điện
                                <ChevronDown className="w-4 h-4" />
                            </Link>
                            <div className="absolute top-full left-0 pt-2 w-[640px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out">
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
                                                        src={item.image || '/images/placeholder-product.jpg'}
                                                        alt={item.label}
                                                        fill
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
                                                        src={item.image || 'https://via.placeholder.com/300x200?text=Accessory'}
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
                        {/* Smart Search Toggle - Desktop */}
                        <button
                            onClick={() => setShowSmartSearch(true)}
                            className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg transition-all hover:border-primary w-[280px]"
                            aria-label="Tìm kiếm"
                        >
                            <Search className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400 flex-1 text-left">
                                Tìm xe điện, phụ kiện...
                            </span>
                        </button>
                        
                        {/* Mobile Search Icon */}
                        <button
                            onClick={() => setShowSmartSearch(true)}
                            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
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
                                Khuyến Mãi Hot
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
        </>
    );
}