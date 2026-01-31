"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Mail,
    Phone,
    Calendar,
    User,
    MessageSquare,
    Car,
    DollarSign,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { getAdminLeads } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    type: string;
    message?: string;
    model?: string;
    createdAt: string;
    user?: any;
}

export default function AdminLeadsPage() {
    const { token } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    useEffect(() => {
        async function fetchLeads() {
            if (token) {
                try {
                    setLoading(true);
                    const { data, meta } = await getAdminLeads(token, {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                        search: searchTerm,
                        type: filterType
                    });
                    
                    setLeads(data);
                    
                    if (meta && meta.pagination) {
                        setPagination(prev => ({
                            ...prev,
                            pageCount: meta.pagination.pageCount,
                            total: meta.pagination.total
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch leads", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchLeads();
        }, 300);
        
        return () => clearTimeout(timeoutId);
    }, [token, pagination.page, pagination.pageSize, searchTerm, filterType]);

    // Handle Page Change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.pageCount) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    // Reset page when filters change
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [searchTerm, filterType]);

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'test-drive':
            case 'test_drive': // Handle both cases
                return <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Car className="w-3 h-3" /> Lái Thử</span>;
            case 'contact':
                return <span className="px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><MessageSquare className="w-3 h-3" /> Liên Hệ</span>;
            case 'quote':
                return <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><MessageSquare className="w-3 h-3" /> Báo Giá</span>;
            case 'consultation':
                return <span className="px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><DollarSign className="w-3 h-3" /> Trả Góp</span>;
            default:
                return <span className="px-2 py-1 bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20 rounded-full text-xs font-bold w-fit">{type}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Yêu Cầu Khách Hàng (Leads)</h1>
                <p className="text-muted-foreground">Danh sách khách hàng đăng ký lái thử và liên hệ tư vấn.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm tên, email, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-card/50 hover:bg-muted/50 text-foreground rounded-xl border border-border focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer min-w-[180px]"
                    >
                        <option value="all">Tất cả loại hình</option>
                        <option value="test-drive">Đăng Ký Lái Thử</option>
                        <option value="contact">Liên Hệ Tư Vấn</option>
                        <option value="quote">Yêu Cầu Báo Giá</option>
                        <option value="consultation">Tư Vấn Trả Góp</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 pl-6 font-bold">Khách Hàng</th>
                                <th className="p-4 font-bold">Loại Yêu Cầu</th>
                                <th className="p-4 font-bold">Nội Dung / Xe Quan Tâm</th>
                                <th className="p-4 font-bold">Ngày Gửi</th>
                                <th className="p-4 font-bold text-right pr-6">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</td>
                                </tr>
                            ) : leads.length > 0 ? (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-foreground">{lead.name}</div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Phone className="w-3 h-3" />
                                                <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">{lead.phone}</a>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">{lead.email}</a>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {getTypeBadge(lead.type)}
                                        </td>
                                        <td className="p-4">
                                            {lead.model && (
                                                <div className="mb-1 text-primary font-medium text-sm">
                                                    Quan tâm: {lead.model}
                                                </div>
                                            )}
                                            {lead.message && (
                                                <div className="text-sm text-muted-foreground line-clamp-2" title={lead.message}>
                                                    {lead.message}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-colors text-xs"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                Gọi Ngay
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Không tìm thấy yêu cầu nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <div>Hiển thị {leads.length} trên tổng số {pagination.total} kết quả</div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="px-3 py-1 bg-card border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded flex items-center">
                            {pagination.page} / {pagination.pageCount}
                        </span>
                        <button 
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.pageCount}
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
