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
                    setTotalCustomers(users.meta?.pagination?.total || 0);

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
        return <div className="text-muted-foreground">Đang tải dữ liệu tổng quan...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Tổng Quan</h1>
                    <p className="text-muted-foreground">Chào mừng trở lại, Administrator!</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-foreground">Hệ thống hoạt động ổn định</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, index) => (
                    <div key={index} className="bg-card border border-border p-6 rounded-3xl hover:border-primary/50 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Area - Full Width for better visibility */}
            <div className="w-full">
                <DashboardCharts orders={allOrders} />
            </div>

            {/* Recent Orders */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">Đơn Hàng Gần Đây</h2>
                    <Link href="/admin/orders" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                        Xem tất cả <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-card/50 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    <th className="px-6 py-4">Mã đơn</th>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Sản phẩm</th>
                                    <th className="px-6 py-4">Tổng tiền</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-sm font-bold text-foreground">#{order.OrderCode}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground">{order.CustomerInfo?.Name || 'Khách lẻ'}</span>
                                                    <span className="text-xs text-muted-foreground">{order.CustomerInfo?.Phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-foreground">{order.Items?.[0]?.Model?.Name || 'Sản phẩm'}</span>
                                            {order.Items && order.Items.length > 1 && (
                                                <span className="text-xs text-muted-foreground ml-1">+{order.Items.length - 1} khác</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-emerald-500">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TotalAmount || 0)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${order.Statuses === 'completed'
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    : order.Statuses === 'pending' || order.Statuses === 'pending_payment'
                                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                        : order.Statuses === 'cancelled'
                                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {order.Statuses === 'pending_payment' ? 'Chờ thanh toán' :
                                                    order.Statuses === 'deposit_paid' ? 'Đã cọc' :
                                                        order.Statuses === 'pending' ? 'Chờ xử lý' : order.Statuses}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link href={`/admin/orders/${order.documentId}`} className="p-2 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-colors inline-block">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
