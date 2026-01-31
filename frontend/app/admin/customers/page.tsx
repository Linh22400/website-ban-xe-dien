"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    User,
    Shield,
    Mail,
    Phone,
    ShoppingBag
} from "lucide-react";

import { getUsers } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

// Local Interface extending API User
interface Customer {
    id: number;
    username: string;
    email: string;
    blocked: boolean;
    createdAt: string;
    role: string;
    phone?: string;
    orders?: number;
    totalSpent?: number;
}

export default function AdminCustomersPage() {
    const { token } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
        pageCount: 1,
        total: 0
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    useEffect(() => {
        async function fetchUsers() {
            if (token) {
                try {
                    setLoading(true);
                    // Server-side pagination and search
                    const { data, meta } = await getUsers(token, {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                        search: searchTerm
                    });
                    
                    // Map API users to Customer interface with placeholders
                    const mappedUsers = data.map((u: any) => ({
                        id: u.id, // Ensure ID is number
                        username: u.username,
                        email: u.email,
                        blocked: u.blocked,
                        createdAt: new Date(u.createdAt).toLocaleDateString('vi-VN'),
                        role: u.role || 'customer',
                        phone: 'Chưa cập nhật',
                        orders: 0,
                        totalSpent: 0
                    }));
                    setCustomers(mappedUsers);
                    
                    if (meta && meta.pagination) {
                        setPagination(prev => ({
                            ...prev,
                            page: meta.pagination.page,
                            pageSize: meta.pagination.pageSize,
                            pageCount: meta.pagination.pageCount,
                            total: meta.pagination.total
                        }));
                    }
                } catch (error) {
                    console.error("Failed to load users", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [token, pagination.page, pagination.pageSize, searchTerm]);

    // Client-side filter for Role (only applies to current page data)
    // Note: Ideally role filtering should be server-side, but standard Strapi Users API 
    // requires complex filtering for relations which might not be enabled by default.
    // We prioritize pagination and search for now.
    const filteredCustomers = customers.filter(customer => {
        const matchesRole = filterRole === "all" || customer.role.toLowerCase().includes(filterRole);
        return matchesRole;
    });

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pageCount) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };
    
    // Reset page when search changes
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [searchTerm]);

    const getRoleBadge = (role: string) => {
        const lowerRole = role.toLowerCase();
        if (lowerRole.includes('admin')) {
            return <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Shield className="w-3 h-3" /> Admin</span>;
        } else if (lowerRole.includes('staff') || lowerRole.includes('editor')) {
            return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><User className="w-3 h-3" /> Staff</span>;
        } else {
            return <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold w-fit">Khách Hàng</span>;
        }
    };

    if (loading && customers.length === 0) {
        return <div className="text-foreground">Đang tải danh sách khách hàng...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Khách Hàng</h1>
                    <p className="text-muted-foreground">Xem danh sách người dùng và phân quyền nhân viên.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm tên đăng nhập, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="pl-10 pr-8 py-3 bg-muted/50 hover:bg-muted/70 text-foreground rounded-xl border border-border focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[150px]"
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="customer">Khách hàng</option>
                            <option value="staff">Nhân viên</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold">Người Dùng</th>
                                <th className="p-4 font-bold">Email / Liên Hệ</th>
                                <th className="p-4 font-bold">Vai Trò</th>
                                <th className="p-4 font-bold">Trạng Thái</th>
                                {/* <th className="p-4 font-bold text-right pr-6">Hành Động</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-border">
                                                    <span className="font-bold">{(customer.username || 'U').charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">{customer.username}</div>
                                                    <div className="text-xs text-muted-foreground">Tham gia: {customer.createdAt}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-muted-foreground" />
                                                {customer.email}
                                            </div>
                                            {/* Phone placeholder until field added to Strapi */}
                                        </td>
                                        <td className="p-4">
                                            {getRoleBadge(customer.role)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${customer.blocked
                                                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                : 'bg-green-500/10 text-green-600 dark:text-green-400'}`}>
                                                {customer.blocked ? 'Đã chặn' : 'Hoạt động'}
                                            </span>
                                        </td>
                                        {/* Actions removed for MVP safe mode until permission handling refined */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        {loading ? 'Đang tải...' : 'Không tìm thấy khách hàng nào phù hợp.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <div>Hiển thị {customers.length} trên tổng số {pagination.total} kết quả</div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1 || loading}
                            className="px-3 py-1 bg-card border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded flex items-center">
                            {pagination.page} / {pagination.pageCount}
                        </span>
                        <button 
                            onClick={() => handlePageChange(pagination.page + 1)}
                            // Disable Next if we received fewer items than pageSize, meaning we reached end
                            disabled={pagination.page >= pagination.pageCount || loading}
                            className="px-3 py-1 bg-card border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
