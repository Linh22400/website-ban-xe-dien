import { getAccessories } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ThemeText } from "@/components/common/ThemeText";
import ProductBadge from "@/components/common/ProductBadge";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        category?: string;
    }>
}

export default async function AccessoriesPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const category = resolvedSearchParams.category;
    const accessories = await getAccessories(category);

    const categories = [
        { id: 'all', name: 'Tất cả', value: undefined },
        { id: 'battery', name: 'Pin & Sạc', value: 'battery' },
        { id: 'helmet', name: 'Mũ Bảo Hiểm', value: 'helmet' },
        { id: 'other', name: 'Phụ Kiện Khác', value: 'other' },
    ];

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            {/* Header */}
            <div className="bg-secondary/30 border-b border-white/5 py-12 mb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Phụ Kiện & Pin
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Trang Chủ</Link>
                        <span>/</span>
                        <ThemeText>Phụ Kiện</ThemeText>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-4 mb-10 justify-center">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.value ? `/accessories?category=${cat.value}` : '/accessories'}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${(category === cat.value) || (!category && !cat.value)
                                ? 'bg-primary text-black shadow-[0_0_15px_rgba(0,255,148,0.3)]'
                                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Product Grid */}
                {accessories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {accessories.map((item) => (
                            <Link
                                key={item.id}
                                href={`/accessories/${item.slug}`}
                                className="group block bg-card/30 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden bg-white/5">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Dynamic Badge */}
                                    <div className="absolute top-3 right-3">
                                        <ProductBadge product={item} size="sm" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="text-xs font-bold mb-2 uppercase tracking-wider inline-block px-3 py-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white rounded-full shadow-lg shadow-blue-500/50 border border-white/20">
                                        {item.category === 'battery' ? 'Pin & Sạc' :
                                            item.category === 'helmet' ? 'Mũ Bảo Hiểm' : 'Phụ Kiện'}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem] text-cyan-500 dark:text-cyan-400 transition-all duration-300 group-hover:scale-105 group-hover:tracking-wide relative inline-block">
                                        <ThemeText>{item.name}</ThemeText>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
                                    </h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-xl font-bold text-cyan-500 dark:text-cyan-400">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors shadow-lg shadow-cyan-500/50">
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card/30 rounded-2xl border border-white/5">
                        <div className="text-4xl mb-4">📦</div>
                        <h3 className="text-xl font-bold mb-2"><ThemeText>Chưa có sản phẩm nào</ThemeText></h3>
                        <p className="text-muted-foreground">
                            Danh mục này đang được cập nhật. Vui lòng quay lại sau!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
