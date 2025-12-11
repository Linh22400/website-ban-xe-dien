"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserLeads } from "@/lib/api";

export default function RequestsPage() {
    const { user, isAuthenticated, loading: authLoading, logout, token } = useAuth();
    const router = useRouter();
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (token) {
            getUserLeads(token).then((data) => {
                setLeads(data);
                setLoading(false);
            });
        }
    }, [token]);

    if (authLoading || loading) {
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
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Lịch Sử Yêu Cầu</h1>
                    <p className="text-muted-foreground">
                        Danh sách tất cả yêu cầu bạn đã gửi
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 space-y-2">
                            <Link
                                href="/account"
                                className="block px-4 py-3 rounded-xl hover:bg-white/5 text-gray-900 dark:text-white transition-colors"
                            >
                                Tổng Quan
                            </Link>
                            <Link
                                href="/account/requests"
                                className="block px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold"
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
                    <div className="lg:col-span-2">
                        <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Danh Sách Yêu Cầu ({leads.length})
                            </h2>

                            {leads.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-4">📋</div>
                                    <p className="text-muted-foreground mb-6">
                                        Bạn chưa gửi yêu cầu nào.
                                    </p>
                                    <Link
                                        href="/lai-thu"
                                        className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-all"
                                    >
                                        Đăng Ký Lái Thử Ngay
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {leads.map((lead: any) => {
                                        const createdDate = new Date(lead.createdAt || lead.publishedAt);
                                        return (
                                            <div
                                                key={lead.id}
                                                className="p-4 border border-white/10 rounded-xl hover:border-primary/30 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="text-gray-900 dark:text-white font-bold mb-1">
                                                            {lead.type === 'test-drive' ? '🚗 Lái Thử' : '💬 Liên Hệ'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {createdDate.toLocaleDateString('vi-VN')}
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-bold rounded-full">
                                                        Đang xử lý
                                                    </span>
                                                </div>
                                                {lead.model && (
                                                    <div className="text-sm text-muted-foreground mb-2">
                                                        <span className="text-gray-900 dark:text-white font-bold">Mẫu xe:</span> {lead.model}
                                                    </div>
                                                )}
                                                {lead.message && (
                                                    <div className="text-sm text-muted-foreground">
                                                        <span className="text-gray-900 dark:text-white font-bold">Ghi chú:</span>
                                                        <div className="mt-1 line-clamp-2">{lead.message}</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
