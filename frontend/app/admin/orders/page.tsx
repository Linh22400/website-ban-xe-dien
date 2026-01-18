"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Eye,
    ArrowUpDown,
    CheckCircle,
    XCircle,
    Clock,
    Truck,
    Download,
    Package
} from "lucide-react";
import Link from "next/link";
import { getAdminOrders } from "@/lib/order-api";
import { useAuth } from "@/lib/auth-context";
import { Order } from "@/types/order";

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { color: string, icon: any, label: string }> = {
        // Backend Enums
        pending_payment: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock, label: "Chờ TT" },
        deposit_paid: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: CheckCircle, label: "Đã Cọc" },
        processing: { color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: Clock, label: "Đang Xử Lý" },
        ready_for_pickup: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Package, label: "Chờ Lấy" },
        completed: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle, label: "Hoàn Thành" },
        cancelled: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle, label: "Đã Hủy" },
        refunded: { color: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: ArrowUpDown, label: "Hoàn Tiền" },

        // Legacy Mocks support (optional)
        pending: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock, label: "Chờ Xử Lý" },
        confirmed: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: CheckCircle, label: "Đã Xác Nhận" },
        shipping: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Truck, label: "Đang Giao" },
    };

    const config = statusConfig[status] || { color: "bg-gray-500/10 text-gray-400", icon: Clock, label: status };
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};

export default function AdminOrdersPage() {
    const { user, token: authToken } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtering State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Fetch Orders
    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            try {
                // Use real token if available, otherwise try public access (empty string)
                const token = authToken || "";
                const { data } = await getAdminOrders(token, {
                    status: filterStatus,
                    search: searchTerm
                });
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        }

        // Debounce search slightly
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filterStatus, searchTerm]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Đơn Hàng</h1>
                    <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng từ khách hàng.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Xuất Excel
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn, tên, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none bg-card/50 border border-border rounded-xl pl-10 pr-10 py-3 text-foreground focus:outline-none focus:border-primary transition-colors h-full cursor-pointer min-w-[180px]"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending_payment">Chờ Thanh Toán</option>
                        <option value="processing">Đang Xử Lý</option>
                        <option value="ready_for_pickup">Chờ Lấy Hàng</option>
                        <option value="completed">Hoàn Thành</option>
                        <option value="cancelled">Đã Hủy</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 font-bold">Mã Đơn <ArrowUpDown className="w-3 h-3 inline ml-1 opacity-50" /></th>
                                <th className="p-4 font-bold">Khách Hàng</th>
                                <th className="p-4 font-bold">Ngày Đặt</th>
                                <th className="p-4 font-bold">Sản Phẩm</th>
                                <th className="p-4 font-bold">Tổng Tiền</th>
                                <th className="p-4 font-bold">Trạng Thái</th>
                                <th className="p-4 font-bold text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="p-4 font-mono font-bold text-primary">
                                            {order.OrderCode}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-foreground">{order.CustomerInfo?.FullName}</div>
                                            <div className="text-xs text-muted-foreground">{order.CustomerInfo?.Phone}</div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {order.VehicleModel?.name || 'Sản phẩm'}
                                        </td>
                                        <td className="p-4 font-bold text-foreground">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TotalAmount)}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={order.Statuses} />
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.documentId}`} // Use documentId for V5
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static for now) */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-muted-foreground">
                    <div>Hiển thị {orders.length} kết quả</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Trước</button>
                        <button className="px-3 py-1 bg-primary text-black font-bold rounded">1</button>
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10" disabled>Sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
