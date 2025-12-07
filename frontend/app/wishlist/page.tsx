"use client";

import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
    const { items, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (item: typeof items[0]) => {
        addToCart(item);
        // Optionally remove from wishlist after adding to cart
        // removeFromWishlist(item.id);
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-background pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Danh Sách Yêu Thích Trống</h1>
                        <p className="text-muted-foreground mb-8">
                            Bạn chưa có sản phẩm yêu thích nào. Hãy lưu các sản phẩm ưa thích để dễ dàng tìm lại!
                        </p>
                        <Link
                            href="/cars"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Khám Phá Sản Phẩm
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Danh Sách Yêu Thích</h1>
                            <p className="text-muted-foreground">
                                {items.length} sản phẩm
                            </p>
                        </div>
                        <button
                            onClick={clearWishlist}
                            className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors"
                        >
                            Xóa Tất Cả
                        </button>
                    </div>

                    {/* Wishlist Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-card border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-white/5">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-4 right-4 p-2 bg-red-500/90 hover:bg-red-500 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5 text-white" />
                                    </button>
                                </div>

                                {/* Details */}
                                <div className="p-6">
                                    <Link
                                        href={`/cars/${item.slug}`}
                                        className="text-lg font-bold text-white hover:text-primary transition-colors line-clamp-2 mb-2 block"
                                    >
                                        {item.name}
                                    </Link>
                                    <p className="text-primary font-bold text-2xl mb-4">
                                        {item.price.toLocaleString("vi-VN")} VNĐ
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Thêm Vào Giỏ
                                        </button>
                                        <Link
                                            href={`/cars/${item.slug}`}
                                            className="px-4 py-3 border-2 border-white/10 text-white font-semibold rounded-full hover:border-primary hover:text-primary transition-all"
                                        >
                                            Xem
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
