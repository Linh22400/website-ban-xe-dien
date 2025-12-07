"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-background pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center py-20">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Giỏ Hàng Trống</h1>
                        <p className="text-muted-foreground mb-8">
                            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời!
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
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Giỏ Hàng Của Bạn</h1>
                        <p className="text-muted-foreground">
                            {itemCount} sản phẩm trong giỏ hàng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-card border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                                >
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <div className="relative w-24 h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <Link
                                                href={`/cars/${item.slug}`}
                                                className="text-lg font-bold text-white hover:text-primary transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-primary font-bold text-xl mt-2">
                                                {item.price.toLocaleString("vi-VN")} VNĐ
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-white/10 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4 text-white" />
                                                    </button>
                                                    <span className="px-4 text-white font-bold">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-white/10 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground mb-1">Tổng</p>
                                            <p className="text-xl font-bold text-white">
                                                {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Clear Cart */}
                            <button
                                onClick={clearCart}
                                className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors"
                            >
                                Xóa Tất Cả
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-card border border-white/10 rounded-xl p-6 sticky top-32">
                                <h2 className="text-xl font-bold text-white mb-6">Tổng Đơn Hàng</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tạm tính</span>
                                        <span>{total.toLocaleString("vi-VN")} VNĐ</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-primary">Miễn phí</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-lg">
                                        <span>Tổng cộng</span>
                                        <span className="text-primary">{total.toLocaleString("vi-VN")} VNĐ</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-black font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all mb-4"
                                >
                                    Tiến Hành Thanh Toán
                                </Link>

                                <Link
                                    href="/cars"
                                    className="block w-full text-center px-6 py-3 border-2 border-white/10 text-white font-semibold rounded-full hover:border-primary hover:text-primary transition-all"
                                >
                                    Tiếp Tục Mua Hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
