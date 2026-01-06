"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AccountPage() {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <main className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center">
                <div className="text-gray-900 dark:text-white text-lg">Đang tải...</div>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Tài Khoản Của Tôi</h1>
                    <p className="text-muted-foreground">
                        Xin chào, <span className="text-gray-900 dark:text-white font-bold">{user.username}</span>!
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card/50 border border-white/5 rounded-2xl p-6 space-y-2">
                            <Link
                                href="/account"
                                className="block px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold"
                            >
                                Tổng Quan
                            </Link>
                            <Link
                                href="/account/requests"
                                className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-900 dark:text-white transition-colors"
                            >
                                Lịch Sử Yêu Cầu
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
                            >
                                Đăng Xuất
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* User Info */}
                        <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông Tin Cá Nhân</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Tên Người Dùng</div>
                                    <div className="text-gray-900 dark:text-white font-bold">{user.username}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                                    <div className="text-gray-900 dark:text-white font-bold">{user.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hành Động Nhanh</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Link
                                    href="/lai-thu"
                                    className="p-4 border border-white/10 rounded-xl hover:border-primary/50 transition-colors"
                                >
                                    <div className="text-3xl mb-2">🚗</div>
                                    <div className="font-bold text-gray-900 dark:text-white mb-1">Đăng Ký Lái Thử</div>
                                    <div className="text-sm text-muted-foreground">Trải nghiệm xe điện miễn phí</div>
                                </Link>
                                <Link
                                    href="/cars"
                                    className="p-4 border border-white/10 rounded-xl hover:border-primary/50 transition-colors"
                                >
                                    <div className="text-3xl mb-2">🔍</div>
                                    <div className="font-bold text-gray-900 dark:text-white mb-1">Xem Sản Phẩm</div>
                                    <div className="text-sm text-muted-foreground">Khám phá các mẫu xe mới</div>
                                </Link>
                                <Link
                                    href="/account/requests"
                                    className="p-4 border border-white/10 rounded-xl hover:border-primary/50 transition-colors"
                                >
                                    <div className="text-3xl mb-2">📋</div>
                                    <div className="font-bold text-gray-900 dark:text-white mb-1">Lịch Sử Yêu Cầu</div>
                                    <div className="text-sm text-muted-foreground">Theo dõi yêu cầu đã gửi</div>
                                </Link>
                                <Link
                                    href="/contact"
                                    className="p-4 border border-white/10 rounded-xl hover:border-primary/50 transition-colors"
                                >
                                    <div className="text-3xl mb-2">💬</div>
                                    <div className="font-bold text-gray-900 dark:text-white mb-1">Liên Hệ</div>
                                    <div className="text-sm text-muted-foreground">Gửi câu hỏi cho chúng tôi</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
