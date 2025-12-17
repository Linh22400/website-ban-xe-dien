"use client";

import Link from "next/link";
import {
    TrendingUp,
    ShoppingCart,
    Package,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAdminOrders } from "@/lib/order-api";
import { getProductsCount, getUsers } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import DashboardCharts from "@/components/admin/DashboardCharts";

export default function AdminDashboardPage() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);

    // Stats State
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);

    // Data State
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [allOrders, setAllOrders] = useState<any[]>([]);

    useEffect(() => {
        async function fetchDashboardData() {
            if (token) {
                try {
                    setLoading(true);

                    // 1. Fetch Orders (Get last 100 for calculating recent trends/revenue approx)
                    // Note: For accurate total revenue, a dedicated aggregation API endpoint is better, 
                    // but for MVP we sum up the recent/all fetched orders locally or use meta total if available.
                    const ordersRes = await getAdminOrders(token, { pageSize: 100 });
                    const orders = ordersRes.data;

                    // Calculate Total Revenue (Simple sum of fetched orders for now)
                    const revenue = orders.reduce((sum, order) => sum + (order.TotalAmount || 0), 0);
                    setTotalRevenue(revenue);
                    setTotalOrders(ordersRes.meta?.pagination?.total || 0);
                    setRecentOrders(orders.slice(0, 5)); // Top 5
                    setAllOrders(orders); // Store all for charts

                    // 2. Fetch Products Count
                    const productsCount = await getProductsCount();
                    setTotalProducts(productsCount);

                    // 3. Fetch Users (Customers)
                    const users = await getUsers(token);
                    setTotalCustomers(users.length);

                } catch (error) {
                    console.error("Failed to fetch dashboard data", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchDashboardData();
    }, [token]);

    const STATS = [
        {
            title: "Doanh Thu (100 đơn gần nhất)",
            value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue),
            change: "Cập nhật", // Placeholder for trend
            trend: "up",
            icon: TrendingUp,
            color: "text-green-400",
            bg: "bg-green-400/10"
        },
        {
            title: "Tổng Đơn Hàng",
            value: totalOrders.toString(),
            change: "Tất cả",
            trend: "up",
            icon: ShoppingCart,
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            title: "Sản Phẩm Tồn Kho",
            value: totalProducts.toString(),
            change: "Hiện có",
            trend: "up",
            icon: Package,
            color: "text-orange-400",
            bg: "bg-orange-400/10"
        },
        {
            title: "Khách Hàng",
            value: totalCustomers.toString(),
            change: "Đã đăng ký",
            trend: "up",
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        }
    ];

    if (loading) {
        return <div className="text-white">Đang tải dữ liệu tổng quan...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Tổng Quan</h1>
                <p className="text-muted-foreground">Chào mừng trở lại! Dưới đây là tình hình kinh doanh hiện tại.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-card border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm text-muted-foreground">{stat.title}</h3>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Analytics Charts */}
            <DashboardCharts orders={allOrders} />

            {/* Recent Table */}
            <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Đơn Hàng Gần Đây</h2>
                    <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                        Xem tất cả
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="p-4">Khách Hàng</th>
                                <th className="p-4">Tổng Tiền</th>
                                <th className="p-4">Trạng Thái</th>
                                <th className="p-4">Thời Gian</th>
                                <th className="p-4 text-right">Chi Tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold text-white">
                                            {order.CustomerInfo?.Name || "Khách lẻ"}
                                            <div className="text-xs text-muted-foreground font-normal">
                                                {order.OrderCode}
                                            </div>
                                        </td>
                                        <td className="p-4 text-white">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TotalAmount)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.Statuses === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                order.Statuses === 'deposit_paid' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    order.Statuses === 'processing' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                        order.Statuses === 'ready_for_pickup' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                            order.Statuses === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {order.Statuses === 'pending_payment' ? 'Chờ thanh toán' :
                                                    order.Statuses === 'deposit_paid' ? 'Đã cọc' :
                                                        order.Statuses === 'processing' ? 'Đang xử lý' :
                                                            order.Statuses === 'ready_for_pickup' ? 'Sẵn sàng giao' :
                                                                order.Statuses === 'completed' ? 'Hoàn thành' :
                                                                    order.Statuses === 'cancelled' ? 'Đã hủy' : order.Statuses}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            <br />
                                            {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.documentId}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-primary hover:text-black transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        Chưa có đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
