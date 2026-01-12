'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, TrendingUp, Clock, ArrowRight, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { highlightText } from '@/lib/search-utils';
import ProductBadge from '@/components/common/ProductBadge';

// Fallback images for each product type (same as in api.ts)
const FALLBACK_IMAGES: Record<string, string> = {
    'bicycle': 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=1000',
    'motorcycle': 'https://images.unsplash.com/photo-1558981001-5864b3250a69?auto=format&fit=crop&q=80&w=1000',
    'accessory': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800', // Same as api.ts
};

interface SearchResult {
    id: number;
    slug: string;
    name: string;
    thumbnail: string;
    price: number;
    type: 'motorcycle' | 'bicycle' | 'accessory';
    range?: number;
    topSpeed?: number;
    category?: string;
    isFeatured: boolean;
}

interface SmartSearchBarProps {
    isOpen: boolean;
    onClose: () => void;
    isNavbarVisible?: boolean;
    isNavbarScrolled?: boolean;
    autoFocus?: boolean;
}

export default function SmartSearchBar({ 
    isOpen, 
    onClose, 
    isNavbarVisible = true,
    isNavbarScrolled = false,
    autoFocus = false 
}: SmartSearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [navbarHeight, setNavbarHeight] = useState(104);

    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

    // Measure actual navbar height from DOM
    useEffect(() => {
        const updateNavbarHeight = () => {
            const navbar = document.querySelector('nav');
            if (navbar) {
                const height = navbar.getBoundingClientRect().height;
                setNavbarHeight(height);
            }
        };

        // Update on mount and when scroll state changes
        updateNavbarHeight();
        
        // Use ResizeObserver to track navbar height changes
        const navbar = document.querySelector('nav');
        if (navbar) {
            const observer = new ResizeObserver(updateNavbarHeight);
            observer.observe(navbar);
            return () => observer.disconnect();
        }
    }, [isNavbarScrolled]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch {
                setRecentSearches([]);
            }
        }
    }, []);

    // Auto focus when opened
    useEffect(() => {
        if (isOpen && autoFocus) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, autoFocus]);

    // Reset state when closing
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults([]);
            setSelectedIndex(-1);
        }
    }, [isOpen]);

    // Search function
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            // Search both cars and accessories
            const [carsResponse, accessoriesResponse] = await Promise.all([
                fetch(
                    `${STRAPI_URL}/api/car-models?` +
                    new URLSearchParams({
                        'filters[$or][0][name][$containsi]': searchQuery,
                        'filters[$or][1][brand][$containsi]': searchQuery,
                        'filters[$or][2][type][$containsi]': searchQuery,
                        'populate': 'thumbnail',
                        'pagination[pageSize]': '4',
                        'sort': 'isFeatured:desc,createdAt:desc'
                    })
                ),
                // Accessories search with proper Strapi field names (Capital case)
                fetch(
                    `${STRAPI_URL}/api/accessories?` +
                    new URLSearchParams({
                        'filters[Name][$containsi]': searchQuery, // Capital N
                        'populate': '*',
                        'pagination[pageSize]': '2',
                        'sort': 'createdAt:desc'
                    })
                ).catch((err) => {
                    console.log('Accessories fetch error:', err);
                    return null;
                })
            ]);

            // Process cars
            let carResults: SearchResult[] = [];
            if (carsResponse.ok) {
                const carsData = await carsResponse.json();
                if (carsData.data && Array.isArray(carsData.data)) {
                    carResults = carsData.data.map((item: any) => {
                        const type = item.type || 'bicycle';
                        
                        let thumbnailUrl = FALLBACK_IMAGES[type] || FALLBACK_IMAGES['bicycle'];
                        if (item.thumbnail?.url) {
                            const url = item.thumbnail.url;
                            thumbnailUrl = url.startsWith('http://') || url.startsWith('https://') 
                                ? url 
                                : `${STRAPI_URL}${url}`;
                        }

                        return {
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            thumbnail: thumbnailUrl,
                            price: item.price,
                            type: item.type,
                            range: item.range,
                            topSpeed: item.topSpeed,
                            isFeatured: item.isFeatured
                        };
                    });
                }
            }

            // Process accessories
            let accessoryResults: SearchResult[] = [];
            if (accessoriesResponse && accessoriesResponse.ok) {
                try {
                    const accessoriesData = await accessoriesResponse.json();
                    console.log('Accessories API response:', accessoriesData); // Debug log
                    
                    if (accessoriesData.data && Array.isArray(accessoriesData.data)) {
                        accessoryResults = accessoriesData.data.map((item: any) => {
                            let thumbnailUrl = FALLBACK_IMAGES['accessory'];
                            
                            // Try different possible image field names (Capital case in Strapi)
                            const imageField = item.Image || item.Images || item.image || item.images || item.thumbnail || item.Thumbnail;
                            if (imageField) {
                                // Handle both single image and array of images
                                const imageUrl = Array.isArray(imageField) 
                                    ? imageField[0]?.url 
                                    : imageField.url;
                                    
                                if (imageUrl) {
                                    thumbnailUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://') 
                                        ? imageUrl 
                                        : `${STRAPI_URL}${imageUrl}`;
                                }
                            }

                            return {
                                id: item.id,
                                slug: item.Slug || item.slug || `accessory-${item.id}`, // Try capital Slug first
                                name: item.Name || item.name || item.title || 'Phụ kiện', // Try capital Name first
                                thumbnail: thumbnailUrl,
                                price: item.Price || item.price || 0, // Try capital Price first
                                type: 'accessory' as const,
                                category: item.Category || item.category || item.type, // Try capital Category first
                                isFeatured: false
                            };
                        });
                    }
                } catch (err) {
                    console.error('Error processing accessories:', err);
                }
            }

            // Combine results: cars first, then accessories
            setResults([...carResults, ...accessoryResults]);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [STRAPI_URL]);

    // Debounced search
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (query.trim()) {
            debounceTimeoutRef.current = setTimeout(() => {
                performSearch(query);
            }, 300);
        } else {
            setResults([]);
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [query, performSearch]);

    // Save to recent searches
    const saveRecentSearch = (searchTerm: string) => {
        const trimmed = searchTerm.trim();
        if (!trimmed) return;

        const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Handle product click
    const handleProductClick = (product: SearchResult) => {
        saveRecentSearch(query);
        onClose();
        if (product.type === 'accessory') {
            router.push(`/accessories/${product.slug}`);
        } else {
            router.push(`/cars/${product.slug}`);
        }
    };

    // Handle search submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            saveRecentSearch(query);
            onClose();
            router.push(`/cars?search=${encodeURIComponent(query)}`);
        }
    };

    // Handle recent search click
    const handleRecentClick = (term: string) => {
        setQuery(term);
        performSearch(term);
    };

    // Clear recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleProductClick(results[selectedIndex]);
        }
    };

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
            selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedIndex]);

    const trendingSearches = [
        'Xe máy điện TAILG',
        'Xe đạp điện',
        'Xe điện giá rẻ',
        'Pin lithium'
    ];

    return (
        <AnimatePresence>
            {isOpen && isNavbarVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, top: `${navbarHeight}px` }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-45"
                        onClick={onClose}
                        onMouseDown={(e) => e.stopPropagation()}
                    />

                    {/* Search Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0, top: `${navbarHeight}px` }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed left-0 right-0 z-45"
                        onClick={(e) => e.stopPropagation()}
                    >
                <div className="container mx-auto px-4 pt-4 pb-2">
                    <div className="bg-white dark:bg-card/98 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden max-w-3xl mx-auto">
                        {/* Search Input */}
                        <form onSubmit={handleSubmit} className="relative border-b border-gray-200 dark:border-white/10">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập tên xe, hãng, loại xe..."
                                className="w-full bg-transparent pl-12 pr-24 py-4 text-base text-foreground placeholder:text-gray-400 focus:outline-none"
                                autoComplete="off"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery('');
                                        setResults([]);
                                        inputRef.current?.focus();
                                    }}
                                    className="absolute right-16 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-foreground transition-colors"
                                    title="Xóa"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        <button
                            type="submit"
                            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-black text-sm font-semibold rounded-lg transition-colors"
                        >
                            Tìm
                        </button>
                        </form>

                        <div className="max-h-[70vh] overflow-y-auto border-t border-gray-200 dark:border-white/10">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : results.length > 0 ? (
                                <div ref={resultsRef} className="p-3">
                                    <div className="text-sm font-semibold text-foreground px-2 py-2 border-b border-gray-200 dark:border-white/10 mb-2">
                                        Kết quả tìm kiếm ({results.length})
                                    </div>
                                    {results.map((product, index) => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleProductClick(product)}
                                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                                                selectedIndex === index
                                                    ? 'bg-primary/10 border-primary/30'
                                                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5">
                                                <Image
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute top-1 left-1">
                                                    <ProductBadge product={product} size="sm" />
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 text-left min-w-0">
                                                <div className="font-semibold text-sm text-foreground mb-1 line-clamp-1">
                                                    {highlightText(product.name, query)}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="capitalize">
                                                        {product.type === 'motorcycle' ? 'Xe máy' : product.type === 'bicycle' ? 'Xe đạp' : 'Phụ kiện'}
                                                    </span>
                                                    {product.type !== 'accessory' && product.range && product.topSpeed && (
                                                        <><span>•</span><span>{product.range}km • {product.topSpeed}km/h</span></>
                                                    )}
                                                    {product.type === 'accessory' && product.category && (
                                                        <><span>•</span><span>{product.category}</span></>
                                                    )}
                                                </div>
                                                <div className="text-sm font-bold text-primary">
                                                    {formatCurrency(product.price)}
                                                </div>
                                            </div>

                                            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        </button>
                                    ))}

                                    {/* View All Results */}
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full mt-2 p-3 text-center text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>Xem tất cả kết quả</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : query.trim() ? (
                                <div className="py-12 text-center">
                                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                        Không tìm thấy kết quả cho “{query}”
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                        Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-5">
                                    {/* Recent Searches */}
                                    {recentSearches.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm font-semibold text-foreground">
                                                    Tìm kiếm gần đây
                                                </div>
                                                <button
                                                    onClick={clearRecentSearches}
                                                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                                                >
                                                    Xóa tất cả
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {recentSearches.map((term, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleRecentClick(term)}
                                                        className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-sm text-foreground transition-colors"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trending Searches */}
                                    <div>
                                        <div className="text-sm font-semibold text-foreground mb-3">
                                            Tìm kiếm phổ biến
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {trendingSearches.map((term, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleRecentClick(term)}
                                                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-full text-sm text-primary font-medium transition-colors"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quick Links */}
                                    <div>
                                        <div className="text-sm font-semibold text-foreground mb-3">
                                            Danh mục sản phẩm
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    router.push('/cars?type=motorcycle');
                                                }}
                                                className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-left transition-colors"
                                            >
                                                <div className="font-semibold text-sm text-foreground mb-1">
                                                    Xe máy điện
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Xem tất cả xe máy
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    router.push('/cars?type=bicycle');
                                                }}
                                                className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-left transition-colors"
                                            >
                                                <div className="font-semibold text-sm text-foreground mb-1">
                                                    Xe đạp điện
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Xem tất cả xe đạp
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    router.push('/accessories');
                                                }}
                                                className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-left transition-colors col-span-2"
                                            >
                                                <div className="font-semibold text-sm text-foreground mb-1">
                                                    Phụ kiện & Sạc
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Xem tất cả phụ kiện
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
