"use client";

import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { WishlistHeading, ProductName, ViewButton } from "@/components/wishlist/WishlistComponents";

export default function WishlistPage() {
    const { items, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (item: typeof items[0]) => {
        // Transform WishlistItem to CartItem format
        addToCart({
            ...item,
            gallery: [item.image], // Convert single image to gallery array
            colorName: "Mặc định" // Default color for wishlist items
        });
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
                        <WishlistHeading>Danh Sách Yêu Thích Trống</WishlistHeading>
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
                            <WishlistHeading className="mb-2">Danh Sách Yêu Thích</WishlistHeading>
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
                                        <Trash2 className="w-5 h-5 text-gray-900 dark:text-white" />
                                    </button>
                                </div>

                                {/* Details */}
                                <div className="p-6">
                                    <ProductName href={`/cars/${item.slug}`}>
                                        {item.name}
                                    </ProductName>
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
                                        <ViewButton href={`/cars/${item.slug}`}>
                                            Xem
                                        </ViewButton>
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
